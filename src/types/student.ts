import { Student as BaseStudent, Department, AcademicSession, ClassEntity, SectionEntity } from './index';

// ==========================================
// 1. FIXED CORE FIELDS
// ==========================================
// ==========================================
// 1. FIXED CORE FIELDS
// ==========================================
export interface StudentCore {
    // Identity
    enrollmentNo: string;
    rollNo?: string;     // Added
    firstName: string;
    middleName?: string;
    lastName: string;

    // Academic Context
    academicSessionId: string; // Locked from context
    departmentId: string;
    classId: string;
    sectionId: string;
    admissionDate: string; // ISO Date
    joiningDate: string;   // ISO Date

    // Personal
    dob: string;           // ISO Date
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    email?: string;
    mobile: string;
    emergencyPhone?: string;

    // Parent / Guardian
    fatherName?: string;
    fatherMobile?: string;
    motherName?: string;
    motherMobile?: string;

    // Present Address
    currentAddress?: string;
    currentCity?: string;
    currentState?: string;
    currentCountry?: string;
    currentPincode?: string;

    // Media
    photoUrl?: string;
    signatureUrl?: string;
}

// ==========================================
// 2. MASTER DATA
// ==========================================
export type MasterDataType =
    | 'RELIGION'
    | 'BLOOD_GROUP'
    | 'HOUSE'
    | 'QUALIFICATION'
    | 'OCCUPATION'
    | 'CAST_CATEGORY'
    | 'VILLAGE'
    | 'CITY'
    | 'STATE'
    | 'CITY'
    | 'STATE'
    | 'COUNTRY'
    | 'NATIONALITY'
    | string; // Allow extensibility

export interface MasterDataItem {
    id: string;
    masterType: MasterDataType; // Renamed from type
    fieldName: string;          // Renamed from label/value
    isVisible: boolean;         // Renamed from isActive
    order?: number;             // Optional, not in specific spec but good to keep if backend supports
    parentId?: string;
}

// Map of Master Type -> Selected ID
export interface StudentMasterFields {
    religionId?: string;
    bloodGroupId?: string;
    houseId?: string;
    categoryId?: string;
    [key: string]: string | undefined;
}

// ==========================================
// 3. DYNAMIC FIELDS
// ==========================================
export type DynamicControlType =
    | 'TEXT'
    | 'NUMBER'
    | 'DATE'
    | 'DROPDOWN'
    | 'TEXTAREA'
    | 'CHECKBOX'
    | 'RADIO';

export type DynamicDataType =
    | 'STRING'
    | 'INTEGER'
    | 'DECIMAL'
    | 'BOOLEAN'
    | 'DATE';

export interface DynamicFieldConfig {
    fieldId?: string;    // API returns fieldId. Optional for creation.
    id?: string;         // Alias for frontend compatibility if needed
    entityType: 'STUDENT' | 'STAFF';
    name: string;        // Database key (e.g., "father_name")
    displayName: string; // Renamed from label UI Label
    controlType: DynamicControlType;
    dataType: DynamicDataType;
    isRequired: boolean; // Renamed from required
    isVisible: boolean;  // Renamed from isActive
    priority: number;    // Renamed from order
    placeholder?: string;
    maxLength?: number;  // NEW

    // For Dropdowns
    masterType?: MasterDataType; // Link to Master Data
    options?: string[]; // Hardcoded options (fallback)
}

export interface DynamicFieldValue {
    fieldId: string;
    value: string | number | boolean | null;
}

// ==========================================
// AGGREGATE PAYLOADS
// ==========================================

// What the UI sends to POST /api/students
// What the UI sends to POST /api/students
export interface CreateStudentPayload {
    // Context
    academicSessionId: string;

    // Identity
    firstName: string;
    middleName?: string;
    lastName: string;
    enrollmentNo: string;
    rollNo?: string;

    // Hierarchy
    departmentId: string;
    classId: string;
    sectionId: string;
    admissionSessionId?: string;

    // Contact
    phone?: string;       // Replaces mobile in payload
    email?: string;
    emergencyPhone?: string;

    // Personal
    dateOfBirth?: string; // Replaces dob in payload
    gender?: string;
    joiningDate?: string;
    admissionDate?: string; // Kept as it is often needed

    // Images
    photoUrl?: string;
    signatureUrl?: string;
    password?: string; // Optional for login creation

    // Master Data FKs (Flat)
    religionId?: string;
    bloodGroupId?: string;
    nationalityId?: string;
    categoryId?: string; // Replaces 'CAST_CATEGORY' map
    houseId?: string;

    // Parent
    fatherName?: string;
    fatherMobile?: string;
    motherName?: string;
    motherMobile?: string;

    // Address
    presentAddress?: string;
    presentCity?: string;
    presentState?: string;
    presentCountry?: string;
    presentPincode?: string;

    // Dynamic
    dynamicFields?: { fieldId: string; value: any }[];
}

// Full Student Object (Response)
export interface StudentFull extends BaseStudent {
    core: StudentCore;
    masterData: Record<string, MasterDataItem>; // Keyed by type
    dynamicValues: Record<string, any>; // Keyed by field name
}
