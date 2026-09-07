"""Main entry point for the AI Leftover Chef API.

This module creates and configures the FastAPI application. All API routes
and application-level configuration will eventually be registered here.
"""

from fastapi import FastAPI

from app.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description=(
        "An AI-powered application that helps users create recipes "
        "using ingredients they already have."
    ),
)


@app.get("/", tags=["Health"])
def health_check() -> dict[str, str]:
    """Check whether the API is running successfully.

    Returns:
        A dictionary containing the application status and name.
    """
    return {
        "status": "healthy",
        "application": settings.PROJECT_NAME,
    }
