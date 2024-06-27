from Phidget22.Phidget import *  # type: ignore
from Phidget22.Devices.VoltageInput import *  # type: ignore
from Phidget22.Devices.VoltageRatioInput import *  # type: ignore
from template_classes.water_sensor import ws
from template_classes.relay import RelayChannel
import time


class PumpWaterSource:
    def __init__(self, micro_controller_port: int, hub_port: int):
        pump_ports = (
            micro_controller_port,
            hub_port,
        )
        self.pump = RelayChannel(ports=pump_ports)
        self.TANK_CAPACITY = 10

    def enable_water_sucking(self):
        # self.water_valve_1.enable()
        # self.water_valve_2.enable()
        self.pump.enable()

    def disable_water_sucking(self):
        self.pump.disable()
        # self.water_valve_2.disable()
        # self.water_valve_1.disable()

    def enable_mixing(self):
        # self.mixing_valve_1.enable()
        # self.mixing_valve_2.enable()
        self.pump.enable()

    def disable_mixing(self):
        self.pump.disable()
        # self.mixing_valve_1.disable()
        # self.mixing_valve_2.disable()
