from typing import Any

from fastapi import Response
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.exceptions import ConflictError, NotFoundError, UnauthorizedError
from app.core.security import clear_auth_cookie, create_access_token, set_auth_cookie
from app.crud.cart import clear_cart_by_user_id
from app.crud.user import (
    authenticate_user,
    create_user,
    delete_user_by_id,
    format_user_doc,
    get_user_by_email,
    get_user_by_username,
)


class AuthService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db

    async def register(self, user_in_data: dict[str, Any], response: Response) -> dict:
        email = user_in_data["email"].strip().lower()
        username = user_in_data["username"].strip()

        if await get_user_by_email(self.db, email):
            raise ConflictError(message=f"An account with email '{email}' already exists.")

        if await get_user_by_username(self.db, username):
            raise ConflictError(message=f"Username '{username}' is already taken.")

        user = await create_user(self.db, user_in_data)
        user_id = str(user["_id"])

        token = create_access_token(
            subject=user_id, claims={"username": username, "is_admin": user.get("is_admin", False)}
        )
        set_auth_cookie(response, token)

        return {
            "success": True,
            "message": "Account created successfully.",
            "user": format_user_doc(user),
            "access_token": token,
        }

    async def login(self, identifier: str, password: str, response: Response) -> dict:
        user = await authenticate_user(self.db, identifier, password)
        if not user:
            raise UnauthorizedError(message="Invalid username/email or password.")

        user_id = str(user["_id"])
        is_admin = bool(user.get("is_admin") is True or user.get("role") == "admin")

        token = create_access_token(
            subject=user_id, claims={"username": user["username"], "is_admin": is_admin}
        )
        set_auth_cookie(response, token)

        return {
            "success": True,
            "message": "Login successful.",
            "user": format_user_doc(user),
            "access_token": token,
            "is_admin": is_admin,
        }

    async def logout(self, response: Response) -> dict:
        clear_auth_cookie(response)
        return {"success": True, "message": "Logged out successfully."}

    def get_auth_status(self, current_user: dict | None) -> dict:
        if not current_user:
            return {
                "is_authenticated": False,
                "username": None,
                "email": None,
                "is_admin": False,
                "is_staff": False,
            }

        is_admin = bool(current_user.get("is_admin") is True or current_user.get("role") == "admin")
        return {
            "is_authenticated": True,
            "id": str(current_user.get("_id", "")),
            "username": current_user.get("username"),
            "email": current_user.get("email"),
            "is_admin": is_admin,
            "is_staff": is_admin,
        }

    async def delete_account(self, current_user: dict, response: Response) -> dict:
        user_id = str(current_user["_id"])
        deleted = await delete_user_by_id(self.db, user_id)
        if not deleted:
            raise NotFoundError(message="User account not found.")

        await clear_cart_by_user_id(self.db, user_id)
        clear_auth_cookie(response)
        return {"success": True, "message": "Your account has been deleted permanently."}
