import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from db import create_db_and_tables
from routes.auth import router as auth_router
from routes.chat import router as chat_router
from routes.health import router as health_router
from routes.tasks import router as tasks_router

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(
    title="Todo Backend API",
    description="Backend API for the Todo Full-Stack Web Application",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:3000,https://*.github.io")
cors_origins = [origin.strip() for origin in cors_origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(tasks_router)
app.include_router(chat_router)


@app.get("/")
def root():
    return {"name": "Todo Backend API", "version": "1.0.0", "status": "running"}


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch unhandled exceptions and return a safe 500 response."""
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error"},
    )
