'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, getUser } from '@/lib/api';
import { AcademicSession } from '@/types';
import { notifications } from '@mantine/notifications';

interface CreateAcademicSessionRequest {
    name: string;
    startDate: string;
    endDate: string;
    isActive?: boolean;
}

interface UpdateAcademicSessionRequest {
    id: string;
    name?: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
}

export function useAcademicSession() {
    const queryClient = useQueryClient();
    const user = getUser();

    const getAcademicSessions = useQuery({
        queryKey: ['academic-sessions'],
        queryFn: async () => apiClient<AcademicSession[]>('academic-sessions'),
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('erp_access_token'),
        select: (data) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const list = Array.isArray(data) ? data : (data as any).data || (data as any).academicSessions || [];
            return list as AcademicSession[];
        }
    });

    const getCurrentSession = useQuery({
        queryKey: ['academic-sessions', 'current'],
        queryFn: async () => apiClient<AcademicSession>('academic-sessions/current'),
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('erp_access_token'),
    });

    const createAcademicSession = useMutation({
        mutationFn: (data: CreateAcademicSessionRequest) => {
            return apiClient<AcademicSession>('academic-sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['academic-sessions'] });
            notifications.show({
                title: 'Success',
                message: 'Academic Session created successfully',
                color: 'green',
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to create academic session',
                color: 'red',
            });
        },
    });

    const updateAcademicSession = useMutation({
        mutationFn: ({ id, ...data }: UpdateAcademicSessionRequest) => {
            return apiClient<AcademicSession>(`academic-sessions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['academic-sessions'] });
            notifications.show({
                title: 'Success',
                message: 'Academic Session updated successfully',
                color: 'green',
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to update academic session',
                color: 'red',
            });
        },
    });

    const deleteAcademicSession = useMutation({
        mutationFn: (id: string) => {
            return apiClient<void>(`academic-sessions/${id}`, {
                method: 'DELETE',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['academic-sessions'] });
            notifications.show({
                title: 'Success',
                message: 'Academic Session deleted successfully',
                color: 'green',
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to delete academic session',
                color: 'red',
            });
        },
    });

    return {
        academicSessions: getAcademicSessions,
        currentSession: getCurrentSession,
        createAcademicSession,
        updateAcademicSession,
        deleteAcademicSession,
    };
}
