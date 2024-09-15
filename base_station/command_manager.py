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


class CommandManager:
    def __init__(self):
        self.load_config()

    def load_config(self):
        config = session.query(BaseStationConfig).all()
        self.base_station = BaseStation(config)

    def run(self, message: MQTTMessage):
        try:
            command_message = ControllerCommand(**json.loads(message.payload.decode()))
            match command_message.actionner:
                case "RELOAD_CONFIG":

                    self.load_config()
                case _:
                    if command_message.command == "ACTIVATE":
                        self.base_station.actionners[command_message.actionner].enable()
                    else:
                        self.base_station.actionners[
                            command_message.actionner
                        ].disable()
        except Exception as e:
            logging.error("Error while executing command")
            logging.error(str(e))
            for x in traceback.format_exc().splitlines():
                logging.error(str(x))
            raise e
