<!--
Sync Impact Report:
- Version change: N/A (initial version) → 1.0.0
- Added sections: All principles from user input
- Templates requiring updates: N/A
- No existing constitution to compare against
-->

# Hackathon-2 – Phase-3 Constitution

## Core Principles

### Authority & Supremacy
This constitution is the highest governing document for Hackathon-2 Phase-3. It supersedes all ad-hoc instructions, all undocumented assumptions, and any AI-generated code that violates it. All specifications, plans, tasks, and implementations must comply with this constitution. Violation of this constitution invalidates the implementation.

### Phase-2 Preservation Principle (Critical)
Phase-3 is NOT a rewrite. Everything from Phase-2 remains intact, unchanged, and authoritative, including frontend structure, backend APIs, authentication flow, database schema, task CRUD logic, environment variable usage, and folder hierarchy. Refactoring Phase-2 code, renaming Phase-2 routes or models, replacing existing UI or APIs, and changing auth behavior are explicitly forbidden. Phase-3 extends Phase-2 — it does not modify it.

### Phase-3 Purpose
Phase-3 introduces an AI-powered chatbot that allows users to manage todos using natural language. The chatbot operates on top of existing Phase-2 functionality, uses AI agents and MCP tools, does not duplicate task logic, and does not replace UI-based task management. Phase-2 UI and APIs must continue to work independently of the chatbot.

### Architectural Doctrine (Non-Negotiable)
Phase-3 architecture is stateless and tool-driven. Core principles include: no server-side session state, all state stored in the database, AI agents never touch the database directly, AI agents interact only through MCP tools, and each request is independent and reproducible.

### Approved Technology Stack
Frontend uses existing Phase-2 frontend (unchanged) with OpenAI ChatKit added. Chat UI is additive only. Backend uses Python FastAPI (existing), OpenAI Agents SDK, Official MCP SDK, SQLModel ORM, and Neon Serverless PostgreSQL. Authentication uses Better Auth (Phase-2 authority) with no new auth system introduced.

### Folder & Project Structure Authority
Phase-3 folder is created by copying Phase-2 entirely. Phase-3 additions must be clearly additive, isolated, and non-breaking. The structure follows: Hackathon-2/Phase-2/ (original, untouched), Hackathon-2/Phase-3/ (copied from Phase-2 with additions).

### AI Chatbot Scope
The chatbot must support Basic Level functionality only: Add task, List tasks, Update task, Complete task, Delete task. The chatbot must not introduce new task concepts, modify task schema, bypass validation rules, or invent features not present in Phase-2.

### MCP Tool Authority
All task operations performed by AI must go through MCP tools. MCP tools are stateless, map 1-to-1 with task operations, perform no AI reasoning, and persist data via database only. Direct DB access by agents is forbidden.

### Chat API Doctrine
There must be one primary chat endpoint: POST /api/{user_id}/chat. Rules: Stateless per request, conversation history is fetched from DB, messages are stored before and after agent execution, tool calls are surfaced in the response, No WebSockets, No sessions, No memory in RAM.

### Conversation Persistence Rule
Conversation continuity is achieved only via database storage. Required models: Conversation, Message, Task (existing Phase-2 model). Server restarts must not affect conversations.

### AI Agent Behavior Doctrine
AI agents must use MCP tools for all task actions, confirm actions in natural language, handle errors gracefully, never hallucinate task state, and chain tools when required (e.g., list → delete). Agents must be deterministic and auditable.

### Frontend Integration Doctrine
Chat UI is additive, not replacing existing UI, lives alongside Phase-2 dashboard, does not redesign existing pages, uses ChatKit only for chat. Task UI remains Phase-2 authoritative.

### Environment Configuration Authority
Environment variables: Phase-2 env remains valid. Phase-3 adds only what is required for AI/chat. Secrets are never exposed to frontend and are managed via backend env files.

### Development Discipline (Standardized)
All development follows the SDD methodology with strict adherence to specifications, plans, and tasks. Every change must have a corresponding task, and all implementation must follow the red-green-refactor cycle.

## Additional Constraints

Technology Stack Requirements:
- Frontend: Next.js 14+, TypeScript, Tailwind CSS, OpenAI ChatKit
- Backend: Python 3.11+, FastAPI, SQLModel, Neon PostgreSQL
- AI/MCP: OpenAI Agents SDK, MCP Specification 1.0+
- Authentication: Better Auth v1.x

Security Standards:
- No direct database access by AI agents
- Environment variables for all secrets
- JWT-based authentication maintained
- Input validation on all endpoints
- Rate limiting on API endpoints

Performance Standards:
- Statelessness required for scalability
- Database queries optimized
- Caching implemented where appropriate
- Response times under 5 seconds for all operations

## Development Workflow

Specification Process:
- All features must have a spec.md file
- Specifications must align with Phase-2 functionality
- User stories clearly defined before implementation
- Acceptance criteria specified for each feature

Planning Process:
- Architectural decisions documented in plan.md
- Task breakdown follows tasks.md format
- Dependencies explicitly identified
- Risk assessment included in planning

Task Management:
- Tasks must be testable and verifiable
- Each task addresses a single responsibility
- Tasks must have clear acceptance criteria
- Unit and integration tests required for all code

Quality Assurance:
- Code reviews required for all PRs
- Automated testing must pass before merging
- Static analysis tools configured and passing
- Security scanning integrated into pipeline

## Governance

This constitution is the highest authority for the Hackathon-2 Phase-3 project. All team members must adhere to these principles. Changes to this constitution require explicit approval from project leadership and must follow the established amendment procedure. All implementations, specifications, and designs must be validated against these principles. Compliance is verified through code reviews, automated checks, and manual audits.

Amendment Process:
1. Proposed changes must be documented with rationale
2. Team review and discussion required
3. Approval from project leadership needed
4. Updated constitution must be communicated to all team members
5. Dependent artifacts must be updated accordingly

Versioning Policy:
- Major version increments for fundamental principle changes
- Minor version increments for addition of new principles
- Patch version increments for clarifications and corrections

Compliance Review:
- Regular reviews to ensure adherence to principles
- Quarterly assessment of constitution effectiveness
- Feedback loop for continuous improvement
- Enforcement mechanisms for violations

**Version**: 1.0.0 | **Ratified**: 2026-02-07 | **Last Amended**: 2026-02-07