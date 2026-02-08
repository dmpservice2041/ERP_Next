'use client';

import { Group, Burger, Text, Avatar, Menu, UnstyledButton, rem, Box, ActionIcon, Indicator, Tooltip } from '@mantine/core';
import { IconLogout, IconChevronDown, IconUser, IconLock, IconBell } from '@tabler/icons-react';
import { AcademicSessionSelect } from '@/components/Common/AcademicSessionSelect';
import { User } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface HeaderProps {
    opened: boolean;
    toggle: () => void;
    user: User;
}

export function Header({ opened, toggle, user }: HeaderProps) {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout.mutate();
    };

    const getProfileHref = () => {
        switch (user.identity) {
            case 'ADMIN': return '/admin/profile';
            case 'STAFF': return '/staff/profile';
            case 'STUDENT': return '/student/profile';
            case 'PARENT': return '/parent/profile';
            default: return '#';
        }
    };

    return (
        <Group
            h="100%"
            px="md"
            justify="space-between"
            style={{
                borderBottom: '1px solid var(--mantine-color-gray-2)',
                background: 'white',
            }}
        >
            <Group>
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                <Text
                    fw={700}
                    size="lg"
                    component={Link}
                    href="/"
                    visibleFrom="sm"
                    style={{
                        textDecoration: 'none',
                        color: 'var(--mantine-color-indigo-6)',
                        letterSpacing: '-0.5px',
                    }}
                >
                    College ERP
                </Text>
            </Group>

            <Group gap="md">
                <AcademicSessionSelect />

                {/* Notification Bell */}
                <Tooltip label="Notifications" position="bottom">
                    <Indicator inline processing color="red" size={8} offset={4}>
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            size="lg"
                            radius="md"
                        >
                            <IconBell size={20} stroke={1.5} />
                        </ActionIcon>
                    </Indicator>
                </Tooltip>

                {/* User Menu */}
                <Menu shadow="lg" width={220} position="bottom-end" withArrow>
                    <Menu.Target>
                        <UnstyledButton
                            p="xs"
                            style={{
                                borderRadius: 'var(--mantine-radius-md)',
                                transition: 'background 0.15s ease',
                            }}
                            className="hover-bg-gray"
                        >
                            <Group gap="sm">
                                <Avatar
                                    src={user.avatar}
                                    radius="xl"
                                    size={36}
                                    color="indigo"
                                    variant="filled"
                                >
                                    {user.name?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box visibleFrom="sm">
                                    <Text size="sm" fw={500} lh={1.2}>
                                        {user.name}
                                    </Text>
                                    <Text c="dimmed" size="xs" lh={1.2}>
                                        {user.identity}
                                    </Text>
                                </Box>
                                <IconChevronDown
                                    style={{ width: rem(14), height: rem(14) }}
                                    stroke={1.5}
                                    color="var(--mantine-color-dimmed)"
                                />
                            </Group>
                        </UnstyledButton>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Label>Account</Menu.Label>
                        <Menu.Item
                            component={Link}
                            href={getProfileHref()}
                            leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                        >
                            My Profile
                        </Menu.Item>
                        <Menu.Item
                            component={Link}
                            href="/auth/change-password"
                            leftSection={<IconLock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                        >
                            Change Password
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                            color="red"
                            leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                            onClick={handleLogout}
                        >
                            Logout
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Group>
        </Group>
    );
}
