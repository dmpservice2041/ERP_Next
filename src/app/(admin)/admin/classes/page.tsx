'use client';

import { useState } from 'react';
import {
    Container,
    Title,
    Text,
    Button,
    Group,
    Box,
    Paper,
    Table,
    ActionIcon,
    Modal,
    Stack,
    TextInput,
    Select,
    Badge,
    LoadingOverlay,
    Switch,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus, IconPencil, IconTrash, IconFilter, IconList } from '@tabler/icons-react';
import { useClasses } from '@/hooks/useClasses';
import { useDepartments } from '@/hooks/useDepartments';
import { useUser } from '@/hooks/useUser';
import { useAcademicSessionContext } from '@/context/AcademicSessionContext';
import { hasPermission } from '@/utils/permissions';
import PermissionGuard from '@/components/Auth/PermissionGuard';
import { ClassEntity } from '@/types';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';

export default function ClassesPage() {
    return (
        <PermissionGuard requiredPermission="classes.read">
            <ClassesContent />
        </PermissionGuard>
    );
}

function ClassesContent() {
    const { data: user } = useUser();

    // Academic Session Logic
    const { academicSessionId, isLoading: isSessionLoading } = useAcademicSessionContext();
    const selectedSessionId = academicSessionId;
    const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);

    // If session is initializing, show loader
    if (isSessionLoading) return <LoadingOverlay visible={true} />;

    const { classes, createClass, updateClass, deleteClass } = useClasses(selectedSessionId || undefined, departmentFilter || undefined);
    const { departments } = useDepartments();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            name: '',
            departmentId: '',
            isActive: true,
        },
        validate: {
            name: (value) => (value.trim() ? null : 'Name is required'),
            departmentId: (value) => (value ? null : 'Department is required'),
        },
    });

    // Filter classes
    // API handles filtering now
    const filteredClasses = classes.data;

    const handleOpenCreate = () => {
        setEditingId(null);
        form.reset();
        // If there is a filter active, pre-select it?
        if (departmentFilter) form.setFieldValue('departmentId', departmentFilter);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (cls: ClassEntity) => {
        setEditingId(cls.id);
        form.setValues({
            name: cls.name,
            departmentId: cls.departmentId || '',
            isActive: cls.isActive,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (values: typeof form.values) => {
        if (!selectedSessionId) {
            notifications.show({
                title: 'Error',
                message: 'Academic Session is not selected or loaded',
                color: 'red',
            });
            return;
        }

        try {
            if (editingId) {
                await updateClass.mutateAsync({
                    id: editingId,
                    name: values.name,
                    departmentId: values.departmentId,
                    isActive: values.isActive,
                });
            } else {
                await createClass.mutateAsync({
                    name: values.name,
                    departmentId: values.departmentId,
                    academicSessionId: selectedSessionId,
                });
            }
            setIsModalOpen(false);
        } catch (error) {
            // Error managed by hook
        }
    };

    const handleDelete = (id: string, name: string) => {
        modals.openConfirmModal({
            title: 'Delete Class',
            children: (
                <Text size="sm">
                    Are you sure you want to delete <strong>{name}</strong>? This action cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: () => deleteClass.mutate(id),
        });
    };

    const handleToggleStatus = async (cls: ClassEntity) => {
        try {
            await updateClass.mutateAsync({
                id: cls.id,
                isActive: !cls.isActive,
            });
        } catch (error) {
            // Error managed by hook
        }
    };

    const departmentOptions = departments.data?.map(d => ({ value: d.id, label: d.name })) || [];

    // Permissions
    const canCreate = hasPermission(user?.permissions || [], 'classes.create');
    const canUpdate = hasPermission(user?.permissions || [], 'classes.update');
    const canDelete = hasPermission(user?.permissions || [], 'classes.delete');

    return (
        <Container size="xl" py="xl">
            <Group justify="space-between" mb="xl">
                <Box>
                    <Title order={2}>Classes</Title>
                    <Text c="dimmed" size="sm">Manage classes and their departments</Text>
                </Box>
                {canCreate && (
                    <Button
                        leftSection={<IconPlus size={16} />}
                        onClick={handleOpenCreate}
                        variant="gradient"
                        gradient={{ from: 'indigo', to: 'violet', deg: 45 }}
                        disabled={!selectedSessionId}
                    >
                        Create Class
                    </Button>
                )}
            </Group>

            {/* Filters */}
            <Group mb="md">
                <Select
                    placeholder="Filter by Department"
                    data={departmentOptions}
                    value={departmentFilter}
                    onChange={setDepartmentFilter}
                    clearable
                    leftSection={<IconFilter size={16} />}
                    style={{ width: 250 }}
                />
            </Group>

            <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
                <Table striped highlightOnHover verticalSpacing="md">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Department</Table.Th>
                            <Table.Th>Sections</Table.Th>
                            <Table.Th>Students</Table.Th>
                            <Table.Th>Status</Table.Th>
                            <Table.Th style={{ width: 120 }}>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {filteredClasses?.map((cls) => (
                            <Table.Tr key={cls.id}>
                                <Table.Td fw={500} style={{ cursor: 'pointer' }} onClick={() => window.location.href = `/admin/classes/${cls.id}/sections?name=${encodeURIComponent(cls.name)}&department=${encodeURIComponent(cls.department?.name || '')}`}>
                                    <Text size="sm" fw={500} c="blue">{cls.name}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Badge variant="light" color="gray">
                                        {cls.department?.name || '—'}
                                    </Badge>
                                </Table.Td>
                                <Table.Td>
                                    {cls._count?.sections || 0} Sections
                                </Table.Td>
                                <Table.Td>
                                    {cls._count?.students || 0}
                                </Table.Td>
                                <Table.Td>
                                    <Badge
                                        color={cls.isActive ? 'green' : 'red'}
                                        variant="filled"
                                        size="sm"
                                        style={{ cursor: canUpdate ? 'pointer' : 'default' }}
                                        onClick={() => canUpdate && handleToggleStatus(cls)}
                                    >
                                        {cls.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </Table.Td>
                                <Table.Td>
                                    <Group gap={0}>
                                        <ActionIcon
                                            variant="subtle"
                                            color="violet"
                                            onClick={() => window.location.href = `/admin/classes/${cls.id}/sections?name=${encodeURIComponent(cls.name)}&department=${encodeURIComponent(cls.department?.name || '')}`}
                                            title="Manage Sections"
                                        >
                                            <IconList size={16} />
                                        </ActionIcon>
                                        {canUpdate && (
                                            <ActionIcon
                                                variant="subtle"
                                                color="blue"
                                                onClick={() => handleOpenEdit(cls)}
                                            >
                                                <IconPencil size={16} />
                                            </ActionIcon>
                                        )}
                                        {canDelete && (
                                            <ActionIcon
                                                variant="subtle"
                                                color="red"
                                                onClick={() => handleDelete(cls.id, cls.name)}
                                            >
                                                <IconTrash size={16} />
                                            </ActionIcon>
                                        )}
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>

                {(!classes.data || classes.data.length === 0) && (
                    <Box py="xl" ta="center">
                        <Text c="dimmed">No classes created yet</Text>
                    </Box>
                )}
                {classes.isLoading && <LoadingOverlay visible={true} />}
            </Paper>

            <Modal
                opened={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? 'Edit Class' : 'Create Class'}
                radius="md"
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <TextInput
                            label="Name"
                            placeholder="e.g. Class 10 or Semester 1"
                            required
                            {...form.getInputProps('name')}
                        />
                        <Select
                            label="Department"
                            placeholder="Select department"
                            data={departmentOptions}
                            required
                            {...form.getInputProps('departmentId')}
                        />
                        {editingId && (
                            <Switch
                                label="Active Status"
                                {...form.getInputProps('isActive', { type: 'checkbox' })}
                            />
                        )}

                        <Group justify="flex-end" mt="md">
                            <Button variant="default" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button
                                type="submit"
                                loading={createClass.isPending || updateClass.isPending}
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
