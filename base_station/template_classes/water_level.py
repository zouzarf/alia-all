from Phidget22.Devices.CurrentInput import CurrentInput


class WaterLevel:
    def __init__(self, port, onCurrentChange):
        self.voltageInput5 = CurrentInput()
        self.voltageInput5.setHubPort(int(port))
        self.voltageInput5.setOnCurrentChangeHandler(onCurrentChange)
        self.voltageInput5.openWaitForAttachment(5000)
