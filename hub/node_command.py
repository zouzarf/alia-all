import dataclasses
import json
from config import BASE_STATION_CHANNEL, WATER_SENSOR_CHANNEL
from logger import logger as logging
from dataclasses import dataclass


@dataclass
class ControllerCommand:
    actionner: str
    command: str


class NodeCommand:

    def __init__(self, mqtt_client):
        self.mqtt_client = mqtt_client

    def enable_water_pump(self):
        self.mqtt_client.publish(
            BASE_STATION_CHANNEL,
            json.dumps(
                dataclasses.asdict(
                    ControllerCommand(actionner="WATERPUMP", command="ACTIVATE")
                )
            ),
            2,
        )

    def disable_water_pump(self):
        self.mqtt_client.publish(
            BASE_STATION_CHANNEL,
            json.dumps(
                dataclasses.asdict(
                    ControllerCommand(actionner="WATERPUMP", command="DESACTIVATE")
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
                    ControllerCommand(actionner="MIXINGPUMP", command="ACTIVATE")
                )
            ),
            2,
        )

    def disable_mixing(self):
        self.mqtt_client.publish(
            BASE_STATION_CHANNEL,
            json.dumps(
                dataclasses.asdict(
                    ControllerCommand(actionner="MIXINGPUMP", command="DESACTIVATE")
                )
            ),
            2,
        )

    def enable_routing_valve(self, node_name: str):
        self.mqtt_client.publish(
            node_name,
            json.dumps(
                dataclasses.asdict(
                    ControllerCommand(actionner="ROUTE", command="ACTIVATE-VALVE")
                )
            ),
            2,
        )

    def enable_routing_pump(self, node_name: str):
        self.mqtt_client.publish(
            node_name,
            json.dumps(
                dataclasses.asdict(
                    ControllerCommand(actionner="ROUTE", command="ACTIVATE-PUMP")
                )
            ),
            2,
        )

    def disable_routing_pump(self, node_name: str):
        self.mqtt_client.publish(
            node_name,
            json.dumps(
                dataclasses.asdict(
                    ControllerCommand(actionner="ROUTE", command="DEACTIVATE-PUMP")
                )
            ),
            2,
        )

    def enable_compressor(self):
        self.mqtt_client.publish(
            "base_station",
            json.dumps(
                dataclasses.asdict(
                    ControllerCommand(actionner="ROUTE", command="ACTIVATE-COMPRESSOR")
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
                        actionner="ROUTE", command="DEACTIVATE-COMPRESSOR"
                    )
                )
            ),
            2,
        )

    def disable_routing_valve(self, node_name: str):
        self.mqtt_client.publish(
            node_name,
            json.dumps(
                dataclasses.asdict(
                    ControllerCommand(actionner="ROUTE", command="DEACTIVATE-VALVE")
                )
            ),
            2,
        )
