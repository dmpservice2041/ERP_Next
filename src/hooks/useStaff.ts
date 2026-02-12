'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, getUser } from '@/lib/api';
import { notifications } from '@mantine/notifications';
import { Staff, CreateStaffRequest } from '@/types';

export function useStaffList() {
    const user = getUser();
    const institutionId = user?.institutionId;

    return useQuery({
        queryKey: ['staff'],
        queryFn: () => apiClient<{ staff: Staff[] }>('staff'),
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('erp_access_token'),
        select: (data) => data.staff,
    });
}

export function useStaff(id?: string) {
    const user = getUser();

    return useQuery({
        queryKey: ['staff', id],
        queryFn: () => apiClient<{ staff: Staff }>(`staff/${id}`),
        select: (data) => data.staff,
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('erp_access_token') && !!id,
    });
}

export function useCreateStaff() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateStaffRequest) =>
            apiClient<{ staff: Staff; credentials: { email: string; temporaryPassword: string } }>('staff', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff'] });
            notifications.show({
                title: 'Success',
                message: 'Staff member created successfully',
                color: 'green',
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to create staff member',
                color: 'red',
            });
        },
    });
}
