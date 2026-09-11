import os
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application Settings loaded from .env file or environment variables.
    Pydantic ensures type validation on startup.
    """
    APP_NAME: str = "OffSole API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # MongoDB Atlas Connection
    MONGODB_URI: str = "mongodb+srv://sohams2627_db_user:D8mzsmhAFgtVF7pN@cluster0.opqpfjx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    MONGODB_DB_NAME: str = "offsole"

    # JWT Authentication
    SECRET_KEY: str = "dev-secret-key-change-in-production-1234567890"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 Hours

    # CORS Frontend Origins
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


@lru_cache()
def get_settings() -> Settings:
    """Cached settings singleton instance."""
    return Settings()
