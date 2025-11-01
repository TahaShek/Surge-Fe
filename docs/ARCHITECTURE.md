# Architecture Overview

## Table of Contents
- [Introduction](#introduction)
- [High-Level Architecture](#high-level-architecture)
- [Feature-Driven Structure](#feature-driven-structure)
- [Data Flow](#data-flow)
- [State Management](#state-management)
- [Routing Architecture](#routing-architecture)
- [Authentication Flow](#authentication-flow)
- [Authorization System](#authorization-system)
- [API Layer](#api-layer)
- [Type System](#type-system)
- [Component Hierarchy](#component-hierarchy)

## Introduction

This application follows a **feature-driven architecture** where each feature is self-contained, modular, and maintainable. The architecture emphasizes:

- **Separation of Concerns** - Clear boundaries between features
- **Scalability** - Easy to add new features
- **Maintainability** - Each feature is independent
- **Reusability** - Components and utilities are shared
- **Type Safety** - TypeScript throughout

## High-Level Architecture

```
┌─────────────────────────────────────────────┐
│           User Interface (React)             │
├─────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Auth    │  │   ABAC   │  │  Theme   │  │
│  │ Context  │  │ Context  │  │ Context  │  │
│  └──────────┘  └──────────┘  └──────────┘  │
├─────────────────────────────────────────────┤
│            Feature Modules                   │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│  │ Auth │ │ ABAC │ │Layout│ │Forms │      │
│  └──────┘ └──────┘ └──────┘ └──────┘      │
├─────────────────────────────────────────────┤
│         Shared Components & Utils            │
│  ┌────────┐ ┌────────┐ ┌────────┐          │
│  │ UI Lib │ │ Forms  │ │ Utils  │          │
│  └────────┘ └────────┘ └────────┘          │
├─────────────────────────────────────────────┤
│              API Layer                       │
│  ┌──────────────┐  ┌──────────────┐        │
│  │    Axios     │  │ Interceptors │        │
│  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────┘
```

## Feature-Driven Structure

Each feature follows a consistent structure:

```
feature-name/
├── components/          # Feature-specific components
│   ├── ComponentA.tsx
│   ├── ComponentB.tsx
│   └── index.ts        # Barrel export
├── hooks/              # Custom hooks for this feature
│   ├── useFeature.ts
│   └── index.ts
├── types/              # TypeScript types/interfaces
│   ├── feature.types.ts
│   └── index.ts
├── services/           # Business logic & API calls
│   ├── feature.service.ts
│   └── index.ts
├── context/            # React context (if needed)
│   ├── FeatureContext.tsx
│   └── index.ts
├── store/              # Zustand store (if needed)
│   └── feature.store.ts
├── utils/              # Feature-specific utilities
│   └── helpers.ts
├── index.ts            # Main barrel export
└── README.md           # Feature documentation
```

### Benefits of This Structure

1. **Modularity** - Features are self-contained
2. **Discoverability** - Easy to find code
3. **Maintainability** - Clear organization
4. **Testability** - Easy to test in isolation
5. **Scalability** - Add features without affecting others

## Data Flow

### Unidirectional Data Flow

```
┌─────────────┐
│   User      │
│  Action     │
└──────┬──────┘
       │
       v
┌─────────────┐
│  Component  │
│   Handler   │
└──────┬──────┘
       │
       v
┌─────────────┐
│   Store/    │
│  Context    │
└──────┬──────┘
       │
       v
┌─────────────┐
│   Service   │
│  API Call   │
└──────┬──────┘
       │
       v
┌─────────────┐
│  Update     │
│   State     │
└──────┬──────┘
       │
       v
┌─────────────┐
│  Component  │
│  Re-render  │
└─────────────┘
```

## State Management

### Three Layers of State

1. **Local Component State** (`useState`, `useReducer`)
   - UI state (modals, dropdowns, form input)
   - Component-specific data
   - Temporary state

2. **Context-Based State** (React Context)
   - Theme preferences
   - ABAC permissions
   - Cross-cutting concerns

3. **Global State** (Zustand)
   - Authentication state
   - User information
   - Persistent data

### When to Use Each

| State Type | Use Case | Example |
|------------|----------|---------|
| Local | Component-only | Modal open/close |
| Context | Multiple components need access | Theme, permissions |
| Global Store | App-wide, persistent | User auth, user data |

## Routing Architecture

### Route Structure

```
/                           → Redirect to /dashboard
/auth/
  /login                    → Login page (public)
  /signup                   → Signup page (public)
/dashboard                  → Dashboard (protected)
/permissions-demo           → ABAC demo (protected)
/users                      → Users list (protected)
/settings                   → Settings (protected)
/user-form                  → User form example (protected)
```

### Route Protection

```typescript
// Public routes (no auth required)
<ProtectedRoute requireAuth={false}>
  <LoginPage />
</ProtectedRoute>

// Protected routes (auth required)
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

### Navigation Flow

```
User visits URL
      ↓
ProtectedRoute checks auth
      ↓
   Authenticated?
   ├─ Yes → Render component
   └─ No → Redirect to /auth/login
```

## Authentication Flow

### Login Flow

```
1. User enters credentials
   ↓
2. Form validation (Zod)
   ↓
3. Submit to auth service
   ↓
4. Mock API validates
   ↓
5. Generate JWT tokens
   ↓
6. Store in Zustand + localStorage
   ↓
7. Update auth context
   ↓
8. Redirect to dashboard
```

### Token Refresh Flow

```
1. API request fails (401)
   ↓
2. Axios interceptor catches error
   ↓
3. Check if refresh token exists
   ↓
4. Request new access token
   ↓
5. Update tokens in store
   ↓
6. Retry original request
   ↓
7. Return response to caller
```

### Logout Flow

```
1. User clicks logout
   ↓
2. Call logout service
   ↓
3. Clear tokens from store
   ↓
4. Clear localStorage
   ↓
5. Reset ABAC context
   ↓
6. Redirect to login
```

## Authorization System

### ABAC (Attribute-Based Access Control)

The authorization system uses a policy-based approach:

```
Permission Check = f(Subject, Action, Resource, Environment)
```

**Subject** = User attributes (role, department, clearance)
**Action** = What they want to do (READ, UPDATE, DELETE)
**Resource** = What they want to access (document, user, settings)
**Environment** = Context (time, location, device)

### Policy Evaluation

```
1. User requests action on resource
   ↓
2. Collect subject attributes
   ↓
3. Collect resource attributes
   ↓
4. Collect environment attributes
   ↓
5. Find matching policies
   ↓
6. Evaluate conditions
   ↓
7. Apply policy effect (ALLOW/DENY)
   ↓
8. Return decision
```

### Policy Priority

1. **DENY policies always win** - Explicit denies override allows
2. **More specific policies win** - Specific rules override general rules
3. **Higher priority number wins** - When multiple policies match

## API Layer

### Axios Instance

```typescript
// Configured in lib/axios/axios.config.ts
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Interceptors

**Request Interceptor:**
- Adds authentication token to headers
- Logs request details (dev mode)
- Adds request metadata (timestamps)

**Response Interceptor:**
- Handles token refresh on 401
- Transforms errors to consistent format
- Logs response details (dev mode)
- Retries failed requests (with backoff)

### Error Handling

All errors are transformed to a consistent format:

```typescript
interface TransformedError {
  code: ErrorCode;
  message: string;
  status?: number;
  details?: unknown;
}
```

## Type System

### Type Organization

1. **Feature Types** - In `feature/types/`
2. **Shared Types** - In `lib/types/`
3. **Component Props** - Inline or in component file
4. **API Types** - In `services/` alongside API calls

### Type Naming Conventions

- Interfaces: `IUserData`, `IAuthResponse`
- Types: `UserRole`, `ErrorCode`
- Enums: `const Action = { ... } as const`
- Props: `ComponentNameProps`

### Type Safety Best Practices

1. **Avoid `any`** - Use `unknown` if type is truly unknown
2. **Use const enums** - For type-safe constants
3. **Export types** - Share types across features
4. **Strict mode** - Enable strict TypeScript checks
5. **Type guards** - Use type guards for runtime checks

## Component Hierarchy

### Layout Structure

```
App
└── ThemeProvider
    └── AbacProvider
        └── RouterProvider
            ├── PublicRoutes
            │   ├── LoginPage
            │   └── SignupPage
            └── ProtectedRoutes
                └── MainLayout
                    ├── Navbar
                    ├── Sidebar
                    └── Outlet (page content)
                        ├── DashboardPage
                        ├── PermissionsDemoPage
                        ├── UsersPage
                        └── SettingsPage
```

### Component Categories

1. **Layout Components** - Structure (`MainLayout`, `Navbar`, `Sidebar`)
2. **Page Components** - Full pages (`DashboardPage`, `LoginPage`)
3. **Feature Components** - Feature-specific (`LoginForm`, `Can`)
4. **UI Components** - Reusable (`Button`, `Card`, `Input`)
5. **Form Components** - Forms (`TextInput`, `FormField`)

## Performance Considerations

### Code Splitting

- Route-based splitting (automatic with React Router)
- Feature-based lazy loading
- Component lazy loading for large components

### Memoization

```typescript
// Memoize expensive computations
const memoizedValue = useMemo(() => computeExpensive(a, b), [a, b]);

// Memoize callbacks
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);

// Memoize components
const MemoizedComponent = memo(ExpensiveComponent);
```

### Context Optimization

- Split contexts by concern (Theme, Auth, ABAC)
- Memoize context values
- Use selectors to subscribe to specific state

## Security Considerations

### Authentication Security

- JWT tokens with expiration
- Refresh token rotation
- HttpOnly cookies (when using real backend)
- CSRF protection

### Authorization Security

- Server-side validation (in production)
- Client-side checks for UX only
- Never trust client-side permissions
- Validate on every API call

### Input Validation

- Zod schemas for all forms
- Sanitize user input
- XSS protection
- SQL injection prevention (backend)

## Testing Strategy

### Unit Tests

- Test individual functions and hooks
- Mock external dependencies
- Test edge cases and error handling

### Integration Tests

- Test feature workflows
- Test component interactions
- Mock API calls

### E2E Tests

- Test critical user flows
- Test across different browsers
- Test responsive behavior

## Future Enhancements

### Potential Improvements

1. **Real Backend Integration**
   - Replace mock API with real endpoints
   - Implement proper authentication
   - Add server-side validation

2. **Enhanced Testing**
   - Add Jest for unit tests
   - Add Playwright for E2E tests
   - Add visual regression tests

3. **Performance Monitoring**
   - Add analytics
   - Track core web vitals
   - Monitor API performance

4. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Screen reader support

5. **Internationalization**
   - Multi-language support
   - Locale-specific formatting
   - RTL support

## Conclusion

This architecture provides a solid foundation for building scalable, maintainable React applications. The feature-driven approach makes it easy to add new features without affecting existing code, and the clear separation of concerns makes the codebase easy to understand and navigate.

---

For more information, see:
- [Authentication Documentation](./features/AUTHENTICATION.md)
- [Authorization Documentation](./features/AUTHORIZATION.md)
- [Developer Guide](./DEVELOPER_GUIDE.md)

