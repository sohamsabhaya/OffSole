from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.schemas.auth import UserSignup
from app.core.security import get_password_hash, verify_password


async def get_user_by_username(db: AsyncIOMotorDatabase, username: str) -> dict | None:
    """Finds a user document by their unique username."""
    return await db.users.find_one({"username": username})


async def get_user_by_email(db: AsyncIOMotorDatabase, email: str) -> dict | None:
    """Finds a user document by their email address."""
    return await db.users.find_one({"email": email})


async def create_user(db: AsyncIOMotorDatabase, user_in: UserSignup) -> dict:
    """
    Creates and inserts a new user in MongoDB.
    Hashes the password with bcrypt before saving.
    """
    user_doc = {
        "username": user_in.username,
        "email": user_in.email,
        "hashed_password": get_password_hash(user_in.password),
        "is_active": True,
        "created_at": datetime.now(timezone.utc)
    }
    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = str(result.inserted_id)
    return user_doc


async def authenticate_user(
    db: AsyncIOMotorDatabase, username: str, password: str
) -> dict | None:
    """
    Validates user login credentials.
    Supports logging in with either username or email!
    """
    # Look for username match, or email match if user typed their email
    user = await db.users.find_one({
        "$or": [
            {"username": username},
            {"email": username}
        ]
    })
    
    if not user:
        return None
    
    if not verify_password(password, user["hashed_password"]):
        return None
        
    return user
