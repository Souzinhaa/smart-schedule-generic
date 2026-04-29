from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# OAuth2 Configuration
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

# Fake database for demonstration purposes
fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "fakehashedsecret",
        "disabled": False,
    }
}

# User model and token model
class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None

class Token(BaseModel):
    access_token: str
    token_type: str

# Login endpoint
@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form_data.username)
    if not user or user["hashed_password"] != "fakehashed" + form_data.password:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    return {"access_token": form_data.username, "token_type": "bearer"}

# Token refresh endpoint (simple simulation)
@app.post("/token/refresh", response_model=Token)
async def refresh_token(token: str = Depends(oauth2_scheme)):
    # Here we would implement token refresh logic
    return {"access_token": token, "token_type": "bearer"}

# Logout endpoint
@app.post("/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    # Here we would implement logout logic (like invalidating the token)
    return {"detail": "User logged out"}

# Consent management endpoints
@app.post("/consent")
async def manage_consent(consent: bool):
    # Logic to manage user consent
    return {"detail": "Consent updated"}

@app.get("/consent/logs", response_model=List[str])
async def get_consent_logs():
    # Logic to retrieve consent logs
    return ["Consent given on 2026-04-29", "Consent revoked on 2026-04-30"]

# Endpoint for deleting personal data
@app.delete("/personal-data")
async def delete_personal_data(token: str = Depends(oauth2_scheme)):
    # Logic to delete personal data
    return {"detail": "Personal data deleted"}