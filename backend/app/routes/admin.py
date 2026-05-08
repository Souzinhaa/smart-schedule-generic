from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from datetime import datetime
from typing import List
from pydantic import BaseModel
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/admin", tags=["admin"])

class BarbershopCreate(BaseModel):
    name: str
    address: str
    phone: str
    city: str
    state: str

class BarberAdd(BaseModel):
    whatsapp: str
    name: str
    specialty: str | None = None

@router.post("/setup", response_model=schemas.BarbershopResponse, summary="Create barbershop for admin")
def setup_barbershop(
    data: BarbershopCreate,
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    existing = db.query(models.Barbershop).filter(
        models.Barbershop.admin_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Barbershop already exists")

    barbershop = models.Barbershop(
        name=data.name,
        address=data.address,
        phone=data.phone,
        city=data.city,
        state=data.state,
        admin_id=current_user.id
    )
    db.add(barbershop)
    db.commit()
    db.refresh(barbershop)
    return barbershop

@router.post("/barbers", response_model=schemas.BarberResponse, summary="Add barber to barbershop")
def add_barber(
    data: BarberAdd,
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    barbershop = db.query(models.Barbershop).filter(
        models.Barbershop.admin_id == current_user.id
    ).first()
    if not barbershop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Barbershop not found")

    barber_user = db.query(models.User).filter(models.User.whatsapp == data.whatsapp).first()
    if not barber_user:
        barber_user = models.User(
            whatsapp=data.whatsapp,
            name=data.name,
            role=models.UserRole.barber
        )
        db.add(barber_user)
        db.flush()
    else:
        barber_user.role = models.UserRole.barber
        barber_user.name = data.name

    existing_barber = db.query(models.Barber).filter(models.Barber.user_id == barber_user.id).first()
    if existing_barber:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Barber already exists")

    barber = models.Barber(
        user_id=barber_user.id,
        barbershop_id=barbershop.id,
        specialty=data.specialty
    )
    db.add(barber)
    db.commit()

    barber = db.query(models.Barber).options(
        joinedload(models.Barber.user),
        joinedload(models.Barber.work_hours)
    ).filter(models.Barber.id == barber.id).first()
    return barber

@router.get("/dashboard", response_model=schemas.DashboardStats)
def get_dashboard(
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    barbershop = db.query(models.Barbershop).filter(
        models.Barbershop.admin_id == current_user.id
    ).first()

    if not barbershop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    total_appointments = db.query(func.count(models.Appointment.id)).filter(
        models.Appointment.barbershop_id == barbershop.id
    ).scalar() or 0

    total_revenue = db.query(func.sum(models.Service.price)).join(
        models.Appointment, models.Service.id == models.Appointment.service_id
    ).filter(
        models.Appointment.barbershop_id == barbershop.id,
        models.Appointment.status == models.AppointmentStatus.completed
    ).scalar() or 0

    active_barbers = db.query(func.count(models.Barber.id)).filter(
        models.Barber.barbershop_id == barbershop.id
    ).scalar() or 0

    pending_appointments = db.query(func.count(models.Appointment.id)).filter(
        models.Appointment.barbershop_id == barbershop.id,
        models.Appointment.status == models.AppointmentStatus.pending
    ).scalar() or 0

    completed_appointments = db.query(func.count(models.Appointment.id)).filter(
        models.Appointment.barbershop_id == barbershop.id,
        models.Appointment.status == models.AppointmentStatus.completed
    ).scalar() or 0

    return {
        "total_appointments": total_appointments,
        "total_revenue": total_revenue or 0,
        "active_barbers": active_barbers,
        "pending_appointments": pending_appointments,
        "completed_appointments": completed_appointments
    }

@router.get("/barbershop", response_model=schemas.BarbershopResponse)
def get_barbershop(
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    barbershop = db.query(models.Barbershop).filter(
        models.Barbershop.admin_id == current_user.id
    ).first()

    if not barbershop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    return barbershop

@router.put("/barbershop", response_model=schemas.BarbershopResponse)
def update_barbershop(
    update: schemas.BarbershopUpdate,
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    barbershop = db.query(models.Barbershop).filter(
        models.Barbershop.admin_id == current_user.id
    ).first()

    if not barbershop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    if update.name:
        barbershop.name = update.name
    if update.address:
        barbershop.address = update.address
    if update.phone:
        barbershop.phone = update.phone
    if update.city:
        barbershop.city = update.city
    if update.state:
        barbershop.state = update.state

    db.commit()
    db.refresh(barbershop)

    return barbershop

@router.post("/services", response_model=schemas.ServiceResponse)
def create_service(
    service: schemas.ServiceCreate,
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    barbershop = db.query(models.Barbershop).filter(
        models.Barbershop.admin_id == current_user.id
    ).first()

    if not barbershop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    new_service = models.Service(
        barbershop_id=barbershop.id,
        name=service.name,
        description=service.description,
        price=service.price,
        duration_minutes=service.duration_minutes
    )
    db.add(new_service)
    db.commit()
    db.refresh(new_service)

    return new_service

@router.get("/services", response_model=List[schemas.ServiceResponse])
def list_services(
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    barbershop = db.query(models.Barbershop).filter(
        models.Barbershop.admin_id == current_user.id
    ).first()

    if not barbershop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    services = db.query(models.Service).filter(
        models.Service.barbershop_id == barbershop.id
    ).all()

    return services

@router.get("/barbers", response_model=List[schemas.BarberResponse])
def list_barbers(
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    barbershop = db.query(models.Barbershop).filter(
        models.Barbershop.admin_id == current_user.id
    ).first()

    if not barbershop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    barbers = db.query(models.Barber).options(
        joinedload(models.Barber.user),
        joinedload(models.Barber.work_hours)
    ).filter(
        models.Barber.barbershop_id == barbershop.id
    ).all()

    return barbers

@router.put("/services/{service_id}", response_model=schemas.ServiceResponse)
def update_service(
    service_id: int,
    update: schemas.ServiceUpdate,
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    barbershop = db.query(models.Barbershop).filter(
        models.Barbershop.admin_id == current_user.id
    ).first()
    if not barbershop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    service = db.query(models.Service).filter(
        models.Service.id == service_id,
        models.Service.barbershop_id == barbershop.id
    ).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")

    if update.name is not None: service.name = update.name
    if update.description is not None: service.description = update.description
    if update.price is not None: service.price = update.price
    if update.duration_minutes is not None: service.duration_minutes = update.duration_minutes

    db.commit()
    db.refresh(service)
    return service

@router.delete("/services/{service_id}")
def delete_service(
    service_id: int,
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    barbershop = db.query(models.Barbershop).filter(
        models.Barbershop.admin_id == current_user.id
    ).first()
    if not barbershop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    service = db.query(models.Service).filter(
        models.Service.id == service_id,
        models.Service.barbershop_id == barbershop.id
    ).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")

    db.delete(service)
    db.commit()
    return {"message": "Service deleted"}

@router.delete("/barbers/{barber_id}")
def delete_barber(
    barber_id: int,
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    barbershop = db.query(models.Barbershop).filter(
        models.Barbershop.admin_id == current_user.id
    ).first()
    if not barbershop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    barber = db.query(models.Barber).filter(
        models.Barber.id == barber_id,
        models.Barber.barbershop_id == barbershop.id
    ).first()
    if not barber:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Barber not found")

    db.delete(barber)
    db.commit()
    return {"message": "Barber deleted"}

@router.get("/appointments", response_model=List[schemas.AppointmentResponse])
def list_all_appointments(
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    barbershop = db.query(models.Barbershop).filter(
        models.Barbershop.admin_id == current_user.id
    ).first()

    if not barbershop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    appointments = db.query(models.Appointment).filter(
        models.Appointment.barbershop_id == barbershop.id
    ).all()

    return appointments
