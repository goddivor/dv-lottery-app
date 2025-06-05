/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useDVLotteryStore.ts

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  type DVLotteryApplication,
  ApplicationStatus,
  type PersonalInformation,
  type AddressInformation,
  type EducationInformation,
  type FamilyInformation,
  type PhotoDocument,
  type ValidationError,
} from "@/types/dv-lottery";

interface DVLotteryStore {
  // Application state
  application: DVLotteryApplication;
  validationErrors: Record<string, ValidationError[]>;
  isLoading: boolean;

  // Form navigation
  currentStep: number;
  totalSteps: number;

  // Actions for personal information
  updatePersonalInfo: (info: Partial<PersonalInformation>) => void;
  updateAddressInfo: (info: Partial<AddressInformation>) => void;
  updateEducationInfo: (info: Partial<EducationInformation>) => void;
  updateFamilyInfo: (info: Partial<FamilyInformation>) => void;
  updateApplicantPhoto: (photo: PhotoDocument | undefined) => void;

  // Navigation actions
  goToStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  canGoToStep: (step: number) => boolean;

  // Validation actions
  setValidationErrors: (field: string, errors: ValidationError[]) => void;
  clearValidationErrors: (field: string) => void;
  validateCurrentStep: () => Promise<boolean>;

  // Application lifecycle
  saveApplication: () => void;
  loadApplication: () => void;
  resetApplication: () => void;
  submitApplication: () => Promise<boolean>;

  // Utility actions
  updateApplicationStatus: (status: ApplicationStatus) => void;
  setLoading: (loading: boolean) => void;
}

