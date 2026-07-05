from fastapi import APIRouter
import cognee_service

router = APIRouter()


@router.get("/graph")
async def get_graph():
    try:
        graph_data = await cognee_service.get_graph_data()

        if graph_data and graph_data.get("nodes"):
            return graph_data

        # Fallback: build graph manually from Ambrish data
        nodes = []
        edges = []
        seen = {}

        key_entities = {
            "Ambrish": "person",
            "Elon Musk": "inspiration",
            "Feynman": "inspiration",
            "Einstein": "inspiration",
            "Oppenheimer": "inspiration",
            "Sundar Pichai": "inspiration",
            "Python": "skill",
            "Robotics": "field",
            "AI": "field",
            "Research Paper": "project",
            "Mathematics": "skill",
            "Machine Learning": "skill"
        }

        for label, node_type in key_entities.items():
            node_id = f"node_{len(nodes)}"
            seen[label] = node_id
            nodes.append({
                "id": node_id,
                "label": label,
                "type": node_type,
                "memoryCount": 5 if label == "Ambrish" else 1
            })

        connections = [
            ("Ambrish", "Elon Musk", "inspired_by"),
            ("Ambrish", "Feynman", "inspired_by"),
            ("Ambrish", "Einstein", "inspired_by"),
            ("Ambrish", "Oppenheimer", "inspired_by"),
            ("Ambrish", "Sundar Pichai", "inspired_by"),
            ("Ambrish", "Python", "learning"),
            ("Ambrish", "Robotics", "passionate_about"),
            ("Ambrish", "AI", "passionate_about"),
            ("Ambrish", "Research Paper", "working_on"),
            ("Ambrish", "Mathematics", "learning"),
            ("Ambrish", "Machine Learning", "learning")
        ]

        for i, (src, tgt, rel) in enumerate(connections):
            if src in seen and tgt in seen:
                edges.append({
                    "id": f"edge_{i}",
                    "source": seen[src],
                    "target": seen[tgt],
                    "relationship": rel
                })

        return {"nodes": nodes, "edges": edges}

    except Exception as e:
        return {
            "error": str(e),
            "nodes": [],
            "edges": []
        }
