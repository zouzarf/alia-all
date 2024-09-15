import json
import traceback
from paho.mqtt.client import MQTTMessage
from pydantic.dataclasses import dataclass
from logger import logger as logging
from controllers.base_station import BaseStation
from db import BaseStationConfig, session


@dataclass
class ControllerCommand:
    actionner: str
    command: str
    arg1: str


class CommandManager:
    def __init__(self):
        self.load_config()

    def load_config(self):
        logging.info("Loading config")
        config = session.query(BaseStationConfig).all()
        self.base_station = BaseStation(config)

    def run(self, message: MQTTMessage):
        try:
            command_message = ControllerCommand(**json.loads(message.payload.decode()))
            match command_message.actionner:
                case "RELOAD_CONFIG":
                    logging.info("Reloading config ...")
                    self.base_station.close()
                    self.load_config()
                case _:
                    if command_message.command == "ACTIVATE":
                        logging.info(f"Activating {command_message.actionner} ...")
                        self.base_station.actionners[command_message.actionner].enable()
                        logging.info(f"Activated {command_message.actionner} ...")
                    else:
                        logging.info(f"Deactivating {command_message.actionner} ...")
                        self.base_station.actionners[
                            command_message.actionner
                        ].disable()
                        logging.info(f"Deactivated {command_message.actionner} ...")
        except Exception as e:
            logging.error("Error while executing command")
            logging.error(str(e))
            for x in traceback.format_exc().splitlines():
                logging.error(str(x))
            raise e
