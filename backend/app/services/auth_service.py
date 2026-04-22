"""
Authentication service for URL shortener application
Handles user registration, login, and session management via Supabase
"""
from supabase import create_client, Client
from fastapi import HTTPException
from typing import Optional, Dict, Any
from datetime import datetime
import logging

from app.config import settings
from app.models.requests import (
    UserRegistrationRequest, 
    UserLoginRequest, 
    AuthResponse, 
    UserProfileResponse
)


class AuthService:
    """Service for handling authentication operations"""
    
    def __init__(self):
        """Initialize Supabase client"""
        if not all([settings.SUPABASE_URL, settings.SUPABASE_PUBLISHABLE_KEY]):
            raise ValueError("Supabase configuration is incomplete. Check your environment variables.")
        
        self.supabase: Client = create_client(
            settings.SUPABASE_URL, 
            settings.SUPABASE_PUBLISHABLE_KEY
        )
    
    async def register_user(self, request: UserRegistrationRequest) -> AuthResponse:
        """
        Register a new user with email confirmation
        
        Args:
            request: User registration data
            
        Returns:
            AuthResponse with user info and access token
            
        Raises:
            HTTPException: If registration fails
        """
        try:
            # Attempt to sign up user
            logger = logging.getLogger(__name__)
            logger.info("Registering user")
            
            response = self.supabase.auth.sign_up({
                "email": request.email,
                "password": request.password,
                'options': {
                    'email_redirect_to': f'{settings.BASE_URL_FRONTEND}/auth/confirm'
                }
            })
            
            user = response.user
            if not user:
                raise HTTPException(status_code=400, detail="Registration failed")
            
            # Check if email confirmation is required
            if not user.email_confirmed_at:
                return AuthResponse(
                    user_id=user.id,
                    email=user.email,
                    access_token="",  # No token until email confirmed
                    token_type="bearer",
                    expires_in=0
                )
            
            # If email already confirmed, return session
            session = response.session
            if session:
                return AuthResponse(
                    user_id=user.id,
                    email=user.email,
                    access_token=session.access_token,
                    token_type="bearer",
                    expires_in=session.expires_in
                )
            
            # Fallback response
            return AuthResponse(
                user_id=user.id,
                email=user.email,
                access_token="",
                token_type="bearer",
                expires_in=0
            )
            
        except Exception as e:
            # Handle Supabase-specific errors
            error_msg = str(e)
            if "already registered" in error_msg.lower():
                raise HTTPException(status_code=409, detail="User already exists with this email")
            elif "password" in error_msg.lower():
                raise HTTPException(status_code=400, detail="Password does not meet requirements")
            else:
                raise HTTPException(status_code=500, detail=f"Registration failed: {error_msg}")
    
    async def login_user(self, request: UserLoginRequest) -> AuthResponse:
        """
        Authenticate user and return session
        
        Args:
            request: User login credentials
            
        Returns:
            AuthResponse with user info and access token
            
        Raises:
            HTTPException: If login fails
        """
        try:
            # Attempt to sign in user
            response = self.supabase.auth.sign_in_with_password({
                "email": request.email,
                "password": request.password
            })
            
            user = response.user
            session = response.session
            
            if not user or not session:
                raise HTTPException(status_code=401, detail="Invalid credentials")
            
            # Check if email is confirmed
            if not user.email_confirmed_at:
                raise HTTPException(
                    status_code=401, 
                    detail="Please confirm your email before logging in"
                )
            
            return AuthResponse(
                user_id=user.id,
                email=user.email,
                access_token=session.access_token,
                token_type="bearer",
                expires_in=session.expires_in
            )
            
        except HTTPException:
            # Re-raise HTTP exceptions
            raise
        except Exception as e:
            error_msg = str(e)
            if "invalid" in error_msg.lower():
                raise HTTPException(status_code=401, detail="Invalid credentials")
            else:
                raise HTTPException(status_code=500, detail=f"Login failed: {error_msg}")
    
    async def verify_session(self, access_token: str) -> Optional[Dict[str, Any]]:
        """
        Verify JWT token and return user information
        
        Args:
            access_token: JWT access token
            
        Returns:
            User data if token is valid, None otherwise
        """
        try:
            # Set the auth token for this request
            self.supabase.auth.set_session(access_token, access_token)
            
            # Get current user
            user = self.supabase.auth.get_user(access_token)
            
            if user and user.user:
                return {
                    "user_id": user.user.id,
                    "email": user.user.email,
                    "email_confirmed": bool(user.user.email_confirmed_at)
                }
            
            return None
            
        except Exception:
            # Token is invalid or expired
            return None
    
    async def get_user_profile(self, access_token: str) -> UserProfileResponse:
        """
        Get user profile information
        
        Args:
            access_token: JWT access token
            
        Returns:
            UserProfileResponse with profile data
            
        Raises:
            HTTPException: If token is invalid or user not found
        """
        user_data = await self.verify_session(access_token)
        
        if not user_data:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        
        return UserProfileResponse(
            user_id=user_data["user_id"],
            email=user_data["email"],
            created_at=datetime.utcnow(),  # Supabase doesn't expose this easily
            email_confirmed=user_data["email_confirmed"]
        )
    
    async def logout_user(self, access_token: str) -> Dict[str, str]:
        """
        Logout user and invalidate session
        
        Args:
            access_token: JWT access token
            
        Returns:
            Success message
        """
        try:
            # Set the auth token for this request
            self.supabase.auth.set_session(access_token, access_token)
            
            # Sign out user
            self.supabase.auth.sign_out()
            
            return {"message": "Successfully logged out"}
            
        except Exception:
            # Even if logout fails, return success (token might be expired anyway)
            return {"message": "Successfully logged out"}
