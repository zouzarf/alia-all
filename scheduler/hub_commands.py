from dataclasses import dataclass
import json
from logger import logger as logging
import httpx


@dataclass
class RoutingCommand:
    pump_number: str
    zone: str
    pump_warmup_timer: str
    pump_timer: str
    compressor_warmup_timer: str
    compressor_timer: str


class HubCommandManager:
    HUB_ENDPOINT = "http://raspberry"

    def __init__(self):
        self.full_endpoint = self.HUB_ENDPOINT + ":8001"

    def route(self, routing_command: RoutingCommand):
        with httpx.Client(
            timeout=float(routing_command.pump_warmup_timer)
            + float(routing_command.pump_timer)
            + float(routing_command.compressor_warmup_timer)
            + float(routing_command.compressor_timer)
            + 5
        ) as client:
            client.get(
                f"{self.full_endpoint}/route_water?pump_number={routing_command.pump_number}&pump_warm_up={routing_command.pump_warmup_timer}&pump_seconds={routing_command.pump_timer}&compressor_warm_up={routing_command.compressor_warmup_timer}&compressor_seconds={routing_command.compressor_timer}&destination={routing_command.zone}"
            )
