from Phidget22.Phidget import *
from Phidget22.Devices.DigitalOutput import *

class RelayChannel:
    def __init__(self,ports):
        self.digitalOutput1 = DigitalOutput()
        self.digitalOutput1.setHubPort(int(ports[0]))
        self.digitalOutput1.setChannel(int(ports[1]))
        self.digitalOutput1.openWaitForAttachment(5000)
    def enable(self):
        self.digitalOutput1.setDutyCycle(1)
    def disable(self):
        self.digitalOutput1.setDutyCycle(0)