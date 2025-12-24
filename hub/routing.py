from db import RoutersConfig, RoutingConfig, BaseStationConfig
from collections import deque
from logger import logger as logging


class Routing:
    def __init__(
        self,
        routing_config: list[RoutingConfig],
        main_router,
        routers: list[RoutersConfig],
        base_station_config: list[BaseStationConfig],
    ):
        self.routing_config = routing_config
        self.routers = routers
        self.main_router = main_router.name
        self.routing_table = self.get_nodes_and_neighbours()
        self.base_station_config = base_station_config

    def get_nodes_and_neighbours(self) -> dict[str, list[str]]:
        ret = {}
        for routing in self.routing_config:
            if routing.src not in ret:
                ret[routing.src] = [routing.dst]
            else:
                ret[routing.src].append(routing.dst)
        ret["base_station"] = [self.main_router]
        return ret

    def base_station_to_router_port(self, router_name):
        for router in self.routers:
            if router_name == router.name:
                print(router.base_station_valve_port1, router.base_station_valve_port2)
                return (
                    router.base_station_valve_port1,
                    router.base_station_valve_port2,
                )

    def base_station_valve_name(self, router_name):
        router_port = self.base_station_to_router_port(router_name)
        for bs in self.base_station_config:
            if (
                bs.microprocessor_port == router_port[0]
                and bs.hub_port == router_port[1]
            ):
                return bs.name

    def get_path_to_zone(self, zone_name: str) -> list[tuple[str, str]]:

        queue = deque(
            [("base_station", [])]
        )  # Each entry is (current_node, list_of_tuples)
        visited = set()  # To avoid revisiting nodes

        logging.info("Routing table is " + str(self.routing_table))

        while queue:
            logging.info("Queue is " + str(queue))
            current_node, path = (
                queue.popleft()
            )  # Get the next node and its path (list of tuples)
            if current_node in visited:
                continue  # Skip if already visited

            visited.add(current_node)  # Mark the node as visited

            # Check if the destination is directly reachable from the current node
            for neighbor in self.routing_table.get(current_node, []):
                new_path = path + [(current_node, neighbor)]  # Add the hop as a tuple
                if neighbor == zone_name:
                    logging.info("Found path")
                    logging.info("Constructed path is:" + str(new_path))
                    return new_path  # Return the path as tuples

                # Add the neighbor to the queue
                if neighbor not in visited:
                    queue.append((neighbor, new_path))

        return None  # Return None if no route is found
