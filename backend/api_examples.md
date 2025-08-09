# URL Shortener API Examples

## 🚀 Quick Start

### Base URL
```
http://localhost:8000
```

## 📋 API Endpoints

### 1. Create Shortened URL
**POST** `/api/shorten`

#### Basic Example (with defaults)
```json
{
  "long_url": "https://www.google.com"
}
```
*Response: 7 days expiration, 10 max clicks*

#### Custom Limits Example
```json
{
  "long_url": "https://www.github.com",
  "expires_in_days": 14,
  "max_clicks": 100
}
```

#### Single-Use URL Example
```json
{
  "long_url": "https://secret-document.com",
  "expires_in_days": 1,
  "max_clicks": 1
}
```

### 2. Create Custom URL
**POST** `/api/custom`

#### Basic Custom Code
```json
{
  "long_url": "https://my-portfolio.com",
  "custom_code": "portfolio"
}
```

#### Custom Code with Limits
```json
{
  "long_url": "https://my-blog.com",
  "custom_code": "blog-2024",
  "expires_in_days": 30,
  "max_clicks": 1000
}
```

### 3. Redirect (GET)
**GET** `/{short_code}`

Examples:
- `GET /abc123` → Redirects to original URL
- `GET /portfolio` → Redirects to custom URL

### 4. Manual Cleanup
**POST** `/api/cleanup`

No body required. Returns:
```json
{
  "message": "Cleanup completed successfully",
  "deleted_count": 5
}
```

## 📊 Response Format

All create endpoints return:
```json
{
  "short_code": "abc123",
  "long_url": "https://example.com",
  "expires_at": "2024-01-15T10:30:00Z",
  "max_clicks": 50,
  "clicks": 0,
  "created_at": "2024-01-08T10:30:00Z"
}
```

## 🛡️ Validation Rules

### Limits
- **expires_in_days**: 1-30 (default: 7)
- **max_clicks**: 1-1000 (default: 10)

### Custom Code Rules
- **Length**: 3-50 characters
- **Allowed**: Letters, numbers, hyphens (-), underscores (_)
- **Must be unique**

### URL Rules
- **Max length**: 2048 characters
- **Auto-protocol**: Adds https:// if missing

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "detail": "Custom code must be 3-50 characters long..."
}
```

### 409 Conflict
```json
{
  "detail": "Custom code already exists. Please choose a different one."
}
```

### 410 Gone
```json
{
  "detail": "Short URL has expired and been removed"
}
```

## 🔧 cURL Examples

### Create Short URL
```bash
curl -X POST "http://localhost:8000/api/shorten" \
  -H "Content-Type: application/json" \
  -d '{
    "long_url": "https://www.example.com",
    "expires_in_days": 7,
    "max_clicks": 50
  }'
```

### Create Custom URL
```bash
curl -X POST "http://localhost:8000/api/custom" \
  -H "Content-Type: application/json" \
  -d '{
    "long_url": "https://my-site.com",
    "custom_code": "my-link",
    "expires_in_days": 30,
    "max_clicks": 100
  }'
```

### Test Redirect
```bash
curl -I "http://localhost:8000/abc123"
```

### Manual Cleanup
```bash
curl -X POST "http://localhost:8000/api/cleanup"
```