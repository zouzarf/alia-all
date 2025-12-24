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
        self.actionners = {
            "WATERPUMP1": RelayChannel(
                ports=(
                    get_sensor_ports(base_station_config, "WATERPUMP1")[0],
                    get_sensor_ports(base_station_config, "WATERPUMP1")[1],
                )
            ),
            "WATERPUMP2": RelayChannel(
                ports=(
                    get_sensor_ports(base_station_config, "WATERPUMP2")[0],
                    get_sensor_ports(base_station_config, "WATERPUMP2")[1],
                )
            ),
            "WATERPUMP3": RelayChannel(
                ports=(
                    get_sensor_ports(base_station_config, "WATERPUMP3")[0],
                    get_sensor_ports(base_station_config, "WATERPUMP3")[1],
                )
            ),
            "WATERPUMP4": RelayChannel(
                ports=(
                    get_sensor_ports(base_station_config, "WATERPUMP4")[0],
                    get_sensor_ports(base_station_config, "WATERPUMP4")[1],
                )
            ),
            "VALVE1": RelayChannel(
                ports=(
                    get_sensor_ports(base_station_config, "VALVE1")[0],
                    get_sensor_ports(base_station_config, "VALVE1")[1],
                )
            ),
            "VALVE2": RelayChannel(
                ports=(
                    get_sensor_ports(base_station_config, "VALVE2")[0],
                    get_sensor_ports(base_station_config, "VALVE2")[1],
                )
            ),
            "VALVE3": RelayChannel(
                ports=(
                    get_sensor_ports(base_station_config, "VALVE3")[0],
                    get_sensor_ports(base_station_config, "VALVE3")[1],
                )
            ),
            "VALVE4": RelayChannel(
                ports=(
                    get_sensor_ports(base_station_config, "VALVE4")[0],
                    get_sensor_ports(base_station_config, "VALVE4")[1],
                )
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
