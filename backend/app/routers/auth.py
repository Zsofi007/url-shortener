"""
Authentication router for URL shortener application
Handles user registration, login, logout, and profile management
"""
from app.config import settings
from fastapi import APIRouter, Depends, HTTPException, Header, Request, Query
from typing import Optional
from fastapi.responses import RedirectResponse

from app.services.auth_service import AuthService
from app.models.requests import (
    UserRegistrationRequest,
    UserLoginRequest,
    AuthResponse,
    UserProfileResponse
)

# Create router instance
router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Initialize auth service
auth_service = AuthService()


@router.post("/register", response_model=AuthResponse, status_code=201)
async def register_user(request: UserRegistrationRequest):
    """
    Register a new user account

    - **email**: User's email address (must be unique)
    - **password**: Password (minimum 8 characters)

    Returns user info and access token if email already confirmed,
    otherwise returns user info with empty token until email confirmation.
    """
    return await auth_service.register_user(request)


@router.post("/login", response_model=AuthResponse)
async def login_user(request: UserLoginRequest):
    """
    Authenticate user and create session

    - **email**: User's email address
    - **password**: User's password

    Returns user info and access token for authenticated session.
    Email must be confirmed before login is allowed.
    """
    return await auth_service.login_user(request)


@router.get("/profile", response_model=UserProfileResponse)
async def get_user_profile(authorization: Optional[str] = Header(None)):
    """
    Get current user's profile information

    Requires valid JWT token in Authorization header.
    Format: "Bearer <token>"

    Returns user profile data including email confirmation status.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Authorization header required. Format: Bearer <token>"
        )

    token = authorization.replace("Bearer ", "")
    return await auth_service.get_user_profile(token)


@router.post("/logout")
async def logout_user(authorization: Optional[str] = Header(None)):
    """
    Logout user and invalidate session

    Requires valid JWT token in Authorization header.
    Format: "Bearer <token>"

    Returns success message after logout.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Authorization header required. Format: Bearer <token>"
        )

    token = authorization.replace("Bearer ", "")
    return await auth_service.logout_user(token)


@router.get("/verify")
async def verify_token(authorization: Optional[str] = Header(None)):
    """
    Verify if JWT token is valid

    Requires JWT token in Authorization header.
    Format: "Bearer <token>"

    Returns user data if token is valid, 401 if invalid/expired.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Authorization header required. Format: Bearer <token>"
        )

    token = authorization.replace("Bearer ", "")
    user_data = await auth_service.verify_session(token)

    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return {
        "valid": True,
        "user": user_data
    }


@router.get("/confirm")
async def confirm_email(request: Request):
    """
    Handle email confirmation redirect from Supabase
    
    This endpoint receives the confirmation redirect and extracts the access token.
    You can use this token to automatically log in the user or redirect them appropriately.
    """
    # Get query parameters from the request
    query_params = request.query_params
    
    # Extract the access token and other parameters
    access_token = query_params.get("access_token")
    expires_at = query_params.get("expires_at")
    expires_in = query_params.get("expires_in")
    refresh_token = query_params.get("refresh_token")
    token_type = query_params.get("token_type")
    type_param = query_params.get("type")
    
    if not access_token:
        raise HTTPException(status_code=400, detail="No access token provided")
    
    # Verify the token to get user information
    try:
        user_data = await auth_service.verify_session(access_token)
        if user_data:
            return {
                "message": "Email confirmed successfully!",
                "user": user_data,
                "access_token": access_token,
                "token_type": token_type,
                "expires_in": int(expires_in) if expires_in else None,
                "note": "You can now use this access_token to authenticate API requests"
            }
        else:
            raise HTTPException(status_code=400, detail="Invalid confirmation token")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error confirming email: {str(e)}")
