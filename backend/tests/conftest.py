import pytest
from bson import ObjectId
from fastapi.testclient import TestClient

from app.core.security import create_access_token, get_password_hash
from app.database import get_database
from app.main import app


class MockCollection:
    def __init__(self, name: str):
        self.name = name
        self.docs = []

    async def insert_one(self, doc: dict):
        d = dict(doc)
        if "_id" not in d:
            d["_id"] = ObjectId()
        self.docs.append(d)

        class InsertResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id

        return InsertResult(d["_id"])

    async def find_one(self, query: dict):
        for d in self.docs:
            match = True
            for k, v in query.items():
                if k == "_id":
                    if str(d.get("_id")) != str(v):
                        match = False
                        break
                elif d.get(k) != v:
                    match = False
                    break
            if match:
                return dict(d)
        return None

    def find(self, query: dict = None):
        results = []
        for d in self.docs:
            if not query:
                results.append(dict(d))
            else:
                match = True
                for k, v in query.items():
                    if k == "$or":
                        or_match = False
                        for sub_q in v:
                            for sub_k, sub_v in sub_q.items():
                                if isinstance(sub_v, dict) and "$regex" in sub_v:
                                    term = sub_v["$regex"].lower()
                                    if term in str(d.get(sub_k, "")).lower():
                                        or_match = True
                                        break
                                elif d.get(sub_k) == sub_v:
                                    or_match = True
                                    break
                            if or_match:
                                break
                        if not or_match:
                            match = False
                            break
                    elif isinstance(v, dict) and "$regex" in v:
                        term = v["$regex"].strip("^$").lower()
                        if term != str(d.get(k, "")).lower():
                            match = False
                            break
                    elif d.get(k) != v:
                        match = False
                        break
                if match:
                    results.append(dict(d))

        class MockCursor:
            def __init__(self, items):
                self.items = items

            def sort(self, *args, **kwargs):
                return self

            def skip(self, n):
                self.items = self.items[n:]
                return self

            def limit(self, n):
                self.items = self.items[:n:]
                return self

            def __aiter__(self):
                self._iter = iter(self.items)
                return self

            async def __anext__(self):
                try:
                    return next(self._iter)
                except StopIteration:
                    raise StopAsyncIteration

        return MockCursor(results)

    async def count_documents(self, query: dict = None):
        if not query:
            return len(self.docs)
        count = 0
        for d in self.docs:
            match = True
            for k, v in query.items():
                if d.get(k) != v:
                    match = False
                    break
            if match:
                count += 1
        return count

    async def update_one(self, query: dict, update: dict, upsert: bool = False):
        set_vals = update.get("$set", {})
        for d in self.docs:
            match = True
            for k, v in query.items():
                if d.get(k) != v:
                    match = False
                    break
            if match:
                d.update(set_vals)
                return
        if upsert:
            new_d = dict(set_vals)
            new_d.update(query)
            if "_id" not in new_d:
                new_d["_id"] = ObjectId()
            self.docs.append(new_d)

    async def find_one_and_update(self, query: dict, update: dict, return_document=True):
        set_vals = update.get("$set", {})
        for d in self.docs:
            match = True
            for k, v in query.items():
                if k == "_id":
                    if str(d.get("_id")) != str(v):
                        match = False
                        break
                elif d.get(k) != v:
                    match = False
                    break
            if match:
                d.update(set_vals)
                return dict(d)
        return None

    async def delete_one(self, query: dict):
        for i, d in enumerate(self.docs):
            match = True
            for k, v in query.items():
                if k == "_id":
                    if str(d.get("_id")) != str(v):
                        match = False
                        break
                elif d.get(k) != v:
                    match = False
                    break
            if match:
                self.docs.pop(i)

                class DelResult:
                    deleted_count = 1

                return DelResult()

        class DelResult:
            deleted_count = 0

        return DelResult()

    async def create_index(self, *args, **kwargs):
        return "index_created"


class MockDatabase:
    def __init__(self):
        self.users = MockCollection("users")
        self.products = MockCollection("products")
        self.cart = MockCollection("cart")
        self.orders = MockCollection("orders")


@pytest.fixture
def mock_db():
    db = MockDatabase()

    admin_id = ObjectId()
    db.users.docs.append(
        {
            "_id": admin_id,
            "username": "admin_user",
            "email": "admin@offsole.com",
            "hashed_password": get_password_hash("adminpass123"),
            "is_admin": True,
            "role": "admin",
        }
    )

    customer_id = ObjectId()
    db.users.docs.append(
        {
            "_id": customer_id,
            "username": "test_customer",
            "email": "customer@example.com",
            "hashed_password": get_password_hash("password123"),
            "is_admin": False,
            "role": "customer",
        }
    )

    product_id = ObjectId()
    db.products.docs.append(
        {
            "_id": product_id,
            "name": "Air Jordan 1 High OG",
            "brand": "Nike",
            "price": 180.0,
            "description": "Iconic high-top sneaker",
            "image": "/media/sneakers/images/jordan_1_retro.jpg",
            "images": ["/media/sneakers/images/jordan_1_retro.jpg"],
            "sizes": [8.0, 9.0, 10.0, 11.0],
            "gender": "Men",
            "category": "High Top",
            "color": "Red/Black",
            "in_stock": 15,
        }
    )

    return db


@pytest.fixture
def client(mock_db):
    app.dependency_overrides[get_database] = lambda: mock_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def customer_token(mock_db) -> str:
    customer = mock_db.users.docs[1]
    return create_access_token(
        subject=str(customer["_id"]), claims={"username": customer["username"], "is_admin": False}
    )


@pytest.fixture
def admin_token(mock_db) -> str:
    admin = mock_db.users.docs[0]
    return create_access_token(
        subject=str(admin["_id"]), claims={"username": admin["username"], "is_admin": True}
    )
