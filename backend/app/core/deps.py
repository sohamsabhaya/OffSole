from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.config import settings
from app.core.exceptions import ForbiddenError, UnauthorizedError
from app.core.security import decode_access_token
from app.crud.user import get_user_by_id, get_user_by_username
from app.database import get_database

security_bearer = HTTPBearer(auto_error=False)


async def get_token_from_request(
    request: Request, bearer_auth: HTTPAuthorizationCredentials | None = Depends(security_bearer)
) -> str | None:
    cookie_token = request.cookies.get(settings.COOKIE_NAME)
    if cookie_token:
        if cookie_token.startswith("Bearer "):
            return cookie_token[7:]
        return cookie_token

    if bearer_auth and bearer_auth.credentials:
        return bearer_auth.credentials

    return None


async def get_current_user_optional(
    token: str | None = Depends(get_token_from_request),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> dict | None:
    if not token:
        return None

    payload = decode_access_token(token)
    if not payload:
        return None

    user_id_or_username = payload.get("sub")
    if not user_id_or_username:
        return None

    user = await get_user_by_id(db, user_id_or_username)
    if not user:
        user = await get_user_by_username(db, user_id_or_username)

    return user


async def get_current_user(user: dict | None = Depends(get_current_user_optional)) -> dict:
    if not user:
        raise UnauthorizedError(message="Please log in to continue.")
    return user


async def get_current_admin_user(current_user: dict = Depends(get_current_user)) -> dict:
    is_admin = bool(current_user.get("is_admin") is True or current_user.get("role") == "admin")
    if not is_admin:
        raise ForbiddenError(message="Administrator privileges required to access this resource.")
    return current_user
