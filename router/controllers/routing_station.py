import time
from template_classes.relay import RelayChannel
from db import RoutersConfig, RoutingConfig
from logger import logger as logging


class RoutingStation:
    def __init__(
        self, routes_config: list[RoutingConfig], router_config: RoutersConfig
    ):
        logging.info("Loading config")
        self.name = router_config.name
        logging.info(f"Router name: {self.name}")
        self.zones = {}
        for node in routes_config:
            logging.info(f"Loading zone {node.dst}")
            self.zones[node.dst] = RelayChannel(
                (node.valve_microprocessor_port, node.valve_hub_port)
            )
        self.pump = RelayChannel(
            (router_config.pump_microprocessor_port, router_config.pump_hub_port)
        )

    def close(self):
        self.pump.close()
        for zone in self.zones:
            self.zones[zone].close()

    def open_route(self, zone_id: str):
        self.zones[zone_id].enable()

    def close_route(self, zone_id: str):
        self.zones[zone_id].disable()
