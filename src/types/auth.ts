import { Role } from './index';

export type Platform = 'WEB' | 'ANDROID' | 'IOS';

export interface LoginRequest {
    identifier: string;
    password: string;
    platform: Platform;
}

export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    identity: Role;
    isActive: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    roles: any[];
    permissions: string[];
}

export interface LoginResponse {
    user: UserProfile;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface RefreshRequest {
    refreshToken: string;
}

export interface RefreshResponse {
    accessToken: string;
    expiresIn: number;
}

export interface Session {
    id: string;
    deviceInfo: string;
    ipAddress: string;
    lastActive: string;
    isCurrent: boolean;
}

export interface PasswordResetRequest {
    email: string;
}

export interface PasswordResetConfirmRequest {
    token: string;
    newPassword: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}
