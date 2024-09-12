import dataclasses
from datetime import datetime
import json
import time
from paho.mqtt.client import MQTTMessage
from mqtt_config import client
from db import get_to_do, session, EventsLogs
from dataclasses import dataclass
from concurrent.futures import ThreadPoolExecutor


@dataclass
class HubCommand:
    command: str
    arg1: str
    arg2: str
    arg3: str


SCAN_INTERVAL = 10
MQTT_SERVER_IP = "localhost"

command_done = False
executor = ThreadPoolExecutor(max_workers=10)


def on_connect(client, userdata, flags, rc):
    print("-- scheduler -- Connected with result code " + str(rc))
    client.subscribe("hub_response")


def on_message(mosq, obj, message: MQTTMessage):
    global command_done
    print("got message")
    command_done = True
    print("command_done set to True")


def main():
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(MQTT_SERVER_IP, 1883, 60)
    executor.submit(scheduler)
    client.loop_forever()


def scheduler():
    while True:
        print("Looking for tasks ...")
        for event in get_to_do():
            try:
                global command_done
                start_time = datetime.now()
                print("Starting Task :")
                print(event)
                # FILL WATER
                print("Filling Water tank for" + str(event.water_level))
                client.publish(
                    "hub",
                    json.dumps(
                        dataclasses.asdict(
                            HubCommand("FILL_WATER", event.water_level, "", "")
                        )
                    ),
                    2,
                )

                while not command_done:
                    pass
                command_done = False
                print("Water tank filled")
                # DOSE
                print(
                    f"Dosing with dose n*: {event.dose_amount} amount: {event.dose_amount}"
                )
                client.publish(
                    "hub",
                    json.dumps(
                        dataclasses.asdict(
                            HubCommand("DOSE", event.dose_number, event.dose_amount, "")
                        )
                    ),
                    2,
                )

                while not command_done:
                    pass
                command_done = False
                print("Dosing done")
                # MIX
                print(f"Mixing for {event.mixing_time}")
                client.publish(
                    "hub",
                    json.dumps(
                        dataclasses.asdict(HubCommand("MIX", event.mixing_time, "", ""))
                    ),
                    2,
                )
                while not command_done:
                    pass
                command_done = False
                print("Mixing done")
                # ROUTE
                print(
                    f"Routing to {event.zone_name} for {event.routing_time} and then compressing for {event.compressing_time}"
                )
                client.publish(
                    "hub",
                    json.dumps(
                        dataclasses.asdict(
                            HubCommand(
                                "ROUTE",
                                event.zone_name,
                                event.routing_time,
                                event.compressing_time,
                            )
                        )
                    ),
                    2,
                )
                while not command_done:
                    pass
                command_done = False
                print("Compression done")
                print("Saving job log")
                # DO STUFF
                session.add(
                    EventsLogs(
                        job_id=event.schedule_id,
                        action_id=event.action_id,
                        job_full_date=event.scheduled_date,
                        process_start=start_time,
                        process_end=datetime.now(),
                        status="COMPLETE",
                    )
                )
                session.commit()
                print("Saving done")
            except Exception as e:
                print(e)

        print("No more tasks")
        time.sleep(SCAN_INTERVAL)


main()
