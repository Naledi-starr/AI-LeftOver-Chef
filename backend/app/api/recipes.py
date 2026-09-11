"""Recipe generation API endpoints.

This module exposes HTTP endpoints related to recipe generation.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_active_user
from app.database import get_db
from app.models.recipe import Recipe, RecipeIngredient
from app.models.user import User
from app.schemas.recipe import RecipeRequest, RecipeResponse
from app.schemas.saved_recipe import (
    SavedRecipeCreate,
    SavedRecipeRead,
    SavedRecipeUpdate,
)
from app.services.ai_client import AIClientError
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

    try:
        return await generate_recipe(request)
    except (AIClientError, ValueError) as exc:
        raise HTTPException(
            status_code=502,
            detail=str(exc),
        ) from exc


def _get_owned_recipe_or_404(
    recipe_id: int,
    db: Session,
    current_user: User,
) -> Recipe:
    """Fetch a saved recipe, ensuring it belongs to the current user.

    Returns a 404 (not 403) when the recipe exists but belongs to
    someone else, so as not to reveal whether the id exists at all.
    """

    recipe = (
        db.query(Recipe)
        .filter(
            Recipe.id == recipe_id,
            Recipe.user_id == current_user.id,
        )
        .first()
    )

    if recipe is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found.",
        )

    return recipe


@router.post("", response_model=SavedRecipeRead, status_code=status.HTTP_201_CREATED)
def save_recipe(
    payload: SavedRecipeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Recipe:
    """Save a recipe (typically an AI generation result) for the current user."""

    recipe = Recipe(
        user_id=current_user.id,
        title=payload.title,
        description=payload.description,
        instructions=payload.instructions,
        cooking_time_minutes=payload.cooking_time_minutes,
        servings=payload.servings,
        ingredients=[
            RecipeIngredient(name=name, position=position)
            for position, name in enumerate(payload.ingredients)
        ],
    )

    db.add(recipe)
    db.commit()
    db.refresh(recipe)

    return recipe


@router.get("", response_model=list[SavedRecipeRead])
def list_saved_recipes(
    favorites_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> list[Recipe]:
    """List saved recipes belonging to the current user.

    Args:
        favorites_only: If true, only return recipes marked as favourite.
    """

    query = db.query(Recipe).filter(Recipe.user_id == current_user.id)

    if favorites_only:
        query = query.filter(Recipe.is_favorite.is_(True))

    return query.order_by(Recipe.created_at.desc()).all()


@router.get("/{recipe_id}", response_model=SavedRecipeRead)
def get_saved_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Recipe:
    """Fetch a single saved recipe owned by the current user."""

    return _get_owned_recipe_or_404(recipe_id, db, current_user)


@router.patch("/{recipe_id}", response_model=SavedRecipeRead)
def update_saved_recipe(
    recipe_id: int,
    payload: SavedRecipeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Recipe:
    """Update a saved recipe's favourite flag, rating, and/or feedback."""

    recipe = _get_owned_recipe_or_404(recipe_id, db, current_user)

    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(recipe, field, value)

    db.commit()
    db.refresh(recipe)

    return recipe


@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_saved_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> None:
    """Delete a saved recipe owned by the current user."""

    recipe = _get_owned_recipe_or_404(recipe_id, db, current_user)

    db.delete(recipe)
    db.commit()