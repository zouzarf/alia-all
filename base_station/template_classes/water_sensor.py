import os
from template_classes.knob import Knob
from template_classes.water_level import WaterLevel
from mqtt_config import client
import json
from logger import logger as logging


class SingletonMeta(type):
    """
    The Singleton class can be implemented in different ways in Python. Some
    possible methods include: base class, decorator, metaclass. We will use the
    metaclass because it is best suited for this purpose.
    """

    _instances = {}

    def __call__(cls, *args, **kwargs):
        """
        Possible changes to the value of the `__init__` argument do not affect
        the returned instance.
        """
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        return cls._instances[cls]


class WaterSensor:
    def __init__(self, port: int):
        water_port = port

        def onVoltageChange(self, voltage):
            voltage = float(voltage)
            client.publish(
                "sensors", json.dumps({"water_voltage": str(voltage)}), retain=True
            )

        logging.info("Connecting to water sensor...")
        if os.environ.get("BASE_TEST", "false") == "true":
            logging.info("Connected to Knob Water sensor")
            self.water_sensor = Knob(port=water_port, onVoltageChange=onVoltageChange)
        else:
            logging.info("Connected to Water Level sensor")
            self.water_sensor = WaterLevel(
                port=water_port, onCurrentChange=onVoltageChange
            )
        logging.info("Connection to water sensor complete.")
