#!/usr/bin/env python3
"""
Database initialization script
Creates tables and indexes for optimal performance
"""

from app.db import create_tables, create_indexes

def main():
    print("Creating database tables...")
    create_tables()
    print("✓ Tables created successfully")
    
    print("Creating database indexes...")
    create_indexes()
    print("✓ Indexes created successfully")
    
    print("Database initialization completed!")

if __name__ == "__main__":
    main()
