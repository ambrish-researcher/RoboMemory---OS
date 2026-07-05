import cognee
import os
from dotenv import load_dotenv

load_dotenv()


async def initialize_cognee():
    cognee_key = os.getenv("COGNEE_API_KEY")
    if cognee_key:
        await cognee.config.set_cognee_api_key(
            cognee_key
        )
    await cognee.config.set_llm_config({
        "provider": "google",
        "model": "gemini-1.5-flash",
        "api_key": os.getenv("GEMINI_API_KEY")
    })


async def remember(
    text: str,
    dataset_name: str = "ambrish_memories"
):
    await cognee.remember(
        text,
        dataset_name=dataset_name
    )


async def recall(query: str):
    try:
        results = await cognee.recall(query)
        return results if results else []
    except Exception:
        return []


async def improve():
    await cognee.improve()


async def forget(dataset_name: str):
    await cognee.forget(dataset=dataset_name)


async def get_graph_data():
    try:
        graph = await cognee.get_graph_summary()
        return graph
    except Exception:
        return {"nodes": [], "edges": []}
