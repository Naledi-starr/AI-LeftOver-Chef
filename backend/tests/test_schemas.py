"""Direct validation tests for Pydantic schemas, without touching the DB."""

import pytest
from pydantic import ValidationError

from app.schemas.pantry import PantryItemCreate
from app.schemas.saved_recipe import SavedRecipeCreate, SavedRecipeUpdate
from app.schemas.user import UserCreate


def test_pantry_item_quantity_must_be_positive():
    with pytest.raises(ValidationError):
        PantryItemCreate(name="Rice", quantity=0)


def test_pantry_item_name_cannot_be_empty():
    with pytest.raises(ValidationError):
        PantryItemCreate(name="", quantity=1)


def test_saved_recipe_requires_at_least_one_ingredient():
    with pytest.raises(ValidationError):
        SavedRecipeCreate(
            title="Empty",
            description="No ingredients.",
            ingredients=[],
            instructions=["Do nothing."],
            cooking_time_minutes=5,
            servings=1,
        )


def test_saved_recipe_update_rating_must_be_1_to_5():
    with pytest.raises(ValidationError):
        SavedRecipeUpdate(rating=0)
    with pytest.raises(ValidationError):
        SavedRecipeUpdate(rating=6)

    # In range is fine.
    assert SavedRecipeUpdate(rating=3).rating == 3


def test_user_create_requires_valid_email():
    with pytest.raises(ValidationError):
        UserCreate(email="not-an-email", password="supersecret123")


def test_user_create_requires_minimum_password_length():
    with pytest.raises(ValidationError):
        UserCreate(email="user@example.com", password="short")