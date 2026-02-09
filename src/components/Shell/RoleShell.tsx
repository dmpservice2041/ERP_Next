'use client';

import { useUser } from '@/hooks/useUser';
import { MainAppShell } from './MainAppShell';
import { Role } from '@/types';
import { Center, Loader, Text, Button } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface RoleShellProps {
    children: React.ReactNode;
    requiredRole: Role;
}

export function RoleShell({ children, requiredRole }: RoleShellProps) {
    const { data: user, isLoading } = useUser();
    const router = useRouter();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;


        if (!isLoading && !user) {

            router.push('/login');
        } else if (!isLoading && user && user.identity !== requiredRole) {

        }
    }, [user, isLoading, requiredRole, router, mounted]);

    // Force loading state during SSR and initial client mount to prevent hydration mismatch
    // because useUser() reads from localStorage which is available immediately on client but not server.
    if (!mounted || isLoading) {
        return (
            <Center h="100vh">
                <Loader size="xl" />
            </Center>
        );
    }

    if (!user || user.identity !== requiredRole) {

        return (
            <Center h="100vh" style={{ flexDirection: 'column' }}>
                <Text c="red" fw={700} size="xl">Access Denied</Text>
                <Text size="sm">Expected: {requiredRole}</Text>
                <Text size="sm">Actual: {user?.identity || 'Guest'}</Text>
                <Button mt="md" onClick={() => router.push('/login')}>Go to Login</Button>
            </Center>
        );
    }

    return <MainAppShell user={user}>{children}</MainAppShell>;
}
