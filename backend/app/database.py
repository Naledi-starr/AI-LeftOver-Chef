"""Database engine and session management.

This module sets up the SQLAlchemy engine, session factory, and the
declarative base that all ORM models inherit from. It also provides a
FastAPI dependency (`get_db`) for obtaining a request-scoped session.
"""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings


engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


class Base(DeclarativeBase):
    """Base class for all ORM models."""


def get_db() -> Generator[Session, None, None]:
    """Yield a database session scoped to a single request.

    Ensures the session is always closed, even if an error occurs
    while handling the request.
    """

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()