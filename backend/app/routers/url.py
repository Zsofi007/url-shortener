from fastapi import APIRouter, Depends, HTTPException
from app.models.url import URL
from app.utils.utils import encode_base62
from app.db import get_session
from sqlmodel import Session, select
from fastapi.responses import RedirectResponse
import re

router = APIRouter()


@router.post("/api/shorten")
def shorten_url(long_url: str, session: Session = Depends(get_session)):
    if not long_url:
        raise HTTPException(status_code=400, detail="Long URL is required")

    new_url_entry = URL(long_url=long_url)
    session.add(new_url_entry)
    session.commit()
    session.refresh(new_url_entry)

    new_url_entry.short_code = encode_base62(new_url_entry.id)

    session.add(new_url_entry)
    session.commit()
    session.add(new_url_entry)
    session.commit()
    

    return {"short_code": new_url_entry.short_code}


@router.post("/api/custom")
def create_custom_url(long_url: str, custom_code: str, session: Session = Depends(get_session)):
    """Create a custom short URL with user-specified code"""
    
    # Validate inputs
    if not long_url:
        raise HTTPException(status_code=400, detail="Long URL is required")
    
    if not custom_code:
        raise HTTPException(status_code=400, detail="Custom code is required")
    
    # Validate custom code format (alphanumeric, hyphens, underscores, 3-50 chars)
    if not re.match(r'^[a-zA-Z0-9_-]{3,50}$', custom_code):
        raise HTTPException(
            status_code=400, 
            detail="Custom code must be 3-50 characters long and contain only letters, numbers, hyphens, and underscores"
        )
    
    # Check if custom code already exists
    existing_url = session.exec(select(URL).where(URL.short_code == custom_code)).first()
    if existing_url:
        raise HTTPException(status_code=409, detail="Custom code already exists. Please choose a different one.")
    
    # Add protocol if missing
    if not long_url.startswith(('http://', 'https://')):
        long_url = 'https://' + long_url
    
    try:
        # Create URL entry with custom code
        new_url_entry = URL(long_url=long_url, short_code=custom_code)
        session.add(new_url_entry)
        session.commit()
        session.refresh(new_url_entry)
        
        return {
            "short_code": custom_code,
            "long_url": long_url,
            "short_url": f"http://localhost:8000/{custom_code}",
            "message": "Custom URL created successfully"
        }
        
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating custom URL: {str(e)}")



@router.get("/{short_code}")
def redirect_to_long_url(short_code: str):
    session = get_session()
    url_entry = session.exec(select(URL).where(URL.short_code == short_code)).first()
    if not url_entry:
        raise HTTPException(status_code=404, detail="Short URL not found")
    return RedirectResponse(url_entry.long_url)
