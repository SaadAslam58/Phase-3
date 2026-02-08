# Implementation Plan: Backend API for Todo Application

**Branch**: `002-backend-api` | **Date**: 2026-02-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-backend-api/spec.md`

## Summary

Build a secure, stateless FastAPI backend that exposes REST endpoints for task CRUD operations, verifies JWT tokens issued by Better Auth, persists data in Neon Serverless PostgreSQL via SQLModel, and enforces strict user isolation. The backend runs on port 7860 and serves the existing Next.js frontend.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: FastAPI, SQLModel, PyJWT, uvicorn, psycopg2-binary, python-dotenv, pydantic-settings
**Storage**: Neon Serverless PostgreSQL (accessed via `DATABASE_URL` with `psycopg2`)
**Testing**: Manual testing via curl/Postman (automated tests can be added later)
**Target Platform**: Linux/Windows server, development on localhost:7860
**Project Type**: Web backend (API only, no frontend)
**Performance Goals**: < 500ms response time for all endpoints under normal load
**Constraints**: Stateless (no sessions), JWT-only auth, no raw SQL, strict user isolation
**Scale/Scope**: Single-user to multi-user SaaS, single tasks table

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The constitution template is unfilled, so no specific gates to evaluate. The spec itself defines binding constraints:

- **Technology stack compliance**: Python 3.11+ / FastAPI / SQLModel / Neon PostgreSQL / JWT - LOCKED
- **Folder structure compliance**: Locked to `backend/` with `main.py`, `db.py`, `models.py`, `auth/`, `routes/`, `schemas/` - LOCKED
- **API routes compliance**: `/api/{user_id}/tasks` pattern - LOCKED
- **Security compliance**: JWT verification mandatory, user isolation non-negotiable - LOCKED
- **No secrets committed**: All secrets via .env - ENFORCED

**Gate result**: PASS (all constraints documented and will be honored)

## Project Structure

### Documentation (this feature)

```text
specs/002-backend-api/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── api-openapi.yaml # Phase 1 output
└── tasks.md             # Phase 2 output (via /sp.tasks)
```

### Source Code (Locked Structure)

```text
backend/
├── main.py              # FastAPI app, CORS middleware, route registration
├── db.py                # SQLModel engine, session factory, create_all
├── models.py            # Task SQLModel table definition
├── auth/
│   ├── jwt.py           # JWT decode/verify using PyJWT + BETTER_AUTH_SECRET
│   └── dependencies.py  # get_current_user FastAPI dependency + user_id verification
├── routes/
│   ├── tasks.py         # All 6 task endpoints (list, create, get, update, delete, toggle)
│   └── health.py        # GET /health → {"status": "ok"}
├── schemas/
│   └── task.py          # TaskCreate, TaskUpdate, TaskResponse Pydantic schemas
├── .env.example         # Environment variable template
└── requirements.txt     # Python dependencies
```

**Structure Decision**: Using the spec-locked flat structure. No nested `app/` directory, no `core/`, no `services/`. The user's plan input proposed a different structure, but the spec is authoritative.

## Phase 0: Research Summary

All research is documented in [research.md](./research.md). Key decisions:

1. **SQLModel** (spec-mandated) for ORM - unified model/schema definitions
2. **PyJWT** for JWT verification - lightweight, verification-only
3. **Synchronous psycopg2** with SQLModel - simpler, well-documented
4. **Spec-locked folder structure** takes precedence over user plan input
5. **Spec-locked API routes** (`/api/{user_id}/tasks`) take precedence
6. **No Alembic** for MVP - `create_all()` sufficient for single table
7. **python-dotenv + pydantic-settings** for configuration
8. **CORSMiddleware** configured from `CORS_ORIGINS` env var

## Phase 1: Design Decisions

### Authentication Flow

```
Frontend (Better Auth) → Issues JWT → Stores in localStorage
                                           ↓
Frontend sends request → Authorization: Bearer <token>
                                           ↓
Backend dependency (get_current_user) → Verifies JWT with BETTER_AUTH_SECRET
                                           ↓
                                    Extracts user_id from "sub" claim
                                           ↓
                                    Compares with URL {user_id}
                                           ↓
                              Match → Process request
                              Mismatch → 403 Forbidden
```

### Database Connection

```python
# db.py pattern
DATABASE_URL from .env → SQLModel create_engine → Session factory
On startup → create_all() creates tasks table if not exists
Each request → get_session() dependency provides Session
```

### Error Response Contract

All errors follow:
```json
{
  "error": "Human-readable message"
}
```

Status codes:
- 400: Validation errors (bad input)
- 401: No JWT or invalid JWT
- 403: JWT user_id ≠ URL user_id
- 404: Task not found (scoped to user)
- 500: Internal error (no stack traces exposed)

### Frontend Integration Notes

The frontend (already built) uses `NEXT_PUBLIC_API_URL=http://localhost:7860` and expects:
- JWT in `Authorization: Bearer` header
- JSON responses
- CORS headers allowing `http://localhost:3000`

**Important compatibility note**: The frontend's `lib/api.ts` uses endpoints like `/api/tasks` (without user_id in path), but the backend spec locks `/api/{user_id}/tasks`. The frontend API client will need to be updated during integration to include the user_id in the URL path.

## Complexity Tracking

No constitution violations to justify. All decisions align with spec constraints.

## Artifacts Generated

| Artifact | Path | Status |
|----------|------|--------|
| Research | `specs/002-backend-api/research.md` | Complete |
| Data Model | `specs/002-backend-api/data-model.md` | Complete |
| API Contract | `specs/002-backend-api/contracts/api-openapi.yaml` | Complete |
| Quickstart | `specs/002-backend-api/quickstart.md` | Complete |
| Plan | `specs/002-backend-api/plan.md` | Complete |

## Next Steps

Run `/sp.tasks` to generate the implementation task breakdown from this plan.
