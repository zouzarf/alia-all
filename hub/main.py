from concurrent.futures import ThreadPoolExecutor
import traceback
from config import HUB_LISTENING_CHANNEL, MQTT_IP, WATER_SENSOR_CHANNEL
from hub_command import HubCommandManager
from mqtt_config import client
from paho.mqtt.client import MQTTMessage
from logger import logger as logging

executor = ThreadPoolExecutor(max_workers=10)


def on_connect(client, userdata, flags, rc):
    logging.info(f"Connected to Mqtt server result code " + str(rc))
    client.subscribe(HUB_LISTENING_CHANNEL)
    client.subscribe(WATER_SENSOR_CHANNEL)


def main():
    try:
        global routing_station
        logging.info("-----")
        logging.info("-HUB-")
        logging.info("-----")

        hm = HubCommandManager("test", client)

        def on_message(mosq, obj, message: MQTTMessage):
            executor.submit(hm.mqtt_message_handler, message)

        client.on_connect = on_connect
        client.on_message = on_message

        client.connect(MQTT_IP, 1883, 60)

        client.loop_forever()
    except Exception as e:
        logging.error("Error while initializing")
        logging.error(str(e))
        for x in traceback.format_exc().splitlines():
            logging.error(str(x))
        raise e


main()
