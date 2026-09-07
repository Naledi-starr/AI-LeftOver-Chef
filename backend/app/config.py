"""Application configuration management.

This module loads environment variables and provides a central location
for application settings. Sensitive values such as API keys should never
be hard-coded in the source code.
"""

import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
	"""Store application configuration values.

	Configuration values are loaded from environment variables to keep
	secrets and environment-specific settings outside the source code.
	"""

	PROJECT_NAME = "AI Leftover Chef"
	PROJECT_VERSION = "1.0.0"

	DEBUG = os.getenv("DEBUG", "True").lower() == "true"

settings = Settings()
