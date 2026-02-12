import { apiClient } from '@/lib/api';
import { CreateStudentPayload, StudentFull } from '@/types/student';

const BASE_URL = '/students';

export const studentService = {
    create: async (payload: CreateStudentPayload): Promise<StudentFull> => {
        return apiClient<StudentFull>(BASE_URL, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    update: async (id: string, payload: Partial<CreateStudentPayload>): Promise<StudentFull> => {
        return apiClient<StudentFull>(`${BASE_URL}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
    },

    getById: async (id: string): Promise<StudentFull> => {
        return apiClient<StudentFull>(`${BASE_URL}/${id}`);
    },

    // Search/Filter (if needed later)
    getAll: async (params?: Record<string, string>): Promise<StudentFull[]> => {
        return apiClient<StudentFull[]>(BASE_URL, { params });
    }
};
