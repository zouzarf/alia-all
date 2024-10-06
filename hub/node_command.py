import dataclasses
import json
from config import BASE_STATION_CHANNEL, WATER_SENSOR_CHANNEL
from logger import logger as logging
from dataclasses import dataclass


@dataclass
class ControllerCommand:
    actionner: str
    command: str
    arg1: str


class NodeCommand:

    def __init__(self, mqtt_client):
        self.mqtt_client = mqtt_client

    def reload_config(self, channel):
        self.mqtt_client.publish(
            channel,
            json.dumps(
                dataclasses.asdict(
                    ControllerCommand(
                        actionner="RELOAD_CONFIG", command="ACTIVATE", arg1=""
                    )
                )
            ),
            2,
        )

    def enable_water_pump(self):
        self.mqtt_client.publish(
            BASE_STATION_CHANNEL,
            json.dumps(
                dataclasses.asdict(
                    ControllerCommand(
                        actionner="WATERPUMP", command="ACTIVATE", arg1=""
                    )
                )
            ),
            2,
        )

    def disable_water_pump(self):
        self.mqtt_client.publish(
            BASE_STATION_CHANNEL,
            json.dumps(
                dataclasses.asdict(
                    ControllerCommand(
                        actionner="WATERPUMP", command="DESACTIVATE", arg1=""
                    )
                )
            ),
            2,
        )

    def enable_dosing_pump(self, pump_number: int):
        self.mqtt_client.publish(
            BASE_STATION_CHANNEL,
            json.dumps(
                dataclasses.asdict(
                    ControllerCommand(
                        actionner="DOSINGPUMP" + str(pump_number),
                        command="ACTIVATE",
                        arg1="",
                    )
                )
            ),
            2,
        )

    def disable_dosing_pump(self, pump_number: int):
        self.mqtt_client.publish(
            BASE_STATION_CHANNEL,
            json.dumps(
                dataclasses.asdict(
                    ControllerCommand(
                        actionner="DOSINGPUMP" + str(pump_number),
                        command="DESACTIVATE",
                        arg1="",
                    )
                )
            ),
            2,
        )

    def enable_mixing(self):
        self.mqtt_client.publish(
            BASE_STATION_CHANNEL,
            json.dumps(
                dataclasses.asdict(
                    ControllerCommand(
                        actionner="MIXINGPUMP",
                        command="ACTIVATE",
                        arg1="",
                    )
                )
            ),
            2,
        )

    def disable_mixing(self):
        self.mqtt_client.publish(
            BASE_STATION_CHANNEL,
            json.dumps(
                dataclasses.asdict(
                    ControllerCommand(
                        actionner="MIXINGPUMP", command="DESACTIVATE", arg1=""
                    )
                )
            ),
            2,
        )

    def enable_routing_valve(self, node_name: str, destination: str):
        self.mqtt_client.publish(
            node_name,
            json.dumps(
                dataclasses.asdict(
                    ControllerCommand(
                        actionner="ROUTINGVALVE",
                        command="ACTIVATE",
                        arg1=destination,
                    ),
                )
            ),
            2,
        )

    def enable_routing_pump(self, node_name: str):
        self.mqtt_client.publish(
            node_name,
            json.dumps(
                dataclasses.asdict(
                    ControllerCommand(
                        actionner="ROUTINGPUMP",
                        command="ACTIVATE",
                        arg1="",
                    )
                )
            ),
            2,
        )

    def disable_routing_pump(self, node_name: str):
        self.mqtt_client.publish(
            node_name,
            json.dumps(
                dataclasses.asdict(
                    ControllerCommand(
                        actionner="ROUTINGPUMP", command="DEACTIVATE", arg1=""
                    ),
                )
            ),
            2,
        )

    def enable_compressor(self):
        self.mqtt_client.publish(
            "base_station",
            json.dumps(
                dataclasses.asdict(
                    ControllerCommand(
                        actionner="COMPRESSOR", command="ACTIVATE", arg1=""
                    )
                )
            ),
            2,
        )

    def disable_compressor(self):
        self.mqtt_client.publish(
            "base_station",
            json.dumps(
                dataclasses.asdict(
                    ControllerCommand(
                        actionner="COMPRESSOR", command="DEACTIVATE", arg1=""
                    )
                )
            ),
            2,
        )

    def disable_routing_valve(self, node_name: str, destination: str):
        self.mqtt_client.publish(
            node_name,
            json.dumps(
                dataclasses.asdict(
                    ControllerCommand(
                        actionner="ROUTINGVALVE", command="DEACTIVATE", arg1=destination
                    )
                )
            ),
            2,
        )
