from fastapi import APIRouter, Depends, HTTPException, Query
from app.models.url import URL
from app.models.requests import (
    ShortenUrlRequest,
    CustomUrlRequest,
    UrlResponse,
    QrCodeRequest,
    QrCodeResponse,
    UserUrlsResponse,
)
from app.services.url_service import URLService
from app.db import get_session
from app.utils.auth_middleware import get_optional_user, get_required_user
from app.utils.api_response import ApiResponse, ok
from sqlmodel import Session
from fastapi.responses import RedirectResponse
from datetime import datetime
from typing import Optional, Dict, Any, List

router = APIRouter()


@router.post("/api/shorten", response_model=ApiResponse[UrlResponse])
async def shorten_url(
    request: ShortenUrlRequest, 
    session: Session = Depends(get_session),
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """
    Create a shortened URL with custom expiration and click limits
    
    - **long_url**: The URL to shorten (protocol will be added if missing)
    - **expires_in_days**: Days until expiration (1-30, default: 7)
    - **max_clicks**: Maximum clicks allowed (1-1000, default: 10)
    
    Authentication is optional:
    - **Guest users**: Can create URLs without authentication
    - **Authenticated users**: URLs will be tied to their account
    """
    url_service = URLService(session)
    user_id = current_user["user_id"] if current_user else None
    return ok(url_service.shorten_url(request, user_id))


@router.post("/api/custom", response_model=ApiResponse[UrlResponse])
async def create_custom_url(
    request: CustomUrlRequest, 
    session: Session = Depends(get_session),
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """
    Create a custom short URL with user-specified code and limits
    
    - **long_url**: The URL to shorten (protocol will be added if missing)
    - **custom_code**: Custom short code (3-50 chars, alphanumeric + hyphens/underscores)
    - **expires_in_days**: Days until expiration (1-30, default: 7)
    - **max_clicks**: Maximum clicks allowed (1-1000, default: 10)
    
    Authentication is optional:
    - **Guest users**: Can create URLs without authentication
    - **Authenticated users**: URLs will be tied to their account
    """
    url_service = URLService(session)
    user_id = current_user["user_id"] if current_user else None
    return ok(url_service.create_custom_url(request, user_id))


@router.get("/api/urls", response_model=ApiResponse[UserUrlsResponse])
async def list_user_urls(
    session: Session = Depends(get_session),
    current_user: Dict[str, Any] = Depends(get_required_user),
    page: int = Query(1, ge=1, description="Page number (1-based)"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page (max 100)"),
    search: Optional[str] = Query(None, description="Search in long_url or short_code"),
    sort_by: str = Query("created_at", description="Sort field: created_at, clicks, expires_at"),
    sort_order: str = Query("desc", description="Sort order: asc or desc")
):
    """
    List all shortened URLs for the authenticated user
    
    - **page**: Page number (1-based)
    - **page_size**: Items per page (1-100)
    - **search**: Optional search term for long_url or short_code
    - **sort_by**: Field to sort by (created_at, clicks, expires_at)
    - **sort_order**: Sort direction (asc or desc)
    
    Authentication is required - users can only see their own URLs
    """
    url_service = URLService(session)
    return ok(url_service.list_user_urls(
        user_id=current_user["user_id"],
        page=page,
        page_size=page_size,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order
    ))


@router.get("/api/urls/count", response_model=ApiResponse[int])
async def get_user_urls_count(
    session: Session = Depends(get_session),
    current_user: Dict[str, Any] = Depends(get_required_user),
    search: Optional[str] = Query(None, description="Search in long_url or short_code")
):
    """
    Get the total count of URLs for the authenticated user
    
    - **search**: Optional search term for long_url or short_code
    
    Authentication is required - users can only see their own URL counts
    """
    url_service = URLService(session)
    return ok(url_service.get_user_urls_count(
        user_id=current_user["user_id"],
        search=search
    ))


@router.post("/api/qr-code", response_model=ApiResponse[QrCodeResponse])
def generate_qr_code_for_url(request: QrCodeRequest, session: Session = Depends(get_session)):
    """
    Generate a QR code for an existing short URL
    
    - **short_code**: The short code to generate QR code for
    - **size**: QR code size in pixels (100-500, default: 200)
    """
    url_service = URLService(session)
    return ok(url_service.generate_qr_code_for_url(request))


@router.get("/{short_code}")
def redirect_to_long_url(short_code: str, session: Session = Depends(get_session)):
    """
    Redirect to the long URL when accessing a short code
    """
    url_service = URLService(session)
    
    # Get URL entry
    url_entry = url_service.get_url_by_short_code(short_code)
    if not url_entry:
        raise HTTPException(status_code=404, detail="Short URL not found")
    
    # Check if URL has expired by date
    if url_entry.expires_at and url_entry.expires_at < datetime.utcnow():
        # Delete expired URL from database
        url_service.delete_expired_url(url_entry)
        raise HTTPException(status_code=410, detail="Short URL has expired and been removed")
    
    # Check if URL has reached max clicks (after incrementing)
    if url_entry.max_clicks and url_entry.clicks >= url_entry.max_clicks:
        # Delete URL that reached max clicks
        url_service.delete_expired_url(url_entry)
        raise HTTPException(status_code=410, detail="Short URL has reached maximum clicks and been removed")
    
    # Increment clicks and check if this click reaches the limit
    should_expire, long_url = url_service.increment_clicks_and_check_expiry(url_entry)
    
    return RedirectResponse(
        long_url,
        status_code=302,
        headers={"Cache-Control": "no-store"},
    )


@router.post("/api/cleanup", response_model=ApiResponse[dict])
def manual_cleanup(session: Session = Depends(get_session)):
    """
    Manually trigger cleanup of expired URLs
    Returns the number of URLs that were deleted
    """
    url_service = URLService(session)
    return ok(url_service.manual_cleanup())

