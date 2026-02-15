'use client';

import {
    PasswordInput,
    Button,
    Paper,
    Title,
    Stack,
    Container,
    Text,
    Alert,
    Box,
    ThemeIcon,
    Progress,
    List,
    Center,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAuth } from '@/hooks/useAuth';
import { IconLock, IconCheck, IconAlertCircle, IconArrowLeft, IconShieldCheck, IconX } from '@tabler/icons-react';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

function getPasswordStrength(password: string): number {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) || /[^a-zA-Z0-9]/.test(password)) strength += 25;
    return strength;
}

function getStrengthColor(strength: number): string {
    if (strength < 50) return 'red';
    if (strength < 75) return 'yellow';
    return 'green';
}

export default function ChangePasswordPage() {
    const router = useRouter();
    const { changePassword } = useAuth();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validate: {
            currentPassword: (value: string) => (value ? null : 'Current password is required'),
            newPassword: (value: string) => (value.length < 8 ? 'Password must be at least 8 characters' : null),
            confirmPassword: (value: string, values: { newPassword: string }) =>
                value !== values.newPassword ? 'Passwords do not match' : null,
        },
    });

    const passwordStrength = useMemo(() => getPasswordStrength(form.values.newPassword), [form.values.newPassword]);

    const requirements = [
        { label: 'At least 8 characters', meets: form.values.newPassword.length >= 8 },
        { label: 'Contains lowercase letter', meets: /[a-z]/.test(form.values.newPassword) },
        { label: 'Contains uppercase letter', meets: /[A-Z]/.test(form.values.newPassword) },
        { label: 'Contains number or special character', meets: /[0-9]/.test(form.values.newPassword) || /[^a-zA-Z0-9]/.test(form.values.newPassword) },
    ];

    const handleSubmit = (values: typeof form.values) => {
        setSuccess(false);
        setError(null);

        changePassword.mutate({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
        }, {
            onSuccess: () => {
                setSuccess(true);
                form.reset();
            },
            onError: (err: Error) => {
                setError(err.message || 'Failed to change password. Please try again.');
            }
        });
    };

    return (
        <Box
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, var(--mantine-color-indigo-1) 0%, var(--mantine-color-gray-0) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--mantine-spacing-md)',
            }}
        >
            <Container size="xs" w="100%">
                <Paper
                    p="xl"
                    radius="lg"
                    shadow="lg"
                    style={{
                        background: 'white',
                        border: '1px solid var(--mantine-color-gray-2)',
                    }}
                >
                    { }
                    <Center mb="lg">
                        <ThemeIcon
                            size={60}
                            radius="xl"
                            variant="gradient"
                            gradient={{ from: 'indigo', to: 'violet', deg: 45 }}
                        >
                            <IconShieldCheck size={32} />
                        </ThemeIcon>
                    </Center>

                    <Title order={2} ta="center" mb={4}>
                        Change Password
                    </Title>
                    <Text size="sm" c="dimmed" ta="center" mb="xl">
                        Keep your account secure with a strong password
                    </Text>

                    {success && (
                        <Alert
                            icon={<IconCheck size={16} />}
                            color="green"
                            title="Password Updated!"
                            mb="lg"
                            radius="md"
                        >
                            Your password has been changed successfully.
                        </Alert>
                    )}

                    {error && (
                        <Alert
                            icon={<IconAlertCircle size={16} />}
                            color="red"
                            title="Error"
                            mb="lg"
                            radius="md"
                        >
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack gap="md">
                            <PasswordInput
                                label="Current Password"
                                placeholder="Enter your current password"
                                required
                                radius="md"
                                size="md"
                                leftSection={<IconLock size={18} />}
                                {...form.getInputProps('currentPassword')}
                            />

                            <Box>
                                <PasswordInput
                                    label="New Password"
                                    placeholder="Enter a strong password"
                                    required
                                    radius="md"
                                    size="md"
                                    leftSection={<IconLock size={18} />}
                                    {...form.getInputProps('newPassword')}
                                />
                                {form.values.newPassword && (
                                    <Box mt="xs">
                                        <Progress
                                            value={passwordStrength}
                                            color={getStrengthColor(passwordStrength)}
                                            size="xs"
                                            radius="xl"
                                            mb="xs"
                                        />
                                        <List size="xs" spacing={4}>
                                            {requirements.map((req, index) => (
                                                <List.Item
                                                    key={index}
                                                    icon={
                                                        req.meets
                                                            ? <IconCheck size={12} color="var(--mantine-color-green-6)" />
                                                            : <IconX size={12} color="var(--mantine-color-red-6)" />
                                                    }
                                                    c={req.meets ? 'green' : 'dimmed'}
                                                >
                                                    {req.label}
                                                </List.Item>
                                            ))}
                                        </List>
                                    </Box>
                                )}
                            </Box>

                            <PasswordInput
                                label="Confirm New Password"
                                placeholder="Re-enter your new password"
                                required
                                radius="md"
                                size="md"
                                leftSection={<IconLock size={18} />}
                                {...form.getInputProps('confirmPassword')}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                mt="md"
                                size="md"
                                radius="md"
                                loading={changePassword.isPending}
                                variant="gradient"
                                gradient={{ from: 'indigo', to: 'violet', deg: 45 }}
                            >
                                Update Password
                            </Button>

                            <Button
                                variant="subtle"
                                color="gray"
                                fullWidth
                                leftSection={<IconArrowLeft size={16} />}
                                onClick={() => router.back()}
                            >
                                Go Back
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
}
