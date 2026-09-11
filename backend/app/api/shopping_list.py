"""Shopping list item endpoints. All routes are scoped to the current user."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_active_user
from app.database import get_db
from app.models.pantry_item import PantryItem
from app.models.recipe import Recipe
from app.models.shopping_list_item import ShoppingListItem
from app.models.user import User
from app.schemas.pantry import PantryItemRead
from app.schemas.shopping_list import (
    ShoppingListItemCreate,
    ShoppingListItemRead,
    ShoppingListItemUpdate,
)


router = APIRouter(prefix="/shopping-list", tags=["Shopping List"])


def _get_owned_item_or_404(
    item_id: int,
    db: Session,
    current_user: User,
) -> ShoppingListItem:
    item = (
        db.query(ShoppingListItem)
        .filter(
            ShoppingListItem.id == item_id,
            ShoppingListItem.user_id == current_user.id,
        )
        .first()
    )

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shopping list item not found.",
        )

    return item


@router.get("", response_model=list[ShoppingListItemRead])
def list_shopping_list_items(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> list[ShoppingListItem]:
    return (
        db.query(ShoppingListItem)
        .filter(ShoppingListItem.user_id == current_user.id)
        .order_by(ShoppingListItem.is_purchased, ShoppingListItem.created_at)
        .all()
    )


@router.post(
    "",
    response_model=ShoppingListItemRead,
    status_code=status.HTTP_201_CREATED,
)
def create_shopping_list_item(
    payload: ShoppingListItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> ShoppingListItem:
    item = ShoppingListItem(**payload.model_dump(), user_id=current_user.id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{item_id}", response_model=ShoppingListItemRead)
def update_shopping_list_item(
    item_id: int,
    payload: ShoppingListItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> ShoppingListItem:
    item = _get_owned_item_or_404(item_id, db, current_user)

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_shopping_list_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> None:
    item = _get_owned_item_or_404(item_id, db, current_user)
    db.delete(item)
    db.commit()


@router.post("/from-recipe/{recipe_id}", response_model=list[ShoppingListItemRead])
def add_missing_ingredients_from_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> list[ShoppingListItem]:
    recipe = (
        db.query(Recipe)
        .filter(Recipe.id == recipe_id, Recipe.user_id == current_user.id)
        .first()
    )
    if recipe is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found.",
        )

    items = [
        ShoppingListItem(
            user_id=current_user.id,
            name=ingredient.name,
            quantity=1.0,
        )
        for ingredient in recipe.ingredients
    ]
    db.add_all(items)
    db.commit()
    for item in items:
        db.refresh(item)
    return items


@router.post("/move-purchased-to-pantry", response_model=list[PantryItemRead])
def move_purchased_items_to_pantry(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> list[PantryItem]:
    items = (
        db.query(ShoppingListItem)
        .filter(
            ShoppingListItem.user_id == current_user.id,
            ShoppingListItem.is_purchased.is_(True),
        )
        .all()
    )

    pantry_items = [
        PantryItem(
            user_id=current_user.id,
            name=item.name,
            quantity=item.quantity,
            unit=item.unit,
            category=item.category,
        )
        for item in items
    ]
    db.add_all(pantry_items)
    for item in items:
        db.delete(item)
    db.commit()
    for item in pantry_items:
        db.refresh(item)
    return pantry_items