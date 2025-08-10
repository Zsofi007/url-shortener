from sqlmodel import Session, select
from fastapi import HTTPException
from datetime import datetime, timedelta
from typing import Optional

from app.models.url import URL
from app.models.requests import ShortenUrlRequest, CustomUrlRequest, QrCodeRequest
from app.models.requests import UrlResponse, QrCodeResponse
from app.utils.utils import encode_base62, generate_qr_code
from app.tasks.cleanup import cleanup_expired_urls
from app.config import settings


class URLService:
    def __init__(self, session: Session):
        self.session = session

    def _generate_short_url(self, short_code: str) -> str:
        """Generate the full short URL using the configured base URL"""
        return f"{settings.BASE_URL}/{short_code}"

    def shorten_url(self, request: ShortenUrlRequest, user_id: Optional[str] = None) -> UrlResponse:
        """
        Create a shortened URL with custom expiration and click limits
        
        Args:
            request: URL shortening request data
            user_id: Optional user ID if created by authenticated user
        """
        try:
            # Calculate expiration date
            expires_at = datetime.utcnow() + timedelta(days=request.expires_in_days)
            
            # Create URL entry
            new_url_entry = URL(
                long_url=request.long_url,
                expires_at=expires_at,
                max_clicks=request.max_clicks,
                user_id=user_id
            )
            self.session.add(new_url_entry)
            self.session.commit()
            self.session.refresh(new_url_entry)

            # Generate short code based on ID
            new_url_entry.short_code = encode_base62(new_url_entry.id)
            self.session.add(new_url_entry)
            self.session.commit()
            self.session.refresh(new_url_entry)

            # Generate QR code for the short URL
            short_url = self._generate_short_url(new_url_entry.short_code)
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
            self.session.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating shortened URL: {str(e)}")

    def create_custom_url(self, request: CustomUrlRequest, user_id: Optional[str] = None) -> UrlResponse:
        """
        Create a custom short URL with user-specified code and limits
        
        Args:
            request: Custom URL request data
            user_id: Optional user ID if created by authenticated user
        """
        try:
            # Check if custom code already exists
            existing_url = self.session.exec(select(URL).where(URL.short_code == request.custom_code)).first()
            if existing_url:
                raise HTTPException(status_code=409, detail="Custom code already exists. Please choose a different one.")
            
            # Calculate expiration date
            expires_at = datetime.utcnow() + timedelta(days=request.expires_in_days)
            
            # Create URL entry with custom code and limits
            new_url_entry = URL(
                long_url=request.long_url,
                short_code=request.custom_code,
                expires_at=expires_at,
                max_clicks=request.max_clicks,
                user_id=user_id
            )
            self.session.add(new_url_entry)
            self.session.commit()
            self.session.refresh(new_url_entry)
            
            # Generate QR code for the short URL
            short_url = self._generate_short_url(new_url_entry.short_code)
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
            self.session.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating custom URL: {str(e)}")

    def generate_qr_code_for_url(self, request: QrCodeRequest) -> QrCodeResponse:
        """
        Generate a QR code for an existing short URL
        """
        try:
            # Check if URL exists
            url_entry = self.session.exec(select(URL).where(URL.short_code == request.short_code)).first()
            if not url_entry:
                raise HTTPException(status_code=404, detail="Short URL not found")
            
            # Check if URL has expired
            if url_entry.expires_at and url_entry.expires_at < datetime.utcnow():
                raise HTTPException(status_code=410, detail="Short URL has expired")
            
            # Check if URL has reached max clicks
            if url_entry.max_clicks and url_entry.clicks >= url_entry.max_clicks:
                raise HTTPException(status_code=410, detail="Short URL has reached maximum clicks")
            
            # Generate short URL
            short_url = self._generate_short_url(url_entry.short_code)
            
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

    def get_url_by_short_code(self, short_code: str) -> Optional[URL]:
        """
        Get URL entry by short code
        """
        return self.session.exec(select(URL).where(URL.short_code == short_code)).first()

    def increment_clicks_and_check_expiry(self, url_entry: URL) -> tuple[bool, str]:
        """
        Increment clicks and check if URL should expire
        Returns (should_expire, long_url)
        """
        # Increment clicks
        url_entry.clicks += 1
        
        # Check if this click reaches the max
        will_expire_after_redirect = url_entry.max_clicks and url_entry.clicks >= url_entry.max_clicks
        
        if will_expire_after_redirect:
            # Get the long_url before deleting
            long_url = url_entry.long_url
            self.session.delete(url_entry)
            self.session.commit()
            return True, long_url
        else:
            # Normal case - just update click count
            self.session.add(url_entry)
            self.session.commit()
            return False, url_entry.long_url

    def delete_expired_url(self, url_entry: URL):
        """
        Delete an expired URL from the database
        """
        self.session.delete(url_entry)
        self.session.commit()

    def manual_cleanup(self) -> dict:
        """
        Manually trigger cleanup of expired URLs
        """
        try:
            deleted_count = cleanup_expired_urls()
            return {
                "message": f"Cleanup completed successfully",
                "deleted_count": deleted_count
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Cleanup failed: {str(e)}")
