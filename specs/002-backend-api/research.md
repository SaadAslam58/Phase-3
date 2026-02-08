# Research Summary: Backend API Implementation

## Decision 1: ORM Choice - SQLModel vs SQLAlchemy (async)
**What was chosen**: SQLModel
**Why chosen**: Specified in the project constitution and spec as the mandatory ORM. SQLModel is built on top of SQLAlchemy and Pydantic, providing a unified model/schema definition that reduces boilerplate. It supports async operations via SQLAlchemy's async engine underneath.
**Alternatives considered**:
- Raw SQLAlchemy (async): More flexible but requires separate Pydantic schemas. SQLModel wraps this and provides both.
- Tortoise ORM: Different ecosystem, not specified in constitution.

## Decision 2: JWT Verification Strategy
**What was chosen**: Manual JWT verification using PyJWT with HMAC-SHA256 (HS256)
**Why chosen**: Better Auth issues JWTs signed with HMAC using the BETTER_AUTH_SECRET. The backend only needs to verify tokens (not issue them), so a lightweight PyJWT dependency is sufficient. No need for a full auth framework.
**Implementation approach**:
- Use `PyJWT` library to decode and verify tokens
- Extract `sub` (user ID) from the verified payload
- Centralize in a FastAPI dependency (`get_current_user`)
- Return 401 for missing/invalid/expired tokens
**Alternatives considered**:
- python-jose: Heavier, includes JOSE support we don't need
- authlib: Full OAuth framework - overkill for verification-only use case
- Better Auth Python SDK: Does not exist; Better Auth is a JS/TS library

## Decision 3: Database Connection Strategy with Neon
**What was chosen**: Synchronous psycopg2 with SQLModel (sync engine)
**Why chosen**: SQLModel's native integration works best with synchronous SQLAlchemy engine. Neon supports standard PostgreSQL connections via `psycopg2`. Using sync is simpler, well-documented with SQLModel, and adequate for the application's scale. FastAPI can still handle concurrent requests via async I/O even with sync DB calls.
**Connection string format**: `postgresql://user:password@host/dbname?sslmode=require`
**Alternatives considered**:
- asyncpg + async SQLAlchemy: More complex setup, SQLModel's async support is less mature
- Neon serverless driver: JS-only, not available for Python

## Decision 4: Project Structure - Spec Locked vs User Plan Input
**What was chosen**: The spec-locked structure
**Why chosen**: The backend spec (sp.specify) explicitly locks the folder structure. The spec is the authoritative source per Spec-Kit Plus discipline.
**Locked structure**:
```
backend/
  main.py
  db.py
  models.py
  auth/
    jwt.py
    dependencies.py
  routes/
    tasks.py
    health.py
  schemas/
    task.py
  .env.example
```
**Alternatives considered**:
- User's plan input proposed `backend/app/` with `core/`, `models/`, `schemas/`, `api/`, `services/` subdirectories. This is a valid structure but conflicts with the spec's locked layout. The spec takes precedence.

## Decision 5: API Route Prefix
**What was chosen**: `/api/{user_id}/tasks` pattern (spec-locked)
**Why chosen**: The spec explicitly locks the endpoint structure with user_id in the URL path. This enables server-side user isolation verification by comparing the URL user_id against the JWT user_id.
**Note**: The user's plan input proposed `/api/v1/` prefix. The spec takes precedence with `/api/{user_id}/tasks`.
**Alternatives considered**:
- `/api/v1/tasks` with user_id from JWT only: Simpler but doesn't match the spec's locked API design

## Decision 6: Migrations Strategy
**What was chosen**: SQLModel's `create_all()` for initial setup (no Alembic)
**Why chosen**: For a single-table schema (tasks), Alembic adds unnecessary complexity. SQLModel's `metadata.create_all(engine)` creates tables on startup. If schema evolution is needed later, Alembic can be added.
**Alternatives considered**:
- Alembic: User's plan input included it, but the spec's locked folder structure doesn't include an `alembic/` directory. Can be added later if needed.

## Decision 7: Environment Configuration
**What was chosen**: python-dotenv for .env loading + Pydantic settings
**Why chosen**: Simple, well-established pattern for FastAPI applications. Reads DATABASE_URL, BETTER_AUTH_SECRET, and ENV from .env file.
**Required env vars**:
- `DATABASE_URL`: Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Shared secret for JWT verification
- `ENV`: development/production flag
- `CORS_ORIGINS`: Comma-separated list of allowed origins

## Decision 8: CORS Configuration
**What was chosen**: FastAPI CORSMiddleware with configurable origins
**Why chosen**: Frontend runs on a different port (localhost:3000) than backend (localhost:7860 per .env.local). CORS must be configured to allow cross-origin requests from the frontend.
**Configuration**: Origins loaded from CORS_ORIGINS env var, defaulting to `http://localhost:3000`.

## Additional Technical Considerations

### Error Response Format
Consistent JSON error responses:
```json
{
  "error": "Human-readable message",
  "detail": "Optional additional context"
}
```

### Security Headers
- No stack traces in production
- Proper HTTP status codes (400, 401, 403, 404, 500)
- JWT expiration validation

### Performance
- Connection pooling via SQLAlchemy engine
- Neon supports serverless scaling
- No caching layer needed for MVP
