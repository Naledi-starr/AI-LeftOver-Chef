from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth import router as auth_router

from app.api.recipes import router as recipes_router
from app.config import settings


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description=(
        "An AI-powered application that helps users create recipes "
        "using ingredients they already have."
    ),
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(recipes_router)


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