from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import get_settings

# Global client and database handles
client: AsyncIOMotorClient | None = None
db: AsyncIOMotorDatabase | None = None

async def connect_to_mongo():
    """Establishes async connection pool with MongoDB Atlas on server startup."""
    global client, db
    settings = get_settings()
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    
    # Ping Atlas cluster to confirm live connectivity
    try:
        await client.admin.command('ping')
        print(f"[MongoDB] Connected successfully to Atlas cluster database: {settings.MONGODB_DB_NAME}")
    except Exception as e:
        print(f"[MongoDB] Connection error: {e}")


async def close_mongo_connection():
    """Gracefully closes MongoDB connection pool on server shutdown."""
    global client
    if client is not None:
        client.close()
        print("[MongoDB] Connection closed gracefully.")


def get_database() -> AsyncIOMotorDatabase:
    """Dependency helper to obtain the active MongoDB database handle."""
    global db, client
    if db is None:
        settings = get_settings()
        client = AsyncIOMotorClient(settings.MONGODB_URI)
        db = client[settings.MONGODB_DB_NAME]
    return db
