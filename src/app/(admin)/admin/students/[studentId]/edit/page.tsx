'use client';

import { Container, LoadingOverlay } from '@mantine/core';
import { useRouter, useParams } from 'next/navigation';
import { useStudent } from '@/hooks/useStudents';
import PermissionGuard from '@/components/Auth/PermissionGuard';
import { StudentForm } from '@/components/Students/StudentForm';
import { studentService } from '@/services/studentService';
import { notifications } from '@mantine/notifications';

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

    const { student } = useStudent(studentId);

    const handleSubmit = async (values: any) => {
        try {
            await studentService.update(studentId, values);
            notifications.show({ title: 'Success', message: 'Student updated successfully', color: 'green' });
            router.push('/admin/students');
        } catch (error: any) {
            notifications.show({ title: 'Error', message: error.message || 'Failed to update student', color: 'red' });
        }
    };

    if (student.isLoading) {
        return <LoadingOverlay visible={true} />;
    }

    return (
        <Container size="md" py="xl">
            <StudentForm
                initialValues={student.data}
                onSubmit={handleSubmit}
                title="Edit Student"
                subtitle={`Update details for ${student.data?.firstName} ${student.data?.lastName}`}
                submitLabel="Update Student"
                isEdit={true}
            />
        </Container>
    );
}
