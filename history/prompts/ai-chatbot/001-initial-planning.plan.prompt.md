---
id: 001
title: Initial Planning
stage: plan
date: 2026-02-07
surface: agent
model: Claude Sonnet 4.5
feature: ai-chatbot
branch: ai-chatbot
user: pc
command: sp.plan
labels: ["planning", "architecture", "ai", "mcp", "chatbot"]
links:
  spec: specs/ai-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/ai-chatbot/spec.md
 - specs/ai-chatbot/plan.md
 - specs/ai-chatbot/research.md
 - specs/ai-chatbot/data-model.md
 - specs/ai-chatbot/contracts/chat-api.yaml
 - specs/ai-chatbot/quickstart.md
tests:
 - null
---

## Prompt

```
sp.plan

Hackathon-2 — Phase-3
AI Chatbot Extension (ChatKit + OpenAI Agents SDK + MCP)
Frontend & Backend (Additive Only)

1. Authority & Scope

This sp.plan is governed by:

Phase-3 project documentation

Phase-3 sp.constitution

Spec-Kit discipline

Phase-2 frontend and backend code is already copied into Phase-3 and must remain unchanged unless explicitly stated.

This plan adds chatbot functionality only.

2. Core Architectural Principle

Phase-3 introduces an AI Chatbot that:

Uses OpenAI Agents SDK for reasoning

Uses MCP tools for task operations

Is stateless at the server level

Persists all state in the database

Integrates cleanly with Phase-2 auth and tasks

3. Environment Configuration (Corrected & Minimal)
3.1 Backend Environment (backend/.env.example)
ENV=development

DATABASE_URL=postgresql://<neon-connection-string>

OPENAI_API_KEY=your_openai_api_key_here

BETTER_AUTH_SECRET=existing_secret_from_phase_2
BETTER_AUTH_URL=http://localhost:3000


Rules:

OPENAI_API_KEY is used only by backend

No OpenAI keys in frontend

No ChatKit-specific secrets required

Phase-2 env variables remain valid

3.2 Frontend Environment (frontend/.env.example)
NEXT_PUBLIC_API_URL=http://localhost:8000


Rules:

ChatKit does not require an OpenAI key in frontend

Frontend communicates only with backend /api/chat

No OpenAI SDK usage in frontend

4. Backend – Database Layer (Additive Only)
4.1 Existing Phase-2 Models

Task model remains unchanged

Task ownership logic remains unchanged

4.2 New Chat Models

Add the following SQLModel tables:

Conversation

id (int, PK)

user_id (string)

created_at

updated_at

Message

id (int, PK)

conversation_id (FK)

user_id (string)

role (user | assistant)

content (text)

created_at

Rules:

No memory-based conversation storage

Database is the single source of truth

Neon PostgreSQL only

5. MCP Server (Backend)
5.1 MCP Server Setup

Use the Official MCP SDK

MCP server lives inside the FastAPI backend

MCP tools are stateless

MCP tools do not know about chat context

5.2 MCP Tool Definitions (Exact)

Implement the following tools exactly as specified:

add_task

list_tasks

update_task

complete_task

delete_task

Rules:

Tools receive user_id

Tools validate task ownership

Tools return structured data only

Tools never generate natural language responses

6. AI Agent (OpenAI Agents SDK – Modern API)
6.1 Agent Construction

Use OpenAI Agents SDK

Do not use legacy openai.ChatCompletion

Create:

Agent

Runner

Tool registry (MCP)

Agent responsibilities:

Interpret natural language

Decide which MCP tool(s) to call

Chain tools when required

Produce friendly confirmations

6.2 Agent Behavior Rules

Agent must:

Ask MCP tools to act

Confirm actions clearly

Handle missing tasks gracefully

Use conversation history from DB

Agent must NOT:

Access DB directly

Store memory in variables

Assume state without tools

7. Chat API Endpoint (Stateless)
7.1 Endpoint
POST /api/{user_id}/chat

7.2 Stateless Request Cycle (Mandatory)

Every request follows this exact flow:

Authenticate user (reuse Phase-2 auth)

Load conversation history from DB (if exists)

Persist incoming user message

Build agent input (history + message)

Run agent with MCP tools

Capture tool calls

Persist assistant response

Return response payload

Server holds zero memory between requests.

8. Frontend – Chat UI (ChatKit Correct Usage)
8.1 Role of ChatKit

ChatKit is used as a UI abstraction only:

Message list

Input box

Typing UX

Message rendering

ChatKit does not:

Call OpenAI directly

Hold secrets

Run agents

8.2 Frontend Chat Flow

User types message

Frontend sends POST to /api/{user_id}/chat

Backend returns AI response

Frontend renders messages via ChatKit components

Conversation continues via conversation_id

All intelligence lives on the backend.

9. Authentication Alignment

Phase-2 Better Auth remains unchanged

Backend validates JWT

user_id is trusted server-side

Chat endpoint is protected

All tools are user-scoped

10. Error Handling Rules

Must handle:

Task not found

Invali
```

## Response snapshot

Successfully created the initial planning documents for the AI Chatbot feature in Phase-3. The planning includes:

1. **Specification** (spec.md) - Detailed user stories, requirements, and success criteria aligned with the constitution
2. **Implementation Plan** (plan.md) - Architecture overview, constitution compliance checks, and project structure
3. **Research** (research.md) - Technical decisions on key implementation approaches
4. **Data Model** (data-model.md) - Database schema for Conversation and Message entities
5. **API Contracts** (contracts/chat-api.yaml) - OpenAPI specification for the chat endpoint
6. **Quickstart Guide** (quickstart.md) - Step-by-step setup and usage instructions

All documents comply with the Phase-3 constitution, preserving Phase-2 functionality while extending it with the AI chatbot capabilities through MCP tools. The architecture is stateless, with all state persisted in the database, and maintains user authentication through the existing Better Auth system.

## Outcome

- ✅ Impact: High - Established complete planning foundation for AI chatbot implementation
- 🧪 Tests: No tests required for planning phase
- 📁 Files: Created 6 planning artifacts in specs/ai-chatbot/
- 🔁 Next prompts: Generate tasks based on this plan for implementation
- 🧠 Reflection: Planning thoroughly addresses all constitutional requirements and establishes clear implementation path

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Create implementation tasks based on this plan