# Data Model: Backend API for Todo Application

## Entities

### Task Entity
**Description**: Represents a todo item owned by a single user
**Table name**: `tasks`

**Fields**:
- `id` (int): Primary key, auto-incrementing
- `user_id` (string): Foreign reference to the user who owns the task (indexed, required). Sourced from JWT `sub` claim.
- `title` (string): The main title of the task (required, max 255 characters)
- `description` (text | null): Optional detailed description (max 1000 characters)
- `completed` (boolean): Whether the task is completed (default: false)
- `created_at` (datetime): Timestamp when the task was created (auto-set)
- `updated_at` (datetime): Timestamp when the task was last modified (auto-updated)

**Validation Rules**:
- Title must be provided and not empty (1-255 characters)
- Description is optional (0-1000 characters)
- Completed must be a boolean
- user_id must be a non-empty string
- All queries must filter by `user_id == authenticated_user_id`

**Indexes**:
- Primary key on `id`
- Index on `user_id` for fast user-scoped queries

### User Entity (External Reference)
**Description**: Users are managed by Better Auth. The backend only knows users through their JWT-verified identity.
**Not stored in backend database**. Referenced only by `user_id` string from JWT `sub` claim.

## Relationships
- One User (external) → Many Tasks
- Tasks are strictly isolated by `user_id`
- No cross-user access permitted

## State Transitions
- Task creation: `completed = false` (default)
- Toggle completion: `completed` flips between `true` and `false`
- No intermediate states (unlike frontend's todo/in-progress/completed model)

## Frontend Compatibility Note
The frontend spec uses a `status` field with values `"todo" | "in-progress" | "completed"`. The backend spec uses a `completed` boolean. The API response schemas should map `completed: true` → user-facing completed status, and `completed: false` → user-facing todo status. The frontend adapter (lib/api.ts) handles this mapping.
