import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    # Database settings - pooler connection string for free plan
    USER: str =os.getenv("DB_USER")
    PASSWORD = os.getenv("PASSWORD")
    HOST = os.getenv("HOST")
    PORT = os.getenv("PORT")
    DBNAME = os.getenv("DATABASE")
    DATABASE_URL = f"postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}"
    
    DEBUG: bool = os.getenv("DEBUG", "False") == "True"
    # Application settings
    BASE_URL: str = os.getenv("BASE_URL", "http://localhost:8000")
    BASE_URL_FRONTEND: str = os.getenv("BASE_URL_FRONTEND", "http://localhost:5173")
    # Supabase authentication settings
    SUPABASE_URL: str = os.getenv("SUPABASE_URL")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    JWT_SECRET: str = os.getenv("JWT_SECRET")
    JWT_EXPIRY: int = int(os.getenv("JWT_EXPIRY", "3600"))  # 1 hour default

settings = Settings() 