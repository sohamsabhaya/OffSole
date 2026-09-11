from pydantic import BaseModel, Field
from typing import Dict, List, Optional


class ProductCreate(BaseModel):
    """Payload for Admin adding a new sneaker."""
    name: str = Field(..., min_length=2)
    brand: str = Field(..., min_length=2)
    price: float = Field(..., gt=0)
    description: str = Field(...)
    image: str = Field(...)
    available_sizes: Dict[str, bool] = {
        "UK6": True,
        "UK7": True,
        "UK8": True,
        "UK9": True,
        "UK10": True,
        "UK11": True
    }
    gender: str = "Unisex"
    colour: str = "Standard"


class ProductUpdate(BaseModel):
    """Payload for Admin editing an existing sneaker."""
    name: Optional[str] = None
    brand: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None
    image: Optional[str] = None
    available_sizes: Optional[Dict[str, bool]] = None
    gender: Optional[str] = None
    colour: Optional[str] = None


class RecentOrder(BaseModel):
    id: str
    order_number: str
    username: str
    total_amount: float
    order_status: str
    created_at: str


class AdminStatsResponse(BaseModel):
    success: bool = True
    total_revenue: float
    total_orders: int
    total_users: int
    total_products: int
    recent_orders: List[dict] = []
