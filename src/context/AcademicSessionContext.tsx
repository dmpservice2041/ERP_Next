'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { AcademicSession } from '@/types';

interface AcademicSessionContextType {
    academicSessionId: string | null;
    setAcademicSessionId: (id: string) => void;
    isLoading: boolean;
}

const AcademicSessionContext = createContext<AcademicSessionContextType | undefined>(undefined);

export function AcademicSessionProvider({ children }: { children: ReactNode }) {
    // Initialize with null, will be populated from localStorage or API
    const [academicSessionId, setSessionIdState] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Fetch current active session as fallback
    const { data: currentSession, isLoading: isFetchingCurrent } = useQuery({
        queryKey: ['academic-sessions', 'current'],
        queryFn: async () => apiClient<AcademicSession>('academic-sessions/current'),
        // Only run if we don't have a session ID yet and haven't initialized
        enabled: !isInitialized && !academicSessionId,
    });

    useEffect(() => {
        // 1. Try to load from localStorage on mount
        const storedId = localStorage.getItem('academicSessionId');
        if (storedId) {
            setSessionIdState(storedId);
            setIsInitialized(true);
        }
    }, []);

    useEffect(() => {
        // 2. If no stored ID, use the fetched current session
        if (!isInitialized && currentSession?.id && !academicSessionId) {
            setSessionIdState(currentSession.id);
            localStorage.setItem('academicSessionId', currentSession.id);
            setIsInitialized(true);
        }
    }, [currentSession, isInitialized, academicSessionId]);

    const setAcademicSessionId = (id: string) => {
        setSessionIdState(id);
        localStorage.setItem('academicSessionId', id);
    };

    const value = {
        academicSessionId,
        setAcademicSessionId,
        isLoading: !isInitialized && isFetchingCurrent,
    };

    return (
        <AcademicSessionContext.Provider value={value}>
            {children}
        </AcademicSessionContext.Provider>
    );
}

export function useAcademicSessionContext() {
    const context = useContext(AcademicSessionContext);
    if (context === undefined) {
        throw new Error('useAcademicSessionContext must be used within an AcademicSessionProvider');
    }
    return context;
}
