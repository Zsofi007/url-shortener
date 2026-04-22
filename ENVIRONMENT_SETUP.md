# Environment Variables Setup

This document explains how to set up environment variables for the URL Shortener project.

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

### Database Configuration
```bash
DATABASE=urlshortener
DB_USER=postgres
PASSWORD=password
```

### Backend Configuration
```bash
DEBUG=False
BASE_URL=http://localhost:8000
BASE_URL_FRONTEND=http://localhost:3000
```

### Frontend Configuration
```bash
VITE_API_BASE_URL=http://localhost:8000
```

### Supabase Configuration (Required)
```bash
SUPABASE_URL=your_supabase_url_here
SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key_here
SUPABASE_SECRET_KEY=your_supabase_secret_key_here
```

### JWT Configuration
```bash
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRY=3600
```

## Frontend Environment Variables

The frontend uses Vite's environment variable system. All frontend environment variables must be prefixed with `VITE_`.

- `VITE_API_BASE_URL`: The base URL for the backend API (defaults to `http://localhost:8000`)

## Docker Environment Variables

When running with Docker Compose, these environment variables are automatically loaded from the `.env` file in the root directory.

## Development vs Production

- **Development**: Uses localhost URLs
- **Production**: Update the URLs to match your production domain

## Example .env File

```bash
# Database Configuration
DATABASE=urlshortener
DB_USER=postgres
PASSWORD=password

# Backend Configuration
DEBUG=False
BASE_URL=http://localhost:8000
BASE_URL_FRONTEND=http://localhost:3000

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:8000

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SECRET_KEY=your_secret_key

# JWT Configuration
JWT_SECRET=your_secret_key_here
JWT_EXPIRY=3600
```
