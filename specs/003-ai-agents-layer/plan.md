# Implementation Plan: AI Agents & Intelligence Layer

**Branch**: `003-ai-agents-layer` | **Date**: 2026-02-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-ai-agents-layer/spec.md`

## Summary

Implementation of an AI intelligence layer that enables users to manage tasks via natural language. The system uses the OpenAI Agents SDK with a multi-agent architecture: an Orchestrator Agent delegates to specialized agents (Action, Data Insight, Policy) which execute operations through backend function tools. The architecture is stateless per-request, persists conversation history in the database, and extends Phase-2 without modifying any existing code.

## Technical Context

**Language/Version**: Python 3.11, TypeScript/Next.js 16
**Primary Dependencies**: FastAPI, OpenAI Agents SDK (`openai-agents`), SQLModel, Neon PostgreSQL, Better Auth (existing)
**Storage**: Neon Serverless PostgreSQL (existing Phase-2 tables unchanged; new Conversation + Message tables added)
**Testing**: pytest (backend), manual integration testing
**Target Platform**: Linux server, web browser
**Project Type**: web (full-stack with separate frontend/backend)
**Performance Goals**: Response times under 5 seconds for single-operation chat requests
**Constraints**: Stateless server architecture, secure user isolation, agents never access DB directly, tool-based execution only (no raw chat completions)
**Scale/Scope**: Individual user conversations, user-scoped task operations

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase-2 Preservation Check
- [x] Confirm no changes to existing Phase-2 frontend structure
- [x] Confirm no changes to existing Phase-2 backend APIs
- [x] Confirm no changes to existing Phase-2 authentication flow
- [x] Confirm no changes to existing Phase-2 database schema
- [x] Confirm no changes to existing Phase-2 task CRUD logic
- [x] Confirm no changes to existing Phase-2 environment variable usage

### Architecture Doctrine Check
- [x] Confirm no server-side session state implementation
- [x] Confirm all state stored in database only
- [x] Confirm AI agents do not access database directly
- [x] Confirm AI agents interact only through function tools
- [x] Confirm each request is independent and reproducible

### Tool Authority Check
- [x] Confirm all task operations by AI go through function tools
- [x] Confirm tools are stateless
- [x] Confirm tools map 1-to-1 with task operations
- [x] Confirm tools perform no AI reasoning
- [x] Confirm tools persist data via database only

### Chat API Doctrine Check
- [x] Confirm primary chat endpoint follows POST /api/{user_id}/chat pattern
- [x] Confirm stateless per request implementation
- [x] Confirm conversation history fetched from database
- [x] Confirm messages stored before and after agent execution
- [x] Confirm no WebSockets, sessions, or memory in RAM

## Phase 0: Research Decisions

See [research.md](./research.md) for full details. Key decisions:

1. **OpenAI Agents SDK** (`openai-agents`) for agent orchestration — uses `Agent`, `Runner`, `@function_tool`, `handoff()`
2. **Function tools** (not MCP) for tool execution — simpler, in-process, same security guarantees
3. **Multi-agent architecture** — Orchestrator delegates to Action, Data Insight, and Policy agents via handoff
4. **SQLModel** for new Conversation/Message models — consistent with Phase-2 pattern
5. **Structured outputs** via `output_type` on Agent for typed JSON responses
6. **Async execution** — agents run async; FastAPI endpoint uses `async def`

## Phase 1: Design

See [data-model.md](./data-model.md) for entity design.
See [contracts/agent-api.yaml](./contracts/agent-api.yaml) for API contract.
See [quickstart.md](./quickstart.md) for setup guide.

### Agent Architecture

```
Frontend (chat UI)
    ↓ POST /api/{user_id}/chat
Backend (FastAPI)
    ↓ chat_router → chat_service
Agent Orchestrator (orchestrator_agent)
    ↓ handoff()
Specialized Agents:
    ├── action_agent → function tools → DB (via SQLModel)
    ├── data_insight_agent → function tools → DB (read-only)
    └── policy_agent → validation logic (no DB)
    ↓
