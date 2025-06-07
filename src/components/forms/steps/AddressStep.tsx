/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/forms/steps/AddressStep.tsx

import React, { useState, useMemo } from "react";
import { type FormStepProps } from "@/types/dv-lottery";
import { useDVLotteryStore } from "@/hooks/useDVLotteryStore";
import { Input } from "@/components/forms/Input";
import { CustomSelect } from "@/components/forms/custom-select";
import { SearchInput } from "@/components/forms/search-input";
import {
  Home2,
  Location,
  InfoCircle,
  TickCircle,
  Warning2,
  Global,
  Map1,
  Sms,
  Profile2User,
} from "iconsax-react";

// Mock countries data - in real app, this would come from an API
const COUNTRIES = [
  { value: "Afghanistan", label: "Afghanistan", code: "AF" },
  { value: "Albania", label: "Albania", code: "AL" },
  { value: "Algeria", label: "Algeria", code: "DZ" },
  { value: "Argentina", label: "Argentina", code: "AR" },
  { value: "Australia", label: "Australia", code: "AU" },
  { value: "Austria", label: "Austria", code: "AT" },
  { value: "Bangladesh", label: "Bangladesh", code: "BD" },
  { value: "Belgium", label: "Belgium", code: "BE" },
  { value: "Brazil", label: "Brazil", code: "BR" },
  { value: "Canada", label: "Canada", code: "CA" },
  { value: "China", label: "China", code: "CN" },
  { value: "Colombia", label: "Colombia", code: "CO" },
  { value: "Denmark", label: "Denmark", code: "DK" },
  { value: "Egypt", label: "Egypt", code: "EG" },
  { value: "Ethiopia", label: "Ethiopia", code: "ET" },
  { value: "France", label: "France", code: "FR" },
  { value: "Germany", label: "Germany", code: "DE" },
  { value: "Ghana", label: "Ghana", code: "GH" },
  { value: "India", label: "India", code: "IN" },
  { value: "Indonesia", label: "Indonesia", code: "ID" },
  { value: "Iran", label: "Iran", code: "IR" },
  { value: "Iraq", label: "Iraq", code: "IQ" },
  { value: "Italy", label: "Italy", code: "IT" },
  { value: "Japan", label: "Japan", code: "JP" },
  { value: "Kenya", label: "Kenya", code: "KE" },
  { value: "Mexico", label: "Mexico", code: "MX" },
  { value: "Morocco", label: "Morocco", code: "MA" },
  { value: "Nepal", label: "Nepal", code: "NP" },
  { value: "Netherlands", label: "Netherlands", code: "NL" },
  { value: "Nigeria", label: "Nigeria", code: "NG" },
  { value: "Pakistan", label: "Pakistan", code: "PK" },
  { value: "Peru", label: "Peru", code: "PE" },
  { value: "Philippines", label: "Philippines", code: "PH" },
  { value: "Poland", label: "Poland", code: "PL" },
  { value: "Russia", label: "Russia", code: "RU" },
  { value: "South Africa", label: "South Africa", code: "ZA" },
  { value: "South Korea", label: "South Korea", code: "KR" },
  { value: "Spain", label: "Spain", code: "ES" },
  { value: "Sri Lanka", label: "Sri Lanka", code: "LK" },
  { value: "Tanzania", label: "Tanzania", code: "TZ" },
  { value: "Thailand", label: "Thailand", code: "TH" },
  { value: "Togo", label: "Togo", code: "TG" },
  { value: "Turkey", label: "Turkey", code: "TR" },
  { value: "Uganda", label: "Uganda", code: "UG" },
  { value: "Ukraine", label: "Ukraine", code: "UA" },
  { value: "United Kingdom", label: "United Kingdom", code: "GB" },
  { value: "United States", label: "United States", code: "US" },
  { value: "Venezuela", label: "Venezuela", code: "VE" },
  { value: "Vietnam", label: "Vietnam", code: "VN" },
  { value: "Yemen", label: "Yemen", code: "YE" },
  { value: "Zambia", label: "Zambia", code: "ZM" },
];

