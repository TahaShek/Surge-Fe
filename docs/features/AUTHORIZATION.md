# Authorization System

A modern, type-safe permission system using CASL.

## 🚀 Quick Start

```tsx
// 1. Wrap your app
<AbilityProvider>
  <App />
</AbilityProvider>

// 2. Use in components
const { can } = usePermissions();
if (can('create', 'User')) {
  // ...
}
```

## 🎯 Core Concepts

### Permission Structure

```typescript
interface Permission {
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  subject: 'Dashboard' | 'User' | 'Settings' | 'all';
}
```

### Actions
- `create`: Create new resources
- `read`: View resources
- `update`: Modify existing resources
- `delete`: Remove resources
- `manage`: Full access (implies all actions)

## 🛠️ Components

### 1. Can Component
```tsx
// Basic usage
<Can I="read" a="User">
  <UserList />
</Can>

// With fallback
<Can 
  I="update" 
  a="User"
  fallback={<AccessDenied />}
>
  <EditForm />
</Can>
```

### 2. PermissionGuard
```tsx
// Route protection
<PermissionGuard subject="Dashboard">
  <DashboardPage />
</PermissionGuard>

// With custom action
<PermissionGuard 
  subject="User" 
  action="update"
>
  <EditUserPage />
</PermissionGuard>
```

### 3. ResourceGuard
```tsx
<ResourceGuard
  resource={{ subject: 'User', id: '123' }}
  action="update"
>
  <EditButton />
</ResourceGuard>
```

## 🎭 User Roles

### Admin
```typescript
{
  role: 'admin',
  permissions: [{ action: 'manage', subject: 'all' }]
}
```

### Manager
```typescript
{
  role: 'manager',
  permissions: [
    { action: 'read', subject: 'Dashboard' },
    { action: 'create', subject: 'User' },
    { action: 'update', subject: 'User' },
    { action: 'read', subject: 'Settings' }
  ]
}
```

### Regular User
```typescript
{
  role: 'user',
  permissions: [
    { action: 'read', subject: 'Dashboard' },
    { action: 'read', subject: 'User' },
    { action: 'update', subject: 'User' }
  ]
}
```

### Guest
```typescript
{
  role: 'guest',
  permissions: [
    { action: 'read', subject: 'Dashboard' }
  ]
}
```

## 🪝 Hooks

### usePermissions
```typescript
const { can, cannot, ability } = usePermissions();

// Check permission
if (can('create', 'User')) {
  // ...
}

// Check multiple
if (can('read', 'User') && can('update', 'User')) {
  // ...
}
```

### useAbility
```typescript
const ability = useAbility();

// Raw ability checks
ability.can('manage', 'all');
```

## 🔒 Best Practices

1. **Use Specific Permissions**
```typescript
// Good
can('read', 'User')

// Avoid
can('manage', 'all') // Too broad
```

2. **Component Protection**
```typescript
// Good
<Can I="update" a="User">
  <EditButton />
</Can>

// Avoid
{can('update', 'User') && <EditButton />}
```

3. **Route Protection**
```typescript
// Good
<PermissionGuard subject="Dashboard">
  <DashboardPage />
</PermissionGuard>

// Avoid
{can('read', 'Dashboard') ? <DashboardPage /> : <Navigate />}
```

## 🎨 UI Integration

### Loading States
```tsx
<PermissionGuard subject="User">
  {loading ? (
    <LoadingSkeleton variant="form" />
  ) : (
    <UserForm />
  )}
</PermissionGuard>
```

### Error Handling
```tsx
<Can 
  I="update" 
  a="User"
  fallback={
    <div className="text-destructive">
      Access denied
    </div>
  }
>
  <EditForm />
</Can>
```

## 🔄 Dynamic Permissions

```typescript
// Add permissions
ability.update([
  { action: 'read', subject: 'User' },
  { action: 'update', subject: 'User' }
]);

// Check conditions
can('update', 'User', { userId: currentUser.id });
```

## 🧪 Testing

```typescript
// Mock ability
const mockAbility = defineAbilityFor([
  { action: 'read', subject: 'User' }
]);

// Test component
render(
  <AbilityContext.Provider value={mockAbility}>
    <YourComponent />
  </AbilityContext.Provider>
);
```

## 🔍 Debugging

1. Enable debug mode:
```typescript
const ability = defineAbilityFor(permissions, { debug: true });
```

2. Check current permissions:
```typescript
console.log(ability.rules);
```

## 🚀 Performance

1. Memoize permission checks:
```typescript
const canEditUser = useMemo(
  () => can('update', 'User'),
  [can]
);
```

2. Use specific subjects:
```typescript
// Good
can('read', 'User')

// Avoid checking all permissions
ability.rules.forEach(...)
```

## 🔐 Security Considerations

1. Always validate permissions on the backend
2. Never trust client-side permissions alone
3. Use specific permissions over broad ones
4. Regularly audit permission assignments
5. Log permission checks in production

---

For more information, check the [CASL documentation](https://casl.js.org/)