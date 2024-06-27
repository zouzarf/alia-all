from template_classes.knob import Knob
from template_classes.water_level import WaterLevel
from mqtt_config import client
from read_yaml import parse_config
import sys


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


global ws


class WaterSensor(metaclass=SingletonMeta):
    def __init__(self, port: int):
        water_port = port

        def onVoltageChange(self, voltage):
            global ws
            wl = round((float(voltage) * 1000 - 4) / 16 * 100, 2)
            client.publish("water_level", str(wl), retain=True)
            if "ws" in globals():
                ws.water_level = wl

        self.water_level = -1
        print("-- water sensor -- connecting")
        # self.water_sensor = Knob(port=water_port,onVoltageChange=onVoltageChange)
        self.water_sensor = WaterLevel(port=water_port, onCurrentChange=onVoltageChange)
        print("-- water sensor -- connected")

    def get_water_level(self):
        return self.water_level


base_station_ip = sys.argv[1]
config, _, _, _ = parse_config(base_station_ip)
ws = WaterSensor(config["BASESTATION"])
