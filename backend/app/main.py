from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import resume

app = FastAPI(title="Re-Po Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router)

@app.get("/")
def root(): return {"message": "Re-Po Generator API ✅"}

@app.get("/health")
def health(): return {"status": "ok"}