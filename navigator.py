import json
import heapq


def load_graph(graph_path):
    with open(graph_path, "r", encoding="utf-8") as f:
        return json.load(f)


def get_preference_cost(avoid_stairs=True):
    if avoid_stairs:
        return {
            "corridor": 1,
            "elevator": 1,
            "stairs": 1e9   # avoid stairs
        }
    else:
        return {
            "corridor": 1,
            "elevator": 1,
            "stairs": 1     # equal cost
        }


def dijkstra(graph, start, goal, preference_cost):
    heap = [(0, start)]
    distances = {start: 0}
    parent = {start: None}

    while heap:
        current_cost, current = heapq.heappop(heap)

        if current == goal:
            break

        for edge in graph.get(current, []):
            nxt = edge["to"]
            edge_type = edge.get("type", "corridor")

            cost = preference_cost.get(edge_type, 1)
            new_cost = current_cost + cost

            if nxt not in distances or new_cost < distances[nxt]:
                distances[nxt] = new_cost
                parent[nxt] = current
                heapq.heappush(heap, (new_cost, nxt))

    if goal not in parent:
        return None

    path = []
    node = goal
    while node:
        path.append(node)
        node = parent[node]

    return path[::-1]


def get_instructions(graph, path):
    instructions = []

    for i in range(len(path) - 1):
        current = path[i]
        nxt = path[i + 1]

        for edge in graph[current]:
            if edge["to"] == nxt:
                instructions.append(edge["instruction"])
                break

    return instructions


def find_route(graph_path, start, goal, avoid_stairs=True):
    graph = load_graph(graph_path)

    all_nodes = set(graph.keys())
    for edges in graph.values():
        for edge in edges:
            all_nodes.add(edge["to"])

    if start not in all_nodes:
        print(f"Hata: '{start}' düğümü grafta bulunamadı.")
        return None
    if goal not in all_nodes:
        print(f"Hata: '{goal}' düğümü grafta bulunamadı.")
        return None

    if start == goal:
        print("Zaten hedef konumdasınız.")
        return {"path": [start], "instructions": []}

    preference_cost = get_preference_cost(avoid_stairs)

    path = dijkstra(graph, start, goal, preference_cost)

    if not path:
        print("No path found")
        return None

    instructions = get_instructions(graph, path)

    print("Path:", " -> ".join(path))
    print("\nInstructions:")
    for i, instr in enumerate(instructions, 1):
        print(f"{i}- {instr}")

    return {"path": path, "instructions": instructions}


# Example usage
if __name__ == "__main__":
    find_route("graph.json", "KAT3_2", "KAT1_8", avoid_stairs=True)