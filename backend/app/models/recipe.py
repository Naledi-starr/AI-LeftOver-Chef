"""Saved recipe models."""

from datetime import datetime, timezone

from sqlalchemy import (
    JSON,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    Boolean,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Recipe(Base):
    """A recipe a user has saved, generally from an AI generation result."""

    __tablename__ = "recipes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )

    title: Mapped[str] = mapped_column(String(255), nullable=False)

    description: Mapped[str] = mapped_column(Text, nullable=False)

    # Ordered list of instruction steps, e.g. ["Boil the pasta.", "..."].
    instructions: Mapped[list[str]] = mapped_column(JSON, nullable=False)

    cooking_time_minutes: Mapped[int] = mapped_column(Integer, nullable=False)

    servings: Mapped[int] = mapped_column(Integer, nullable=False)

    is_favorite: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    rating: Mapped[int | None] = mapped_column(Integer, nullable=True)

    feedback: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    ingredients: Mapped[list["RecipeIngredient"]] = relationship(
        "RecipeIngredient",
        back_populates="recipe",
        cascade="all, delete-orphan",
        order_by="RecipeIngredient.position",
    )

    __table_args__ = (
        CheckConstraint(
            "rating IS NULL OR (rating >= 1 AND rating <= 5)",
            name="ck_recipes_rating_range",
        ),
    )


class RecipeIngredient(Base):
    """A single ingredient line belonging to a saved recipe."""

    __tablename__ = "recipe_ingredients"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    recipe_id: Mapped[int] = mapped_column(
        ForeignKey("recipes.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )

    # Raw ingredient line as generated, e.g. "2 cups cooked rice".
    name: Mapped[str] = mapped_column(String(255), nullable=False)

    # Preserves the original ordering of ingredients in the recipe.
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    recipe: Mapped["Recipe"] = relationship(
        "Recipe",
        back_populates="ingredients",
    )