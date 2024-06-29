from template_classes.relay import RelayChannel
from prisma.models import routers, routes


class RoutingStation:
    def __init__(self, routes_config: list[routes], router_config: routers):
        self.zones = {}
        for node in routes_config:
            node_name = node.dst
            mp_port = node.valve_microprocessor_port
            relay_port = node.valve_hub_port
            self.zones[node_name] = RelayChannel((mp_port, relay_port))
        pump_p1 = router_config.pump_microprocessor_port
        pump_p2 = router_config.pump_hub_port
        self.pump = RelayChannel((pump_p1, pump_p2))

    def open_route(self, zone_id: int):

        self.zones[zone_id].enable()
        self.pump.enable()

    def close_route(self, zone_id: int):
        self.zones[zone_id].disable()
        self.pump.disable()
