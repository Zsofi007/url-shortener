#!/bin/bash

# Production start script
# Uses $PORT if provided (default: 8000)

# Run database migrations
python -c "from app.db import create_tables; create_tables()"

# Start the application
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1
