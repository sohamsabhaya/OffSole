from pydantic import BaseModel


class ProductBase(BaseModel):
    """Core sneaker attributes."""

    name: str
    brand: str
    price: float
    description: str
    image: str
    available_sizes: dict[str, bool] = {
        "UK6": True,
        "UK7": True,
        "UK8": True,
        "UK9": True,
        "UK10": True,
        "UK11": True,
    }
    gender: str | None = "Unisex"
    colour: str | None = "Multi"


class ProductResponse(ProductBase):
    """Sneaker details including its string identifier for the React UI."""

    id: str


# Alias ProductDetailResponse to ProductResponse for flexible imports
ProductDetailResponse = ProductResponse


class ProductListResponse(BaseModel):
    """Envelope response for GET /api/products/"""

    success: bool = True
    products: list[ProductResponse]
    count: int = 0
