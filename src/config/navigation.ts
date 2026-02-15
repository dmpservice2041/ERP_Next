import {
    IconUsers,
    IconSettings,
    IconSchool,
    IconDashboard,
    IconUserCircle,
    IconShieldLock,
    IconCalendarEvent,
    IconBooks,
    IconChalkboard,
    IconDatabase,
    IconForms,
} from '@tabler/icons-react';

export interface NavItem {
    label: string;
    link?: string; 
    icon: React.ComponentType<{ size?: number; stroke?: number }>;
    permission?: string;
    links?: NavItem[]; 
    initiallyOpened?: boolean;
}

export const MENU_ITEMS: NavItem[] = [
    {
        label: 'Dashboard',
        link: '/admin/dashboard',
        icon: IconDashboard,
    },
    {
        label: 'Academic Setup',
        icon: IconSchool,
        permission: 'academic_sessions.read', 
        links: [
            {
                label: 'Academic Sessions',
                link: '/admin/academic-sessions',
                icon: IconCalendarEvent,
                permission: 'academic_sessions.read',
            },
            {
                label: 'Departments',
                link: '/admin/departments',
                icon: IconSchool,
                permission: 'departments.read',
            },
            {
                label: 'Classes',
                link: '/admin/classes',
                icon: IconChalkboard,
                permission: 'classes.read',
            },
        ],
    },
    {
        label: 'Students',
        icon: IconUsers,
        permission: 'students.read',
        links: [
            {
                label: 'Student Master',
                link: '/admin/students',
                icon: IconUsers,
                permission: 'students.read',
            },
            {
                label: 'Add Student',
                link: '/admin/students/create',
                icon: IconUsers,
                permission: 'students.create',
            },
            {
                label: 'Attendance',
                link: '/admin/students/attendance',
                icon: IconCalendarEvent,
                permission: 'attendance.read',
            },
        ],
    },
    {
        label: 'Staff',
        icon: IconUsers,
        permission: 'staff.read',
        links: [
            {
                label: 'Staff Master',
                link: '/admin/staff',
                icon: IconUsers,
                permission: 'staff.read',
            },
            {
                label: 'Attendance',
                link: '/admin/staff/attendance',
                icon: IconCalendarEvent,
                permission: 'attendance.read',
            },
        ],
    },
    {
        label: 'User Management',
        icon: IconShieldLock,
        permission: 'users.read',
        links: [
            {
                label: 'Admin Users',
                link: '/admin/users/admin',
                icon: IconShieldLock,
                permission: 'users.read',
            },
            {
                label: 'Staff Users',
                link: '/admin/users/staff',
                icon: IconShieldLock,
                permission: 'users.read',
            },
            {
                label: 'Roles & Permissions',
                link: '/admin/roles',
                icon: IconShieldLock,
                permission: 'roles.read',
            },
        ],
    },
    {
        label: 'System Configuration',
        icon: IconSettings,
        links: [
            {
                label: 'Master Data',
                link: '/master-data',
                icon: IconDatabase,
                permission: 'master_data.read',
            },
            {
                label: 'Dynamic Fields',
                link: '/dynamic-fields',
                icon: IconForms,
                permission: 'dynamic_fields.read',
            },
        ],
    },
];
