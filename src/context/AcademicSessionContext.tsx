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

    const [academicSessionId, setSessionIdState] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);


    const { data: currentSession, isLoading: isFetchingCurrent } = useQuery({
        queryKey: ['academic-sessions', 'current'],
        queryFn: async () => apiClient<AcademicSession>('academic-sessions/current'),
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('erp_access_token'),
    });

    useEffect(() => {
        
    }, []);

    useEffect(() => {
        if (!isInitialized && currentSession?.id && !academicSessionId) {
            setSessionIdState(currentSession.id);
            
            setIsInitialized(true);
        }
    }, [currentSession, isInitialized, academicSessionId]);

    const setAcademicSessionId = (id: string) => {
        setSessionIdState(id);
        
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
