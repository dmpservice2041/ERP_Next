import { RoleShell } from '@/components/Shell/RoleShell';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
    return <RoleShell requiredRole="STAFF">{children}</RoleShell>;
}
