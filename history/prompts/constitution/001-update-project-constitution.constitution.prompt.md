---
id: 001
title: Update Project Constitution
stage: constitution
date: 2026-02-07
surface: agent
model: Claude Sonnet 4.5
feature: none
branch: 002-backend-api
user: pc
command: sp.constitution
labels: ["constitution", "governance", "hackathon-phase3"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
 - .specify/templates/plan-template.md
 - .specify/templates/spec-template.md
 - .specify/templates/tasks-template.md
tests:
 - null
---

## Prompt

```
sp.constitution

Hackathon-2 – Phase-3
Todo Application with AI Chatbot (MCP + Agents)

1. Authority & Supremacy

This sp.constitution is the highest governing document for Hackathon-2 Phase-3.

It supersedes:

All ad-hoc instructions

All undocumented assumptions

Any AI-generated code that violates it

All specifications, plans, tasks, and implementations must comply with this constitution.

Violation of this constitution invalidates the implementation.

2. Phase-2 Preservation Principle (Critical)

Phase-3 is NOT a rewrite.

Mandatory Rule

Everything from Phase-2 remains intact, unchanged, and authoritative.

This includes:

Frontend structure

Backend APIs

Authentication flow

Database schema

Task CRUD logic

Environment variable usage

Folder hierarchy

Explicitly Forbidden

Refactoring Phase-2 code

Renaming Phase-2 routes or models

Replacing existing UI or APIs

Changing auth behavior

Phase-3 extends Phase-2 — it does not modify it.

3. Phase-3 Purpose

Phase-3 introduces an AI-powered chatbot that allows users to manage todos using natural language.

The chatbot:

Operates on top of existing Phase-2 functionality

Uses AI agents and MCP tools

Does not duplicate task logic

Does not replace UI-based task management

Phase-2 UI and APIs must continue to work independently of the chatbot.

4. Architectural Doctrine (Non-Negotiable)

Phase-3 architecture is stateless and tool-driven.

Core Principles

No server-side session state

All state stored in the database

AI agents never touch the database directly

AI agents interact only through MCP tools

Each request is independent and reproducible

5. Approved Technology Stack
Frontend

Existing Phase-2 frontend (unchanged)

OpenAI ChatKit (added)

Chat UI is additive only

Backend

Python FastAPI (existing)

OpenAI Agents SDK

Official MCP SDK

SQLModel ORM

Neon Serverless PostgreSQL

Authentication

Better Auth (Phase-2 authority)

No new auth system introduced

6. Folder & Project Structure Authority

Phase-3 folder is created by copying Phase-2 entirely.

Hackathon-2/
  Phase-2/        (original, untouched)
  Phase-3/
    frontend/     (copied from Phase-2)
    backend/      (copied from Phase-2)


Phase-3 additions must be:

Clearly additive

Isolated

Non-breaking

7. AI Chatbot Scope

The chatbot must support Basic Level functionality only:

Add task

List tasks

Update task

Complete task

Delete task

The chatbot must not:

Introduce new task concepts

Modify task schema

Bypass validation rules

Invent features not present in Phase-2

8. MCP Tool Authority

All task operations performed by AI must go through MCP tools.

Rules

MCP tools are stateless

MCP tools map 1-to-1 with task operations

MCP tools perform no AI reasoning

MCP tools persist data via database only

Direct DB access by agents is forbidden.

9. Chat API Doctrine

There must be one primary chat endpoint:

POST /api/{user_id}/chat


Rules:

Stateless per request

Conversation history is fetched from DB

Messages are stored before and after agent execution

Tool calls are surfaced in the response

No WebSockets. No sessions. No memory in RAM.

10. Conversation Persistence Rule

Conversation continuity is achieved only via database storage.

Required models:

Conversation

Message

Task (existing Phase-2 model)

Server restarts must not affect conversations.

11. AI Agent Behavior Doctrine

AI agents must:

Use MCP tools for all task actions

Confirm actions in natural language

Handle errors gracefully

Never hallucinate task state

Chain tools when required (e.g., list → delete)

Agents must be deterministic and auditable.

12. Frontend Integration Doctrine

Chat UI:

Is additive, not replacing existing UI

Lives alongside Phase-2 dashboard

Does not redesign existing pages

Uses ChatKit only for chat

Task UI remains Phase-2 authoritative.

13. Environment Configuration Authority

Environment variables:

Phase-2 env remains valid

Phase-3 adds only what is required for AI/chat

Secrets:

Never exposed to frontend

Managed via backend env files

14. Development Discipline (S
```

## Response snapshot

Constitution has been successfully updated with all 14 core principles for Hackathon-2 Phase-3 Todo Application with AI Chatbot. The constitution now includes:

- Authority & Supremacy principle
- Phase-2 Preservation Principle (critical)
- Phase-3 Purpose definition
- Architectural Doctrine (stateless and tool-driven)
- Approved Technology Stack
- Folder & Project Structure Authority
- AI Chatbot Scope limitations
- MCP Tool Authority requirements
- Chat API Doctrine specifications
- Conversation Persistence Rule
- AI Agent Behavior Doctrine
- Frontend Integration Doctrine
- Environment Configuration Authority
- Development Discipline standards

Additionally, the plan, spec, and tasks templates have been updated to incorporate constitution requirements, including checks for Phase-2 preservation, architectural doctrine compliance, MCP tool authority, and chat API doctrine.

## Outcome

- ✅ Impact: High - Established foundational governance for Phase-3 development
- 🧪 Tests: No tests required for documentation update
- 📁 Files: Updated constitution.md and three template files
- 🔁 Next prompts: Plan and implement Phase-3 features following the new constitution
- 🧠 Reflection: Constitution now serves as authoritative source for all Phase-3 development decisions

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin Phase-3 feature specification following constitution guidelines