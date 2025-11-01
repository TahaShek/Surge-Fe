# Authentication Feature

A comprehensive authentication system built with feature-driven architecture, TypeScript, and modern best practices.

## 📁 Structure

```
auth/
├── types/              # TypeScript types, interfaces, and enums
│   └── auth.types.ts   # Auth-related type definitions
├── store/              # State management (Zustand)
│   └── auth.store.ts   # Global auth state
├── hooks/              # Custom React hooks
│   └── useAuth.ts      # Auth functionality hook
├── components/         # Reusable components
│   ├── AuthLayout.tsx  # Auth pages layout wrapper
│   └── ProtectedRoute.tsx  # Route protection wrapper
├── pages/              # Page components
│   ├── LoginPage.tsx   # Login page
│   └── SignupPage.tsx  # Signup page
├── authapi.ts          # API service layer
├── authschema.ts       # Zod validation schemas
├── LoginForm.tsx       # Login form component
├── SignupForm.tsx      # Signup form component
└── index.ts            # Barrel export
```

## 🎯 Features

### ✅ Complete Type Safety
- Comprehensive TypeScript interfaces and types
- Enum-based status management
- Type-safe API calls
- Type-safe form validation

### ✅ State Management
- Global auth state with Zustand
- Persistent storage
- Automatic token refresh
- Cross-tab synchronization

### ✅ API Integration
- Axios instance with interceptors
- Automatic token injection
- Token refresh logic
- Error transformation
- Request/response logging

### ✅ Security
- JWT token management
- Secure token storage
- Protected routes
- Automatic logout on token expiry
- CSRF protection ready

### ✅ Form Validation
- Zod schema validation
- React Hook Form integration
- Real-time validation
- Custom error messages
- Password strength validation

### ✅ Responsive Design
- Mobile-first approach
- Beautiful split-screen layout
- Accessible components
- Modern UI/UX

## 🚀 Usage

### Basic Usage

```tsx
import { useAuth } from '@/features/auth';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.firstName}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
}
```

### Protected Routes

```tsx
import { ProtectedRoute } from '@/features/auth';

<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

### Auth Store Access

```tsx
import { useAuthStore } from '@/features/auth';

function MyComponent() {
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  
  // ... component logic
}
```

### API Calls

```tsx
import { authApi } from '@/features/auth';

// Login
const response = await authApi.login({
  email: 'user@example.com',
  password: 'password123',
});

// Signup
const response = await authApi.signup({
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
});

// Get current user
const user = await authApi.getCurrentUser();

// Logout
await authApi.logout();
```

## 📝 Types & Interfaces

### Core Types

```typescript
enum AuthStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  AUTHENTICATED = 'AUTHENTICATED',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  ERROR = 'ERROR',
}

enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  GUEST = 'GUEST',
}

interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
```

## 🔐 Security Best Practices

1. **Token Storage**: Tokens are stored in localStorage and automatically injected into requests
2. **Token Refresh**: Automatic token refresh on 401 responses
3. **Protected Routes**: Wrapper component to protect authenticated routes
4. **Password Validation**: Strong password requirements enforced
5. **Error Handling**: Comprehensive error handling and user feedback

## 🎨 Customization

### Styling
All components use Tailwind CSS and can be customized through:
- Tailwind config
- Component-level classes
- shadcn/ui theme customization

### API Endpoints
Update API endpoints in `authapi.ts`:

```typescript
const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
};
```

### Validation Rules
Modify validation schemas in `authschema.ts`:

```typescript
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(PASSWORD_REGEX, 'Password requirements message');
```

## 🧪 Testing

The auth feature is designed for easy testing:

```typescript
// Mock auth store
const mockLogin = jest.fn();
jest.mock('@/features/auth', () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: true,
    user: mockUser,
  }),
}));
```

## 📚 Dependencies

- `react-router`: Navigation and routing
- `zustand`: State management
- `axios`: HTTP client
- `zod`: Schema validation
- `react-hook-form`: Form handling
- `@hookform/resolvers`: Zod resolver for react-hook-form
- `lucide-react`: Icons
- `@radix-ui/*`: UI primitives

## 🔄 State Flow

```
User Action → Form Validation → API Call → Store Update → UI Update
                ↓                   ↓           ↓
           Error Handler ← Transform Error ← Token Refresh
```

## 🌐 API Configuration

Set your API base URL in `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 📱 Responsive Breakpoints

- Mobile: < 768px (Full-width form)
- Tablet: 768px - 1024px
- Desktop: > 1024px (Split-screen layout)

## ♿ Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Color contrast compliance

## 🚦 Error Codes

```typescript
enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}
```

## 🎯 Future Enhancements

- [ ] OAuth integration (Google, GitHub, etc.)
- [ ] Two-factor authentication
- [ ] Password reset flow
- [ ] Email verification
- [ ] Remember me functionality
- [ ] Session management
- [ ] Rate limiting
- [ ] Biometric authentication

