# Implementation Plan: AI Chatbot

**Branch**: `ai-chatbot` | **Date**: 2026-02-07 | **Spec**: [link to spec]
**Input**: Feature specification from `/specs/ai-chatbot/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of an AI chatbot that allows users to manage tasks using natural language. The chatbot uses OpenAI Agents SDK for reasoning and MCP tools for task operations, maintaining a stateless architecture that persists all state in the database. The implementation extends Phase-2 functionality without modifying existing code.

## Technical Context

**Language/Version**: Python 3.11, TypeScript/Next.js 14
**Primary Dependencies**: FastAPI, OpenAI Agents SDK, MCP SDK, SQLModel, Neon PostgreSQL, Better Auth, ChatKit
**Storage**: Neon Serverless PostgreSQL (existing from Phase-2 plus new Conversation/Message tables)
**Testing**: pytest, react-testing-library
**Target Platform**: Linux server, web browser
**Project Type**: web (full-stack with separate frontend/backend)
**Performance Goals**: Response times under 3 seconds for chat interactions
**Constraints**: <200ms p95 for database queries, stateless server architecture, secure user isolation
**Scale/Scope**: Individual user conversations, user-scoped task operations

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase-2 Preservation Check
- [X] Confirm no changes to existing Phase-2 frontend structure
- [X] Confirm no changes to existing Phase-2 backend APIs
- [X] Confirm no changes to existing Phase-2 authentication flow
- [X] Confirm no changes to existing Phase-2 database schema
- [X] Confirm no changes to existing Phase-2 task CRUD logic
- [X] Confirm no changes to existing Phase-2 environment variable usage

### Architecture Doctrine Check
- [X] Confirm no server-side session state implementation
- [X] Confirm all state stored in database only
- [X] Confirm AI agents do not access database directly
- [X] Confirm AI agents interact only through MCP tools
- [X] Confirm each request is independent and reproducible

### MCP Tool Authority Check
- [X] Confirm all task operations by AI go through MCP tools
- [X] Confirm MCP tools are stateless
- [X] Confirm MCP tools map 1-to-1 with task operations
- [X] Confirm MCP tools perform no AI reasoning
- [X] Confirm MCP tools persist data via database only

### Chat API Doctrine Check
- [X] Confirm primary chat endpoint follows POST /api/{user_id}/chat pattern
- [X] Confirm stateless per request implementation
- [X] Confirm conversation history fetched from database
- [X] Confirm messages stored before and after agent execution
- [X] Confirm no WebSockets, sessions, or memory in RAM

## Project Structure

### Documentation (this feature)

```text
specs/ai-chatbot/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── task.py          # Existing Phase-2 model (untouched)
│   │   ├── conversation.py  # New: Conversation model
│   │   └── message.py       # New: Message model
│   ├── services/
│   │   ├── auth.py          # Existing Phase-2 auth (untouched)
│   │   └── chat_service.py  # New: Chat business logic
│   ├── api/
│   │   ├── deps.py          # Existing Phase-2 deps (untouched)
│   │   ├── auth.py          # Existing Phase-2 auth (untouched)
│   │   ├── tasks.py         # Existing Phase-2 tasks (untouched)
│   │   └── chat.py          # New: Chat API endpoints
│   ├── mcp/
│   │   ├── server.py        # New: MCP server setup
│   │   └── tools.py         # New: MCP tools (add_task, list_tasks, etc.)
│   └── agents/
│       └── chat_agent.py    # New: OpenAI Agent implementation
└── tests/

frontend/
├── src/
│   ├── components/
│   │   ├── TaskList.tsx     # Existing Phase-2 component (untouched)
│   │   └── ChatInterface.tsx # New: ChatKit integration
│   ├── pages/
│   │   ├── dashboard.tsx    # Existing Phase-2 page (untouched)
│   │   └── chat.tsx         # New: Chat page
│   └── services/
│       └── api.ts           # Existing Phase-2 service (extended with chat API calls)
└── tests/
```

**Structure Decision**: Selected web application structure with separate backend and frontend. The backend extends existing Phase-2 code with new chat functionality while keeping all existing functionality unchanged. The frontend adds new chat UI components while preserving all existing UI elements.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|