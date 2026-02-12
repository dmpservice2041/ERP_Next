'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, getUser } from '@/lib/api';
import { Department } from '@/types';
import { notifications } from '@mantine/notifications';

interface CreateDepartmentRequest {
    name: string;
    code: string;
    alias: string;
}

interface UpdateDepartmentRequest {
    id: string;
    name?: string;
    code?: string;
    alias?: string;
    isActive?: boolean;
}

export function useDepartments() {
    const queryClient = useQueryClient();
    const departments = useQuery({
        queryKey: ['departments'],
        queryFn: async () => apiClient<Department[]>('departments'),
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('erp_access_token'),
        select: (data) => data || []
    });

    const createDepartment = useMutation({
        mutationFn: (data: CreateDepartmentRequest) => {
            return apiClient<Department>('departments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            notifications.show({
                title: 'Success',
                message: 'Department created successfully',
                color: 'green',
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to create department',
                color: 'red',
            });
        },
    });

    const updateDepartment = useMutation({
        mutationFn: ({ id, ...data }: UpdateDepartmentRequest) => {
            return apiClient<Department>(`departments/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            notifications.show({
                title: 'Success',
                message: 'Department updated successfully',
                color: 'green',
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to update department',
                color: 'red',
            });
        },
    });

    const deleteDepartment = useMutation({
        mutationFn: (id: string) => {
            return apiClient(`departments/${id}`, {
                method: 'DELETE',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            notifications.show({
                title: 'Success',
                message: 'Department deleted successfully',
                color: 'green',
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to delete department',
                color: 'red',
            });
        },
    });

    return {
        departments,
        createDepartment,
        updateDepartment,
        deleteDepartment,
    };
}
