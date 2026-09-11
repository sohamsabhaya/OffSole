from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserSignup(BaseModel):
    """Payload for /api/auth/signup/"""
    username: str = Field(..., min_length=3, max_length=50, description="Unique username")
    email: EmailStr = Field(..., description="Valid email address")
    password: str = Field(..., min_length=6, description="Password min 6 chars")


class UserLogin(BaseModel):
    """Payload for /api/auth/login/"""
    username: str = Field(..., description="Username or email")
    password: str = Field(..., description="Plaintext password")


class AuthStatusResponse(BaseModel):
    """Response for GET /api/auth/status/"""
    is_authenticated: bool
    username: Optional[str] = None
    email: Optional[str] = None
    is_admin: bool = False
    is_staff: bool = False


class AuthSuccessResponse(BaseModel):
    """Response on successful login / signup"""
    success: bool = True
    message: str
    username: str
    is_admin: bool = False