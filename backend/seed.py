"""
Script de seed para criar dados iniciais.
Uso: python seed.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine
from app.models import Base, User, Barbershop, Barber, Service, UserRole

Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # Admin
    admin = db.query(User).filter(User.whatsapp == "5511888888888").first()
    if not admin:
        admin = User(
            whatsapp="5511888888888",
            name="Admin Barbearia",
            role=UserRole.admin,
            is_active=True
        )
        db.add(admin)
        db.flush()
        print(f"Admin criado: ID={admin.id}")
    else:
        print(f"Admin já existe: ID={admin.id}")

    # Barbershop
    barbershop = db.query(Barbershop).filter(Barbershop.admin_id == admin.id).first()
    if not barbershop:
        barbershop = Barbershop(
            name="Barbearia Império",
            address="Rua das Palmeiras, 847",
            phone="11999999999",
            city="São Paulo",
            state="SP",
            admin_id=admin.id
        )
        db.add(barbershop)
        db.flush()
        print(f"Barbearia criada: ID={barbershop.id}")
    else:
        print(f"Barbearia já existe: ID={barbershop.id}")

    # Barber user
    barber_user = db.query(User).filter(User.whatsapp == "5511777777777").first()
    if not barber_user:
        barber_user = User(
            whatsapp="5511777777777",
            name="Rafael Souza",
            role=UserRole.barber,
            is_active=True
        )
        db.add(barber_user)
        db.flush()
        print(f"Usuário barbeiro criado: ID={barber_user.id}")
    else:
        print(f"Usuário barbeiro já existe: ID={barber_user.id}")

    # Barber record
    barber = db.query(Barber).filter(Barber.user_id == barber_user.id).first()
    if not barber:
        barber = Barber(
            user_id=barber_user.id,
            barbershop_id=barbershop.id,
            specialty="Degradê & Navalhado"
        )
        db.add(barber)
        db.flush()
        print(f"Barbeiro criado: ID={barber.id}")
    else:
        print(f"Barbeiro já existe: ID={barber.id}")

    # Services
    services_data = [
        {"name": "Corte Clássico", "description": "Tesoura e máquina, acabamento perfeito", "price": 4500, "duration_minutes": 30},
        {"name": "Barba Completa", "description": "Modelagem, hidratação e toalha quente", "price": 3500, "duration_minutes": 25},
        {"name": "Corte + Barba", "description": "O combo completo para o visual ideal", "price": 7500, "duration_minutes": 55},
        {"name": "Degradê", "description": "Fade perfeito nas laterais e nuca", "price": 5000, "duration_minutes": 35},
        {"name": "Sobrancelha", "description": "Design e modelagem de sobrancelha", "price": 2000, "duration_minutes": 15},
        {"name": "Hidratação Capilar", "description": "Tratamento profundo para os fios", "price": 4000, "duration_minutes": 40},
    ]

    for svc_data in services_data:
        existing = db.query(Service).filter(
            Service.barbershop_id == barbershop.id,
            Service.name == svc_data["name"]
        ).first()
        if not existing:
            svc = Service(barbershop_id=barbershop.id, **svc_data)
            db.add(svc)
            print(f"Serviço criado: {svc_data['name']}")
        else:
            print(f"Serviço já existe: {svc_data['name']}")

    db.commit()
    print("\n=== Seed concluído com sucesso! ===")
    print(f"\nAdmin WhatsApp: 5511888888888")
    print(f"Código de verificação: 432100")
    print(f"\nAcesse /docs para testar a API")

except Exception as e:
    db.rollback()
    print(f"Erro: {e}")
    raise
finally:
    db.close()
