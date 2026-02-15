import { ApiResponse } from '@/types';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

const TOKEN_KEY = 'erp_access_token';

export const getAccessToken = () => typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
export const setAccessToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const removeAccessToken = () => localStorage.removeItem(TOKEN_KEY);



export interface ApiOptions extends RequestInit {
    params?: Record<string, string>;
}

export async function apiClient<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { params, ...init } = options;
    const token = getAccessToken();

    const url = new URL(endpoint.startsWith('/') ? endpoint.slice(1) : endpoint, API_BASE_URL.endsWith('/') ? API_BASE_URL : API_BASE_URL + '/');

    if (params) {
        Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
    }

    const headers = new Headers(init.headers);
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }
    if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
    }



    const res = await fetch(url.toString(), {
        ...init,
        headers,
    });


    if (res.status === 401 && endpoint !== '/auth/refresh' && endpoint !== '/auth/login') {

        removeAccessToken();
        


        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login') && window.location.pathname !== '/') {
            window.location.href = '/login';
        }

        throw new Error('Session expired. Please login again.');
    }

    if (res.status === 204) {
        return [] as unknown as T;
    }

    if (!res.ok) {
        let errorMessage = `API Error: ${res.statusText}`;
        try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
            
        }
        throw new Error(errorMessage);
    }

    
    const text = await res.text();
    if (!text) {
        return [] as unknown as T;
    }

    let data;
    try {
        data = JSON.parse(text);
    } catch (e) {
        throw new Error('Failed to parse response from server');
    }

    if ((data as any).data) {
        return (data as any).data;
    }

    return data as T;
}
