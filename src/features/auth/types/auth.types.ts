import type { Permission } from '@/features/authorization/types/ability.types';

export const UserRole = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  USER: 'USER',
  GUEST: 'GUEST',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface IUser {
  _id: string;
  id?: string; // For backward compatibility
  email: string;
  name: string;
  firstName?: string; // For backward compatibility
  lastName?: string; // For backward compatibility
  role: any[]; // Array of role objects from backend
  age?: number;
  profileImage?: string;
  avatar?: string; // For backward compatibility
  isVerified: boolean;
  permissions?: Permission[];
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data?: IUser | {
    user: IUser;
    tokens?: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ISignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age?: number;
  profileImage?: string;
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}

export interface IRefreshTokenResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: {
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}