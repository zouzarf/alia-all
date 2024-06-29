import threading
from mqtt_config import client
from controllers.routing_station import RoutingStation
from prisma.models import routers, routes
from prisma import Prisma
from pydantic.dataclasses import dataclass
import json

router_name = "sn_202020"  # TODO FIND ROUTERSN
MQTT_IP = "127.0.0.1"
db = Prisma()


lock = threading.Lock()


@dataclass
class RoutingCommand:
    command: str
    dest: int
    action: str


def on_message(mosq, obj, message):
    # TODO: USE LOCK

    command_message = RoutingCommand(**json.loads(message))
    global routing_station
    # TODO: FINISH ALL ACTIONS
    match command_message.command:
        case "RELOAD_CONFIG":
            global routing_station
            global db
            router_config = db.routers.find_many(
                where={
                    "serial_number": router_name,
                },
            )
            routing_config = db.routes.find_many(
                where={
                    "src": router_config[0].id,
                },
            )
            routing_station = RoutingStation(
                routes_config=routing_config, router_config=router_config[0]
            )
        case "ROUTING":
            if command_message.action == "ENABLE":
                routing_station.open_route(command_message.dest)
            else:
                routing_station.close_route(command_message.dest)
        case _:
            pass


def on_connect(client, userdata, flags, rc):
    print(f"-- Router {router_name} -- Connected with result code " + str(rc))
    client.subscribe(router_name)


def main():
    global routing_station
    db.connect()
    # TODO change to unique
    router_config = db.routers.find_many(
        where={
            "serial_number": router_name,
        },
    )
    routing_config = db.routes.find_many(
        where={
            "src": router_config[0].id,
        },
    )
    routing_station = RoutingStation(
        routes_config=routing_config, router_config=router_config[0]
    )
    print(router_config)
    print(routing_config)

    client.on_connect = on_connect

    client.connect(MQTT_IP, 1883, 60)

    client.loop_forever()


main()
