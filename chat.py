from fastapi import APIRouter
from models import ChatRequest
import cognee_service
import google.generativeai as genai
import os
import uuid

router = APIRouter()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")


@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        # Step 1: Recall relevant memories from Cognee
        recalled = await cognee_service.recall(
            request.message
        )

        # Step 2: Format recalled memories into text
        memory_text = ""
        recalled_list = []

        if recalled:
            for item in recalled:
                content = str(item)
                memory_text += content + "\n"
                recalled_list.append({
                    "content": content,
                    "confidence": 0.90
                })

        # Step 3: Build prompt with memory context
        if memory_text:
            full_prompt = f"""You are ROBO, Ambrish's personal AI robot assistant with permanent memory.

You know everything about Ambrish:
{memory_text}

Personality rules:
- Talk like a loyal intelligent robot companion
- You genuinely know Ambrish deeply
- Reference his goals, research, inspirations naturally
- Never say "according to my memory"
- Be encouraging about his AI and robotics journey
- Mention his research paper when relevant
- Call him Ambrish naturally in conversation

Conversation so far:
"""
        else:
            full_prompt = """You are ROBO, Ambrish's personal AI robot assistant.
Be helpful, intelligent, and encouraging.

Conversation so far:
"""

        # Step 4: Add conversation history
        for msg in request.conversation_history:
            role = "Ambrish" if msg["role"] == "user" else "ROBO"
            full_prompt += f"{role}: {msg['content']}\n"

        full_prompt += f"Ambrish: {request.message}\nROBO:"

        # Step 5: Call Gemini
        response = model.generate_content(full_prompt)
        ai_reply = response.text

        # Step 6: Save user message to Cognee memory
        await cognee_service.remember(request.message)

        # Step 7: Return response to frontend
        return {
            "response": ai_reply,
            "recalled_memories": recalled_list,
            "message_id": str(uuid.uuid4())
        }

    except Exception as e:
        return {"error": str(e)}, 500
