from pydantic import BaseModel, Field
from typing import List


class AddToCartRequest(BaseModel):
    """Payload sent by React when clicking 'Add to Bag'."""
    product_id: str
    size: str
    quantity: int = Field(default=1, ge=1, le=10, description="Quantity between 1 and 10")


class UpdateCartItemRequest(BaseModel):
    """Payload sent when modifying quantity (+ / -) in the Cart page."""
    quantity: int = Field(..., ge=1, le=10, description="New quantity between 1 and 10")


class CartItemResponse(BaseModel):
    """Individual sneaker item inside a user's active bag."""
    id: str
    product_id: str
    product_name: str
    product_price: float
    product_image: str
    size: str
    quantity: int
    total_price: float


class CartResponse(BaseModel):
    """Response returned for GET /api/cart/get/"""
    success: bool = True
    items: List[CartItemResponse] = []


class CartCountResponse(BaseModel):
    """Response returned for GET /api/cart/count/ for the Navbar badge."""
    count: int = 0
