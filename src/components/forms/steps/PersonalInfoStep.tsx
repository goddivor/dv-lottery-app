/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/forms/steps/PersonalInfoStep.tsx

import React from 'react'
import { type FormStepProps, Gender } from '@/types/dv-lottery'
import { useDVLotteryStore } from '@/hooks/useDVLotteryStore'
import { Input } from '@/components/forms/Input'
import { CustomSelect } from '@/components/forms/custom-select'

// Options for select components
const genderOptions = [
  { value: Gender.MALE, label: 'Male' },
  { value: Gender.FEMALE, label: 'Female' }
]

export const PersonalInfoStep: React.FC<FormStepProps> = ({ data }) => {
  const { updatePersonalInfo, setValidationErrors, clearValidationErrors } = useDVLotteryStore()
  
  const personalInfo = data.personalInfo

  const handleInputChange = (field: keyof typeof personalInfo) => (
    value: string | Gender
  ) => {
    updatePersonalInfo({ [field]: value })
    // Clear validation errors when user starts typing
    clearValidationErrors(`personalInfo.${field}`)
  }

  const validateField = (field: string, value: any, label: string) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      setValidationErrors(`personalInfo.${field}`, [{
        field,
        message: `${label} is required`,
        type: 'required'
      }])
      return false
    }
    clearValidationErrors(`personalInfo.${field}`)
    return true
  }

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">📋 Personal Information</h3>
        <p className="text-sm text-blue-700">
          Enter your personal information exactly as it appears on your passport or official documents.
          All fields marked with * are required.
        </p>
      </div>

      {/* Name fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Last/Family Name *"
          placeholder="Enter your last name"
          value={personalInfo.lastName || ''}
          onChange={(e) => handleInputChange('lastName')(e.target.value)}
          onBlur={(e) => validateField('lastName', e.target.value, 'Last name')}
          className="font-medium"
        />

        <Input
          label="First Name *"
          placeholder="Enter your first name"
          value={personalInfo.firstName || ''}
          onChange={(e) => handleInputChange('firstName')(e.target.value)}
          onBlur={(e) => validateField('firstName', e.target.value, 'First name')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Middle Name"
          placeholder="Enter your middle name (optional)"
          value={personalInfo.middleName || ''}
          onChange={(e) => handleInputChange('middleName')(e.target.value)}
        />

        <CustomSelect
          label="Gender *"
          placeholder="Select your gender"
          options={genderOptions}
          value={personalInfo.gender || null}
          onChange={(value) => handleInputChange('gender')(value as Gender)}
        />
      </div>

      {/* Date of birth */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            label="Date of Birth *"
            type="date"
            value={personalInfo.dateOfBirth || ''}
            onChange={(e) => handleInputChange('dateOfBirth')(e.target.value)}
            onBlur={(e) => validateField('dateOfBirth', e.target.value, 'Date of birth')}
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: MM/DD/YYYY
          </p>
        </div>
      </div>

      {/* Birth place */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="City of Birth *"
          placeholder="Enter your birth city"
          value={personalInfo.cityOfBirth || ''}
          onChange={(e) => handleInputChange('cityOfBirth')(e.target.value)}
          onBlur={(e) => validateField('cityOfBirth', e.target.value, 'City of birth')}
        />

        <Input
          label="Country of Birth *"
          placeholder="Enter your birth country"
          value={personalInfo.countryOfBirth || ''}
          onChange={(e) => handleInputChange('countryOfBirth')(e.target.value)}
          onBlur={(e) => validateField('countryOfBirth', e.target.value, 'Country of birth')}
        />
      </div>

      {/* Eligibility country */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Country of Eligibility *"
          placeholder="Usually same as birth country"
          value={personalInfo.eligibilityCountry || ''}
          onChange={(e) => handleInputChange('eligibilityCountry')(e.target.value)}
          onBlur={(e) => validateField('eligibilityCountry', e.target.value, 'Country of eligibility')}
        />
      </div>

      {/* Info box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">💡 Important Notes</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Enter all information in English only</li>
          <li>• Use the same spelling as on your passport</li>
          <li>• Country of eligibility can be different from birth country if your birth country is not eligible</li>
          <li>• You can use your spouse's or parents' country if eligible</li>
        </ul>
      </div>
    </div>
  )
}