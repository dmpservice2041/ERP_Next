import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { User } from '@/types';
import { UserProfile } from '@/types/auth';
import { getUser } from '@/lib/api';

export function useUser() {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => apiClient<UserProfile>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`),
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('erp_access_token'),
        select: (data: any) => {
            const profile = data as UserProfile;
            const name = profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : (profile.email || 'Unknown User');
            return {
                ...profile,
                name,
            } as unknown as User;
        },
        initialData: (): UserProfile | undefined => {
            const user = getUser();
            return user ? (user as UserProfile) : undefined;
        },
        retry: 1,
    });
}