// Common postal code formats by country
const POSTAL_CODE_FORMATS: Record<string, { format: string; example: string }> =
  {
    "United States": { format: "12345 or 12345-6789", example: "10001" },
    Canada: { format: "A1A 1A1", example: "K1A 0A6" },
    "United Kingdom": { format: "AA11 1AA", example: "SW1A 1AA" },
    Germany: { format: "12345", example: "10115" },
    France: { format: "12345", example: "75001" },
    Togo: { format: "No postal code required", example: "N/A" },
    Nigeria: { format: "123456", example: "100001" },
    Ghana: { format: "GA-123-4567", example: "GA-123-4567" },
    Morocco: { format: "12345", example: "10000" },
  };

export const AddressStep: React.FC<FormStepProps> = ({ data }) => {
  const { updateAddressInfo, setValidationErrors, clearValidationErrors } =
    useDVLotteryStore();
  const [countrySearch, setCountrySearch] = useState("");

  const addressInfo = data.addressInfo || {};

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return COUNTRIES;
    return COUNTRIES.filter((country) =>
      country.label.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countrySearch]);

  const countryOptions = filteredCountries.map((country) => ({
    value: country.value,
    label: country.label,
  }));

  const handleInputChange =
    (field: keyof typeof addressInfo) => (value: string) => {
      updateAddressInfo({ [field]: value });
      clearValidationErrors(`addressInfo.${field}`);
    };

  const validateField = (field: string, value: any, label: string) => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      setValidationErrors(`addressInfo.${field}`, [
        {
          field,
          message: `${label} is required`,
          type: "required",
        },
      ]);
      return false;
    }
    clearValidationErrors(`addressInfo.${field}`);
    return true;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setValidationErrors("addressInfo.email", [
        {
          field: "email",
          message: "Email address is required",
          type: "required",
        },
      ]);
      return false;
    }
    if (!emailRegex.test(email)) {
      setValidationErrors("addressInfo.email", [
        {
          field: "email",
          message: "Please enter a valid email address",
          type: "format",
        },
      ]);
      return false;
    }
    clearValidationErrors("addressInfo.email");
    return true;
  };

  const validatePhoneNumber = (phone: string) => {
    if (phone && phone.trim()) {
      const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(phone)) {
        setValidationErrors("addressInfo.phoneNumber", [
          {
            field: "phoneNumber",
            message: "Please enter a valid phone number",
            type: "format",
          },
        ]);
        return false;
      }
    }
    clearValidationErrors("addressInfo.phoneNumber");
    return true;
  };

  // Calculate completion percentage
  const requiredFields = [
    "addressLine1",
    "city",
    "stateProvince",
    "postalCode",
    "country",
    "email",
  ];
  const completedFields = requiredFields.filter(
    (field) => addressInfo[field as keyof typeof addressInfo]
  );
  const completionPercentage = Math.round(
    (completedFields.length / requiredFields.length) * 100
  );

  // Get postal code format for selected country
  const selectedCountryFormat = addressInfo.country
    ? POSTAL_CODE_FORMATS[addressInfo.country]
    : null;

  return (
    <div className="space-y-8">
      {/* Progress indicator for this step */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
              <Home2 size={24} color="white" variant="Bold" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Mailing Address
              </h3>
              <p className="text-gray-600">
                Where you can receive official correspondence
              </p>
            </div>
          </div>

          {/* Completion indicator */}
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">
              {completionPercentage}%
            </div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
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
            <h4 className="font-semibold text-blue-900 mb-2">
              Address Requirements
            </h4>
            <ul className="text-blue-800 text-sm space-y-2">
              <li className="flex items-start space-x-2">
                <TickCircle
                  size={16}
                  color="#3B82F6"
                  variant="Bold"
                  className="mt-0.5 flex-shrink-0"
                />
                <span>
                  Use your <strong>current mailing address</strong> where you
                  can receive mail
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <TickCircle
                  size={16}
                  color="#3B82F6"
                  variant="Bold"
                  className="mt-0.5 flex-shrink-0"
                />
                <span>
                  This address will be used for{" "}
                  <strong>all official communication</strong>
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <TickCircle
                  size={16}
                  color="#3B82F6"
                  variant="Bold"
                  className="mt-0.5 flex-shrink-0"
                />
                <span>
                  Ensure you have <strong>reliable access</strong> to this
                  address for at least 2 years
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Address Form */}
      <div className="space-y-8">
        {/* Primary Address Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-50 rounded-lg">
              <Location size={20} color="#EA580C" variant="Bold" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Mailing Address
              </h3>
              <p className="text-sm text-gray-600">
                Complete postal address where you receive mail
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* In Care Of (Optional) */}
            <div>
              <Input
                label="In Care Of (Optional)"
                placeholder="Person or organization name (if applicable)"
                value={addressInfo.inCareOf || ""}
                onChange={(e) => handleInputChange("inCareOf")(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                <InfoCircle size={12} color="#6B7280" variant="Outline" />
                <span>
                  Only fill this if mail should be addressed to someone else
                  first
                </span>
              </p>
            </div>

            {/* Address Lines */}
            <div className="grid grid-cols-1 gap-6">
              <Input
                label="Address Line 1 *"
                placeholder="Street number and name"
                value={addressInfo.addressLine1 || ""}
                onChange={(e) =>
                  handleInputChange("addressLine1")(e.target.value)
                }
                onBlur={(e) =>
                  validateField(
                    "addressLine1",
                    e.target.value,
                    "Address Line 1"
                  )
                }
              />

              <Input
                label="Address Line 2"
                placeholder="Apartment, suite, unit, building, floor, etc. (optional)"
                value={addressInfo.addressLine2 || ""}
                onChange={(e) =>
                  handleInputChange("addressLine2")(e.target.value)
                }
              />
            </div>

            {/* City, State, Postal Code */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="City *"
                placeholder="City name"
                value={addressInfo.city || ""}
                onChange={(e) => handleInputChange("city")(e.target.value)}
                onBlur={(e) => validateField("city", e.target.value, "City")}
              />

              <Input
                label="State/Province/Region *"
                placeholder="State, province, or region"
                value={addressInfo.stateProvince || ""}
                onChange={(e) =>
                  handleInputChange("stateProvince")(e.target.value)
                }
                onBlur={(e) =>
                  validateField(
                    "stateProvince",
                    e.target.value,
                    "State/Province"
                  )
                }
              />

              <div>
                <Input
                  label="Postal/ZIP Code *"
                  placeholder={selectedCountryFormat?.example || "Postal code"}
                  value={addressInfo.postalCode || ""}
                  onChange={(e) =>
                    handleInputChange("postalCode")(e.target.value)
                  }
                  onBlur={(e) =>
                    validateField("postalCode", e.target.value, "Postal code")
                  }
                />
                {selectedCountryFormat && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                    <InfoCircle size={12} color="#6B7280" variant="Outline" />
                    <span>Format: {selectedCountryFormat.format}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Country Selection */}
            <div>
              <CustomSelect
                label="Country *"
                placeholder="Select your country"
                options={countryOptions}
                value={addressInfo.country || null}
                onChange={(value) =>
                  handleInputChange("country")(value as string)
                }
              />

              {/* Country search */}
              <div className="mt-3">
                <SearchInput
                  placeholder="Search countries..."
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  onClear={() => setCountrySearch("")}
                  showSearchIcon={true}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
              <Sms size={20} color="#3B82F6" variant="Bold" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Contact Information
              </h3>
              <p className="text-sm text-gray-600">
                Phone and email for important communications
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Email Address *"
                type="email"
                placeholder="your.email@example.com"
                value={addressInfo.email || ""}
                onChange={(e) => handleInputChange("email")(e.target.value)}
                onBlur={(e) => validateEmail(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                <InfoCircle size={12} color="#6B7280" variant="Outline" />
                <span>
                  You must have access to this email for the next 2+ years
                </span>
              </p>
            </div>

            <div>
              <Input
                label="Phone Number (Optional)"
                placeholder="+1 555-123-4567"
                value={addressInfo.phoneNumber || ""}
                onChange={(e) =>
                  handleInputChange("phoneNumber")(e.target.value)
                }
                onBlur={(e) => validatePhoneNumber(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                <InfoCircle size={12} color="#6B7280" variant="Outline" />
                <span>Include country code for international numbers</span>
              </p>
            </div>
          </div>
        </div>

        {/* Address Preview */}
        {(addressInfo.addressLine1 ||
          addressInfo.city ||
          addressInfo.country) && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                <Map1 size={20} color="#059669" variant="Bold" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Address Preview
                </h3>
                <p className="text-sm text-gray-600">
                  How your address will appear
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="space-y-1 text-sm">
                {addressInfo.inCareOf && (
                  <div className="text-gray-700">
                    c/o {addressInfo.inCareOf}
                  </div>
                )}
                {addressInfo.addressLine1 && (
                  <div className="font-medium text-gray-900">
                    {addressInfo.addressLine1}
                  </div>
                )}
                {addressInfo.addressLine2 && (
                  <div className="text-gray-700">
                    {addressInfo.addressLine2}
                  </div>
                )}
                <div className="text-gray-900">
                  {[
                    addressInfo.city,
                    addressInfo.stateProvince,
                    addressInfo.postalCode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </div>
                {addressInfo.country && (
                  <div className="font-medium text-gray-900">
                    {addressInfo.country}
                  </div>
                )}
                {addressInfo.email && (
                  <div className="text-blue-600 mt-2">
                    📧 {addressInfo.email}
                  </div>
                )}
                {addressInfo.phoneNumber && (
                  <div className="text-green-600">
                    📞 {addressInfo.phoneNumber}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Address Verification Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg flex-shrink-0">
              <Global size={20} color="#D97706" variant="Bold" />
            </div>
            <div>
              <h4 className="font-semibold text-yellow-900 mb-2">
                Address Verification Important
              </h4>
              <p className="text-yellow-800 text-sm mb-3">
                Please double-check your address carefully. If selected for a
                visa, official documents will be sent to this address.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-yellow-700">
                <div className="flex items-center space-x-2">
                  <TickCircle size={14} color="#D97706" variant="Bold" />
                  <span>Verify with postal service</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TickCircle size={14} color="#D97706" variant="Bold" />
                  <span>Check local address format</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TickCircle size={14} color="#D97706" variant="Bold" />
                  <span>Ensure mail delivery works</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TickCircle size={14} color="#D97706" variant="Bold" />
                  <span>Consider address stability</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Security Notice */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg flex-shrink-0">
              <Profile2User size={20} color="#7C3AED" variant="Bold" />
            </div>
            <div>
              <h4 className="font-semibold text-purple-900 mb-2">
                Privacy & Security
              </h4>
              <div className="space-y-2 text-purple-800 text-sm">
                <p>Your address information is:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Encrypted and stored securely</li>
                  <li>• Used only for official DV Lottery correspondence</li>
                  <li>• Never shared with third parties</li>
                  <li>• Required by U.S. immigration authorities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-lg ${
              completionPercentage === 100 ? "bg-green-50" : "bg-yellow-50"
            }`}
          >
            {completionPercentage === 100 ? (
              <TickCircle size={20} color="#16A34A" variant="Bold" />
            ) : (
              <Warning2 size={20} color="#D97706" variant="Bold" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Step Completion
            </h3>
            <p className="text-sm text-gray-600">
              {completionPercentage === 100
                ? "Address information completed! You can proceed to the next step."
                : `${completedFields.length} of ${requiredFields.length} required fields completed.`}
            </p>
          </div>
        </div>

        {/* Required fields checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { field: "addressLine1", label: "Address Line 1" },
            { field: "city", label: "City" },
            { field: "stateProvince", label: "State/Province" },
            { field: "postalCode", label: "Postal Code" },
            { field: "country", label: "Country" },
            { field: "email", label: "Email Address" },
          ].map(({ field, label }) => {
            const isCompleted =
              !!addressInfo[field as keyof typeof addressInfo];
            return (
              <div
                key={field}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  isCompleted
                    ? "bg-green-50 border border-green-200"
                    : "bg-white border border-gray-200"
                }`}
              >
                {isCompleted ? (
                  <TickCircle size={16} color="#16A34A" variant="Bold" />
                ) : (
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                )}
                <span
                  className={`text-sm ${
                    isCompleted ? "text-green-800 font-medium" : "text-gray-600"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
