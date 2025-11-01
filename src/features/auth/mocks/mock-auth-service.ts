import type { IAuthResponse, ILoginRequest, ISignupRequest } from '../types';
import { UserRole } from '../types';
import {
  validateCredentials,
  generateMockTokens,
  findUserByEmail,
  mockUsers,
} from './mock-users';

/**
 * Mock Login
 * Simulates API login with mock users
 */
export const mockLogin = async (credentials: ILoginRequest): Promise<IAuthResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const user = validateCredentials(credentials.email, credentials.password);

  if (!user) {
    throw {
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password',
      status: 401,
    };
  }

  const tokens = generateMockTokens(user.id);

  return {
    statusCode: 200,
    message: 'Login successful',
    success: true,
    data: {
      user: {
        _id: user.id,
        id: user.id,
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: [{ name: user.role.toUpperCase() }],
        avatar: user.avatar,
        isVerified: true,
        permissions: user.permissions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      tokens,
    },
  };
};

/**
 * Mock Signup
 * Simulates user registration
 */
export const mockSignup = async (credentials: ISignupRequest): Promise<IAuthResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Check if user already exists
  const existingUser = findUserByEmail(credentials.email);
  if (existingUser) {
    throw {
      code: 'USER_ALREADY_EXISTS',
      message: 'A user with this email already exists',
      status: 409,
    };
  }

  // Create new mock user  
  const newUserId = `user-${Date.now()}`;
  const userName = credentials.name || 'User';

  // In a real app, you'd save to database
  console.log('New user created (mock):', { id: newUserId, email: credentials.email, name: userName });

  return {
    statusCode: 201,
    message: 'Registration successful! Please check your email to verify your account.',
    success: true,
    data: {
      _id: newUserId,
      id: newUserId,
      email: credentials.email,
      name: userName,
      role: [{ name: UserRole.USER }],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
      isVerified: false,
      permissions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
};

/**
 * Mock Logout
 */
export const mockLogout = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  console.log('User logged out (mock)');
};

/**
 * Mock Get Current User
 */
export const mockGetCurrentUser = async (userId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const user = Object.values(mockUsers).find((u) => u.id === userId);
  if (!user) {
    throw {
      code: 'UNAUTHORIZED',
      message: 'User not found',
      status: 401,
    };
  }

  return {
    _id: user.id,
    id: user.id,
    email: user.email,
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    role: [{ name: user.role.toUpperCase() }],
    avatar: user.avatar,
    isVerified: true,
    permissions: user.permissions,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Mock Token Refresh
 */
export const mockRefreshToken = async (refreshToken: string) => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Extract user ID from mock token
  const match = refreshToken.match(/mock_refresh_token_([^_]+)_/);
  if (!match) {
    throw {
      code: 'INVALID_TOKEN',
      message: 'Invalid refresh token',
      status: 401,
    };
  }

  const userId = match[1];
  return generateMockTokens(userId);
};