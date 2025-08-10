# Railway Deployment Guide

This guide explains how to deploy your URL shortener application to Railway.

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Railway CLI** (optional): `npm install -g @railway/cli`

## Deployment Steps

### 1. Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Select your repository

### 2. Set Up Database

1. In your Railway project, click "New Service"
2. Choose "Database" → "PostgreSQL"
3. Railway will automatically provide a `DATABASE_URL` environment variable

### 3. Deploy Backend

1. In your Railway project, click "New Service"
2. Choose "GitHub Repo"
3. Select your repository
4. Set the following environment variables:

```bash
# Database (Railway provides this automatically)
DATABASE_URL=postgresql://...

# Application settings
BASE_URL=https://your-backend-name.railway.app
BASE_URL_FRONTEND=https://your-frontend-domain.com

# Supabase settings (if using Supabase auth)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT settings
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=3600

# Debug mode (set to False for production)
DEBUG=False
```

5. Railway will automatically detect the `Dockerfile.prod` and deploy

### 4. Deploy Frontend

1. Create another service for the frontend
2. Choose "GitHub Repo" again
3. Set the following environment variables:

```bash
# Backend API URL
VITE_API_BASE_URL=https://your-backend-name.railway.app
```

4. Railway will use the `url_frontend/Dockerfile.prod`

### 5. Configure Domains

1. In each service, go to "Settings" → "Domains"
2. Railway provides free `.railway.app` domains
3. You can also connect custom domains

## Environment Variables Reference

### Backend Service
- `DATABASE_URL`: PostgreSQL connection string (Railway provides)
- `BASE_URL`: Your backend service URL
- `BASE_URL_FRONTEND`: Your frontend service URL
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `JWT_SECRET`: Secret for JWT tokens
- `JWT_EXPIRY`: JWT expiration time in seconds
- `DEBUG`: Set to "False" for production

### Frontend Service
- `VITE_API_BASE_URL`: Your backend service URL

## Production Considerations

### Security
- Set `DEBUG=False` in production
- Use strong `JWT_SECRET`
- Restrict CORS origins to your production domains
- Enable HTTPS (Railway provides this automatically)

### Performance
- Database connection pooling is handled automatically
- Railway provides load balancing
- Health checks ensure service availability

### Monitoring
- Railway provides built-in monitoring
- Check logs in the Railway dashboard
- Monitor database performance

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify `DATABASE_URL` is set correctly
   - Check if PostgreSQL service is running

2. **CORS Errors**
   - Ensure `BASE_URL_FRONTEND` is set correctly
   - Check CORS configuration in `main.py`

3. **Build Failures**
   - Verify `Dockerfile.prod` exists
   - Check build logs in Railway dashboard

4. **Health Check Failures**
   - Ensure `/health` endpoint is accessible
   - Check application logs

### Debugging

1. **View Logs**: Go to your service → "Deployments" → "View Logs"
2. **Environment Variables**: Check "Variables" tab
3. **Health Status**: Monitor health checks in the dashboard

## Cost Optimization

- Railway charges based on usage
- PostgreSQL has a free tier
- Consider stopping services when not in use
- Monitor resource usage in the dashboard

## Next Steps

After successful deployment:

1. Test all endpoints
2. Verify authentication flow
3. Test URL shortening functionality
4. Monitor performance and errors
5. Set up custom domains if needed
6. Configure monitoring and alerts

## Support

- Railway Documentation: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- GitHub Issues: For application-specific issues
