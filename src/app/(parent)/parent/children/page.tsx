'use client';

import { Title, Paper, Text, SimpleGrid } from '@mantine/core';

export default function ParentDashboard() {
    return (
        <div>
            <Title order={2} mb="md">Parent Portal</Title>
            <SimpleGrid cols={1}>
                <Paper p="md" withBorder>
                    <Text size="xl" fw={700}>My Children</Text>
                    <Text>Select a child to view details.</Text>
                </Paper>
            </SimpleGrid>
        </div>
    );
}
