/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/dv-lottery/index.tsx

import React from "react";
import { FormWizard } from "@/components/forms/FormWizard";
import { PersonalInfoStep } from "@/components/forms/steps/PersonalInfoStep";
import { BirthDetailsStep } from "@/components/forms/steps/BirthDetailsStep";
import type { FormStep } from "@/types/dv-lottery";
import {
  Profile2User,
  Location,
  Global,
  Camera,
  Home2,
  Call,
  People,
  Book1,
  Heart,
  ProfileAdd,
  Gallery,
  User,
  DocumentText1,
  TickCircle,
} from "iconsax-react";
import { EligibilityStep } from "@/components/forms/steps/EligibilityStep";
import { PhotoUploadStep } from "@/components/forms/steps/PhotoUploadStep";
import { AddressStep } from "@/components/forms/steps/AddressStep";
import { ContactInfoStep } from "@/components/forms/steps/ContactInfoStep";

// Enhanced step component placeholder with modern design
const PlaceholderStep: React.FC<any> = ({ data, stepInfo }) => (
  <div className="text-center py-12">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl mb-6">
      {stepInfo?.icon || (
        <DocumentText1 size={32} color="#6366F1" variant="Bold" />
      )}
    </div>
    <h3 className="text-2xl font-semibold text-gray-900 mb-3">
      {stepInfo?.title || "Coming Soon"}
    </h3>
    <p className="text-gray-600 mb-8 max-w-md mx-auto">
      {stepInfo?.description ||
        "This step will be implemented in the next iteration."}
    </p>

    {/* Preview data if available */}
    {data && Object.keys(data).length > 0 && (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-w-2xl mx-auto">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Current Application Data:
        </h4>
        <pre className="text-xs text-gray-600 text-left overflow-auto max-h-40">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    )}
  </div>
);

