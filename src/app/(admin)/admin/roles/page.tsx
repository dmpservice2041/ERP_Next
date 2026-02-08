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
    ActionIcon,
    Modal,
    TextInput,
    Checkbox,
    ScrollArea,
    LoadingOverlay,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconEdit, IconPlus } from '@tabler/icons-react';
import { useRoles, Role } from '@/hooks/useRoles';
import PermissionGuard from '@/components/Auth/PermissionGuard';

export default function RolesPage() {
    return (
        <PermissionGuard requiredPermission="roles.read">
            <RolesContent />
        </PermissionGuard>
    );
}

function RolesContent() {
    const { roles, permissions, createRole, updateRole } = useRoles();
    const [opened, setOpened] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    const form = useForm({
        initialValues: {
            name: '',
            description: '',
            permissions: [] as string[],
        },
        validate: {
            name: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
        },
    });

    const handleOpen = (role?: Role) => {
        if (role) {
            setEditingRole(role);
            form.setValues({
                name: role.name,
                description: role.description || '',
                permissions: role.permissions.map(p => p.id),
            });
        } else {
            setEditingRole(null);
            form.reset();
        }
        setOpened(true);
    };

    const handleClose = () => {
        setOpened(false);
        setEditingRole(null);
        form.reset();
    };

    const handleSubmit = (values: typeof form.values) => {
        const payload = {
            name: values.name,
            description: values.description,
            permissionIds: values.permissions,
        };

        if (editingRole) {
            updateRole.mutate(
                { id: editingRole.id, data: payload },
                { onSuccess: handleClose }
            );
        } else {
            createRole.mutate(payload, { onSuccess: handleClose });
        }
    };

    // Group permissions by module
    const groupedPermissions = permissions.data?.reduce((acc, perm) => {
        if (!acc[perm.module]) acc[perm.module] = [];
        acc[perm.module].push(perm);
        return acc;
    }, {} as Record<string, typeof permissions.data>) || {};

    return (
        <Container size="xl" py="xl">
            <Group justify="space-between" mb="lg">
                <Stack gap={0}>
                    <Title order={2}>Roles & Permissions</Title>
                    <Text c="dimmed">Manage system roles and their access levels</Text>
                </Stack>
                <Button leftSection={<IconPlus size={20} />} onClick={() => handleOpen()}>
                    Create Role
                </Button>
            </Group>

            <Paper withBorder radius="md">
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Role Name</Table.Th>
                            <Table.Th>Description</Table.Th>
                            <Table.Th>Permissions</Table.Th>
                            <Table.Th style={{ width: 100 }}>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {roles.data?.map((role) => (
                            <Table.Tr key={role.id}>
                                <Table.Td>
                                    <Group gap="sm">
                                        <Text fw={500}>{role.name}</Text>
                                        {role.isSystem && <Badge color="blue" size="sm">System</Badge>}
                                    </Group>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm" c="dimmed" lineClamp={1}>
                                        {role.description || '-'}
                                    </Text>
                                </Table.Td>
                                <Table.Td>
                                    <Badge variant="light" color="gray">
                                        {role.permissions.length} permissions
                                    </Badge>
                                </Table.Td>
                                <Table.Td>
                                    {!role.isSystem && (
                                        <ActionIcon
                                            variant="subtle"
                                            color="blue"
                                            onClick={() => handleOpen(role)}
                                        >
                                            <IconEdit size={16} />
                                        </ActionIcon>
                                    )}
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
                {roles.isLoading && <LoadingOverlay visible={true} />}
            </Paper>

            <Modal
                opened={opened}
                onClose={handleClose}
                title={editingRole ? 'Edit Role' : 'Create Role'}
                size="lg"
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="md">
                        <TextInput
                            label="Role Name"
                            placeholder="e.g. Academic Staff"
                            required
                            {...form.getInputProps('name')}
                        />

                        <TextInput
                            label="Description"
                            placeholder="e.g. Head of department"
                            mt="sm"
                            {...form.getInputProps('description')}
                        />

                        <Text fw={500} size="sm" mt="md">
                            Permissions
                        </Text>

                        <ScrollArea h={400} type="auto" offsetScrollbars>
                            <Stack gap="md">
                                {Object.entries(groupedPermissions).map(([module, perms]) => (
                                    <Paper key={module} withBorder p="sm" radius="sm">
                                        <Text fw={600} size="sm" mb="xs" tt="capitalize">
                                            {module}
                                        </Text>
                                        <Group gap="md">
                                            {perms?.map((perm) => (
                                                <Checkbox
                                                    key={perm.key}
                                                    label={perm.description}
                                                    value={perm.key}
                                                    checked={form.values.permissions.includes(perm.key)}
                                                    onChange={(event) => {
                                                        const checked = event.currentTarget.checked;
                                                        const current = form.values.permissions;
                                                        if (checked) {
                                                            form.setFieldValue('permissions', [...current, perm.key]);
                                                        } else {
                                                            form.setFieldValue(
                                                                'permissions',
                                                                current.filter((p) => p !== perm.key)
                                                            );
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </Group>
                                    </Paper>
                                ))}
                            </Stack>
                        </ScrollArea>

                        <Group justify="flex-end" mt="md">
                            <Button variant="default" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                loading={createRole.isPending || updateRole.isPending}
                            >
                                {editingRole ? 'Save Changes' : 'Create Role'}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </Container>
    );
}
