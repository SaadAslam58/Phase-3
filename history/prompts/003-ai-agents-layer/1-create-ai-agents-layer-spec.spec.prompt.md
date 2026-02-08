---
id: 1
title: Create AI Agents Layer Specification
stage: spec
date: 2026-02-07
surface: agent
model: claude-opus-4-6
feature: 003-ai-agents-layer
branch: 003-ai-agents-layer
user: pc
command: /sp.specify
labels: ["ai-agents", "specification", "phase-3", "openai-agents-sdk"]
links:
  spec: specs/003-ai-agents-layer/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-ai-agents-layer/spec.md
  - specs/003-ai-agents-layer/checklists/requirements.md
tests:
  - none
---

## Prompt

AI Agents & Intelligence Layer

1. Purpose of Phase-3

Phase-3 extends the existing Phase-2 full-stack system by adding:

AI-powered agents using OpenAI Agents SDK (modern approach)

Natural language interaction layer

Business logic orchestration via agents

Zero UI rewrites (frontend already exists)

Zero auth rewrites (Better Auth already exists)

Phase-3 does not replace Phase-2.
It augments it with intelligence.

2. Scope Definition
INCLUDED

AI agents built using OpenAI Agents SDK

Agent-to-backend integration

Agent-to-database read/write via backend APIs

Structured responses compatible with frontend UI

Tool-based agent execution (NOT raw chat completions)

Central Agent Orchestrator

EXCLUDED

No frontend UI redesign

No auth system changes

No database schema redesign (unless strictly required)

No deprecated OpenAI SDK usage

No ChatCompletion-based flows

No "chatkit domain" assumptions

3. Architectural Continuity (Phase-2 to Phase-3)

Phase-3 inherits everything from Phase-2:

Layer    Status
Frontend (Next.js + shadcn/ui)    Already implemented
Backend (API server)    Already implemented
Auth (Better Auth)    Already implemented
Database (NeonDB)    Already implemented
ENV structure    Already implemented

Phase-3 adds one new layer only: AI Intelligence Layer (Agents)

4. AI Architecture Overview
Core Design Principle

Agents do not talk directly to the database.
They only interact through backend tools.

Frontend -> Backend API -> Agent Orchestrator -> AI Agents (OpenAI Agents SDK) -> Backend Tools (CRUD / Actions) -> NeonDB

5. Agent System Overview
Agent Execution Model

Uses OpenAI Agents SDK, tool calling, structured outputs, agent handoffs where required. Stateless by default, state managed by backend.

6. Defined Agents:
- Orchestrator Agent (Primary): Central decision-making agent
- Data Insight Agent: Analytical queries, summaries, insights
- Action Execution Agent: CRUD operations
- Validation & Policy Agent: Business rules and access constraints

7. Tooling Rules: Tools are backend API functions, deterministic, return typed JSON, handle auth via backend context.

8. OpenAI SDK Rules: REQUIRED - Use OpenAI Agents SDK (Agent, Runner, tool, handoff). FORBIDDEN - createChatCompletion, legacy openai.chat.completions.create, prompt-only orchestration, ChatKit assumptions.

9-14. Environment variables, frontend integration contract, error handling, logging, NFRs, and success criteria as described.

## Response snapshot

Created feature specification for AI Agents & Intelligence Layer (003-ai-agents-layer):

- Branch: `003-ai-agents-layer` created from `002-backend-api`
- Spec: `specs/003-ai-agents-layer/spec.md` with 4 user stories (P1-P4)
  - US1: Natural Language Task Management (P1) - core CRUD via NL
  - US2: Data Insights & Summaries (P2) - analytics and summaries
  - US3: Multi-Step Workflow Orchestration (P3) - compound requests
  - US4: Policy Enforcement & Safe Execution (P4) - validation/security
- 18 functional requirements (FR-001 to FR-018)
- 9 measurable success criteria (SC-001 to SC-009)
- 5 edge cases identified
- Assumptions documented
- Quality checklist: all items PASS

Key decisions:
- Kept spec technology-agnostic per guidelines (implementation details preserved for plan phase)
- Replaced previous `ai-chatbot` spec with comprehensive multi-agent architecture
- Explicitly excluded ChatKit and legacy OpenAI APIs per user constraints

## Outcome

- Impact: New feature specification created for Phase-3 AI intelligence layer
- Tests: none (specification phase)
- Files: 2 files created (spec.md, checklists/requirements.md)
- Next prompts: /sp.clarify or /sp.plan
- Reflection: User provided extremely detailed implementation input; spec correctly distilled WHAT from HOW

## Evaluation notes (flywheel)

- Failure modes observed: PowerShell script had argument parsing issue with long description; worked around by manual directory creation
- Graders run and results (PASS/FAIL): Quality checklist - PASS (all items)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
