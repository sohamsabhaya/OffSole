from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from app.core.security import decode_access_token
from app.database import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase

# Optional bearer scheme for Swagger UI or API clients
security_bearer = HTTPBearer(auto_error=False)


async def get_token_from_request(
    request: Request,
    bearer_auth: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer)
) -> Optional[str]:
    """
    Extracts JWT token from either:
    1. HTTP-only Cookie named 'access_token' (used by React Axios withCredentials: true)
    2. Authorization: Bearer <token> Header (used by Postman / Swagger)
    """
    # Check Cookie first
    cookie_token = request.cookies.get("access_token")
    if cookie_token:
        # Strip "Bearer " prefix if present in cookie
        if cookie_token.startswith("Bearer "):
            return cookie_token[7:]
        return cookie_token

    # Check Authorization Header
    if bearer_auth and bearer_auth.credentials:
        return bearer_auth.credentials

    return None


async def get_current_user_optional(
    token: Optional[str] = Depends(get_token_from_request),
    db: AsyncIOMotorDatabase = Depends(get_database)
) -> Optional[dict]:
    """
    Returns user dict if authenticated, or None if guest/unauthenticated.
    Used for routes like /api/auth/status/ and /api/cart/count/.
    """
    if not token:
        return None

    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        return None

    username = payload["sub"]
    user = await db.users.find_one({"username": username})
    return user


async def get_current_user(
    user: Optional[dict] = Depends(get_current_user_optional)
) -> dict:
    """
    Strict dependency: Requires authenticated user.
    Raises 401 Unauthorized if missing or invalid.
    Used for Cart operations, Profile, and Checkout.
    """
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


async def get_current_admin_user(
    current_user: dict = Depends(get_current_user)
) -> dict:
    """
    Strict dependency: Requires authenticated user with admin/staff privileges.
    Raises 403 Forbidden if not admin.
    """
    if not (current_user.get("is_admin") or current_user.get("is_staff") or current_user.get("username") == "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrative privileges required to access this resource."
        )
    return current_user

