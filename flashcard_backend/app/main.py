from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import flashcards

app = FastAPI(title="Flashcard API", version="1.0.0")

# Allow the Vite dev server (port 5173) and any other local origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(flashcards.router)


@app.get("/")
def root():
    return {"message": "Flashcard API is running"}
