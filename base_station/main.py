from controllers.base_station import BaseStation
from mqtt_config import client
from prisma.models import base_station_ports
import prisma
import json
from pydantic.dataclasses import dataclass

MQTT_SERVER_IP = "127.0.01"
prisma.register(prisma.Prisma())
t = base_station_ports.prisma().find_many()
base_station = BaseStation(t)


@dataclass
class ControllerCommand:
    actionner: str
    command: str


def on_message(mosq, obj, message):

    command_message = ControllerCommand(**json.loads(message))

    # TODO: FINISH ALL ACTIONS
    match command_message.actionner:
        case "WATERPUMP":
            if command_message.command == "ACTIVATE":
                base_station.water_pump.enable_water_sucking()
            else:
                base_station.water_pump.disable_water_sucking()
        case _:
            pass


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
