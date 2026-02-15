'use client';

import { Title, Paper, Text, SimpleGrid } from '@mantine/core';

export default function StudentDashboard() {
    return (
        <div>
            <Title order={2} mb="md">Student Profile</Title>
            { }
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <Paper p="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Attendance</Text>
                    <Text size="xl" fw={700}>85%</Text>
                </Paper>
                <Paper p="md" withBorder>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Pending Fees</Text>
                    <Text size="xl" fw={700}>$0.00</Text>
                </Paper>
            </SimpleGrid>
        </div>
    );
}
