from pydantic import BaseModel, Field
from datetime import datetime, time
from typing import Optional, List
from app.models import UserRole, AppointmentStatus

# Auth Schemas
class LoginRequest(BaseModel):
    whatsapp: str = Field(..., min_length=10, max_length=20)
    name: Optional[str] = Field(None, min_length=2, max_length=255)

class VerifyCodeRequest(BaseModel):
    whatsapp: str = Field(..., min_length=10, max_length=20)
    code: str = Field(..., min_length=6, max_length=6)

class LoginResponse(BaseModel):
    access_token: Optional[str] = None
    token_type: str = "bearer"
    expires_in: Optional[int] = None
    requires_code_verification: bool = False
    requires_name: bool = False
    message: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

class UserResponse(BaseModel):
    id: int
    whatsapp: str
    name: str
    role: UserRole
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Service Schemas
class ServiceCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None
    price: int = Field(..., ge=0)
    duration_minutes: int = Field(..., ge=5)

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    duration_minutes: Optional[int] = None

class ServiceResponse(ServiceCreate):
    id: int
    barbershop_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Work Hours Schemas
class WorkHoursCreate(BaseModel):
    day_of_week: int = Field(..., ge=0, le=6)
    start_time: time
    end_time: time

class WorkHoursUpdate(BaseModel):
    start_time: Optional[time] = None
    end_time: Optional[time] = None

class WorkHoursResponse(WorkHoursCreate):
    id: int
    barber_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Barber Schemas
class BarberCreate(BaseModel):
    user_id: int
    specialty: Optional[str] = None

class BarberResponse(BaseModel):
    id: int
    user_id: int
    barbershop_id: int
    specialty: Optional[str]
    user: UserResponse
    work_hours: List[WorkHoursResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True

# Appointment Schemas
class AppointmentCreate(BaseModel):
    service_id: int
    appointment_date: datetime
    notes: Optional[str] = None

class AppointmentUpdate(BaseModel):
    status: Optional[AppointmentStatus] = None
    notes: Optional[str] = None
    confirmed: Optional[bool] = None

class AppointmentResponse(BaseModel):
    id: int
    client_id: int
    barber_id: int
    barbershop_id: int
    service_id: int
    appointment_date: datetime
    status: AppointmentStatus
    confirmed: bool
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# Barbershop Schemas
class BarbershopUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None

class BarbershopResponse(BaseModel):
    id: int
    name: str
    address: str
    phone: str
    city: str
    state: str
    admin_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Consent Schemas
class ConsentLogCreate(BaseModel):
    consent_type: str
    consented: bool
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

class ConsentLogResponse(ConsentLogCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Dashboard Schemas
class DashboardStats(BaseModel):
    total_appointments: int
    total_revenue: int
    active_barbers: int
    pending_appointments: int
    completed_appointments: int

class BarberStats(BaseModel):
    total_appointments: int
    completed_appointments: int
    total_revenue: int
    this_month_appointments: int
