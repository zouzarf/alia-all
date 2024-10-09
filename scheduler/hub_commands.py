from dataclasses import dataclass
import dataclasses
import json
from mqtt_config import client
from paho.mqtt.client import MQTTMessage
from logger import logger as logging

command_done = False


@dataclass
class HubCommand:
    command: str
    arg1: str
    arg2: str
    arg3: str


@dataclass
class HubEvent:
    command: str
    event: str


class HubCommandManager:
    MQTT_SERVER_IP = "localhost"
    HUB_CHANNEL = "hub"

    def __init__(self):
        self.client = client
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.connect(self.MQTT_SERVER_IP, 1883, 60)

    def on_connect(self, client, userdata, flags, rc):
        logging.info("MQTT: Connected with result code " + str(rc))
        client.subscribe("hub_response")

    def on_message(self, mosq, obj, message: MQTTMessage):
        global command_done
        hub_event = HubEvent(**json.loads(message.payload))
        logging.info("Got Hub Event Message")
        if hub_event.event == "done":
            logging.info("got message")
            command_done = True
            logging.info("command_done set to True")

    def send_command_and_wait_for_response(self, hub_command: HubCommand):
        global command_done
        client.publish(
            self.HUB_CHANNEL,
            json.dumps(dataclasses.asdict(hub_command)),
            2,
        )
        while not command_done:
            pass
        command_done = False

    def fill_water(self, level):
        self.send_command_and_wait_for_response(HubCommand("FILL_WATER", level, "", ""))

    def dose(self, dose_number: int, dose_amount: int):
        self.send_command_and_wait_for_response(
            HubCommand("DOSE", dose_number, dose_amount, "")
        )

    def mix(self, time: int):

        self.send_command_and_wait_for_response(HubCommand("MIX", time, "", ""))

    def route(self, zone: str, routing_time: int, compressing_time: int):
        self.send_command_and_wait_for_response(
            HubCommand(
                "ROUTE",
                zone,
                routing_time,
                compressing_time,
            )
        )
