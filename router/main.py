import os
import traceback
from command_handler import CommandHandler, RoutingCommand
from get_serial_number import get_serial_number
from mqtt_config import client
import json
from logger import logger as logging

rasp_server = os.environ["rasp_server"]
MQTT_SERVER_IP = rasp_server


def main():
    try:
        serial_number = get_serial_number()
        print(serial_number)
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
        client.loop_forever()
    except Exception as e:
        logging.error("Error while initializing")
        logging.error(str(e))
        for x in traceback.format_exc().splitlines():
            logging.error(str(x))
        raise e


main()
