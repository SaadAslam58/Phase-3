# Research: AI Agents & Intelligence Layer

## Decision 1: OpenAI Agents SDK for Agent Orchestration

**Rationale**: The OpenAI Agents SDK (`openai-agents` package) provides a modern, first-party framework for building multi-agent systems with built-in tool calling, structured outputs, and agent handoffs. It replaces the need for raw `openai.chat.completions.create` calls or third-party orchestration frameworks.

**Key APIs used**:
- `Agent(name, instructions, tools, handoffs, output_type)` — define agents
- `Runner.run(agent, input, context)` — async execution
- `@function_tool` — decorator to register Python functions as agent tools
- `handoff(agent)` — delegate to another agent
- `RunContextWrapper[T]` — typed context passed to tools

**Alternatives rejected**:
- **Raw OpenAI API** (`openai.chat.completions.create`): No built-in tool orchestration, manual message management, no agent abstraction. Explicitly forbidden by user requirements.
- **LangChain**: Heavy dependency, opinionated abstractions, not aligned with OpenAI's official SDK direction.
- **Custom framework**: Unnecessary when OpenAI provides official SDK with exact features needed.

**Package**: `openai-agents>=0.1.0` (pip install openai-agents)

## Decision 2: Function Tools over MCP Tools

**Rationale**: The OpenAI Agents SDK supports multiple tool types: function tools (`@function_tool`), MCP tools, and code interpreter. Function tools are Python functions running in-process, providing the simplest integration with the existing FastAPI backend. They satisfy the constitution's intent (agents interact through tools, never touch DB directly) without the overhead of an MCP subprocess.

**Key design rules**:
- Tools are stateless Python functions
- Tools receive user context via `RunContextWrapper[AgentContext]`
- Tools use SQLModel `Session` for DB access (same pattern as Phase-2 routes)
- Tools return typed JSON (Pydantic models)
- Tools handle no AI reasoning — pure CRUD/query operations

**Alternatives rejected**:
- **MCP Server**: Requires subprocess management, stdio/SSE transport, protocol overhead. No additional security benefit when tools run in the same trusted backend process. Constitution's tool requirements are met by function tools.
- **Direct HTTP calls to own API**: Unnecessary network round-trip to call own endpoints. Tools can share the same DB session logic directly.

## Decision 3: Multi-Agent Architecture with Handoffs

**Rationale**: A multi-agent approach separates concerns cleanly:
- **Orchestrator**: Understanding intent, routing to specialists
- **Action Agent**: CRUD operations (write-path, potentially destructive)
- **Data Insight Agent**: Read-only analytics and summaries
- **Policy Agent**: Pre-execution validation for destructive actions

The Orchestrator uses `handoff()` to delegate, which transfers control entirely to the specialist agent. This ensures each agent has focused instructions and tools.

**Alternatives rejected**:
- **Single agent with all tools**: Simpler but mixes concerns. A single agent with 8+ tools and complex instructions is harder to maintain and more prone to incorrect tool selection.
- **Pipeline/chain pattern**: Too rigid. Handoffs allow dynamic routing based on user intent.

## Decision 4: Conversation Persistence via SQLModel

**Rationale**: New `Conversation` and `Message` SQLModel tables store chat history in the same Neon PostgreSQL database used by Phase-2. This ensures:
- Conversation continuity across requests (stateless server)
- Conversation survival across server restarts
- Consistent ORM pattern with existing Task/User models
- No new database infrastructure needed

**Schema approach**: Add models to existing `models.py` file. SQLModel's `create_db_and_tables()` in the lifespan handler will auto-create new tables without affecting existing ones.

**Alternatives rejected**:
- **Redis/in-memory**: Violates stateless architecture. Lost on restart.
- **Separate database**: Unnecessary complexity. Same PostgreSQL instance handles all models.
- **Browser localStorage**: Not accessible by backend agents. No server-side continuity.

## Decision 5: Structured Agent Outputs

**Rationale**: Using the `output_type` parameter on `Agent` forces the LLM to return a Pydantic model, ensuring the response is always valid JSON matching the expected schema. This eliminates parsing errors and provides type safety.

**Output model** (`ChatOutput`):
```python
class ChatOutput(BaseModel):
    type: Literal["text", "action", "insight"]
    content: str
    tool_calls: list[ToolCallRecord] = []
```

**Alternatives rejected**:
- **Unstructured text**: Requires parsing, unreliable format, no type safety.
- **JSON mode**: Less strict than structured outputs. No Pydantic validation.

## Decision 6: Async Agent Execution

**Rationale**: The OpenAI Agents SDK's `Runner.run()` is async. FastAPI natively supports `async def` endpoints. Using async execution ensures the event loop isn't blocked during AI inference (which can take 1-5 seconds).

**Pattern**: `chat_router` endpoint is `async def`, calls `await Runner.run(orchestrator_agent, ...)`.

**Alternatives rejected**:
- **Sync execution** (`Runner.run_sync()`): Blocks the FastAPI worker thread during AI inference, reducing concurrency.

## Decision 7: Frontend Chat Integration

**Rationale**: Add a `/dashboard/chat` page using existing shadcn/ui components (Card, Input, Button). No new npm dependencies needed — the chat UI is a simple message list + input form, built with components already available in the project.

**Integration points**:
- New nav item "Chat" added to `sidebar.tsx` (additive, uses existing `navItems` array pattern)
- New `api.sendMessage()` function added to `api.ts` (follows existing `request<T>()` pattern)
- New `chat-interface.tsx` component for the chat UI
- New `page.tsx` at `app/dashboard/chat/`

**Alternatives rejected**:
- **ChatKit (@openai/chat-components)**: Already in package.json but user explicitly excludes ChatKit assumptions. Using plain shadcn/ui components keeps the frontend consistent with Phase-2.
- **Separate chat app**: Violates Phase-2 preservation. Chat lives within existing dashboard.
