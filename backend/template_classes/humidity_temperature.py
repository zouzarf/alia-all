from Phidget22.Phidget import *
from Phidget22.Devices.VoltageRatioInput import *

class TempSensor:
    def __init__(self, port, onTempChange):
        TemperatureInput = VoltageRatioInput()
        TemperatureInput.setIsHubPortDevice(True)
        TemperatureInput.setHubPort(port)
        TemperatureInput.setOnSensorChangeHandler(onTempChange)
        TemperatureInput.openWaitForAttachment(5000)
        TemperatureInput.setSensorType(VoltageRatioSensorType.SENSOR_TYPE_1125_TEMPERATURE)

class HumiditySensor:
    def __init__(self, port, onHumidityChange):
        HumidityInput = VoltageRatioInput()
        HumidityInput.setIsHubPortDevice(True)
        HumidityInput.setHubPort(port)
        HumidityInput.setOnSensorChangeHandler(onHumidityChange)
        HumidityInput.openWaitForAttachment(5000)
        HumidityInput.setSensorType(VoltageRatioSensorType.SENSOR_TYPE_1125_HUMIDITY)