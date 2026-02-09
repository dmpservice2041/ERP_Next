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
    Badge,
    LoadingOverlay,
    Switch,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus, IconPencil, IconTrash, IconArrowLeft } from '@tabler/icons-react';
import { useSections } from '@/hooks/useSections';
import { useClass } from '@/hooks/useClasses';
import { useUser } from '@/hooks/useUser';
import { hasPermission } from '@/utils/permissions';
import PermissionGuard from '@/components/Auth/PermissionGuard';
import { SectionEntity } from '@/types';
import { modals } from '@mantine/modals';
import { useRouter, useSearchParams } from 'next/navigation';

import { use } from 'react';

interface PageProps {
    params: Promise<{
        classId: string;
    }>;
}

export default function SectionsPage({ params }: PageProps) {
    const { classId } = use(params);
    return (
        <PermissionGuard requiredPermission="sections.read">
            <SectionsContent classId={classId} />
        </PermissionGuard>
    );
}

function SectionsContent({ classId }: { classId: string }) {
    const { data: user } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();


    const classNameFallback = searchParams.get('name');
    const departmentNameFallback = searchParams.get('department');

    const { data: classData, isLoading: isLoadingClass } = useClass(classId);
    const { sections, createSection, updateSection, deleteSection } = useSections(classId);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            name: '',
            order: 1,
            isActive: true,
        },
        validate: {
            name: (value) => (value.trim() ? null : 'Name is required'),
            order: (value) => (value > 0 ? null : 'Order must be positive'),
        },
    });

    const handleOpenCreate = () => {
        setEditingId(null);
        form.reset();
        setIsModalOpen(true);
    };

    const handleOpenEdit = (section: SectionEntity) => {
        setEditingId(section.id);
        form.setValues({
            name: section.name,
            order: section.order || 1,
            isActive: section.isActive,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (values: typeof form.values) => {
        try {
            if (editingId) {
                await updateSection.mutateAsync({
                    id: editingId,
                    name: values.name,
                    order: values.order,
                    isActive: values.isActive,
                });
            } else {
                await createSection.mutateAsync({
                    name: values.name,
                    order: values.order,
                });
            }
            setIsModalOpen(false);
        } catch (error) {
            // Error managed by hook
        }
    };

    const handleDelete = (id: string, name: string) => {
        modals.openConfirmModal({
            title: 'Delete Section',
            children: (
                <Text size="sm">
                    Are you sure you want to delete <strong>{name}</strong>? This action cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: () => deleteSection.mutate(id),
        });
    };

    const handleToggleStatus = async (section: SectionEntity) => {
        try {
            await updateSection.mutateAsync({
                id: section.id,
                isActive: !section.isActive,
            });
        } catch (error) {
            // Error managed by hook
        }
    };


    const canCreate = hasPermission(user?.permissions || [], 'sections.create');
    const canUpdate = hasPermission(user?.permissions || [], 'sections.update');
    const canDelete = hasPermission(user?.permissions || [], 'sections.delete');

    if (isLoadingClass) {
        return <LoadingOverlay visible={true} />;
    }


    const displayName = classData?.name || classNameFallback || `Class ${classId}`;
    const displaySubtitle = classData ? `Manage sections for ${classData.name}` :
        (classNameFallback ? `Manage sections for ${classNameFallback} ${departmentNameFallback ? `(${departmentNameFallback})` : ''}` : 'Manage sections');

    return (
        <Container size="xl" py="xl">
            <Button
                variant="subtle"
                leftSection={<IconArrowLeft size={16} />}
                mb="md"
                onClick={() => router.push('/admin/classes')}
            >
                Back to Classes
            </Button>

            <Group justify="space-between" mb="xl">
                <Box>
                    <Title order={2}>{displayName} - Sections</Title>
                    <Text c="dimmed" size="sm">{displaySubtitle}</Text>
                </Box>
                {canCreate && (
                    <Button
                        leftSection={<IconPlus size={16} />}
                        onClick={handleOpenCreate}
                        variant="gradient"
                        gradient={{ from: 'indigo', to: 'violet', deg: 45 }}
                    >
                        Create Section
                    </Button>
                )}
            </Group>

            <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
                <Table striped highlightOnHover verticalSpacing="md">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Order</Table.Th>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Students</Table.Th>
                            <Table.Th>Status</Table.Th>
                            {(canUpdate || canDelete) && <Table.Th style={{ width: 100 }}>Actions</Table.Th>}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {sections.data?.map((section) => (
                            <Table.Tr key={section.id}>
                                <Table.Td>{section.order || '-'}</Table.Td>
                                <Table.Td fw={500}>{section.name}</Table.Td>
                                <Table.Td>{section._count?.students || 0}</Table.Td>
                                <Table.Td>
                                    <Badge
                                        color={section.isActive ? 'green' : 'red'}
                                        variant="filled"
                                        size="sm"
                                        style={{ cursor: canUpdate ? 'pointer' : 'default' }}
                                        onClick={() => canUpdate && handleToggleStatus(section)}
                                    >
                                        {section.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </Table.Td>
                                {(canUpdate || canDelete) && (
                                    <Table.Td>
                                        <Group gap={0}>
                                            {canUpdate && (
                                                <ActionIcon
                                                    variant="subtle"
                                                    color="blue"
                                                    onClick={() => handleOpenEdit(section)}
                                                >
                                                    <IconPencil size={16} />
                                                </ActionIcon>
                                            )}
                                            {canDelete && (
                                                <ActionIcon
                                                    variant="subtle"
                                                    color="red"
                                                    onClick={() => handleDelete(section.id, section.name)}
                                                    disabled={section.isActive}
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

                {(!sections.data || sections.data.length === 0) && (
                    <Box py="xl" ta="center">
                        <Text c="dimmed">No sections created yet</Text>
                    </Box>
                )}
                {sections.isLoading && <LoadingOverlay visible={true} />}
            </Paper>

            <Modal
                opened={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? 'Edit Section' : 'Create Section'}
                radius="md"
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <TextInput
                            label="Name"
                            placeholder="e.g. A"
                            required
                            {...form.getInputProps('name')}
                        />
                        <TextInput
                            type="number"
                            label="Order"
                            placeholder="e.g. 1"
                            required
                            {...form.getInputProps('order')}
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
                                loading={createSection.isPending || updateSection.isPending}
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
