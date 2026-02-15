'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Container, Text, Title, Paper, Stack } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
import { hasPermission } from '@/utils/permissions';
import { useUser } from '@/hooks/useUser';

interface PermissionGuardProps {
    children: ReactNode;
    requiredPermission: string;
}

export default function PermissionGuard({ children, requiredPermission }: PermissionGuardProps) {
    const { data: user, isLoading } = useUser();
    const router = useRouter();

    if (isLoading) {
        return null; 
    }

    if (!user) {
        
        
        return null;
    }

    if (!hasPermission(user.permissions, requiredPermission)) {
        return (
            <Container size="sm" py={100}>
                <Paper p="xl" radius="md" withBorder>
                    <Stack align="center" gap="lg">
                        <IconLock size={50} color="red" />
                        <Title order={2}>Access Denied</Title>
                        <Text c="dimmed" ta="center">
                            You do not have permission to access this page.
                            <br />
                            Required permission: <Text span fw={700} c="red">{requiredPermission}</Text>
                        </Text>
                        <Button variant="light" onClick={() => router.back()}>
                            Go Back
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        );
    }

    return <>{children}</>;
}
