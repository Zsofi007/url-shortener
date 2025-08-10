from sqlmodel import Session, select, func
from fastapi import HTTPException
from datetime import datetime, timedelta
from typing import Optional, List

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

    def get_user_urls_count(
        self, 
        user_id: str, 
        search: Optional[str] = None
    ) -> int:
        """
        Get the total count of URLs for a specific user
        
        Args:
            user_id: User ID to filter URLs by
            search: Optional search term for long_url or short_code
            
        Returns:
            Total count of URLs matching the criteria
        """
        try:
            # Build base query - only URLs belonging to this user
            query = select(func.count(URL.id)).where(URL.user_id == user_id)
            
            # Add search filter if provided
            if search:
                search_filter = (
                    (URL.long_url.ilike(f"%{search}%")) | 
                    (URL.short_code.ilike(f"%{search}%"))
                )
                query = query.where(search_filter)
            
            # Execute count query
            count = self.session.exec(query).first()
            return count or 0
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error counting user URLs: {str(e)}")

    def list_user_urls(
        self, 
        user_id: str, 
        page: int = 1, 
        page_size: int = 20,
        search: Optional[str] = None,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ) -> List[UrlResponse]:
        """
        List all shortened URLs for a specific user with pagination, search, and sorting
        
        Args:
            user_id: User ID to filter URLs by
            page: Page number (1-based)
            page_size: Items per page
            search: Optional search term for long_url or short_code
            sort_by: Field to sort by (created_at, clicks, expires_at)
            sort_order: Sort direction (asc or desc)
            
        Returns:
            List of UrlResponse objects
        """
        try:
            # Build base query - only URLs belonging to this user
            query = select(URL).where(URL.user_id == user_id)
            
            # Add search filter if provided
            if search:
                search_filter = (
                    (URL.long_url.ilike(f"%{search}%")) | 
                    (URL.short_code.ilike(f"%{search}%"))
                )
                query = query.where(search_filter)
            
            # Add sorting
            if sort_by == "clicks":
                sort_field = URL.clicks
            elif sort_by == "expires_at":
                sort_field = URL.expires_at
            else:  # default to created_at
                sort_field = URL.created_at
                
            if sort_order.lower() == "asc":
                query = query.order_by(sort_field.asc())
            else:
                query = query.order_by(sort_field.desc())
            
            # Add pagination
            offset = (page - 1) * page_size
            query = query.offset(offset).limit(page_size)
            
            # Execute query
            urls = self.session.exec(query).all()
            
            # Convert to response models
            result = []
            for url in urls:
                short_url = self._generate_short_url(url.short_code)
                qr_code_data = generate_qr_code(short_url)
                
                result.append(UrlResponse(
                    short_code=url.short_code,
                    long_url=url.long_url,
                    expires_at=url.expires_at,
                    max_clicks=url.max_clicks,
                    clicks=url.clicks,
                    created_at=url.created_at,
                    qr_code_data=qr_code_data,
                    short_url=short_url
                ))
            
            return result
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error listing user URLs: {str(e)}")

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
                qr_code_data=qr_code_data,
                short_url=short_url
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
