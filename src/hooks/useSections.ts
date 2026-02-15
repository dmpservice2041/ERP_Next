'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { SectionEntity } from '@/types';
import { notifications } from '@mantine/notifications';

interface CreateSectionRequest {
    name: string;
    order: number;
}

interface UpdateSectionRequest {
    id: string;
    name?: string;
    order?: number;
    isActive?: boolean;
}

export function useSections(classId?: string) {
    const queryClient = useQueryClient();

    const sections = useQuery({
        queryKey: ['sections', classId],
        queryFn: async () => {
            if (!classId) return [];
            return apiClient<SectionEntity[]>(`classes/${classId}/sections`);
        },
        select: (data) => data || [],
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('erp_access_token') && !!classId,
    });

    const createSection = useMutation({
        mutationFn: (data: CreateSectionRequest) => {
            if (!classId) throw new Error('Class ID is required');
            return apiClient<SectionEntity>(`classes/${classId}/sections`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sections', classId] });
            notifications.show({
                title: 'Success',
                message: 'Section created successfully',
                color: 'green',
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to create section',
                color: 'red',
            });
        },
    });

    const updateSection = useMutation({
        mutationFn: ({ id, ...data }: UpdateSectionRequest) => {
            return apiClient<SectionEntity>(`sections/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sections', classId] });
            notifications.show({
                title: 'Success',
                message: 'Section updated successfully',
                color: 'green',
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to update section',
                color: 'red',
            });
        },
    });

    const deleteSection = useMutation({
        mutationFn: (id: string) => {
            return apiClient(`sections/${id}`, {
                method: 'DELETE',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sections', classId] });
            notifications.show({
                title: 'Success',
                message: 'Section deleted successfully',
                color: 'green',
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to delete section',
                color: 'red',
            });
        },
    });

    return {
        sections,
        createSection,
        updateSection,
        deleteSection,
    };
}
