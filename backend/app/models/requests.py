"""
Request models for URL shortener API
"""
from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime, timedelta


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
        """Ensure URL has proper protocol"""
        if not v.startswith(('http://', 'https://')):
            return f'https://{v}'
        return v


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
        """Ensure URL has proper protocol"""
        if not v.startswith(('http://', 'https://')):
            return f'https://{v}'
        return v
    
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


class QrCodeResponse(BaseModel):
    """Response model for QR code generation"""
    short_code: str = Field(..., description="The short code")
    qr_code_data: str = Field(..., description="Base64 encoded QR code image data")
    short_url: str = Field(..., description="The complete short URL")