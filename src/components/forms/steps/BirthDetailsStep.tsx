/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/forms/steps/BirthDetailsStep.tsx

import React, { useState, useEffect } from 'react'
import { type FormStepProps } from '@/types/dv-lottery'
import { useDVLotteryStore } from '@/hooks/useDVLotteryStore'
// import { Input } from '@/components/forms/Input'
import { CustomSelect } from '@/components/forms/custom-select'
import { SearchInput } from '@/components/forms/search-input'
import { 
  Location, 
  Global,
  InfoCircle,
  TickCircle,
  Warning2,
  SearchNormal1,
  Map1
} from 'iconsax-react'

// Mock countries data - in real app, this would come from an API or database
const COUNTRIES = [
  { value: 'Afghanistan', label: 'Afghanistan' },
  { value: 'Albania', label: 'Albania' },
  { value: 'Algeria', label: 'Algeria' },
  { value: 'Argentina', label: 'Argentina' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Austria', label: 'Austria' },
  { value: 'Bangladesh', label: 'Bangladesh' },
  { value: 'Belgium', label: 'Belgium' },
  { value: 'Brazil', label: 'Brazil' },
  { value: 'Canada', label: 'Canada' },
  { value: 'China', label: 'China' },
  { value: 'Colombia', label: 'Colombia' },
  { value: 'Democratic Republic of Congo', label: 'Democratic Republic of Congo' },
  { value: 'Egypt', label: 'Egypt' },
  { value: 'Ethiopia', label: 'Ethiopia' },
  { value: 'France', label: 'France' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Ghana', label: 'Ghana' },
  { value: 'India', label: 'India' },
  { value: 'Indonesia', label: 'Indonesia' },
  { value: 'Iran', label: 'Iran' },
  { value: 'Iraq', label: 'Iraq' },
  { value: 'Italy', label: 'Italy' },
  { value: 'Japan', label: 'Japan' },
  { value: 'Kenya', label: 'Kenya' },
  { value: 'Mexico', label: 'Mexico' },
  { value: 'Morocco', label: 'Morocco' },
  { value: 'Nepal', label: 'Nepal' },
  { value: 'Netherlands', label: 'Netherlands' },
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'Pakistan', label: 'Pakistan' },
  { value: 'Peru', label: 'Peru' },
  { value: 'Philippines', label: 'Philippines' },
  { value: 'Poland', label: 'Poland' },
  { value: 'Russia', label: 'Russia' },
  { value: 'South Africa', label: 'South Africa' },
  { value: 'South Korea', label: 'South Korea' },
  { value: 'Spain', label: 'Spain' },
  { value: 'Sri Lanka', label: 'Sri Lanka' },
  { value: 'Tanzania', label: 'Tanzania' },
  { value: 'Thailand', label: 'Thailand' },
  { value: 'Togo', label: 'Togo' },
  { value: 'Turkey', label: 'Turkey' },
  { value: 'Uganda', label: 'Uganda' },
  { value: 'Ukraine', label: 'Ukraine' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Venezuela', label: 'Venezuela' },
  { value: 'Vietnam', label: 'Vietnam' },
  { value: 'Yemen', label: 'Yemen' },
  { value: 'Zambia', label: 'Zambia' }
]

// Mock cities data - in real app, this would be dynamic based on country
const POPULAR_CITIES: Record<string, string[]> = {
  'Togo': ['Lomé', 'Sokodé', 'Kara', 'Atakpamé', 'Dapaong', 'Tsévié', 'Vogan', 'Aného'],
  'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Montpellier', 'Strasbourg'],
  'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf'],
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'],
  'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg'],
  'Nigeria': ['Lagos', 'Kano', 'Ibadan', 'Abuja', 'Port Harcourt', 'Benin City', 'Maiduguri']
}

