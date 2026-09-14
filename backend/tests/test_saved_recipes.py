"""Tests for saved recipe CRUD, favouriting, and rating."""

RECIPE_PAYLOAD = {
    "title": "Fried Rice",
    "description": "Quick fried rice from leftovers.",
    "ingredients": ["2 cups rice", "1 egg", "soy sauce"],
    "instructions": ["Heat oil.", "Scramble egg.", "Stir in rice and sauce."],
    "cooking_time_minutes": 15,
    "servings": 2,
}


def test_save_recipe_preserves_ingredient_order(client, auth_headers):
    headers = auth_headers()

    response = client.post("/api/recipes", json=RECIPE_PAYLOAD, headers=headers)

    assert response.status_code == 201
    body = response.json()
    assert body["ingredients"] == RECIPE_PAYLOAD["ingredients"]
    assert body["is_favorite"] is False
    assert body["rating"] is None


def test_list_and_filter_favorites(client, auth_headers):
    headers = auth_headers()

    recipe = client.post("/api/recipes", json=RECIPE_PAYLOAD, headers=headers).json()
    client.post(
        "/api/recipes",
        json={**RECIPE_PAYLOAD, "title": "Veggie Soup"},
        headers=headers,
    )

    client.patch(
        f"/api/recipes/{recipe['id']}",
        json={"is_favorite": True},
        headers=headers,
    )

    all_recipes = client.get("/api/recipes", headers=headers).json()
    favorites = client.get(
        "/api/recipes?favorites_only=true", headers=headers
    ).json()

    assert len(all_recipes) == 2
    assert len(favorites) == 1
    assert favorites[0]["title"] == "Fried Rice"


def test_rate_and_leave_feedback(client, auth_headers):
    headers = auth_headers()
    recipe = client.post("/api/recipes", json=RECIPE_PAYLOAD, headers=headers).json()

    response = client.patch(
        f"/api/recipes/{recipe['id']}",
        json={"rating": 5, "feedback": "Great weeknight dinner."},
        headers=headers,
    )

    assert response.status_code == 200
    body = response.json()
    assert body["rating"] == 5
    assert body["feedback"] == "Great weeknight dinner."


def test_rating_out_of_range_is_rejected(client, auth_headers):
    headers = auth_headers()
    recipe = client.post("/api/recipes", json=RECIPE_PAYLOAD, headers=headers).json()

    response = client.patch(
        f"/api/recipes/{recipe['id']}", json={"rating": 6}, headers=headers
    )
    assert response.status_code == 422


def test_delete_recipe(client, auth_headers):
    headers = auth_headers()
    recipe = client.post("/api/recipes", json=RECIPE_PAYLOAD, headers=headers).json()

    delete_response = client.delete(f"/api/recipes/{recipe['id']}", headers=headers)
    assert delete_response.status_code == 204

    list_response = client.get("/api/recipes", headers=headers)
    assert list_response.json() == []


def test_cannot_access_another_users_recipe(client, auth_headers):
    owner_headers = auth_headers("owner@example.com")
    other_headers = auth_headers("other@example.com")

    recipe = client.post(
        "/api/recipes", json=RECIPE_PAYLOAD, headers=owner_headers
    ).json()

    get_response = client.get(f"/api/recipes/{recipe['id']}", headers=other_headers)
    patch_response = client.patch(
        f"/api/recipes/{recipe['id']}",
        json={"is_favorite": True},
        headers=other_headers,
    )

    assert get_response.status_code == 404
    assert patch_response.status_code == 404