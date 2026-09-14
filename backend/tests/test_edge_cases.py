"""Tests for the health endpoint and less-common auth edge cases."""

import jwt

from app.config import settings
from app.core.security import create_access_token
from app.database import Base
from tests.conftest import TestingSessionLocal, engine


def test_health_check(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_token_with_no_subject_claim_is_rejected(client):
    # A token that's validly signed but missing the "sub" claim.
    token = jwt.encode(
        {"not_sub": "irrelevant"},
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )

    response = client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401


def test_token_for_nonexistent_user_is_rejected(client):
    # Well-formed token, but no user with this id exists.
    token = create_access_token(subject="999999")

    response = client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401


def test_deactivated_user_is_forbidden(client, auth_headers):
    headers = auth_headers("inactive@example.com")

    # Deactivate the user directly in the DB (no API surface for this yet).
    db = TestingSessionLocal()
    from app.models.user import User

    user = db.query(User).filter(User.email == "inactive@example.com").first()
    user.is_active = False
    db.commit()
    db.close()

    response = client.get("/users/me", headers=headers)
    assert response.status_code == 403