from Phidget22.Phidget import *
from Phidget22.Devices.VoltageInput import *
from Phidget22.Devices.VoltageRatioInput import *
from template_classes.water_sensor import WaterSensor
from template_classes.relay import RelayChannel
import time
import paho.mqtt.client as paho
import threading
import time

lock = threading.Lock()

# PUMP 1 FUNCTIONS:
# - GETS WATER FROM THE BIG TANK
# - PUSHES WATER BACK WHEN MIXING
WAITING_PER_ML = 9


class PumpDosing:
    def __init__(self, base_station_config):
        self.pumps = []
        pump_ports1 = (
            base_station_config["DOSINGPUMP1"].split("/")[0],
            base_station_config["DOSINGPUMP1"].split("/")[1],
        )
        print(pump_ports1)

        self.pumps.append(RelayChannel(ports=pump_ports1))
        pump_ports2 = (
            base_station_config["DOSINGPUMP2"].split("/")[0],
            base_station_config["DOSINGPUMP2"].split("/")[1],
        )
        self.pumps.append(RelayChannel(ports=pump_ports2))
        pump_ports3 = (
            base_station_config["DOSINGPUMP3"].split("/")[0],
            base_station_config["DOSINGPUMP3"].split("/")[1],
        )
        self.pumps.append(RelayChannel(ports=pump_ports3))
        pump_ports4 = (
            base_station_config["DOSINGPUMP4"].split("/")[0],
            base_station_config["DOSINGPUMP4"].split("/")[1],
        )
        self.pumps.append(RelayChannel(ports=pump_ports4))

    def enable_dosing(self, i):
        self.pumps[i].enable()

    def disable_dosing(self, i):
        self.pumps[i].disable()
