export type Role = 'ADMIN' | 'STAFF' | 'STUDENT' | 'PARENT';

export interface User {
    id: string;
    name: string;
    email: string;
    identity: Role;
    permissions?: string[]; // Only for ADMIN/STAFF
    avatar?: string;
}

export interface AcademicSession {
    id: string;
    name: string; // e.g. "2023-2024"
    isActive: boolean;
    startDate: string;
    endDate: string;
}

export interface Department {
    id: string;
    name: string;
    code: string;
    alias: string;
    isActive: boolean;
    _count?: {
        students: number;
        staff: number;
    };
}

export interface ClassEntity {
    id: string;
    name: string;
    departmentId?: string;
    department?: Department; // Optional relation
    isActive: boolean;
    academicSessionId: string;
    _count?: {
        sections: number;
        students: number;
    };
}

export interface SectionEntity {
    id: string;
    name: string;
    classId: string;
    class?: ClassEntity; // Optional relation
    isActive: boolean;
    order?: number;
    _count?: {
        students: number;
    };
}




export interface Student {
    id: string;
    enrollmentNo: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    admissionDate?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    departmentId: string;
    admissionSessionId: string;
    classId: string;
    sectionId: string;
    currentYear?: number;
    currentSemester?: number;
    status: 'ACTIVE' | 'INACTIVE' | 'ALUMNI' | 'SUSPENDED';
    department?: Department;
    admissionSession?: AcademicSession;
    class?: ClassEntity;
    section?: SectionEntity;
    userId?: string | null;
}

export interface CreateStudentRequest {
    academicSessionId: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    enrollmentNo: string;
    departmentId: string;
    admissionSessionId: string;
    classId: string;
    sectionId: string;
    phone?: string;
    email?: string;
    password?: string;
    dateOfBirth?: string;
    admissionDate?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
}

export interface UpdateStudentRequest {
    enrollmentNo?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    admissionDate?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    departmentId?: string;
    admissionSessionId?: string;
    classId?: string;
    sectionId?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'ALUMNI' | 'SUSPENDED';
}

export interface Staff {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    designation: string;
    departmentId: string;
    joiningDate: string;
    status?: 'ACTIVE' | 'INACTIVE';
    department?: Department;
    userId?: string;
}

export interface CreateStaffRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    employeeId: string;
    dateOfBirth?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    departmentId: string;
    designation: string;
    joiningDate: string;
    roleId?: string;
}

export interface Parent {
    id: string;
    phone: string;
    relationship: string;
    students: Partial<Student>[];
}

export interface RegisterParentRequest {
    studentIds: string[];
    phone: string;
    relationship: 'FATHER' | 'MOTHER' | 'GUARDIAN';
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}
