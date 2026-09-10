"""Application configuration management.

This module loads environment variables and provides a central location
for application settings.
"""

import os

from dotenv import load_dotenv


load_dotenv()


class Settings:
    """Store application configuration values."""

    PROJECT_NAME = os.getenv(
        "APP_NAME",
        "AI Leftover Chef",
    )

    PROJECT_VERSION = os.getenv(
        "APP_VERSION",
        "1.0.0",
    )

    DEBUG = os.getenv(
        "DEBUG",
        "True",
    ).lower() == "true"

    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://postgres:postgres@localhost:5432/leftover_chef",
    )

    OPENROUTER_API_KEY = os.getenv(
        "OPENROUTER_API_KEY",
    )

    OPENROUTER_MODEL = os.getenv(
        "OPENROUTER_MODEL",
        "openrouter/free"
    )

    OPENROUTER_URL = (
        "https://openrouter.ai/api/v1/chat/completions"
    )

    JWT_SECRET_KEY = os.getenv(
            "JWT_SECRET_KEY",
            "change-me-in-production",
        )
    
    JWT_ALGORITHM = os.getenv(
            "JWT_ALGORITHM",
            "HS256",
        )
    
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv(
            "ACCESS_TOKEN_EXPIRE_MINUTES",
            "60",
        ))


settings = Settings()

   