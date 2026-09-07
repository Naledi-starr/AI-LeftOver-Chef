"""Pydantic schemas for recipe generation.

This module defines the request and response models used by the
recipe generation API.
"""

from pydantic import BaseModel, Field


class RecipeRequest(BaseModel):
    """Represent the ingredients submitted by the user.

    Attributes:
        ingredients: A list of ingredients available to the user.
        dietary_preferences: Optional dietary requirements or preferences.
        servings: Number of people the recipe should serve.
    """

    ingredients: list[str] = Field(
        ...,
        min_length=1,
        description="Ingredients available to create the recipe.",
    )

    dietary_preferences: str | None = Field(
        default=None,
        description="Optional dietary preferences or restrictions.",
    )

    servings: int = Field(
        default=2,
        ge=1,
        le=20,
        description="Number of servings the recipe should make.",
    )


class RecipeResponse(BaseModel):
    """Represent a generated recipe.

    Attributes:
        title: Name of the recipe.
        description: Short description of the dish.
        ingredients: Ingredients required for the recipe.
        instructions: Step-by-step cooking instructions.
        cooking_time_minutes: Estimated cooking time.
        servings: Number of servings.
    """

    title: str
    description: str
    ingredients: list[str]
    instructions: list[str]
    cooking_time_minutes: int
    servings: int