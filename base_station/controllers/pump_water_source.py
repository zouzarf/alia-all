from Phidget22.Phidget import *
from Phidget22.Devices.VoltageInput import *
from Phidget22.Devices.VoltageRatioInput import *
from template_classes.water_sensor import ws
from template_classes.relay import RelayChannel
import time


class PumpWaterSource:
    def __init__(self, micro_controller_port: int, hub_port: int):
        pump_ports = (
            micro_controller_port,
            hub_port,
        )
        # water_valve_1_ports = (base_station_config['VALVE1'].split('/')[0],base_station_config['VALVE1'].split('/')[1])
        # water_valve_2_ports = (base_station_config['VALVE2'].split('/')[0],base_station_config['VALVE2'].split('/')[1])
        # mixing_valve_1_ports = (base_station_config['VAVLE3'].split('/')[0],base_station_config['VAVLE3'].split('/')[1])
        # mixing_valve_2_ports = (base_station_config['VAVLE4'].split('/')[0],base_station_config['VAVLE4'].split('/')[1])
        self.pump = RelayChannel(ports=pump_ports)
        # self.water_valve_1 = RelayChannel(ports=water_valve_1_ports)
        # self.water_valve_2 = RelayChannel(ports=water_valve_2_ports)
        # self.mixing_valve_1 = RelayChannel(ports=mixing_valve_1_ports)
        # self.mixing_valve_2 = RelayChannel(ports=mixing_valve_2_ports)
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
        self.mixing_valve_1.enable()
        self.mixing_valve_2.enable()
        self.pump.enable()

    def disable_mixing(self):
        self.pump.disable()
        self.mixing_valve_1.disable()
        self.mixing_valve_2.disable()

    def mix(self, mixing_time_seconds):
        # Mixing PART 1
        self.enable_mixing()
        time.sleep(mixing_time_seconds)
        self.disable_mixing()

    def fill(self, value, fill_event):
        self.enable_water_sucking()
        print("percentage to fill" + str((value / self.TANK_CAPACITY) * 100))
        while (
            ws.water_level < (value / self.TANK_CAPACITY) * 100
            and not fill_event.is_set()
        ):
            time.sleep(0.01)
        fill_event.clear()
        self.disable_water_sucking()
