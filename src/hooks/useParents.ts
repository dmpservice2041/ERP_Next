'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { notifications } from '@mantine/notifications';
import { Parent, RegisterParentRequest } from '@/types';

export function useParent(id?: string) {

    return useQuery({
        queryKey: ['parent', id],
        queryFn: () => apiClient<{ parent: Parent }>(`parents/${id}`),
        select: (data) => data.parent,
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('erp_access_token') && !!id,
    });
}

export function useRegisterParent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: RegisterParentRequest) =>
            apiClient<{ parent: Parent; credentials: { phone: string; temporaryPassword: string } }>('parents/register', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parents'] });
            notifications.show({
                title: 'Success',
                message: 'Parent registered successfully',
                color: 'green',
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to register parent',
                color: 'red',
            });
        },
    });
}
