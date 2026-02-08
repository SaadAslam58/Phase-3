# Implementation Plan: Frontend UI Specification for Todo Application
Feature #001 - frontend-ui

## Technical Context

**Application**: Todo Full-Stack Web Application – Phase II - Frontend UI Only
**Framework**: Next.js 16+ with App Router
**Language**: TypeScript
**Styling**: Tailwind CSS with shadcn/ui components
**Icons**: Lucide React
**Architecture**: Client-side rendering with API integration planned

**Resolved Specifications**:
- shadcn/ui component installation and setup process defined
- API endpoint structure and contracts established
- Better Auth integration patterns determined

## Constitution Check

Based on the project constitution, this plan must:
- Follow the mandatory technology stack (Next.js 16+, TypeScript, Tailwind CSS, shadcn/ui, Lucide icons)
- Implement the specified folder structure exactly as defined
- Maintain user isolation (UI level - ensure proper authentication flow)
- Follow SaaS-grade dashboard design patterns
- Ensure every page is visually structured using Cards, Grids, and Sections

**Gates to evaluate**:
- ✅ Technology stack compliance: Using only approved technologies
- ✅ Security compliance: Following authentication requirements (deferred to auth implementation)
- ✅ Structure compliance: Following the locked folder structure
- ✅ UI requirements: Meeting all visual hierarchy and design consistency rules

## Phase 0: Research & Unknown Resolution

### research.md

#### Research Task 1: shadcn/ui Setup Process
**Decision**: Install shadcn/ui components following the official documentation
**Rationale**: shadcn/ui is a collection of accessible, customizable React components that integrate well with Tailwind CSS
**Steps**:
1. Install required dependencies: `pnpm add -D @types/react @types/node`
2. Initialize shadcn/ui: `npx shadcn-ui@latest init`
3. Add required components as needed following the component library approach
4. Follow the installation guide for Next.js 16+ with App Router

#### Research Task 2: Next.js Project Structure for App Router
**Decision**: Use the recommended Next.js 16+ App Router structure with the exact folder structure specified
**Rationale**: App Router is the newer, recommended routing system for Next.js with better performance and developer experience
**Implementation**:
- Create the exact structure specified in the requirements
- Use server components by default with client components only when interactivity is required

#### Research Task 3: Better Auth Integration Patterns
**Decision**: Implement Better Auth following their Next.js and shadcn/ui integration guides
**Rationale**: Better Auth was specified in the constitution as the authentication solution
**Considerations**:
- Setup authentication provider wrapper
- Implement protected route patterns
- Integrate with shadcn/ui components for login/logout

#### Research Task 4: API Contract Design
**Decision**: Design API endpoints following RESTful patterns with JWT authentication headers
**Rationale**: The backend will use FastAPI with SQLModel as specified in the constitution
**Endpoint patterns**:
- GET /api/tasks - Retrieve user's tasks
- POST /api/tasks - Create a new task
- PUT /api/tasks/{id} - Update a task
- DELETE /api/tasks/{id} - Delete a task
- GET /api/tasks/stats - Get task statistics for dashboard

## Phase 1: Design & Contracts

### data-model.md

#### Entity: Task
**Fields**:
- id: string (UUID)
- title: string (required, max 255 chars)
- description?: string (optional, max 1000 chars)
- status: 'todo' | 'in-progress' | 'completed' (default: 'todo')
- createdAt: Date
- updatedAt: Date
- userId: string (foreign key to User)

**Validation**:
- Title must not be empty
- Status must be one of allowed values
- Task belongs to a single user

#### Entity: User
**Fields**:
- id: string (UUID)
- email: string (unique, required)
- name?: string (optional)
- createdAt: Date
- updatedAt: Date

**Validation**:
- Email must be valid and unique
- User can have many tasks

### API Contracts

#### Task Endpoints
```
GET /api/tasks
Headers: Authorization: Bearer {jwt_token}
Response: { tasks: Task[] }

POST /api/tasks
Headers: Authorization: Bearer {jwt_token}
Body: { title: string, description?: string }
Response: { task: Task }

PUT /api/tasks/{id}
Headers: Authorization: Bearer {jwt_token}
Body: { title?: string, description?: string, status?: string }
Response: { task: Task }

DELETE /api/tasks/{id}
Headers: Authorization: Bearer {jwt_token}
Response: { success: boolean }

GET /api/tasks/stats
Headers: Authorization: Bearer {jwt_token}
Response: { total: number, completed: number, pending: number }
```

#### Authentication Endpoints (Future Implementation)
```
POST /api/auth/login
Body: { email: string, password: string }
Response: { token: string, user: User }

POST /api/auth/signup
Body: { email: string, password: string, name?: string }
Response: { token: string, user: User }
```

### quickstart.md

# Frontend Quickstart

## Prerequisites
- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)

## Setup Instructions

1. **Initialize the project**
   ```bash
   npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
   cd frontend
   ```

2. **Install shadcn/ui dependencies**
   ```bash
   pnpm install -D @types/react @types/node
   npx shadcn-ui@latest init
   ```

3. **Install required components**
   ```bash
   npx shadcn-ui@latest add card input label button
   npx shadcn-ui@latest add table dialog alert-dialog
   npx shadcn-ui@latest add skeleton avatar
   ```

4. **Install additional dependencies**
   ```bash
   pnpm install lucide-react
   ```

5. **Copy environment variables**
   ```bash
   cp ../.env.example .env.local
   ```

6. **Run the development server**
   ```bash
   pnpm dev
   ```

## Folder Structure
The application follows the exact structure specified in the requirements:
```
frontend/
  app/
    layout.tsx
    globals.css
    page.tsx
    login/page.tsx
    signup/page.tsx
    dashboard/
      page.tsx
      tasks/page.tsx
  components/
    auth/
    dashboard/
      layout.tsx
      sidebar.tsx
      navbar.tsx
      task-filters.tsx
      task-list.tsx
  lib/
    api.ts
    auth.ts
```

## Development Notes
- Use server components by default
- Only use client components when interactivity is required
- All API calls go through the centralized API client in `lib/api.ts`
- Authentication is handled through `lib/auth.ts` with JWT tokens

## Next Steps
1. Implement the global layout
2. Create the landing page with required sections
3. Build authentication pages
4. Develop dashboard components
5. Implement task management features

## Environment Variables
- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL (default: http://localhost:3001)
- `NEXT_PUBLIC_AUTH_PUBLIC_KEY`: Authentication public key
- `NEXT_PUBLIC_APP_NAME`: Application name (default: Todo Dashboard)

## Building for Production
```bash
pnpm build
pnpm start
```
