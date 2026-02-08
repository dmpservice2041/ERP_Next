'use client';

import { Container } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useAcademicSessionContext } from '@/context/AcademicSessionContext';
import { useStudents } from '@/hooks/useStudents';
import PermissionGuard from '@/components/Auth/PermissionGuard';
import { StudentForm, StudentFormValues } from '@/components/Students/StudentForm';
import dayjs from 'dayjs';

export default function AddStudentPage() {
    return (
        <PermissionGuard requiredPermission="students.create">
            <AddStudentContent />
        </PermissionGuard>
    );
}

function AddStudentContent() {
    const router = useRouter();
    const { academicSessionId } = useAcademicSessionContext();
    const { createStudent } = useStudents();

    // ...

    const handleSubmit = async (values: StudentFormValues) => {
        if (!academicSessionId) return;

        const cleanedValues = {
            ...values,
            firstName: values.firstName,
            middleName: values.middleName || undefined,
            lastName: values.lastName,
            email: values.email || undefined,
            phone: values.phone || undefined,
            dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format('YYYY-MM-DD') : undefined,
            admissionDate: values.admissionDate ? dayjs(values.admissionDate).format('YYYY-MM-DD') : undefined,
            gender: values.gender as any || undefined,
            academicSessionId,
            admissionSessionId: values.admissionSessionId || academicSessionId,
            enrollmentNo: values.enrollmentNo,
        };

        await createStudent.mutateAsync(cleanedValues);
        router.push('/admin/students');
    };

    return (
        <Container size="md" py="xl">
            <StudentForm
                onSubmit={handleSubmit}
                isLoading={createStudent.isPending}
                title="Add New Student"
                subtitle="Directly enroll a student into the system"
                submitLabel="Create Student"
            />
        </Container>
    );
}
