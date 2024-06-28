from pump_dosing import PumpDosing
from pump_mixing import PumpMixing
from pump_water_source import PumpWaterSource
from template_classes.relay import RelayChannel
from template_classes.water_sensor import WaterSensor
from prisma.models import base_station_ports


def get_sensor_ports(config: list[base_station_ports], conf: str) -> tuple[int, int]:
    port1 = [i for i in config if i.name == conf][0].microprocessor_port
    port2 = [i for i in config if i.name == conf][0].hub_port
    return (0 if port1 is None else port1, 0 if port2 is None else port2)


class BaseStation:
    def __init__(self, base_station_config: list[base_station_ports]):
        self.water_sensor = WaterSensor(
            get_sensor_ports(base_station_config, "WATERSENSOR")[0]
        )
        self.water_pump = PumpWaterSource(
            get_sensor_ports(base_station_config, "WATERPUMP")[0],
            get_sensor_ports(base_station_config, "WATERPUMP")[1],
        )
        self.dosing_pump = PumpDosing(base_station_config)
        self.mixing_pump = PumpMixing(
            get_sensor_ports(base_station_config, "MIXINGPUMP")[0],
            get_sensor_ports(base_station_config, "MIXINGPUMP")[1],
        )
        self.routing_valve = RelayChannel(
            get_sensor_ports(base_station_config, "ROUTINGVALVE")
        )
        self.routing_pump = RelayChannel(
            get_sensor_ports(base_station_config, "ROUTINGPUMP")
        )
        self.compressor = RelayChannel(
            get_sensor_ports(base_station_config, "COMPRESSOR")
        )

    def enable_dosing(self, doser: int):
        self.dosing_pump.enable_dosing(doser)

    def open_routing_valve(self):
        self.routing_valve.enable()

    def close_routing_value(self):
        self.routing_valve.disable()

    def enable_routing_pump(self):
        pass

    def close_routing_pump(self):
        pass

    def push_water_out():
        pass

    def stop_pushing_water_out():
        pass

    def check_events(zone):
        pass
