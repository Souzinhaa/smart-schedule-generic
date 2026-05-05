from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text, Enum, Time
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base

class UserRole(str, enum.Enum):
    client = "client"
    barber = "barber"
    admin = "admin"

class AppointmentStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    completed = "completed"
    cancelled = "cancelled"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    whatsapp = Column(String, unique=True, index=True)
    name = Column(String)
    role = Column(Enum(UserRole), default=UserRole.client)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    appointments = relationship("Appointment", back_populates="client")
    barber = relationship("Barber", back_populates="user", uselist=False)
    barbershop_admin = relationship("Barbershop", back_populates="admin")
    consent_logs = relationship("ConsentLog", back_populates="user")

class Barbershop(Base):
    __tablename__ = "barbershops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    address = Column(String)
    phone = Column(String)
    city = Column(String)
    state = Column(String)
    admin_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    admin = relationship("User", back_populates="barbershop_admin")
    barbers = relationship("Barber", back_populates="barbershop")
    services = relationship("Service", back_populates="barbershop")
    appointments = relationship("Appointment", back_populates="barbershop")

class Barber(Base):
    __tablename__ = "barbers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    barbershop_id = Column(Integer, ForeignKey("barbershops.id"))
    specialty = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="barber")
    barbershop = relationship("Barbershop", back_populates="barbers")
    work_hours = relationship("WorkHours", back_populates="barber", cascade="all, delete-orphan")
    appointments = relationship("Appointment", back_populates="barber")

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    barbershop_id = Column(Integer, ForeignKey("barbershops.id"))
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    price = Column(Integer)  # Em centavos
    duration_minutes = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    barbershop = relationship("Barbershop", back_populates="services")
    appointments = relationship("Appointment", back_populates="service")

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("users.id"))
    barber_id = Column(Integer, ForeignKey("barbers.id"))
    barbershop_id = Column(Integer, ForeignKey("barbershops.id"))
    service_id = Column(Integer, ForeignKey("services.id"))
    appointment_date = Column(DateTime, index=True)
    status = Column(Enum(AppointmentStatus), default=AppointmentStatus.pending)
    confirmed = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    client = relationship("User", back_populates="appointments")
    barber = relationship("Barber", back_populates="appointments")
    barbershop = relationship("Barbershop", back_populates="appointments")
    service = relationship("Service", back_populates="appointments")

class WorkHours(Base):
    __tablename__ = "work_hours"

    id = Column(Integer, primary_key=True, index=True)
    barber_id = Column(Integer, ForeignKey("barbers.id"))
    day_of_week = Column(Integer)  # 0-6 (Mon-Sun)
    start_time = Column(Time)
    end_time = Column(Time)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    barber = relationship("Barber", back_populates="work_hours")

class ConsentLog(Base):
    __tablename__ = "consent_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    consent_type = Column(String)  # marketing, data_processing, etc
    consented = Column(Boolean)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="consent_logs")
