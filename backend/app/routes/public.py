from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api", tags=["public"])

@router.get("/services", response_model=List[schemas.ServiceResponse])
def list_services(db: Session = Depends(get_db)):
    services = db.query(models.Service).all()
    return services

@router.get("/barbershops", response_model=List[schemas.BarbershopResponse])
def list_barbershops(db: Session = Depends(get_db)):
    barbershops = db.query(models.Barbershop).all()
    return barbershops

@router.get("/health")
def health_check():
    return {"status": "ok"}
