from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv

load_dotenv()

from cognee_service import initialize_cognee
from seed import seed_if_empty
from routes import chat, memories, graph, profile, ingest


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("ROBO is waking up...")
    await initialize_cognee()
    await seed_if_empty()
    print("ROBO is ready. Memory online.")
    yield
    print("ROBO going to sleep.")


app = FastAPI(
    title="RoboMemoryOS API",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(chat.router, prefix="/api")
app.include_router(memories.router, prefix="/api")
app.include_router(graph.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
app.include_router(ingest.router, prefix="/api")


@app.get("/")
async def root():
    return {
        "message": "RoboMemoryOS is online",
        "owner": "Ambrish",
        "status": "Memory active",
        "tracks": ["Open Source", "Cognee Cloud"]
    }
