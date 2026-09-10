"""Pantry item endpoints. All routes are scoped to the current user."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_active_user
from app.database import get_db
from app.models.pantry_item import PantryItem
from app.models.user import User
from app.schemas.pantry import PantryItemCreate, PantryItemRead, PantryItemUpdate


router = APIRouter(prefix="/pantry", tags=["Pantry"])


def _get_owned_item_or_404(
    item_id: int,
    db: Session,
    current_user: User,
) -> PantryItem:
    """Fetch a pantry item, ensuring it belongs to the current user.

    Returns a 404 (not 403) when the item exists but belongs to someone
    else, so as not to reveal whether the id exists at all.
    """

    item = (
        db.query(PantryItem)
        .filter(
            PantryItem.id == item_id,
            PantryItem.user_id == current_user.id,
        )
        .first()
    )

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pantry item not found.",
        )

    return item


@router.get("", response_model=list[PantryItemRead])
def list_pantry_items(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> list[PantryItem]:
    """List all pantry items belonging to the current user.

    Ordered so items with the soonest expiry date appear first; items
    with no expiry date are listed last.
    """

    return (
        db.query(PantryItem)
        .filter(PantryItem.user_id == current_user.id)
        .order_by(PantryItem.expiry_date.is_(None), PantryItem.expiry_date)
        .all()
    )


@router.post("", response_model=PantryItemRead, status_code=status.HTTP_201_CREATED)
def create_pantry_item(
    payload: PantryItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> PantryItem:
    """Add a new item to the current user's pantry."""

    item = PantryItem(**payload.model_dump(), user_id=current_user.id)

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


@router.get("/{item_id}", response_model=PantryItemRead)
def get_pantry_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> PantryItem:
    """Fetch a single pantry item owned by the current user."""

    return _get_owned_item_or_404(item_id, db, current_user)


@router.put("/{item_id}", response_model=PantryItemRead)
def update_pantry_item(
    item_id: int,
    payload: PantryItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> PantryItem:
    """Update fields on a pantry item owned by the current user."""

    item = _get_owned_item_or_404(item_id, db, current_user)

    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)

    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pantry_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> None:
    """Delete a pantry item owned by the current user."""

    item = _get_owned_item_or_404(item_id, db, current_user)

    db.delete(item)
    db.commit()