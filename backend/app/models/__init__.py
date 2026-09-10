"""ORM models package.

Every model module should be imported here so that it registers its
table with `Base.metadata`. This is what allows
`alembic revision --autogenerate` to detect new models and Alembic's
`env.py` to see them (it imports this package).
"""

from app.models.user import User  # noqa: F401