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
from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.utils.api_response import fail, ok

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("App starting up")
    create_tables()
    
    # Run initial cleanup
    await startup_cleanup()
    
    # Start background cleanup task
    cleanup_task = asyncio.create_task(periodic_cleanup(interval_hours=24))
    logger.info("Background cleanup task started")

    yield
    
    logger.info("App shutting down")
    # Cancel background task
    cleanup_task.cancel()
    try:
        await cleanup_task
    except asyncio.CancelledError:
        logger.info("Background cleanup task cancelled")

app = FastAPI(lifespan=lifespan)

# Standardize error responses
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(_: Request, exc: StarletteHTTPException):
    return JSONResponse(status_code=exc.status_code, content=fail(str(exc.detail)))


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_: Request, exc: RequestValidationError):
    # Keep it human-readable for the UI; detailed errors can be logged later if needed
    return JSONResponse(status_code=422, content=fail("Invalid request"))


@app.exception_handler(Exception)
async def unhandled_exception_handler(_: Request, exc: Exception):
    logger.exception("Unhandled error")
    return JSONResponse(status_code=500, content=fail("Internal server error"))

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define health endpoint before including routers
@app.get("/health/health")
def health_check():
    return ok({"status": "healthy", "port": os.getenv("PORT", "8000")})

# Include routes
app.include_router(url.router, prefix="", tags=["urls"])
app.include_router(auth.router)


@app.get("/")
def read_root():
    return ok({"message": "OK"})
