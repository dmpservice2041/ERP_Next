'use client';

import { Container, LoadingOverlay } from '@mantine/core';
import { useRouter, useParams } from 'next/navigation';
import { useStudent } from '@/hooks/useStudents';
import PermissionGuard from '@/components/Auth/PermissionGuard';
import { StudentForm, StudentFormValues } from '@/components/Students/StudentForm';
import dayjs from 'dayjs';

export default function EditStudentPage() {
    return (
        <PermissionGuard requiredPermission="students.update">
            <EditStudentContent />
        </PermissionGuard>
    );
}

function EditStudentContent() {
    const router = useRouter();
    const params = useParams();
    const studentId = params.studentId as string;

    const { student, updateStudent } = useStudent(studentId);

    const handleSubmit = async (values: StudentFormValues) => {
        const payload = {
            enrollmentNo: values.enrollmentNo || undefined,
            firstName: values.firstName || undefined,
            middleName: values.middleName || undefined,
            lastName: values.lastName || undefined,
            email: values.email || undefined,
            phone: values.phone || undefined,
            dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format('YYYY-MM-DD') : undefined,
            admissionDate: values.admissionDate ? dayjs(values.admissionDate).format('YYYY-MM-DD') : undefined,
            gender: values.gender as any || undefined,
            departmentId: values.departmentId || undefined,
            admissionSessionId: values.admissionSessionId || undefined,
            classId: values.classId || undefined,
            sectionId: values.sectionId || undefined,
        };

        updateStudent.mutate(payload, {
            onSuccess: () => {
                router.push('/admin/students');
            }
        });
    };

    if (student.isLoading) {
        return <LoadingOverlay visible={true} />;
    }

    const initialValues = student.data ? {
        firstName: student.data.firstName || '',
        middleName: student.data.middleName || '',
        lastName: student.data.lastName || '',
        email: student.data.email || '',
        phone: student.data.phone || '',
        enrollmentNo: student.data.enrollmentNo || '',
        departmentId: student.data.departmentId || '',
        classId: student.data.classId || '',
        sectionId: student.data.sectionId || '',
        admissionSessionId: student.data.admissionSessionId || '',
        dateOfBirth: student.data.dateOfBirth,
        admissionDate: student.data.admissionDate,
        gender: student.data.gender || '',
    } : {};

    return (
        <Container size="md" py="xl">
            <StudentForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                isLoading={updateStudent.isPending}
                title="Edit Student"
                subtitle={`Update details for ${student.data?.firstName} ${student.data?.lastName}`}
                submitLabel="Update Student"
                isEdit={true}
            />
        </Container>
    );
}
