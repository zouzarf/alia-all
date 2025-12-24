import traceback
from controllers.routing_station import RoutingStation
from pydantic.dataclasses import dataclass
from db import session, RoutersConfig, RoutingConfig
from logger import logger as logging


@dataclass
class RoutingCommand:
    actionner: str
    command: str
    arg1: str


class CommandHandler:
    def __init__(self, serial_number):
        self.serial_number = serial_number
        self.load_config()

    def load_config(self):
        routing_config = session.query(RoutingConfig).all()
        router_config = (
            session.query(RoutersConfig)
            .where(RoutersConfig.serial_number == str(self.serial_number))
            .one()
        )
        self.routing_station = RoutingStation(
            routes_config=routing_config, router_config=router_config
        )

    def run(self, command_message: RoutingCommand):
        logging.info(f"Executing command: {command_message.command}")
        try:
            match command_message.actionner:
                case "RELOAD_CONFIG":
                    logging.info("Reloading config ...")
                    self.routing_station.close()
                    self.load_config()
                case "ROUTINGVALVE":
                    if command_message.command == "ACTIVATE":
                        logging.info(
                            f"Enabling routing valve to {command_message.arg1}..."
                        )
                        self.routing_station.open_route(command_message.arg1)
                        logging.info("Routing valve enabled")
                    else:
                        logging.info(
                            f"Disabling routing valve to {command_message.arg1}..."
                        )
                        self.routing_station.close_route(command_message.arg1)
                        logging.info("Routing valve disabled")
                case _:
                    logging.error("Command" + command_message.command + "Not found")
        except Exception as e:
            logging.error("Error while executing command")
            logging.error(str(e))
            for x in traceback.format_exc().splitlines():
                logging.error(str(x))
            raise e
