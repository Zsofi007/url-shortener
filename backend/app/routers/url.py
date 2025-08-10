from fastapi import APIRouter, Depends, HTTPException
from app.models.url import URL
from app.models.requests import ShortenUrlRequest, CustomUrlRequest, UrlResponse, QrCodeRequest, QrCodeResponse
from app.utils.utils import encode_base62, generate_qr_code
from app.db import get_session
from app.tasks.cleanup import cleanup_expired_urls
from sqlmodel import Session, select
from fastapi.responses import RedirectResponse
import re
from datetime import datetime, timedelta

router = APIRouter()


@router.post("/api/shorten", response_model=UrlResponse)
def shorten_url(request: ShortenUrlRequest, session: Session = Depends(get_session)):
    """
    Create a shortened URL with custom expiration and click limits
    
    - **long_url**: The URL to shorten (protocol will be added if missing)
    - **expires_in_days**: Days until expiration (1-30, default: 7)
    - **max_clicks**: Maximum clicks allowed (1-1000, default: 10)
    """
    try:
        # Calculate expiration date
        expires_at = datetime.utcnow() + timedelta(days=request.expires_in_days)
        
        # Create URL entry
        new_url_entry = URL(
            long_url=request.long_url,
            expires_at=expires_at,
            max_clicks=request.max_clicks
        )
        session.add(new_url_entry)
        session.commit()
        session.refresh(new_url_entry)

        # Generate short code based on ID
        new_url_entry.short_code = encode_base62(new_url_entry.id)
        session.add(new_url_entry)
        session.commit()
        session.refresh(new_url_entry)

        # Generate QR code for the short URL
        short_url = f"http://localhost:8000/{new_url_entry.short_code}"
        qr_code_data = generate_qr_code(short_url)

        return UrlResponse(
            short_code=new_url_entry.short_code,
            long_url=new_url_entry.long_url,
            expires_at=new_url_entry.expires_at,
            max_clicks=new_url_entry.max_clicks,
            clicks=new_url_entry.clicks,
            created_at=new_url_entry.created_at,
            qr_code_data=qr_code_data
        )
        
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating shortened URL: {str(e)}")


@router.post("/api/custom", response_model=UrlResponse)
def create_custom_url(request: CustomUrlRequest, session: Session = Depends(get_session)):
    """
    Create a custom short URL with user-specified code and limits
    
    - **long_url**: The URL to shorten (protocol will be added if missing)
    - **custom_code**: Custom short code (3-50 chars, alphanumeric + hyphens/underscores)
    - **expires_in_days**: Days until expiration (1-30, default: 7)
    - **max_clicks**: Maximum clicks allowed (1-1000, default: 10)
    """
    try:
        # Check if custom code already exists
        existing_url = session.exec(select(URL).where(URL.short_code == request.custom_code)).first()
        if existing_url:
            raise HTTPException(status_code=409, detail="Custom code already exists. Please choose a different one.")
        
        # Calculate expiration date
        expires_at = datetime.utcnow() + timedelta(days=request.expires_in_days)
        
        # Create URL entry with custom code and limits
        new_url_entry = URL(
            long_url=request.long_url,
            short_code=request.custom_code,
            expires_at=expires_at,
            max_clicks=request.max_clicks
        )
        session.add(new_url_entry)
        session.commit()
        session.refresh(new_url_entry)
        
        # Generate QR code for the short URL
        short_url = f"http://localhost:8000/{new_url_entry.short_code}"
        qr_code_data = generate_qr_code(short_url)
        
        return UrlResponse(
            short_code=new_url_entry.short_code,
            long_url=new_url_entry.long_url,
            expires_at=new_url_entry.expires_at,
            max_clicks=new_url_entry.max_clicks,
            clicks=new_url_entry.clicks,
            created_at=new_url_entry.created_at,
            qr_code_data=qr_code_data
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions (like 409 conflict)
        raise
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating custom URL: {str(e)}")


@router.post("/api/qr-code", response_model=QrCodeResponse)
def generate_qr_code_for_url(request: QrCodeRequest, session: Session = Depends(get_session)):
    """
    Generate a QR code for an existing short URL
    
    - **short_code**: The short code to generate QR code for
    - **size**: QR code size in pixels (100-500, default: 200)
    """
    try:
        # Check if URL exists
        url_entry = session.exec(select(URL).where(URL.short_code == request.short_code)).first()
        if not url_entry:
            raise HTTPException(status_code=404, detail="Short URL not found")
        
        # Check if URL has expired
        if url_entry.expires_at and url_entry.expires_at < datetime.utcnow():
            raise HTTPException(status_code=410, detail="Short URL has expired")
        
        # Check if URL has reached max clicks
        if url_entry.max_clicks and url_entry.clicks >= url_entry.max_clicks:
            raise HTTPException(status_code=410, detail="Short URL has reached maximum clicks")
        
        # Generate short URL
        short_url = f"http://localhost:8000/{url_entry.short_code}"
        
        # Generate QR code
        qr_code_data = generate_qr_code(short_url, request.size)
        
        return QrCodeResponse(
            short_code=url_entry.short_code,
            qr_code_data=qr_code_data,
            short_url=short_url
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating QR code: {str(e)}")



@router.get("/{short_code}")
def redirect_to_long_url(short_code: str):
    session = get_session()
    url_entry = session.exec(select(URL).where(URL.short_code == short_code)).first()
    if not url_entry:
        raise HTTPException(status_code=404, detail="Short URL not found")
    
    # Check if URL has expired by date
    if url_entry.expires_at and url_entry.expires_at < datetime.utcnow():
        # Delete expired URL from database
        session.delete(url_entry)
        session.commit()
        raise HTTPException(status_code=410, detail="Short URL has expired and been removed")
    
    # Check if URL has reached max clicks (after incrementing)
    if url_entry.max_clicks and url_entry.clicks >= url_entry.max_clicks:
        # Delete URL that reached max clicks
        session.delete(url_entry)
        session.commit()
        raise HTTPException(status_code=410, detail="Short URL has reached maximum clicks and been removed")
    
    # Increment clicks and check if this click reaches the limit
    url_entry.clicks += 1
    
    # If this click reaches the max, delete after the redirect
    will_expire_after_redirect = url_entry.max_clicks and url_entry.clicks >= url_entry.max_clicks
    
    if will_expire_after_redirect:
        # Get the long_url before deleting
        long_url = url_entry.long_url
        session.delete(url_entry)
        session.commit()
        return RedirectResponse(long_url)
    else:
        # Normal case - just update click count
        session.add(url_entry)
        session.commit()
        return RedirectResponse(url_entry.long_url)


@router.post("/api/cleanup")
def manual_cleanup():
    """
    Manually trigger cleanup of expired URLs
    Returns the number of URLs that were deleted
    """
    try:
        deleted_count = cleanup_expired_urls()
        return {
            "message": f"Cleanup completed successfully",
            "deleted_count": deleted_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cleanup failed: {str(e)}")
