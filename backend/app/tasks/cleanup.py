"""
Background cleanup tasks for expired URLs
"""
import asyncio
from datetime import datetime
from sqlmodel import Session, select
from app.db import engine
from app.models.url import URL
import logging

logger = logging.getLogger(__name__)


def cleanup_expired_urls():
    """
    Remove expired URLs from the database.
    Only removes URLs that have passed their expires_at date.
    
    Note: URLs that reach max_clicks are deleted immediately during redirect,
    so no need to check for click limits here.
    """
    try:
        with Session(engine) as session:
            current_time = datetime.utcnow()
            
            # Find URLs expired by date only
            expired_urls = session.exec(
                select(URL).where(
                    URL.expires_at.is_not(None),
                    URL.expires_at < current_time
                )
            ).all()
            
            # Delete expired URLs
            deleted_count = 0
            
            for url in expired_urls:
                session.delete(url)
                deleted_count += 1
                logger.info(f"Deleted expired URL: {url.short_code} (expired on {url.expires_at})")
            
            session.commit()
            
            if deleted_count > 0:
                logger.info(f"Cleanup completed: {deleted_count} expired URLs removed")
            else:
                logger.debug("Cleanup completed: No expired URLs found")
                
            return deleted_count
            
    except Exception as e:
        logger.error(f"Error during URL cleanup: {str(e)}")
        return 0


async def periodic_cleanup(interval_hours: int = 1):
    """
    Run cleanup task periodically
    
    Args:
        interval_hours: How often to run cleanup (default: every hour)
    """
    logger.info(f"Starting periodic cleanup task (every {interval_hours} hour(s))")
    
    while True:
        try:
            deleted_count = cleanup_expired_urls()
            logger.info(f"Periodic cleanup completed: {deleted_count} URLs removed")
        except Exception as e:
            logger.error(f"Error in periodic cleanup: {str(e)}")
        
        # Wait for the specified interval
        await asyncio.sleep(interval_hours * 3600)  # Convert hours to seconds


async def startup_cleanup():
    """
    Run cleanup once during app startup
    """
    logger.info("Running startup URL cleanup...")
    deleted_count = cleanup_expired_urls()
    logger.info(f"Startup cleanup completed: {deleted_count} expired URLs removed")