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
    Divider,
    NumberInput,
    Textarea,
    Checkbox,
    Radio,
    FileInput,
    Avatar,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useAcademicSessionContext } from '@/context/AcademicSessionContext';
import { useAcademicSession } from '@/hooks/useAcademicSession';
import { useDepartments } from '@/hooks/useDepartments';
import { useClasses } from '@/hooks/useClasses';
import { useSections } from '@/hooks/useSections';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { notifications } from '@mantine/notifications';

// Services & Types
import { masterDataService } from '@/services/masterDataService';
import { dynamicFieldService } from '@/services/dynamicFieldService';
import { studentService } from '@/services/studentService';
import {
    StudentCore,
    MasterDataItem,
    DynamicFieldConfig,
    CreateStudentPayload,
    DynamicFieldValue,
    StudentFull
} from '@/types/student';
import { IconUpload } from '@tabler/icons-react';

interface StudentFormProps {
    initialValues?: Partial<StudentFull>;
    onSubmit?: (values: any) => Promise<void>; // Optional custom submit handler
    isLoading?: boolean;
    submitLabel?: string;
    title?: string;
    subtitle?: string;
    isEdit?: boolean;
}

export function StudentForm({
    initialValues,
    onSubmit: customSubmit, // Allow overriding submit for transparency if needed
    isLoading: parentLoading = false,
    submitLabel = 'Save Student',
    title = 'Student Details',
    subtitle = 'Manage student information',
    isEdit = false,
}: StudentFormProps) {
    const router = useRouter();
    const { academicSessionId } = useAcademicSessionContext();
    const { departments } = useDepartments();
    const { academicSessions } = useAcademicSession();

    // Local State for Metadata
    const [loadingMeta, setLoadingMeta] = useState(true);
    const [masterTypes, setMasterTypes] = useState<string[]>([]);
    const [masterData, setMasterData] = useState<Record<string, MasterDataItem[]>>({});
    const [dynamicFields, setDynamicFields] = useState<DynamicFieldConfig[]>([]);

    const [submitting, setSubmitting] = useState(false);

    // Load Metadata on Mount
    useEffect(() => {
        const loadMetadata = async () => {
            try {
                // 1. Load Dynamic Fields Configuration
                const dynFields = await dynamicFieldService.getByEntity('STUDENT');
                setDynamicFields(dynFields.filter(f => f.isVisible).sort((a, b) => a.priority - b.priority));

                // 2. Identify required Master Types (from Fixed list + Dynamic Fields)
                // Core master types we always want
                const coreMasterTypes = ['RELIGION', 'BLOOD_GROUP', 'HOUSE', 'CAST_CATEGORY', 'NATIONALITY'];
                // Extract master types linked in dynamic fields
                const dynamicMasterTypes = dynFields
                    .filter(f => f.controlType === 'DROPDOWN' && f.masterType)
                    .map(f => f.masterType!);

                const allTypes = Array.from(new Set([...coreMasterTypes, ...dynamicMasterTypes]));
                setMasterTypes(allTypes);

                // 3. Fetch Master Data for all types
                const masterDataMap: Record<string, MasterDataItem[]> = {};
                await Promise.all(allTypes.map(async (type) => {
                    const items = await masterDataService.getByType(type, true); // Fetch only visible items
                    masterDataMap[type] = items.sort((a, b) => (a.order || 0) - (b.order || 0));
                }));
                setMasterData(masterDataMap);

            } catch (error) {
                console.error('Failed to load metadata', error);
                notifications.show({ title: 'Error', message: 'Failed to load form definitions', color: 'red' });
            } finally {
                setLoadingMeta(false);
            }
        };

        loadMetadata();
    }, []);

    // Helper to map API response to Form State
    const mapStudentToForm = (student: Partial<StudentFull>) => {
        if (!student.core) return null;

        const flat: any = {
            ...student.core,
            // Convert ISO strings to Date objects for Mantine DateInput
            dob: student.core.dob ? new Date(student.core.dob) : null,
            admissionDate: student.core.admissionDate ? new Date(student.core.admissionDate) : new Date(),
            joiningDate: student.core.joiningDate ? new Date(student.core.joiningDate) : new Date(),
        };

        // Map Master Data (nested object -> flat keys)
        if (student.masterData) {
            Object.entries(student.masterData).forEach(([type, item]) => {
                if (item && item.id) {
                    flat[`master_${type}`] = item.id;
                }
            });
        }

        // Map Dynamic Data (nested object -> flat keys)
        if (student.dynamicValues) {
            Object.entries(student.dynamicValues).forEach(([key, value]) => {
                flat[`dyn_${key}`] = value;
            });
        }

        // Map new fields
        flat.fatherName = student.core.fatherName || '';
        flat.fatherMobile = student.core.fatherMobile || '';
        flat.motherName = student.core.motherName || '';
        flat.motherMobile = student.core.motherMobile || '';
        flat.currentAddress = student.core.currentAddress || '';
        flat.currentCity = student.core.currentCity || '';
        flat.currentState = student.core.currentState || '';
        flat.currentCountry = student.core.currentCountry || '';
        flat.currentPincode = student.core.currentPincode || '';

        return flat;
    };

    // Form Initialization
    const form = useForm({
        initialValues: {
            // Core
            enrollmentNo: '',
            rollNo: '',
            firstName: '',
            middleName: '',
            lastName: '',
            email: '',
            mobile: '',
            emergencyPhone: '',
            departmentId: '',
            classId: '',
            sectionId: '',
            admissionSessionId: academicSessionId || '',
            dob: null as Date | null,
            admissionDate: new Date(), // Default today
            joiningDate: new Date(),   // Default today
            gender: '',
            // Parent
            fatherName: '',
            fatherMobile: '',
            motherName: '',
            motherMobile: '',
            // Address
            currentAddress: '',
            currentCity: '',
            currentState: '',
            currentCountry: '',
            currentPincode: '',
            // ... dynamic fields will be auto-filled
        },
        validate: {
            firstName: (val) => (!val ? 'Required' : null),
            lastName: (val) => (!val ? 'Required' : null),
            enrollmentNo: (val) => (!val ? 'Required' : null),
            departmentId: (val) => (!val ? 'Required' : null),
            classId: (val) => (!val ? 'Required' : null),
            sectionId: (val) => (!val ? 'Required' : null),
            mobile: (val) => (!val ? 'Required' : null),
            gender: (val) => (!val ? 'Required' : null),
            fatherMobile: (val) => (val && !/^\d+$/.test(val) ? 'Must be numeric' : null),
            motherMobile: (val) => (val && !/^\d+$/.test(val) ? 'Must be numeric' : null),
            currentPincode: (val) => (val && !/^\d+$/.test(val) ? 'Must be numeric' : null),
        },
    });

    // Hydrate form when initialValues change (Edit Mode)
    useEffect(() => {
        if (initialValues) {
            const mapped = mapStudentToForm(initialValues);
            if (mapped) {
                form.setValues(mapped);
                form.resetDirty(mapped);
            }
        }
    }, [initialValues]);

    // Dependent Queries for Core Fields
    const { classes } = useClasses(
        academicSessionId || undefined
    );
    const { sections } = useSections();

    const sessionName = academicSessions.data?.find(s => s.id === form.values.admissionSessionId)?.name || 'Unknown Session';

    // Handle Submit
    const handleSubmit = async (values: typeof form.values) => {
        setSubmitting(true);
        try {
            // 1. Construct Flat Payload
            // Cast to any to allow mapping properties that might not be in generic CreateStudentPayload if strictly typed
            const payload: any = {
                // Context
                academicSessionId: values.admissionSessionId,
                admissionSessionId: values.admissionSessionId,

                // Identity
                firstName: values.firstName,
                middleName: values.middleName,
                lastName: values.lastName,
                enrollmentNo: values.enrollmentNo,
                rollNo: values.rollNo,

                // Hierarchy
                departmentId: values.departmentId,
                classId: values.classId,
                sectionId: values.sectionId,

                // Contact
                phone: values.mobile,
                email: values.email,
                emergencyPhone: values.emergencyPhone,

                // Personal
                dateOfBirth: values.dob ? values.dob.toISOString() : undefined,
                gender: values.gender,
                joiningDate: values.joiningDate ? values.joiningDate.toISOString() : undefined,
                admissionDate: values.admissionDate ? values.admissionDate.toISOString() : undefined,

                // Master Fields
                religionId: (values as any)['master_RELIGION'],
                bloodGroupId: (values as any)['master_BLOOD_GROUP'],
                nationalityId: (values as any)['master_NATIONALITY'],
                categoryId: (values as any)['master_CAST_CATEGORY'],
                houseId: (values as any)['master_HOUSE'],

                // Parent
                fatherName: values.fatherName,
                fatherMobile: values.fatherMobile,
                motherName: values.motherName,
                motherMobile: values.motherMobile,

                // Address
                presentAddress: values.currentAddress,
                presentCity: values.currentCity,
                presentState: values.currentState,
                presentCountry: values.currentCountry,
                presentPincode: values.currentPincode,

                // Dynamic Fields
                dynamicFields: []
            };

            // 2. Construct Dynamic Fields
            const fieldValues: { fieldId: string; value: any }[] = [];
            dynamicFields.forEach(field => {
                const key = `dyn_${field.name}`;
                const val = (values as any)[key];
                if (val !== undefined && val !== null && val !== '') {
                    fieldValues.push({
                        fieldId: field.fieldId || field.id || '',
                        value: val
                    });
                }
            });
            payload.dynamicFields = fieldValues;

            if (customSubmit) {
                await customSubmit(payload);
            } else {
                if (isEdit && initialValues?.id) {
                    await studentService.update(initialValues.id, payload);
                    notifications.show({ title: 'Success', message: 'Student updated', color: 'green' });
                } else {
                    await studentService.create(payload as CreateStudentPayload);
                    notifications.show({ title: 'Success', message: 'Student created', color: 'green' });
                    // Optional: redirect or reset
                    router.push('/admin/students');
                }
            }

        } catch (error) {
            console.error(error);
            notifications.show({ title: 'Error', message: 'Failed to save student', color: 'red' });
        } finally {
            setSubmitting(false);
        }
    };

    // Helper to render dynamic control
    const renderDynamicControl = (field: DynamicFieldConfig) => {
        const key = `dyn_${field.name}`;
        const inputProps = form.getInputProps(key);

        // Ensure value is never undefined to prevent controlled/uncontrolled warning
        // Default to false for checkboxes, empty string for others
        const value = inputProps.value ?? (field.controlType === 'CHECKBOX' ? false : '');

        // Common props (excluding value which we handle explicitly)
        const { value: __, ...otherProps } = inputProps;
        const props = {
            label: field.displayName,
            required: field.isRequired,
            value,
            ...otherProps,
        };

        const fieldKey = field.fieldId || field.id || field.name;

        if (field.controlType === 'TEXT') {
            return <TextInput key={fieldKey} {...props} placeholder={field.placeholder} />;
        }
        if (field.controlType === 'NUMBER') {
            return <NumberInput key={fieldKey} {...props} placeholder={field.placeholder} />;
        }
        if (field.controlType === 'TEXTAREA') {
            return <Textarea key={fieldKey} {...props} placeholder={field.placeholder} />;
        }
        if (field.controlType === 'DATE') {
            return <DateInput key={fieldKey} {...props} valueFormat="YYYY-MM-DD" placeholder={field.placeholder} />;
        }
        if (field.controlType === 'CHECKBOX') {
            return <Checkbox key={fieldKey} {...props} label={field.displayName} checked={!!value} />;
        }
        if (field.controlType === 'DROPDOWN') {
            let data: { value: string; label: string }[] = [];
            if (field.masterType && masterData[field.masterType]) {
                data = masterData[field.masterType].map(i => ({ value: i.id, label: i.fieldName }));
            } else if (field.options) {
                data = field.options.map(o => ({ value: o, label: o }));
            }
            return <Select key={fieldKey} {...props} data={data} placeholder={field.placeholder || 'Select...'} searchable />;
        }
        return null;
    };

    // Helper to render Master Dropdown (for Core 2nd Layer)
    const renderMasterDropdown = (type: string, label: string, required = false) => {
        const key = `master_${type}`;
        const data = masterData[type]?.map(i => ({ value: i.id, label: i.fieldName })) || [];

        return (
            <Select
                label={label}
                placeholder={`Select ${label}`}
                data={data}
                searchable
                required={required}
                {...form.getInputProps(key)}
            />
        );
    };

    const isLoading = loadingMeta || parentLoading || submitting;

    return (
        <Box pos="relative">
            <LoadingOverlay visible={isLoading} />
            <Box mb="xl">
                <Title order={2}>{title}</Title>
                <Text c="dimmed" size="sm">
                    {subtitle}
                </Text>
            </Box>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="xl">
                    {/* LAYER 1: FIXED CORE FIELDS */}
                    <Paper withBorder p="xl" radius="md">
                        <Title order={4} mb="lg">Academic & Personal (Core)</Title>
                        <Grid>
                            {/* Row 1: Context */}
                            <Grid.Col span={4}>
                                <TextInput label="Academic Session" value={sessionName} disabled />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <TextInput
                                    label="Enrollment No"
                                    required
                                    {...form.getInputProps('enrollmentNo')}
                                    placeholder="STU-2024-XXXX"
                                />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <TextInput
                                    label="Roll No"
                                    {...form.getInputProps('rollNo')}
                                    placeholder="e.g. 101"
                                />
                            </Grid.Col>

                            {/* Row 2: Hierarchy */}
                            <Grid.Col span={4}>
                                <Select
                                    label="Department"
                                    placeholder="Select Department"
                                    data={departments.data?.map(d => ({ value: d.id, label: d.name })) || []}
                                    {...form.getInputProps('departmentId')}
                                    required
                                    onChange={(val) => {
                                        form.setFieldValue('departmentId', val || '');
                                        form.setFieldValue('classId', '');
                                        form.setFieldValue('sectionId', '');
                                    }}
                                />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <Select
                                    label="Class"
                                    placeholder="Select Class"
                                    data={classes.data?.map(c => ({ value: c.id, label: c.name })) || []}
                                    {...form.getInputProps('classId')}
                                    required
                                    disabled={!form.values.departmentId}
                                    onChange={(val) => {
                                        form.setFieldValue('classId', val || '');
                                        form.setFieldValue('sectionId', '');
                                    }}
                                />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <Select
                                    label="Section"
                                    placeholder="Select Section"
                                    data={sections.data?.map(s => ({ value: s.id, label: s.name })) || []}
                                    {...form.getInputProps('sectionId')}
                                    required
                                    disabled={!form.values.classId}
                                />
                            </Grid.Col>

                            {/* Row 3: Name */}
                            <Grid.Col span={4}>
                                <TextInput label="First Name" required {...form.getInputProps('firstName')} />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <TextInput label="Middle Name" {...form.getInputProps('middleName')} />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <TextInput label="Last Name" required {...form.getInputProps('lastName')} />
                            </Grid.Col>

                            {/* Row 4: Dates & Gender */}
                            <Grid.Col span={3}>
                                <DateInput
                                    label="Date of Birth"
                                    valueFormat="YYYY-MM-DD"
                                    {...form.getInputProps('dob')}
                                />
                            </Grid.Col>
                            <Grid.Col span={3}>
                                <Select
                                    label="Gender"
                                    data={['MALE', 'FEMALE', 'OTHER']}
                                    required
                                    {...form.getInputProps('gender')}
                                />
                            </Grid.Col>
                            <Grid.Col span={3}>
                                <DateInput
                                    label="Admission Date"
                                    valueFormat="YYYY-MM-DD"
                                    {...form.getInputProps('admissionDate')}
                                />
                            </Grid.Col>
                            <Grid.Col span={3}>
                                <DateInput
                                    label="Joining Date"
                                    valueFormat="YYYY-MM-DD"
                                    {...form.getInputProps('joiningDate')}
                                />
                            </Grid.Col>

                            {/* Row 5: Contact */}
                            <Grid.Col span={6}>
                                <TextInput label="Mobile" required {...form.getInputProps('mobile')} />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput label="Email" {...form.getInputProps('email')} />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput label="Emergency Phone" {...form.getInputProps('emergencyPhone')} />
                            </Grid.Col>
                        </Grid>
                    </Paper>

                    {/* NEW LAYER 1B: PARENT DETAILS */}
                    <Paper withBorder p="xl" radius="md">
                        <Title order={4} mb="lg">Parent Information</Title>
                        <Grid>
                            <Grid.Col span={6}>
                                <TextInput label="Father Name" {...form.getInputProps('fatherName')} />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput label="Father Mobile" {...form.getInputProps('fatherMobile')} />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput label="Mother Name" {...form.getInputProps('motherName')} />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput label="Mother Mobile" {...form.getInputProps('motherMobile')} />
                            </Grid.Col>
                        </Grid>
                    </Paper>

                    {/* NEW LAYER 1C: PRESENT ADDRESS */}
                    <Paper withBorder p="xl" radius="md">
                        <Title order={4} mb="lg">Present Address</Title>
                        <Grid>
                            <Grid.Col span={12}>
                                <Textarea label="Address" {...form.getInputProps('currentAddress')} autosize minRows={2} />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <TextInput label="City" {...form.getInputProps('currentCity')} />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <TextInput label="State" {...form.getInputProps('currentState')} />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <TextInput label="Country" {...form.getInputProps('currentCountry')} />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <TextInput label="Pincode" {...form.getInputProps('currentPincode')} />
                            </Grid.Col>
                        </Grid>
                    </Paper>

                    {/* LAYER 2: MASTER-BACKED FIELDS */}
                    <Paper withBorder p="xl" radius="md">
                        <Title order={4} mb="lg">Additional Details (Standard)</Title>
                        <Grid>
                            <Grid.Col span={4}>
                                {renderMasterDropdown('RELIGION', 'Religion')}
                            </Grid.Col>
                            <Grid.Col span={4}>
                                {renderMasterDropdown('BLOOD_GROUP', 'Blood Group')}
                            </Grid.Col>
                            <Grid.Col span={4}>
                                {renderMasterDropdown('CAST_CATEGORY', 'Category')}
                            </Grid.Col>
                            <Grid.Col span={6}>
                                {renderMasterDropdown('HOUSE', 'House')}
                            </Grid.Col>
                            <Grid.Col span={6}>
                                {renderMasterDropdown('NATIONALITY', 'Nationality')}
                            </Grid.Col>
                        </Grid>
                    </Paper>

                    {/* LAYER 3: DYNAMIC FIELDS */}
                    {dynamicFields.length > 0 && (
                        <Paper withBorder p="xl" radius="md">
                            <Title order={4} mb="lg">Extended Details</Title>
                            <Grid>
                                {dynamicFields.map(field => (
                                    <Grid.Col key={field.fieldId || field.id || field.name} span={6}>
                                        {renderDynamicControl(field)}
                                    </Grid.Col>
                                ))}
                            </Grid>
                        </Paper>
                    )}

                    <Group justify="flex-end">
                        <Button variant="subtle" color="gray" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" loading={submitting}>{submitLabel}</Button>
                    </Group>
                </Stack>
            </form>
        </Box>
    );
}
