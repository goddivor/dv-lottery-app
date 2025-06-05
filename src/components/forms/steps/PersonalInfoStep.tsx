/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/forms/steps/PersonalInfoStep.tsx

import React from 'react'
import { type FormStepProps, Gender } from '@/types/dv-lottery'
import { useDVLotteryStore } from '@/hooks/useDVLotteryStore'
import { Input } from '@/components/forms/Input'
import { CustomSelect } from '@/components/forms/custom-select'
import { 
  Profile2User, 
  DocumentText1, 
  Calendar, 
  Global,
  InfoCircle,
  TickCircle,
  Warning2 
} from 'iconsax-react'

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

  // Calculate completion percentage for this step
  const requiredFields = ['lastName', 'firstName', 'gender', 'dateOfBirth', 'cityOfBirth', 'countryOfBirth', 'eligibilityCountry']
  const completedFields = requiredFields.filter(field => personalInfo[field as keyof typeof personalInfo])
  const completionPercentage = Math.round((completedFields.length / requiredFields.length) * 100)

  return (
    <div className="space-y-8">
      {/* Progress indicator for this step */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Profile2User size={24} color="white" variant="Bold" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
              <p className="text-gray-600">Enter your basic personal details exactly as they appear on your passport</p>
            </div>
          </div>
          
          {/* Completion indicator */}
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{completionPercentage}%</div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-white rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Important instructions */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-lg flex-shrink-0">
            <InfoCircle size={20} color="#D97706" variant="Bold" />
          </div>
          <div>
            <h4 className="font-semibold text-amber-900 mb-2">Important Instructions</h4>
            <ul className="text-amber-800 text-sm space-y-2">
              <li className="flex items-start space-x-2">
                <TickCircle size={16} color="#D97706" variant="Bold" className="mt-0.5 flex-shrink-0" />
                <span>Enter all information in <strong>English only</strong></span>
              </li>
              <li className="flex items-start space-x-2">
                <TickCircle size={16} color="#D97706" variant="Bold" className="mt-0.5 flex-shrink-0" />
                <span>Use the <strong>exact spelling</strong> as shown on your passport or official documents</span>
              </li>
              <li className="flex items-start space-x-2">
                <TickCircle size={16} color="#D97706" variant="Bold" className="mt-0.5 flex-shrink-0" />
                <span>Double-check all information before proceeding to the next step</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form sections */}
      <div className="space-y-8">
        {/* Basic Identity Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
              <DocumentText1 size={20} color="#3B82F6" variant="Bold" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Basic Identity</h3>
              <p className="text-sm text-gray-600">Your full legal name and gender</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Last/Family Name *"
              placeholder="Enter your family name"
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
        </div>

        {/* Birth Information Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg">
              <Calendar size={20} color="#16A34A" variant="Bold" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Birth Information</h3>
              <p className="text-sm text-gray-600">When and where you were born</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Date of Birth *"
                type="date"
                value={personalInfo.dateOfBirth || ''}
                onChange={(e) => handleInputChange('dateOfBirth')(e.target.value)}
                onBlur={(e) => validateField('dateOfBirth', e.target.value, 'Date of birth')}
              />
              <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                <InfoCircle size={12} color="#6B7280" variant="Outline" />
                <span>You must be at least 18 years old</span>
              </p>
            </div>

            <div></div> {/* Empty cell for spacing */}

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
        </div>

        {/* Eligibility Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-50 rounded-lg">
              <Global size={20} color="#7C3AED" variant="Bold" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">DV Lottery Eligibility</h3>
              <p className="text-sm text-gray-600">Country that makes you eligible for the program</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Country of Eligibility *"
              placeholder="Usually same as birth country"
              value={personalInfo.eligibilityCountry || ''}
              onChange={(e) => handleInputChange('eligibilityCountry')(e.target.value)}
              onBlur={(e) => validateField('eligibilityCountry', e.target.value, 'Country of eligibility')}
            />
          </div>

          {/* Eligibility explanation */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <InfoCircle size={20} color="#3B82F6" variant="Bold" className="mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-2">About Country of Eligibility:</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Usually the same as your country of birth</li>
                  <li>• Can be your spouse's country if your birth country is not eligible</li>
                  <li>• Can be either parent's country if your birth country is not eligible</li>
                  <li>• Must be a country eligible for the DV Lottery program</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
            completionPercentage === 100 ? 'bg-green-50' : 'bg-yellow-50'
          }`}>
            {completionPercentage === 100 ? (
              <TickCircle size={20} color="#16A34A" variant="Bold" />
            ) : (
              <Warning2 size={20} color="#D97706" variant="Bold" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Step Completion</h3>
            <p className="text-sm text-gray-600">
              {completionPercentage === 100 
                ? 'All required fields completed! You can proceed to the next step.' 
                : `${completedFields.length} of ${requiredFields.length} required fields completed.`
              }
            </p>
          </div>
        </div>

        {/* Required fields checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { field: 'lastName', label: 'Last Name' },
            { field: 'firstName', label: 'First Name' },
            { field: 'gender', label: 'Gender' },
            { field: 'dateOfBirth', label: 'Date of Birth' },
            { field: 'cityOfBirth', label: 'City of Birth' },
            { field: 'countryOfBirth', label: 'Country of Birth' },
            { field: 'eligibilityCountry', label: 'Country of Eligibility' }
          ].map(({ field, label }) => {
            const isCompleted = !!personalInfo[field as keyof typeof personalInfo]
            return (
              <div key={field} className={`flex items-center space-x-3 p-3 rounded-lg ${
                isCompleted ? 'bg-green-50 border border-green-200' : 'bg-white border border-gray-200'
              }`}>
                {isCompleted ? (
                  <TickCircle size={16} color="#16A34A" variant="Bold" />
                ) : (
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                )}
                <span className={`text-sm ${
                  isCompleted ? 'text-green-800 font-medium' : 'text-gray-600'
                }`}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}