from dataclasses import dataclass
import dataclasses
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


@dataclass
class HubEvent:
    command: str
    event: str


lock = threading.Lock()
water_voltage = -1
stop = threading.Event()
stop.clear()


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
                    deserialized_command = HubCommand(**json.loads(message.payload))
                    if deserialized_command.command == "RELOAD_CONFIG":
                        self.load_config()
                        for router in self.routing.routers:
                            self.node_command.reload_config(router.name)
                        self.node_command.reload_config(BASE_STATION_CHANNEL)
                        logging.info(f"Reloading config ...")
                    elif deserialized_command.command == "STOP":
                        logging.info("Received STOP command")
                        stop.set()
                    else:
                        self.execute_command(deserialized_command)
                except Exception as e:
                    logging.error(str(e))
                    logging.error(traceback.format_exc())

    def execute_command(self, command: HubCommand):
        try:
            lock.acquire()
            logging.info(f"Executing action {command.command}")
            match command.command:
                case "FILL_WATER":
                    self.mqtt_client.publish(
                        "hub_response",
                        json.dumps(
                            dataclasses.asdict(HubEvent("filling", "processing"))
                        ),
                        retain=1,
                    )
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
                    ) < water_level_target and not stop.is_set():
                        pass
                    print(stop.is_set())
                    if stop.is_set():
                        stop.clear()
                    logging.info("Water level reached")
                    logging.info("Disabling water pump")
                    self.node_command.disable_water_pump()
                    logging.info("Sending response to hub_response")
                    self.mqtt_client.publish(
                        "hub_response",
                        json.dumps(dataclasses.asdict(HubEvent("filling", "done"))),
                        retain=1,
                    )
                case "DOSE":
                    self.mqtt_client.publish(
                        "hub_response",
                        json.dumps(
                            dataclasses.asdict(HubEvent("dosing", "processing"))
                        ),
                        retain=1,
                    )
                    logging.info(
                        f"Sending dosing command for dosing pump {command.arg1}, amount: {command.arg2}ml"
                    )
                    self.node_command.enable_dosing_pump(command.arg1)
                    time_to_wait = int(self.general_config["DOSING_TIME"]) * int(
                        command.arg2
                    )
                    logging.info(f"Waiting {time_to_wait} seconds...")
                    stop.wait(time_to_wait)
                    if stop.is_set():
                        stop.clear()
                    logging.info("Disabling dosing pump ...")
                    self.node_command.disable_dosing_pump(command.arg1)
                    logging.info("Sending response to hub_response")
                    self.mqtt_client.publish(
                        "hub_response",
                        json.dumps(dataclasses.asdict(HubEvent("dosing", "done"))),
                        retain=1,
                    )
                case "MIX":
                    self.mqtt_client.publish(
                        "hub_response",
                        json.dumps(
                            dataclasses.asdict(HubEvent("mixing", "processing"))
                        ),
                        retain=1,
                    )
                    logging.info("Sending mixing command to base_station")
                    self.node_command.enable_mixing()
                    logging.info(f"Waiting {command.arg1}minutes")
                    stop.wait(int(command.arg1) * 60)
                    if stop.is_set():
                        stop.clear()
                    logging.info("Disabling mixing pump")
                    self.node_command.disable_mixing()
                    logging.info("Sending mixing_done response to hub_response")
                    self.mqtt_client.publish(
                        "hub_response",
                        json.dumps(dataclasses.asdict(HubEvent("mixing", "done"))),
                        retain=1,
                    )
                case "ROUTE":
                    self.mqtt_client.publish(
                        "hub_response",
                        json.dumps(
                            dataclasses.asdict(HubEvent("routing", "processing"))
                        ),
                        retain=1,
                    )
                    zone_name = command.arg1
                    logging.info(f"Getting path to zone {zone_name}  ")
                    path = self.routing.get_path_to_zone(zone_name)
                    logging.info(str(path))
                    for src, dst in path:
                        if src != "base_station":
                            logging.info(f"Send open valve command to {src} ...")
                            self.node_command.enable_routing_valve(src, dst)
                    for src, _ in path:
                        logging.info(f"Send open pump command to {src} ...")
                        self.node_command.enable_routing_pump(src)
                    routing_time = command.arg2
                    logging.info(f"Sleeping for {routing_time} minutes ...")
                    stop.wait(int(routing_time) * 60)
                    self.node_command.disable_routing_pump("base_station")
                    logging.info("Disabling routing pump for base_station")
                    logging.info(f"Enabling compressor ...")
                    self.node_command.enable_compressor()
                    compressing_time = command.arg3
                    logging.info(f"Sleeping for {compressing_time} minutes ...")
                    stop.wait(int(compressing_time) * 60)
                    if stop.is_set():
                        stop.clear()
                    logging.info(f"Disabling compressor ...")
                    self.node_command.disable_compressor()
                    for src, _ in path:
                        logging.info(f"Send close pump command to {src} ...")
                        self.node_command.disable_routing_pump(src)
                    for src, dst in path:
                        if src != "base_station":
                            logging.info(f"Send close valve command to {src} ...")
                            self.node_command.disable_routing_valve(src, dst)
                    logging.info("Sending routing_done response to hub_response")
                    self.mqtt_client.publish(
                        "hub_response",
                        json.dumps(dataclasses.asdict(HubEvent("routing", "done"))),
                        retain=1,
                    )
                case _:
                    pass
        except Exception as e:
            logging.error(str(e))
            logging.error(traceback.format_exc())
        finally:
            lock.release()
