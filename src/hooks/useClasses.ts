'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { ClassEntity } from '@/types';
import { notifications } from '@mantine/notifications';

interface CreateClassRequest {
    name: string;
    departmentId: string;
    academicSessionId: string;
}

interface UpdateClassRequest {
    id: string;
    name?: string;
    departmentId?: string;
    isActive?: boolean;
}

export function useClasses(academicSessionId?: string, departmentId?: string) {
    const queryClient = useQueryClient();

    const classes = useQuery({
        queryKey: ['classes', academicSessionId, departmentId],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (academicSessionId) params.append('academicSessionId', academicSessionId);
            if (departmentId) params.append('departmentId', departmentId);

            return apiClient<ClassEntity[]>(`classes?${params.toString()}`);
        },
        select: (data) => data || [],
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('erp_access_token') && !!academicSessionId, 
    });

    const createClass = useMutation({
        mutationFn: (data: CreateClassRequest) => {
            return apiClient<ClassEntity>('classes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] });
            notifications.show({
                title: 'Success',
                message: 'Class created successfully',
                color: 'green',
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to create class',
                color: 'red',
            });
        },
    });

    const updateClass = useMutation({
        mutationFn: ({ id, ...data }: UpdateClassRequest) => {
            return apiClient<ClassEntity>(`classes/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] });
            notifications.show({
                title: 'Success',
                message: 'Class updated successfully',
                color: 'green',
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to update class',
                color: 'red',
            });
        },
    });

    const deleteClass = useMutation({
        mutationFn: (id: string) => {
            return apiClient(`classes/${id}`, {
                method: 'DELETE',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] });
            notifications.show({
                title: 'Success',
                message: 'Class deleted successfully',
                color: 'green',
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to delete class',
                color: 'red',
            });
        },
    });

    return {
        classes,
        createClass,
        updateClass,
        deleteClass,
    };
}

export function useClass(id: string) {

    return useQuery({
        queryKey: ['classes', id],
        queryFn: async () => apiClient<ClassEntity>(`classes/${id}`),
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('erp_access_token') && !!id,
    });
}
