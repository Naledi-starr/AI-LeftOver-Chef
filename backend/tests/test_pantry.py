"""Tests for pantry CRUD operations and per-user ownership."""


def test_create_and_list_pantry_item(client, auth_headers):
    headers = auth_headers()

    create_response = client.post(
        "/pantry",
        json={"name": "Rice", "quantity": 2, "unit": "kg", "category": "pantry"},
        headers=headers,
    )
    assert create_response.status_code == 201
    assert create_response.json()["name"] == "Rice"

    list_response = client.get("/pantry", headers=headers)
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1


def test_expiry_status_is_computed(client, auth_headers):
    headers = auth_headers()

    expired = client.post(
        "/pantry",
        json={"name": "Old Milk", "quantity": 1, "expiry_date": "2020-01-01"},
        headers=headers,
    ).json()
    fresh = client.post(
        "/pantry",
        json={"name": "New Milk", "quantity": 1, "expiry_date": "2099-01-01"},
        headers=headers,
    ).json()
    no_date = client.post(
        "/pantry", json={"name": "Salt", "quantity": 1}, headers=headers
    ).json()

    assert expired["expiry_status"] == "expired"
    assert fresh["expiry_status"] == "fresh"
    assert no_date["expiry_status"] is None


def test_update_pantry_item_partial(client, auth_headers):
    headers = auth_headers()

    item = client.post(
        "/pantry", json={"name": "Eggs", "quantity": 12}, headers=headers
    ).json()

    response = client.put(
        f"/pantry/{item['id']}", json={"quantity": 6}, headers=headers
    )

    assert response.status_code == 200
    body = response.json()
    assert body["quantity"] == 6
    assert body["name"] == "Eggs"  # untouched fields remain


def test_delete_pantry_item(client, auth_headers):
    headers = auth_headers()

    item = client.post(
        "/pantry", json={"name": "Butter", "quantity": 1}, headers=headers
    ).json()

    delete_response = client.delete(f"/pantry/{item['id']}", headers=headers)
    assert delete_response.status_code == 204

    list_response = client.get("/pantry", headers=headers)
    assert list_response.json() == []


def test_pantry_item_validation_rejects_non_positive_quantity(client, auth_headers):
    headers = auth_headers()

    response = client.post(
        "/pantry", json={"name": "Flour", "quantity": 0}, headers=headers
    )
    assert response.status_code == 422


def test_cannot_access_another_users_pantry_item(client, auth_headers):
    owner_headers = auth_headers("owner@example.com")
    other_headers = auth_headers("other@example.com")

    item = client.post(
        "/pantry", json={"name": "Cheese", "quantity": 1}, headers=owner_headers
    ).json()

    get_response = client.get(f"/pantry/{item['id']}", headers=other_headers)
    delete_response = client.delete(f"/pantry/{item['id']}", headers=other_headers)

    assert get_response.status_code == 404
    assert delete_response.status_code == 404

    # Confirm it's untouched for the real owner.
    owner_get = client.get(f"/pantry/{item['id']}", headers=owner_headers)
    assert owner_get.status_code == 200


def test_pantry_requires_auth(client):
    response = client.get("/pantry")
    assert response.status_code == 401