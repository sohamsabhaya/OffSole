from pydantic import BaseModel, Field
from typing import Dict, List, Optional


class ProductBase(BaseModel):
    """Core sneaker attributes."""
    name: str
    brand: str
    price: float
    description: str
    image: str
    available_sizes: Dict[str, bool] = {
        "UK6": True,
        "UK7": True,
        "UK8": True,
        "UK9": True,
        "UK10": True,
        "UK11": True
    }
    gender: Optional[str] = "Unisex"
    colour: Optional[str] = "Multi"


class ProductResponse(ProductBase):
    """Sneaker details including its string identifier for the React UI."""
    id: str


# Alias ProductDetailResponse to ProductResponse for flexible imports
ProductDetailResponse = ProductResponse


class ProductListResponse(BaseModel):
    """Envelope response for GET /api/products/"""
    success: bool = True
    products: List[ProductResponse]
    count: int = 0
