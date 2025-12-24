from Phidget22.Devices.CurrentInput import CurrentInput


class WaterLevel:
    def __init__(self, port, onCurrentChange):
        self.currentInput = CurrentInput()
        self.currentInput.setHubPort(int(port))
        self.currentInput.setOnCurrentChangeHandler(onCurrentChange)
        self.currentInput.openWaitForAttachment(5000)
