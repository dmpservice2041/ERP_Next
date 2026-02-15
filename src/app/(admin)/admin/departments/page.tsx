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
    Textarea,
    Badge,
    Grid,
    Switch,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus, IconPencil, IconTrash } from '@tabler/icons-react';
import { useDepartments } from '@/hooks/useDepartments';
import { useUser } from '@/hooks/useUser';
import { hasPermission } from '@/utils/permissions';
import PermissionGuard from '@/components/Auth/PermissionGuard';
import { Department } from '@/types';
import { modals } from '@mantine/modals';

export default function DepartmentsPage() {
    return (
        <PermissionGuard requiredPermission="departments.read">
            <DepartmentsContent />
        </PermissionGuard>
    );
}

function DepartmentsContent() {
    const { data: user } = useUser();
    const { departments, createDepartment, updateDepartment, deleteDepartment } = useDepartments();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            name: '',
            code: '',
            alias: '',
            isActive: true,
        },
        validate: {
            name: (value) => (value.trim() ? null : 'Name is required'),
            code: (value) => (value.trim() ? null : 'Code is required'),
            alias: (value) => (value.trim() ? null : 'Alias is required'),
        },
    });

    const handleOpenCreate = () => {
        setEditingId(null);
        form.reset();
        setIsModalOpen(true);
    };

    const handleOpenEdit = (dept: Department) => {
        setEditingId(dept.id);
        form.setValues({
            name: dept.name,
            code: dept.code,
            alias: dept.alias || '',
            isActive: dept.isActive,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (values: typeof form.values) => {
        try {
            if (editingId) {
                await updateDepartment.mutateAsync({
                    id: editingId,
                    ...values,
                });
            } else {
                await createDepartment.mutateAsync(values);
            }
            setIsModalOpen(false);
        } catch (error) {

        }
    };

    const handleDelete = (id: string, name: string) => {
        modals.openConfirmModal({
            title: 'Delete Department',
            children: (
                <Text size="sm">
                    Are you sure you want to delete <strong>{name}</strong>? This action cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: () => deleteDepartment.mutate(id),
        });
    };

    const handleToggleStatus = async (dept: Department) => {
        try {
            await updateDepartment.mutateAsync({
                id: dept.id,
                isActive: !dept.isActive,
            });
        } catch (error) {

        }
    };


    const canCreate = hasPermission(user?.permissions || [], 'departments.create');
    const canUpdate = hasPermission(user?.permissions || [], 'departments.update');
    const canDelete = hasPermission(user?.permissions || [], 'departments.delete');

    return (
        <Container size="xl" py="xl">
            <Group justify="space-between" mb="xl">
                <Box>
                    <Title order={2}>Departments</Title>
                    <Text c="dimmed" size="sm">Manage academic departments and tracking</Text>
                </Box>
                {canCreate && (
                    <Button
                        leftSection={<IconPlus size={16} />}
                        onClick={handleOpenCreate}
                        variant="gradient"
                        gradient={{ from: 'indigo', to: 'violet', deg: 45 }}
                    >
                        Create Department
                    </Button>
                )}
            </Group>

            <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
                <Table striped highlightOnHover verticalSpacing="md">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Code</Table.Th>
                            <Table.Th>Alias</Table.Th>
                            <Table.Th>Enrolled</Table.Th>
                            <Table.Th>Status</Table.Th>
                            {(canUpdate || canDelete) && <Table.Th style={{ width: 100 }}>Actions</Table.Th>}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {departments.data?.map((dept: Department) => (
                            <Table.Tr key={dept.id}>
                                <Table.Td fw={500}>{dept.name}</Table.Td>
                                <Table.Td>
                                    <Badge variant="light" color="gray">{dept.code}</Badge>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm" c="dimmed">{dept.alias || '—'}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Group gap="xs">
                                        <Badge variant="dot" color="blue" size="sm">
                                            {dept._count?.students || 0} Students
                                        </Badge>
                                        <Badge variant="dot" color="teal" size="sm">
                                            {dept._count?.staff || 0} Staff
                                        </Badge>
                                    </Group>
                                </Table.Td>
                                <Table.Td>
                                    <Badge
                                        color={dept.isActive ? 'green' : 'red'}
                                        variant="filled"
                                        size="sm"
                                        
                                        style={{ cursor: canUpdate ? 'pointer' : 'default' }}
                                        onClick={() => canUpdate && handleToggleStatus(dept)}
                                    >
                                        {dept.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </Table.Td>
                                {(canUpdate || canDelete) && (
                                    <Table.Td>
                                        <Group gap={0}>
                                            {canUpdate && (
                                                <ActionIcon
                                                    variant="subtle"
                                                    color="blue"
                                                    onClick={() => handleOpenEdit(dept)}
                                                >
                                                    <IconPencil size={16} />
                                                </ActionIcon>
                                            )}
                                            {canDelete && (
                                                <ActionIcon
                                                    variant="subtle"
                                                    color="red"
                                                    onClick={() => handleDelete(dept.id, dept.name)}
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
            </Paper>

            <Modal
                opened={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? 'Edit Department' : 'Create Department'}
                radius="md"
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <TextInput
                            label="Name"
                            placeholder="e.g. Computer Science"
                            required
                            {...form.getInputProps('name')}
                        />
                        <Grid>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Code"
                                    placeholder="e.g. CS"
                                    required
                                    {...form.getInputProps('code')}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Alias"
                                    placeholder="e.g. CSE"
                                    required
                                    {...form.getInputProps('alias')}
                                />
                            </Grid.Col>
                        </Grid>

                        {editingId && (
                            <Switch
                                label="Active Status"
                                description="Deactivating a department requires removing all linked students and staff."
                                {...form.getInputProps('isActive', { type: 'checkbox' })}
                            />
                        )}

                        <Group justify="flex-end" mt="md">
                            <Button variant="default" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button
                                type="submit"
                                loading={createDepartment.isPending || updateDepartment.isPending}
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
