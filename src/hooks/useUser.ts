import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { User } from '@/types';
import { UserProfile } from '@/types/auth';
import { getUser } from '@/lib/api';

export function useUser() {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => apiClient<UserProfile>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`),
        select: (data: UserProfile) => {
            const name = data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : (data.email || 'Unknown User');
            return {
                ...data,
                name,
            } as unknown as User;
        },
        initialData: (): UserProfile | undefined => {
            const user = getUser();
            return user ? (user as UserProfile) : undefined;
        },
        retry: false,
        staleTime: Infinity, // Rely on localStorage for now since API is 404
    });
}
