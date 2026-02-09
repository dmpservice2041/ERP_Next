'use client';

import { AppShell, ScrollArea, NavLink, Text, Stack, Divider, Box, ThemeIcon, Group, UnstyledButton, rem } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { MENU_ITEMS, NavItem } from '@/config/navigation';
import { User } from '@/types';
import { hasPermission } from '@/utils/permissions';
import { IconLayoutDashboard, IconChevronRight } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface SidebarProps {
    user: User;
}

interface LinksGroupProps {
    item: NavItem;
    user: User;
    activeLink?: string | null;
}


function findBestMatch(items: NavItem[], pathname: string): string | null {
    let bestMatch: string | null = null;
    let maxLen = 0;

    const traverse = (list: NavItem[]) => {
        for (const item of list) {

            if (item.link && (pathname === item.link || pathname.startsWith(item.link + '/'))) {

                if (item.link.length > maxLen) {
                    maxLen = item.link.length;
                    bestMatch = item.link;
                }
            }

            if (item.links) {
                traverse(item.links);
            }
        }
    };

    traverse(items);
    return bestMatch;
}

function LinksGroup({ item, user, activeLink }: LinksGroupProps) {
    const router = useRouter();
    const pathname = usePathname();


    const hasItemPermission = user.identity === 'ADMIN' || !item.permission || hasPermission(user.permissions, item.permission);
    if (!hasItemPermission) return null;


    const hasChildItems = item.links && item.links.length > 0;


    const isActive = item.link === activeLink;


    const isChildActive = hasChildItems && item.links?.some(child => {

        if (child.link === activeLink) return true;

        const containsActive = (node: NavItem): boolean => {
            if (node.link === activeLink) return true;
            return node.links?.some(containsActive) || false;
        };
        return containsActive(child);
    });

    const initiallyOpened = item.initiallyOpened || isChildActive;

    if (hasChildItems) {

        return (
            <NavLink
                label={
                    <Text size="sm" fw={500}>
                        {item.label}
                    </Text>
                }
                leftSection={
                    <ThemeIcon variant="light" size="sm" color="indigo" radius="md">
                        <item.icon size={16} stroke={1.5} />
                    </ThemeIcon>
                }
                childrenOffset={36}
                defaultOpened={initiallyOpened}
                style={{
                    borderRadius: 'var(--mantine-radius-md)',
                    fontWeight: 500,
                }}
            >
                {item.links?.map((child) => (
                    <LinksGroup key={child.label} item={child} user={user} activeLink={activeLink} />
                ))}
            </NavLink>
        );
    }


    return (
        <NavLink
            component="a"
            href={item.link || '#'}
            onClick={(event) => {
                event.preventDefault();
                if (item.link) router.push(item.link);
            }}
            label={item.label}
            active={isActive}
            leftSection={
                <ThemeIcon variant={isActive ? 'filled' : 'light'} size="sm" color="indigo" radius="md">
                    <item.icon size={16} stroke={1.5} />
                </ThemeIcon>
            }
            variant="light"
            style={{
                borderRadius: 'var(--mantine-radius-md)',
            }}
        />
    );
}

export function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();


    const activeLink = findBestMatch(MENU_ITEMS, pathname);

    return (
        <AppShell.Navbar
            p="md"
            style={{
                background: 'linear-gradient(180deg, var(--mantine-color-gray-0) 0%, var(--mantine-color-white) 100%)',
                borderRight: '1px solid var(--mantine-color-gray-2)',
            }}
        >
            {/* Brand Section */}
            <AppShell.Section mb="xl">
                <Group gap="xs" px="xs">
                    <ThemeIcon
                        size="xl"
                        radius="md"
                        variant="gradient"
                        gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
                    >
                        <IconLayoutDashboard size={24} color="white" />
                    </ThemeIcon>
                    <Box>
                        <Text size="lg" fw={800} c="dark" style={{ letterSpacing: '-0.5px' }}>College ERP</Text>
                        <Text size="xs" c="dimmed" fw={600} tt="uppercase">Admin Panel</Text>
                    </Box>
                </Group>
            </AppShell.Section>

            {/* Navigation Sections */}
            <AppShell.Section grow component={ScrollArea} scrollbarSize={6}>
                <Stack gap={4}>
                    {MENU_ITEMS.map((item) => (
                        <LinksGroup key={item.label} item={item} user={user} activeLink={activeLink} />
                    ))}
                </Stack>
            </AppShell.Section>

            {/* User Info at Bottom */}
            <AppShell.Section>
                <Divider my="sm" />
                <UnstyledButton
                    w="100%"
                    p="xs"
                    style={{
                        borderRadius: 'var(--mantine-radius-md)',
                        transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                    <Group>
                        <ThemeIcon variant="light" radius="xl" size="lg" color="gray">
                            <IconChevronRight size={18} />
                        </ThemeIcon>
                        <Box style={{ flex: 1 }}>
                            <Text size="sm" fw={600} truncate>{user.name}</Text>
                            <Text size="xs" c="dimmed" truncate>{user.email}</Text>
                        </Box>
                    </Group>
                </UnstyledButton>
            </AppShell.Section>
        </AppShell.Navbar>
    );
}
