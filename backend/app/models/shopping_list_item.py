"""Shopping list item model."""

from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ShoppingListItem(Base):
    """A single item on a user's shopping list."""

    __tablename__ = "shopping_list_items"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )

    name: Mapped[str] = mapped_column(String(255), nullable=False)

    quantity: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)

    unit: Mapped[str | None] = mapped_column(String(50), nullable=True)

    category: Mapped[str | None] = mapped_column(String(50), nullable=True)

    is_purchased: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    owner = relationship("User")