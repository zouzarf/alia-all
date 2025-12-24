from datetime import datetime
import threading
import time
from event_processor import EventProcessor
from hub_commands import HubCommandManager
from scheduler import Scheduler
from logger import logger as logging
import threading
import time
from fastapi import FastAPI
import uvicorn

app = FastAPI()


@app.get("/status")
def alive():
    return {"status": "ready"}


def start_health_server():
    uvicorn.run(app, host="0.0.0.0", port=8002, log_level="warning")


def main():
    logging.info("------------------")
    logging.info("STARTING SCHEDULER")
    logging.info("------------------")
    threading.Thread(target=start_health_server, daemon=True).start()
    print("test")
    h = HubCommandManager()
    e = EventProcessor(h)

    s = Scheduler(e)
    s.run()


main()
