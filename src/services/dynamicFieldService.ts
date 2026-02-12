import { apiClient } from '@/lib/api';
import { DynamicFieldConfig } from '@/types/student';

const BASE_URL = '/dynamic-fields';

export const dynamicFieldService = {
    // Get fields for a specific entity (e.g., STUDENT)
    getByEntity: async (entityType: string): Promise<DynamicFieldConfig[]> => {
        const response = await apiClient<DynamicFieldConfig[]>(`${BASE_URL}?entityType=${entityType}`);
        return response || [];
    },

    // Save (Create/Update?)
    // User spec only listed "2. Create Field Definition POST /dynamic-fields".
    // It did not list generic PUT /dynamic-fields/:id.
    // However, for builder UI we probably need update. I will assume PUT /dynamic-fields/:id exists or POST handles it.
    // Given the prompt is specific about "New Sections" and listed Create, I'll stick to POST for create.
    // If ID exists and we want to update, I'll try PUT as standard practice.
    save: async (field: DynamicFieldConfig): Promise<DynamicFieldConfig> => {
        const id = field.fieldId || field.id;
        const isUpdate = !!id;
        const method = isUpdate ? 'PATCH' : 'POST';
        const url = isUpdate ? `${BASE_URL}/${id}` : BASE_URL;

        let payload: any;
        if (isUpdate) {
            // Spec: PATCH /api/dynamic-fields/:fieldId
            // Request Body: { displayName, isVisible, priority }
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
            // Spec: POST /api/dynamic-fields
            // Request Body: { entityType, name, displayName, controlType, dataType, priority, isVisible, options }
            // Note: masterType is prohibited
            payload = {
                entityType: field.entityType,
                name: field.name,
                displayName: field.displayName,
                controlType: field.controlType, // Backend accepts TEXT, TEXTBOX, TEXTAREA
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

    // Reorder fields
    reorder: async (entityType: string, fieldIds: string[]): Promise<void> => {
        return apiClient<void>(`${BASE_URL}/reorder`, {
            method: 'POST',
            body: JSON.stringify({ entityType, fieldIds }),
        });
    }
};
