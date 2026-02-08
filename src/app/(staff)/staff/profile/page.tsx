'use client';

import { Title, Paper, Text, Avatar, Stack, Group, Divider } from '@mantine/core';
import { useUser } from '@/hooks/useUser';

export default function StaffProfile() {
    const { data: user } = useUser();

    if (!user) return null;

    return (
        <div>
            <Title order={2} mb="md">Staff Profile</Title>
            <Paper p="xl" withBorder radius="md">
                <Group gap="xl">
                    <Avatar src={user.avatar} size={120} radius={120} color="blue">
                        {user.name.charAt(0)}
                    </Avatar>
                    <Stack gap="xs">
                        <Title order={3}>{user.name}</Title>
                        <Text c="dimmed">{user.email}</Text>
                        <Text size="sm" fw={500} c="blue">Role: {user.identity}</Text>
                    </Stack>
                </Group>

                <Divider my="xl" />

                <Stack gap="md">
                    <Text fw={700}>Staff Details</Text>
                    <Group>
                        <Text size="sm" fw={500} w={150}>Staff ID:</Text>
                        <Text size="sm">STF-{user.id.slice(0, 8)}</Text>
                    </Group>
                    <Group>
                        <Text size="sm" fw={500} w={150}>Department:</Text>
                        <Text size="sm">General Academics</Text>
                    </Group>
                    <Group>
                        <Text size="sm" fw={500} w={150}>Status:</Text>
                        <Text size="sm" c="green">Active</Text>
                    </Group>
                </Stack>
            </Paper>
        </div>
    );
}
