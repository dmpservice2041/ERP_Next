import { apiClient } from '@/lib/api';
import { MasterDataItem, MasterDataType } from '@/types/student';

const BASE_URL = '/master-data';

export const masterDataService = {
    
    getByType: async (type: MasterDataType, isVisible?: boolean): Promise<MasterDataItem[]> => {
        let url = `${BASE_URL}?type=${type}`;
        if (isVisible !== undefined) {
            url += `&isVisible=${isVisible}`;
        }
        const response = await apiClient<MasterDataItem[]>(url);
        return response || [];
    },

    
    
    
    
    
    
    getAllTypes: async (): Promise<string[]> => {
        
        
        
        
        
        
        
        return ['RELIGION', 'BLOOD_GROUP', 'HOUSE', 'CAST_CATEGORY']; 
    },

    create: async (data: Omit<MasterDataItem, 'id'>): Promise<MasterDataItem> => {
        const response = await apiClient<MasterDataItem>(BASE_URL, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response;
    },

    update: async (id: string, data: Partial<MasterDataItem>): Promise<MasterDataItem> => {
        
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
