'use client';

import { useState, useEffect } from 'react';
import {
    Title,
    Paper,
    Text,
    Button,
    Group,
    Select,
    Table,
    ActionIcon,
    TextInput,
    Modal,
    Stack,
    Switch,
    Badge,
    LoadingOverlay,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconTrash, IconPlus, IconRefresh } from '@tabler/icons-react';
import { masterDataService } from '@/services/masterDataService';
import { MasterDataItem, MasterDataType } from '@/types/student';
export function MasterDataManagement() {

    const [activeType, setActiveType] = useState<MasterDataType>('RELIGION');
    const [types, setTypes] = useState<string[]>([]);
    const [items, setItems] = useState<MasterDataItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MasterDataItem | null>(null);

    // Fetch available types on mount
    useEffect(() => {
        loadTypes();
    }, []);

    // Fetch items when type changes
    useEffect(() => {
        if (activeType) {
            loadItems(activeType);
        }
    }, [activeType]);

    const loadTypes = async () => {
        try {
            const initialTypes = await masterDataService.getAllTypes();
            setTypes(initialTypes);
        } catch (error) {
            console.error(error);
            notifications.show({ title: 'Error', message: 'Failed to load master types', color: 'red' });
        }
    };

    const loadItems = async (type: MasterDataType) => {
        setLoading(true);
        try {
            const data = await masterDataService.getByType(type);
            setItems(data || []);
        } catch (error) {
            console.error(error);
            notifications.show({ title: 'Error', message: 'Failed to load data', color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    const form = useForm({
        initialValues: {
            fieldName: '',
            isVisible: true,
            order: 0,
        },
        validate: {
            fieldName: (val) => (val ? null : 'Field Name is required'),
        },
    });

    const handleOpenModal = (item?: MasterDataItem) => {
        if (item) {
            setEditingItem(item);
            form.setValues({
                fieldName: item.fieldName,
                isVisible: item.isVisible,
                order: item.order || 0,
            });
        } else {
            setEditingItem(null);
            form.reset();
        }
        setModalOpen(true);
    };

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        try {
            if (editingItem) {
                await masterDataService.update(editingItem.id, {
                    fieldName: values.fieldName,
                    isVisible: values.isVisible,
                    order: Number(values.order),
                    // Type is typically immutable or passed in URL
                });
                notifications.show({ title: 'Success', message: 'Item updated successfully', color: 'green' });
            } else {
                await masterDataService.create({
                    masterType: activeType,
                    fieldName: values.fieldName,
                    isVisible: values.isVisible,
                    order: Number(values.order),
                });
                notifications.show({ title: 'Success', message: 'Item created successfully', color: 'green' });
            }
            setModalOpen(false);
            loadItems(activeType);
        } catch (error: any) {
            console.error(error);
            const message = error.message || 'Operation failed';
            notifications.show({ title: 'Error', message, color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        setLoading(true);
        try {
            await masterDataService.delete(id);
            notifications.show({ title: 'Success', message: 'Item deleted', color: 'green' });
            loadItems(activeType);
        } catch (error) {
            console.error(error);
            notifications.show({ title: 'Error', message: 'Delete failed', color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack gap="lg">
            <Group justify="space-between">
                <div>
                    <Title order={2}>Master Data Management</Title>
                    <Text c="dimmed">Manage system-wide dropdown values</Text>
                </div>
                <Group>
                    <Select
                        label="Select Type"
                        data={types.map(t => ({ value: t, label: t.replace(/_/g, ' ') }))}
                        value={activeType}
                        onChange={(val) => val && setActiveType(val)}
                        searchable
                        w={200}
                    />
                    <Button leftSection={<IconRefresh size={16} />} variant="default" onClick={() => loadItems(activeType)}>
                        Refresh
                    </Button>
                    <Button leftSection={<IconPlus size={16} />} onClick={() => handleOpenModal()}>
                        Add New Value
                    </Button>
                </Group>
            </Group>

            <Paper withBorder p="md" pos="relative">
                <LoadingOverlay visible={loading} />
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Field Name</Table.Th>
                            <Table.Th>Status</Table.Th>
                            <Table.Th>Order</Table.Th>
                            <Table.Th style={{ width: 100 }}>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {(!items || items.length === 0) ? (
                            <Table.Tr>
                                <Table.Td colSpan={4} align="center">
                                    <Text c="dimmed" p="xl">No data found for {activeType.replace(/_/g, ' ')}</Text>
                                </Table.Td>
                            </Table.Tr>
                        ) : (
                            items.map((item) => (
                                <Table.Tr key={item.id}>
                                    <Table.Td fw={500}>{item.fieldName}</Table.Td>
                                    <Table.Td>
                                        <Badge color={item.isVisible ? 'green' : 'red'}>
                                            {item.isVisible ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>{item.order}</Table.Td>
                                    <Table.Td>
                                        <Group gap="xs">
                                            <ActionIcon variant="subtle" color="blue" onClick={() => handleOpenModal(item)}>
                                                <IconEdit size={16} />
                                            </ActionIcon>
                                            <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(item.id)}>
                                                <IconTrash size={16} />
                                            </ActionIcon>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))
                        )}
                    </Table.Tbody>
                </Table>
            </Paper>

            <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? `Edit ${activeType.replace(/_/g, ' ')}` : `Add ${activeType.replace(/_/g, ' ')}`}>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <TextInput
                            label="Field Name"
                            placeholder="e.g. Hinduism"
                            required
                            {...form.getInputProps('fieldName')}
                        />
                        <TextInput
                            label="Display Order"
                            type="number"
                            {...form.getInputProps('order')}
                        />
                        <Switch
                            label="Visible"
                            {...form.getInputProps('isVisible', { type: 'checkbox' })}
                        />
                        <Group justify="flex-end" mt="md">
                            <Button variant="default" onClick={() => setModalOpen(false)}>Cancel</Button>
                            <Button type="submit" loading={loading}>Save</Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </Stack>
    );
}
