import os

class Settings:
    # Database settings - Railway provides DATABASE_URL
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    
    # Fallback database settings for local development
    USER: str = os.getenv("DB_USER", "")
    PASSWORD = os.getenv("PASSWORD", "")
    HOST = os.getenv("HOST", "")
    PORT = os.getenv("PORT", "")
    DBNAME = os.getenv("DATABASE", "")
    
    # Construct DATABASE_URL from components if not provided (for local dev)
    if not DATABASE_URL and all([USER, PASSWORD, HOST, PORT, DBNAME]):
        DATABASE_URL = f"postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}"
    
    DEBUG: bool = os.getenv("DEBUG", "False") == "True"
    
    # Application settings
    BASE_URL: str = os.getenv("BASE_URL", "https://your-app-name.railway.app")
    BASE_URL_FRONTEND: str = os.getenv("BASE_URL_FRONTEND", "https://your-frontend-domain.com")
    
    # Supabase authentication settings
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "")
    JWT_EXPIRY: int = int(os.getenv("JWT_EXPIRY", "3600"))  # 1 hour default

settings = Settings() 