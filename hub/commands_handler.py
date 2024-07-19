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
    try:
        lock.acquire()
        match command.command:
            case "RELOAD_CONFIG":
                pass
            case "FILL_WATER":
                global water_voltage
                water_level_target = float(command.value)
                print("filling_water")
                client.publish(
                    BASE_STATION_CHANNEL,
                    json.dumps(
                        dataclasses.asdict(
                            ControllerCommand(actionner="WATERPUMP", command="ACTIVATE")
                        )
                    ),
                    2,
                )
                try:
                    print(
                        float(general_config["WATER_OFFSET_L"])
                        + float(general_config["WATER_VOLT_TO_L_CONVERSION"])
                        * float(water_voltage)
                    )
                except Exception as e:
                    print("issue" + str(e))
                current_value = (
                    float(general_config["WATER_OFFSET_L"])
                    + float(general_config["WATER_VOLT_TO_L_CONVERSION"])
                    * water_voltage
                )
                while current_value < water_level_target:
                    current_value = (
                        float(general_config["WATER_OFFSET_L"])
                        + float(general_config["WATER_VOLT_TO_L_CONVERSION"])
                        * water_voltage
                    )
                    print("lel")
                    print(f"CURRENT : {current_value} TARGET: {water_level_target}")
                client.publish(
                    BASE_STATION_CHANNEL,
                    json.dumps(
                        dataclasses.asdict(
                            ControllerCommand(
                                actionner="WATERPUMP", command="DESACTIVATE"
                            )
                        )
                    ),
                    2,
                )
                print("done")
            case "DOSE":
                print("dosing")
                client.publish(
                    BASE_STATION_CHANNEL,
                    json.dumps(
                        dataclasses.asdict(
                            ControllerCommand(
                                actionner="DOSINGPUMP" + command.action,
                                command="ACTIVATE",
                            )
                        )
                    ),
                    2,
                )
                print("dosing..")
                time.sleep(int(general_config["DOSING_TIME"]) * int(command.value))
                print("dosine..done")
                client.publish(
                    BASE_STATION_CHANNEL,
                    json.dumps(
                        dataclasses.asdict(
                            ControllerCommand(
                                actionner="DOSINGPUMP1", command="DESACTIVATE"
                            )
                        )
                    ),
                    2,
                )
                print("done")
            case "MIX":
                print("mix")
                client.publish(
                    BASE_STATION_CHANNEL,
                    json.dumps(
                        dataclasses.asdict(
                            ControllerCommand(
                                actionner="MIXINGPUMP", command="ACTIVATE"
                            )
                        )
                    ),
                    2,
                )
                print("mixing ..")
                time.sleep(int(command.value) * 60)
                print("mixing..done")
                client.publish(
                    BASE_STATION_CHANNEL,
                    json.dumps(
                        dataclasses.asdict(
                            ControllerCommand(
                                actionner="MIXINGPUMP", command="DESACTIVATE"
                            )
                        )
                    ),
                    2,
                )
                print("mixing done")
            case "ROUTE":
                print("routing")
                routes = find_zone(command.action)
                print(routes)
                for src, _ in routes:

                    client.publish(
                        src,
                        json.dumps(
                            dataclasses.asdict(
                                ControllerCommand(
                                    actionner="ROUTE", command="ACTIVATE-VALVE"
                                )
                            )
                        ),
                        2,
                    )
                for src, _ in routes:
                    client.publish(
                        src,
                        json.dumps(
                            dataclasses.asdict(
                                ControllerCommand(
                                    actionner="ROUTE", command="ACTIVATE-PUMP"
                                )
                            )
                        ),
                        2,
                    )
                time.sleep(int(command.value) * 60)
                for src, _ in routes:
                    client.publish(
                        src,
                        json.dumps(
                            dataclasses.asdict(
                                ControllerCommand(
                                    actionner="ROUTE", command="DEACTIVATE-PUMP"
                                )
                            )
                        ),
                        2,
                    )
                client.publish(
                    "base_station",
                    json.dumps(
                        dataclasses.asdict(
                            ControllerCommand(
                                actionner="ROUTE", command="ACTIVATE-COMPRESSOR"
                            )
                        )
                    ),
                    2,
                )
                time.sleep(int(command.value) * 60)
                client.publish(
                    "base_station",
                    json.dumps(
                        dataclasses.asdict(
                            ControllerCommand(
                                actionner="ROUTE", command="DEACTIVATE-COMPRESSOR"
                            )
                        )
                    ),
                    2,
                )
                for src, _ in routes:
                    client.publish(
                        src,
                        json.dumps(
                            dataclasses.asdict(
                                ControllerCommand(
                                    actionner="ROUTE", command="DEACTIVATE-VALVE"
                                )
                            )
                        ),
                        2,
                    )
            case _:
                pass
    except Exception as e:
        print("issue" + str(e))
    finally:
        lock.release()
