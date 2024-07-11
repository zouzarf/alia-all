from controllers.base_station import BaseStation
from mqtt_config import client
import json
from pydantic.dataclasses import dataclass
import sqlalchemy as db
from data_model import BaseStationConfig
from sqlalchemy.orm import sessionmaker
from Phidget22.Devices.Log import *
from Phidget22.LogLevel import *
from paho.mqtt.client import MQTTMessage

Log.enable(LogLevel.PHIDGET_LOG_INFO, "/base_station/file.log")

engine = db.create_engine(
    "postgresql://postgres:mysecretpassword@localhost:5432/postgres"
)
Session = sessionmaker(bind=engine)
session = Session()


config = session.query(BaseStationConfig).all()

MQTT_SERVER_IP = "127.0.0.1"
base_station = BaseStation(config)


@dataclass
class ControllerCommand:
    actionner: str
    command: str


def on_message(mosq, obj, message: MQTTMessage):

    command_message = ControllerCommand(**json.loads(message.payload.decode()))

    # TODO: FINISH ALL ACTIONS
    match command_message.actionner:
        case "RELOAD_CONFIG":
            global base_station
            config = session.query(BaseStationConfig).all()
            base_station = BaseStation(config)
        case _:
            if command_message.command == "ACTIVATE":
                base_station.actionners[command_message.actionner].enable()
            else:
                base_station.actionners[command_message.actionner].disable()


def on_connect(client, userdata, flags, rc):
    print("-- base station -- Connected with result code " + str(rc))
    client.subscribe("base_station")


def main() -> None:

    client.on_message = on_message
    client.on_connect = on_connect
    client.connect(MQTT_SERVER_IP)
    client.loop_forever()


if __name__ == "__main__":
    main()
