import logging

import pymongo
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.config import settings

logger = logging.getLogger(__name__)


class Database:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None


db_instance = Database()


async def connect_to_mongo() -> None:
    if settings.ENV == "testing":
        logger.info("Testing environment active: skipping live MongoDB connection in lifespan.")
        return

    logger.info("Connecting to MongoDB...")
    try:
        db_instance.client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=5000)
        db_instance.db = db_instance.client[settings.DATABASE_NAME]
        logger.info(f"Connected to MongoDB database: {settings.DATABASE_NAME}")
        await init_db_indexes(db_instance.db)
    except Exception as e:
        logger.warning(f"Could not connect to MongoDB during startup: {e}")


async def close_mongo_connection() -> None:
    if db_instance.client:
        logger.info("Closing MongoDB connection...")
        db_instance.client.close()
        logger.info("MongoDB connection closed.")


async def init_db_indexes(db: AsyncIOMotorDatabase) -> None:
    try:
        await db.users.create_index([("email", pymongo.ASCENDING)], unique=True, sparse=True)
        await db.users.create_index([("username", pymongo.ASCENDING)], unique=True, sparse=True)

        await db.products.create_index(
            [
                ("brand", pymongo.ASCENDING),
                ("category", pymongo.ASCENDING),
                ("gender", pymongo.ASCENDING),
            ]
        )
        await db.products.create_index([("price", pymongo.ASCENDING)])
        await db.products.create_index([("created_at", pymongo.DESCENDING)])
        await db.products.create_index(
            [("name", pymongo.TEXT), ("brand", pymongo.TEXT), ("description", pymongo.TEXT)]
        )

        await db.orders.create_index([("user_id", pymongo.ASCENDING)])
        await db.orders.create_index([("created_at", pymongo.DESCENDING)])
        await db.orders.create_index(
            [("order_number", pymongo.ASCENDING)], unique=True, sparse=True
        )

        await db.cart.create_index([("user_id", pymongo.ASCENDING)], unique=True, sparse=True)
        logger.info("MongoDB indexes initialized successfully.")
    except Exception as e:
        logger.warning(f"Non-fatal error creating MongoDB indexes: {e}")


def get_database() -> AsyncIOMotorDatabase:
    if db_instance.db is None:
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        return client[settings.DATABASE_NAME]
    return db_instance.db
