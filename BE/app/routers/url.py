from fastapi import APIRouter, Depends, HTTPException
from app.models.url import URL
from app.utils.utils import encode_base62
from app.db import get_session
from sqlmodel import Session, select
from fastapi.responses import RedirectResponse

router = APIRouter()


@router.post("/shorten")
def shorten_url(long_url: str, session: Session = Depends(get_session)):
    if not long_url:
        raise HTTPException(status_code=400, detail="Long URL is required")

    new_url_entry = URL(long_url=long_url)

    encoded_url = encode_base62(new_url_entry.id)

    new_url_entry.short_code = encoded_url

    session.add(new_url_entry)
    session.commit()
    

    return {"short_code": encoded_url}



@router.get("/{short_code}")
def redirect_to_long_url(short_code: str):
    session = get_session()
    url_entry = session.exec(select(URL).where(URL.short_code == short_code)).first()
    if not url_entry:
        raise HTTPException(status_code=404, detail="Short URL not found")
    return RedirectResponse(url_entry.long_url)
