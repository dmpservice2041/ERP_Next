import { Select, Loader } from '@mantine/core';
import { useAcademicSession } from '@/hooks/useAcademicSession';
import { useAcademicSessionContext } from '@/context/AcademicSessionContext';

export function AcademicSessionSelect() {
    const { academicSessions } = useAcademicSession();
    const { academicSessionId, setAcademicSessionId, isLoading: isContextLoading } = useAcademicSessionContext();

    const isLoading = academicSessions.isLoading || isContextLoading;
    const sessions = academicSessions.data || [];

    return (
        <Select
            data={sessions.map(s => ({ value: s.id, label: s.name }))}
            value={academicSessionId}
            onChange={(val) => val && setAcademicSessionId(val)}
            placeholder="Select Academic Session"
            size="sm"
            w={180}
            disabled={isLoading}
            rightSection={isLoading ? <Loader size="xs" /> : null}
            styles={{
                input: {
                    backgroundColor: 'var(--mantine-color-gray-0)',
                    border: '1px solid var(--mantine-color-gray-3)',
                    color: 'var(--mantine-color-dark-6)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'all 0.15s ease',
                    '&:hover': {
                        borderColor: 'var(--mantine-color-indigo-4)',
                        backgroundColor: 'var(--mantine-color-gray-1)',
                    },
                    '&:focus': {
                        borderColor: 'var(--mantine-color-indigo-5)',
                    }
                },
                dropdown: {
                    border: '1px solid var(--mantine-color-gray-3)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                }
            }}
            comboboxProps={{
                shadow: 'md',
                transitionProps: { transition: 'pop', duration: 200 }
            }}
        />
    );
}
