# Tasks: AI Agents & Intelligence Layer

**Input**: Design documents from `/specs/003-ai-agents-layer/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in the feature specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/` and `frontend/src/`
- All backend paths relative to repository root (e.g., `backend/models.py`)
- All frontend paths relative to repository root (e.g., `frontend/src/lib/api.ts`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and create directory structure for the AI agents layer

- [x] T001 Add `openai-agents` to `backend/requirements.txt` and install in virtual environment
- [x] T002 [P] Create `backend/agents/__init__.py` empty module file
- [x] T003 [P] Create `backend/tools/__init__.py` empty module file
- [x] T004 [P] Add `OPENAI_API_KEY` placeholder to `backend/.env.example` with comment

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Add Conversation model (id, user_id, title, created_at, updated_at) to `backend/models.py` using SQLModel, following existing Task model pattern
- [x] T006 Add Message model (id, conversation_id, role, content, tool_calls_json, created_at) to `backend/models.py` using SQLModel, following existing Task model pattern
- [x] T007 Create AgentContext dataclass with `user_id: str` and `db_session: Session` fields in `backend/agents/context.py`
- [x] T008 [P] Create chat schemas (ChatRequest with message + conversation_id, ChatResponse with status + conversation_id + response object, ChatErrorResponse) in `backend/schemas/chat.py` using Pydantic BaseModel
- [x] T009 [P] Create conversation schemas (ConversationSummary, MessageResponse) in `backend/schemas/chat.py` for list/detail endpoints
- [x] T010 Create chat router stub with `POST /api/{user_id}/chat` endpoint that returns a placeholder response, using `verify_user_access` dependency from `backend/auth/dependencies.py`, in `backend/routes/chat.py`
- [x] T011 Register chat_router in `backend/main.py` by importing from `backend/routes/chat.py` and adding `app.include_router(chat_router)`

**Checkpoint**: Foundation ready — database models, schemas, agent context, and chat route registered. User story implementation can now begin.

---

## Phase 3: User Story 1 — Natural Language Task Management (Priority: P1) MVP

**Goal**: Users can add, list, update, complete, and delete tasks through natural language commands via the chat interface

**Independent Test**: Send "Add a task to buy groceries" via POST /api/{user_id}/chat and verify a task is created in the database and a confirmation message is returned

### Implementation for User Story 1

- [x] T012 [P] [US1] Implement `add_task` function tool decorated with `@function_tool` that creates a task in DB using SQLModel Session from AgentContext, accepting title and optional description parameters, in `backend/tools/task_tools.py`
- [x] T013 [P] [US1] Implement `list_tasks` function tool decorated with `@function_tool` that queries all tasks for the user from AgentContext.user_id, returning list of task dicts, in `backend/tools/task_tools.py`
- [x] T014 [P] [US1] Implement `get_task` function tool decorated with `@function_tool` that retrieves a single task by task_id scoped to user_id, in `backend/tools/task_tools.py`
- [x] T015 [P] [US1] Implement `update_task` function tool decorated with `@function_tool` that updates task title/description by task_id scoped to user_id, in `backend/tools/task_tools.py`
- [x] T016 [P] [US1] Implement `complete_task` function tool decorated with `@function_tool` that toggles task.completed by task_id scoped to user_id, in `backend/tools/task_tools.py`
- [x] T017 [P] [US1] Implement `delete_task` function tool decorated with `@function_tool` that deletes a task by task_id scoped to user_id, in `backend/tools/task_tools.py`
- [x] T018 [US1] Create `action_agent` using `Agent(name="action_agent", instructions=..., tools=[add_task, list_tasks, get_task, update_task, complete_task, delete_task])` in `backend/ai_agents/action_agent.py`
- [x] T019 [US1] Create `orchestrator_agent` using `Agent(name="orchestrator_agent", instructions=..., handoffs=[handoff(action_agent)])` that parses user intent and delegates to action_agent, in `backend/ai_agents/orchestrator.py`
- [x] T020 [US1] Implement full chat endpoint logic in `backend/routes/chat.py`: load or create Conversation, save user Message, build conversation history from DB, call `await Runner.run(orchestrator_agent, input=message, context=agent_context)`, save assistant Message with tool_calls_json, return ChatResponse
- [x] T021 [P] [US1] Add `sendMessage(message: string, conversationId?: number)` and response types to frontend API client in `frontend/src/lib/api.ts`, following existing `request<T>()` pattern with auth headers
- [x] T022 [US1] Create ChatInterface component with message list display, input field, send button, loading state, and error handling in `frontend/src/components/dashboard/chat-interface.tsx` using existing shadcn/ui components (Card, Input, Button)
- [x] T023 [US1] Create chat page that renders ChatInterface inside DashboardLayout at `frontend/src/app/dashboard/chat/page.tsx`, following existing dashboard page pattern
- [x] T024 [US1] Add "Chat" navigation item with MessageSquare icon to `navItems` array in `frontend/src/components/dashboard/sidebar.tsx`, linking to `/dashboard/chat`

**Checkpoint**: User Story 1 complete — users can manage tasks via natural language through the chat interface. Full round-trip: frontend → chat API → orchestrator → action_agent → function tools → DB → response → frontend.

---

## Phase 4: User Story 2 — Data Insights & Summaries (Priority: P2)

**Goal**: Users can ask analytical questions about their tasks and receive intelligent summaries and statistics

**Independent Test**: Send "How many tasks do I have?" via POST /api/{user_id}/chat and verify an accurate count is returned based on actual DB data

### Implementation for User Story 2

- [ ] T025 [P] [US2] Implement `get_task_stats` function tool decorated with `@function_tool` that returns total, completed, and pending task counts for user_id from AgentContext, in `backend/tools/insight_tools.py`
- [ ] T026 [US2] Create `data_insight_agent` using `Agent(name="data_insight_agent", instructions=..., tools=[list_tasks, get_task_stats])` with instructions for summarization and analytics, in `backend/agents/data_insight_agent.py`
- [ ] T027 [US2] Add `handoff(data_insight_agent)` to orchestrator_agent's handoffs list and update orchestrator instructions to route insight/analytics/summary queries to data_insight_agent, in `backend/agents/orchestrator.py`
- [ ] T028 [P] [US2] Add `GET /api/{user_id}/conversations` endpoint that lists user's conversations ordered by updated_at desc, in `backend/routes/chat.py`
- [ ] T029 [P] [US2] Add `GET /api/{user_id}/conversations/{conversation_id}/messages` endpoint that returns messages for a conversation in chronological order, in `backend/routes/chat.py`
- [ ] T030 [US2] Add `getConversations()` and `getMessages(conversationId)` functions to frontend API client in `frontend/src/lib/api.ts`
- [ ] T031 [US2] Add conversation list sidebar or selector to ChatInterface showing previous conversations with ability to load history, in `frontend/src/components/dashboard/chat-interface.tsx`

**Checkpoint**: User Story 2 complete — users can ask for task insights and summaries. Conversations persist and can be revisited.

---

## Phase 5: User Story 3 — Multi-Step Workflow Orchestration (Priority: P3)

**Goal**: Users can issue compound requests that require multiple sequential operations, and the system orchestrates them correctly

**Independent Test**: Send "Complete all my grocery tasks" and verify the system lists tasks, identifies matching ones, completes each, and reports the aggregate result

### Implementation for User Story 3

- [ ] T032 [US3] Enhance orchestrator_agent instructions in `backend/agents/orchestrator.py` to detect multi-step intents (e.g., "complete all", "delete everything completed") and route appropriately to action_agent with compound instructions
- [ ] T033 [US3] Enhance action_agent instructions in `backend/agents/action_agent.py` to support chaining tool calls (e.g., list_tasks → filter → complete_task for each match) and reporting aggregate results
- [ ] T034 [US3] Add clarification logic to orchestrator_agent in `backend/agents/orchestrator.py` — when intent is ambiguous for destructive multi-step operations, agent asks a clarifying question instead of executing
- [ ] T035 [US3] Update ChatInterface in `frontend/src/components/dashboard/chat-interface.tsx` to display multi-operation results with per-item status (e.g., "Completed 3 tasks: ...")

**Checkpoint**: User Story 3 complete — compound natural language requests are orchestrated across multiple tool calls with clear result reporting.

---

## Phase 6: User Story 4 — Policy Enforcement & Safe Execution (Priority: P4)

**Goal**: All requests are validated against business rules and access constraints before execution, with graceful error handling

**Independent Test**: Attempt to operate on a non-existent task and verify a helpful error message is returned instead of a stack trace

### Implementation for User Story 4

- [ ] T036 [US4] Create `policy_agent` using `Agent(name="policy_agent", instructions=...)` with validation logic that checks user permissions and business rules before destructive actions, in `backend/agents/policy_agent.py`
- [ ] T037 [US4] Add `handoff(policy_agent)` to orchestrator_agent and update instructions to route delete/update requests through policy_agent before action_agent, in `backend/agents/orchestrator.py`
- [ ] T038 [US4] Add try/except error handling around `Runner.run()` call in `backend/routes/chat.py` that catches OpenAI API errors, timeout errors, and DB errors, returning ChatErrorResponse with user-friendly message
- [ ] T039 [US4] Add error display styling to ChatInterface in `frontend/src/components/dashboard/chat-interface.tsx` — show error responses in a distinct visual style (red border or warning icon) without exposing technical details

**Checkpoint**: User Story 4 complete — all operations validated, errors handled gracefully, no stack traces exposed to users.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T040 [P] Add structured logging for agent decisions, tool calls, and failures using Python logging module in `backend/agents/orchestrator.py`
- [ ] T041 [P] Add `OPENAI_API_KEY` presence validation at backend startup in `backend/main.py` lifespan handler, logging a warning if missing
- [ ] T042 Add conversation title auto-generation from first user message (first 50 chars) when creating a new Conversation in `backend/routes/chat.py`
- [ ] T043 Run end-to-end quickstart.md validation: start backend, start frontend, login, navigate to chat, send test messages

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2 — the core MVP
- **US2 (Phase 4)**: Depends on Phase 2 — can run in parallel with US1 if staffed, but recommended after US1
- **US3 (Phase 5)**: Depends on US1 (Phase 3) — extends orchestrator and action_agent built in US1
- **US4 (Phase 6)**: Depends on US1 (Phase 3) — adds policy layer on top of existing agent pipeline
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — no dependencies on other stories
- **US2 (P2)**: Can start after Phase 2 — independent of US1 (adds new agent and tools, doesn't modify US1 code)
- **US3 (P3)**: Depends on US1 — enhances orchestrator and action_agent from US1
- **US4 (P4)**: Depends on US1 — adds policy_agent into agent pipeline from US1

### Within Each User Story

- Tools before agents (agents depend on tools)
- Agents before route logic (route calls agents)
- Backend before frontend (frontend calls backend)
- Core logic before UI integration

### Parallel Opportunities

- T002, T003, T004 can run in parallel (different files)
- T008, T009 can run in parallel (same file but different schemas, or split into tasks)
- T012–T017 can ALL run in parallel (separate function tools, same file but independent functions)
- T021 can run in parallel with T018–T020 (frontend vs backend)
- T025, T028, T029 can run in parallel (different endpoints/tools)
- T040, T041 can run in parallel (different concerns)

---

## Parallel Example: User Story 1

```
# All task tools can be written in parallel (independent functions):
T012: add_task tool
T013: list_tasks tool
T014: get_task tool
T015: update_task tool
T016: complete_task tool
T017: delete_task tool

# Frontend API client can be built in parallel with backend agents:
T021: frontend api.ts (parallel with T018-T020)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T004)
2. Complete Phase 2: Foundational (T005–T011)
3. Complete Phase 3: User Story 1 (T012–T024)
4. **STOP and VALIDATE**: Test US1 end-to-end — send chat messages, verify task CRUD works
5. Deploy/demo if ready

### Incremental Delivery

1. Phase 1 + Phase 2 → Foundation ready
2. Add US1 (Phase 3) → Test independently → **MVP Demo**
3. Add US2 (Phase 4) → Test independently → Insights available
4. Add US3 (Phase 5) → Test independently → Compound requests work
5. Add US4 (Phase 6) → Test independently → Policy enforcement active
6. Phase 7 → Polish → Production ready

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Backend port: 7860 (from frontend api.ts `NEXT_PUBLIC_API_BASE_URL`)
- All new backend code is additive — zero Phase-2 files are deleted or restructured
