from event_processor import EventProcessor
from concurrent.futures import ThreadPoolExecutor
from hub_commands import HubCommandManager
from scheduler import Scheduler
from logger import logger as logging

MQTT_SERVER_IP = "localhost"

command_done = False
executor = ThreadPoolExecutor(max_workers=10)


def main():
    logging.info("------------------")
    logging.info("STARTING SCHEDULER")
    logging.info("------------------")
    h = HubCommandManager()
    e = EventProcessor(h)
    s = Scheduler(e)
    executor.submit(s.run)
    h.client.loop_forever()


main()
