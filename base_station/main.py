import traceback
from command_manager import CommandManager
from mqtt_config import client
from paho.mqtt.client import MQTTMessage
import os
from logger import logger as logging

rasp_server = os.environ["rasp_server"]
MQTT_SERVER_IP = rasp_server


def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe("base_station")


def main() -> None:
    logging.info("--Starting base station--")

    try:
        cm = CommandManager()
        logging.info("Config loaded")

        def on_message(mosq, obj, message: MQTTMessage):
            cm.run(message)

        client.on_message = on_message
        client.on_connect = on_connect
        client.connect(MQTT_SERVER_IP)
        logging.info("Ready to take commands")
        client.loop_forever()
    except Exception as e:
        logging.error("Error while initializing")
        logging.error(str(e))
        for x in traceback.format_exc().splitlines():
            logging.error(str(x))
        raise e


if __name__ == "__main__":
    main()
