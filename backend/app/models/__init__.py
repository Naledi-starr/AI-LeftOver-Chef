"""ORM models package.

Every model module should be imported here so that it registers its
table with `Base.metadata`. This is what allows
`alembic revision --autogenerate` to detect new models and Alembic's
`env.py` to see them (it imports this package).
"""

from app.models.user import User  # noqa: F401
from app.models.pantry_item import PantryItem  # noqa: F401
from app.models.recipe import Recipe, RecipeIngredient  # noqa: F401
from app.models.shopping_list_item import ShoppingListItem  # noqa: F401