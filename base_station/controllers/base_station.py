from controllers.pump_water_source import PumpWaterSource
from db import BaseStationConfig
from template_classes.relay import RelayChannel
from template_classes.water_sensor import WaterSensor
from logger import logger as logging


def get_sensor_ports(config: list[BaseStationConfig], conf: str) -> tuple[int, int]:
    port1 = [i for i in config if i.name == conf][0].microprocessor_port
    port2 = [i for i in config if i.name == conf][0].hub_port
    return (0 if port1 is None else port1, 0 if port2 is None else port2)


class BaseStation:
    def __init__(self, base_station_config: list[BaseStationConfig]):
        self.water_sensor = WaterSensor(
            get_sensor_ports(base_station_config, "WATERSENSOR")[0]
        )
        self.actionners = {
            "WATERPUMP": RelayChannel(
                ports=(
                    get_sensor_ports(base_station_config, "WATERPUMP")[0],
                    get_sensor_ports(base_station_config, "WATERPUMP")[1],
                )
            ),
            "DOSINGPUMP1": RelayChannel(
                ports=(
                    get_sensor_ports(base_station_config, "DOSINGPUMP1")[0],
                    get_sensor_ports(base_station_config, "DOSINGPUMP1")[1],
                )
            ),
            "DOSINGPUMP2": RelayChannel(
                ports=(
                    get_sensor_ports(base_station_config, "DOSINGPUMP2")[0],
                    get_sensor_ports(base_station_config, "DOSINGPUMP2")[1],
                )
            ),
            "DOSINGPUMP3": RelayChannel(
                ports=(
                    get_sensor_ports(base_station_config, "DOSINGPUMP3")[0],
                    get_sensor_ports(base_station_config, "DOSINGPUMP3")[1],
                )
            ),
            "DOSINGPUMP4": RelayChannel(
                ports=(
                    get_sensor_ports(base_station_config, "DOSINGPUMP4")[0],
                    get_sensor_ports(base_station_config, "DOSINGPUMP4")[1],
                )
            ),
            "MIXINGPUMP": RelayChannel(
                ports=(
                    get_sensor_ports(base_station_config, "MIXINGPUMP")[0],
                    get_sensor_ports(base_station_config, "MIXINGPUMP")[1],
                )
            ),
            "ROUTINGPUMP": RelayChannel(
                get_sensor_ports(base_station_config, "ROUTINGPUMP")
            ),
            "COMPRESSOR": RelayChannel(
                get_sensor_ports(base_station_config, "COMPRESSOR")
            ),
        }
        logging.info("Config loaded")

    def close(self):
        self.water_sensor.water_sensor.voltageInput.close()
        for actionner in self.actionners:
            self.actionners[actionner].digitalOutput1.close()

    def enable_routing_pump(self):
        pass

    def close_routing_pump(self):
        pass

    def push_water_out(self):
        pass

    def stop_pushing_water_out(self):
        pass

    def check_events(self, zone):
        pass
