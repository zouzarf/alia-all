from Phidget22.Phidget import *
from Phidget22.Devices.VoltageInput import *


class Knob:
    def __init__(self, port, onVoltageChange):
        self.voltageInput5 = VoltageInput()
        self.voltageInput5.setIsHubPortDevice(True)
        self.voltageInput5.setHubPort(int(port))
        self.voltageInput5.setOnVoltageChangeHandler(onVoltageChange)
        self.voltageInput5.openWaitForAttachment(5000)
