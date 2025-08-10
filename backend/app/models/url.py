from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class URL(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    short_code: Optional[str] = Field(default=None, index=True)
    long_url:str = Field(max_length=2048)
    created_at:datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    max_clicks: Optional[int] = Field(default=10)
    clicks: int = Field(default=0)
    user_id: Optional[str] = Field(default=None, index=True, description="User ID if created by authenticated user")