// Enhanced configuration of all form steps with modern icons and styling
const formSteps: FormStep[] = [
  {
    id: 1,
    title: "Personal Info",
    description: "Basic personal information and identity",
    isCompleted: false,
    isValid: false,
    component: PersonalInfoStep,
    icon: <Profile2User size={20} color="white" variant="Bold" />,
    category: "Identity",
    estimatedTime: 5,
    helpText:
      "Enter your personal details exactly as they appear on your passport",
  },
  {
    id: 2,
    title: "Birth Details",
    description: "City and country where you were born",
    isCompleted: false,
    isValid: false,
    component: BirthDetailsStep,
    icon: <Location size={20} color="white" variant="Bold" />,
    category: "Identity",
    estimatedTime: 3,
    helpText:
      "Enter the exact city and country where you were born as shown on your birth certificate",
  },
  {
    id: 3,
    title: "Eligibility",
    description: "Country of eligibility for DV program",
    isCompleted: false,
    isValid: false,
    component: EligibilityStep,
    icon: <Global size={20} color="white" variant="Bold" />,
    category: "Identity",
    estimatedTime: 2,
  },
  {
    id: 4,
    title: "Photo Upload",
    description: "Upload your official photo (600x600px)",
    isCompleted: false,
    isValid: false,
    component: PhotoUploadStep,
    icon: <Camera size={20} color="white" variant="Bold" />,
    category: "Documents",
    estimatedTime: 10,
  },
  {
    id: 5,
    title: "Address",
    description: "Your current mailing address",
    isCompleted: false,
    isValid: false,
    component: AddressStep,
    icon: <Home2 size={20} color="white" variant="Bold" />,
    category: "Contact",
    estimatedTime: 4,
  },
  {
    id: 6,
    title: "Contact Info",
    description: "Phone number and email address",
    isCompleted: false,
    isValid: false,
    component: ContactInfoStep,
    icon: <Call size={20} color="white" variant="Bold" />,
    category: "Contact",
    estimatedTime: 3,
  },
  {
    id: 7,
    title: "Current Residence",
    description: "Country where you currently live",
    isCompleted: false,
    isValid: false,
    component: (props: any) => (
      <PlaceholderStep
        {...props}
        stepInfo={{
          title: "Current Residence",
          description:
            "Specify the country where you currently reside, which may differ from your birth country.",
          icon: <Location size={32} color="white" variant="Bold" />,
        }}
      />
    ),
    icon: <Location size={20} color="white" variant="Bold" />,
    category: "Contact",
    estimatedTime: 2,
  },
  {
    id: 8,
    title: "Education Level",
    description: "Your highest level of education",
    isCompleted: false,
    isValid: false,
    component: (props: any) => (
      <PlaceholderStep
        {...props}
        stepInfo={{
          title: "Education Background",
          description:
            "Select your highest completed level of education. Minimum requirement is high school degree.",
          icon: <Book1 size={32} color="white" variant="Bold" />,
        }}
      />
    ),
    icon: <Book1 size={20} color="white" variant="Bold" />,
    category: "Qualifications",
    estimatedTime: 3,
  },
  {
    id: 9,
    title: "Marital Status",
    description: "Your current marital status",
    isCompleted: false,
    isValid: false,
    component: (props: any) => (
      <PlaceholderStep
        {...props}
        stepInfo={{
          title: "Marital Status",
          description:
            "Select your current marital status as of the application date.",
          icon: <Heart size={32} color="white" variant="Bold" />,
        }}
      />
    ),
    icon: <Heart size={20} color="white" variant="Bold" />,
    category: "Family",
    estimatedTime: 2,
  },
  {
    id: 10,
    title: "Spouse Info",
    description: "Information about your spouse (if married)",
    isCompleted: false,
    isValid: false,
    component: (props: any) => (
      <PlaceholderStep
        {...props}
        stepInfo={{
          title: "Spouse Information",
          description:
            "If married, provide complete information about your spouse including personal details.",
          icon: <ProfileAdd size={32} color="white" variant="Bold" />,
        }}
      />
    ),
    icon: <ProfileAdd size={20} color="white" variant="Bold" />,
    category: "Family",
    estimatedTime: 5,
  },
  {
    id: 11,
    title: "Spouse Photo",
    description: "Upload spouse photo (if applicable)",
    isCompleted: false,
    isValid: false,
    component: (props: any) => (
      <PlaceholderStep
        {...props}
        stepInfo={{
          title: "Spouse Photo",
          description:
            "Upload a photo of your spouse that meets the same requirements as your photo.",
          icon: <Gallery size={32} color="white" variant="Bold" />,
        }}
      />
    ),
    icon: <Gallery size={20} color="white" variant="Bold" />,
    category: "Family",
    estimatedTime: 8,
  },
  {
    id: 12,
    title: "Children Count",
    description: "Number of unmarried children under 21",
    isCompleted: false,
    isValid: false,
    component: (props: any) => (
      <PlaceholderStep
        {...props}
        stepInfo={{
          title: "Number of Children",
          description:
            "Enter the total number of your unmarried children under 21 years old.",
          icon: <People size={32} color="white" variant="Bold" />,
        }}
      />
    ),
    icon: <People size={20} color="white" variant="Bold" />,
    category: "Family",
    estimatedTime: 2,
  },
  {
    id: 13,
    title: "Children Details",
    description: "Information for each child",
    isCompleted: false,
    isValid: false,
    component: (props: any) => (
      <PlaceholderStep
        {...props}
        stepInfo={{
          title: "Children Information",
          description:
            "Provide detailed information and photos for each of your children under 21.",
          icon: <User size={32} color="white" variant="Bold" />,
        }}
      />
    ),
    icon: <User size={20} color="white" variant="Bold" />,
    category: "Family",
    estimatedTime: 15,
  },
  {
    id: 14,
    title: "Review & Submit",
    description: "Review all information and submit",
    isCompleted: false,
    isValid: false,
    component: (props: any) => (
      <PlaceholderStep
        {...props}
        stepInfo={{
          title: "Review & Submit",
          description:
            "Review all your information carefully before final submission to ensure accuracy.",
          icon: <TickCircle size={32} color="white" variant="Bold" />,
        }}
      />
    ),
    icon: <TickCircle size={20} color="white" variant="Bold" />,
    category: "Submission",
    estimatedTime: 10,
  },
];

export const DVLotteryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Enhanced Header with gradient and better typography */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <DocumentText1 size={24} color="white" variant="Bold" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  DV Lottery Application
                </h1>
                <p className="text-sm text-gray-600">
                  Complete your Diversity Visa application step by step
                </p>
              </div>
            </div>

            {/* Status indicator */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">DV-2026 Open</span>
              </div>
              <div className="text-sm text-gray-500">Deadline: Nov 5, 2024</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with enhanced container */}
      <div className="container mx-auto px-4 py-8">
        <FormWizard steps={formSteps} className="animate-fade-in" />
      </div>

      {/* Enhanced Footer with helpful information */}
      <div className="bg-white border-t border-gray-100 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Progress Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <DocumentText1 size={24} color="#2563EB" variant="Bold" />
                <h3 className="font-semibold text-blue-900">
                  Application Progress
                </h3>
              </div>
              <p className="text-blue-700 text-sm">
                Your application is automatically saved as you progress. You can
                return anytime to continue where you left off.
              </p>
            </div>

            {/* Important Reminders */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <TickCircle size={24} color="#D97706" variant="Bold" />
                <h3 className="font-semibold text-yellow-900">
                  Important Reminders
                </h3>
              </div>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Submit only one application per person</li>
                <li>• Use exact names as on passport</li>
                <li>• Photos must be exactly 600x600 pixels</li>
              </ul>
            </div>

            {/* Help & Support */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Call size={24} color="#7C3AED" variant="Bold" />
                <h3 className="font-semibold text-purple-900">Need Help?</h3>
              </div>
              <p className="text-purple-700 text-sm mb-3">
                Having trouble with your application? We're here to help you
                succeed.
              </p>
              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium underline">
                Contact Support →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
