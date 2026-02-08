'use client';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from '@/theme';
import { useState } from 'react';
import { AcademicSessionProvider } from '@/context/AcademicSessionContext';

import '@mantine/notifications/styles.css';
import '@mantine/core/styles.css';
import { ModalsProvider } from '@mantine/modals';

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000, // 5 minutes
                retry: 1,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider theme={theme} defaultColorScheme="light">
                <Notifications position="top-right" />
                <ModalsProvider>
                    <AcademicSessionProvider>
                        {children}
                    </AcademicSessionProvider>
                </ModalsProvider>
            </MantineProvider>
        </QueryClientProvider>
    );
}
