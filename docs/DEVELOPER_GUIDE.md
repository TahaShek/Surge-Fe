# Developer Guide

## Table of Contents
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Feature Development](#feature-development)
- [Component Guidelines](#component-guidelines)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Styling](#styling)
- [Testing](#testing)
- [Git Workflow](#git-workflow)
- [Debugging](#debugging)
- [Performance](#performance)
- [Common Tasks](#common-tasks)

## Getting Started

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm**, **yarn**, or **pnpm**
- **Git** ([Download](https://git-scm.com/))
- **VS Code** (recommended) with extensions:
  - ESLint
  - Prettier
  - TypeScript
  - Tailwind CSS IntelliSense

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd frontend-template

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Environment Setup

Create a `.env` file in the root:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Feature Flags (optional)
VITE_ENABLE_DEV_TOOLS=true
VITE_ENABLE_MOCK_API=true
```

## Development Workflow

### Daily Workflow

```bash
# 1. Pull latest changes
git pull origin main

# 2. Create feature branch
git checkout -b feature/my-feature

# 3. Start dev server
npm run dev

# 4. Make changes and test

# 5. Lint and fix issues
npm run lint

# 6. Commit changes
git add .
git commit -m "feat: add my feature"

# 7. Push to remote
git push origin feature/my-feature

# 8. Create pull request
```

### Hot Module Replacement (HMR)

Vite provides instant HMR. Changes appear immediately without full page reload.

**Tips:**
- Component changes reflect instantly
- CSS changes update without refresh
- State is preserved during HMR
- Syntax errors show in overlay

## Project Structure

### Directory Overview

```
frontend-template/
├── src/
│   ├── app/              # Application code
│   │   ├── pages/        # Page components
│   │   └── routes/       # Route configurations
│   ├── components/       # Shared UI components
│   │   ├── form/         # Form components
│   │   └── ui/           # Shadcn UI components
│   ├── contexts/         # React contexts
│   ├── features/         # Feature modules
│   │   ├── auth/         # Authentication
│   │   ├── authorization/ # ABAC
│   │   └── layout/       # Layout components
│   ├── lib/              # Utilities & configs
│   │   ├── axios/        # API setup
│   │   └── utils.ts      # Helper functions
│   ├── App.tsx           # Root component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── docs/                 # Documentation
├── public/               # Static assets
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Feature Structure

Each feature follows this structure:

```
feature-name/
├── components/           # Feature components
├── hooks/                # Custom hooks
├── types/                # TypeScript types
├── services/             # Business logic
├── context/              # React context
├── store/                # Zustand store
├── utils/                # Utilities
├── index.ts              # Barrel export
└── README.md             # Documentation
```

## Coding Standards

### TypeScript

**Use strict types:**
```typescript
// ❌ BAD
function updateUser(data: any) { }

// ✅ GOOD
function updateUser(data: IUserUpdateData): Promise<IUser> { }
```

**Use interfaces for objects:**
```typescript
// ✅ Interfaces
interface IUser {
  id: string;
  name: string;
  email: string;
}

// ✅ Types for unions/primitives
type Status = 'active' | 'inactive';
type ID = string | number;
```

**Use const enums:**
```typescript
// ✅ Type-safe constants
export const Action = {
  CREATE: 'CREATE',
  READ: 'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
} as const;

export type Action = typeof Action[keyof typeof Action];
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Component | PascalCase | `UserProfile` |
| Function | camelCase | `getUserById` |
| Variable | camelCase | `isLoading` |
| Constant | UPPER_SNAKE_CASE | `API_BASE_URL` |
| Interface | PascalCase with I prefix | `IUser` |
| Type | PascalCase | `UserRole` |
| Enum | PascalCase | `Action` |
| File (component) | PascalCase | `UserProfile.tsx` |
| File (utility) | kebab-case | `format-date.ts` |
| CSS class | kebab-case | `user-profile` |

### Code Organization

**Imports order:**
```typescript
// 1. React imports
import { useState, useEffect } from 'react';

// 2. Third-party imports
import { useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';

// 3. Internal imports (absolute paths)
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth';

// 4. Types
import type { IUser } from '@/features/auth/types';

// 5. Styles (if any)
import './styles.css';
```

**File structure:**
```typescript
// 1. Imports
import ...

// 2. Types/Interfaces (if inline)
interface Props { }

// 3. Constants
const MAX_ITEMS = 10;

// 4. Main component/function
export function Component() { }

// 5. Helper functions (if small)
function helper() { }

// 6. Exports
export default Component;
```

### Comments

```typescript
/**
 * User authentication hook
 * Provides login, logout, and user state
 * 
 * @returns Authentication state and actions
 * @example
 * const { user, login, logout } = useAuth();
 */
export function useAuth() { }

// Single-line comment for clarification
const isValid = validateInput(data); // Check input validity

// TODO: Implement token refresh logic
// FIXME: Handle edge case when user is null
// NOTE: This is a temporary solution
```

## Feature Development

### Creating a New Feature

```bash
# 1. Create feature directory
mkdir -p src/features/my-feature/{components,hooks,types,services}

# 2. Create files
touch src/features/my-feature/index.ts
touch src/features/my-feature/README.md
touch src/features/my-feature/types/my-feature.types.ts
```

### Feature Template

**index.ts** (Barrel Export):
```typescript
// Components
export * from './components';

// Hooks
export * from './hooks';

// Types
export * from './types';

// Services
export * from './services';
```

**README.md**:
```markdown
# Feature Name

## Overview
Brief description of the feature.

## Usage
\`\`\`typescript
import { MyComponent } from '@/features/my-feature';
\`\`\`

## API
- Component props
- Hook return values
- Type definitions
```

### Step-by-Step Feature Development

1. **Define Types** - Create TypeScript interfaces
2. **Create Service** - Implement business logic
3. **Create Hook** - Wrap service in React hook
4. **Create Components** - Build UI components
5. **Export Everything** - Update index.ts
6. **Document** - Update README.md
7. **Test** - Write tests and manual testing
8. **Integrate** - Use in application

## Component Guidelines

### Functional Components

```typescript
import type { ReactNode } from 'react';

interface Props {
  title: string;
  children?: ReactNode;
  onClose?: () => void;
}

export function MyComponent({ title, children, onClose }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
}
```

### Component Best Practices

1. **Single Responsibility** - One component, one purpose
2. **Small Components** - Keep components under 200 lines
3. **Props Over State** - Pass data via props when possible
4. **Composition** - Use children prop for flexibility
5. **Memoization** - Use `memo` for expensive components
6. **Hooks** - Extract logic into custom hooks
7. **TypeScript** - Always type props and state

### Custom Hooks

```typescript
/**
 * Custom hook for data fetching
 */
export function useData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchData();
  }, [url]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get<T>(url);
      setData(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchData };
}
```

## State Management

### When to Use Each

| State Type | Use Case | Tool |
|------------|----------|------|
| Local | Component-only state | `useState` |
| Shared | Multiple components | Context |
| Global | App-wide state | Zustand |
| Server | API data | React Query (future) |
| Form | Form state | React Hook Form |

### Zustand Store Example

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useCountStore = create<State>()(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
    }),
    { name: 'count-storage' }
  )
);
```

### Context Pattern

```typescript
// 1. Create context definition
export const MyContext = createContext<IMyContext | undefined>(undefined);

// 2. Create provider component
export function MyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState();

  const value = useMemo(() => ({
    state,
    updateState: setState,
  }), [state]);

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}

// 3. Create hook
export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within MyProvider');
  }
  return context;
}
```

## API Integration

### Axios Service Pattern

```typescript
// services/user.service.ts
import { axiosInstance } from '@/lib/axios';
import type { IUser, IUserUpdateData } from '../types';

export const userService = {
  // Get all users
  async getAll(): Promise<IUser[]> {
    const response = await axiosInstance.get<IUser[]>('/users');
    return response.data;
  },

  // Get user by ID
  async getById(id: string): Promise<IUser> {
    const response = await axiosInstance.get<IUser>(`/users/${id}`);
    return response.data;
  },

  // Update user
  async update(id: string, data: IUserUpdateData): Promise<IUser> {
    const response = await axiosInstance.put<IUser>(`/users/${id}`, data);
    return response.data;
  },

  // Delete user
  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/users/${id}`);
  },
};
```

### API Hook Pattern

```typescript
// hooks/useUsers.ts
import { useState, useEffect } from 'react';
import { userService } from '../services/user.service';
import type { IUser } from '../types';

export function useUsers() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, error, refetch: loadUsers };
}
```

## Styling

### Tailwind CSS

**Utility-first approach:**
```typescript
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-900">Title</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
    Click me
  </button>
</div>
```

**Responsive design:**
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

**Dark mode:**
```typescript
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  {/* Content adapts to theme */}
</div>
```

### Design Tokens

Defined in `src/index.css`:

```css
@theme inline {
  --color-primary: #3b82f6;
  --color-secondary: #10b981;
  --radius: 0.5rem;
}
```

Usage:
```typescript
<button className="bg-primary text-primary-foreground rounded-lg">
  Button
</button>
```

## Testing

### Manual Testing Checklist

#### Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Signup with valid data
- [ ] Signup with invalid data
- [ ] Logout
- [ ] Token refresh

#### Permissions
- [ ] Switch users and verify access changes
- [ ] Test department-based access
- [ ] Test role-based access
- [ ] Test ownership checks
- [ ] Test clearance levels

#### UI/UX
- [ ] Mobile responsiveness
- [ ] Dark mode
- [ ] Form validation
- [ ] Error messages
- [ ] Loading states

### Unit Testing (Future)

```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles click', () => {
    const handleClick = jest.fn();
    render(<MyComponent onClick={handleClick} />);
    
    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalled();
  });
});
```

## Git Workflow

### Branch Naming

- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical fixes
- `refactor/what-changed` - Code refactoring
- `docs/what-documented` - Documentation
- `test/what-tested` - Tests

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add dark mode toggle
fix: resolve login redirect issue
docs: update API documentation
refactor: extract auth logic to hook
test: add unit tests for auth store
chore: update dependencies
```

### Pull Request Process

1. Create feature branch
2. Make changes and commit
3. Push to remote
4. Create PR with description
5. Request review
6. Address feedback
7. Merge to main

## Debugging

### Browser DevTools

**Console Logging:**
```typescript
console.log('User:', user);
console.error('Error:', error);
console.warn('Warning:', warning);
console.table(users); // Table view
```

**React DevTools:**
- Inspect component tree
- View props and state
- Profile performance
- Track re-renders

### VS Code Debugging

**.vscode/launch.json:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

### Common Issues

**Issue:** Component not updating
- Check if state is mutable
- Verify dependencies in useEffect
- Use React DevTools to inspect state

**Issue:** Permission check not working
- Verify user is authenticated
- Check policy definitions
- Log subject and resource attributes

**Issue:** Dark mode not applying
- Check ThemeProvider wrapper
- Verify dark mode classes
- Check localStorage

## Performance

### Optimization Techniques

**Memoization:**
```typescript
// Memoize expensive computations
const sortedUsers = useMemo(() => {
  return users.sort((a, b) => a.name.localeCompare(b.name));
}, [users]);

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// Memoize components
const MemoizedList = memo(UserList);
```

**Code Splitting:**
```typescript
// Lazy load routes
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

// Use Suspense
<Suspense fallback={<Loading />}>
  <DashboardPage />
</Suspense>
```

**Virtualization:**
```typescript
// For long lists
import { VirtualList } from 'react-virtual';

<VirtualList items={1000} itemHeight={50}>
  {(index) => <UserRow user={users[index]} />}
</VirtualList>
```

## Common Tasks

### Adding a New Page

```typescript
// 1. Create page component
// src/app/pages/MyPage.tsx
export function MyPage() {
  return <div>My Page</div>;
}

// 2. Add route
// src/app/routes/AppRoutes.tsx
{
  path: "my-page",
  element: <MyPage />,
}

// 3. Add navigation link
// src/features/layout/components/Sidebar.tsx
{
  title: "My Page",
  href: "/my-page",
  icon: MyIcon,
}
```

### Adding Shadcn Component

```bash
npx shadcn@latest add component-name
```

### Adding Environment Variable

```bash
# .env
VITE_NEW_VAR=value

# Access in code
const value = import.meta.env.VITE_NEW_VAR;
```

### Creating Mock Data

```typescript
// src/mocks/mock-data.ts
export const mockUsers = [
  { id: '1', name: 'John', email: 'john@example.com' },
  { id: '2', name: 'Jane', email: 'jane@example.com' },
];
```

## Tips & Tricks

1. **Use VS Code snippets** for faster coding
2. **Install ESLint extension** for real-time linting
3. **Use Tailwind CSS IntelliSense** for class autocomplete
4. **Keep components small** (< 200 lines)
5. **Extract logic to hooks** for reusability
6. **Use TypeScript strict mode** for better type safety
7. **Document complex logic** with comments
8. **Test on multiple devices** for responsiveness
9. **Use React DevTools** for debugging
10. **Keep dependencies updated** regularly

## Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router Docs](https://reactrouter.com/)
- [Zustand Guide](https://github.com/pmndrs/zustand)

---

**Happy Coding! 🚀**

For more information, see:
- [Architecture Documentation](./ARCHITECTURE.md)
- [Authentication Documentation](./features/AUTHENTICATION.md)
- [Authorization Documentation](./features/AUTHORIZATION.md)

