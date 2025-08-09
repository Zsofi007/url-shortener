# URL Shortener Backend with Supabase

This FastAPI application uses Supabase PostgreSQL as the database.

## Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Database Connection

Create a `.env` file in the backend directory with your Supabase connection string:

```env
DATABASE_URL=postgres://postgres.apbkobhfnmcqqzqeeqss:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
DEBUG=True
```

**Replace the following in your connection string:**
- `[YOUR-PASSWORD]` - Your actual Supabase database password
- `[REGION]` - Your Supabase region (e.g., us-east-1, eu-west-1)

### 3. Initialize Database
```bash
python setup_db.py
```

This will:
- Create the necessary tables in your Supabase database
- Add a sample URL entry to test the connection

### 4. Run the Application
```bash
python run.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `GET /` - Health check
- `GET /api/urls` - Get all URLs
- `POST /api/urls` - Create a new shortened URL
- `GET /api/urls/{short_code}` - Get URL by short code

## Environment Variables

- `DATABASE_URL` - Your Supabase PostgreSQL connection string
- `DEBUG` - Set to "True" for debug mode (default: "False")

## Troubleshooting

1. **Connection Error**: Make sure your DATABASE_URL is correct and includes the actual password and region
2. **Table Creation Error**: Ensure your Supabase database allows table creation
3. **Import Error**: Make sure all dependencies are installed with `pip install -r requirements.txt` 