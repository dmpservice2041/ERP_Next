import { apiClient } from '@/lib/api';
import { DynamicFieldConfig } from '@/types/student';

const BASE_URL = '/dynamic-fields';

export const dynamicFieldService = {
    
    getByEntity: async (entityType: string): Promise<DynamicFieldConfig[]> => {
        const response = await apiClient<DynamicFieldConfig[]>(`${BASE_URL}?entityType=${entityType}`);
        return response || [];
    },

    
    
    
    
    
    
    save: async (field: DynamicFieldConfig): Promise<DynamicFieldConfig> => {
        const id = field.fieldId || field.id;
        const isUpdate = !!id;
        const method = isUpdate ? 'PATCH' : 'POST';
        const url = isUpdate ? `${BASE_URL}/${id}` : BASE_URL;

        let payload: any;
        if (isUpdate) {
            
            
            payload = {
                displayName: field.displayName,
                isVisible: field.isVisible,
                priority: field.priority,
                isRequired: field.isRequired,
                options: field.options,
                placeholder: field.placeholder,
                maxLength: field.maxLength,
            };
        } else {
            
            
            
            payload = {
                entityType: field.entityType,
                name: field.name,
                displayName: field.displayName,
                controlType: field.controlType, 
                dataType: field.dataType === 'STRING' ? 'TEXT' : field.dataType,
                priority: field.priority,
                isVisible: field.isVisible,
                isRequired: field.isRequired,
                options: field.options,
                placeholder: field.placeholder,
                maxLength: field.maxLength,
            };
        }

        const response = await apiClient<DynamicFieldConfig>(url, {
            method,
            body: JSON.stringify(payload),
        });
        return response;
    },

    delete: async (id: string): Promise<void> => {
        return apiClient<void>(`${BASE_URL}/${id}`, {
            method: 'DELETE',
        });
    },

    
    reorder: async (entityType: string, fieldIds: string[]): Promise<void> => {
        return apiClient<void>(`${BASE_URL}/reorder`, {
            method: 'POST',
            body: JSON.stringify({ entityType, fieldIds }),
        });
    }
};
