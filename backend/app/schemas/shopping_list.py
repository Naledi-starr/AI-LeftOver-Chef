"""Pydantic schemas for shopping list items."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ShoppingListItemBase(BaseModel):
    """Fields shared by create and update payloads."""

    name: str = Field(min_length=1, max_length=255)
    quantity: float = Field(default=1.0, gt=0)
    unit: str | None = Field(default=None, max_length=50)
    category: str | None = Field(default=None, max_length=50)


class ShoppingListItemCreate(ShoppingListItemBase):
    """Payload for adding an item to the shopping list."""


class ShoppingListItemUpdate(BaseModel):
    """Payload for updating a shopping list item. All fields optional."""

    name: str | None = Field(default=None, min_length=1, max_length=255)
    quantity: float | None = Field(default=None, gt=0)
    unit: str | None = Field(default=None, max_length=50)
    category: str | None = Field(default=None, max_length=50)
    is_purchased: bool | None = None


class ShoppingListItemRead(ShoppingListItemBase):
    """Public-facing representation of a shopping list item."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    is_purchased: bool
    created_at: datetime
    updated_at: datetime