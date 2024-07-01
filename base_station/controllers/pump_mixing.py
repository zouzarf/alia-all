from Phidget22.Phidget import *  # type: ignore
from Phidget22.Devices.VoltageInput import *  # type: ignore
from Phidget22.Devices.VoltageRatioInput import *  # type: ignore
from template_classes.relay import RelayChannel
import time
import paho.mqtt.client as paho
import threading
import time

lock = threading.Lock()


class PumpMixing:
    def __init__(self, mc_port: int, hub_port: int):
        pump_ports = (
            mc_port,
            hub_port,
        )
        self.pump = RelayChannel(ports=pump_ports)

    def enable_mixing(self):
        self.pump.enable()

    def disable_mixing(self):
        self.pump.disable()

    def mix(self, mixing_time):
        self.enable_mixing()
        time.sleep(mixing_time)
        self.disable_mixing()
