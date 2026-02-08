# Quickstart Guide: AI Chatbot

## Development Setup

1. **Environment Configuration**
   - Copy backend/.env.example to backend/.env
   - Copy frontend/.env.example to frontend/.env
   - Set OPENAI_API_KEY in backend/.env
   - Ensure DATABASE_URL points to your Neon PostgreSQL instance

2. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt

   # Frontend
   cd frontend
   npm install
   ```

3. **Database Setup**
   ```bash
   cd backend
   # Run migrations to create Conversation and Message tables
   python -m src.db.create_tables
   ```

4. **Run Services**
   ```bash
   # Terminal 1: Start backend
   cd backend
   uvicorn src.main:app --reload --port 8000

   # Terminal 2: Start frontend
   cd frontend
   npm run dev
   ```

## Running the AI Chatbot

1. **Access the Chat Interface**
   - Visit http://localhost:3000/chat to access the chat interface
   - Or use the chat button in the existing dashboard

2. **Start a Conversation**
   - Sign in using the existing authentication system
   - Type natural language commands like:
     - "Add a task to buy groceries"
     - "Show me my tasks"
     - "Complete task #1"
     - "Delete the grocery task"

3. **Monitor the Backend**
   - The AI agent will process your commands using MCP tools
   - Database operations will be logged in the backend console

## Testing the API

Use the following cURL command to test the API directly:

```bash
curl -X POST http://localhost:8000/api/user123/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"message": "Add a task to call mom"}'
```

## Troubleshooting

- **Authentication errors**: Ensure your JWT token is valid and includes proper user_id
- **Database connection issues**: Verify your Neon PostgreSQL connection string is correct
- **AI responses taking too long**: Check that your OPENAI_API_KEY is properly set
- **MCP tools not working**: Verify the MCP server is properly initialized in the backend