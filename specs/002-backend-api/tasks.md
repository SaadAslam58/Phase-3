# Implementation Tasks: Backend API for Todo Application
Feature #002 - backend-api

## Overview

This document contains all implementation tasks for the backend API of the Todo application. Tasks are organized by user story priority from the specification, following the locked folder structure and technology stack.

## Implementation Strategy

The implementation follows an MVP-first approach:

1. **Phase 1**: Setup - Project initialization, dependencies, environment
2. **Phase 2**: Foundational - Database, models, schemas, JWT auth (blocking prerequisites)
3. **Phase 3**: [US1] Health Check (P1) - Simplest independently testable slice
4. **Phase 4**: [US4] JWT Authentication Enforcement (P1) - Security foundation
5. **Phase 5**: [US5] User Isolation (P1) - Data privacy enforcement
6. **Phase 6**: [US2] Authenticated Task CRUD (P1) - Core business logic
7. **Phase 7**: [US3] Task Completion Toggle (P2) - Usability enhancement
8. **Phase 8**: [US6] Input Validation & Error Handling (P2) - Clean error responses
9. **Phase 9**: Polish & Cross-Cutting Concerns

### MVP Scope
Phase 1-3 (project setup + health check) demonstrates a running backend. Phase 1-6 delivers the complete core API.

### Parallel Execution Opportunities
- Schema and model files can be developed in parallel (different files)
- Auth module files (jwt.py, dependencies.py) can be developed in parallel
- Once foundational phase is complete, US1 (health) is independent of US4/US5

## Phase 1: Setup Tasks

Goal: Initialize backend project structure and install dependencies

- [x] T001 Create backend directory and Python virtual environment in backend/
- [x] T002 Install required dependencies (fastapi, uvicorn, sqlmodel, psycopg2-binary, pyjwt, python-dotenv, pydantic-settings) and generate backend/requirements.txt
- [x] T003 Create backend/.env.example with DATABASE_URL, BETTER_AUTH_SECRET, ENV, CORS_ORIGINS placeholders
- [x] T004 Create the locked folder structure: backend/auth/, backend/routes/, backend/schemas/ directories with __init__.py files
- [x] T005 Set up backend/.gitignore for Python (venv/, __pycache__/, *.pyc, .env, *.egg-info)

## Phase 2: Foundational Tasks

Goal: Create database connection, ORM model, Pydantic schemas, and JWT verification — blocking prerequisites for all user stories

- [x] T006 [P] Create Task SQLModel table definition in backend/models.py with id, user_id (indexed), title, description, completed, created_at, updated_at fields
- [x] T007 [P] Create database engine, session factory, and create_all startup logic in backend/db.py using DATABASE_URL from environment
- [x] T008 [P] Create Pydantic request/response schemas (TaskCreate, TaskUpdate, TaskResponse) in backend/schemas/task.py
- [x] T009 [P] Implement JWT decode and verify logic in backend/auth/jwt.py using PyJWT with BETTER_AUTH_SECRET (HS256)
- [x] T010 Implement get_current_user FastAPI dependency in backend/auth/dependencies.py that extracts and verifies JWT from Authorization header
- [x] T011 Create FastAPI app instance in backend/main.py with CORS middleware, lifespan startup (create_all), and route registration

## Phase 3: [US1] Health Check Verification

Goal: Expose a public health endpoint to verify backend availability

Independent Test Criteria: Send GET /health and receive {"status": "ok"} with 200 status.

- [x] T012 [US1] Implement GET /health endpoint in backend/routes/health.py returning {"status": "ok"}
- [x] T013 [US1] Register health router in backend/main.py and verify endpoint responds correctly

## Phase 4: [US4] JWT Authentication Enforcement

Goal: Ensure all protected endpoints reject unauthenticated requests

Independent Test Criteria: Requests without JWT return 401; requests with invalid JWT return 401; requests with valid JWT proceed.

- [x] T014 [US4] Add user_id verification to backend/auth/dependencies.py — compare JWT sub claim with URL {user_id} parameter
- [x] T015 [US4] Ensure get_current_user dependency returns 401 for missing Authorization header in backend/auth/dependencies.py
- [x] T016 [US4] Ensure get_current_user dependency returns 401 for invalid or expired JWT tokens in backend/auth/dependencies.py

## Phase 5: [US5] User Isolation

Goal: Ensure users can only access their own tasks — no cross-user data leakage