// Default application state
const createDefaultApplication = (): DVLotteryApplication => ({
  id: `dv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  personalInfo: {},
  addressInfo: {},
  educationInfo: {},
  familyInfo: {
    numberOfChildren: 0,
    children: [],
  },
  applicantPhoto: undefined,
  status: ApplicationStatus.DRAFT,
  currentStep: 1,
  lastSaved: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const useDVLotteryStore = create<DVLotteryStore>()(
  persist(
    (set, get) => ({
      // Initial state
      application: createDefaultApplication(),
      validationErrors: {},
      isLoading: false,
      currentStep: 1,
      totalSteps: 14,

      // Personal information actions
      updatePersonalInfo: (info) => {
        set((state) => ({
          application: {
            ...state.application,
            personalInfo: { ...state.application.personalInfo, ...info },
            updatedAt: new Date(),
            lastSaved: new Date(),
          },
        }));
      },

      updateAddressInfo: (info) => {
        set((state) => ({
          application: {
            ...state.application,
            addressInfo: { ...state.application.addressInfo, ...info },
            updatedAt: new Date(),
            lastSaved: new Date(),
          },
        }));
      },

      updateEducationInfo: (info) => {
        set((state) => ({
          application: {
            ...state.application,
            educationInfo: { ...state.application.educationInfo, ...info },
            updatedAt: new Date(),
            lastSaved: new Date(),
          },
        }));
      },

      updateFamilyInfo: (info) => {
        set((state) => ({
          application: {
            ...state.application,
            familyInfo: { ...state.application.familyInfo, ...info },
            updatedAt: new Date(),
            lastSaved: new Date(),
          },
        }));
      },

      updateApplicantPhoto: (photo) => {
        set((state) => ({
          application: {
            ...state.application,
            applicantPhoto: photo,
            updatedAt: new Date(),
            lastSaved: new Date(),
          },
        }));
      },

      // Navigation actions
      goToStep: (step) => {
        const { canGoToStep } = get();
        if (canGoToStep(step)) {
          set((state) => ({
            currentStep: step,
            application: {
              ...state.application,
              currentStep: step,
              updatedAt: new Date(),
            },
          }));
        }
      },

      nextStep: () => {
        const { currentStep, totalSteps } = get();
        if (currentStep < totalSteps) {
          set((state) => ({
            currentStep: currentStep + 1,
            application: {
              ...state.application,
              currentStep: currentStep + 1,
              updatedAt: new Date(),
            },
          }));
        }
      },

      previousStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set((state) => ({
            currentStep: currentStep - 1,
            application: {
              ...state.application,
              currentStep: currentStep - 1,
              updatedAt: new Date(),
            },
          }));
        }
      },

      canGoToStep: (step) => {
        const { application, currentStep } = get();

        // Can always go backwards
        if (step <= currentStep) return true;

        // Can only go forward if current step is valid
        // This is a simplified check - you'll implement proper validation
        if (step === currentStep + 1) {
          // Basic validation example
          switch (currentStep) {
            case 1: // Personal info validation
              return !!(
                application.personalInfo.lastName &&
                application.personalInfo.firstName &&
                application.personalInfo.gender &&
                application.personalInfo.dateOfBirth
              );
            case 2:
              return !!(
                application.personalInfo.cityOfBirth &&
                application.personalInfo.countryOfBirth
              );
            // Add more validation rules as needed
            default:
              return true;
          }
        }

        return false;
      },

      // Validation actions
      setValidationErrors: (field, errors) => {
        set((state) => ({
          validationErrors: {
            ...state.validationErrors,
            [field]: errors,
          },
        }));
      },

      clearValidationErrors: (field) => {
        set((state) => {
          const newErrors = { ...state.validationErrors };
          delete newErrors[field];
          return { validationErrors: newErrors };
        });
      },

      validateCurrentStep: async () => {
        const {
          currentStep,
          application,
          setValidationErrors,
          clearValidationErrors,
        } = get();

        try {
          // Import validation function dynamically to avoid circular deps
          const { validateStep } = await import("@/lib/validation");
          const result = await validateStep(currentStep, application);

          if (result.success) {
            // Clear all validation errors for current step
            Object.keys(get().validationErrors).forEach((key) => {
              if (key.startsWith(`step${currentStep}`)) {
                clearValidationErrors(key);
              }
            });
            return true;
          } else if ("issues" in result) {
            // Set validation errors
            const issues = result.issues as Array<{
              path: any[];
              message: any;
              code: any;
            }>;
            issues.forEach((issue) => {
              const fieldPath = `step${currentStep}.${issue.path.join(".")}`;
              setValidationErrors(fieldPath, [
                {
                  field: issue.path.join("."),
                  message: issue.message,
                  type: issue.code as any,
                },
              ]);
            });
            return false;
          } else {
            return false;
          }
        } catch (error) {
          console.error("Validation error:", error);
          return false;
        }
      },

      // Application lifecycle
      saveApplication: () => {
        const { application } = get();
        // Auto-save is handled by zustand persist
        console.log("Application auto-saved:", application.id);
      },

      loadApplication: () => {
        // This is handled automatically by zustand persist
        console.log("Application loaded from storage");
      },

      resetApplication: () => {
        set(() => ({
          application: createDefaultApplication(),
          validationErrors: {},
          currentStep: 1,
          isLoading: false,
        }));
      },

      submitApplication: async () => {
        const { application, setLoading, updateApplicationStatus } = get();

        try {
          setLoading(true);
          console.log("Submitting application:", application.id);
          updateApplicationStatus(ApplicationStatus.READY_TO_SUBMIT);

          // Here you would submit to the actual DV Lottery system
          // For now, we'll simulate the submission
          await new Promise((resolve) => setTimeout(resolve, 2000));

          updateApplicationStatus(ApplicationStatus.SUBMITTED);
          return true;
        } catch (error) {
          updateApplicationStatus(ApplicationStatus.ERROR);
          console.error("Submission failed:", error);
          return false;
        } finally {
          setLoading(false);
        }
      },

      // Utility actions
      updateApplicationStatus: (status) => {
        set((state) => ({
          application: {
            ...state.application,
            status,
            updatedAt: new Date(),
          },
        }));
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "dv-lottery-application",
      storage: createJSONStorage(() => localStorage),
      // Only persist the application data, not the UI state
      partialize: (state) => ({
        application: state.application,
        currentStep: state.currentStep,
      }),
    }
  )
);
