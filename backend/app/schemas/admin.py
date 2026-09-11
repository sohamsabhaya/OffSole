from typing import Any

from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    name: str = Field(..., min_length=2)
    brand: str = Field(..., min_length=2)
    price: float = Field(..., gt=0)
    description: str = Field(...)
    image: str | None = ""
    images: list[str] = []
    sizes: list[float] = [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11]
    gender: str = "Unisex"
    color: str = "Multi"
    category: str = "Lifestyle"
    in_stock: int = 20


class ProductUpdate(BaseModel):
    name: str | None = None
    brand: str | None = None
    price: float | None = None
    description: str | None = None
    image: str | None = None
    images: list[str] | None = None
    sizes: list[float] | None = None
    gender: str | None = None
    color: str | None = None
    category: str | None = None
    in_stock: int | None = None


class MonthlySalesItem(BaseModel):
    month: str
    revenue: float
    orders: int
    units: int


class CategorySalesItem(BaseModel):
    name: str
    value: float


class SalesAnalyticsResponse(BaseModel):
    monthly_sales: list[MonthlySalesItem]
    by_brand: list[CategorySalesItem]
    by_gender: list[CategorySalesItem]
    by_category: list[CategorySalesItem]
    by_color: list[CategorySalesItem]


class AdminStatsResponse(BaseModel):
    total_orders: int
    total_revenue: float
    total_units_sold: int
    average_order_value: float
    total_products: int
    total_users: int
    recent_orders: list[dict[str, Any]] = []
