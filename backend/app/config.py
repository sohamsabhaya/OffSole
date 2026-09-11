from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    PROJECT_NAME: str = "OffSole"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    ENV: str = "development"
    DEBUG: bool = True

    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "offsole"

    SECRET_KEY: str = "dev_secret_key_change_in_production_1234567890"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    COOKIE_NAME: str = "access_token"
    COOKIE_SECURE: bool = False
    COOKIE_SAMESITE: str = "lax"
    COOKIE_HTTPONLY: bool = True
    COOKIE_DOMAIN: str | None = None

    ALLOWED_ORIGINS: str | list[str] = "http://localhost:3000,http://127.0.0.1:3000"
    MEDIA_DIR: str = "media"

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: str | list[str]) -> list[str]:
        if isinstance(v, str):
            if not v.strip():
                return ["http://localhost:3000"]
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return ["http://localhost:3000"]

    @property
    def is_production(self) -> bool:
        return self.ENV.lower() == "production"


settings = Settings()
