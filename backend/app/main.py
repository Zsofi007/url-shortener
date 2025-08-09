from app.routers import url
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import create_db_and_tables
from app.tasks.cleanup import startup_cleanup, periodic_cleanup
from contextlib import asynccontextmanager
import asyncio
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("App is starting up")
    create_db_and_tables()
    
    # Run initial cleanup
    await startup_cleanup()
    
    # Start background cleanup task
    cleanup_task = asyncio.create_task(periodic_cleanup(interval_hours=24))
    logger.info("Background cleanup task started")

    yield
    
    print("App is shutting down")
    # Cancel background task
    cleanup_task.cancel()
    try:
        await cleanup_task
    except asyncio.CancelledError:
        logger.info("Background cleanup task cancelled")

app = FastAPI(lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(url.router, prefix="", tags=["urls"])


@app.get("/")
def read_root():
    return {"message": "Hello World"}
