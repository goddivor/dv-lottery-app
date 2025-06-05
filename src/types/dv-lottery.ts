// src/types/dv-lottery.ts

// Enums for better type safety and consistency
export type Gender = "Male" | "Female";

export const Gender = {
  MALE: "Male" as Gender,
  FEMALE: "Female" as Gender,
};

export type EducationLevel =
  | "Primary school only"
  | "High school, no degree"
  | "High school degree"
  | "Vocational school"
  | "Some university courses"
  | "University degree"
  | "Some graduate level courses"
  | "Master's degree"
  | "Some doctoral level courses"
  | "Doctorate degree";

export const EducationLevel = {
  PRIMARY_SCHOOL: "Primary school only" as EducationLevel,
  HIGH_SCHOOL_NO_DEGREE: "High school, no degree" as EducationLevel,
  HIGH_SCHOOL_DEGREE: "High school degree" as EducationLevel,
  VOCATIONAL_SCHOOL: "Vocational school" as EducationLevel,
  SOME_UNIVERSITY: "Some university courses" as EducationLevel,
  UNIVERSITY_DEGREE: "University degree" as EducationLevel,
  SOME_GRADUATE: "Some graduate level courses" as EducationLevel,
  MASTERS_DEGREE: "Master's degree" as EducationLevel,
  SOME_DOCTORAL: "Some doctoral level courses" as EducationLevel,
  DOCTORATE_DEGREE: "Doctorate degree" as EducationLevel,
};

export type MaritalStatus =
  | "Unmarried"
  | "Married and spouse is NOT a U.S. citizen or Green Card holder"
  | "Married and spouse IS a U.S. citizen or Green Card holder"
  | "Divorced"
  | "Widowed"
  | "Legally separated";

export const MaritalStatus = {
  UNMARRIED: "Unmarried" as MaritalStatus,
  MARRIED_NOT_US:
    "Married and spouse is NOT a U.S. citizen or Green Card holder" as MaritalStatus,
  MARRIED_US:
    "Married and spouse IS a U.S. citizen or Green Card holder" as MaritalStatus,
  DIVORCED: "Divorced" as MaritalStatus,
  WIDOWED: "Widowed" as MaritalStatus,
  LEGALLY_SEPARATED: "Legally separated" as MaritalStatus,
};

export type ApplicationStatus =
  | "draft"
  | "in_progress"
  | "ready_to_submit"
  | "submitted"
  | "error";

export const ApplicationStatus = {
  DRAFT: "draft" as ApplicationStatus,
  IN_PROGRESS: "in_progress" as ApplicationStatus,
  READY_TO_SUBMIT: "ready_to_submit" as ApplicationStatus,
  SUBMITTED: "submitted" as ApplicationStatus,
  ERROR: "error" as ApplicationStatus,
};

// Core domain interfaces
export interface PersonalInformation {
  lastName: string;
  firstName: string;
  middleName?: string;
  gender: Gender;
  dateOfBirth: string; // Format: YYYY-MM-DD
  cityOfBirth: string;
  countryOfBirth: string;
  eligibilityCountry: string;
}

export interface AddressInformation {
  inCareOf?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  currentResidenceCountry: string;
  phoneNumber?: string;
  email: string;
}

export interface EducationInformation {
  highestEducationLevel: EducationLevel;
}

export interface SpouseInformation {
  lastName: string;
  firstName: string;
  middleName?: string;
  gender: Gender;
  dateOfBirth: string;
  cityOfBirth: string;
  countryOfBirth: string;
  photo?: PhotoDocument;
}

export interface ChildInformation {
  id: string; // Generated unique ID
  lastName: string;
  firstName: string;
  middleName?: string;
  gender: Gender;
  dateOfBirth: string;
  cityOfBirth: string;
  countryOfBirth: string;
  photo?: PhotoDocument;
}

export interface FamilyInformation {
  maritalStatus: MaritalStatus;
  spouse?: SpouseInformation;
  numberOfChildren: number;
  children: ChildInformation[];
}

export interface PhotoDocument {
  file: File;
  preview: string; // Base64 or Object URL for preview
  isValid: boolean;
  validationErrors: string[];
}

// Main application interface
export interface DVLotteryApplication {
  id: string;
  personalInfo: Partial<PersonalInformation>;
  addressInfo: Partial<AddressInformation>;
  educationInfo: Partial<EducationInformation>;
  familyInfo: Partial<FamilyInformation>;
  applicantPhoto?: PhotoDocument;
  status: ApplicationStatus;
  currentStep: number;
  lastSaved: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Form step configuration
export interface FormStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isValid: boolean;
  component: React.ComponentType<FormStepProps>;
  icon?: React.ReactNode; // Add icon property for modern UI
  category?: string; // Add category for grouping steps
  estimatedTime?: number; // Optional: estimated completion time in minutes
  helpText?: string; // Optional: additional help text
}

export interface FormStepProps {
  data: DVLotteryApplication;
  onDataChange: (updates: Partial<DVLotteryApplication>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
}

// Validation interfaces
export interface ValidationError {
  field: string;
  message: string;
  type: "required" | "format" | "custom";
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Photo validation specific types
export interface PhotoValidationRequirements {
  width: number;
  height: number;
  maxSizeBytes: number;
  allowedFormats: string[];
  backgroundColor: "white" | "light";
}

export const PHOTO_REQUIREMENTS: PhotoValidationRequirements = {
  width: 600,
  height: 600,
  maxSizeBytes: 240 * 1024, // 240KB
  allowedFormats: ["image/jpeg", "image/png"],
  backgroundColor: "light",
};

// Country data interface
export interface Country {
  code: string;
  name: string;
  isEligible: boolean;
}

// Form wizard state
export interface FormWizardState {
  steps: FormStep[];
  currentStepIndex: number;
  canNavigateToStep: (stepIndex: number) => boolean;
  isStepAccessible: (stepIndex: number) => boolean;
  completionPercentage: number; // Add overall completion tracking
  estimatedTimeRemaining: number; // Add time estimation
}

export const StepCategory = {
  IDENTITY: "Identity" as const,
  CONTACT: "Contact" as const,
  FAMILY: "Family" as const,
  DOCUMENTS: "Documents" as const,
  QUALIFICATIONS: "Qualifications" as const,
  SUBMISSION: "Submission" as const,
} as const;

export type StepCategoryType = (typeof StepCategory)[keyof typeof StepCategory];
