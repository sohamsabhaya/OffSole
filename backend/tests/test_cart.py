def test_get_cart_empty(client, customer_token):
    headers = {"Authorization": f"Bearer {customer_token}"}
    response = client.get("/api/v1/cart/", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["total_items"] == 0


def test_add_item_to_cart(client, customer_token, mock_db):
    product_id = str(mock_db.products.docs[0]["_id"])
    headers = {"Authorization": f"Bearer {customer_token}"}
    payload = {"product_id": product_id, "size": "9.5", "quantity": 2}
    response = client.post("/api/v1/cart/items/", json=payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total_items"] == 2
    assert len(data["items"]) == 1
    assert data["items"][0]["quantity"] == 2


def test_cart_badge_count(client, customer_token):
    headers = {"Authorization": f"Bearer {customer_token}"}
    response = client.get("/api/v1/cart/count/", headers=headers)
    assert response.status_code == 200
    assert "count" in response.json()
