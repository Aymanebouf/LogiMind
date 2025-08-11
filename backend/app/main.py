from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .utils.logging import setup_logging
from .routers import health, ingest
from .routers import read  # <— nouveau

# Initialisation du logging
setup_logging()

# App FastAPI
app = FastAPI(title="LogiMind Backend", version="0.1.0")

# CORS (dev) — Vite tourne sur 8080
origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://192.168.8.110:8080",  # ton IP LAN vue dans Vite
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(health.router)
app.include_router(ingest.router)
app.include_router(read.router, prefix="/read", tags=["read"])

# Healthcheck
@app.get("/", tags=["health"])
def root():
    return {"status": "ok", "service": "LogiMind Backend"}
