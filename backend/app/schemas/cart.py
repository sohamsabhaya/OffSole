from pydantic import BaseModel, Field


class AddToCartRequest(BaseModel):
    product_id: str
    size: str | float
    quantity: int = Field(default=1, ge=1, le=10)


class UpdateCartItemRequest(BaseModel):
    quantity: int = Field(..., ge=0, le=10)


class CartItemResponse(BaseModel):
    id: str | None = None
    item_id: str | None = None
    product_id: str
    name: str | None = None
    product_name: str | None = None
    price: float | None = 0.0
    product_price: float | None = 0.0
    image: str | None = ""
    product_image: str | None = ""
    brand: str | None = ""
    size: str
    quantity: int = 1
    total_price: float | None = 0.0


class CartResponse(BaseModel):
    success: bool = True
    items: list[CartItemResponse] = []
    total_items: int = 0
    subtotal: float = 0.0


class CartCountResponse(BaseModel):
    count: int = 0
