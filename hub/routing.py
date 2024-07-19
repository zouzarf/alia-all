from db import routing_config, main_router


def routing_to_vertices() -> dict[str, list[str]]:
    ret = {}
    for routing in routing_config:
        if routing.src not in ret:
            ret[routing.src] = [routing.dst]
        else:
            ret[routing.src].append(routing.dst)
    ret["base_station"] = [main_router.name]
    return ret


def find_zone(node: str) -> list[tuple[str, str]]:
    vertices = routing_to_vertices()
    visited = []
    queue = [("base_station", [])]
    while queue != []:
        print(queue)
        to_visit, past_nodes = queue.pop()
        if to_visit in visited:
            continue
        visited.append(to_visit)
        for point in vertices[to_visit]:
            if point == node:
                return past_nodes + [(to_visit, point)]
            queue.append((point, past_nodes + [(to_visit, point)]))
