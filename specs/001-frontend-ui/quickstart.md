# Frontend Quickstart Guide

## Project Setup

### Prerequisites
- Node.js 18+ installed
- pnpm package manager (recommended) - install with `npm install -g pnpm`
- Access to backend API (running on http://localhost:3001 by default)

### Installation Steps

1. **Create the Next.js project**:
   ```bash
   npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
   cd frontend
   ```

2. **Install shadcn/ui dependencies**:
   ```bash
   pnpm install -D @types/react @types/node
   npx shadcn-ui@latest init
   ```

3. **Install required components**:
   ```bash
   # Core components
   npx shadcn-ui@latest add card input label button
   # Dashboard components
   npx shadcn-ui@latest add table dialog alert-dialog
   # UI utilities
   npx shadcn-ui@latest add skeleton avatar
   # Forms
   npx shadcn-ui@latest add form
   # Navigation
   npx shadcn-ui@latest add navigation-menu
   ```

4. **Install additional dependencies**:
   ```bash
   pnpm install lucide-react
   ```

5. **Setup environment variables**:
   ```bash
   # Copy the example environment file
   cp ../.env.example .env.local
   # Edit with your local settings
   nano .env.local
   ```

6. **Run the development server**:
   ```bash
   pnpm dev
   ```

## Folder Structure

The project follows the exact structure specified in the requirements:

```
frontend/
  app/
    layout.tsx                 # Root layout with global styles
    globals.css               # Global Tailwind styles
    page.tsx                  # Landing page
    login/
      page.tsx                # Login page
    signup/
      page.tsx                # Signup page
    dashboard/
      page.tsx                # Dashboard home
      tasks/
        page.tsx              # Tasks management page
  components/
    auth/                     # Authentication components
    dashboard/
      layout.tsx              # Dashboard shell layout
      sidebar.tsx             # Navigation sidebar
      navbar.tsx              # Top navigation bar
      task-filters.tsx        # Task filtering component
      task-list.tsx           # Task display component
  lib/
    api.ts                    # API client utilities
    auth.ts                   # Authentication utilities
```

## Component Development Guide

### Creating New Components

1. **Component Location**: Place new components in appropriate subdirectories under `/components/`
2. **Naming Convention**: Use PascalCase for component names (e.g., `TaskCard.tsx`)
3. **Export Pattern**: Export components as default exports when they're the main component of the file

### Using shadcn/ui Components

All UI components should use shadcn/ui primitives where possible:

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
```

### Environment Variables

The application uses these environment variables:

- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL (default: http://localhost:3001)
- `NEXT_PUBLIC_AUTH_PUBLIC_KEY`: Authentication public key (for JWT verification)
- `NEXT_PUBLIC_APP_NAME`: Application name (default: Todo Dashboard)

## API Integration

### API Client Setup

The API client in `lib/api.ts` should handle:
- Adding authorization headers
- Request/response interceptors
- Error handling
- Base URL configuration

Example API client implementation:

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export const apiClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Additional methods for PUT, DELETE, etc.
};
```

### Authentication Flow

Authentication follows JWT-based flow:
1. User logs in via authentication page
2. JWT token is stored securely (localStorage or cookies)
3. Token is included in all API requests to protected endpoints
4. Token expiration is handled gracefully with refresh mechanisms

## Development Best Practices

### Component Structure
- Use Server Components by default
- Use Client Components only when interactivity is required (using `'use client'` directive)
- Keep components focused and reusable

### Styling Guidelines
- Use Tailwind CSS utility classes
- Leverage shadcn/ui component styles for consistency
- Follow the design system defined in the requirements
- Maintain responsive design for all screen sizes

### Error Handling
- Implement error boundaries for graceful error handling
- Show user-friendly error messages
- Log errors appropriately for debugging
- Handle network errors gracefully with retry mechanisms

### Performance Optimization
- Implement lazy loading for dashboard components
- Use React.memo for components that render frequently
- Optimize images and assets
- Minimize bundle size

## Testing Strategy

### Component Testing
- Use React Testing Library for component testing
- Test user interactions and state changes
- Verify proper rendering under different conditions (loading, error, empty states)

### Integration Testing
- Test API integration flow
- Verify authentication and authorization
- Test end-to-end user journeys

## Deployment

### Build Process
```bash
pnpm build
```

### Running in Production
```bash
pnpm start
```

### Environment Configuration
Ensure all necessary environment variables are configured in your production environment, especially:
- `NEXT_PUBLIC_API_BASE_URL` should point to your production backend API
- Update any other environment-specific configurations as needed

## Troubleshooting

### Common Issues
1. **Component import errors**: Ensure shadcn/ui components are properly installed
2. **API connection errors**: Verify backend is running and API URL is correct
3. **Authentication errors**: Check JWT token handling and expiration

### Development Tips
- Use the Next.js development server for hot reloading
- Check browser console for client-side errors
- Verify API responses using browser dev tools
- Test on multiple screen sizes for responsiveness