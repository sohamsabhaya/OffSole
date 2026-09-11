from typing import Any

from fastapi import status


class AppException(Exception):
    status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR
    error_code: str = "INTERNAL_SERVER_ERROR"
    message: str = "An unexpected error occurred."

    def __init__(
        self,
        message: str | None = None,
        error_code: str | None = None,
        status_code: int | None = None,
        details: dict[str, Any] | None = None,
    ):
        self.message = message or self.message
        self.error_code = error_code or self.error_code
        self.status_code = status_code or self.status_code
        self.details = details or {}
        super().__init__(self.message)


class NotFoundError(AppException):
    status_code = status.HTTP_404_NOT_FOUND
    error_code = "NOT_FOUND"
    message = "Resource not found."


class UnauthorizedError(AppException):
    status_code = status.HTTP_401_UNAUTHORIZED
    error_code = "UNAUTHORIZED"
    message = "Authentication credentials were not provided or are invalid."


class ForbiddenError(AppException):
    status_code = status.HTTP_403_FORBIDDEN
    error_code = "FORBIDDEN"
    message = "You do not have permission to perform this action."


class BadRequestError(AppException):
    status_code = status.HTTP_400_BAD_REQUEST
    error_code = "BAD_REQUEST"
    message = "Invalid request parameters."


class ConflictError(AppException):
    status_code = status.HTTP_409_CONFLICT
    error_code = "CONFLICT"
    message = "Resource conflict detected."


class StockUnavailableError(BadRequestError):
    error_code = "STOCK_UNAVAILABLE"
    message = "Requested quantity is unavailable in inventory."
