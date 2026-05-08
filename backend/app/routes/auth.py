from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, auth
from app.schemas import LoginRequest, VerifyCodeRequest
from datetime import datetime

router = APIRouter(prefix="/api/auth", tags=["auth"])

MOCK_CODE = "432100"

@router.post("/login", response_model=schemas.LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.whatsapp == request.whatsapp).first()

    if not user:
        if not request.name:
            return {"requires_name": True, "message": "Primeira vez? Informe seu nome para cadastro."}
        user = models.User(whatsapp=request.whatsapp, name=request.name, role=models.UserRole.client)
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        if not user.is_active:
            user.is_active = True
            db.commit()

    return {
        "requires_code_verification": True,
        "message": f"Código: {MOCK_CODE}"
    }

@router.post("/verify-code", response_model=schemas.Token)
def verify_code(request: VerifyCodeRequest, db: Session = Depends(get_db)):
    if request.code != MOCK_CODE:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Código inválido")

    user = db.query(models.User).filter(models.User.whatsapp == request.whatsapp).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    token = auth.create_access_token(user.id)
    expires_in = 30 * 24 * 60 * 60

    return {"access_token": token, "token_type": "bearer", "expires_in": expires_in}

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@router.post("/refresh-token", response_model=schemas.Token)
def refresh_token(current_user: models.User = Depends(auth.get_current_user)):
    token = auth.create_access_token(current_user.id)
    expires_in = 30 * 24 * 60 * 60

    return {"access_token": token, "token_type": "bearer", "expires_in": expires_in}

@router.post("/consent")
def manage_consent(
    consent: schemas.ConsentLogCreate,
    request: Request,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    log = models.ConsentLog(
        user_id=current_user.id,
        consent_type=consent.consent_type,
        consented=consent.consented,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent")
    )
    db.add(log)
    db.commit()
    db.refresh(log)

    return {"message": "Consent recorded", "id": log.id}

@router.delete("/data")
def delete_personal_data(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    current_user.is_active = False
    current_user.name = "DELETED_USER"
    db.commit()

    return {"message": "Personal data archived (LGPD right to be forgotten)"}
