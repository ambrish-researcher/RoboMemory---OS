from fastapi import APIRouter
from models import RememberRequest
import cognee_service

router = APIRouter()


def categorize(text: str) -> str:
    t = text.lower()
    if any(w in t for w in [
        "elon", "sundar", "feynman", "einstein",
        "oppenheimer", "inspiration", "inspired"
    ]):
        return "Inspirations"
    elif any(w in t for w in [
        "research", "paper", "robot think",
        "environment", "predict", "ongoing"
    ]):
        return "Research"
    elif any(w in t for w in [
        "goal", "long-term", "company",
        "mission", "build", "develop"
    ]):
        return "Goals"
    elif any(w in t for w in [
        "learning", "python", "mathematics",
        "machine learning", "mastering", "skill"
    ]):
        return "Learning"
    elif any(w in t for w in [
        "value", "curiosity", "experimentation",
        "problem-solving"
    ]):
        return "Values"
    elif any(w in t for w in [
        "robotics", "artificial intelligence",
        "intelligent systems", "autonomous"
    ]):
        return "AI & Robotics"
    else:
        return "General"


def extract_entities(text: str) -> list:
    important = [
        "Ambrish", "Elon", "Musk", "Sundar",
        "Pichai", "Feynman", "Einstein",
        "Oppenheimer", "Python", "AI", "Robotics"
    ]
    found = []
    for word in important:
        if word.lower() in text.lower():
            found.append(word)
    return found[:5]


@router.get("/memories")
async def get_memories(search: str = None):
    try:
        query = search if search else \
            "Ambrish goals research inspirations skills"
        results = await cognee_service.recall(query)

        memories = []
        if results:
            for i, item in enumerate(results):
                content = str(item)
                memories.append({
                    "id": f"mem_{i}",
                    "content": content,
                    "category": categorize(content),
                    "timestamp": "2026-07-04",
                    "entities": extract_entities(content),
                    "datasetId": "ambrish_memories"
                })

        return {"memories": memories}

    except Exception as e:
        return {"error": str(e)}, 500


@router.post("/memories/remember")
async def remember(request: RememberRequest):
    try:
        await cognee_service.remember(
            request.text,
            request.dataset_name
        )
        return {"status": "success"}
    except Exception as e:
        return {"error": str(e)}, 500


@router.post("/memories/improve")
async def improve():
    try:
        await cognee_service.improve()
        return {
            "status": "success",
            "message": "ROBO memory strengthened"
        }
    except Exception as e:
        return {"error": str(e)}, 500


@router.delete("/memories/{dataset_id}")
async def forget(dataset_id: str):
    try:
        await cognee_service.forget(dataset_id)
        return {"status": "success"}
    except Exception as e:
        return {"error": str(e)}, 500
