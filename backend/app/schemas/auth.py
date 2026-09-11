from typing import Any

from pydantic import BaseModel, EmailStr, Field


class UserSignup(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Unique username")
    email: EmailStr = Field(..., description="Valid email address")
    password: str = Field(..., min_length=6, description="Password min 6 chars")


class UserLogin(BaseModel):
    username: str = Field(..., description="Username or email")
    password: str = Field(..., description="Plaintext password")


class AuthStatusResponse(BaseModel):
    is_authenticated: bool
    id: str | None = None
    username: str | None = None
    email: str | None = None
    is_admin: bool = False
    is_staff: bool = False


class UserProfile(BaseModel):
    id: str | None = None
    username: str
    email: str
    is_admin: bool = False
    is_staff: bool = False


class AuthSuccessResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    username: str | None = None
    is_admin: bool = False
    access_token: str | None = None
    user: dict[str, Any] | None = None
