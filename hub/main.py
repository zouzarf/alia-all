from concurrent.futures import ThreadPoolExecutor
from commands_handler import mqtt_message_handler
from config import MQTT_IP, WATER_SENSOR_CHANNEL
from mqtt_config import client
from paho.mqtt.client import MQTTMessage

executor = ThreadPoolExecutor(max_workers=10)


def on_message(mosq, obj, message: MQTTMessage):
    executor.submit(mqtt_message_handler, message)


def on_connect(client, userdata, flags, rc):
    print(f"-- HUB -- Connected with result code " + str(rc))
    client.subscribe("hub")
    client.subscribe(WATER_SENSOR_CHANNEL)


def main():
    global routing_station

    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(MQTT_IP, 1883, 60)

    client.loop_forever()


main()