export const BirthDetailsStep: React.FC<FormStepProps> = ({ data }) => {
  const { updatePersonalInfo, setValidationErrors, clearValidationErrors } = useDVLotteryStore()
  
  const personalInfo = data.personalInfo
  const [citySearch, setCitySearch] = useState('')
  const [filteredCountries, setFilteredCountries] = useState(COUNTRIES)
  const [suggestedCities, setSuggestedCities] = useState<string[]>([])

  // Filter countries based on search
  const handleCountrySearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredCountries(COUNTRIES)
      return
    }
    
    const filtered = COUNTRIES.filter(country =>
      country.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCountries(filtered)
  }

  // Update suggested cities when country changes
  useEffect(() => {
    if (personalInfo.countryOfBirth) {
      const cities = POPULAR_CITIES[personalInfo.countryOfBirth] || []
      setSuggestedCities(cities)
    } else {
      setSuggestedCities([])
    }
  }, [personalInfo.countryOfBirth])

  const handleInputChange = (field: keyof typeof personalInfo) => (value: string) => {
    updatePersonalInfo({ [field]: value })
    clearValidationErrors(`personalInfo.${field}`)
  }

  const handleCityChange = (value: string) => {
    setCitySearch(value)
    handleInputChange('cityOfBirth')(value)
  }

  const handleCitySuggestionClick = (city: string) => {
    setCitySearch(city)
    handleInputChange('cityOfBirth')(city)
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
  const requiredFields = ['cityOfBirth', 'countryOfBirth']
  const completedFields = requiredFields.filter(field => personalInfo[field as keyof typeof personalInfo])
  const completionPercentage = Math.round((completedFields.length / requiredFields.length) * 100)

  return (
    <div className="space-y-8">
      {/* Progress indicator for this step */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl">
              <Location size={24} color="white" variant="Bold" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Birth Details</h3>
              <p className="text-gray-600">Specify exactly where you were born</p>
            </div>
          </div>
          
          {/* Completion indicator */}
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{completionPercentage}%</div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-white rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Important instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg flex-shrink-0">
            <InfoCircle size={20} color="#2563EB" variant="Bold" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Birth Location Requirements</h4>
            <ul className="text-blue-800 text-sm space-y-2">
              <li className="flex items-start space-x-2">
                <TickCircle size={16} color="#2563EB" variant="Bold" className="mt-0.5 flex-shrink-0" />
                <span>Enter the <strong>exact city</strong> where you were born, not the nearest large city</span>
              </li>
              <li className="flex items-start space-x-2">
                <TickCircle size={16} color="#2563EB" variant="Bold" className="mt-0.5 flex-shrink-0" />
                <span>Use the <strong>official name</strong> as it appears on your birth certificate</span>
              </li>
              <li className="flex items-start space-x-2">
                <TickCircle size={16} color="#2563EB" variant="Bold" className="mt-0.5 flex-shrink-0" />
                <span>Country should match what's on your official documents</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Birth Location Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg">
            <Map1 size={20} color="#16A34A" variant="Bold" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Place of Birth</h3>
            <p className="text-sm text-gray-600">Enter your birth location as shown on official documents</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Country of Birth */}
          <div>
            <CustomSelect
              label="Country of Birth *"
              placeholder="Search and select your birth country"
              options={filteredCountries}
              value={personalInfo.countryOfBirth || null}
              onChange={(value) => handleInputChange('countryOfBirth')(value as string)}
            />
            
            {/* Search functionality for countries */}
            <div className="mt-3">
              <SearchInput
                placeholder="Search countries..."
                value=""
                onChange={(e) => handleCountrySearch(e.target.value)}
                showSearchIcon={true}
                className="text-sm"
              />
            </div>
          </div>

          {/* City of Birth */}
          <div>
            <SearchInput
              label="City of Birth *"
              placeholder="Enter your birth city"
              value={citySearch || personalInfo.cityOfBirth || ''}
              onChange={(e) => handleCityChange(e.target.value)}
              onBlur={(e) => validateField('cityOfBirth', e.target.value, 'City of birth')}
              showSearchIcon={true}
            />

            {/* City suggestions */}
            {suggestedCities.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-2 flex items-center space-x-1">
                  <SearchNormal1 size={12} color="#6B7280" variant="Outline" />
                  <span>Popular cities in {personalInfo.countryOfBirth}:</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedCities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleCitySuggestionClick(city)}
                      className={`px-3 py-1 text-sm rounded-full border transition-all duration-200 ${
                        personalInfo.cityOfBirth === city
                          ? 'bg-green-100 border-green-300 text-green-800'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Help text */}
            <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
              <InfoCircle size={12} color="#6B7280" variant="Outline" />
              <span>Enter the actual city where you were born, not just the nearest major city</span>
            </p>
          </div>
        </div>
      </div>

      {/* Document Verification Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg flex-shrink-0">
            <Global size={20} color="#D97706" variant="Bold" />
          </div>
          <div>
            <h4 className="font-semibold text-yellow-900 mb-2">Verify with Official Documents</h4>
            <p className="text-yellow-800 text-sm mb-3">
              Double-check this information against your official documents to ensure accuracy:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-yellow-700">
              <div className="flex items-center space-x-2">
                <TickCircle size={14} color="#D97706" variant="Bold" />
                <span>Birth Certificate</span>
              </div>
              <div className="flex items-center space-x-2">
                <TickCircle size={14} color="#D97706" variant="Bold" />
                <span>Passport</span>
              </div>
              <div className="flex items-center space-x-2">
                <TickCircle size={14} color="#D97706" variant="Bold" />
                <span>National ID</span>
              </div>
              <div className="flex items-center space-x-2">
                <TickCircle size={14} color="#D97706" variant="Bold" />
                <span>Other Official Records</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Input Summary */}
      {(personalInfo.cityOfBirth || personalInfo.countryOfBirth) && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
              <Location size={20} color="#6B7280" variant="Bold" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Your Birth Location</h3>
              <p className="text-sm text-gray-600">Review the information you've entered</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {personalInfo.cityOfBirth || '[City not specified]'}
                {personalInfo.cityOfBirth && personalInfo.countryOfBirth && ', '}
                {personalInfo.countryOfBirth || '[Country not specified]'}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                This is how your birth location will appear in your application
              </p>
            </div>
          </div>
        </div>
      )}

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
                ? 'Birth details completed! You can proceed to the next step.' 
                : `Please complete all required fields to continue.`
              }
            </p>
          </div>
        </div>

        {/* Required fields checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { field: 'countryOfBirth', label: 'Country of Birth' },
            { field: 'cityOfBirth', label: 'City of Birth' }
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