from fastapi import APIRouter, Depends, HTTPException, status, Response
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from app.database import get_database
from app.schemas.auth import (
    UserSignup,
    UserLogin,
    AuthStatusResponse,
    AuthSuccessResponse
)
from app.crud.user import (
    get_user_by_username,
    get_user_by_email,
    create_user,
    authenticate_user
)
from app.core.security import create_access_token
from app.core.deps import get_current_user, get_current_user_optional

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.get("/status/", response_model=AuthStatusResponse)
async def check_auth_status(
    current_user: dict | None = Depends(get_current_user_optional)
):
    """
    Checks if the visitor has a valid session cookie.
    Used by React Navbar on page load.
    """
    if current_user:
        is_admin = bool(current_user.get("is_admin") or current_user.get("is_staff") or current_user.get("username") == "admin")
        return AuthStatusResponse(
            is_authenticated=True,
            username=current_user.get("username"),
            email=current_user.get("email"),
            is_admin=is_admin,
            is_staff=is_admin
        )
    return AuthStatusResponse(is_authenticated=False)


@router.post("/signup/", response_model=AuthSuccessResponse)
async def signup(
    user_in: UserSignup,
    response: Response,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Registers a new user and sets the HTTP-only auth cookie.
    """
    # Check if username is taken
    existing_user = await get_user_by_username(db, user_in.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken. Please choose another."
        )

    # Check if email is registered
    existing_email = await get_user_by_email(db, user_in.email)
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    # Create user in MongoDB
    user = await create_user(db, user_in)

    # Generate JWT token
    token = create_access_token({"sub": user["username"]})

    # Set HTTP-only Cookie for React Axios
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=86400,  # 24 Hours
        samesite="lax"
    )

    return AuthSuccessResponse(
        success=True,
        message="Registration successful! Welcome to OffSole.",
        username=user["username"],
        is_admin=bool(user.get("is_admin", False))
    )


@router.post("/login/", response_model=AuthSuccessResponse)
async def login(
    credentials: UserLogin,
    response: Response,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Authenticates user and sets the HTTP-only auth cookie.
    """
    user = await authenticate_user(db, credentials.username, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username/email or password."
        )

    # Generate JWT token
    token = create_access_token({"sub": user["username"]})

    # Set HTTP-only Cookie for React Axios
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=86400,  # 24 Hours
        samesite="lax"
    )

    is_admin = bool(user.get("is_admin") or user.get("is_staff") or user.get("username") == "admin")

    return AuthSuccessResponse(
        success=True,
        message="Login successful!",
        username=user["username"],
        is_admin=is_admin
    )


@router.post("/logout/")
async def logout(response: Response):
    """
    Logs out the user by clearing the HTTP-only auth cookie.
    """
    response.delete_cookie(key="access_token")
    return {"success": True, "message": "Logged out successfully."}


@router.delete("/delete-account/")
async def delete_account(
    response: Response,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Deletes the logged-in user's account and associated cart, then clears session cookie.
    """
    user_id = str(current_user.get("_id") or current_user.get("id"))
    username = current_user.get("username")
    
    # 1. Delete user from MongoDB
    if ObjectId.is_valid(user_id):
        await db.users.delete_one({"_id": ObjectId(user_id)})
    else:
        await db.users.delete_one({"_id": user_id})
        
    # Also delete by username to be certain
    await db.users.delete_one({"username": username})
    
    # 2. Delete user's cart
    await db.carts.delete_many({"user_id": user_id})
    
    # 3. Clear auth cookie
    response.delete_cookie(key="access_token")
    
    return {
        "success": True,
        "message": f"Account '{username}' and associated data have been permanently deleted."
    }
