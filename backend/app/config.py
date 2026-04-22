import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    # Database settings
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
    BASE_URL: str = os.getenv("BASE_URL", "http://localhost:8000")
    BASE_URL_FRONTEND: str = os.getenv("BASE_URL_FRONTEND", "https://your-frontend-domain.com")

    # CORS
    # Comma-separated list of allowed origins, e.g.:
    # CORS_ORIGINS="https://your-frontend.vercel.app,http://localhost:5173"
    CORS_ORIGINS = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            f"{BASE_URL_FRONTEND},http://localhost:3000,http://localhost:5173",
        ).split(",")
        if origin.strip()
    ]
    
    # Supabase authentication settings
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    # Supabase credentials naming (new):
    # - SUPABASE_PUBLISHABLE_KEY: safe to use for client-side and standard auth flows
    # - SUPABASE_SECRET_KEY: server-side only (admin operations). Not used unless you add admin features.
    SUPABASE_PUBLISHABLE_KEY: str = os.getenv("SUPABASE_PUBLISHABLE_KEY", "")
    SUPABASE_SECRET_KEY: str = os.getenv("SUPABASE_SECRET_KEY", "")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "")
    JWT_EXPIRY: int = int(os.getenv("JWT_EXPIRY", "3600"))  # 1 hour default

settings = Settings() 