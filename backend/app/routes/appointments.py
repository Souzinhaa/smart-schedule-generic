from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/appointments", tags=["appointments"])

@router.post("/", response_model=schemas.AppointmentResponse)
def create_appointment(
    appointment: schemas.AppointmentCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    service = db.query(models.Service).filter(models.Service.id == appointment.service_id).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")

    barbershop = db.query(models.Barbershop).filter(
        models.Barbershop.id == service.barbershop_id
    ).first()

    if not barbershop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Barbershop not found")

    barber = db.query(models.Barber).filter(
        models.Barber.barbershop_id == barbershop.id
    ).first()

    if not barber:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No barber available")

    new_appointment = models.Appointment(
        client_id=current_user.id,
        barber_id=barber.id,
        barbershop_id=barbershop.id,
        service_id=service.id,
        appointment_date=appointment.appointment_date,
        notes=appointment.notes
    )
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)

    return new_appointment

@router.get("/", response_model=List[schemas.AppointmentResponse])
def list_appointments(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    appointments = db.query(models.Appointment).filter(
        models.Appointment.client_id == current_user.id
    ).all()
    return appointments

@router.get("/{appointment_id}", response_model=schemas.AppointmentResponse)
def get_appointment(
    appointment_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id,
        models.Appointment.client_id == current_user.id
    ).first()

    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    return appointment

@router.patch("/{appointment_id}", response_model=schemas.AppointmentResponse)
def update_appointment(
    appointment_id: int,
    update: schemas.AppointmentUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id,
        models.Appointment.client_id == current_user.id
    ).first()

    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    if update.status:
        appointment.status = update.status
    if update.notes is not None:
        appointment.notes = update.notes
    if update.confirmed is not None:
        appointment.confirmed = update.confirmed

    db.commit()
    db.refresh(appointment)

    return appointment

@router.delete("/{appointment_id}")
def cancel_appointment(
    appointment_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id,
        models.Appointment.client_id == current_user.id
    ).first()

    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    appointment.status = models.AppointmentStatus.cancelled
    db.commit()

    return {"message": "Appointment cancelled"}
