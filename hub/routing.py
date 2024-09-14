class Routing:
    def __init__(self, routing_config, main_router):
        self.routing_config = routing_config
        self.main_router = main_router.name

    def get_nodes_and_neighbours(self) -> dict[str, list[str]]:
        ret = {}
        for routing in self.routing_config:
            if routing.src not in ret:
                ret[routing.src] = [routing.dst]
            else:
                ret[routing.src].append(routing.dst)
        ret["base_station"] = [self.main_router]
        return ret

    def get_path_to_zone(self, zone_name: str) -> list[tuple[str, str]]:
        vertices = self.get_nodes_and_neighbours()
        visited = []
        queue = [("base_station", [])]
        while queue != []:
            print(queue)
            to_visit, past_nodes = queue.pop()
            if to_visit in visited:
                continue
            visited.append(to_visit)
            for point in vertices[to_visit]:
                if point == zone_name:
                    return past_nodes + [(to_visit, point)]
                queue.append((point, past_nodes + [(to_visit, point)]))
