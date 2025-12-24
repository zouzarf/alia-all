from datetime import datetime
import os
import threading
import time
import traceback
from command_handler import CommandHandler, RoutingCommand
from get_serial_number import get_serial_number
from mqtt_config import client
from db import session, RoutersConfig, HardwareHealth, session2
import json
from logger import logger as logging
from Phidget22.PhidgetServerType import PhidgetServerType
from Phidget22.Net import Net

rasp_server = os.environ["rasp_server"]
MQTT_SERVER_IP = rasp_server
serial_number = "1001"
router_name = (
    session.query(RoutersConfig)
    .where(RoutersConfig.serial_number == str(serial_number))
    .one()
).name
HEARTBEAT_INTERVAL = 10
running = True


def heartbeat():
    global running
    while running:
        now = HardwareHealth(name=router_name, heartbeat=datetime.now())
        session2.merge(now)
        session2.commit()
        time.sleep(HEARTBEAT_INTERVAL)


def main():
    try:
        serial_number = "1001"
        print(serial_number)

        Net.addServer("MyHub1", "192.168.1.100", 5661, "", 0)

        logging.info(f"Starting router {serial_number}")
        cm = CommandHandler(serial_number)

        def on_message(mosq, obj, message):
            command_message = RoutingCommand(**json.loads(message.payload.decode()))
            cm.run(command_message)

        def on_connect(client, userdata, flags, rc):
            logging.info(
                f"-- Router {cm.routing_station.name} -- Connected with result code "
                + str(rc)
            )
            client.subscribe(cm.routing_station.name)

        client.on_connect = on_connect
        client.on_message = on_message

        client.connect(MQTT_SERVER_IP, 1883, 60)
        logging.info("Listening ....")
        heartbeat_thread = threading.Thread(target=heartbeat)
        heartbeat_thread.start()
        client.loop_forever()
    except Exception as e:
        logging.error("Error while initializing")
        logging.error(str(e))
        for x in traceback.format_exc().splitlines():
            logging.error(str(x))
        raise e


main()
