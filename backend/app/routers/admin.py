import uuid
from collections import defaultdict
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from app.database import get_database
from app.core.deps import get_current_admin_user
from app.schemas.admin import ProductCreate, ProductUpdate, AdminStatsResponse
from app.schemas.product import ProductResponse
from app.crud.product import get_product_by_id, _format_product

router = APIRouter(prefix="/api/admin", tags=["Admin Dashboard"])


@router.get("/stats/", response_model=AdminStatsResponse)
async def get_admin_stats(
    admin: dict = Depends(get_current_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Retrieves high-level sales metrics, catalog count, and recent orders.
    Requires Admin privileges.
    """
    total_orders = await db.orders.count_documents({})
    total_users = await db.users.count_documents({})
    total_products = await db.products.count_documents({})
    
    # Calculate total revenue
    orders_cursor = db.orders.find({})
    total_revenue = 0.0
    async for ord_doc in orders_cursor:
        total_revenue += float(ord_doc.get("total_amount", 0.0))
        
    # Get recent orders (up to 50)
    recent_cursor = db.orders.find({}).sort("created_at", -1).limit(50)
    recent_orders = []
    async for ord_doc in recent_cursor:
        recent_orders.append({
            "id": str(ord_doc.get("_id", "")),
            "order_number": ord_doc.get("order_number", ""),
            "username": ord_doc.get("username", "Guest"),
            "phone_number": ord_doc.get("phone_number", ""),
            "address": ord_doc.get("address", ""),
            "pincode": ord_doc.get("pincode", ""),
            "payment_method": ord_doc.get("payment_method", "card"),
            "payment_status": ord_doc.get("payment_status", "paid"),
            "total_amount": float(ord_doc.get("total_amount", 0.0)),
            "order_status": ord_doc.get("order_status", "processing"),
            "items": ord_doc.get("items", []),
            "created_at": str(ord_doc.get("created_at", ""))
        })
        
    return AdminStatsResponse(
        success=True,
        total_revenue=round(total_revenue, 2),
        total_orders=total_orders,
        total_users=total_users,
        total_products=total_products,
        recent_orders=recent_orders
    )


@router.post("/products/", response_model=ProductResponse)
async def create_product(
    payload: ProductCreate,
    admin: dict = Depends(get_current_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Adds a new sneaker to the catalog.
    Requires Admin privileges.
    """
    doc = payload.model_dump()
    doc["_id"] = str(uuid.uuid4().hex)[:24]
    
    await db.products.insert_one(doc)
    return _format_product(doc)


@router.put("/products/{product_id}/", response_model=ProductResponse)
async def update_product(
    product_id: str,
    payload: ProductUpdate,
    admin: dict = Depends(get_current_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Updates an existing sneaker's details (price, stock, title, etc).
    Requires Admin privileges.
    """
    product = await get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sneaker with ID '{product_id}' not found."
        )
        
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        return product
        
    # Update in MongoDB
    if ObjectId.is_valid(product_id):
        await db.products.update_one({"_id": ObjectId(product_id)}, {"$set": updates})
    await db.products.update_one({"_id": product_id}, {"$set": updates})
    
    updated_doc = await get_product_by_id(db, product_id)
    return updated_doc


@router.delete("/products/{product_id}/")
async def delete_product(
    product_id: str,
    admin: dict = Depends(get_current_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Permanently removes a sneaker from the catalog.
    Requires Admin privileges.
    """
    product = await get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sneaker with ID '{product_id}' not found."
        )
        
    if ObjectId.is_valid(product_id):
        await db.products.delete_one({"_id": ObjectId(product_id)})
    await db.products.delete_one({"_id": product_id})
    
    return {
        "success": True,
        "message": f"Sneaker '{product.get('name')}' (ID: {product_id}) was successfully deleted."
    }


@router.get("/analytics/")
async def get_analytics(
    admin: dict = Depends(get_current_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Returns aggregated analytics for the admin dashboard:
    - Sales by brand (units & revenue)
    - Sales by gender (units)
    - Sales by colour (units)
    - Monthly sales revenue (last 12 months)
    """
    by_brand = defaultdict(lambda: {"units": 0, "revenue": 0.0})
    by_gender = defaultdict(int)
    by_colour = defaultdict(int)
    by_month = defaultdict(float)   # "YYYY-MM" -> revenue

    cursor = db.orders.find({})
    async for order in cursor:
        created_at = order.get("created_at")
        month_key = ""
        if created_at:
            try:
                month_key = created_at.strftime("%Y-%m")
            except AttributeError:
                month_key = str(created_at)[:7]

        for it in order.get("items", []):
            qty = int(it.get("quantity", 1))
            rev = float(it.get("total_price", 0.0))
            brand = it.get("brand", "Unknown")
            gender = it.get("gender", "Unisex")
            colour = it.get("colour", "Unknown")

            by_brand[brand]["units"] += qty
            by_brand[brand]["revenue"] += rev
            by_gender[gender] += qty
            by_colour[colour] += qty

        if month_key:
            by_month[month_key] += float(order.get("total_amount", 0.0))

    # Sort monthly keys (last 12 months)
    sorted_months = sorted(by_month.keys())[-12:]
    monthly_sales = [
        {"month": m, "revenue": round(by_month[m], 2)}
        for m in sorted_months
    ]

    return {
        "success": True,
        "by_brand": [
            {"name": k, "units": v["units"], "revenue": round(v["revenue"], 2)}
            for k, v in sorted(by_brand.items(), key=lambda x: -x[1]["units"])
        ],
        "by_gender": [
            {"name": k, "value": v}
            for k, v in sorted(by_gender.items(), key=lambda x: -x[1])
        ],
        "by_colour": [
            {"name": k, "value": v}
            for k, v in sorted(by_colour.items(), key=lambda x: -x[1])
        ],
        "monthly_sales": monthly_sales,
    }


@router.get("/sales-log/")
async def get_sales_log(
    admin: dict = Depends(get_current_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Returns a flat, detailed log of every individual item sold — one row per
    product per order. Used to populate the Sales Log table in the dashboard.
    """
    logs = []
    cursor = db.orders.find({}).sort("created_at", -1)
    async for order in cursor:
        created_at = order.get("created_at", "")
        try:
            date_str = created_at.strftime("%d %b %Y, %I:%M %p")
        except AttributeError:
            date_str = str(created_at)[:16]

        for it in order.get("items", []):
            logs.append({
                "order_number": order.get("order_number", ""),
                "date": date_str,
                "buyer": order.get("username", "Guest"),
                "product": it.get("name", ""),
                "brand": it.get("brand", ""),
                "colour": it.get("colour", ""),
                "gender": it.get("gender", ""),
                "size": it.get("size", ""),
                "qty": it.get("quantity", 1),
                "price": float(it.get("price", 0)),
                "total": float(it.get("total_price", 0)),
                "order_status": order.get("order_status", ""),
                "payment_method": order.get("payment_method", ""),
            })
    return {"success": True, "logs": logs}
