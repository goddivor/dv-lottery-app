// src/components/forms/steps/EligibilityStep.tsx

import React, { useState, useMemo } from 'react'
import { type FormStepProps } from '@/types/dv-lottery'
import { useDVLotteryStore } from '@/hooks/useDVLotteryStore'
import { CustomSelect } from '@/components/forms/custom-select'
import { SearchInput } from '@/components/forms/search-input'
import { 
  Global, 
  InfoCircle,
  TickCircle,
  Warning2,
  SearchNormal1,
  Flag,
  People
} from 'iconsax-react'

// Mock data for eligible countries (in a real app, this would come from an API)
const eligibleCountries = [
  { code: 'AF', name: 'Afghanistan', region: 'Asia' },
  { code: 'AL', name: 'Albania', region: 'Europe' },
  { code: 'DZ', name: 'Algeria', region: 'Africa' },
  { code: 'AD', name: 'Andorra', region: 'Europe' },
  { code: 'AO', name: 'Angola', region: 'Africa' },
  { code: 'AG', name: 'Antigua and Barbuda', region: 'Americas' },
  { code: 'AR', name: 'Argentina', region: 'Americas' },
  { code: 'AM', name: 'Armenia', region: 'Asia' },
  { code: 'AU', name: 'Australia', region: 'Oceania' },
  { code: 'AT', name: 'Austria', region: 'Europe' },
  { code: 'AZ', name: 'Azerbaijan', region: 'Asia' },
  { code: 'BS', name: 'Bahamas', region: 'Americas' },
  { code: 'BH', name: 'Bahrain', region: 'Asia' },
  { code: 'BD', name: 'Bangladesh', region: 'Asia' },
  { code: 'BB', name: 'Barbados', region: 'Americas' },
  { code: 'BY', name: 'Belarus', region: 'Europe' },
  { code: 'BE', name: 'Belgium', region: 'Europe' },
  { code: 'BZ', name: 'Belize', region: 'Americas' },
  { code: 'BJ', name: 'Benin', region: 'Africa' },
  { code: 'BT', name: 'Bhutan', region: 'Asia' },
  { code: 'BO', name: 'Bolivia', region: 'Americas' },
  { code: 'BA', name: 'Bosnia and Herzegovina', region: 'Europe' },
  { code: 'BW', name: 'Botswana', region: 'Africa' },
  { code: 'BG', name: 'Bulgaria', region: 'Europe' },
  { code: 'BF', name: 'Burkina Faso', region: 'Africa' },
  { code: 'BI', name: 'Burundi', region: 'Africa' },
  { code: 'KH', name: 'Cambodia', region: 'Asia' },
  { code: 'CM', name: 'Cameroon', region: 'Africa' },
  { code: 'CV', name: 'Cape Verde', region: 'Africa' },
  { code: 'CF', name: 'Central African Republic', region: 'Africa' },
  { code: 'TD', name: 'Chad', region: 'Africa' },
  { code: 'CL', name: 'Chile', region: 'Americas' },
  { code: 'CO', name: 'Colombia', region: 'Americas' },
  { code: 'KM', name: 'Comoros', region: 'Africa' },
  { code: 'CG', name: 'Congo', region: 'Africa' },
  { code: 'CR', name: 'Costa Rica', region: 'Americas' },
  { code: 'CI', name: 'Cote d\'Ivoire', region: 'Africa' },
  { code: 'HR', name: 'Croatia', region: 'Europe' },
  { code: 'CY', name: 'Cyprus', region: 'Europe' },
  { code: 'CZ', name: 'Czech Republic', region: 'Europe' },
  { code: 'DK', name: 'Denmark', region: 'Europe' },
  { code: 'DJ', name: 'Djibouti', region: 'Africa' },
  { code: 'DM', name: 'Dominica', region: 'Americas' },
  { code: 'EC', name: 'Ecuador', region: 'Americas' },
  { code: 'EG', name: 'Egypt', region: 'Africa' },
  { code: 'SV', name: 'El Salvador', region: 'Americas' },
  { code: 'GQ', name: 'Equatorial Guinea', region: 'Africa' },
  { code: 'ER', name: 'Eritrea', region: 'Africa' },
  { code: 'EE', name: 'Estonia', region: 'Europe' },
  { code: 'ET', name: 'Ethiopia', region: 'Africa' },
  { code: 'FJ', name: 'Fiji', region: 'Oceania' },
  { code: 'FI', name: 'Finland', region: 'Europe' },
  { code: 'FR', name: 'France', region: 'Europe' },
  { code: 'GA', name: 'Gabon', region: 'Africa' },
  { code: 'GM', name: 'Gambia', region: 'Africa' },
  { code: 'GE', name: 'Georgia', region: 'Asia' },
  { code: 'DE', name: 'Germany', region: 'Europe' },
  { code: 'GH', name: 'Ghana', region: 'Africa' },
  { code: 'GR', name: 'Greece', region: 'Europe' },
  { code: 'GD', name: 'Grenada', region: 'Americas' },
  { code: 'GT', name: 'Guatemala', region: 'Americas' },
  { code: 'GN', name: 'Guinea', region: 'Africa' },
  { code: 'GW', name: 'Guinea-Bissau', region: 'Africa' },
  { code: 'GY', name: 'Guyana', region: 'Americas' },
  { code: 'HT', name: 'Haiti', region: 'Americas' },
  { code: 'HN', name: 'Honduras', region: 'Americas' },
  { code: 'HU', name: 'Hungary', region: 'Europe' },
  { code: 'IS', name: 'Iceland', region: 'Europe' },
  { code: 'ID', name: 'Indonesia', region: 'Asia' },
  { code: 'IR', name: 'Iran', region: 'Asia' },
  { code: 'IQ', name: 'Iraq', region: 'Asia' },
  { code: 'IE', name: 'Ireland', region: 'Europe' },
  { code: 'IL', name: 'Israel', region: 'Asia' },
  { code: 'IT', name: 'Italy', region: 'Europe' },
  { code: 'JM', name: 'Jamaica', region: 'Americas' },
  { code: 'JO', name: 'Jordan', region: 'Asia' },
  { code: 'KZ', name: 'Kazakhstan', region: 'Asia' },
  { code: 'KE', name: 'Kenya', region: 'Africa' },
  { code: 'KI', name: 'Kiribati', region: 'Oceania' },
  { code: 'XK', name: 'Kosovo', region: 'Europe' },
  { code: 'KW', name: 'Kuwait', region: 'Asia' },
  { code: 'KG', name: 'Kyrgyzstan', region: 'Asia' },
  { code: 'LA', name: 'Laos', region: 'Asia' },
  { code: 'LV', name: 'Latvia', region: 'Europe' },
  { code: 'LB', name: 'Lebanon', region: 'Asia' },
  { code: 'LS', name: 'Lesotho', region: 'Africa' },
  { code: 'LR', name: 'Liberia', region: 'Africa' },
  { code: 'LY', name: 'Libya', region: 'Africa' },
  { code: 'LI', name: 'Liechtenstein', region: 'Europe' },
  { code: 'LT', name: 'Lithuania', region: 'Europe' },
  { code: 'LU', name: 'Luxembourg', region: 'Europe' },
  { code: 'MK', name: 'North Macedonia', region: 'Europe' },
  { code: 'MG', name: 'Madagascar', region: 'Africa' },
  { code: 'MW', name: 'Malawi', region: 'Africa' },
  { code: 'MV', name: 'Maldives', region: 'Asia' },
  { code: 'ML', name: 'Mali', region: 'Africa' },
  { code: 'MT', name: 'Malta', region: 'Europe' },
  { code: 'MH', name: 'Marshall Islands', region: 'Oceania' },
  { code: 'MR', name: 'Mauritania', region: 'Africa' },
  { code: 'MU', name: 'Mauritius', region: 'Africa' },
  { code: 'FM', name: 'Micronesia', region: 'Oceania' },
  { code: 'MD', name: 'Moldova', region: 'Europe' },
  { code: 'MC', name: 'Monaco', region: 'Europe' },
  { code: 'MN', name: 'Mongolia', region: 'Asia' },
  { code: 'ME', name: 'Montenegro', region: 'Europe' },
  { code: 'MA', name: 'Morocco', region: 'Africa' },
  { code: 'MZ', name: 'Mozambique', region: 'Africa' },
  { code: 'MM', name: 'Myanmar', region: 'Asia' },
  { code: 'NA', name: 'Namibia', region: 'Africa' },
  { code: 'NR', name: 'Nauru', region: 'Oceania' },
  { code: 'NP', name: 'Nepal', region: 'Asia' },
  { code: 'NL', name: 'Netherlands', region: 'Europe' },
  { code: 'NZ', name: 'New Zealand', region: 'Oceania' },
  { code: 'NI', name: 'Nicaragua', region: 'Americas' },
  { code: 'NE', name: 'Niger', region: 'Africa' },
  { code: 'NG', name: 'Nigeria', region: 'Africa' },
  { code: 'NO', name: 'Norway', region: 'Europe' },
  { code: 'OM', name: 'Oman', region: 'Asia' },
  { code: 'PW', name: 'Palau', region: 'Oceania' },
  { code: 'PA', name: 'Panama', region: 'Americas' },
  { code: 'PG', name: 'Papua New Guinea', region: 'Oceania' },
  { code: 'PY', name: 'Paraguay', region: 'Americas' },
  { code: 'PE', name: 'Peru', region: 'Americas' },
  { code: 'PL', name: 'Poland', region: 'Europe' },
  { code: 'PT', name: 'Portugal', region: 'Europe' },
  { code: 'QA', name: 'Qatar', region: 'Asia' },
  { code: 'RO', name: 'Romania', region: 'Europe' },
  { code: 'RU', name: 'Russia', region: 'Europe' },
  { code: 'RW', name: 'Rwanda', region: 'Africa' },
  { code: 'KN', name: 'Saint Kitts and Nevis', region: 'Americas' },
  { code: 'LC', name: 'Saint Lucia', region: 'Americas' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', region: 'Americas' },
  { code: 'WS', name: 'Samoa', region: 'Oceania' },
  { code: 'SM', name: 'San Marino', region: 'Europe' },
  { code: 'ST', name: 'Sao Tome and Principe', region: 'Africa' },
  { code: 'SA', name: 'Saudi Arabia', region: 'Asia' },
  { code: 'SN', name: 'Senegal', region: 'Africa' },
  { code: 'RS', name: 'Serbia', region: 'Europe' },
  { code: 'SC', name: 'Seychelles', region: 'Africa' },
  { code: 'SL', name: 'Sierra Leone', region: 'Africa' },
  { code: 'SG', name: 'Singapore', region: 'Asia' },
  { code: 'SK', name: 'Slovakia', region: 'Europe' },
  { code: 'SI', name: 'Slovenia', region: 'Europe' },
  { code: 'SB', name: 'Solomon Islands', region: 'Oceania' },
  { code: 'SO', name: 'Somalia', region: 'Africa' },
  { code: 'ZA', name: 'South Africa', region: 'Africa' },
  { code: 'SS', name: 'South Sudan', region: 'Africa' },
  { code: 'ES', name: 'Spain', region: 'Europe' },
  { code: 'LK', name: 'Sri Lanka', region: 'Asia' },
  { code: 'SD', name: 'Sudan', region: 'Africa' },
  { code: 'SR', name: 'Suriname', region: 'Americas' },
  { code: 'SZ', name: 'Eswatini', region: 'Africa' },
  { code: 'SE', name: 'Sweden', region: 'Europe' },
  { code: 'CH', name: 'Switzerland', region: 'Europe' },
  { code: 'SY', name: 'Syria', region: 'Asia' },
  { code: 'TJ', name: 'Tajikistan', region: 'Asia' },
  { code: 'TZ', name: 'Tanzania', region: 'Africa' },
  { code: 'TH', name: 'Thailand', region: 'Asia' },
  { code: 'TL', name: 'Timor-Leste', region: 'Asia' },
  { code: 'TG', name: 'Togo', region: 'Africa' },
  { code: 'TO', name: 'Tonga', region: 'Oceania' },
  { code: 'TT', name: 'Trinidad and Tobago', region: 'Americas' },
  { code: 'TN', name: 'Tunisia', region: 'Africa' },
  { code: 'TR', name: 'Turkey', region: 'Europe' },
  { code: 'TM', name: 'Turkmenistan', region: 'Asia' },
  { code: 'TV', name: 'Tuvalu', region: 'Oceania' },
  { code: 'UG', name: 'Uganda', region: 'Africa' },
  { code: 'UA', name: 'Ukraine', region: 'Europe' },
  { code: 'AE', name: 'United Arab Emirates', region: 'Asia' },
  { code: 'UY', name: 'Uruguay', region: 'Americas' },
  { code: 'UZ', name: 'Uzbekistan', region: 'Asia' },
  { code: 'VU', name: 'Vanuatu', region: 'Oceania' },
  { code: 'VE', name: 'Venezuela', region: 'Americas' },
  { code: 'VN', name: 'Vietnam', region: 'Asia' },
  { code: 'YE', name: 'Yemen', region: 'Asia' },
  { code: 'ZM', name: 'Zambia', region: 'Africa' },
  { code: 'ZW', name: 'Zimbabwe', region: 'Africa' }
]

// Countries that are NOT eligible for DV Lottery
const ineligibleCountries = [
  'Bangladesh', 'Brazil', 'Canada', 'China', 'Colombia', 'Dominican Republic',
  'El Salvador', 'Haiti', 'Honduras', 'India', 'Jamaica', 'Mexico',
  'Nigeria', 'Pakistan', 'Philippines', 'South Korea', 'United Kingdom',
  'United States', 'Vietnam'
]


export const EligibilityStep: React.FC<FormStepProps> = ({ data }) => {
  const { updatePersonalInfo, setValidationErrors, clearValidationErrors } = useDVLotteryStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEligibilityType, setSelectedEligibilityType] = useState<'birth' | 'spouse' | 'parent'>('birth')
  const [showEligibilityOptions, setShowEligibilityOptions] = useState(false)

  const personalInfo = data.personalInfo

  // Filter countries based on search term
  const filteredCountries = useMemo(() => {
    if (!searchTerm) return eligibleCountries
    return eligibleCountries.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  // Convert to select options
  const countryOptions = filteredCountries.map(country => ({
    value: country.name,
    label: country.name
  }))

  // Group countries by region for better UX
  const countryGroups = useMemo(() => {
    const groups = filteredCountries.reduce((acc, country) => {
      if (!acc[country.region]) {
        acc[country.region] = []
      }
      acc[country.region].push(country)
      return acc
    }, {} as Record<string, typeof eligibleCountries>)

    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [filteredCountries])

  const handleCountryChange = (value: string | null) => {
    updatePersonalInfo({ eligibilityCountry: value || '' })
    clearValidationErrors('personalInfo.eligibilityCountry')
    
    // Check if country is eligible
    if (value && ineligibleCountries.includes(value)) {
      setValidationErrors('personalInfo.eligibilityCountry', [{
        field: 'eligibilityCountry',
        message: `${value} is not eligible for the DV Lottery program`,
        type: 'custom'
      }])
      setShowEligibilityOptions(true)
    } else {
      setShowEligibilityOptions(false)
    }
  }

  const isCompleted = !!personalInfo.eligibilityCountry && 
                     !ineligibleCountries.includes(personalInfo.eligibilityCountry)

  return (
    <div className="space-y-8">
      {/* Progress indicator for this step */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
              <Global size={24} color="white" variant="Bold" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Country of Eligibility</h3>
              <p className="text-gray-600">Select the country that makes you eligible for the DV Lottery</p>
            </div>
          </div>
          
          {/* Completion indicator */}
          <div className="text-right">
            <div className={`text-2xl font-bold ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
              {isCompleted ? '100%' : '0%'}
            </div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-white rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ease-out ${
              isCompleted 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                : 'bg-gray-200'
            }`}
            style={{ width: isCompleted ? '100%' : '0%' }}
          />
        </div>
      </div>

      {/* Important instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg flex-shrink-0">
            <InfoCircle size={20} color="#3B82F6" variant="Bold" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Understanding Eligibility</h4>
            <p className="text-blue-800 text-sm mb-3">
              Your country of eligibility determines if you can participate in the DV Lottery. 
              You may claim eligibility through:
            </p>
            <ul className="text-blue-800 text-sm space-y-2">
              <li className="flex items-start space-x-2">
                <Flag size={16} color="#3B82F6" variant="Bold" className="mt-0.5 flex-shrink-0" />
                <span><strong>Your birth country</strong> (most common)</span>
              </li>
              <li className="flex items-start space-x-2">
                <People size={16} color="#3B82F6" variant="Bold" className="mt-0.5 flex-shrink-0" />
                <span><strong>Your spouse's birth country</strong> (if yours is not eligible)</span>
              </li>
              <li className="flex items-start space-x-2">
                <People size={16} color="#3B82F6" variant="Bold" className="mt-0.5 flex-shrink-0" />
                <span><strong>Either parent's birth country</strong> (if yours is not eligible)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Country Selection Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-purple-50 rounded-lg">
            <Global size={20} color="#7C3AED" variant="Bold" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Select Your Eligibility Country</h3>
            <p className="text-sm text-gray-600">Choose the country that makes you eligible for the DV Lottery</p>
          </div>
        </div>

        {/* Search functionality */}
        <div className="mb-6">
          <SearchInput
            placeholder="Search for a country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            label="Search Countries"
          />
        </div>

        {/* Country selection */}
        <div className="space-y-4">
          <CustomSelect
            label="Country of Eligibility *"
            placeholder="Select a country"
            options={countryOptions}
            value={personalInfo.eligibilityCountry || null}
            onChange={handleCountryChange}
          />

          {/* Show country groups for better navigation */}
          {searchTerm && filteredCountries.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Found {filteredCountries.length} countries:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {countryGroups.map(([region, countries]) => (
                  <div key={region} className="space-y-2">
                    <h5 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {region}
                    </h5>
                    <div className="space-y-1">
                      {countries.slice(0, 5).map(country => (
                        <button
                          key={country.code}
                          onClick={() => handleCountryChange(country.name)}
                          className="block w-full text-left text-sm text-gray-700 hover:text-purple-600 hover:bg-purple-50 px-2 py-1 rounded transition-colors"
                        >
                          {country.name}
                        </button>
                      ))}
                      {countries.length > 5 && (
                        <p className="text-xs text-gray-500 px-2">
                          +{countries.length - 5} more...
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alternative eligibility options (shown when country is not eligible) */}
      {showEligibilityOptions && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg flex-shrink-0">
              <Warning2 size={20} color="#D97706" variant="Bold" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-900 mb-3">
                {personalInfo.eligibilityCountry} is not eligible for the DV Lottery
              </h4>
              <p className="text-yellow-800 text-sm mb-4">
                Don't worry! You may still be eligible through your spouse or parents. 
                Select one of the following options:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="spouse-eligibility"
                    name="eligibility-type"
                    value="spouse"
                    checked={selectedEligibilityType === 'spouse'}
                    onChange={(e) => setSelectedEligibilityType(e.target.value as 'spouse')}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <label htmlFor="spouse-eligibility" className="text-sm text-yellow-800">
                    <strong>Claim eligibility through my spouse's birth country</strong>
                  </label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="parent-eligibility"
                    name="eligibility-type"
                    value="parent"
                    checked={selectedEligibilityType === 'parent'}
                    onChange={(e) => setSelectedEligibilityType(e.target.value as 'parent')}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <label htmlFor="parent-eligibility" className="text-sm text-yellow-800">
                    <strong>Claim eligibility through either parent's birth country</strong>
                  </label>
                </div>
              </div>

              {selectedEligibilityType !== 'birth' && (
                <div className="mt-4 p-4 bg-white border border-yellow-300 rounded-lg">
                  <p className="text-sm text-gray-700 mb-3">
                    {selectedEligibilityType === 'spouse' 
                      ? "Select your spouse's birth country:"
                      : "Select either parent's birth country:"
                    }
                  </p>
                  <CustomSelect
                    placeholder={`Select ${selectedEligibilityType === 'spouse' ? 'spouse' : 'parent'}'s birth country`}
                    options={countryOptions}
                    value={null}
                    onChange={(value) => {
                      if (value) {
                        handleCountryChange(value)
                        setShowEligibilityOptions(false)
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Selected country confirmation */}
      {personalInfo.eligibilityCountry && !ineligibleCountries.includes(personalInfo.eligibilityCountry) && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg flex-shrink-0">
              <TickCircle size={20} color="#16A34A" variant="Bold" />
            </div>
            <div>
              <h4 className="font-semibold text-green-900 mb-2">Country Confirmed</h4>
              <p className="text-green-800 text-sm mb-3">
                <strong>{personalInfo.eligibilityCountry}</strong> is eligible for the DV Lottery program. 
                You can proceed to the next step.
              </p>
              <div className="flex items-center space-x-2 text-green-700 text-sm">
                <TickCircle size={16} color="#16A34A" variant="Bold" />
                <span>This country qualifies you for the DV Lottery</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Eligibility rules and important information */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
            <InfoCircle size={20} color="#3B82F6" variant="Bold" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Important Eligibility Rules</h3>
            <p className="text-sm text-gray-600">Understanding the DV Lottery eligibility requirements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Eligible countries info */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">✅ Countries WITH high DV Lottery rates</h4>
            <div className="text-sm text-gray-600 space-y-2">
              <p>These countries typically have good chances:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Most African countries</li>
                <li>Most European countries</li>
                <li>Many Asian countries</li>
                <li>Some South American countries</li>
                <li>Oceania countries</li>
              </ul>
            </div>
          </div>

          {/* Ineligible countries info */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">❌ Countries NOT eligible</h4>
            <div className="text-sm text-gray-600 space-y-2">
              <p>These countries cannot participate:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Bangladesh, Brazil, Canada</li>
                <li>China, Colombia, Dominican Republic</li>
                <li>El Salvador, Haiti, Honduras</li>
                <li>India, Jamaica, Mexico</li>
                <li>Nigeria, Pakistan, Philippines</li>
                <li>South Korea, UK, USA, Vietnam</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Alternative eligibility explanation */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg flex-shrink-0">
            <People size={20} color="#7C3AED" variant="Bold" />
          </div>
          <div>
            <h4 className="font-semibold text-purple-900 mb-3">Alternative Eligibility Options</h4>
            <div className="space-y-4 text-purple-800 text-sm">
              <div>
                <h5 className="font-medium mb-2">Through Your Spouse:</h5>
                <p>If you're married and your birth country is not eligible, you can claim eligibility through your spouse's birth country (if eligible). Both you and your spouse must be named on the application.</p>
              </div>
              
              <div>
                <h5 className="font-medium mb-2">Through Your Parents:</h5>
                <p>If your birth country is not eligible, you can claim eligibility through either parent's birth country (if eligible). This applies even if you were not born in that country or have never lived there.</p>
              </div>

              <div className="bg-white border border-purple-200 rounded-lg p-4 mt-4">
                <h5 className="font-medium text-purple-900 mb-2">⚠️ Important Notes:</h5>
                <ul className="space-y-1">
                  <li>• You can only claim ONE country of eligibility per application</li>
                  <li>• You must be able to prove your connection to the country if selected</li>
                  <li>• Birth certificates or other official documents may be required</li>
                  <li>• Choose the strongest eligibility option available to you</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Regional statistics (optional enhancement) */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg">
            <SearchNormal1 size={20} color="#16A34A" variant="Bold" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">DV-2026 Regional Allocation</h3>
            <p className="text-sm text-gray-600">Understanding your chances by region</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { region: 'Africa', visas: '23,400', percentage: '46.8%' },
            { region: 'Asia', visas: '8,150', percentage: '16.3%' },
            { region: 'Europe', visas: '12,050', percentage: '24.1%' },
            { region: 'North America', visas: '3,500', percentage: '7.0%' },
            { region: 'Oceania', visas: '1,000', percentage: '2.0%' },
            { region: 'South America', visas: '1,900', percentage: '3.8%' }
          ].map((region) => (
            <div key={region.region} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{region.region}</h4>
              <div className="text-sm text-gray-600">
                <p><strong>{region.visas}</strong> visas</p>
                <p>{region.percentage} of total</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> These numbers represent the maximum visas available by region. 
            Actual selection rates depend on the number of qualified entries from each country.
          </p>
        </div>
      </div>

      {/* Step completion status */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
            isCompleted ? 'bg-green-50' : 'bg-yellow-50'
          }`}>
            {isCompleted ? (
              <TickCircle size={20} color="#16A34A" variant="Bold" />
            ) : (
              <Warning2 size={20} color="#D97706" variant="Bold" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Step Status</h3>
            <p className="text-sm text-gray-600">
              {isCompleted 
                ? 'Eligibility country confirmed! You can proceed to the next step.' 
                : 'Please select a valid eligibility country to continue.'
              }
            </p>
          </div>
        </div>

        {!isCompleted && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">To complete this step:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span>Select a country that is eligible for the DV Lottery</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span>Ensure you have a valid connection to that country</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span>Verify the country appears in the confirmation section</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}