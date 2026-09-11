from typing import Any

from pydantic import BaseModel, Field


class ProcessOrderRequest(BaseModel):
    phone_number: str = Field(..., min_length=10, max_length=15, description="Contact phone number")
    address: str = Field(..., min_length=5, description="Delivery street address")
    pincode: str = Field(..., min_length=4, max_length=10, description="Postal pincode")
    payment_method: str = Field(default="card", description="Payment method: card, cod, upi")


class OrderSuccessResponse(BaseModel):
    success: bool = True
    order_id: str | None = None
    order_number: str
    message: str = "Order placed successfully!"
    total_amount: float | None = None
    order: dict[str, Any] | None = None
