from Phidget22.Phidget import *
from Phidget22.Devices.VoltageInput import *


class Knob:
    def __init__(self, port, onVoltageChange):
        self.voltageInput = VoltageInput()
        self.voltageInput.setIsHubPortDevice(True)
        self.voltageInput.setHubPort(int(port))
        self.voltageInput.setOnVoltageChangeHandler(onVoltageChange)
        self.voltageInput.openWaitForAttachment(5000)
