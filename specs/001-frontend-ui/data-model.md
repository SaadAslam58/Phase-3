# Data Model: Frontend UI Specification for Todo Application

## Entities

### Task Entity
**Description**: Represents a todo item in the system
**Fields**:
- `id` (string): Unique identifier for the task (UUID format)
- `title` (string): The main title or description of the task (required, max 255 characters)
- `description` (string | null): Optional detailed description of the task (optional, max 1000 characters)
- `status` (string): Current status of the task, one of "todo", "in-progress", or "completed" (default: "todo")
- `createdAt` (Date): Timestamp when the task was created
- `updatedAt` (Date): Timestamp when the task was last updated
- `userId` (string): Foreign key reference to the user who owns the task

**Validation Rules**:
- Title must be provided and not empty
- Status must be one of the allowed values: "todo", "in-progress", "completed"
- A task must belong to exactly one user
- Task cannot be shared between users (enforced by backend)

**State Transitions**:
- "todo" → "in-progress" (when user starts working on task)
- "in-progress" → "completed" (when user marks task as done)
- "completed" → "todo" (when user wants to reopen task)
- "in-progress" → "todo" (when user decides not to proceed)

### User Entity (Reference)
**Description**: Represents an authenticated user of the system
**Fields**:
- `id` (string): Unique identifier for the user (UUID format)
- `email` (string): User's email address (must be unique)
- `name` (string | null): User's display name (optional)
- `createdAt` (Date): Timestamp when the user account was created
- `updatedAt` (Date): Timestamp when the user account was last updated

**Validation Rules**:
- Email must be valid and unique across all users
- At least one of name or email must be present for identification

## Relationships
- One User to Many Tasks (One user can own many tasks, but each task belongs to only one user)
- Tasks are isolated by user ID - users cannot see tasks belonging to other users

## Frontend-Specific Considerations

### UI State Management
- **Loading States**: Display skeletons or spinners when fetching tasks
- **Empty States**: Show clear messaging when user has no tasks
- **Error States**: Display friendly error messages for failed operations
- **Optimistic Updates**: Update UI immediately on actions like marking complete, with potential rollback on failure

### Display Formats
- **Task Title**: Render as-is, truncate if too long with ellipsis
- **Task Description**: Render as-is, with expand/collapse for longer descriptions
- **Status**: Display as color-coded badges (e.g., yellow for "todo", blue for "in-progress", green for "completed")
- **Timestamps**: Format as "relative time" (e.g., "2 hours ago") with hover for exact timestamp

### Sorting & Filtering
- Default sort: By creation date (newest first)
- Filter options: By status, by date range
- Search capability: By title and description

### Validation for Forms
- Task creation/editing form validation:
  - Title must be 1-255 characters
  - Description can be 0-1000 characters
  - Status must be one of allowed values
- Error display: Inline error messages near relevant form fields

## API Interaction Models

### Request Models
**Create Task Request**:
```
{
  title: string,
  description?: string,
  status?: "todo" | "in-progress" | "completed"
}
```

**Update Task Request**:
```
{
  title?: string,
  description?: string,
  status?: "todo" | "in-progress" | "completed"
}
```

### Response Models
**Task Response** (as received from API):
```
{
  id: string,
  title: string,
  description: string | null,
  status: "todo" | "in-progress" | "completed",
  createdAt: string, // ISO date string
  updatedAt: string, // ISO date string
  userId: string
}
```

**Statistics Response**:
```
{
  total: number,
  completed: number,
  pending: number
}
```

## Frontend Component Data Requirements

### Task List Component
- Expects: Array of Task objects
- Provides: Click handlers for edit/delete/complete actions

### Task Form Component
- Expects: Optional Task object (for editing) or null (for creation)
- Provides: Submit handler with Task data

### Stats Summary Component
- Expects: Statistics object with counts
- Provides: Visual representation of task distribution

This data model ensures the frontend properly represents the data structures it will interact with while maintaining the required user isolation and following the specified UI patterns.