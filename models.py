from pydantic import BaseModel
from typing import List, Optional


class ChatRequest(BaseModel):
    message: str
    conversation_history: List[dict] = []


class RememberRequest(BaseModel):
    text: str
    dataset_name: str = "ambrish_memories"


class IngestTextRequest(BaseModel):
    text: str
