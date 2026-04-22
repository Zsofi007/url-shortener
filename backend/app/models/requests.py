"""
Request models for URL shortener API
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime, timedelta

from app.utils.url_validation import normalize_and_validate_http_url


class ShortenUrlRequest(BaseModel):
    """Request model for shortening URLs"""
    long_url: str = Field(..., min_length=1, max_length=2048, description="The URL to shorten")
    expires_in_days: Optional[int] = Field(
        default=7, 
        ge=1, 
        le=30, 
        description="Number of days until URL expires (1-30 days, default: 7)"
    )
    max_clicks: Optional[int] = Field(
        default=10, 
        ge=1, 
        le=1000, 
        description="Maximum number of clicks allowed (1-1000, default: 10)"
    )
    
    @validator('long_url')
    def validate_long_url(cls, v):
        return normalize_and_validate_http_url(v)


class CustomUrlRequest(BaseModel):
    """Request model for creating custom short URLs"""
    long_url: str = Field(..., min_length=1, max_length=2048, description="The URL to shorten")
    custom_code: str = Field(
        ..., 
        min_length=3, 
        max_length=50, 
        description="Custom short code (3-50 characters, alphanumeric, hyphens, underscores only)"
    )
    expires_in_days: Optional[int] = Field(
        default=7, 
        ge=1, 
        le=30, 
        description="Number of days until URL expires (1-30 days, default: 7)"
    )
    max_clicks: Optional[int] = Field(
        default=10, 
        ge=1, 
        le=1000, 
        description="Maximum number of clicks allowed (1-1000, default: 10)"
    )
    
    @validator('long_url')
    def validate_long_url(cls, v):
        return normalize_and_validate_http_url(v)
    
    @validator('custom_code')
    def validate_custom_code(cls, v):
        """Validate custom code format"""
        import re
        if not re.match(r'^[a-zA-Z0-9_-]{3,50}$', v):
            raise ValueError('Custom code must be 3-50 characters long and contain only letters, numbers, hyphens, and underscores')
        return v


class QrCodeRequest(BaseModel):
    """Request model for QR code generation"""
    short_code: str = Field(..., description="The short code to generate QR code for")
    size: Optional[int] = Field(default=200, ge=100, le=500, description="QR code size in pixels (100-500, default: 200)")


class UrlResponse(BaseModel):
    """Response model for URL creation"""
    short_code: str = Field(..., description="The generated short code")
    long_url: str = Field(..., description="The original long URL")
    expires_at: datetime = Field(..., description="When the URL expires")
    max_clicks: int = Field(..., description="Maximum allowed clicks")
    clicks: int = Field(default=0, description="Current click count")
    created_at: datetime = Field(..., description="When the URL was created")
    qr_code_data: Optional[str] = Field(default=None, description="Base64 encoded QR code image data")
    short_url: str = Field(..., description="The complete short URL")


class QrCodeResponse(BaseModel):
    """Response model for QR code generation"""
    short_code: str = Field(..., description="The short code")
    qr_code_data: str = Field(..., description="Base64 encoded QR code image data")
    short_url: str = Field(..., description="The complete short URL")


class UserUrlsResponse(BaseModel):
    urls: List[UrlResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


# Authentication Models
class UserRegistrationRequest(BaseModel):
    """Request model for user registration"""
    email: str = Field(..., description="User's email address")
    password: str = Field(..., min_length=8, description="Password (minimum 8 characters)")
    
    @validator('email')
    def validate_email(cls, v):
        """Basic email validation"""
        import re
        if not re.match(r'^[^@]+@[^@]+\.[^@]+$', v):
            raise ValueError('Invalid email format')
        return v.lower()


class UserLoginRequest(BaseModel):
    """Request model for user login"""
    email: str = Field(..., description="User's email address")
    password: str = Field(..., description="User's password")
    
    @validator('email')
    def validate_email(cls, v):
        """Basic email validation"""
        import re
        if not re.match(r'^[^@]+@[^@]+\.[^@]+$', v):
            raise ValueError('Invalid email format')
        return v.lower()


class AuthResponse(BaseModel):
    """Response model for authentication operations"""
    user_id: str = Field(..., description="Unique user identifier")
    email: str = Field(..., description="User's email address")
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    expires_in: int = Field(..., description="Token expiry time in seconds")


class UserProfileResponse(BaseModel):
    """Response model for user profile information"""
    user_id: str = Field(..., description="Unique user identifier")
    email: str = Field(..., description="User's email address")
    created_at: datetime = Field(..., description="When the account was created")
    email_confirmed: bool = Field(..., description="Whether email has been confirmed")