from fastapi import APIRouter, Depends, Response, status

from app.core.deps import get_current_user, get_current_user_optional
from app.schemas.auth import AuthStatusResponse, AuthSuccessResponse, UserLogin, UserSignup
from app.services import AuthService, get_auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/status/", response_model=AuthStatusResponse)
async def check_auth_status(
    current_user: dict | None = Depends(get_current_user_optional),
    service: AuthService = Depends(get_auth_service),
):
    return service.get_auth_status(current_user)


@router.post("/signup/", response_model=AuthSuccessResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    user_in: UserSignup, response: Response, service: AuthService = Depends(get_auth_service)
):
    return await service.register(user_in.model_dump(), response)


@router.post("/login/", response_model=AuthSuccessResponse)
async def login(
    credentials: UserLogin, response: Response, service: AuthService = Depends(get_auth_service)
):
    return await service.login(credentials.username, credentials.password, response)


@router.post("/logout/")
async def logout(response: Response, service: AuthService = Depends(get_auth_service)):
    return await service.logout(response)


@router.delete("/delete-account/")
async def delete_account(
    response: Response,
    current_user: dict = Depends(get_current_user),
    service: AuthService = Depends(get_auth_service),
):
    return await service.delete_account(current_user, response)
