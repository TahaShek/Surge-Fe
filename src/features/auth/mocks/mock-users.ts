import type { Permission } from '@/features/authorization/types/ability.types';

interface MockUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string; // Role as string for mock data
  permissions: Permission[];
  avatar?: string;
  password?: string;
}

export const mockUsers: Record<string, MockUser> = {
  admin: {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    permissions: [
      { action: 'manage', subject: 'all' }
    ],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  },
  user: {
    id: '2',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    firstName: 'Regular',
    lastName: 'User',
    permissions: [
      // Navigation & Read permissions
      { action: 'read', subject: 'Dashboard' },
      { action: 'read', subject: 'Hello' },     // Can see users list
      { action: 'read', subject: 'UserForm' },  // Can see user form
      { action: 'read', subject: 'Settings' },
      // Create/Update permissions
      // { action: 'create', subject: 'UserForm' }, // Can create new users
      { action: 'update', subject: 'UserForm' }, // Can update users
    ],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
  },
  guest: {
    id: '3',
    email: 'guest@example.com',
    password: 'guest123',
    role: 'guest',
    firstName: 'Guest',
    lastName: 'User',
    permissions: [
      { action: 'read', subject: 'Dashboard' }  // Only dashboard access
    ],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
  }
};

export const findUserByEmail = (email: string): MockUser | undefined => {
  return Object.values(mockUsers).find((user) => user.email === email);
};

export const validateCredentials = (email: string, password: string): MockUser | undefined => {
  const user = findUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return undefined;
};

export const generateMockTokens = (userId: string) => {
  return {
    accessToken: `mock_access_token_${userId}`,
    refreshToken: `mock_refresh_token_${userId}`,
    expiresIn: 3600,
  };
};