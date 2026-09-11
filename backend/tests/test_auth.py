def test_auth_status_unauthenticated(client):
    response = client.get("/api/v1/auth/status/")
    assert response.status_code == 200
    data = response.json()
    assert data["is_authenticated"] is False


def test_signup_success(client):
    payload = {
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "strongpassword123",
    }
    response = client.post("/api/v1/auth/signup/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["user"]["username"] == "newuser"
    assert "access_token" in data


def test_signup_duplicate_email(client):
    payload = {"username": "dupuser", "email": "customer@example.com", "password": "password123"}
    response = client.post("/api/v1/auth/signup/", json=payload)
    assert response.status_code == 409
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "CONFLICT"


def test_login_success(client):
    payload = {"username": "test_customer", "password": "password123"}
    response = client.post("/api/v1/auth/login/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["user"]["email"] == "customer@example.com"


def test_login_invalid_password(client):
    payload = {"username": "test_customer", "password": "wrongpassword"}
    response = client.post("/api/v1/auth/login/", json=payload)
    assert response.status_code == 401
    data = response.json()
    assert data["error"]["code"] == "UNAUTHORIZED"


def test_auth_status_authenticated(client, customer_token):
    headers = {"Authorization": f"Bearer {customer_token}"}
    response = client.get("/api/v1/auth/status/", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["is_authenticated"] is True
    assert data["username"] == "test_customer"
    assert data["is_admin"] is False


def test_logout(client):
    response = client.post("/api/v1/auth/logout/")
    assert response.status_code == 200
    assert response.json()["success"] is True
