from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
import time
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


def heartbeat(interval=5):
    """
    Generates a heartbeat at regular intervals.

    Args:
        interval (int): The time in seconds between heartbeats.
    """
    try:
        while True:
            current_time = datetime.datetime.now().isoformat()
            print(f"[HEARTBEAT] {current_time}")
            # Perform additional tasks here if needed
            time.sleep(interval)
    except KeyboardInterrupt:
        print("\nHeartbeat stopped by user.")


if __name__ == "__main__":
    # Start the heartbeat with a 5-second interval
    heartbeat(interval=5)


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
