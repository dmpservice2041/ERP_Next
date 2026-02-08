'use client';

import { useState } from 'react';
import {
    Container,
    Title,
    Text,
    Group,
    Box,
    Paper,
    Table,
    Select,
    LoadingOverlay,
    ActionIcon,
    Avatar,
    Badge,
} from '@mantine/core';
import { IconFilter, IconUser, IconPlus, IconPencil, IconTrash } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { useStudents } from '@/hooks/useStudents';
import { useDepartments } from '@/hooks/useDepartments';
import { useClasses } from '@/hooks/useClasses';
import { useSections } from '@/hooks/useSections';
import { useAcademicSessionContext } from '@/context/AcademicSessionContext';
import PermissionGuard from '@/components/Auth/PermissionGuard';
import Link from 'next/link';

export default function StudentMasterPage() {
    return (
        <PermissionGuard requiredPermission="students.read">
            <StudentMasterContent />
        </PermissionGuard>
    );
}

function StudentMasterContent() {
    const { academicSessionId } = useAcademicSessionContext();
    const [departmentId, setDepartmentId] = useState<string | null>(null);
    const [classId, setClassId] = useState<string | null>(null);
    const [sectionId, setSectionId] = useState<string | null>(null);

    const { students, deleteStudent } = useStudents({
        academicSessionId: academicSessionId || undefined,
        departmentId: departmentId || undefined,
        classId: classId || undefined,
        sectionId: sectionId || undefined,
    });

    const { departments } = useDepartments();
    const { classes } = useClasses(academicSessionId || undefined, departmentId || undefined);
    const { sections } = useSections(classId || undefined);

    const handleDelete = (id: string, name: string) => {
        modals.openConfirmModal({
            title: 'Delete Student',
            children: (
                <Text size="sm">
                    Are you sure you want to delete <strong>{name}</strong>? This action cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: () => deleteStudent.mutateAsync(id),
        });
    };

    return (
        <Container size="xl" py="xl">
            <LoadingOverlay visible={students.isLoading} />

            <Group justify="space-between" mb="xl">
                <Box>
                    <Title order={2}>Student Master</Title>
                    <Text c="dimmed" size="sm">List and manage all students in the institution</Text>
                </Box>
                <Group>
                    <Link href="/admin/students/create">
                        <ActionIcon variant="light" color="indigo" size="lg" radius="md">
                            <IconPlus size={20} />
                        </ActionIcon>
                    </Link>
                </Group>
            </Group>

            <Paper p="md" mb="xl" withBorder radius="md">
                <Group grow>
                    <Select
                        label="Department"
                        placeholder="All Departments"
                        data={departments.data?.map(d => ({ value: d.id, label: d.name })) || []}
                        value={departmentId}
                        onChange={(val) => {
                            setDepartmentId(val);
                            setClassId(null);
                            setSectionId(null);
                        }}
                        clearable
                        leftSection={<IconFilter size={14} />}
                    />
                    <Select
                        label="Class"
                        placeholder="Select Class"
                        data={classes.data?.map(c => ({ value: c.id, label: c.name })) || []}
                        value={classId}
                        onChange={(val) => {
                            setClassId(val);
                            setSectionId(null);
                        }}
                        disabled={!departmentId}
                        clearable
                    />
                    <Select
                        label="Section"
                        placeholder="Select Section"
                        data={sections.data?.map(s => ({ value: s.id, label: s.name })) || []}
                        value={sectionId}
                        onChange={setSectionId}
                        disabled={!classId}
                        clearable
                    />
                </Group>
            </Paper>

            <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Student</Table.Th>
                            <Table.Th>Enrollment</Table.Th>
                            <Table.Th>Class/Section</Table.Th>
                            <Table.Th>Status</Table.Th>
                            <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {students.data?.map((student) => (
                            <Table.Tr key={student.id}>
                                <Table.Td>
                                    <Group gap="sm">
                                        <Avatar size={32} radius="xl" color="indigo">
                                            {student.firstName.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Text size="sm" fw={500}>{student.firstName} {student.lastName}</Text>
                                            <Text size="xs" c="dimmed">{student.email}</Text>
                                        </Box>
                                    </Group>
                                </Table.Td>
                                <Table.Td><Text size="sm">{student.enrollmentNo}</Text></Table.Td>
                                <Table.Td>
                                    <Text size="sm">{student.class?.name} - {student.section?.name}</Text>
                                    <Text size="xs" c="dimmed">{student.department?.name}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Badge color={student.status === 'ACTIVE' ? 'green' : 'gray'} variant="light" size="sm">
                                        {student.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                                    </Badge>
                                </Table.Td>
                                <Table.Td>
                                    <Group gap={0}>
                                        <ActionIcon
                                            variant="subtle"
                                            color="blue"
                                            component={Link}
                                            href={`/admin/students/${student.id}/edit`}
                                        >
                                            <IconPencil size={16} />
                                        </ActionIcon>
                                        <ActionIcon
                                            variant="subtle"
                                            color="red"
                                            onClick={() => handleDelete(student.id, `${student.firstName} ${student.lastName}`)}
                                        >
                                            <IconTrash size={16} />
                                        </ActionIcon>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>

                {(!students.data || students.data.length === 0) && !students.isLoading && (
                    <Box p="xl" ta="center">
                        <IconUser size={48} color="gray" style={{ opacity: 0.5 }} />
                        <Text c="dimmed" mt="sm">No students found matching filters</Text>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}