Structured Response → Frontend
```

### Agent Definitions

| Agent | Name | Purpose | Tools |
|-------|------|---------|-------|
| Orchestrator | `orchestrator_agent` | Parse intent, delegate to specialists, aggregate responses | handoffs to other agents |
| Action | `action_agent` | Execute task CRUD operations | `add_task`, `list_tasks`, `get_task`, `update_task`, `complete_task`, `delete_task` |
| Data Insight | `data_insight_agent` | Summaries, statistics, analytics | `list_tasks`, `get_task_stats` |
| Policy | `policy_agent` | Validate permissions, enforce rules | `validate_user_access` |

### Tool Definitions (Backend Function Tools)

All tools receive `ctx: RunContextWrapper[AgentContext]` for user_id and session access.

| Tool | Input | Output | Maps to |
|------|-------|--------|---------|
| `add_task` | title, description? | TaskResponse | `POST /api/{user_id}/tasks` logic |
| `list_tasks` | (none) | list[TaskResponse] | `GET /api/{user_id}/tasks` logic |
| `get_task` | task_id | TaskResponse | `GET /api/{user_id}/tasks/{id}` logic |
| `update_task` | task_id, title?, description? | TaskResponse | `PUT /api/{user_id}/tasks/{id}` logic |
| `complete_task` | task_id | TaskResponse | `PATCH /api/{user_id}/tasks/{id}/complete` logic |
| `delete_task` | task_id | SuccessResponse | `DELETE /api/{user_id}/tasks/{id}` logic |
| `get_task_stats` | (none) | StatsResponse | Computed from list_tasks |
| `validate_user_access` | user_id | bool | Auth check |

### Auth Flow (Chat Endpoint)

1. Frontend sends `POST /api/{user_id}/chat` with `Authorization: Bearer <jwt>`
2. `verify_user_access` dependency validates JWT and user_id match (reuses Phase-2 auth)
3. `user_id` passed into agent context (`AgentContext` dataclass)
4. Tools receive user_id from context — no user_id in tool parameters
5. All DB queries scoped to `user_id` (same as Phase-2 task routes)

### Frontend Integration

The frontend sends:
```json
{
  "message": "User input text",
  "conversation_id": null
}
```

The backend returns:
```json
{
  "status": "success",
  "conversation_id": 123,
  "response": {
    "type": "text",
    "content": "I've added 'buy groceries' to your tasks.",
    "meta": {
      "tool_calls": [{"name": "add_task", "result": {"id": 1, "title": "buy groceries"}}]
    }
  }
}
```

Frontend displays `response.content` as the assistant message. The `meta.tool_calls` field is optional for debugging/transparency.

## Project Structure

### Documentation (this feature)

```text
specs/003-ai-agents-layer/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── agent-api.yaml   # Chat API OpenAPI spec
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
backend/
├── main.py                    # Existing (add chat_router import)
├── models.py                  # Existing (add Conversation, Message models)
├── db.py                      # Existing (unchanged)
├── requirements.txt           # Existing (add openai-agents)
├── auth/                      # Existing (unchanged)
│   ├── __init__.py
│   ├── jwt.py
│   └── dependencies.py
├── routes/                    # Existing dir
│   ├── __init__.py
│   ├── health.py              # Existing (unchanged)
│   ├── auth.py                # Existing (unchanged)
│   ├── tasks.py               # Existing (unchanged)
│   └── chat.py                # NEW: Chat API endpoint
├── schemas/                   # Existing dir
│   ├── __init__.py
│   ├── task.py                # Existing (unchanged)
│   └── chat.py                # NEW: Chat request/response schemas
├── agents/                    # NEW: Agent layer
│   ├── __init__.py
│   ├── context.py             # NEW: AgentContext dataclass
│   ├── orchestrator.py        # NEW: Orchestrator agent
│   ├── action_agent.py        # NEW: Action execution agent
│   ├── data_insight_agent.py  # NEW: Data insight agent
│   └── policy_agent.py        # NEW: Validation & policy agent
└── tools/                     # NEW: Function tools
    ├── __init__.py
    ├── task_tools.py           # NEW: Task CRUD tools
    └── insight_tools.py        # NEW: Stats/summary tools

frontend/
├── src/
│   ├── app/
│   │   └── dashboard/
│   │       └── chat/
│   │           └── page.tsx    # NEW: Chat page
│   ├── components/
│   │   └── dashboard/
│   │       ├── sidebar.tsx     # Existing (add Chat nav item)
│   │       └── chat-interface.tsx # NEW: Chat UI component
│   └── lib/
│       └── api.ts              # Existing (add chat API calls)
└── package.json                # Existing (unchanged - no new deps needed)
```

**Structure Decision**: Web application structure extending Phase-2 backend/ and frontend/ directories. All Phase-2 files remain unchanged. New files are additive only. Backend gains `agents/` and `tools/` directories. Frontend gains one new page and one new component.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Function tools instead of MCP tools | OpenAI Agents SDK `@function_tool` provides same isolation guarantees (agents never touch DB directly, tools are stateless functions). User explicitly requires Agents SDK with `Agent, Runner, tool, handoff`. | MCP adds subprocess overhead and protocol complexity for no additional security benefit in a single-process backend. Tools still map 1-to-1 with operations and are stateless. |
