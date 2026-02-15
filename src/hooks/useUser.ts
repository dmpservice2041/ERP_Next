import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { User } from '@/types';
import { UserProfile } from '@/types/auth';
export function useUser() {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => apiClient<UserProfile>('auth/me'),
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('erp_access_token'),
        select: (data: any) => {
            const profile = (data.user || data) as UserProfile;
            const name = profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : (profile.email || 'Unknown User');
            return {
                ...profile,
                name,
            } as unknown as User;
        },
        retry: 1,
    });
}
