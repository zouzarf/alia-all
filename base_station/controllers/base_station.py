import time
from pump_dosing import PumpDosing
from pump_mixing import PumpMixing
from pump_water_source import PumpWaterSource
from template_classes.relay import RelayChannel
from template_classes.water_sensor import WaterSensor
from router import find_path
import json
from prisma.models import base_station_ports


class BaseStation:
    def __init__(self, base_station_config: list[base_station_ports]):
        self.water_sensor = WaterSensor(
            [i for i in base_station_config if i.name == "WATERSENSOR"][
                0
            ].microprocessor_port
        )
        self.water_pump = PumpWaterSource(
            [i for i in base_station_config if i.name == "WATERPUMP"][
                0
            ].microprocessor_port,
            [i for i in base_station_config if i.name == "WATERPUMP"][0].hub_port,
        )
        self.dosing_pump = PumpDosing(base_station_config)
        self.mixing_pump = PumpMixing(
            [i for i in base_station_config if i.name == "MIXINGPUMP"][
                0
            ].microprocessor_port,
            [i for i in base_station_config if i.name == "MIXINGPUMP"][0].hub_port,
        )
        self.routing_valve = RelayChannel(
            (
                [i for i in base_station_config if i.name == "ROUTINGVALVE"][
                    0
                ].microprocessor_port,
                [i for i in base_station_config if i.name == "ROUTINGVALVE"][
                    0
                ].hub_port,
            )
        )
        self.routing_pump = RelayChannel(
            (
                [i for i in base_station_config if i.name == "ROUTINGPUMP"][
                    0
                ].microprocessor_port,
                [i for i in base_station_config if i.name == "ROUTINGPUMP"][0].hub_port,
            )
        )
        self.compressor = RelayChannel(
            (
                [i for i in base_station_config if i.name == "COMPRESSOR"][
                    0
                ].microprocessor_port,
                [i for i in base_station_config if i.name == "COMPRESSOR"][0].hub_port,
            )
        )

    def fill_reservoir(self, value, fill_wait):
        self.water_pump.fill(value, fill_wait)

    def mix(self, mixing_time, wait_event):
        # self.water_pump.enable_mixing()
        print(f"-- mixing pump -- starting mixing for {int(mixing_time)*60} seconds")
        self.mixing_pump.enable_mixing()
        wait_event.wait(timeout=int(mixing_time) * 60)
        wait_event.clear()
        self.mixing_pump.disable_mixing()
        print(f"-- mixing pump -- mixing done")
        # self.water_pump.disable_mixing()

    def dose(self, doser, amount, wait_event):
        self.dosing_pump.dose(doser, amount, wait_event)

    def route(
        self,
        zone,
        stop_command,
        routing_time,
        compressing_time,
        mqtt_client,
        routers_lister,
    ):
        global routes
        route = find_path(zone, routes)
        if route is None:
            print("## ERROR ## couldn't find a route !!")
        # open valves
        else:
            for r in route:
                if r[0] != "base_station":
                    mqtt_client.publish(
                        r[0] + "_commands",
                        json.dumps({"command": "OPEN_VALVE", "value": r[1]}),
                        1,
                    )
                    print(f"-- {r[0]} -- : opening valve ...")
                    routers_lister[r[0]]["OPEN_VALVE"].wait()
                    print(f"-- {r[0]} -- : valve opened")
                    routers_lister[r[0]]["OPEN_VALVE"].clear()
            print(f"-- base station -- opening valve ...")
            self.open_routing_valve()
            print(f"-- base station -- valve opened")
            # open pumps

            for r in route:
                if r[0] != "base_station":
                    print(f"-- {r[0]} -- : activating pump ...")
                    mqtt_client.publish(
                        r[0] + "_commands",
                        json.dumps({"command": "PUMP", "value": "OPEN"}),
                        1,
                    )
                    routers_lister[r[0]]["OPEN_PUMP"].wait(timeout=2)
                    print(f"-- {r[0]} -- : pump activated")
                    routers_lister[r[0]]["OPEN_PUMP"].clear()

            print(f"-- base station -- enabling pump...")
            self.routing_pump.enable()
            print(f"-- base station -- pump enabled!")
            stop_command.wait(timeout=int(routing_time))
            stop_command.clear()

            # CLOSE PUMP BASE STATION PUMP
            self.routing_pump.disable()

            # START COMPRESSOR
            self.compressor.enable()
            stop_command.wait(timeout=int(compressing_time))
            stop_command.clear()
            self.compressor.disable()
            for r in route:
                if r[0] != "base_station":
                    print(f"-- {r[0]} -- : closing pump ...")
                    mqtt_client.publish(
                        r[0] + "_commands",
                        json.dumps({"command": "PUMP", "value": "CLOSE"}),
                        1,
                    )
                    routers_lister[r[0]]["CLOSE_PUMP"].wait(timeout=2)
                    print(f"-- {r[0]} -- : pump closed ...")
                    routers_lister[r[0]]["CLOSE_PUMP"].clear()

            print(f"-- base station -- disabling pump...")
            self.routing_valve.disable()
            print(f"-- base station -- pump disabled...")

            # CLOSE VALVES
            for r in route:
                if r[0] != "base_station":
                    print(f"-- {r[0]} -- : closing valve ...")
                    mqtt_client.publish(
                        r[0] + "_commands",
                        json.dumps({"command": "CLOSE_VALVE", "value": r[1]}),
                        1,
                    )
                    routers_lister[r[0]]["CLOSE_VALVE"].wait(timeout=2)
                    print(f"-- {r[0]} -- : valve closed ...")
                    routers_lister[r[0]]["CLOSE_VALVE"].clear()

    def command_routers(
        routers_list, command, mqtt_client, routers_listener, timeout=2
    ):
        for r in routers_list:
            if r[0] != "base_station":
                print(f"-- {r[0]} -- : sending command {command} ...")
                mqtt_client.publish(
                    r[0] + "_commands",
                    json.dumps({"command": command, "value": r[1]}),
                    1,
                )
                routers_listener[r[0]][command].wait(timeout=timeout)
                print(f"-- {r[0]} -- : {command} ack ...")
                routers_listener[r[0]][command].clear()

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
