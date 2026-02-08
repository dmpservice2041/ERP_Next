'use client';

import { Container, Title, Text, Box, Paper, Center, Group, Select } from '@mantine/core';
import { IconCalendarEvent, IconFilter } from '@tabler/icons-react';
import { useAcademicSessionContext } from '@/context/AcademicSessionContext';
import { useState } from 'react';
import { useDepartments } from '@/hooks/useDepartments';
import { useClasses } from '@/hooks/useClasses';
import PermissionGuard from '@/components/Auth/PermissionGuard';

export default function AttendancePage() {
    return (
        <PermissionGuard requiredPermission="attendance.read">
            <AttendanceContent />
        </PermissionGuard>
    );
}

function AttendanceContent() {
    const { academicSessionId } = useAcademicSessionContext();
    const [departmentId, setDepartmentId] = useState<string | null>(null);
    const [classId, setClassId] = useState<string | null>(null);

    const { departments } = useDepartments();
    const { classes } = useClasses(academicSessionId || undefined, departmentId || undefined);

    return (
        <Container size="xl" py="xl">
            <Box mb="xl">
                <Title order={2}>Attendance Management</Title>
                <Text c="dimmed" size="sm">Track and manage attendance records</Text>
            </Box>

            <Paper p="md" mb="xl" withBorder radius="md">
                <Group grow>
                    <Select
                        label="Department"
                        placeholder="Select Department"
                        data={departments.data?.map(d => ({ value: d.id, label: d.name })) || []}
                        value={departmentId}
                        onChange={(val) => {
                            setDepartmentId(val);
                            setClassId(null);
                        }}
                        clearable
                        leftSection={<IconFilter size={14} />}
                    />
                    <Select
                        label="Class"
                        placeholder="Select Class"
                        data={classes.data?.map(c => ({ value: c.id, label: c.name })) || []}
                        value={classId}
                        onChange={setClassId}
                        disabled={!departmentId}
                        clearable
                    />
                </Group>
            </Paper>

            <Paper withBorder p="xl" radius="md">
                <Center py={60} style={{ flexDirection: 'column' }}>
                    <IconCalendarEvent size={60} color="gray" style={{ opacity: 0.3 }} />
                    <Title order={4} mt="md" c="dimmed">Attendance Module</Title>
                    <Text c="dimmed" size="sm" ta="center" mt="xs">
                        This module is currently being optimized for faster record entry. <br />
                        Please verify your academic filters above to prepare for the live session.
                    </Text>
                </Center>
            </Paper>
        </Container>
    );
}
