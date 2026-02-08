'use client';

import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { User } from '@/types';
import { ReactNode } from 'react';

interface MainAppShellProps {
    children: ReactNode;
    user: User;
}

export function MainAppShell({ children, user }: MainAppShellProps) {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Header opened={opened} toggle={toggle} user={user} />
            </AppShell.Header>

            <Sidebar user={user} />

            <AppShell.Main bg="gray.0">{children}</AppShell.Main>
        </AppShell>
    );
}
