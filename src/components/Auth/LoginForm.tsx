'use client';

import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Box, LoadingOverlay, Text, Group, Anchor } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export function LoginForm() {
    const router = useRouter();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            identifier: '',
            password: '',
            platform: 'WEB' as const,
        },
        validate: {
            identifier: (value: string) => (value.length < 3 ? 'Username/Email is too short' : null),
            password: (value: string) => (value.length < 5 ? 'Password should include at least 5 characters' : null),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setError(null);
        login.mutate(values, {
            onSuccess: (response) => {
                const role = response.user.identity;

                if (role === 'ADMIN') router.push('/admin/dashboard');
                else if (role === 'STAFF') router.push('/staff/dashboard');
                else if (role === 'STUDENT') router.push('/student/profile');
                else if (role === 'PARENT') router.push('/parent/children');
                else router.push('/');
            },
            onError: (err: Error) => {
                setError(err.message || 'Login failed. Please check your credentials.');
            }
        });
    };

    return (
        <Box pos="relative">
            <LoadingOverlay
                visible={login.isPending}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
            />
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    label="Username / Email"
                    placeholder="Enrollment / Phone / Email"
                    required
                    {...form.getInputProps('identifier')}
                />
                <PasswordInput
                    label="Password"
                    placeholder="Your password"
                    required
                    mt="md"
                    {...form.getInputProps('password')}
                />

                <Group justify="flex-end" mt="xs">
                    <Anchor component={Link} href="/auth/password-reset" size="xs">
                        Forgot password?
                    </Anchor>
                </Group>

                {error && (
                    <Text color="red" size="sm" mt="sm">
                        {error}
                    </Text>
                )}

                <Button fullWidth mt="xl" type="submit" loading={login.isPending}>
                    Sign in
                </Button>
            </form>
        </Box>
    );
}
