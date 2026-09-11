from datetime import UTC, datetime
from typing import Any

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.security import get_password_hash, verify_password


def format_user_doc(user_doc: dict | None) -> dict | None:
    if not user_doc:
        return None
    doc = dict(user_doc)
    doc["id"] = str(doc.get("_id", ""))
    doc.pop("_id", None)
    doc.pop("password", None)
    doc.pop("hashed_password", None)
    return doc


async def get_user_by_id(db: AsyncIOMotorDatabase, user_id: str) -> dict | None:
    if not ObjectId.is_valid(user_id):
        return None
    return await db.users.find_one({"_id": ObjectId(user_id)})


async def get_user_by_email(db: AsyncIOMotorDatabase, email: str) -> dict | None:
    return await db.users.find_one({"email": email.strip().lower()})


async def get_user_by_username(db: AsyncIOMotorDatabase, username: str) -> dict | None:
    return await db.users.find_one({"username": username.strip()})


async def create_user(db: AsyncIOMotorDatabase, user_data: dict[str, Any]) -> dict:
    doc = {
        "username": user_data["username"].strip(),
        "email": user_data["email"].strip().lower(),
        "hashed_password": get_password_hash(user_data["password"]),
        "full_name": user_data.get("full_name", "").strip(),
        "is_admin": bool(user_data.get("is_admin", False)),
        "is_staff": bool(user_data.get("is_staff", False)),
        "role": user_data.get("role", "customer"),
        "created_at": datetime.now(UTC),
        "updated_at": datetime.now(UTC),
    }
    result = await db.users.insert_one(doc)
    doc["_id"] = result.inserted_id
    return doc


async def authenticate_user(
    db: AsyncIOMotorDatabase, identifier: str, password: str
) -> dict | None:
    user = await get_user_by_username(db, identifier)
    if not user:
        user = await get_user_by_email(db, identifier)

    if not user:
        return None

    stored_hash = user.get("hashed_password") or user.get("password")
    if not stored_hash or not verify_password(password, stored_hash):
        return None

    return user


async def delete_user_by_id(db: AsyncIOMotorDatabase, user_id: str) -> bool:
    if not ObjectId.is_valid(user_id):
        return False
    result = await db.users.delete_one({"_id": ObjectId(user_id)})
    return result.deleted_count > 0
