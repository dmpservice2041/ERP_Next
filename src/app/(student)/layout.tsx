import { RoleShell } from '@/components/Shell/RoleShell';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    return <RoleShell requiredRole="STUDENT">{children}</RoleShell>;
}
