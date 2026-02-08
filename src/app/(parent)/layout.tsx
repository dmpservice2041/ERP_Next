import { RoleShell } from '@/components/Shell/RoleShell';

export default function ParentLayout({ children }: { children: React.ReactNode }) {
    return <RoleShell requiredRole="PARENT">{children}</RoleShell>;
}
