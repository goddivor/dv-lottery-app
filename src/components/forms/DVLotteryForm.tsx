// src/components/forms/DVLotteryForm.tsx

import React from 'react'
import { Input } from '@/components/forms/Input'
import { CustomSelect } from '@/components/forms/custom-select'
import { useToast } from '@/context/toast-context'
import { useDVForm } from '@/hooks/useDVForm'
import { Gender, EducationLevel, MaritalStatus } from '@/types/dv-lottery'
import { 
  User, 
  Mail, 
  MapPin, 
  GraduationCap,
  FileText,
  Download,
  Save,
  RotateCcw
} from 'lucide-react'

// Options pour les selects
const genderOptions = [
  { value: Gender.MALE, label: 'Male' },
  { value: Gender.FEMALE, label: 'Female' }
]

const educationOptions = [
  { value: EducationLevel.HIGH_SCHOOL_DEGREE, label: 'High school degree' },
  { value: EducationLevel.VOCATIONAL_SCHOOL, label: 'Vocational school' },
  { value: EducationLevel.SOME_UNIVERSITY, label: 'Some university courses' },
  { value: EducationLevel.UNIVERSITY_DEGREE, label: 'University degree' },
  { value: EducationLevel.MASTERS_DEGREE, label: 'Master\'s degree' },
  { value: EducationLevel.DOCTORATE_DEGREE, label: 'Doctorate degree' }
]

const maritalStatusOptions = [
  { value: MaritalStatus.UNMARRIED, label: 'Unmarried' },
  { value: MaritalStatus.MARRIED_NOT_US, label: 'Married (spouse not US citizen/Green Card holder)' },
  { value: MaritalStatus.MARRIED_US, label: 'Married (spouse IS US citizen/Green Card holder)' },
  { value: MaritalStatus.DIVORCED, label: 'Divorced' },
  { value: MaritalStatus.WIDOWED, label: 'Widowed' },
  { value: MaritalStatus.LEGALLY_SEPARATED, label: 'Legally separated' }
]

export const DVLotteryForm: React.FC = () => {
  const { 
    formData, 
    isLoading, 
    updateField, 
    resetForm, 
    exportData, 
    validateForm,
    saveToLocal,
    completionPercentage 
  } = useDVForm()
  
  const { success, error: showError } = useToast()

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your application...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const validation = validateForm()
    if (!validation.isValid) {
      showError('Validation Error', `Please fix these issues: ${validation.errors.join(', ')}`)
      return
    }

    exportData()
    success('Application Submitted!', 'Your DV Lottery application has been saved successfully')
  }

  const handleSaveDraft = () => {
    saveToLocal()
    success('Draft Saved!', 'Your progress has been saved locally')
  }

  const handleExportPDF = () => {
    success('PDF Export', 'PDF export feature coming soon!')
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form?')) {
      resetForm()
      success('Form Reset', 'All data has been cleared')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              DV Lottery Application
            </h1>
            <p className="text-gray-600">
              Diversity Visa Program Entry Form - {completionPercentage}% Complete
            </p>
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              DV-2026 Program
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input
                label="Last Name *"
                placeholder="Family name"
                value={formData.lastName}
                onChange={(e) => updateField('lastName')(e.target.value)}
              />
              
              <Input
                label="First Name *"
                placeholder="Given name"
                value={formData.firstName}
                onChange={(e) => updateField('firstName')(e.target.value)}
              />
              
              <Input
                label="Middle Name"
                placeholder="Middle name (optional)"
                value={formData.middleName}
                onChange={(e) => updateField('middleName')(e.target.value)}
              />
              
              <CustomSelect
                label="Gender *"
                placeholder="Select gender"
                options={genderOptions}
                value={formData.gender || null}
                onChange={(value) => updateField('gender')(value)}
              />
              
              <Input
                label="Date of Birth *"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => updateField('dateOfBirth')(e.target.value)}
              />
            </div>
          </div>

          {/* Birth Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <MapPin className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Birth Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input
                label="City of Birth *"
                placeholder="Birth city"
                value={formData.cityOfBirth}
                onChange={(e) => updateField('cityOfBirth')(e.target.value)}
              />
              
              <Input
                label="Country of Birth *"
                placeholder="Birth country"
                value={formData.countryOfBirth}
                onChange={(e) => updateField('countryOfBirth')(e.target.value)}
              />
              
              <Input
                label="Eligibility Country *"
                placeholder="Eligibility country"
                value={formData.eligibilityCountry}
                onChange={(e) => updateField('eligibilityCountry')(e.target.value)}
              />
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <MapPin className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Mailing Address</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Address Line 1 *"
                  placeholder="Street address"
                  value={formData.addressLine1}
                  onChange={(e) => updateField('addressLine1')(e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2">
                <Input
                  label="Address Line 2"
                  placeholder="Apartment, suite, etc. (optional)"
                  value={formData.addressLine2}
                  onChange={(e) => updateField('addressLine2')(e.target.value)}
                />
              </div>
              
              <Input
                label="City *"
                placeholder="City"
                value={formData.city}
                onChange={(e) => updateField('city')(e.target.value)}
              />
              
              <Input
                label="State/Province *"
                placeholder="State or province"
                value={formData.stateProvince}
                onChange={(e) => updateField('stateProvince')(e.target.value)}
              />
              
              <Input
                label="Postal Code *"
                placeholder="ZIP/Postal code"
                value={formData.postalCode}
                onChange={(e) => updateField('postalCode')(e.target.value)}
              />
              
              <Input
                label="Country *"
                placeholder="Country"
                value={formData.country}
                onChange={(e) => updateField('country')(e.target.value)}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Mail className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email Address *"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => updateField('email')(e.target.value)}
              />
              
              <Input
                label="Phone Number"
                placeholder="+1 (555) 123-4567"
                value={formData.phoneNumber}
                onChange={(e) => updateField('phoneNumber')(e.target.value)}
              />
            </div>
          </div>

          {/* Education & Family */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <GraduationCap className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-900">Education & Family</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CustomSelect
                label="Education Level *"
                placeholder="Select education level"
                options={educationOptions}
                value={formData.educationLevel || null}
                onChange={(value) => updateField('educationLevel')(value)}
              />
              
              <CustomSelect
                label="Marital Status *"
                placeholder="Select marital status"
                options={maritalStatusOptions}
                value={formData.maritalStatus || null}
                onChange={(value) => updateField('maritalStatus')(value)}
              />
              
              <Input
                label="Number of Children"
                type="number"
                min="0"
                max="20"
                placeholder="0"
                value={formData.numberOfChildren.toString()}
                onChange={(e) => updateField('numberOfChildren')(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <button
                type="button"
                onClick={handleExportPDF}
                className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Export PDF</span>
              </button>
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center justify-center space-x-2 px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Reset</span>
                </button>
                
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="flex items-center justify-center space-x-2 px-6 py-3 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Draft</span>
                </button>
                
                <button
                  type="submit"
                  className="flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                >
                  <FileText className="w-5 h-5" />
                  <span>Submit Application</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}