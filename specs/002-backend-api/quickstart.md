# Backend Quickstart

## Prerequisites
- Python 3.11+ installed
- pip installed
- Neon PostgreSQL database provisioned (connection string ready)
- Better Auth configured (BETTER_AUTH_SECRET available)

## Setup Instructions

1. **Create the backend directory and virtual environment**
   ```bash
   cd Phase-2
   mkdir backend && cd backend
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Unix/Mac
   source venv/bin/activate
   ```

2. **Install dependencies**
   ```bash
   pip install fastapi uvicorn sqlmodel psycopg2-binary pyjwt python-dotenv pydantic-settings
   ```

3. **Create requirements.txt**
   ```bash
   pip freeze > requirements.txt
   ```

4. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values:
   # DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
   # BETTER_AUTH_SECRET=your_actual_secret
   ```

5. **Run the development server**
   ```bash
   uvicorn main:app --reload --port 7860
   ```

6. **Verify the server**
   ```bash
   curl http://localhost:7860/health
   # Expected: {"status":"ok"}
   ```

## Folder Structure
```
backend/
  main.py              # FastAPI app entry point, CORS, routes
  db.py                # Database engine, session, table creation
  models.py            # SQLModel table definitions (Task)
  auth/
    jwt.py             # JWT verification logic
    dependencies.py    # FastAPI dependency for auth injection
  routes/
    tasks.py           # All task CRUD endpoints
    health.py          # Health check endpoint
  schemas/
    task.py            # Pydantic request/response schemas
  .env.example         # Environment variable template
  requirements.txt     # Python dependencies
```

## Environment Variables
- `DATABASE_URL`: Neon PostgreSQL connection string (with `?sslmode=require`)
- `BETTER_AUTH_SECRET`: Shared secret for JWT verification (must match Better Auth config)
- `ENV`: `development` or `production`
- `CORS_ORIGINS`: Comma-separated allowed origins (default: `http://localhost:3000`)

## API Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | Health check |
| GET | `/api/{user_id}/tasks` | Yes | List user's tasks |
| POST | `/api/{user_id}/tasks` | Yes | Create task |
| GET | `/api/{user_id}/tasks/{id}` | Yes | Get task |
| PUT | `/api/{user_id}/tasks/{id}` | Yes | Update task |
| DELETE | `/api/{user_id}/tasks/{id}` | Yes | Delete task |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Yes | Toggle completion |

## Testing
```bash
# Health check
curl http://localhost:7860/health

# Create task (requires valid JWT)
curl -X POST http://localhost:7860/api/{user_id}/tasks \
  -H "Authorization: Bearer {jwt_token}" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test task"}'

# List tasks
curl http://localhost:7860/api/{user_id}/tasks \
  -H "Authorization: Bearer {jwt_token}"
```
