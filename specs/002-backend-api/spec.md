# Feature Specification: Backend API for Todo Application

**Feature Branch**: `002-backend-api`
**Created**: 2026-02-06
**Status**: Draft
**Input**: User description: "Backend Specification - Todo Full-Stack Web Application Phase II - Backend Only (API, Auth, Database)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Health Check Verification (Priority: P1)

As a system operator or frontend client, I want to verify that the backend API is running and available so that I can confirm connectivity before performing any operations.

**Why this priority**: This is the simplest independently testable slice. It confirms the backend server is running and reachable, which is a prerequisite for everything else.

**Independent Test**: Can be tested by sending a single HTTP request to the health endpoint and verifying a success response.

**Acceptance Scenarios**:

1. **Given** the backend is running, **When** a client sends a GET request to the health endpoint, **Then** the system responds with a success status and `{"status": "ok"}`.
2. **Given** the backend is not running, **When** a client sends a request, **Then** the connection is refused (standard behavior).

---

### User Story 2 - Authenticated Task CRUD Operations (Priority: P1)

As an authenticated user, I want to create, read, update, and delete my own tasks through the API so that my todo items are persisted securely in the database.

**Why this priority**: Core business functionality. Without CRUD, the application has no value. This covers the primary user interaction with the system.

**Independent Test**: Can be tested by authenticating, creating a task, reading it back, updating it, and deleting it - all through API calls.

**Acceptance Scenarios**:

1. **Given** an authenticated user with a valid JWT, **When** they create a task with a title, **Then** the system persists the task and returns it with a unique ID, timestamps, and the user's ID.
2. **Given** an authenticated user with existing tasks, **When** they request their task list, **Then** the system returns only tasks belonging to that user.
3. **Given** an authenticated user and an existing task they own, **When** they update the task title or description, **Then** the system persists the changes and returns the updated task.
4. **Given** an authenticated user and an existing task they own, **When** they delete the task, **Then** the system removes the task and confirms deletion.
5. **Given** an authenticated user, **When** they request a specific task by ID that they own, **Then** the system returns that task's details.

---

### User Story 3 - Task Completion Toggle (Priority: P2)

As an authenticated user, I want to toggle the completion status of a task so that I can mark items as done or reopen them.

**Why this priority**: Important for usability but depends on CRUD being functional first.

**Independent Test**: Can be tested by creating a task, toggling its completion, and verifying the status changed.

**Acceptance Scenarios**:

1. **Given** an authenticated user and an incomplete task, **When** they toggle completion, **Then** the task is marked as completed.
2. **Given** an authenticated user and a completed task, **When** they toggle completion, **Then** the task is marked as incomplete.

---

### User Story 4 - JWT Authentication Enforcement (Priority: P1)

As the system, I must verify that every API request to protected endpoints carries a valid JWT token so that only authorized users can access data.

**Why this priority**: Security is non-negotiable. Without authentication, user data is exposed.

**Independent Test**: Can be tested by sending requests with missing, invalid, and valid tokens and verifying correct acceptance/rejection.

**Acceptance Scenarios**:

1. **Given** a request without an Authorization header, **When** it reaches a protected endpoint, **Then** the system responds with 401 Unauthorized.
2. **Given** a request with an invalid or expired JWT, **When** it reaches a protected endpoint, **Then** the system responds with 401 Unauthorized.
3. **Given** a request with a valid JWT, **When** it reaches a protected endpoint, **Then** the system extracts the user identity and processes the request.

---

### User Story 5 - User Isolation (Priority: P1)

As the system, I must ensure that users can only access their own tasks so that no cross-user data leakage occurs.

**Why this priority**: Data privacy is non-negotiable in a multi-user SaaS application.

**Independent Test**: Can be tested by creating tasks as User A, then attempting to access them as User B and verifying rejection.

**Acceptance Scenarios**:

1. **Given** User A is authenticated and requests User B's tasks via the URL, **When** the JWT user ID does not match the URL user ID, **Then** the system responds with 403 Forbidden.
2. **Given** User A is authenticated, **When** they query tasks, **Then** every returned task has `user_id` matching User A's ID.
3. **Given** User A is authenticated and tries to update/delete a task owned by User B, **When** the system checks ownership, **Then** the request is rejected with 403 Forbidden.

---

### User Story 6 - Input Validation and Error Handling (Priority: P2)

As the system, I must validate all incoming data and return structured error responses so that clients receive clear feedback on what went wrong.

