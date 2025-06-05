/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/validation.ts

import { z } from "zod";
import { Gender, EducationLevel, MaritalStatus } from "@/types/dv-lottery";

// Helper function to validate date is not in future and person is at least 18
const validateAge = (dateString: string) => {
  const birthDate = new Date(dateString);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    return age - 1;
  }
  return age;
};

// Personal Information Schema
export const personalInfoSchema = z.object({
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Last name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "First name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  middleName: z
    .string()
    .max(50, "Middle name cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z\s'-]*$/,
      "Middle name can only contain letters, spaces, hyphens, and apostrophes"
    )
    .optional(),

  gender: z.nativeEnum(Gender, {
    errorMap: () => ({ message: "Please select a gender" }),
  }),

  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, "Please enter a valid date")
    .refine((date) => {
      const age = validateAge(date);
      return age >= 18;
    }, "You must be at least 18 years old to apply")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate <= today;
    }, "Date of birth cannot be in the future"),

  cityOfBirth: z
    .string()
    .min(1, "City of birth is required")
    .min(2, "City of birth must be at least 2 characters")
    .max(100, "City of birth cannot exceed 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "City name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  countryOfBirth: z
    .string()
    .min(1, "Country of birth is required")
    .min(2, "Country of birth must be at least 2 characters")
    .max(100, "Country of birth cannot exceed 100 characters"),

  eligibilityCountry: z
    .string()
    .min(1, "Country of eligibility is required")
    .min(2, "Country of eligibility must be at least 2 characters")
    .max(100, "Country of eligibility cannot exceed 100 characters"),
});

// Address Information Schema
export const addressInfoSchema = z.object({
  inCareOf: z
    .string()
    .max(100, "In Care Of cannot exceed 100 characters")
    .optional(),

  addressLine1: z
    .string()
    .min(1, "Address Line 1 is required")
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address Line 1 cannot exceed 200 characters"),

  addressLine2: z
    .string()
    .max(200, "Address Line 2 cannot exceed 200 characters")
    .optional(),

  city: z
    .string()
    .min(1, "City is required")
    .min(2, "City must be at least 2 characters")
    .max(100, "City cannot exceed 100 characters"),

  stateProvince: z
    .string()
    .min(1, "State/Province is required")
    .min(2, "State/Province must be at least 2 characters")
    .max(100, "State/Province cannot exceed 100 characters"),

  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .min(3, "Postal code must be at least 3 characters")
    .max(20, "Postal code cannot exceed 20 characters")
    .regex(/^[a-zA-Z0-9\s-]+$/, "Invalid postal code format"),

  country: z.string().min(1, "Country is required"),

  currentResidenceCountry: z
    .string()
    .min(1, "Current residence country is required"),

  phoneNumber: z
    .string()
    .regex(/^[\+]?[\d\s\-\(\)]+$/, "Invalid phone number format")
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number cannot exceed 20 characters")
    .optional(),

  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address")
    .max(100, "Email cannot exceed 100 characters"),
});

// Education Information Schema
export const educationInfoSchema = z.object({
  highestEducationLevel: z.nativeEnum(EducationLevel, {
    errorMap: () => ({ message: "Please select your highest education level" }),
  }),
});

// Spouse Information Schema
export const spouseInfoSchema = z.object({
  lastName: z
    .string()
    .min(1, "Spouse last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Last name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  firstName: z
    .string()
    .min(1, "Spouse first name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "First name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  middleName: z
    .string()
    .max(50, "Middle name cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z\s'-]*$/,
      "Middle name can only contain letters, spaces, hyphens, and apostrophes"
    )
    .optional(),

  gender: z.nativeEnum(Gender),

  dateOfBirth: z
    .string()
    .min(1, "Spouse date of birth is required")
    .refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, "Please enter a valid date")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate <= today;
    }, "Date of birth cannot be in the future"),

  cityOfBirth: z
    .string()
    .min(1, "Spouse city of birth is required")
    .min(2, "City of birth must be at least 2 characters")
    .max(100, "City of birth cannot exceed 100 characters"),

  countryOfBirth: z.string().min(1, "Spouse country of birth is required"),
});

