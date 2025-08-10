"""
Authentication middleware for optional user authentication
Allows both guests and authenticated users to access URL creation endpoints
"""
from fastapi import Depends, HTTPException, Header
from typing import Optional, Dict, Any
from app.services.auth_service import AuthService

# Initialize auth service
auth_service = AuthService()


async def get_optional_user(
    authorization: Optional[str] = Header(None)
) -> Optional[Dict[str, Any]]:
    """
    Optional authentication dependency
    
    Returns user data if valid token is provided, None if no token or invalid token.
    This allows endpoints to work for both guests and authenticated users.
    
    Args:
        authorization: Optional Authorization header with Bearer token
        
    Returns:
        User data dict if authenticated, None if guest
    """
    if not authorization or not authorization.startswith("Bearer "):
        # No token provided - user is a guest
        return None
    
    try:
        # Extract token and verify
        token = authorization.replace("Bearer ", "")
        user_data = await auth_service.verify_session(token)
        
        if user_data:
            # Valid token - return user data
            return user_data
        else:
            # Invalid/expired token - treat as guest
            return None
            
    except Exception:
        # Any error during verification - treat as guest
        return None


async def get_required_user(
    authorization: Optional[str] = Header(None)
) -> Dict[str, Any]:
    """
    Required authentication dependency
    
    Requires valid JWT token. Raises 401 if no token or invalid token.
    Use this for endpoints that require authentication.
    
    Args:
        authorization: Authorization header with Bearer token
        
    Returns:
        User data dict
        
    Raises:
        HTTPException: 401 if no token or invalid token
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Authentication required. Please provide Bearer token in Authorization header."
        )
    
    token = authorization.replace("Bearer ", "")
    user_data = await auth_service.verify_session(token)
    
    if not user_data:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token. Please login again."
        )
    
    return user_data
