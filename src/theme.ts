'use client';

import { createTheme, MantineColorsTuple } from '@mantine/core';

// Modern indigo/blue primary color palette
const primaryColor: MantineColorsTuple = [
    '#eef2ff',
    '#e0e7ff',
    '#c7d2fe',
    '#a5b4fc',
    '#818cf8',
    '#6366f1',  // Primary shade (index 5)
    '#4f46e5',
    '#4338ca',
    '#3730a3',
    '#312e81',
];

// Accent color for highlights
const accentColor: MantineColorsTuple = [
    '#ecfdf5',
    '#d1fae5',
    '#a7f3d0',
    '#6ee7b7',
    '#34d399',
    '#10b981',  // Accent shade
    '#059669',
    '#047857',
    '#065f46',
    '#064e3b',
];

export const theme = createTheme({
    primaryColor: 'indigo',
    colors: {
        indigo: primaryColor,
        emerald: accentColor,
    },
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    headings: {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
        fontWeight: '600',
    },
    defaultRadius: 'md',
    shadows: {
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    components: {
        Button: {
            defaultProps: {
                radius: 'md',
            },
        },
        Paper: {
            defaultProps: {
                radius: 'md',
                shadow: 'sm',
            },
        },
        Card: {
            defaultProps: {
                radius: 'md',
                shadow: 'sm',
            },
        },
        NavLink: {
            styles: {
                root: {
                    borderRadius: 'var(--mantine-radius-md)',
                    marginBottom: '4px',
                },
            },
        },
    },
});
