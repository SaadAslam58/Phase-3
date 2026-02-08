# Data Model: AI Chatbot

## New Database Tables

### Conversation Table
- **id**: Integer, Primary Key, Auto-increment
- **user_id**: String, Foreign Key reference to user
- **created_at**: DateTime, Timestamp when conversation started
- **updated_at**: DateTime, Timestamp when last updated
- **title**: String, Optional, auto-generated conversation title based on first message

### Message Table
- **id**: Integer, Primary Key, Auto-increment
- **conversation_id**: Integer, Foreign Key reference to Conversation
- **user_id**: String, Foreign Key reference to user
- **role**: String, Enum('user', 'assistant', 'system'), Indicates message sender
- **content**: Text, The actual message content
- **created_at**: DateTime, Timestamp when message was created
- **tool_calls**: JSON, Optional, stores any tool calls made by the assistant
- **tool_responses**: JSON, Optional, stores responses from tools

## Relationships
- Conversation (1) → Messages (Many): One conversation can have multiple messages
- User (1) → Conversations (Many): One user can have multiple conversations
- User (1) → Messages (Many): One user can send multiple messages

## Existing Models (Unchanged)
- **Task**: All fields and relationships remain exactly as implemented in Phase-2

## Validation Rules
- Conversation.user_id must match authenticated user
- Message.conversation_id must reference existing conversation
- Message.role must be one of the allowed enum values
- Both tables must have proper foreign key constraints
- Created/updated timestamps are automatically managed

## Indexes
- Conversation: Index on user_id for efficient user-based queries
- Message: Index on conversation_id for efficient conversation history retrieval
- Message: Composite index on conversation_id and created_at for chronological ordering