Independent Test Criteria: Request with JWT user_id mismatching URL user_id returns 403; all DB queries filter by authenticated user_id.

- [x] T017 [US5] Implement verify_user_access dependency in backend/auth/dependencies.py that returns 403 when URL user_id != JWT user_id
- [x] T018 [US5] Ensure all task database queries in backend/routes/tasks.py filter by user_id == authenticated_user_id

## Phase 6: [US2] Authenticated Task CRUD Operations

Goal: Implement all core task endpoints — create, list, get, update, delete

Independent Test Criteria: Authenticated user can create a task, list tasks, get a task by ID, update a task, and delete a task — all scoped to their user_id.

- [x] T019 [P] [US2] Implement POST /api/{user_id}/tasks endpoint in backend/routes/tasks.py — create task with title, optional description, auto-set user_id and timestamps
- [x] T020 [P] [US2] Implement GET /api/{user_id}/tasks endpoint in backend/routes/tasks.py — list all tasks for authenticated user
- [x] T021 [P] [US2] Implement GET /api/{user_id}/tasks/{id} endpoint in backend/routes/tasks.py — get single task by ID scoped to user
- [x] T022 [P] [US2] Implement PUT /api/{user_id}/tasks/{id} endpoint in backend/routes/tasks.py — update task title, description, or completed status
- [x] T023 [P] [US2] Implement DELETE /api/{user_id}/tasks/{id} endpoint in backend/routes/tasks.py — delete task and return success confirmation
- [x] T024 [US2] Register tasks router in backend/main.py with auth dependencies applied to all task routes

## Phase 7: [US3] Task Completion Toggle

Goal: Provide a dedicated endpoint to toggle task completion status

Independent Test Criteria: PATCH /api/{user_id}/tasks/{id}/complete flips completed from false→true and true→false.

- [x] T025 [US3] Implement PATCH /api/{user_id}/tasks/{id}/complete endpoint in backend/routes/tasks.py — toggle completed boolean and update updated_at timestamp

## Phase 8: [US6] Input Validation & Error Handling

Goal: Validate all inputs and return structured error responses

Independent Test Criteria: Empty title returns 400; non-existent task returns 404; server errors return 500 with no stack trace.

- [x] T026 [P] [US6] Add title validation in backend/schemas/task.py — reject empty strings, enforce max 255 chars, description max 1000 chars
- [x] T027 [P] [US6] Add global exception handler in backend/main.py to catch unhandled errors and return {"error": "Internal server error"} with 500 status (no stack traces)
- [x] T028 [US6] Ensure all task endpoints return 404 with {"error": "Task not found"} when task ID doesn't exist for the authenticated user
- [x] T029 [US6] Verify all error responses follow consistent JSON format {"error": "message"} across all status codes (400, 401, 403, 404, 500)

## Phase 9: Polish & Cross-Cutting Concerns

Goal: Final validation, edge cases, and production readiness

- [x] T030 Verify CORS middleware in backend/main.py allows requests from configured CORS_ORIGINS
- [x] T031 Ensure no secrets are hardcoded — all sensitive values read from environment in backend/main.py and backend/auth/jwt.py
- [x] T032 Verify database connection works with Neon PostgreSQL and tables are created on startup
- [x] T033 Test all 6 task endpoints end-to-end with valid JWT tokens
- [x] T034 Test authentication rejection scenarios (no token, invalid token, expired token)
- [x] T035 Test user isolation (access denied when URL user_id != JWT user_id)
- [x] T036 Conduct final review — ensure all 16 functional requirements (FR-001 through FR-016) from spec are met

## Dependencies

- US4 (JWT Auth) depends on foundational JWT module (T009-T010)
- US5 (User Isolation) depends on US4 (JWT Auth must work first)
- US2 (CRUD) depends on US4 + US5 (auth and isolation must be in place)
- US3 (Toggle) depends on US2 (task must exist to toggle)
- US6 (Validation) can be done in parallel with US2/US3 for schema validation, but endpoint validation depends on routes existing
- US1 (Health) is fully independent — no auth required

## Parallel Execution Examples

- T006, T007, T008, T009 can all be developed in parallel (different files: models.py, db.py, schemas/task.py, auth/jwt.py)
- T019-T023 (CRUD endpoints) can be developed in parallel within routes/tasks.py (different functions)
- T026, T027 can be developed in parallel (schemas/task.py vs main.py)
