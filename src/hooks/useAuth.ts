'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, setAccessToken, removeAccessToken } from '@/lib/api';
import { LoginRequest, LoginResponse, Session, PasswordResetRequest, PasswordResetConfirmRequest, ChangePasswordRequest } from '@/types/auth'; 
import { useRouter } from 'next/navigation';

export function useAuth() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const loginMutation = useMutation({
        mutationFn: (data: LoginRequest) =>
            apiClient<LoginResponse>('auth/login', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
        onSuccess: (data) => {
            setAccessToken(data.accessToken);
            queryClient.setQueryData(['user'], data.user);
            
        },
    });

    const logoutMutation = useMutation({
        mutationFn: () => apiClient('auth/logout', { method: 'POST' }),
        onSuccess: () => {
            removeAccessToken();
            queryClient.setQueryData(['user'], null);
            router.push('/login');
        },
    });

    const logoutAllMutation = useMutation({
        mutationFn: () => apiClient('auth/logout-all', { method: 'POST' }),
        onSuccess: () => {
            removeAccessToken();
            queryClient.setQueryData(['user'], null);
            router.push('/login');
        },
    });

    const sessionsQuery = useQuery({
        queryKey: ['sessions'],
        queryFn: () => apiClient<{ sessions: Session[] }>('auth/sessions'),
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('erp_access_token'),
        retry: false,
    });

    const requestPasswordResetMutation = useMutation({
        mutationFn: (data: PasswordResetRequest) =>
            apiClient('auth/password-reset/request', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
    });

    const confirmPasswordResetMutation = useMutation({
        mutationFn: (data: PasswordResetConfirmRequest) =>
            apiClient('auth/password-reset/confirm', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
    });

    const changePasswordMutation = useMutation({
        mutationFn: (data: ChangePasswordRequest) => {
            const token = localStorage.getItem('erp_access_token');
            return apiClient('auth/change-password', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
        },
    });

    return {
        login: loginMutation,
        logout: logoutMutation,
        logoutAll: logoutAllMutation,
        sessions: sessionsQuery,
        requestPasswordReset: requestPasswordResetMutation,
        confirmPasswordReset: confirmPasswordResetMutation,
        changePassword: changePasswordMutation,
    };
}
