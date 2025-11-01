import type { Permission } from "@/features/authorization/types/ability.types";

// types/user.types.ts
export interface IRole {
  _id: string;
  name: string;
  description: string;
  permissions: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IUser {
  _id: string;
  id?: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: IRole[]; // Array of role objects
  age?: number;
  profileImage?: string;
  avatar?: string;
  isVerified: boolean;
  // permissions?: Permission[];
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data?:
    | IUser
    | {
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
