"""Recipe generation API endpoints.

This module exposes HTTP endpoints related to recipe generation.
"""

from fastapi import APIRouter

from app.schemas.recipe import RecipeRequest, RecipeResponse
from app.services.recipe_service import generate_recipe


router = APIRouter(
    prefix="/api/recipes",
    tags=["Recipes"],
)


@router.post("/generate", response_model=RecipeResponse)
async def create_recipe(
    request: RecipeRequest,
) -> RecipeResponse:
    """Generate a recipe using the ingredients provided by the user.

    Args:
        request: User recipe generation request.

    Returns:
        A generated recipe.
    """

    return await generate_recipe(request)