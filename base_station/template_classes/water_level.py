from Phidget22.Phidget import *
from Phidget22.Devices.CurrentInput import *

class WaterLevel:
    def __init__(self, port, onCurrentChange):
        self.voltageInput5 = CurrentInput()
        self.voltageInput5.setHubPort(int(port))
        self.voltageInput5.setOnCurrentChangeHandler(onCurrentChange)
        self.voltageInput5.openWaitForAttachment(5000)