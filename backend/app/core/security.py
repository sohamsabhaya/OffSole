from datetime import UTC, datetime, timedelta
from typing import Any

import bcrypt
from fastapi import Response
from jose import JWTError, jwt

from app.config import settings


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        password_bytes = plain_password.encode("utf-8")[:72]
        if isinstance(hashed_password, str):
            hashed_bytes = hashed_password.encode("utf-8")
        else:
            hashed_bytes = hashed_password
        return bcrypt.checkpw(password_bytes, hashed_bytes)
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    password_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password_bytes, salt).decode("utf-8")


def create_access_token(
    subject: str | Any, claims: dict[str, Any] | None = None, expires_delta: timedelta | None = None
) -> str:
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode: dict[str, Any] = {
        "sub": str(subject),
        "exp": expire,
        "iat": datetime.now(UTC),
    }

    if claims:
        to_encode.update(claims)

    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> dict[str, Any] | None:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None


def set_auth_cookie(response: Response, token: str) -> None:
    max_age = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    response.set_cookie(
        key=settings.COOKIE_NAME,
        value=token,
        max_age=max_age,
        expires=max_age,
        httponly=settings.COOKIE_HTTPONLY,
        samesite=settings.COOKIE_SAMESITE,
        secure=settings.COOKIE_SECURE or settings.is_production,
        domain=settings.COOKIE_DOMAIN,
        path="/",
    )


def clear_auth_cookie(response: Response) -> None:
    response.delete_cookie(
        key=settings.COOKIE_NAME,
        httponly=settings.COOKIE_HTTPONLY,
        samesite=settings.COOKIE_SAMESITE,
        secure=settings.COOKIE_SECURE or settings.is_production,
        domain=settings.COOKIE_DOMAIN,
        path="/",
    )
