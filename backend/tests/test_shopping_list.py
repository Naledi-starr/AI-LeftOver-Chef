"""Tests for shopping list CRUD and its two special actions."""

RECIPE_PAYLOAD = {
    "title": "Fried Rice",
    "description": "Quick fried rice from leftovers.",
    "ingredients": ["2 cups rice", "1 egg", "soy sauce"],
    "instructions": ["Heat oil.", "Scramble egg.", "Stir in rice and sauce."],
    "cooking_time_minutes": 15,
    "servings": 2,
}


def test_create_and_purchase_item(client, auth_headers):
    headers = auth_headers()

    item = client.post(
        "/shopping-list",
        json={"name": "Olive oil", "quantity": 1, "unit": "bottle"},
        headers=headers,
    ).json()
    assert item["is_purchased"] is False

    updated = client.put(
        f"/shopping-list/{item['id']}",
        json={"is_purchased": True},
        headers=headers,
    ).json()
    assert updated["is_purchased"] is True


def test_delete_shopping_list_item(client, auth_headers):
    headers = auth_headers()
    item = client.post(
        "/shopping-list", json={"name": "Bread", "quantity": 1}, headers=headers
    ).json()

    delete_response = client.delete(f"/shopping-list/{item['id']}", headers=headers)
    assert delete_response.status_code == 204
    assert client.get("/shopping-list", headers=headers).json() == []


def test_add_missing_ingredients_from_recipe_skips_pantry_matches(
    client, auth_headers
):
    headers = auth_headers()

    # Pantry already has an exact-name match for one ingredient.
    client.post(
        "/pantry", json={"name": "soy sauce", "quantity": 1}, headers=headers
    )

    recipe = client.post("/api/recipes", json=RECIPE_PAYLOAD, headers=headers).json()

    response = client.post(
        f"/shopping-list/from-recipe/{recipe['id']}", headers=headers
    )

    assert response.status_code == 201
    added_names = {item["name"] for item in response.json()}
    assert added_names == {"2 cups rice", "1 egg"}
    assert "soy sauce" not in added_names


def test_add_missing_ingredients_twice_does_not_duplicate(client, auth_headers):
    headers = auth_headers()
    recipe = client.post("/api/recipes", json=RECIPE_PAYLOAD, headers=headers).json()

    first = client.post(f"/shopping-list/from-recipe/{recipe['id']}", headers=headers)
    second = client.post(
        f"/shopping-list/from-recipe/{recipe['id']}", headers=headers
    )

    assert len(first.json()) == 3
    assert len(second.json()) == 0

    all_items = client.get("/shopping-list", headers=headers).json()
    assert len(all_items) == 3


def test_add_missing_ingredients_for_unknown_recipe_is_404(client, auth_headers):
    headers = auth_headers()
    response = client.post("/shopping-list/from-recipe/9999", headers=headers)
    assert response.status_code == 404


def test_move_purchased_items_to_pantry(client, auth_headers):
    headers = auth_headers()

    item_a = client.post(
        "/shopping-list", json={"name": "Butter", "quantity": 1}, headers=headers
    ).json()
    client.post(
        "/shopping-list", json={"name": "Yogurt", "quantity": 1}, headers=headers
    )

    client.put(
        f"/shopping-list/{item_a['id']}",
        json={"is_purchased": True},
        headers=headers,
    )

    response = client.post("/shopping-list/move-purchased-to-pantry", headers=headers)

    assert response.status_code == 200
    moved_names = {item["name"] for item in response.json()}
    assert moved_names == {"Butter"}

    remaining_list = client.get("/shopping-list", headers=headers).json()
    assert {item["name"] for item in remaining_list} == {"Yogurt"}

    pantry = client.get("/pantry", headers=headers).json()
    assert {item["name"] for item in pantry} == {"Butter"}


def test_cannot_access_another_users_shopping_list_item(client, auth_headers):
    owner_headers = auth_headers("owner@example.com")
    other_headers = auth_headers("other@example.com")

    item = client.post(
        "/shopping-list", json={"name": "Pasta", "quantity": 1}, headers=owner_headers
    ).json()

    response = client.put(
        f"/shopping-list/{item['id']}",
        json={"is_purchased": True},
        headers=other_headers,
    )
    assert response.status_code == 404