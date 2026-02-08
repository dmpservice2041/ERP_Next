'use client';

import {
    Title,
    Paper,
    Text,
    Stack,
    TextInput,
    Select,
    Button,
    Grid,
    Group,
    Box,
    LoadingOverlay,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useAcademicSessionContext } from '@/context/AcademicSessionContext';
import { useAcademicSession } from '@/hooks/useAcademicSession';
import { useDepartments } from '@/hooks/useDepartments';
import { useClasses } from '@/hooks/useClasses';
import { useSections } from '@/hooks/useSections';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export interface StudentFormValues {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phone: string;
    enrollmentNo: string;
    departmentId: string;
    classId: string;
    sectionId: string;
    admissionSessionId: string;
    dateOfBirth: Date | null;
    admissionDate: Date | null;
    gender: string;
}

interface StudentFormProps {
    initialValues?: Partial<Omit<StudentFormValues, 'dateOfBirth' | 'admissionDate'> & { dateOfBirth?: string | null; admissionDate?: string | null }>;
    onSubmit: (values: StudentFormValues) => Promise<void>;
    isLoading?: boolean;
    submitLabel?: string;
    title?: string;
    subtitle?: string;
    isEdit?: boolean;
}

export function StudentForm({
    initialValues,
    onSubmit,
    isLoading = false,
    submitLabel = 'Save',
    title = 'Student Details',
    subtitle = 'Manage student information',
    isEdit = false,
}: StudentFormProps) {
    const router = useRouter();
    const { academicSessionId } = useAcademicSessionContext();
    const { departments } = useDepartments();
    const { academicSessions } = useAcademicSession();

    const form = useForm<StudentFormValues>({
        initialValues: {
            firstName: initialValues?.firstName || '',
            middleName: initialValues?.middleName || '',
            lastName: initialValues?.lastName || '',
            email: initialValues?.email || '',
            phone: initialValues?.phone || '',
            enrollmentNo: initialValues?.enrollmentNo || '',
            departmentId: initialValues?.departmentId || '',
            classId: initialValues?.classId || '',
            sectionId: initialValues?.sectionId || '',
            admissionSessionId: initialValues?.admissionSessionId || academicSessionId || '',
            dateOfBirth: initialValues?.dateOfBirth ? new Date(initialValues.dateOfBirth) : null,
            admissionDate: initialValues?.admissionDate ? new Date(initialValues.admissionDate) : null,
            gender: initialValues?.gender || '',
        },
        validate: {
            firstName: (val) => (!val ? 'Required' : null),
            lastName: (val) => (!val ? 'Required' : null),
            enrollmentNo: (val) => (!val ? 'Required' : null),
            departmentId: (val) => (!val ? 'Required' : null),
            classId: (val) => (!val ? 'Required' : null),
            sectionId: (val) => (!val ? 'Required' : null),
        },
    });

    const { classes } = useClasses(
        academicSessionId || undefined,
        form.values.departmentId || undefined
    );
    const { sections } = useSections(form.values.classId || undefined);

    const sessionName = academicSessions.data?.find(s => s.id === form.values.admissionSessionId)?.name || 'Unknown Session';

    useEffect(() => {
        if (initialValues) {
            form.setValues((prev) => ({
                ...prev,
                ...initialValues,
                dateOfBirth: initialValues.dateOfBirth ? new Date(initialValues.dateOfBirth) : prev.dateOfBirth,
                admissionDate: initialValues.admissionDate ? new Date(initialValues.admissionDate) : prev.admissionDate,
                admissionSessionId: initialValues.admissionSessionId || prev.admissionSessionId,
            } as Partial<StudentFormValues>));
        }
    }, [initialValues]);

    return (
        <Box pos="relative">
            <LoadingOverlay visible={isLoading} />
            <Box mb="xl">
                <Title order={2}>{title}</Title>
                <Text c="dimmed" size="sm">
                    {subtitle}
                </Text>
            </Box>

            <form onSubmit={form.onSubmit(onSubmit)}>
                <Stack gap="xl">
                    <Paper withBorder p="xl" radius="md">
                        <Title order={4} mb="lg">
                            Academic Information
                        </Title>
                        <Grid>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Academic Session"
                                    value={sessionName}
                                    disabled
                                    description="Locked to admission session"
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <DateInput
                                    label="Admission Date"
                                    placeholder="Select date"
                                    valueFormat="YYYY-MM-DD"
                                    {...form.getInputProps('admissionDate')}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Select
                                    label="Department"
                                    placeholder="Select Department"
                                    data={
                                        departments.data?.map((d) => ({
                                            value: d.id,
                                            label: d.name,
                                        })) || []
                                    }
                                    {...form.getInputProps('departmentId')}
                                    required
                                    onChange={(val) => {
                                        form.setFieldValue('departmentId', val || '');
                                        form.setFieldValue('classId', '');
                                        form.setFieldValue('sectionId', '');
                                    }}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Select
                                    label="Class"
                                    placeholder="Select Class"
                                    data={
                                        classes.data?.map((c) => ({
                                            value: c.id,
                                            label: c.name,
                                        })) || []
                                    }
                                    {...form.getInputProps('classId')}
                                    required
                                    disabled={!form.values.departmentId}
                                    onChange={(val) => {
                                        form.setFieldValue('classId', val || '');
                                        form.setFieldValue('sectionId', '');
                                    }}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Select
                                    label="Section"
                                    placeholder="Select Section"
                                    data={
                                        sections.data?.map((s) => ({
                                            value: s.id,
                                            label: s.name,
                                        })) || []
                                    }
                                    {...form.getInputProps('sectionId')}
                                    required
                                    disabled={!form.values.classId}
                                />
                            </Grid.Col>
                        </Grid>
                    </Paper>

                    <Paper withBorder p="xl" radius="md">
                        <Title order={4} mb="lg">
                            Personal Details
                        </Title>
                        <Grid>
                            <Grid.Col span={4}>
                                <TextInput
                                    label="First Name"
                                    placeholder="John"
                                    required
                                    {...form.getInputProps('firstName')}
                                />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <TextInput
                                    label="Middle Name"
                                    placeholder="A."
                                    {...form.getInputProps('middleName')}
                                />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <TextInput
                                    label="Last Name"
                                    placeholder="Doe"
                                    required
                                    {...form.getInputProps('lastName')}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Email"
                                    placeholder="john.doe@example.com"
                                    {...form.getInputProps('email')}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Phone"
                                    placeholder="+1 234 567 890"
                                    {...form.getInputProps('phone')}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <DateInput
                                    label="Date of Birth"
                                    placeholder="Select date"
                                    valueFormat="YYYY-MM-DD"
                                    {...form.getInputProps('dateOfBirth')}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Select
                                    label="Gender"
                                    placeholder="Select Gender"
                                    data={[
                                        { value: 'MALE', label: 'Male' },
                                        { value: 'FEMALE', label: 'Female' },
                                        { value: 'OTHER', label: 'Other' },
                                    ]}
                                    {...form.getInputProps('gender')}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Enrollment Number"
                                    placeholder="STU2024001"
                                    required
                                    {...form.getInputProps('enrollmentNo')}
                                />
                            </Grid.Col>
                        </Grid>
                    </Paper>

                    <Group justify="flex-end">
                        <Button
                            variant="subtle"
                            color="gray"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" loading={isLoading}>
                            {submitLabel}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Box>
    );
}
