def test_admin_stats_forbidden_for_customer(client, customer_token):
    headers = {"Authorization": f"Bearer {customer_token}"}
    response = client.get("/api/v1/admin/stats/", headers=headers)
    assert response.status_code == 403
    assert response.json()["error"]["code"] == "FORBIDDEN"


def test_admin_stats_success(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = client.get("/api/v1/admin/stats/", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "total_orders" in data
    assert "total_revenue" in data
    assert "total_products" in data


def test_admin_sales_analytics(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = client.get("/api/v1/admin/sales-analytics/", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "monthly_sales" in data
    assert "by_brand" in data
    assert "by_gender" in data


def test_admin_create_product(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    payload = {
        "name": "Yeezy Boost 350 V2",
        "brand": "Adidas",
        "price": 230.0,
        "description": "Primeknit running sneaker",
        "category": "Running",
        "gender": "Unisex",
        "color": "Onyx",
        "in_stock": 10,
    }
    response = client.post("/api/v1/admin/products/", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Yeezy Boost 350 V2"
    assert data["brand"] == "Adidas"
