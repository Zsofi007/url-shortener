from sqlmodel import create_engine, Session, SQLModel
from app.models.url import URL
from app.utils.utils import encode_base62
from app.config import settings

# Use PostgreSQL connection from Supabase pooler
engine = create_engine(settings.DATABASE_URL, echo=True)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def drop_tables():
    """Drop all tables - use with caution!"""
    SQLModel.metadata.drop_all(engine)


def get_session():
    with Session(engine) as session:
        return session 

if __name__ == "__main__":
    print("Dropping existing tables...")
    drop_tables()
    
    print("Creating new tables...")
    create_db_and_tables()
    
    session = get_session()
    
    new_url_entry = URL(long_url="https://www.google.com")
    session.add(new_url_entry)
    session.commit()
    session.refresh(new_url_entry)

    new_url_entry.short_code = encode_base62(new_url_entry.id)

    session.add(new_url_entry)
    session.commit()

    print(f"Short URL: http://localhost:8000/shorten/{new_url_entry.short_code}")