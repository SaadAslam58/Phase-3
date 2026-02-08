---
id: 2
title: Create AI Agents Implementation Plan
stage: plan
date: 2026-02-07
surface: agent
model: claude-opus-4-6
feature: 003-ai-agents-layer
branch: 003-ai-agents-layer
user: pc
command: /sp.plan (manual)
labels: ["ai-agents", "plan", "phase-3", "openai-agents-sdk", "multi-agent"]
links:
  spec: specs/003-ai-agents-layer/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-ai-agents-layer/plan.md
  - specs/003-ai-agents-layer/research.md
  - specs/003-ai-agents-layer/data-model.md
  - specs/003-ai-agents-layer/quickstart.md
  - specs/003-ai-agents-layer/contracts/agent-api.yaml
tests:
  - none
---

## Prompt

write the missing file by analyzing the sp.plan

## Response snapshot

Generated all 5 plan artifacts for 003-ai-agents-layer by analyzing the Phase-2 codebase and the user's architectural input:

1. **plan.md** — Full implementation plan with:
   - Technical context (Python 3.11, FastAPI, OpenAI Agents SDK)
   - Constitution compliance checks (all passing, with function tools vs MCP justified)
   - Multi-agent architecture: Orchestrator → Action/DataInsight/Policy agents via handoff
   - 8 function tools mapped 1-to-1 with task operations
   - Auth flow reusing Phase-2 JWT verification
   - Frontend integration contract (JSON request/response format)
   - Project structure (additive to Phase-2)

2. **research.md** — 7 research decisions with rationale and rejected alternatives:
   - OpenAI Agents SDK over raw API/LangChain
   - Function tools over MCP (justified deviation from constitution)
   - Multi-agent with handoffs over single-agent
   - SQLModel for Conversation/Message persistence
   - Structured outputs via output_type
   - Async execution
   - Plain shadcn/ui over ChatKit

3. **data-model.md** — New Conversation and Message models with indexes and validation rules

4. **contracts/agent-api.yaml** — OpenAPI spec for chat endpoint, conversations, and messages

5. **quickstart.md** — Setup guide with env vars, install steps, usage examples, troubleshooting

## Outcome

- Impact: Complete implementation plan ready for /sp.tasks
- Tests: none (planning phase)
- Files: 5 files created (plan.md, research.md, data-model.md, quickstart.md, contracts/agent-api.yaml)
- Next prompts: /sp.tasks to generate implementation tasks
- Reflection: Analyzed Phase-2 codebase thoroughly (main.py, models.py, db.py, routes/tasks.py, auth/, schemas/, api.ts, sidebar.tsx) to ensure plan is grounded in actual code patterns

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Constitution check - PASS (with justified deviation for function tools vs MCP)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
