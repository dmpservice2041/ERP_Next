'use client';

import { Container } from '@mantine/core';
import { useRouter } from 'next/navigation';
import PermissionGuard from '@/components/Auth/PermissionGuard';
import { StudentForm } from '@/components/Students/StudentForm';
import { studentService } from '@/services/studentService';
import { notifications } from '@mantine/notifications';

export default function AddStudentPage() {
    return (
        <PermissionGuard requiredPermission="students.create">
            <AddStudentContent />
        </PermissionGuard>
    );
}

function AddStudentContent() {
    const router = useRouter();

    const handleSubmit = async (values: any) => {
        // values is CreateStudentPayload
        try {
            await studentService.create(values);
            notifications.show({ title: 'Success', message: 'Student created successfully', color: 'green' });
            router.push('/admin/students');
        } catch (error: any) {
            notifications.show({ title: 'Error', message: error.message || 'Failed to create student', color: 'red' });
        }
    };

    return (
        <Container size="md" py="xl">
            <StudentForm
                onSubmit={handleSubmit}
                title="Add New Student"
                subtitle="Directly enroll a student into the system"
                submitLabel="Create Student"
            />
        </Container>
    );
}
