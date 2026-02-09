'use client';

import { useState, useEffect } from 'react';
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
    Flex,
    Avatar,
    Box,
    ThemeIcon,
    Select,
    Divider,
    Alert,
} from '@mantine/core';
import { IconSettings, IconInfoCircle, IconUser, IconCheck } from '@tabler/icons-react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useRoles } from '@/hooks/useRoles';
import PermissionGuard from '@/components/Auth/PermissionGuard';
import { UserProfile } from '@/types/auth';

export default function StaffUsersPage() {
    return (
        <PermissionGuard requiredPermission="users.read">
            <StaffUsersContent />
        </PermissionGuard>
    );
}

function StaffUsersContent() {
    const { staffUsers, assignRole, removeRole } = useUserManagement();
    const { roles } = useRoles();

    const [opened, setOpened] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Filter users to ONLY show STAFF and ADMIN
    const filteredUsers = staffUsers.data?.filter(
        user => user.identity === 'STAFF' || user.identity === 'ADMIN'
    ) || [];

    useEffect(() => {
        if (selectedUser && roles.data) {
            if (selectedUser.roles && selectedUser.roles.length > 0) {

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const firstRole = selectedUser.roles[0] as any;
                if (typeof firstRole === 'string') {
                    const found = roles.data.find(role => role.name === firstRole);
                    setSelectedRoleId(found?.id || null);
                } else {
                    setSelectedRoleId(firstRole.id || firstRole.roleId || firstRole.role?.id || null);
                }
            } else {
                setSelectedRoleId(null);
            }
        }
    }, [selectedUser, roles.data]);

    const handleManageRoles = (user: UserProfile) => {
        // HARD BLOCK: Defensive guard against non-staff/admin users
        if (user.identity !== 'STAFF' && user.identity !== 'ADMIN') {
            console.warn('Attempted to manage roles for restricted identity:', user.identity);
            return;
        }
        setSelectedUser(user);
        setOpened(true);
    };

    const handleClose = () => {
        setOpened(false);
        setSelectedUser(null);
        setSelectedRoleId(null);
    };

    const handleSaveRole = async () => {
        if (!selectedUser || !roles.data) return;

        // Defensive check again
        if (selectedUser.identity !== 'STAFF' && selectedUser.identity !== 'ADMIN') return;

        setIsSaving(true);

        let currentRoleId: string | null = null;

        if (selectedUser.roles && selectedUser.roles.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const firstRole = selectedUser.roles[0] as any;
            if (typeof firstRole === 'string') {
                const found = roles.data.find(role => role.name === firstRole);
                currentRoleId = found?.id || null;
            } else {
                currentRoleId = firstRole.id || firstRole.roleId || firstRole.role?.id || null;
            }
        }

        try {
            if (currentRoleId && currentRoleId !== selectedRoleId) {
                await removeRole.mutateAsync({ userId: selectedUser.id, roleId: currentRoleId });
            }

            if (selectedRoleId && selectedRoleId !== currentRoleId) {
                await assignRole.mutateAsync({ userId: selectedUser.id, roleId: selectedRoleId });
            }


            handleClose();
        } catch (error) {
            console.error('Error updating role:', error);
        } finally {
            setIsSaving(false);
        }
    };


    const getRoleName = (role: any): string => {
        if (typeof role === 'string') return role;
        return role.name || role.role?.name || 'Unknown';
    };

    const roleOptions = roles.data?.map(role => ({
        value: role.id,
        label: role.name,
    })) || [];

    return (
        <Container size="xl" py="xl">
            <Group justify="space-between" mb="xl">
                <Box>
                    <Title order={2}>User Management</Title>
                    <Text c="dimmed" size="sm">Manage staff and admin accounts</Text>
                </Box>
            </Group>

            <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>

                <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
                    <Text fw={600}>Staff & Admin Users</Text>
                    <Text size="xs" c="dimmed">{filteredUsers.length} users found</Text>
                </Box>

                <Table striped highlightOnHover verticalSpacing="md">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>User</Table.Th>
                            <Table.Th>Email</Table.Th>
                            <Table.Th>Role</Table.Th>
                            <Table.Th style={{ width: 140 }}>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {filteredUsers.map((user) => (
                            <Table.Tr key={user.id}>
                                <Table.Td>
                                    <Group gap="sm">
                                        <Avatar
                                            size={36}
                                            radius="xl"
                                            color="indigo"
                                            variant="filled"
                                        >
                                            {user.firstName?.charAt(0)?.toUpperCase() || 'U'}
                                        </Avatar>
                                        <Box>
                                            <Text fw={500} size="sm">{user.firstName} {user.lastName}</Text>
                                            <Text size="xs" c="dimmed">{user.identity}</Text>
                                        </Box>
                                    </Group>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm">{user.email}</Text>
                                </Table.Td>
                                <Table.Td>
                                    {(user.identity === 'STAFF' || user.identity === 'ADMIN') ? (
                                        user.roles && user.roles.length > 0 ? (
                                            <Badge
                                                variant="light"
                                                color="indigo"
                                                size="sm"
                                                radius="sm"
                                            >
                                                {getRoleName(user.roles[0])}
                                            </Badge>
                                        ) : (
                                            <Text size="sm" c="dimmed" fs="italic">No role assigned</Text>
                                        )
                                    ) : null}
                                </Table.Td>
                                <Table.Td>
                                    {(user.identity === 'STAFF' || user.identity === 'ADMIN') && (
                                        <Button
                                            variant="light"
                                            size="xs"
                                            radius="md"
                                            leftSection={<IconSettings size={14} />}
                                            onClick={() => handleManageRoles(user)}
                                        >
                                            Assign Role
                                        </Button>
                                    )}
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>

                {filteredUsers.length === 0 && (
                    <Box p="xl" ta="center">
                        <ThemeIcon size={48} radius="xl" variant="light" color="gray" mx="auto" mb="md">
                            <IconUser size={24} />
                        </ThemeIcon>
                        <Text c="dimmed">No staff/admin users found</Text>
                    </Box>
                )}

                {staffUsers.isLoading && <LoadingOverlay visible={true} />}
            </Paper>


            <Modal
                opened={opened}
                onClose={handleClose}
                title={null}
                size="md"
                radius="lg"
                padding="xl"
            >
                <Group mb="lg" gap="md">
                    <Avatar
                        size={50}
                        radius="xl"
                        color="indigo"
                        variant="gradient"
                        gradient={{ from: 'indigo', to: 'violet', deg: 45 }}
                    >
                        {selectedUser?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                    <Box>
                        <Text fw={600} size="lg">
                            {selectedUser?.firstName} {selectedUser?.lastName}
                        </Text>
                        <Text size="sm" c="dimmed">{selectedUser?.email}</Text>
                    </Box>
                </Group>

                <Divider mb="lg" />

                <Alert
                    icon={<IconInfoCircle size={16} />}
                    color="blue"
                    variant="light"
                    radius="md"
                    mb="lg"
                >
                    Each user can have only one role. Changes take effect when the user logs in again.
                </Alert>

                <Stack gap="md">

                    <Select
                        label="Assign Role"
                        placeholder="Select a role"
                        data={roleOptions}
                        value={selectedRoleId}
                        onChange={setSelectedRoleId}
                        searchable
                        clearable
                        size="md"
                        radius="md"
                        checkIconPosition="right"
                    />
                </Stack>

                <Divider my="lg" />

                <Group justify="flex-end" gap="sm">
                    <Button
                        variant="subtle"
                        color="gray"
                        onClick={handleClose}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="gradient"
                        gradient={{ from: 'indigo', to: 'violet', deg: 45 }}
                        onClick={handleSaveRole}
                        loading={isSaving}
                        leftSection={<IconCheck size={16} />}
                    >
                        Save
                    </Button>
                </Group>
            </Modal>
        </Container>
    );
}
