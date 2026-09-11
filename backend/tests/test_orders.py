def test_checkout_empty_cart_fails(client, customer_token):
    headers = {"Authorization": f"Bearer {customer_token}"}
    payload = {
        "phone_number": "1234567890",
        "address": "123 Sneaker Street",
        "pincode": "10001",
        "payment_method": "card",
    }
    response = client.post("/api/v1/cart/checkout/", json=payload, headers=headers)
    assert response.status_code == 400
    assert response.json()["error"]["code"] == "BAD_REQUEST"


def test_checkout_successful_flow(client, customer_token, mock_db):
    headers = {"Authorization": f"Bearer {customer_token}"}
    product_id = str(mock_db.products.docs[0]["_id"])

    # 1. Add item to cart
    client.post(
        "/api/v1/cart/items/",
        json={"product_id": product_id, "size": "10.0", "quantity": 1},
        headers=headers,
    )

    # 2. Checkout
    payload = {
        "phone_number": "9876543210",
        "address": "456 Fashion Ave",
        "pincode": "90210",
        "payment_method": "card",
    }
    res = client.post("/api/v1/cart/checkout/", json=payload, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "order_number" in data
    assert data["order_number"].startswith("OFF-")

    # 3. Verify user orders endpoint
    orders_res = client.get("/api/v1/cart/orders/", headers=headers)
    assert orders_res.status_code == 200
    assert orders_res.json()["count"] == 1
