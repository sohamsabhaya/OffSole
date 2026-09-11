def test_list_products(client):
    response = client.get("/api/v1/products/")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["products"]) >= 1
    assert data["products"][0]["name"] == "Air Jordan 1 High OG"


def test_product_detail_success(client, mock_db):
    product_id = str(mock_db.products.docs[0]["_id"])
    response = client.get(f"/api/v1/products/{product_id}/")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == product_id
    assert data["brand"] == "Nike"


def test_product_detail_not_found(client):
    response = client.get("/api/v1/products/507f1f77bcf86cd799439011/")
    assert response.status_code == 404
    data = response.json()
    assert data["error"]["code"] == "NOT_FOUND"


def test_search_products(client):
    response = client.get("/api/v1/products/?search=Jordan")
    assert response.status_code == 200
    data = response.json()
    assert len(data["products"]) >= 1
