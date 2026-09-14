"""Shared pytest fixtures.

Tests run against a dedicated Postgres database ("<app db>_test"),
created automatically if it doesn't exist. Tables are dropped and
recreated before every test function, so tests never see leftover
data from a previous test.
"""

import uuid
from urllib.parse import urlparse

import psycopg
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.config import settings
from app.database import Base, get_db
from app.main import app


TEST_DB_NAME = "leftover_chef_test"


def _admin_dsn() -> str:
    """DSN for connecting to the default 'postgres' database, used only
    to create the test database if it doesn't already exist.
    """

    parsed = urlparse(settings.DATABASE_URL.replace("+psycopg", ""))
    return (
        f"postgresql://{parsed.username}:{parsed.password}"
        f"@{parsed.hostname}:{parsed.port or 5432}/postgres"
    )


def _test_database_url() -> str:
    parsed = urlparse(settings.DATABASE_URL.replace("+psycopg", ""))
    return (
        f"postgresql+psycopg://{parsed.username}:{parsed.password}"
        f"@{parsed.hostname}:{parsed.port or 5432}/{TEST_DB_NAME}"
    )


def _ensure_test_database_exists() -> None:
    conn = psycopg.connect(_admin_dsn(), autocommit=True)
    try:
        exists = conn.execute(
            "SELECT 1 FROM pg_database WHERE datname = %s", (TEST_DB_NAME,)
        ).fetchone()
        if not exists:
            conn.execute(f'CREATE DATABASE "{TEST_DB_NAME}"')
    finally:
        conn.close()


_ensure_test_database_exists()

engine = create_engine(_test_database_url())
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture()
def client():
    """A TestClient wired to a freshly reset test database."""

    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture()
def auth_headers(client):
    """Registers and logs in a user, returning Authorization headers for them."""

    def _make(email: str = "user@example.com", password: str = "supersecret123"):
        client.post(
            "/auth/register",
            json={
                "username": f"user_{uuid.uuid4().hex[:8]}",
                "email": email,
                "password": password,
            },
        )
        response = client.post(
            "/auth/login",
            data={"username": email, "password": password},
        )
        token = response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}

    return _make
