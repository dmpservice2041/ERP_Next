'use client';

import { Title, Paper, Text, SimpleGrid } from '@mantine/core';

export default function StaffDashboard() {
    return (
        <div>
            <Title order={2} mb="md">Staff Dashboard</Title>
            <SimpleGrid cols={{ base: 1, sm: 3 }}>
                <Paper p="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>My Classes</Text>
                    <Text size="xl" fw={700}>5</Text>
                </Paper>
                <Paper p="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Pending Attendance</Text>
                    <Text size="xl" fw={700}>2</Text>
                </Paper>
            </SimpleGrid>
        </div>
    );
}
