'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { notifications } from '@mantine/notifications';
import { Student, CreateStudentRequest, UpdateStudentRequest } from '@/types';

export function useStudents(filters?: {
    academicSessionId?: string;
    departmentId?: string;
    classId?: string;
    sectionId?: string;
}) {
    const queryClient = useQueryClient();

    const students = useQuery({
        queryKey: ['students', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.academicSessionId) params.append('academicSessionId', filters.academicSessionId);
            if (filters?.departmentId) params.append('departmentId', filters.departmentId);
            if (filters?.classId) params.append('classId', filters.classId);
            if (filters?.sectionId) params.append('sectionId', filters.sectionId);

            return apiClient<Student[]>(`students?${params.toString()}`);
        },
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('erp_access_token') && !!filters?.academicSessionId,
    });

    const createStudent = useMutation({
        mutationFn: (data: CreateStudentRequest) =>
            apiClient<{ id: string }>('students', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
            notifications.show({
                title: 'Success',
                message: 'Student admitted successfully',
                color: 'green',
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to admit student',
                color: 'red',
            });
        },
    });

    const deleteStudent = useMutation({
        mutationFn: (id: string) =>
            apiClient<{ success: boolean }>(`students/${id}`, {
                method: 'DELETE',
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
            notifications.show({
                title: 'Success',
                message: 'Student deleted successfully',
                color: 'green',
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to delete student',
                color: 'red',
            });
        },
    });

    return {
        students,
        createStudent,
        deleteStudent,
    };
}

export function useStudent(id: string) {
    const queryClient = useQueryClient();

    const student = useQuery({
        queryKey: ['student', id],
        queryFn: () => apiClient<Student>(`students/${id}`),
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('erp_access_token') && !!id,
    });

    const updateStudent = useMutation({
        mutationFn: (data: UpdateStudentRequest) =>
            apiClient<{ student: Student }>(`students/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['student', id] });
            queryClient.invalidateQueries({ queryKey: ['students'] });
            notifications.show({
                title: 'Success',
                message: 'Student updated successfully',
                color: 'green',
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to update student',
                color: 'red',
            });
        },
    });

    const createStudentLogin = useMutation({
        mutationFn: (data: { email: string; password: string }) =>
            apiClient<{ userId: string }>(`students/${id}/create-login`, {
                method: 'POST',
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['student', id] });
            notifications.show({
                title: 'Success',
                message: 'Login created successfully for student',
                color: 'green',
            });
        },
        onError: (error: Error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to create login',
                color: 'red',
            });
        },
    });

    return {
        student,
        updateStudent,
        createStudentLogin,
    };
}
