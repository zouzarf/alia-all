def find_zone(node, vertices: dict[str, list[str]]) -> list[tuple[str, str]]:
    visited = []
    queue = [("base_station", [])]
    while queue != []:
        to_visit, past_nodes = queue.pop()
        if to_visit in visited:
            continue
        visited.append(to_visit)
        for point in vertices[to_visit]:
            if point == node:
                return past_nodes + [(to_visit, point)]
            queue.append((point, past_nodes + [(to_visit, point)]))
