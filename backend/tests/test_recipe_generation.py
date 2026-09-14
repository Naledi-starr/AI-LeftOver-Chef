"""Tests for the AI recipe generation endpoint.

The OpenRouter API is never called in tests — `chat_completion` is
monkeypatched so these tests are deterministic, free, and don't
depend on network access.
"""

import json

import pytest

from app.services import recipe_service
from app.services.ai_client import AIClientError


VALID_AI_RESPONSE = json.dumps(
    {
        "title": "Fried Rice",
        "description": "Quick fried rice from leftovers.",
        "ingredients": ["2 cups rice", "1 egg"],
        "instructions": ["Heat oil.", "Stir-fry everything."],
        "cooking_time_minutes": 15,
        "servings": 2,
    }
)


def test_generate_recipe_success(client, monkeypatch):
    async def fake_chat_completion(system_prompt, user_prompt):
        return VALID_AI_RESPONSE

    monkeypatch.setattr(recipe_service, "chat_completion", fake_chat_completion)

    response = client.post(
        "/api/recipes/generate",
        json={"ingredients": ["rice", "egg"], "servings": 2},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["title"] == "Fried Rice"
    assert body["servings"] == 2


def test_generate_recipe_handles_fenced_json(client, monkeypatch):
    async def fake_chat_completion(system_prompt, user_prompt):
        return f"```json\n{VALID_AI_RESPONSE}\n```"

    monkeypatch.setattr(recipe_service, "chat_completion", fake_chat_completion)

    response = client.post(
        "/api/recipes/generate",
        json={"ingredients": ["rice", "egg"]},
    )

    assert response.status_code == 200
    assert response.json()["title"] == "Fried Rice"


def test_generate_recipe_returns_502_on_ai_client_error(client, monkeypatch):
    async def fake_chat_completion(system_prompt, user_prompt):
        raise AIClientError("The AI provider request failed.")

    monkeypatch.setattr(recipe_service, "chat_completion", fake_chat_completion)

    response = client.post(
        "/api/recipes/generate",
        json={"ingredients": ["rice"]},
    )

    assert response.status_code == 502


def test_generate_recipe_returns_502_on_malformed_ai_response(client, monkeypatch):
    async def fake_chat_completion(system_prompt, user_prompt):
        return "not valid json at all"

    monkeypatch.setattr(recipe_service, "chat_completion", fake_chat_completion)

    response = client.post(
        "/api/recipes/generate",
        json={"ingredients": ["rice"]},
    )

    assert response.status_code == 502


def test_generate_recipe_requires_at_least_one_ingredient(client):
    response = client.post("/api/recipes/generate", json={"ingredients": []})
    assert response.status_code == 422


def test_generate_recipe_rejects_too_many_servings(client):
    response = client.post(
        "/api/recipes/generate",
        json={"ingredients": ["rice"], "servings": 999},
    )
    assert response.status_code == 422