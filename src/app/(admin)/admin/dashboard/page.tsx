'use client';

import {
    Title,
    Paper,
    Text,
    SimpleGrid,
    Container,
    Group,
    ThemeIcon,
    Button,
    Box,
} from '@mantine/core';
import {
    IconUsers,
    IconSchool,
    IconUserCheck,
    IconCalendarEvent,
    IconPlus,
    IconArrowUpRight,
} from '@tabler/icons-react';
import { useUser } from '@/hooks/useUser';

interface StatCardProps {
    title: string;
    value: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    trend?: string;
}

function StatCard({ title, value, description, icon, color, trend }: StatCardProps) {
    return (
        <Paper
            p="lg"
            radius="md"
            shadow="sm"
            style={{
                background: 'white',
                border: '1px solid var(--mantine-color-gray-2)',
                transition: 'all 0.2s ease',
            }}
        >
            <Group justify="space-between" align="flex-start">
                <Box>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                        {title}
                    </Text>
                    <Group gap="xs" align="baseline" mt={4}>
                        <Text size="xl" fw={700} style={{ fontSize: '2rem' }}>
                            {value}
                        </Text>
                        {trend && (
                            <Text size="xs" c="teal" fw={500}>
                                <IconArrowUpRight size={12} /> {trend}
                            </Text>
                        )}
                    </Group>
                    <Text size="xs" c="dimmed" mt={4}>
                        {description}
                    </Text>
                </Box>
                <ThemeIcon
                    size="xl"
                    radius="md"
                    variant="light"
                    color={color}
                >
                    {icon}
                </ThemeIcon>
            </Group>
        </Paper>
    );
}

export default function AdminDashboard() {
    const { data: user } = useUser();

    const stats = [
        {
            title: 'Total Users',
            value: '1,234',
            description: 'All registered accounts',
            icon: <IconUsers size={24} />,
            color: 'indigo',
            trend: '+12%',
        },
        {
            title: 'Active Students',
            value: '850',
            description: 'Currently enrolled',
            icon: <IconSchool size={24} />,
            color: 'teal',
            trend: '+5%',
        },
        {
            title: 'Staff Members',
            value: '120',
            description: 'Teaching & non-teaching',
            icon: <IconUserCheck size={24} />,
            color: 'violet',
        },
        {
            title: 'Academic Session',
            value: '2024-25',
            description: 'Current session',
            icon: <IconCalendarEvent size={24} />,
            color: 'orange',
        },
    ];

    return (
        <Container size="xl" py="xl">
            {/* Welcome Section */}
            <Paper
                p="xl"
                radius="md"
                mb="xl"
                style={{
                    background: 'linear-gradient(135deg, var(--mantine-color-indigo-6) 0%, var(--mantine-color-indigo-8) 100%)',
                    color: 'white',
                }}
            >
                <Group justify="space-between" align="center">
                    <Box>
                        <Text size="sm" opacity={0.8} mb={4}>
                            Welcome back,
                        </Text>
                        <Title order={2} fw={600}>
                            {user?.name || 'User'}
                        </Title>
                        <Text size="sm" opacity={0.8} mt={8}>
                            Here&apos;s what&apos;s happening with your institution today.
                        </Text>
                    </Box>
                    <Group visibleFrom="sm">
                        <Button
                            variant="white"
                            color="indigo"
                            leftSection={<IconPlus size={16} />}
                        >
                            Quick Action
                        </Button>
                    </Group>
                </Group>
            </Paper>

            {/* Stats Grid */}
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" mb="xl">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </SimpleGrid>

            {/* Quick Actions */}
            <Title order={4} mb="md">Quick Actions</Title>
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                <Paper
                    p="md"
                    radius="md"
                    style={{
                        cursor: 'pointer',
                        border: '1px solid var(--mantine-color-gray-2)',
                        transition: 'all 0.2s ease',
                    }}
                >
                    <Group>
                        <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                            <IconUsers size={20} />
                        </ThemeIcon>
                        <Box>
                            <Text size="sm" fw={500}>Manage Users</Text>
                            <Text size="xs" c="dimmed">Add or edit user accounts</Text>
                        </Box>
                    </Group>
                </Paper>
                <Paper
                    p="md"
                    radius="md"
                    style={{
                        cursor: 'pointer',
                        border: '1px solid var(--mantine-color-gray-2)',
                        transition: 'all 0.2s ease',
                    }}
                >
                    <Group>
                        <ThemeIcon size="lg" radius="md" variant="light" color="violet">
                            <IconSchool size={20} />
                        </ThemeIcon>
                        <Box>
                            <Text size="sm" fw={500}>Add Student</Text>
                            <Text size="xs" c="dimmed">Enroll new students</Text>
                        </Box>
                    </Group>
                </Paper>
                <Paper
                    p="md"
                    radius="md"
                    style={{
                        cursor: 'pointer',
                        border: '1px solid var(--mantine-color-gray-2)',
                        transition: 'all 0.2s ease',
                    }}
                >
                    <Group>
                        <ThemeIcon size="lg" radius="md" variant="light" color="teal">
                            <IconCalendarEvent size={20} />
                        </ThemeIcon>
                        <Box>
                            <Text size="sm" fw={500}>Academic Settings</Text>
                            <Text size="xs" c="dimmed">Configure academic sessions</Text>
                        </Box>
                    </Group>
                </Paper>
            </SimpleGrid>
        </Container>
    );
}
