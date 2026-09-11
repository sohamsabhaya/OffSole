from pydantic import BaseModel, Field
from typing import Optional


class ProcessOrderRequest(BaseModel):
    """Payload sent from Checkout.js when submitting address & payment."""
    phone_number: str = Field(..., min_length=10, max_length=15, description="Contact phone number")
    address: str = Field(..., min_length=5, description="Delivery street address")
    pincode: str = Field(..., min_length=4, max_length=10, description="Postal pincode")
    payment_method: str = Field(default="card", description="Payment method: card, cod, upi")


class OrderSuccessResponse(BaseModel):
    """Response returned upon successful order placement."""
    success: bool = True
    order_id: str
    order_number: str
    message: str = "Order placed successfully!"
    total_amount: Optional[float] = None
