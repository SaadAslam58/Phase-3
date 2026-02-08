---
id: 1
title: Update Project Constitution
stage: constitution
date_iso: 2026-02-06
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 1-frontend-todo-ui
user: user
command: sp.constitution
labels:
  - constitution
  - spec-kit-plus
  - todo-app
spec: null
ticket: null
adr: null
pr: null
files_yaml:
  - ../.specify/memory/constitution.md
  - history/prompts/constitution/1-update-project-constitution.constitution.prompt.md
tests_yaml: []
prompt_text: |
  sp.constitution

  Todo Full-Stack Web Application – Phase II
  Spec-Kit Plus Driven Project

  1. Project Identity

  Project Name: Todo Full-Stack Web Application
  Phase: Phase II – Web Application
  Methodology: Spec-Driven Development (Spec-Kit Plus + Claude Code)
  Development Rule: No manual coding is allowed. All implementation must be performed by Claude Code using approved specifications.

  2. Project Objective

  The objective of this project is to transform an existing console-based Todo application into a modern, secure, multi-user full-stack web application with persistent storage.

  The system must support authenticated users, user-isolated task management, RESTful APIs, and a responsive frontend interface, all developed using a strict spec-driven workflow.

  3. Mandatory Development Workflow

  This project MUST follow the Agentic Dev Stack workflow:

  Write or update specifications

  Generate a development plan from specifications

  Break the plan into executable tasks

  Implement tasks exclusively via Claude Code

  Skipping, reordering, or bypassing any step is strictly prohibited.

  4. Technology Stack (Non-Negotiable)
  Frontend

  Next.js 16+ using App Router

  TypeScript

  Tailwind CSS

  Better Auth for authentication

  Backend

  Python FastAPI

  SQLModel ORM

  Database

  Neon Serverless PostgreSQL

  Authentication

  Better Auth (Frontend)

  JWT-based authentication shared with backend

  Development System

  Claude Code

  GitHub Spec-Kit Plus

  Monorepo architecture

  5. Repository Structure Rules

  The project MUST use a monorepo with the following structure:

  .spec-kit/ for Spec-Kit configuration

  specs/ for all specifications

  frontend/ for Next.js application

  backend/ for FastAPI application

  Separate CLAUDE.md files at root, frontend, and backend levels

  All specifications must live inside the specs/ directory and follow Spec-Kit conventions.

  6. Specification Authority

  Specifications are the single source of truth.

  Claude Code must always read relevant specs before implementing anything

  Specs must be referenced using @specs/...

  If requirements change, specifications must be updated before implementation

  Code must never contradict specifications

  7. Feature Scope (Phase II Only)

  The system must implement all Basic Level Todo features as a web application:

  Create task

  View tasks

  Update task

  Delete task

  Mark task as complete

  Multi-user support

  Persistent storage

  Advanced or chatbot features are explicitly out of scope for Phase II.

  8. API Design Rules

  All backend routes must be RESTful

  All endpoints must live under /api/

  Every request must require authentication

  Requests without valid JWT must return 401 Unauthorized

  Users may only access their own data

  Task ownership must be enforced on every operation.

  9. Authentication & Security Constitution

  Authentication is handled on the frontend using Better Auth

  Better Auth must issue JWT tokens

  JWT tokens must be included in every API request using:
  Authorization: Bearer <token>

  Backend must verify JWT signature using a shared secret

  User identity must be derived from JWT, not request parameters

  Token expiration must be enforced

  There must be no shared session database between frontend and backend.

  10. Data Ownership & Isolation

  Each task must belong to exactly one user

  Users must never be able to view or modify another user's tasks

  All database queries must be filtered by authenticated user ID

  User isolation is mandatory and non-optional

  11. Frontend Rules

  Server Components must be used by default

  Client Components only when interactivity is required

  All API communication must go through a centralized API client

  UI must be responsive and accessible

  No inline styles are allowed

  UI must strictly follow UI specifications

  12. Backend Rules

  FastAPI is the only backend framework

  SQLModel must be used for all database interactions

  Pydantic models must be used for request and response validation

  Errors must be handled using HTTPException

  Environment variables must be used for secrets and database URLs

  13. Quality & Validation Rules

  Every feature must satisfy acceptance criteria defined in specs

  Authentication must be tested for all endpoints

  Unauthorized access must always fail

  Specs must be updated if validation reveals ambiguity

  14. Prohibited Actions

  The following actions are strictly forbidden:

  Manual coding by the user

  Implementing features without specs

  Bypassing authentication

  Hardcoding secrets

  Mixing frontend and backend responsibilities

  Deviating from the defined tech stack

  15. Success Criteria

  The project is considered successful when:

  All Phase II features are implemented

  Specs fully align with implementation

  Authentication and user isolation work correctly

  The process follows Spec-Kit Plus methodology

  Claude Code can understand and modify the project using specs alone

  16. Governing Principle

  Specs first.
  Process over shortcuts.
  Automation over manual effort.
  Security and clarity over speed.
response_text: |
  Updated the project constitution file at `.specify/memory/constitution.md` with the comprehensive project principles and guidelines for the Todo Full-Stack Web Application. The new constitution includes all the specified sections covering project identity, objectives, workflow, technology stack, repository structure, specification authority, feature scope, API design rules, authentication requirements, data ownership rules, frontend and backend rules, quality validation rules, prohibited actions, success criteria, and governing principles. The constitution serves as the authoritative document for the project's development process.
outcome: |
  The project constitution has been successfully created with all the required principles and guidelines. This document will serve as the foundation for all future development decisions in the Todo Full-Stack Web Application project, ensuring consistent implementation according to the Spec-Kit Plus methodology.
evaluation: |
  The constitution has been properly documented with all 16 sections as specified in the user input. The file replaces the previous placeholder content and establishes the project's governing principles. All key aspects of the development workflow, technology stack, security requirements, and scope limitations are clearly defined.
---

# Update Project Constitution

## Summary of Actions Taken

Created a comprehensive project constitution for the Todo Full-Stack Web Application based on the provided specifications. The constitution replaces the previous placeholder content with detailed principles covering all aspects of the project including development workflow, technology stack, security requirements, and scope.

## Key Components Established

- Project identity and objectives
- Mandatory development workflow (Spec-Driven Development)
- Technology stack definitions (Next.js, FastAPI, SQLModel, Neon DB)
- Repository structure rules
- Specification authority guidelines
- Feature scope limitations (Phase II)
- API design and authentication rules
- Data ownership and isolation requirements
- Frontend and backend development rules
- Quality validation requirements
- Prohibited actions
- Success criteria
- Governing principles

This constitution will serve as the authoritative guide for all development decisions in the project.