**Why this priority**: Prevents bad data from entering the system and provides a clean integration experience for the frontend.

**Independent Test**: Can be tested by sending malformed requests and verifying structured error responses.

**Acceptance Scenarios**:

1. **Given** a request to create a task without a title, **When** the system validates the input, **Then** it responds with 400 Bad Request and a descriptive error message.
2. **Given** a request to access a non-existent task, **When** the system looks it up, **Then** it responds with 404 Not Found.
3. **Given** an internal server error occurs, **When** the system catches it, **Then** it responds with 500 Internal Server Error without exposing stack traces or internal details.

---

### Edge Cases

- What happens when a task title exceeds 255 characters?
- How does the system handle concurrent updates to the same task?
- What happens when the database connection is unavailable?
- How does the system handle a JWT that is well-formed but signed with a different secret?
- What happens when a user tries to create a task with an empty string as the title?
- How does the system handle extremely large request payloads?
- What happens when the user ID in the URL path is not a valid format?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST expose a public health check endpoint that returns server availability status.
- **FR-002**: System MUST accept and verify JWT tokens from the Authorization header on all protected endpoints.
- **FR-003**: System MUST extract the authenticated user's identity from the verified JWT token.
- **FR-004**: System MUST reject requests where the URL user ID does not match the JWT user ID with 403 Forbidden.
- **FR-005**: System MUST support creating a task with a required title (max 255 characters) and optional description (max 1000 characters).
- **FR-006**: System MUST support listing all tasks belonging to the authenticated user.
- **FR-007**: System MUST support retrieving a single task by ID, scoped to the authenticated user.
- **FR-008**: System MUST support updating a task's title, description, and/or completion status.
- **FR-009**: System MUST support deleting a task owned by the authenticated user.
- **FR-010**: System MUST support toggling a task's completion status via a dedicated endpoint.
- **FR-011**: System MUST persist all task data to the database with automatic timestamps (created_at, updated_at).
- **FR-012**: System MUST filter all database queries by the authenticated user's ID to enforce data isolation.
- **FR-013**: System MUST return structured JSON error responses with appropriate HTTP status codes (400, 401, 403, 404, 500).
- **FR-014**: System MUST NOT expose internal error details, stack traces, or database information in error responses.
- **FR-015**: System MUST validate all incoming request data against defined schemas before processing.
- **FR-016**: System MUST use an ORM for all database interactions (no raw SQL unless unavoidable).

### Key Entities

- **Task**: A todo item owned by a single user. Attributes: unique identifier, title (required), description (optional), completion status (default: incomplete), creation timestamp, last-updated timestamp, owner user ID.
- **User**: An external entity managed by the authentication provider. The backend only knows about users through their JWT-verified identity (user ID). No user table is managed by the backend.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All six task endpoints (list, create, get, update, delete, toggle-complete) respond correctly for authenticated users within 500ms under normal load.
- **SC-002**: 100% of requests without a valid JWT to protected endpoints are rejected with 401 Unauthorized.
- **SC-003**: 100% of requests where the URL user ID mismatches the JWT user ID are rejected with 403 Forbidden.
- **SC-004**: Users cannot retrieve, modify, or delete tasks belonging to other users under any circumstances.
- **SC-005**: All task data persists correctly across server restarts (database-backed persistence).
- **SC-006**: All error responses follow a consistent JSON structure with appropriate HTTP status codes and no leaked internal details.
- **SC-007**: The health endpoint responds within 100ms confirming backend availability.
- **SC-008**: Frontend can integrate with the backend API without requiring any backend code changes.

## Assumptions

1. The authentication provider (Better Auth) handles user registration, login, and JWT issuance. The backend only verifies tokens.
2. The user table is external and managed by Better Auth. The backend references users only by their JWT-extracted user ID.
3. The database is a managed cloud PostgreSQL instance (Neon Serverless PostgreSQL) accessed via a connection string.
4. The backend is stateless - no server-side sessions. All authentication is token-based.
5. CORS configuration will be needed to allow frontend-backend communication during development.
6. The backend runs on a different port than the frontend during development.

## Dependencies

1. Authentication provider (Better Auth) must be configured and issuing valid JWTs.
2. Neon Serverless PostgreSQL database must be provisioned and accessible.
3. Frontend must send JWT tokens in Authorization headers for protected requests.
4. The BETTER_AUTH_SECRET must be shared between the auth provider and the backend for JWT verification.
