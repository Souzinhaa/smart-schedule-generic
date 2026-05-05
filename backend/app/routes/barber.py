from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/barber", tags=["barber"])

@router.post("/work-hours", response_model=schemas.WorkHoursResponse)
def create_work_hours(
    work_hours: schemas.WorkHoursCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    barber = db.query(models.Barber).filter(models.Barber.user_id == current_user.id).first()
    if not barber:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

    new_work_hours = models.WorkHours(
        barber_id=barber.id,
        day_of_week=work_hours.day_of_week,
        start_time=work_hours.start_time,
        end_time=work_hours.end_time
    )
    db.add(new_work_hours)
    db.commit()
    db.refresh(new_work_hours)

    return new_work_hours

@router.get("/work-hours", response_model=List[schemas.WorkHoursResponse])
def list_work_hours(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    barber = db.query(models.Barber).filter(models.Barber.user_id == current_user.id).first()
    if not barber:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

    work_hours = db.query(models.WorkHours).filter(
        models.WorkHours.barber_id == barber.id
    ).all()

    return work_hours

@router.put("/work-hours/{work_hours_id}", response_model=schemas.WorkHoursResponse)
def update_work_hours(
    work_hours_id: int,
    update: schemas.WorkHoursUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    barber = db.query(models.Barber).filter(models.Barber.user_id == current_user.id).first()
    if not barber:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

    work_hours = db.query(models.WorkHours).filter(
        models.WorkHours.id == work_hours_id,
        models.WorkHours.barber_id == barber.id
    ).first()

    if not work_hours:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    if update.start_time:
        work_hours.start_time = update.start_time
    if update.end_time:
        work_hours.end_time = update.end_time

    db.commit()
    db.refresh(work_hours)

    return work_hours

@router.delete("/work-hours/{work_hours_id}")
def delete_work_hours(
    work_hours_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    barber = db.query(models.Barber).filter(models.Barber.user_id == current_user.id).first()
    if not barber:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

    work_hours = db.query(models.WorkHours).filter(
        models.WorkHours.id == work_hours_id,
        models.WorkHours.barber_id == barber.id
    ).first()

    if not work_hours:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    db.delete(work_hours)
    db.commit()

    return {"message": "Work hours deleted"}

@router.get("/stats", response_model=schemas.BarberStats)
def get_barber_stats(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    barber = db.query(models.Barber).filter(models.Barber.user_id == current_user.id).first()
    if not barber:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

    total_appointments = db.query(func.count(models.Appointment.id)).filter(
        models.Appointment.barber_id == barber.id
    ).scalar() or 0

    completed_appointments = db.query(func.count(models.Appointment.id)).filter(
        models.Appointment.barber_id == barber.id,
        models.Appointment.status == models.AppointmentStatus.completed
    ).scalar() or 0

    total_revenue = db.query(func.sum(models.Service.price)).join(
        models.Appointment, models.Service.id == models.Appointment.service_id
    ).filter(
        models.Appointment.barber_id == barber.id,
        models.Appointment.status == models.AppointmentStatus.completed
    ).scalar() or 0

    this_month = datetime.utcnow().replace(day=1)
    this_month_appointments = db.query(func.count(models.Appointment.id)).filter(
        models.Appointment.barber_id == barber.id,
        models.Appointment.appointment_date >= this_month
    ).scalar() or 0

    return {
        "total_appointments": total_appointments,
        "completed_appointments": completed_appointments,
        "total_revenue": total_revenue,
        "this_month_appointments": this_month_appointments
    }
