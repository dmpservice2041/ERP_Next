import { apiClient } from '@/lib/api';
import { MasterDataItem, MasterDataType } from '@/types/student';

const BASE_URL = '/master-data';

export const masterDataService = {
    // Get all items for a specific type (e.g., RELIGION)
    getByType: async (type: MasterDataType, isVisible?: boolean): Promise<MasterDataItem[]> => {
        let url = `${BASE_URL}?type=${type}`;
        if (isVisible !== undefined) {
            url += `&isVisible=${isVisible}`;
        }
        const response = await apiClient<MasterDataItem[]>(url);
        return response || [];
    },

    // Get all types available (for the management UI)
    // NOTE: This endpoint might not be in the new spec. If not, we might need to hardcode or use a different approach.
    // For now assuming it exists or we get it from a config.
    // Spec says: GET /master-data lists data.
    // If there is no specific /types endpoint, we might have to just rely on client-side constants or a different metadata endpoint.
    // I will keep it for now but with a TODO or catch.
    getAllTypes: async (): Promise<string[]> => {
        // Fallback or specific endpoint
        // return apiClient<string[]>(`${BASE_URL}/types`);
        // Since user didn't specify a "Get Types" endpoint, I will assume we might strictly use the defined types in frontend or maybe /master-data returns distinct types if no param?
        // Let's assume for now we use the hardcoded list in types/student.ts or similar if this fails.
        // Actually, let's try to fetch unique types or just return the hardcoded list from the frontend constants if the API doesn't support it.
        // For the sake of this task, I'll update it to match the likely implementation or mock it if needed.
        // Let's assume /master-data/types exists or is not needed if we iterate over known types.
        return ['RELIGION', 'BLOOD_GROUP', 'HOUSE', 'CAST_CATEGORY']; // Temporary fallback or actual call
    },

    create: async (data: Omit<MasterDataItem, 'id'>): Promise<MasterDataItem> => {
        const response = await apiClient<MasterDataItem>(BASE_URL, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response;
    },

    update: async (id: string, data: Partial<MasterDataItem>): Promise<MasterDataItem> => {
        // Spec: PUT /master-data/:id, Body: { fieldName, isVisible }
        const response = await apiClient<MasterDataItem>(`${BASE_URL}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return response;
    },

    delete: async (id: string): Promise<void> => {
        return apiClient<void>(`${BASE_URL}/${id}`, {
            method: 'DELETE',
        });
    },
};
