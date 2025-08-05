from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class URL(SQLModel, table=True):
    id: int = Field(default=69420, primary_key=True, sa_column_kwargs={"autoincrement": True})
    short_code: str = Field(index=True)
    long_url:str = Field(max_length=2048)
    created_at:datetime = Field(default_factory=datetime.utcnow)