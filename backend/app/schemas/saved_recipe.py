"""Pydantic schemas for saved recipes."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class SavedRecipeCreate(BaseModel):
    """Payload for saving a recipe, typically an AI generation result."""

    title: str = Field(min_length=1, max_length=255)
    description: str
    ingredients: list[str] = Field(min_length=1)
    instructions: list[str] = Field(min_length=1)
    cooking_time_minutes: int = Field(gt=0)
    servings: int = Field(gt=0)


class SavedRecipeUpdate(BaseModel):
    """Payload for updating a saved recipe's favourite/rating/feedback.

    All fields are optional; only the ones provided are changed.
    """

    is_favorite: bool | None = None
    rating: int | None = Field(default=None, ge=1, le=5)
    feedback: str | None = None


class SavedRecipeRead(BaseModel):
    """Public-facing representation of a saved recipe."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    ingredients: list[str]
    instructions: list[str]
    cooking_time_minutes: int
    servings: int
    is_favorite: bool
    rating: int | None
    feedback: str | None
    created_at: datetime

    @field_validator("ingredients", mode="before")
    @classmethod
    def _coerce_ingredients(cls, value):
        """Accept either raw strings or ORM RecipeIngredient objects."""

        if value and not isinstance(value[0], str):
            return [item.name for item in value]
        return value