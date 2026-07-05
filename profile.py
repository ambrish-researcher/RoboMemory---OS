from fastapi import APIRouter
import cognee_service
import google.generativeai as genai
import os

router = APIRouter()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

cached_summary = ""


@router.get("/profile")
async def get_profile():
    try:
        memories = await cognee_service.recall(
            "Ambrish everything"
        )
        total = len(memories) if memories else 10

        return {
            "totalMemories": total,
            "name": "Ambrish",
            "categoryCounts": {
                "AI & Robotics": 3,
                "Research": 2,
                "Goals": 2,
                "Learning": 2,
                "Inspirations": 1
            },
            "topEntities": [
                "Ambrish",
                "Elon Musk",
                "Python",
                "Robotics",
                "Research Paper"
            ],
            "oldestMemoryDate": "2026-07-04",
            "summary": cached_summary
        }
    except Exception as e:
        return {"error": str(e)}, 500


@router.post("/profile/summarize")
async def summarize():
    global cached_summary
    try:
        memories = await cognee_service.recall(
            "Ambrish name goals research inspirations skills values mission"
        )

        if not memories:
            return {
                "summary": "Tell me more about yourself Ambrish!"
            }

        all_memories = "\n".join([str(m) for m in memories])

        prompt = f"""Based on these memories about Ambrish,
write a powerful inspiring profile summary in 3-4 paragraphs.
Highlight his passion for AI and robotics.
Mention his research paper about robots thinking independently.
Reference his inspirations: Elon Musk, Einstein, Feynman, Oppenheimer, Sundar Pichai.
Make it sound like a proud robot companion describing its owner.
Be motivating and visionary in tone.

Memories:
{all_memories}"""

        response = model.generate_content(prompt)
        cached_summary = response.text
        return {"summary": cached_summary}

    except Exception as e:
        return {"error": str(e)}, 500
