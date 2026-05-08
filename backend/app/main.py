from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routes import auth, appointments, admin, barber, public
from app.config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Schedule API",
    description="Sistema de Agendamento para Barbearias",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(appointments.router)
app.include_router(admin.router)
app.include_router(barber.router)
app.include_router(public.router)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/")
def root():
    return {
        "message": "Smart Schedule API",
        "docs": "/docs",
        "redoc": "/redoc",
        "version": "1.0.0",
        "status": "online"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
