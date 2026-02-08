# Claude Agent Context for Todo Application

## Technologies

### Frontend Stack
- Next.js 16+ with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui component library
- Lucide React icons

### Authentication
- Better Auth for frontend authentication
- JWT-based authentication flow

### API Integration
- RESTful API communication
- Environment-based API URL configuration
- JWT token inclusion in requests

## Patterns

### Component Architecture
- Server Components by default
- Client Components only when interactivity is required
- Centralized API client in lib/api.ts
- Consistent use of shadcn/ui components

### UI/UX Patterns
- SaaS-grade dashboard layout
- Sidebar + Main Content structure
- Card-based design elements
- Loading/Empty/Error state handling
- Modal dialogs for user actions

### Folder Structure
- Strict adherence to specified directory structure
- Separation of concerns between pages, components, and utilities
- Component grouping by feature area (auth, dashboard)

## Best Practices

### Development
- Focus on user experience and visual hierarchy
- Ensure all pages have structured layouts
- Implement proper error handling and loading states
- Maintain consistency across all UI elements

### Implementation
- Follow specified requirements exactly without simplification
- Maintain professional, production-ready appearance
- Ensure all functionality handles loading, empty, and error states
- Implement proper authentication flows

### Quality Assurance
- Adhere to specified UI requirements
- Follow shadcn/ui design patterns
- Implement responsive design
- Ensure accessibility compliance