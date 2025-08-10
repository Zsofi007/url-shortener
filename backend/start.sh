#!/bin/bash

# Production start script for Railway
# Railway sets the PORT environment variable

# Run database migrations
python -c "from app.db import create_tables; create_tables()"

# Start the application
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 1
