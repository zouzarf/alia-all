import threading
from mqtt_config import client
from controllers.routing_station import RoutingStation
from pydantic.dataclasses import dataclass
from db import session, GeneralConfig, RoutersConfig, RoutingConfig
import json
from getmac import get_mac_address

mac_address = (get_mac_address(interface="eth0") or "").upper()
print(mac_address)
MQTT_IP = "127.0.0.1"

general_config = session.query(GeneralConfig).all()
routing_config = session.query(RoutingConfig).all()
router_config = (
    session.query(RoutersConfig).where(RoutersConfig.mac_address == mac_address).one()
)
print(general_config)
print(routing_config)
print(router_config)

lock = threading.Lock()


@dataclass
class RoutingCommand:
    command: str
    dest: str
    action: str


def on_message(mosq, obj, message):
    # TODO: USE LOCK

    command_message = RoutingCommand(**json.loads(message))
    match command_message.command:
        case "RELOAD_CONFIG":
            global routing_station
            routing_config = session.query(RoutingConfig).all()
            router_config = (
                session.query(RoutersConfig)
                .where(RoutersConfig.mac_address == mac_address)
                .one()
            )
            routing_station = RoutingStation(
                routes_config=routing_config, router_config=router_config
            )
        case "PUMP":
            if command_message.action == "ACTIVATE":
                routing_station.pump.enable()
            else:
                routing_station.pump.disable()
        case "ROUTING":
            if command_message.action == "ACTIVATE":
                routing_station.open_route(command_message.dest)
            else:
                routing_station.close_route(command_message.dest)
        case _:
            pass


def on_connect(client, userdata, flags, rc):
    print(f"-- Router {router_config.name} -- Connected with result code " + str(rc))
    client.subscribe(router_config.name)


def main():
    global routing_station
    routing_station = RoutingStation(
        routes_config=routing_config, router_config=router_config
    )
    print(router_config)
    print(routing_config)

    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(MQTT_IP, 1883, 60)

    client.loop_forever()


main()
