# Quickstart Guide: AI Agents & Intelligence Layer

## Prerequisites

- Python 3.11+
- Node.js 18+
- Neon PostgreSQL instance (existing from Phase-2)
- OpenAI API key with access to GPT-4 or newer models

## Environment Configuration

### Backend

Copy and update the backend environment file:

```bash
cd backend
cp .env.example .env
```

Ensure the following variables are set in `backend/.env`:

```env
# Existing Phase-2 variables (already configured)
DATABASE_URL=postgresql://user:pass@host/db
BETTER_AUTH_SECRET=your_secret
CORS_ORIGINS=http://localhost:3000

# New Phase-3 variable
OPENAI_API_KEY=sk-your-openai-api-key
```

### Frontend

No new environment variables needed. The existing `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:7860`) already points to the backend.

## Install Dependencies

### Backend

```bash
cd backend

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install new dependency
pip install openai-agents
# Or update from requirements.txt
pip install -r requirements.txt
```

### Frontend

No new npm packages needed. The chat UI uses existing shadcn/ui components.

## Database Setup

New tables (Conversation, Message) are created automatically when the backend starts via `create_db_and_tables()` in the FastAPI lifespan handler. No manual migration needed.

## Run Services

```bash
# Terminal 1: Start backend
cd backend
uvicorn main:app --reload --port 7860

# Terminal 2: Start frontend
cd frontend
npm run dev
```

## Using the AI Chat

1. Visit http://localhost:3000/login and sign in
2. Navigate to **Chat** in the sidebar (or go to http://localhost:3000/dashboard/chat)
3. Type natural language commands:
   - "Add a task to buy groceries"
   - "Show me my tasks"
   - "Complete the grocery task"
   - "Give me a summary of my tasks"
   - "Delete all completed tasks"

## Testing the API Directly

```bash
# Get a token first (login)
TOKEN=$(curl -s -X POST http://localhost:7860/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' | jq -r .token)

# Send a chat message
curl -X POST http://localhost:7860/api/user-id-here/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"message": "Add a task to buy groceries"}'

# List conversations
curl http://localhost:7860/api/user-id-here/conversations \
  -H "Authorization: Bearer $TOKEN"
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `OPENAI_API_KEY` not set | Add your OpenAI API key to `backend/.env` |
| Agent timeout (>5s) | Check OpenAI API status; verify API key has model access |
| Auth errors on chat endpoint | Ensure JWT token is valid; user_id in URL matches token `sub` claim |
| New tables not created | Restart backend; check `create_db_and_tables()` runs in lifespan |
| Import error for `openai-agents` | Run `pip install openai-agents` in the virtual environment |
