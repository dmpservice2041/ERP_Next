'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { UserProfile } from '@/types/auth'; // Using UserProfile from auth types
import { notifications } from '@mantine/notifications';

interface StaffUsersResponse {
    users: UserProfile[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}

interface AssignRoleRequest {
    userId: string;
    roleId: string;  // API expects single roleId string
}

interface RemoveRoleRequest {
    userId: string;
    roleId: string;
}

export function useUserManagement() {
    const queryClient = useQueryClient();

    const getStaffUsers = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const token = localStorage.getItem('erp_access_token');
            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            return apiClient<StaffUsersResponse>('users', { headers });
        },
        select: (data) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (Array.isArray(data) ? data : (data as any).users || []) as UserProfile[];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const assignRoleMutation = useMutation({
        mutationFn: ({ userId, roleId }: AssignRoleRequest) => {
            const token = localStorage.getItem('erp_access_token');
            return apiClient<void>(`users/${userId}/roles`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roleId }),  // Send roleId as per API docs
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            notifications.show({
                title: 'Success',
                message: 'Role assigned successfully. Changes will apply on next login.',
                color: 'blue',
            });
        },
    });

    const removeRoleMutation = useMutation({
        mutationFn: ({ userId, roleId }: RemoveRoleRequest) => {
            const token = localStorage.getItem('erp_access_token');
            return apiClient<void>(`users/${userId}/roles/${roleId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            notifications.show({
                title: 'Success',
                message: 'Role removed successfully. Changes will apply on next login.',
                color: 'orange',
            });
        },
    });

    return {
        staffUsers: getStaffUsers,
        assignRole: assignRoleMutation,
        removeRole: removeRoleMutation,
    };
}
