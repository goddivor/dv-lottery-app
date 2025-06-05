/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/dv-lottery/index.tsx

import React from 'react'
import { FormWizard } from '@/components/forms/FormWizard'
import { PersonalInfoStep } from '@/components/forms/steps/PersonalInfoStep'
import type { FormStep } from '@/types/dv-lottery'

// Step components (we'll create these next)
const PlaceholderStep: React.FC<any> = ({ data }) => (
  <div className="text-center py-8">
    <p className="text-gray-500">This step will be implemented next</p>
    <pre className="mt-4 text-xs bg-gray-100 p-4 rounded">
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
)

// Configuration of all form steps
const formSteps: FormStep[] = [
  {
    id: 1,
    title: 'Personal Info',
    description: 'Enter your basic personal information',
    isCompleted: false,
    isValid: false,
    component: PersonalInfoStep
  },
  {
    id: 2,
    title: 'Birth Details',
    description: 'City and country of birth',
    isCompleted: false,
    isValid: false,
    component: PlaceholderStep
  },
  {
    id: 3,
    title: 'Eligibility',
    description: 'Country of eligibility for DV program',
    isCompleted: false,
    isValid: false,
    component: PlaceholderStep
  },
  {
    id: 4,
    title: 'Photo Upload',
    description: 'Upload your official photo (600x600px)',
    isCompleted: false,
    isValid: false,
    component: PlaceholderStep
  },
  {
    id: 5,
    title: 'Address',
    description: 'Your current mailing address',
    isCompleted: false,
    isValid: false,
    component: PlaceholderStep
  },
  {
    id: 6,
    title: 'Contact Info',
    description: 'Phone number and email address',
    isCompleted: false,
    isValid: false,
    component: PlaceholderStep
  },
  {
    id: 7,
    title: 'Current Residence',
    description: 'Country where you currently live',
    isCompleted: false,
    isValid: false,
    component: PlaceholderStep
  },
  {
    id: 8,
    title: 'Education Level',
    description: 'Your highest level of education',
    isCompleted: false,
    isValid: false,
    component: PlaceholderStep
  },
  {
    id: 9,
    title: 'Marital Status',
    description: 'Your current marital status',
    isCompleted: false,
    isValid: false,
    component: PlaceholderStep
  },
  {
    id: 10,
    title: 'Spouse Info',
    description: 'Information about your spouse (if married)',
    isCompleted: false,
    isValid: false,
    component: PlaceholderStep
  },
  {
    id: 11,
    title: 'Spouse Photo',
    description: 'Upload spouse photo (if applicable)',
    isCompleted: false,
    isValid: false,
    component: PlaceholderStep
  },
  {
    id: 12,
    title: 'Children Count',
    description: 'Number of unmarried children under 21',
    isCompleted: false,
    isValid: false,
    component: PlaceholderStep
  },
  {
    id: 13,
    title: 'Children Details',
    description: 'Information for each child',
    isCompleted: false,
    isValid: false,
    component: PlaceholderStep
  },
  {
    id: 14,
    title: 'Review & Submit',
    description: 'Review all information and submit',
    isCompleted: false,
    isValid: false,
    component: PlaceholderStep
  }
]

export const DVLotteryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <FormWizard 
          steps={formSteps}
          className="animate-fade-in"
        />
      </div>
    </div>
  )
}