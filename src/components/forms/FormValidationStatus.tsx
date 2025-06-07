// src/components/forms/FormValidationStatus.tsx

import React from 'react'
import { CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react'
import type { DVFormData } from '@/hooks/useDVForm'

interface FormValidationStatusProps {
  formData: DVFormData
  className?: string
}

interface FieldValidation {
  field: keyof DVFormData
  label: string
  isValid: boolean
  isRequired: boolean
}

export const FormValidationStatus: React.FC<FormValidationStatusProps> = ({
  formData,
  className = ''
}) => {
  const validations: FieldValidation[] = [
    { field: 'lastName', label: 'Last Name', isValid: !!formData.lastName?.trim(), isRequired: true },
    { field: 'firstName', label: 'First Name', isValid: !!formData.firstName?.trim(), isRequired: true },
    { field: 'gender', label: 'Gender', isValid: !!formData.gender, isRequired: true },
    { field: 'dateOfBirth', label: 'Date of Birth', isValid: !!formData.dateOfBirth, isRequired: true },
    { field: 'cityOfBirth', label: 'City of Birth', isValid: !!formData.cityOfBirth?.trim(), isRequired: true },
    { field: 'countryOfBirth', label: 'Country of Birth', isValid: !!formData.countryOfBirth?.trim(), isRequired: true },
    { field: 'eligibilityCountry', label: 'Eligibility Country', isValid: !!formData.eligibilityCountry?.trim(), isRequired: true },
    { field: 'addressLine1', label: 'Address', isValid: !!formData.addressLine1?.trim(), isRequired: true },
    { field: 'city', label: 'City', isValid: !!formData.city?.trim(), isRequired: true },
    { field: 'stateProvince', label: 'State/Province', isValid: !!formData.stateProvince?.trim(), isRequired: true },
    { field: 'postalCode', label: 'Postal Code', isValid: !!formData.postalCode?.trim(), isRequired: true },
    { field: 'country', label: 'Country', isValid: !!formData.country?.trim(), isRequired: true },
    { field: 'email', label: 'Email', isValid: !!formData.email?.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email), isRequired: true },
    { field: 'educationLevel', label: 'Education Level', isValid: !!formData.educationLevel, isRequired: true },
    { field: 'maritalStatus', label: 'Marital Status', isValid: !!formData.maritalStatus, isRequired: true },
    { field: 'phoneNumber', label: 'Phone Number', isValid: !!formData.phoneNumber?.trim(), isRequired: false },
    { field: 'photo', label: 'Photo', isValid: !!formData.photo, isRequired: false },
  ]

  const requiredFields = validations.filter(v => v.isRequired)
  const validRequiredFields = requiredFields.filter(v => v.isValid)
  const invalidRequiredFields = requiredFields.filter(v => !v.isValid)
  
  const optionalFields = validations.filter(v => !v.isRequired)
  const validOptionalFields = optionalFields.filter(v => v.isValid)

  const overallStatus = invalidRequiredFields.length === 0 ? 'complete' : 'incomplete'

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          overallStatus === 'complete' ? 'bg-green-100' : 'bg-yellow-100'
        }`}>
          {overallStatus === 'complete' ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <Clock className="w-6 h-6 text-yellow-600" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Application Status</h3>
          <p className="text-sm text-gray-600">
            {overallStatus === 'complete' 
              ? 'All required fields completed!' 
              : `${invalidRequiredFields.length} required field${invalidRequiredFields.length > 1 ? 's' : ''} remaining`
            }
          </p>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">Required Complete</span>
          </div>
          <div className="text-2xl font-bold text-green-700 mt-1">
            {validRequiredFields.length}/{requiredFields.length}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Optional Complete</span>
          </div>
          <div className="text-2xl font-bold text-blue-700 mt-1">
            {validOptionalFields.length}/{optionalFields.length}
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <XCircle className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-900">Overall Progress</span>
          </div>
          <div className="text-2xl font-bold text-purple-700 mt-1">
            {formData.completionPercentage}%
          </div>
        </div>
      </div>

      {/* Missing Required Fields */}
      {invalidRequiredFields.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-yellow-900 mb-2 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>Missing Required Fields</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {invalidRequiredFields.map((field) => (
              <div key={field.field} className="flex items-center space-x-2 text-sm text-yellow-800">
                <XCircle className="w-3 h-3" />
                <span>{field.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Fields */}
      {validRequiredFields.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2 flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Completed Fields</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {validRequiredFields.map((field) => (
              <div key={field.field} className="flex items-center space-x-2 text-sm text-green-800">
                <CheckCircle className="w-3 h-3" />
                <span>{field.label}</span>
              </div>
            ))}
            {validOptionalFields.map((field) => (
              <div key={field.field} className="flex items-center space-x-2 text-sm text-green-700 opacity-75">
                <CheckCircle className="w-3 h-3" />
                <span>{field.label} (optional)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}