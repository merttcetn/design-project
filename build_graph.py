import json

def build_and_save_adjacency(json_paths, output_path):
    graph = {}

    for path in json_paths:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        for edge in data["edges"]:
            src = edge["from"]
            dst = edge["to"]

            if src not in graph:
                graph[src] = []

            graph[src].append({
                "to": dst,
                "instruction": edge["instruction"],
                "type": edge.get("type", "corridor")
            })

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(graph, f, ensure_ascii=False, indent=4)


if __name__ == "__main__":
    build_and_save_adjacency(
        [
            # assume kat1 and kat3 are adjacent for this example
            "kat_3_edges.json",
            "kat_1_edges.json",
            "vertical_edges.json"
        ],
        "graph.json"
    )