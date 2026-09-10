"""Pydantic schemas for pantry items."""

from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, computed_field

EXPIRING_SOON_WINDOW_DAYS = 3


class PantryItemBase(BaseModel):
    """Fields shared by create and update payloads."""

    name: str = Field(min_length=1, max_length=255)
    quantity: float = Field(default=1.0, gt=0)
    unit: str | None = Field(default=None, max_length=50)
    category: str | None = Field(default=None, max_length=50)
    expiry_date: date | None = None


class PantryItemCreate(PantryItemBase):
    """Payload for creating a pantry item."""


class PantryItemUpdate(BaseModel):
    """Payload for updating a pantry item. All fields are optional."""

    name: str | None = Field(default=None, min_length=1, max_length=255)
    quantity: float | None = Field(default=None, gt=0)
    unit: str | None = Field(default=None, max_length=50)
    category: str | None = Field(default=None, max_length=50)
    expiry_date: date | None = None


class PantryItemRead(PantryItemBase):
    """Public-facing representation of a pantry item."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime

    @computed_field
    @property
    def expiry_status(self) -> str | None:
        """One of 'expired', 'expiring_soon', 'fresh', or None if unset."""

        if self.expiry_date is None:
            return None

        days_remaining = (self.expiry_date - date.today()).days

        if days_remaining < 0:
            return "expired"
        if days_remaining <= EXPIRING_SOON_WINDOW_DAYS:
            return "expiring_soon"
        return "fresh"