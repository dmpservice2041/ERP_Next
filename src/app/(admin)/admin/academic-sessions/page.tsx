'use client';

import { useState } from 'react';
import {
    Title,
    Paper,
    Text,
    Button,
    Container,
    Group,
    Stack,
    Table,
    Badge,
    Modal,
    LoadingOverlay,
    Box,
    ActionIcon,
    TextInput,
} from '@mantine/core'
    ;
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import {
    IconCalendarEvent,
    IconPlus,
    IconPencil,
    IconTrash,
} from '@tabler/icons-react';
import { useAcademicSession } from '@/hooks/useAcademicSession';
import PermissionGuard from '@/components/Auth/PermissionGuard';
import { hasPermission } from '@/utils/permissions';
import { useUser } from '@/hooks/useUser';
import { AcademicSession } from '@/types';
import { modals } from '@mantine/modals';
import dayjs from 'dayjs';

export default function AcademicSessionsPage() {
    return (
        <PermissionGuard requiredPermission="academic_sessions.read">
            <AcademicSessionsContent />
        </PermissionGuard>
    );
}

function AcademicSessionsContent() {
    const { data: user } = useUser();
    const { academicSessions, createAcademicSession, updateAcademicSession, deleteAcademicSession } = useAcademicSession();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            name: '',
            startDate: null as Date | null,
            endDate: null as Date | null,
        },
        validate: {
            name: (value) => (value.trim() ? null : 'Name is required'),
            startDate: (value) => (value ? null : 'Start date is required'),
            endDate: (value) => (value ? null : 'End date is required'),
        },
    });

    const handleOpenCreate = () => {
        setEditingId(null);
        form.reset();
        setIsModalOpen(true);
    };

    const handleOpenEdit = (session: AcademicSession) => {
        setEditingId(session.id);
        form.setValues({
            name: session.name,
            startDate: new Date(session.startDate),
            endDate: new Date(session.endDate),
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (values: typeof form.values) => {
        const payload = {
            name: values.name,
            startDate: new Date(values.startDate!).toISOString(),
            endDate: new Date(values.endDate!).toISOString(),
            isActive: false, // Default to inactive on creation as per API spec
        };

        try {
            if (editingId) {
                await updateAcademicSession.mutateAsync({ id: editingId, ...payload });
            } else {
                await createAcademicSession.mutateAsync(payload);
            }
            setIsModalOpen(false);
        } catch (error) {
            // Error handled in hook
        }
    };

    const handleDelete = (id: string, name: string) => {
        modals.openConfirmModal({
            title: 'Delete Academic Session',
            children: (
                <Text size="sm">
                    Are you sure you want to delete <strong>{name}</strong>? This action cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: () => deleteAcademicSession.mutateAsync(id),
        });
    };

    const handleToggleStatus = async (session: AcademicSession) => {
        if (session.isActive) return;
        try {
            await updateAcademicSession.mutateAsync({ id: session.id, isActive: true });
        } catch (error) {
            // Error handled in hook
        }
    };

    // Permissions
    const canCreate = hasPermission(user?.permissions || [], 'academic_sessions.create');
    const canUpdate = hasPermission(user?.permissions || [], 'academic_sessions.update');
    const canDelete = hasPermission(user?.permissions || [], 'academic_sessions.delete');

    return (
        <Container size="xl" py="xl">
            <Group justify="space-between" mb="xl">
                <Box>
                    <Title order={2}>Academic Sessions</Title>
                    <Text c="dimmed" size="sm">Manage academic sessions and date ranges</Text>
                </Box>
                {canCreate && (
                    <Button
                        leftSection={<IconPlus size={16} />}
                        onClick={handleOpenCreate}
                        variant="gradient"
                        gradient={{ from: 'indigo', to: 'violet', deg: 45 }}
                    >
                        Create Academic Session
                    </Button>
                )}
            </Group>

            <Paper withBorder radius="md">
                <Table striped highlightOnHover verticalSpacing="md">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Start Date</Table.Th>
                            <Table.Th>End Date</Table.Th>
                            <Table.Th>Status</Table.Th>
                            {(canUpdate || canDelete) && <Table.Th>Actions</Table.Th>}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {academicSessions.data?.map((session) => (
                            <Table.Tr key={session.id}>
                                <Table.Td fw={500}>{session.name}</Table.Td>
                                <Table.Td>{dayjs(session.startDate).format('MMM D, YYYY')}</Table.Td>
                                <Table.Td>{dayjs(session.endDate).format('MMM D, YYYY')}</Table.Td>
                                <Table.Td>
                                    <Badge
                                        color={session.isActive ? 'green' : 'gray'}
                                        variant={session.isActive ? 'filled' : 'light'}
                                        style={{ cursor: !session.isActive && canUpdate ? 'pointer' : 'default' }}
                                        onClick={() => !session.isActive && canUpdate && handleToggleStatus(session)}
                                    >
                                        {session.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </Table.Td>
                                {(canUpdate || canDelete) && (
                                    <Table.Td>
                                        <Group gap={0}>
                                            {canUpdate && (
                                                <ActionIcon
                                                    variant="subtle"
                                                    color="blue"
                                                    onClick={() => handleOpenEdit(session)}
                                                >
                                                    <IconPencil size={16} />
                                                </ActionIcon>
                                            )}
                                            {canDelete && (
                                                <ActionIcon
                                                    variant="subtle"
                                                    color="red"
                                                    onClick={() => handleDelete(session.id, session.name)}
                                                    disabled={session.isActive}
                                                >
                                                    <IconTrash size={16} />
                                                </ActionIcon>
                                            )}
                                        </Group>
                                    </Table.Td>
                                )}
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>

                {academicSessions.data?.length === 0 && (
                    <Box py="xl" ta="center">
                        <Text c="dimmed">No academic sessions found.</Text>
                    </Box>
                )}

                {academicSessions.isLoading && <LoadingOverlay visible={true} />}
            </Paper>

            <Modal
                opened={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? 'Edit Academic Session' : 'Create Academic Session'}
                radius="md"
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <TextInput
                            label="Name"
                            placeholder="e.g. 2024-2025"
                            required
                            {...form.getInputProps('name')}
                        />
                        <DateInput
                            label="Start Date"
                            placeholder="Select date"
                            required
                            {...form.getInputProps('startDate')}
                        />
                        <DateInput
                            label="End Date"
                            placeholder="Select date"
                            required
                            {...form.getInputProps('endDate')}
                        />

                        <Group justify="flex-end" mt="md">
                            <Button variant="default" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button
                                type="submit"
                                loading={createAcademicSession.isPending || updateAcademicSession.isPending}
                                variant="gradient"
                                gradient={{ from: 'indigo', to: 'violet', deg: 45 }}
                            >
                                {editingId ? 'Update' : 'Create'}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </Container>
    );
}
