'use client';

import { Container, Title, Text, PasswordInput, Button, Paper, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAuth } from '@/hooks/useAuth';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetConfirmContent() {
    const { confirmPasswordReset } = useAuth();
    const searchParams = useSearchParams();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const t = searchParams.get('token');
        
        setToken(t);
    }, [searchParams]);

    const form = useForm({
        initialValues: {
            newPassword: '',
            confirmPassword: '',
        },
        validate: {
            newPassword: (value: string) => (value.length < 8 ? 'Password must be at least 8 characters' : null),
            confirmPassword: (value: string, values: { newPassword: string }) => (value !== values.newPassword ? 'Passwords do not match' : null),
        },
    });

    const handleSubmit = (values: typeof form.values) => {
        if (!token) return;
        confirmPasswordReset.mutate({
            token,
            newPassword: values.newPassword,
        });
    };

    if (!token) {
        return (
            <Container size={460} my={80}>
                <Paper withBorder shadow="md" p={30} radius="md" ta="center">
                    <Title order={2}>Invalid Link</Title>
                    <Text c="dimmed" mt="md">The password reset link is invalid or has expired.</Text>
                    <Button fullWidth mt="xl" component={Link} href="/login">Back to Login</Button>
                </Paper>
            </Container>
        );
    }

    if (confirmPasswordReset.isSuccess) {
        return (
            <Container size={460} my={80}>
                <Paper withBorder shadow="md" p={30} radius="md" ta="center">
                    <Title order={2}>Password Reset Successful</Title>
                    <Text c="dimmed" mt="md">Your password has been updated. You can now login with your new password.</Text>
                    <Button fullWidth mt="xl" component={Link} href="/login">Go to Login</Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container size={460} my={80}>
            <Paper withBorder shadow="md" p={30} radius="md">
                <Title order={2} ta="center">Set New Password</Title>
                <Text c="dimmed" size="sm" ta="center" mt="xs">
                    Please enter your new password below
                </Text>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack mt="xl">
                        <PasswordInput
                            label="New Password"
                            placeholder="Your new password"
                            required
                            {...form.getInputProps('newPassword')}
                        />
                        <PasswordInput
                            label="Confirm New Password"
                            placeholder="Confirm your new password"
                            required
                            {...form.getInputProps('confirmPassword')}
                        />
                        <Button type="submit" loading={confirmPasswordReset.isPending}>
                            Update Password
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}

export default function PasswordResetConfirmPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetConfirmContent />
        </Suspense>
    );
}
