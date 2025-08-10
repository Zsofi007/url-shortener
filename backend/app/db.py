from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy import text
from app.config import settings

# Database engine
engine = create_engine(settings.DATABASE_URL, echo=settings.DEBUG)

def create_tables():
    """Create all tables defined in SQLModel"""
    SQLModel.metadata.create_all(engine)

def create_indexes():
    """Create database indexes for optimal performance"""
    with Session(engine) as session:
        # Index for user_id (most important for user URL queries)
        session.exec(text("""
            CREATE INDEX IF NOT EXISTS idx_urls_user_id 
            ON url (user_id);
        """))
        
        # Composite index for user_id + created_at (for sorting by creation date)
        session.exec(text("""
            CREATE INDEX IF NOT EXISTS idx_urls_user_created 
            ON url (user_id, created_at DESC);
        """))
        
        # Composite index for user_id + clicks (for sorting by click count)
        session.exec(text("""
            CREATE INDEX IF NOT EXISTS idx_urls_user_clicks 
            ON url (user_id, clicks DESC);
        """))
        
        # Composite index for user_id + expires_at (for sorting by expiration)
        session.exec(text("""
            CREATE INDEX IF NOT EXISTS idx_urls_user_expires 
            ON url (user_id, expires_at ASC);
        """))
        
        # Index for short_code (for redirect lookups)
        session.exec(text("""
            CREATE INDEX IF NOT EXISTS idx_urls_short_code 
            ON url (short_code);
        """))
        
        # Index for expires_at (for cleanup tasks)
        session.exec(text("""
            CREATE INDEX IF NOT EXISTS idx_urls_expires_at 
            ON url (expires_at);
        """))
        
        session.commit()

def get_session():
    """Get database session"""
    with Session(engine) as session:
        yield session

# Initialize database
if __name__ == "__main__":
    create_tables()
    create_indexes()