from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.llm_client import get_active_provider
from app.routes.chat import router as chat_router
from app.routes.translate import router as translate_router

app = FastAPI(title="EDI AI Assistant Service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(translate_router)


@app.on_event("startup")
def startup_provider_log() -> None:
    provider = get_active_provider()
    if provider["provider"] == "ollama":
        print(f"AI Provider: Ollama (model: {provider['model']})", flush=True)
    else:
        print("AI Provider: Gemini", flush=True)


@app.get("/provider")
def provider() -> dict:
    return get_active_provider()


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "ai"}
