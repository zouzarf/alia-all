from datetime import datetime
import threading
import time
from event_processor import EventProcessor
from concurrent.futures import ThreadPoolExecutor
from hub_commands import HubCommandManager
from scheduler import Scheduler
from logger import logger as logging
from db import ServiceHealth, session2

MQTT_SERVER_IP = "localhost"
executor = ThreadPoolExecutor(max_workers=10)

HEARTBEAT_INTERVAL = 10
running = True


def heartbeat():
    global running
    while running:
        now = ServiceHealth(name="scheduler", heartbeat=datetime.now())
        session2.merge(now)
        session2.commit()
        time.sleep(HEARTBEAT_INTERVAL)


def main():
    try:
        logging.info("------------------")
        logging.info("STARTING SCHEDULER")
        logging.info("------------------")
        h = HubCommandManager()
        e = EventProcessor(h)
        s = Scheduler(e)
        executor.submit(s.run)
        heartbeat_thread = threading.Thread(target=heartbeat)
        heartbeat_thread.start()
        h.client.loop_forever()
    except Exception as e:
        logging.error(str(e))


main()
