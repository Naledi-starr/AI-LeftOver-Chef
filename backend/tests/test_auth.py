"""Tests for registration, login, and the current-user endpoint."""

import uuid


def unique_email(prefix):
    return f"{prefix}+{uuid.uuid4().hex[:8]}@example.com"


def unique_username(prefix):
    return f"{prefix}_{uuid.uuid4().hex[:8]}"


def test_register_creates_user(client):
    email = unique_email("new")
    response = client.post(
        "/auth/register",
        json={
            "username": unique_username("new"),
            "email": email,
            "password": "supersecret123",
        },
    )

    assert response.status_code == 201
    body = response.json()
    assert body["email"] == email
    assert body["is_active"] is True
    assert "id" in body
    assert "hashed_password" not in body


def test_register_duplicate_email_is_rejected(client):
    email = unique_email("dupe")
    payload = {
        "username": unique_username("dupe"),
        "email": email,
        "password": "supersecret123",
    }

    first = client.post("/auth/register", json=payload)
    second = client.post("/auth/register", json=payload)

    assert first.status_code == 201
    assert second.status_code == 409


def test_register_rejects_short_password(client):
    response = client.post(
        "/auth/register",
        json={
            "username": unique_username("short"),
            "email": unique_email("short"),
            "password": "short",
        },
    )

    assert response.status_code == 422


def test_login_with_correct_credentials_returns_token(client):
    email = unique_email("login")
    client.post(
        "/auth/register",
        json={
            "username": unique_username("login"),
            "email": email,
            "password": "supersecret123",
        },
    )

    response = client.post(
        "/auth/login",
        data={"username": email, "password": "supersecret123"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert len(body["access_token"]) > 0


def test_login_with_wrong_password_is_rejected(client):
    email = unique_email("wrongpass")
    client.post(
        "/auth/register",
        json={
            "username": unique_username("wrongpass"),
            "email": email,
            "password": "supersecret123",
        },
    )

    response = client.post(
        "/auth/login",
        data={"username": email, "password": "not-it"},
    )

    assert response.status_code == 401


def test_login_with_unknown_email_is_rejected(client):
    response = client.post(
        "/auth/login",
        data={"username": unique_email("nobody"), "password": "supersecret123"},
    )

    assert response.status_code == 401


def test_me_requires_token(client):
    response = client.get("/users/me")
    assert response.status_code == 401


def test_me_returns_current_user(client, auth_headers):
    email = unique_email("me")
    headers = auth_headers(email, "supersecret123")

    response = client.get("/users/me", headers=headers)

    assert response.status_code == 200
    assert response.json()["email"] == email


def test_me_rejects_garbage_token(client):
    response = client.get(
        "/users/me", headers={"Authorization": "Bearer not-a-real-token"}
    )
    assert response.status_code == 401
