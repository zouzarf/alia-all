from template_classes.relay import RelayChannel
from db import session, GeneralConfig, RoutersConfig, RoutingConfig


class RoutingStation:
    def __init__(
        self, routes_config: list[RoutingConfig], router_config: RoutersConfig
    ):
        self.zones = {}
        for node in routes_config:
            self.zones[node.dst] = RelayChannel(
                (node.valve_microprocessor_port, node.valve_hub_port)
            )
        self.pump = RelayChannel(
            (router_config.pump_microprocessor_port, router_config.pump_hub_port)
        )

    def open_route(self, zone_id: str):
        self.zones[zone_id].enable()

    def close_route(self, zone_id: str):
        self.zones[zone_id].disable()
