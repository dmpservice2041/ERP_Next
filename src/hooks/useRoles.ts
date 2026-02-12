'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, getUser } from '@/lib/api';
import { notifications } from '@mantine/notifications';

export interface Permission {
    id: string;
    key: string;
    description: string;
    module: string;
}

export interface Role {
    id: string;
    name: string;
    description?: string;
    permissions: Permission[];
    isSystem: boolean;
}

interface RolesResponse {
    roles: Role[];
}

interface PermissionsResponse {
    permissions: Permission[];
}

interface CreateRoleRequest {
    name: string;
    description?: string;
    permissionIds: string[];
}

interface UpdateRoleRequest {
    name: string;
    description?: string;
    permissionIds: string[];
}

export function useRoles() {
    const queryClient = useQueryClient();
    const user = getUser();

    const rolesQuery = useQuery({
        queryKey: ['roles'],
        queryFn: async () => {
            const token = localStorage.getItem('erp_access_token');
            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            return apiClient<RolesResponse>('roles', { headers });
        },
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('erp_access_token'),
        select: (data) => {
            return (Array.isArray(data) ? data : (data as any).roles || []) as Role[];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const permissionsQuery = useQuery({
        queryKey: ['permissions'],
        queryFn: async () => {
            const token = localStorage.getItem('erp_access_token');
            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            return apiClient<PermissionsResponse>('permissions', { headers });
        },
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('erp_access_token'),
        select: (data) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (Array.isArray(data) ? data : (data as any).permissions || []) as Permission[];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const createRoleMutation = useMutation({
        mutationFn: (data: CreateRoleRequest) => {
            const token = localStorage.getItem('erp_access_token');
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            return apiClient<{ role: Role }>('roles', {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            notifications.show({
                title: 'Success',
                message: 'Role created successfully',
                color: 'green',
            });
        },
    });

    const updateRoleMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateRoleRequest }) => {
            const token = localStorage.getItem('erp_access_token');
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            return apiClient<{ role: Role }>(`roles/${id}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            notifications.show({
                title: 'Success',
                message: 'Role updated successfully',
                color: 'green',
            });
        },
    });

    return {
        roles: rolesQuery,
        permissions: permissionsQuery,
        createRole: createRoleMutation,
        updateRole: updateRoleMutation,
    };
}
