from template_classes.relay import RelayChannel


class PumpWaterSource:
    def __init__(self, micro_controller_port: int, hub_port: int):
        pump_ports = (
            micro_controller_port,
            hub_port,
        )
        self.pump = RelayChannel(ports=pump_ports)
        self.TANK_CAPACITY = 10

    def enable(self):
        self.pump.enable()

    def disable(self):
        self.pump.disable()
