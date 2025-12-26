from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import asyncio
from db import BaseStationPorts, session, WirelessHubs, RoutesConfig
from template_classes.relay import RelayChannel
from Phidget22.Net import Net
import random
import logging

app = FastAPI()
logging.basicConfig(
    level=logging.INFO,  # DEBUG, INFO, WARNING, ERROR, CRITICAL
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

CONFIG = {}
DEVICE_STATE = {}
ACTIONS = {"valves": ["open", "close"], "motors": ["start", "stop"]}
ACTIONNERS = {}


class Actionner:
    def __init__(self, name, hub_port, relay_channel, serial_number):
        self.name = name
        self.hub_port = hub_port
        self.relay_channel = relay_channel
        self.serial_number = serial_number
        logger.info(
            f"Initializing actionner for {self.name} sn {self.serial_number} on {hub_port}/{relay_channel}"
        )
        self.device = RelayChannel(
            int(self.serial_number), self.hub_port, self.relay_channel
        )

    def do_action(self, action):
        logger.info(f"{self.name}: Executing {action}")
        if action == "activate":
            self.device.enable()
        else:
            self.device.disable()


lock = asyncio.Lock()  # Ensure reload is thread-safe


async def load_config_from_db():
    ACTIONNERS.clear()
    for wireless_hub in session.query(WirelessHubs).all():
        Net.addServer("test+000" + str(random.random()), wireless_hub.ip, 5661, "", 0)
        logger.info("Adding server " + wireless_hub.ip)
    base_station_ports = session.query(BaseStationPorts).all()
    zone_ports_list = session.query(RoutesConfig).all()

    async def create_actionner(name, hub_port, relay_channel, hub_serial_number):
        return name, Actionner(name, hub_port, relay_channel, hub_serial_number)

    results = await asyncio.gather(
        *[
            create_actionner(
                port.name, port.hub_port, port.relay_channel, port.hub_serial_number
            )
            for port in base_station_ports
        ],
        *[
            create_actionner(
                zone.dst, zone.hub_port, zone.relay_channel, zone.hub_serial_number
            )
            for zone in zone_ports_list
        ],
    )

    for name, actionner in results:
        ACTIONNERS[name] = actionner


def create_action_endpoint(device_name, action):
    async def endpoint():
        actionner = ACTIONNERS.get(device_name)
        actionner.do_action(action)
        return JSONResponse({"result": "success"})

    return endpoint


def register_dynamic_endpoints():
    # Remove old
    for actionner in ACTIONNERS:
        if actionner in app.routes:
            app.routes.remove(route)

    # Register new routes
    for actionner in ACTIONNERS:
        path = f"/{actionner}/activate"
        endpoint = create_action_endpoint(actionner, "activate")
        route = app.add_api_route(path, endpoint, methods=["GET"])
        path = f"/{actionner}/deactivate"
        endpoint = create_action_endpoint(actionner, "deactivate")
        route = app.add_api_route(path, endpoint, methods=["GET"])


@asynccontextmanager
async def lifespan(app: FastAPI):
    await load_config_from_db()
    # Load initial config from DB at startup
    register_dynamic_endpoints()
    logger.info("App started with initial DB config")
    yield
    logger.info("App shutting down")


app = FastAPI(title="Driver Module", lifespan=lifespan)


# Reload endpoint to re-fetch config from DB
@app.get("/reload")
async def reload_config():
    global CONFIG, DEVICE_STATE
    async with lock:
        await load_config_from_db()  # fetch updated config
        register_dynamic_endpoints()
    return {"status": "reloaded", "config": CONFIG}


@app.get("/status")
async def status():
    """
    Just return a static message since we don't track state
    """
    return {"status": "ready"}