// Child Information Schema
export const childInfoSchema = z.object({
  lastName: z
    .string()
    .min(1, "Child last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Last name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  firstName: z
    .string()
    .min(1, "Child first name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "First name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  middleName: z
    .string()
    .max(50, "Middle name cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z\s'-]*$/,
      "Middle name can only contain letters, spaces, hyphens, and apostrophes"
    )
    .optional(),

  gender: z.nativeEnum(Gender),

  dateOfBirth: z
    .string()
    .min(1, "Child date of birth is required")
    .refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, "Please enter a valid date")
    .refine((date) => {
      const age = validateAge(date);
      return age < 21;
    }, "Child must be under 21 years old")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate <= today;
    }, "Date of birth cannot be in the future"),

  cityOfBirth: z
    .string()
    .min(1, "Child city of birth is required")
    .min(2, "City of birth must be at least 2 characters")
    .max(100, "City of birth cannot exceed 100 characters"),

  countryOfBirth: z.string().min(1, "Child country of birth is required"),
});

// Family Information Schema
export const familyInfoSchema = z
  .object({
    maritalStatus: z.nativeEnum(MaritalStatus, {
      errorMap: () => ({ message: "Please select your marital status" }),
    }),

    spouse: z.object(spouseInfoSchema.shape).optional(),

    numberOfChildren: z
      .number()
      .min(0, "Number of children cannot be negative")
      .max(20, "Maximum 20 children allowed"),

    children: z.array(
      z.object({
        id: z.string(),
        ...childInfoSchema.shape,
      })
    ),
  })
  .refine(
    (data) => {
      // If married (except to US citizen/Green Card holder), spouse info is required
      const requiresSpouse = [
        MaritalStatus.MARRIED_NOT_US,
        MaritalStatus.MARRIED_US,
      ].includes(data.maritalStatus);

      return !requiresSpouse || data.spouse;
    },
    {
      message: "Spouse information is required for married applicants",
      path: ["spouse"],
    }
  )
  .refine(
    (data) => {
      // Number of children should match children array length
      return data.numberOfChildren === data.children.length;
    },
    {
      message: "Number of children does not match the children list",
      path: ["numberOfChildren"],
    }
  );

// Complete Application Schema
export const dvLotteryApplicationSchema = z.object({
  personalInfo: personalInfoSchema,
  addressInfo: addressInfoSchema,
  educationInfo: educationInfoSchema,
  familyInfo: familyInfoSchema,
});

// Validation utility functions
export const validateStep = async (stepNumber: number, data: any) => {
  switch (stepNumber) {
    case 1:
      return personalInfoSchema.safeParse(data.personalInfo);
    case 2:
      return addressInfoSchema.safeParse(data.addressInfo);
    case 3:
      return educationInfoSchema.safeParse(data.educationInfo);
    case 4:
      return familyInfoSchema.safeParse(data.familyInfo);
    default:
      return { success: true, data: null };
  }
};

// Photo validation function
export const validatePhoto = (
  file: File
): Promise<{ isValid: boolean; errors: string[] }> => {
  return new Promise((resolve) => {
    const errors: string[] = [];

    // Check file type
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      errors.push("Photo must be in JPEG or PNG format");
    }

    // Check file size (240KB max)
    if (file.size > 240 * 1024) {
      errors.push("Photo must be smaller than 240KB");
    }

    // Check dimensions
    const img = new Image();
    img.onload = () => {
      if (img.width !== 600 || img.height !== 600) {
        errors.push("Photo must be exactly 600x600 pixels");
      }

      resolve({
        isValid: errors.length === 0,
        errors,
      });
    };

    img.onerror = () => {
      errors.push("Invalid image file");
      resolve({
        isValid: false,
        errors,
      });
    };

    img.src = URL.createObjectURL(file);
  });
};
