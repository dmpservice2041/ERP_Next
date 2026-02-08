'use client';

import { Container, Title, Text, Box, Paper, Center } from '@mantine/core';
import { IconUsers } from '@tabler/icons-react';
import PermissionGuard from '@/components/Auth/PermissionGuard';

export default function StaffMasterPage() {
    return (
        <PermissionGuard requiredPermission="staff.read">
            <Container size="xl" py="xl">
                <Box mb="xl">
                    <Title order={2}>Staff Master</Title>
                    <Text c="dimmed" size="sm">Manage institutional staff profiles</Text>
                </Box>

                <Paper withBorder p="xl" radius="md">
                    <Center py={60} style={{ flexDirection: 'column' }}>
                        <IconUsers size={60} color="gray" style={{ opacity: 0.3 }} />
                        <Title order={4} mt="md" c="dimmed">Staff Profile Management</Title>
                        <Text c="dimmed" size="sm" ta="center" mt="xs">
                            This module is currently being restructured to separate Auth from Data Profiles. <br />
                            Please use 'User Management' for role assignments.
                        </Text>
                    </Center>
                </Paper>
            </Container>
        </PermissionGuard>
    );
}
