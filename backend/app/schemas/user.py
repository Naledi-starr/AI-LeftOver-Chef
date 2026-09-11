"""Pydantic schemas for users and authentication."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    """Payload for registering a new user."""

    username: str = Field(min_length=2, max_length=50, pattern=r"^[a-zA-Z0-9_.-]+$")
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserRead(BaseModel):
    """Public-facing representation of a user."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: EmailStr
    is_active: bool
    created_at: datetime


class Token(BaseModel):
    """Access token returned on successful login."""

    access_token: str
    token_type: str = "bearer"