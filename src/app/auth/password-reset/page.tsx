'use client';

import { Container, Title, Text, TextInput, Button, Paper, Stack, Anchor } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import Link from 'next/link';

export default function PasswordResetRequestPage() {
    const { requestPasswordReset } = useAuth();
    const [submitted, setSubmitted] = useState(false);

    const form = useForm({
        initialValues: { email: '' },
        validate: {
            email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    const handleSubmit = (values: typeof form.values) => {
        requestPasswordReset.mutate(values, {
            onSuccess: () => setSubmitted(true),
        });
    };

    if (submitted) {
        return (
            <Container size={460} my={80}>
                <Paper withBorder shadow="md" p={30} radius="md" ta="center">
                    <Title order={2}>Check your email</Title>
                    <Text c="dimmed" size="sm" mt="md">
                        We have sent a password reset link to <b>{form.values.email}</b>.
                    </Text>
                    <Button variant="light" mt="xl" component={Link} href="/login">
                        Back to Login
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container size={460} my={80}>
            <Paper withBorder shadow="md" p={30} radius="md">
                <Title order={2} ta="center">Forgot your password?</Title>
                <Text c="dimmed" size="sm" ta="center" mt="xs">
                    Enter your email to receive a reset link
                </Text>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack mt="xl">
                        <TextInput
                            label="Email address"
                            placeholder="me@college.edu"
                            required
                            {...form.getInputProps('email')}
                        />
                        <Button type="submit" loading={requestPasswordReset.isPending}>
                            Reset password
                        </Button>
                        <Anchor component={Link} href="/login" size="sm" ta="center">
                            Nevermind, take me back to login
                        </Anchor>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}
