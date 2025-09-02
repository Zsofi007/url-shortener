from app.routers import url, auth
from app.config import settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import create_tables
from app.tasks.cleanup import startup_cleanup, periodic_cleanup
from contextlib import asynccontextmanager
import asyncio
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("App is starting up")
    create_tables()
    
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
    allow_origins=[
        settings.BASE_URL_FRONTEND,  # Production frontend
        "http://localhost:3000",     # Local development
        "http://localhost:5173",     # Vite dev server
        "*",                         # Allow all origins for now (can be restricted later)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define health endpoint before including routers
@app.get("/health/health")
def health_check():
    return {"status": "healthy", "port": os.getenv("PORT", "8000")}

# Include routes
app.include_router(url.router, prefix="", tags=["urls"])
app.include_router(auth.router)


@app.get("/")
def read_root():
    return {"message": "Hello World"}
