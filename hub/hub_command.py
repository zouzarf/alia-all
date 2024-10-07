from dataclasses import dataclass
import json
import threading
import time
from paho.mqtt.client import MQTTMessage
from config import BASE_STATION_CHANNEL, WATER_SENSOR_CHANNEL
from logger import logger as logging
from node_command import NodeCommand
from routing import Routing
from db import RoutersConfig, RoutingConfig, session, GeneralConfig
import traceback

RELOAD_COMMAND = "RELOAD_CONFIG"
FILL_WATER_COMMAND = "b"
DOSE_COMMAND = "c"
MIX_COMMAND = "d"
ROUTE_COMMAND = "e"


@dataclass
class HubCommand:
    command: str
    arg1: str
    arg2: str
    arg3: str


@dataclass
class SensorInfo:
    water_voltage: str


lock = threading.Lock()
water_voltage = -1


class HubCommandManager:
    def __init__(self, db_connection, mqtt_client):
        self.db_connection = db_connection
        self.node_command = NodeCommand(mqtt_client)
        self.mqtt_client = mqtt_client
        self.load_config()

    def load_config(self):

        self.general_config = {
            i.name: i.value for i in session.query(GeneralConfig).all()
        }
        routing_config = session.query(RoutingConfig).all()
        routers_config = session.query(RoutersConfig).all()
        main_router = (
            session.query(RoutersConfig)
            .where(RoutersConfig.linked_to_base_station == True)
            .one()
        )
        self.routing = Routing(routing_config, main_router, routers_config)

    def mqtt_message_handler(self, message: MQTTMessage):
        match message.topic:
            case str(x) if x == WATER_SENSOR_CHANNEL:
                global water_voltage
                sensor_info = SensorInfo(**json.loads(message.payload))
                water_voltage = float(sensor_info.water_voltage)

            case str(x) if x == "hub":
                try:
                    logging.info(f"Received action")
                    self.execute_command(HubCommand(**json.loads(message.payload)))
                except Exception as e:
                    logging.error(str(e))
                    logging.error(traceback.format_exc())

    def execute_command(self, command: HubCommand):
        try:
            lock.acquire()
            logging.info(f"Executing action {command.command}")
            match command.command:
                case "RELOAD_CONFIG":
                    self.load_config()
                    for router in self.routing.routers:
                        self.node_command.reload_config(router.name)
                    self.node_command.reload_config(BASE_STATION_CHANNEL)
                    logging.info(f"Reloading config ...")
                case "FILL_WATER":
                    global water_voltage
                    water_level_target = float(command.arg1)
                    logging.info("Sending water command to base_station")
                    self.node_command.enable_water_pump()
                    logging.info("Sent water command to base_station")
                    logging.info(
                        f"Waiting for water level to reach the target {water_level_target}L"
                    )
                    while (
                        float(self.general_config["WATER_OFFSET_L"])
                        + float(self.general_config["WATER_VOLT_TO_L_CONVERSION"])
                        * water_voltage
                    ) < water_level_target:
                        pass
                    logging.info("Water level reached")
                    logging.info("Disabling water pump")
                    self.node_command.disable_water_pump()
                    logging.info("Sending response to hub_response")
                    self.mqtt_client.publish("hub_response", "water_done")
                case "DOSE":
                    logging.info(
                        f"Sending dosing command for dosing pump {command.arg1}, amount: {command.arg2}ml"
                    )
                    self.node_command.enable_dosing_pump(command.arg1)
                    time_to_wait = int(self.general_config["DOSING_TIME"]) * int(
                        command.arg2
                    )
                    logging.info(f"Waiting {time_to_wait} seconds...")
                    time.sleep(time_to_wait)
                    logging.info("Disabling dosing pump ...")
                    self.node_command.disable_dosing_pump(command.arg1)
                    logging.info("Sending response to hub_response")
                    self.mqtt_client.publish("hub_response", "dosing_done")
                case "MIX":
                    logging.info("Sending mixing command to base_station")
                    self.node_command.enable_mixing()
                    logging.info(f"Waiting {command.arg1}minutes")
                    time.sleep(int(command.arg1) * 60)
                    logging.info("Disabling mixing pump")
                    self.node_command.disable_mixing()
                    logging.info("Sending mixing_done response to hub_response")
                    self.mqtt_client.publish("hub_response", "mixing_done")
                case "ROUTE":
                    zone_name = command.arg1
                    logging.info(f"Getting path to zone {zone_name}  ")
                    path = self.routing.get_path_to_zone(zone_name)
                    logging.info(str(path))
                    for src, dst in path:
                        logging.info(f"Send open valve command to {src} ...")
                        self.node_command.enable_routing_valve(src, dst)
                    for src, _ in path:
                        logging.info(f"Send open pump command to {src} ...")
                        self.node_command.enable_routing_pump(src)
                    routing_time = command.arg2
                    logging.info(f"Sleeping for {routing_time} minutes ...")
                    time.sleep(int(routing_time) * 60)
                    for src, _ in path:
                        logging.info(f"Send close pump command to {src} ...")
                        self.node_command.disable_routing_pump(src)
                    logging.info(f"Enabling compressor ...")
                    self.node_command.enable_compressor()
                    compressing_time = command.arg3
                    logging.info(f"Sleeping for {compressing_time} minutes ...")
                    time.sleep(int(compressing_time) * 60)
                    logging.info(f"Disabling compressor ...")
                    self.node_command.disable_compressor()
                    for src, dst in path:
                        logging.info(f"Send close valve command to {src} ...")
                        self.node_command.disable_routing_valve(src, dst)
                    logging.info("Sending routing_done response to hub_response")
                    self.mqtt_client.publish("hub_response", "routing_done")
                case _:
                    pass
        except Exception as e:
            logging.error(str(e))
            logging.error(traceback.format_exc())
        finally:
            lock.release()
