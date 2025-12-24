from Phidget22.Phidget import *
from Phidget22.Devices.DigitalOutput import *


class RelayChannel:
    def __init__(self, sn, hub_port, relay_channel):
        self.digitalOutput1 = DigitalOutput()
        self.digitalOutput1.setHubPort(int(hub_port))
        self.digitalOutput1.setChannel(int(relay_channel))
        self.digitalOutput1.setDeviceSerialNumber(sn)
        self.digitalOutput1.openWaitForAttachment(5000)

    def enable(self):
        self.digitalOutput1.setDutyCycle(1)

    def disable(self):
        self.digitalOutput1.setDutyCycle(0)
