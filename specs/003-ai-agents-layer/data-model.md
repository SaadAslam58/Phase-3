# Data Model: AI Agents & Intelligence Layer

## Existing Models (Unchanged)

### User (Phase-2)
- **id**: `str`, Primary Key, UUID, auto-generated
- **email**: `str`, Unique, Indexed
- **name**: `Optional[str]`, max 255 chars
- **hashed_password**: `str`
- **created_at**: `datetime`, UTC
- **updated_at**: `datetime`, UTC

### Task (Phase-2)
- **id**: `Optional[int]`, Primary Key, Auto-increment
- **user_id**: `str`, Indexed, references User
- **title**: `str`, max 255 chars
- **description**: `Optional[str]`, max 1000 chars
- **completed**: `bool`, default False
- **created_at**: `datetime`, UTC
- **updated_at**: `datetime`, UTC

## New Models

### Conversation
- **id**: `Optional[int]`, Primary Key, Auto-increment
- **user_id**: `str`, Indexed, references User
- **title**: `Optional[str]`, max 255 chars, auto-generated from first message
- **created_at**: `datetime`, UTC, auto-set
- **updated_at**: `datetime`, UTC, auto-set

### Message
- **id**: `Optional[int]`, Primary Key, Auto-increment
- **conversation_id**: `int`, Indexed, references Conversation
- **role**: `str`, one of `"user"`, `"assistant"`, `"system"`
- **content**: `str`, the message text
- **tool_calls_json**: `Optional[str]`, JSON-serialized list of tool calls made (for assistant messages)
- **created_at**: `datetime`, UTC, auto-set

## Relationships

- **User (1) → Conversations (Many)**: One user has many conversations. Scoped by `user_id`.
- **Conversation (1) → Messages (Many)**: One conversation has many messages. Ordered by `created_at`.
- **User (1) → Tasks (Many)**: Existing Phase-2 relationship (unchanged).

## Indexes

| Table | Column(s) | Purpose |
|-------|-----------|---------|
| Conversation | `user_id` | Efficient lookup of user's conversations |
| Message | `conversation_id` | Efficient retrieval of conversation messages |
| Message | `conversation_id, created_at` | Chronological ordering within conversation |

## Validation Rules

- `Conversation.user_id` must match the authenticated user's ID
- `Message.conversation_id` must reference an existing Conversation owned by the same user
- `Message.role` must be one of the allowed values (`user`, `assistant`, `system`)
- `Message.content` must not be empty
- Timestamps are auto-managed (never set by client)

## Schema Notes

- New models are added to the existing `backend/models.py` file, alongside User and Task
- `create_db_and_tables()` in the FastAPI lifespan handler will auto-create the new tables
- No migrations needed — SQLModel's `metadata.create_all()` is additive (creates missing tables, does not alter existing ones)
- `tool_calls_json` stores serialized JSON as a string column (avoids JSON column type for PostgreSQL compatibility simplicity)
