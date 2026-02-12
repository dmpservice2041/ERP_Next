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
    NumberInput,
    LoadingOverlay,
    Code,
    MultiSelect,
    TagsInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconTrash, IconPlus, IconRefresh, IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import { dynamicFieldService } from '@/services/dynamicFieldService';
import { DynamicFieldConfig, DynamicControlType, DynamicDataType, MasterDataType } from '@/types/student';

const CONTROL_TYPES: { value: DynamicControlType; label: string }[] = [
    { value: 'TEXT', label: 'TextBox' },
    { value: 'DROPDOWN', label: 'DropDown' },
];
const DATA_TYPES: { value: DynamicDataType; label: string }[] = [
    { value: 'STRING', label: 'Text' },
    { value: 'INTEGER', label: 'Numeric' },
    { value: 'DECIMAL', label: 'Money' },
    { value: 'DATE', label: 'Date' },
];

export function DynamicFieldBuilder() {
    const [entityType, setEntityType] = useState<'STUDENT' | 'STAFF'>('STUDENT');
    const [fields, setFields] = useState<DynamicFieldConfig[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingField, setEditingField] = useState<DynamicFieldConfig | null>(null);

    useEffect(() => {
        loadFields(entityType);
    }, [entityType]);

    const loadFields = async (type: string) => {
        setLoading(true);
        try {
            const data = await dynamicFieldService.getByEntity(type);
            setFields((data || []).sort((a, b) => a.priority - b.priority));
        } catch (error) {
            console.error(error);
            notifications.show({ title: 'Error', message: 'Failed to load fields', color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    const form = useForm<Partial<DynamicFieldConfig>>({
        initialValues: {
            displayName: '',
            name: '',
            controlType: 'TEXT',
            dataType: 'STRING',
            isRequired: false,
            isVisible: true,
            priority: 0,
            maxLength: 255,
            placeholder: '',
            masterType: undefined,
            options: [],
        },
        validate: {
            displayName: (val) => (val ? null : 'Display Label is required'),
            name: (val) => {
                if (!val) return 'Field Name is required';
                if (!/^[a-z0-9_]+$/.test(val)) return 'Field Name must be snake_case (lowercase, letters, numbers, and underscores only)';
                return null;
            },
            controlType: (val) => (val ? null : 'Control Type is required'),
            dataType: (val) => (val ? null : 'Data Type is required'),
        },
    });

    const handleOpenModal = (field?: DynamicFieldConfig) => {
        if (field) {
            setEditingField(field);
            form.setValues(field);
        } else {
            setEditingField(null);
            form.reset();
            form.setValues({
                entityType,
                priority: fields.length + 1,
            });
        }
        setModalOpen(true);
    };

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        try {
            await dynamicFieldService.save({
                ...values,
                entityType,
                // Ensure ID is preserved for updates
                fieldId: editingField?.fieldId, // or id
                masterType: undefined, // Force clear master link
            } as DynamicFieldConfig);

            notifications.show({ title: 'Success', message: 'Field definition saved', color: 'green' });
            setModalOpen(false);
            loadFields(entityType);
        } catch (error) {
            console.error(error);
            notifications.show({ title: 'Error', message: 'Operation failed', color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This will delete all data associated with this field!')) return;
        setLoading(true);
        try {
            await dynamicFieldService.delete(id);
            notifications.show({ title: 'Success', message: 'Field deleted', color: 'green' });
            loadFields(entityType);
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
                    <Title order={2}>Dynamic Field Builder</Title>
                    <Text c="dimmed">Configure custom fields for {entityType}</Text>
                </div>
                <Group>
                    <Button leftSection={<IconRefresh size={16} />} variant="default" onClick={() => loadFields(entityType)}>
                        Refresh
                    </Button>
                    <Button leftSection={<IconPlus size={16} />} onClick={() => handleOpenModal()}>
                        Add New Field
                    </Button>
                </Group>
            </Group>

            <Paper withBorder p="md" pos="relative">
                <LoadingOverlay visible={loading} />
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Priority</Table.Th>
                            <Table.Th>Label</Table.Th>
                            <Table.Th>Field Name (DB)</Table.Th>
                            <Table.Th>Control</Table.Th>
                            <Table.Th>Data Type</Table.Th>
                            <Table.Th>Required</Table.Th>
                            <Table.Th>Status</Table.Th>
                            <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {(!fields || fields.length === 0) ? (
                            <Table.Tr>
                                <Table.Td colSpan={8} align="center">
                                    <Text c="dimmed" p="xl">No dynamic fields configured yet.</Text>
                                </Table.Td>
                            </Table.Tr>
                        ) : (
                            fields.map((field) => (
                                <Table.Tr key={field.fieldId || field.id}>
                                    <Table.Td>{field.priority}</Table.Td>
                                    <Table.Td fw={500}>{field.displayName}</Table.Td>
                                    <Table.Td><Code>{field.name}</Code></Table.Td>
                                    <Table.Td><Badge variant="outline">{field.controlType}</Badge></Table.Td>
                                    <Table.Td><Badge variant="dot" color="gray">{field.dataType}</Badge></Table.Td>
                                    <Table.Td>{field.isRequired ? 'Yes' : 'No'}</Table.Td>
                                    <Table.Td>
                                        <Badge color={field.isVisible ? 'green' : 'red'}>
                                            {field.isVisible ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap="xs">
                                            <ActionIcon variant="subtle" color="blue" onClick={() => handleOpenModal(field)}>
                                                <IconEdit size={16} />
                                            </ActionIcon>
                                            <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(field.fieldId || field.id || '')}>
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

            <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title={editingField ? 'Edit Field' : 'Add New Field'} size="lg">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <TextInput
                            label="Display Label"
                            placeholder="e.g. Father's Name"
                            required
                            {...form.getInputProps('displayName')}
                            onChange={(event) => {
                                form.getInputProps('displayName').onChange(event);
                                if (!editingField) {
                                    // Auto-generate name
                                    const val = event.currentTarget.value.toLowerCase().replace(/[^a-z0-9]/g, '_');
                                    form.setFieldValue('name', val);
                                }
                            }}
                        />
                        <TextInput
                            label="Internal Field Name"
                            description="Unique database identifier (snake_case)"
                            required
                            {...form.getInputProps('name')}
                        />

                        <Group grow>
                            <Select
                                label="Control Type"
                                data={CONTROL_TYPES}
                                required
                                {...form.getInputProps('controlType')}
                                onChange={(val) => {
                                    form.setFieldValue('controlType', val as any);
                                    if (val === 'DROPDOWN') {
                                        form.setFieldValue('dataType', 'STRING');
                                    }
                                }}
                            />
                            <Select
                                label="Data Type"
                                data={DATA_TYPES}
                                required
                                {...form.getInputProps('dataType')}
                                disabled={form.values.controlType === 'DROPDOWN'}
                            />
                        </Group>

                        {form.values.controlType === 'DROPDOWN' && (
                            <Stack gap="xs" p="xs" bg="var(--mantine-color-gray-0)">
                                <Text size="sm" fw={500}>Dropdown Options</Text>
                                <TagsInput
                                    label="Static Options"
                                    placeholder="Type and press Enter to add options"
                                    data={form.values.options || []}
                                    {...form.getInputProps('options')}
                                    description="Enter the list of items for the dropdown."
                                />
                            </Stack>
                        )}

                        <Group grow>
                            <NumberInput
                                label="Display Priority"
                                min={0}
                                {...form.getInputProps('priority')}
                            />
                            <TextInput
                                label="Placeholder"
                                {...form.getInputProps('placeholder')}
                            />
                        </Group>

                        <Group grow>
                            <NumberInput
                                label="Max Length"
                                min={1}
                                {...form.getInputProps('maxLength')}
                            />
                            <div /> {/* Spacer */}
                        </Group>

                        <Group>
                            <Switch
                                label="Required"
                                {...form.getInputProps('isRequired', { type: 'checkbox' })}
                            />
                            <Switch
                                label="Visible"
                                {...form.getInputProps('isVisible', { type: 'checkbox' })}
                            />
                        </Group>

                        <Group justify="flex-end" mt="md">
                            <Button variant="default" onClick={() => setModalOpen(false)}>Cancel</Button>
                            <Button type="submit" loading={loading}>Save Configuration</Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </Stack>
    );
}
