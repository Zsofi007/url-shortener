# Docker Setup for URL Shortener

This document explains how to run the URL Shortener application using Docker and Docker Compose.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system
- Environment variables configured (see Environment Setup section)

## Quick Start

1. **Clone the repository and navigate to the project directory:**
   ```bash
   cd url-shortener
   ```

2. **Create a `.env` file in the root directory with your configuration:**
   ```bash
   cp backend/env.template .env
   # Edit .env with your actual values
   ```

3. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

## Services Overview

### 1. Frontend (React + Vite)
- **Port**: 3000
- **Technology**: React 19, TypeScript, Tailwind CSS
- **Container**: Nginx serving built React app
- **Features**: 
  - Multi-stage build for optimization
  - Static file serving with Nginx
  - Client-side routing support
  - Gzip compression
  - Security headers

### 2. Backend (FastAPI)
- **Port**: 8000
- **Technology**: FastAPI, SQLModel, PostgreSQL
- **Container**: Python 3.11 slim
- **Features**:
  - Hot-reload for development
  - Database connection pooling
  - Health checks
  - Non-root user for security

### 3. PostgreSQL Database
- **Port**: 5432
- **Version**: 15-alpine
- **Features**:
  - Persistent data storage
  - Health checks
  - Automatic initialization
  - Optimized for production

### 4. Redis (Optional)
- **Port**: 6379
- **Version**: 7-alpine
- **Features**:
  - Caching layer
  - Session storage (future use)
  - Rate limiting (future use)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE=urlshortener
DB_USER=postgres
PASSWORD=your_secure_password
HOST=postgres
PORT=5432

# Application Settings
DEBUG=False
BASE_URL=http://localhost:8000
BASE_URL_FRONTEND=http://localhost:3000

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=3600
```

## Docker Commands

### Basic Operations

```bash
# Start all services
docker-compose up

# Start services in background
docker-compose up -d

# Build and start services
docker-compose up --build

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend
```

### Development Commands

```bash
# Rebuild specific service
docker-compose build backend

# Restart specific service
docker-compose restart backend

# Execute commands in running container
docker-compose exec backend python -m pytest
docker-compose exec postgres psql -U postgres -d urlshortener

# Access container shell
docker-compose exec backend bash
docker-compose exec frontend sh
```

### Production Commands

```bash
# Build production images
docker-compose -f docker-compose.yml build

# Start production services
docker-compose -f docker-compose.yml up -d

# Scale services
docker-compose up -d --scale backend=3
```

## Development vs Production

### Development Mode
- Source code is mounted as volumes for hot-reload
- Debug mode enabled
- Development dependencies included
- Logs are verbose

### Production Mode
- Source code is copied into containers
- Debug mode disabled
- Only production dependencies
- Optimized builds
- Health checks enabled

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   ```bash
   # Check what's using the ports
   netstat -tulpn | grep :8000
   netstat -tulpn | grep :3000
   
   # Change ports in docker-compose.yml if needed
   ports:
     - "8001:8000"  # Use port 8001 instead of 8000
   ```

2. **Database connection issues:**
   ```bash
   # Check database logs
   docker-compose logs postgres
   
   # Test database connection
   docker-compose exec backend python -c "from app.db import get_db; print('DB OK')"
   ```

3. **Frontend build issues:**
   ```bash
   # Rebuild frontend
   docker-compose build --no-cache frontend
   
   # Check build logs
   docker-compose logs frontend
   ```

4. **Permission issues:**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Health Checks

All services include health checks:

```bash
# Check service health
docker-compose ps

# View health check logs
docker-compose logs backend | grep health
```

### Logs and Debugging

```bash
# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# Access container directly
docker-compose exec backend bash
```

## Performance Optimization

### Backend
- Uses Python 3.11 slim image
- Multi-stage build for smaller final image
- Non-root user for security
- Health checks for monitoring

### Frontend
- Multi-stage build with Nginx
- Gzip compression enabled
- Static asset caching
- Optimized bundle size

### Database
- Connection pooling
- Proper indexing
- Health checks
- Persistent volumes

## Security Features

- Non-root containers
- Security headers in Nginx
- Environment variable isolation
- Network isolation
- Health checks for monitoring

## Monitoring

### Built-in Monitoring
- Health check endpoints
- Container status monitoring
- Log aggregation
- Resource usage tracking

### External Monitoring (Optional)
- Prometheus metrics
- Grafana dashboards
- Log aggregation (ELK stack)
- APM tools

## Scaling

### Horizontal Scaling
```bash
# Scale backend services
docker-compose up -d --scale backend=3

# Scale with load balancer
docker-compose up -d --scale backend=5
```

### Vertical Scaling
- Adjust container resource limits in docker-compose.yml
- Monitor resource usage with `docker stats`
- Optimize application code for better performance

## Backup and Recovery

### Database Backup
```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres urlshortener > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U postgres urlshortener < backup.sql
```

### Volume Backup
```bash
# Backup volumes
docker run --rm -v url_shortener_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .

# Restore volumes
docker run --rm -v url_shortener_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_backup.tar.gz -C /data
```

## Next Steps

1. **Production Deployment:**
   - Set up reverse proxy (Nginx/Traefik)
   - Configure SSL certificates
   - Set up monitoring and alerting
   - Implement backup strategies

2. **CI/CD Pipeline:**
   - Automated testing
   - Image building and pushing
   - Deployment automation
   - Rollback strategies

3. **Advanced Features:**
   - Load balancing
   - Auto-scaling
   - Service mesh
   - Multi-region deployment

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review service logs
3. Check health check status
4. Verify environment variables
5. Ensure all prerequisites are met
