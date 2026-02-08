import { RoleShell } from '@/components/Shell/RoleShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <RoleShell requiredRole="ADMIN">{children}</RoleShell>;
}
