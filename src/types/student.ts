import { Student as BaseStudent, Department, AcademicSession, ClassEntity, SectionEntity } from './index';







export interface StudentCore {
    
    enrollmentNo: string;
    rollNo?: string;     
    firstName: string;
    middleName?: string;
    lastName: string;

    
    academicSessionId: string; 
    departmentId: string;
    classId: string;
    sectionId: string;
    admissionDate: string; 
    joiningDate: string;   

    
    dob: string;           
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    email?: string;
    mobile: string;
    emergencyPhone?: string;

    
    fatherName?: string;
    fatherMobile?: string;
    motherName?: string;
    motherMobile?: string;

    
    currentAddress?: string;
    currentCity?: string;
    currentState?: string;
    currentCountry?: string;
    currentPincode?: string;

    
    photoUrl?: string;
    signatureUrl?: string;
}




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
    | string; 

export interface MasterDataItem {
    id: string;
    masterType: MasterDataType; 
    fieldName: string;          
    isVisible: boolean;         
    order?: number;             
    parentId?: string;
}


export interface StudentMasterFields {
    religionId?: string;
    bloodGroupId?: string;
    houseId?: string;
    categoryId?: string;
    [key: string]: string | undefined;
}




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
    fieldId?: string;    
    id?: string;         
    entityType: 'STUDENT' | 'STAFF';
    name: string;        
    displayName: string; 
    controlType: DynamicControlType;
    dataType: DynamicDataType;
    isRequired: boolean; 
    isVisible: boolean;  
    priority: number;    
    placeholder?: string;
    maxLength?: number;  

    
    masterType?: MasterDataType; 
    options?: string[]; 
}

export interface DynamicFieldValue {
    fieldId: string;
    value: string | number | boolean | null;
}







export interface CreateStudentPayload {
    
    academicSessionId: string;

    
    firstName: string;
    middleName?: string;
    lastName: string;
    enrollmentNo: string;
    rollNo?: string;

    
    departmentId: string;
    classId: string;
    sectionId: string;
    admissionSessionId?: string;

    
    phone?: string;       
    email?: string;
    emergencyPhone?: string;

    
    dateOfBirth?: string; 
    gender?: string;
    joiningDate?: string;
    admissionDate?: string; 

    
    photoUrl?: string;
    signatureUrl?: string;
    password?: string; 

    
    religionId?: string;
    bloodGroupId?: string;
    nationalityId?: string;
    categoryId?: string; 
    houseId?: string;

    
    fatherName?: string;
    fatherMobile?: string;
    motherName?: string;
    motherMobile?: string;

    
    presentAddress?: string;
    presentCity?: string;
    presentState?: string;
    presentCountry?: string;
    presentPincode?: string;

    
    dynamicFields?: { fieldId: string; value: any }[];
}


export interface StudentFull extends BaseStudent {
    core: StudentCore;
    masterData: Record<string, MasterDataItem>; 
    dynamicValues: Record<string, any>; 
}
