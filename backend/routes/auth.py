import os
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, field_validator
from sqlmodel import Session, select

from db import get_engine
from models import User

load_dotenv()

BETTER_AUTH_SECRET = os.getenv("BETTER_AUTH_SECRET", "")
ALGORITHM = "HS256"
TOKEN_EXPIRY_HOURS = 24 * 7  # 7 days

router = APIRouter(prefix="/api/auth")


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: str | None = None

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    token: str
    user: dict


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


def create_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRY_HOURS),
    }
    return jwt.encode(payload, BETTER_AUTH_SECRET, algorithm=ALGORITHM)


def user_to_dict(user: User) -> dict:
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "createdAt": user.created_at.isoformat(),
        "updatedAt": user.updated_at.isoformat(),
    }


@router.post("/signup")
def signup(data: SignupRequest):
    with Session(get_engine()) as session:
        existing = session.exec(
            select(User).where(User.email == data.email)
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        user = User(
            email=data.email,
            name=data.name,
            hashed_password=hash_password(data.password),
        )
        session.add(user)
        session.commit()
        session.refresh(user)

        token = create_token(user.id)
        return {"token": token, "user": user_to_dict(user)}


@router.post("/login")
def login(data: LoginRequest):
    with Session(get_engine()) as session:
        user = session.exec(
            select(User).where(User.email == data.email)
        ).first()
        if not user or not verify_password(data.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        token = create_token(user.id)
        return {"token": token, "user": user_to_dict(user)}
