import dataclasses
import json
import threading
from base_command import ControllerCommand
from config import BASE_STATION_CHANNEL, WATER_SENSOR_CHANNEL
from hub_command import HubCommand
from mqtt_config import client
from db import general_config, routing_config
from routing import find_zone
from water import water_voltage
import time
from paho.mqtt.client import MQTTMessage

lock = threading.Lock()
water_voltage = -1


def mqtt_message_handler(message: MQTTMessage):
    match message.topic:
        case str(x) if x == WATER_SENSOR_CHANNEL:
            global water_voltage
            water_voltage = float(message.payload.decode())
            print(water_voltage)

        case str(x) if x == "hub":
            print("acion")
            command_handler(HubCommand(**json.loads(message.payload)))


def command_handler(command: HubCommand):
    global general_config

    global client
    match command.command:
        case "RELOAD_CONFIG":
            pass
        case "FILL_WATER":
            global water_voltage
            water_level_target = float(command.value)
            print("fillwing_water")
            client.publish(
                BASE_STATION_CHANNEL,
                json.dumps(
                    dataclasses.asdict(
                        ControllerCommand(actionner="WATERPUMP", command="ACTIVATE")
                    )
                ),
                2,
            )
            while (
                float(general_config["RESERVOIR_OFFSET_LITTERS"])
                + float(general_config["RESERVOIR_CONVERSION_TO_LITTER"])
                * water_voltage
            ) < water_level_target:
                pass
            client.publish(
                BASE_STATION_CHANNEL,
                json.dumps(
                    dataclasses.asdict(
                        ControllerCommand(actionner="WATERPUMP", command="DESACTIVATE")
                    )
                ),
                2,
            )
            print("done")
        case "DOSE":
            client.publish(
                BASE_STATION_CHANNEL,
                json.dumps(
                    dataclasses.asdict(
                        ControllerCommand(actionner="DOSE", command="ACTIVATE")
                    )
                ),
                2,
            )
            time.sleep(1)
            client.publish(
                BASE_STATION_CHANNEL,
                json.dumps(
                    dataclasses.asdict(
                        ControllerCommand(actionner="DOSE", command="DESACTIVATE")
                    )
                ),
                2,
            )
        case "MIX":
            client.publish(
                BASE_STATION_CHANNEL,
                json.dumps(
                    dataclasses.asdict(
                        ControllerCommand(actionner="MIX", command="ACTIVATE")
                    )
                ),
                2,
            )
            time.sleep(1)
            client.publish(
                BASE_STATION_CHANNEL,
                json.dumps(
                    dataclasses.asdict(
                        ControllerCommand(actionner="MIX", command="DESACTIVATE")
                    )
                ),
                2,
            )
        case "ROUTE":
            routes = find_zone(command.value)
            for route in routes:
                client.publish(
                    route,
                    json.dumps(
                        dataclasses.asdict(
                            ControllerCommand(actionner="ROUTE", command="ACTIVATE")
                        )
                    ),
                    2,
                )
            time.sleep(1)
            for route in routes:
                client.publish(
                    route,
                    json.dumps(
                        dataclasses.asdict(
                            ControllerCommand(actionner="ROUTE", command="DESACCTIVATE")
                        )
                    ),
                    2,
                )
        case _:
            pass
