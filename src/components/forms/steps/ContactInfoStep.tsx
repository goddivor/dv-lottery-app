/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/forms/steps/ContactInfoStep.tsx

import React, { useState } from "react";
import { type FormStepProps } from "@/types/dv-lottery";
import { useDVLotteryStore } from "@/hooks/useDVLotteryStore";
import { Input } from "@/components/forms/Input";
import { CustomSelect } from "@/components/forms/custom-select";
import {
  Call,
  Sms,
  InfoCircle,
  TickCircle,
  Warning2,
  Global,
  Profile2User,
  Mobile,
  SecuritySafe,
} from "iconsax-react";

// Common country calling codes
const COUNTRY_CODES = [
  { value: "+1", label: "+1 (US/Canada)", country: "United States" },
  { value: "+33", label: "+33 (France)", country: "France" },
  { value: "+49", label: "+49 (Germany)", country: "Germany" },
  { value: "+44", label: "+44 (UK)", country: "United Kingdom" },
  { value: "+228", label: "+228 (Togo)", country: "Togo" },
  { value: "+234", label: "+234 (Nigeria)", country: "Nigeria" },
  { value: "+233", label: "+233 (Ghana)", country: "Ghana" },
  { value: "+212", label: "+212 (Morocco)", country: "Morocco" },
  { value: "+91", label: "+91 (India)", country: "India" },
  { value: "+86", label: "+86 (China)", country: "China" },
  { value: "+81", label: "+81 (Japan)", country: "Japan" },
  { value: "+82", label: "+82 (South Korea)", country: "South Korea" },
  { value: "+61", label: "+61 (Australia)", country: "Australia" },
  { value: "+55", label: "+55 (Brazil)", country: "Brazil" },
  { value: "+52", label: "+52 (Mexico)", country: "Mexico" },
  { value: "+27", label: "+27 (South Africa)", country: "South Africa" },
  { value: "+20", label: "+20 (Egypt)", country: "Egypt" },
  { value: "+90", label: "+90 (Turkey)", country: "Turkey" },
  { value: "+7", label: "+7 (Russia)", country: "Russia" },
  { value: "+39", label: "+39 (Italy)", country: "Italy" },
  { value: "+34", label: "+34 (Spain)", country: "Spain" },
  { value: "+31", label: "+31 (Netherlands)", country: "Netherlands" },
  { value: "+46", label: "+46 (Sweden)", country: "Sweden" },
  { value: "+47", label: "+47 (Norway)", country: "Norway" },
  { value: "+41", label: "+41 (Switzerland)", country: "Switzerland" },
  { value: "+43", label: "+43 (Austria)", country: "Austria" },
  { value: "+32", label: "+32 (Belgium)", country: "Belgium" },
  { value: "+45", label: "+45 (Denmark)", country: "Denmark" },
  { value: "+358", label: "+358 (Finland)", country: "Finland" },
  { value: "+351", label: "+351 (Portugal)", country: "Portugal" },
  { value: "+30", label: "+30 (Greece)", country: "Greece" },
  { value: "+48", label: "+48 (Poland)", country: "Poland" },
  { value: "+420", label: "+420 (Czech Republic)", country: "Czech Republic" },
  { value: "+36", label: "+36 (Hungary)", country: "Hungary" },
  { value: "+40", label: "+40 (Romania)", country: "Romania" },
  { value: "+359", label: "+359 (Bulgaria)", country: "Bulgaria" },
  { value: "+385", label: "+385 (Croatia)", country: "Croatia" },
  { value: "+381", label: "+381 (Serbia)", country: "Serbia" },
  { value: "+380", label: "+380 (Ukraine)", country: "Ukraine" },
];

export const ContactInfoStep: React.FC<FormStepProps> = ({ data }) => {
  const { updateAddressInfo, setValidationErrors, clearValidationErrors } =
    useDVLotteryStore();
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");

  const addressInfo = data.addressInfo || {};

  const handleInputChange =
    (field: keyof typeof addressInfo) => (value: string) => {
      updateAddressInfo({ [field]: value });
      clearValidationErrors(`addressInfo.${field}`);
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
      const phoneRegex = /^[\d\s\-\(\)]+$/;
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

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    const fullPhone = countryCode + " " + value;
    handleInputChange("phoneNumber")(fullPhone);
  };

  const handleCountryCodeChange = (code: string | null) => {
    if (code) {
      setCountryCode(code);
      const fullPhone = code + " " + phoneNumber;
      handleInputChange("phoneNumber")(fullPhone);
    }
  };

  // Calculate completion percentage
  const requiredFields = ["email"];
  const optionalFields = ["phoneNumber"];
  const allFields = [...requiredFields, ...optionalFields];
  
  const completedRequired = requiredFields.filter(
    (field) => addressInfo[field as keyof typeof addressInfo]
  );
  const completedOptional = optionalFields.filter(
    (field) => addressInfo[field as keyof typeof addressInfo]
  );
  
  const requiredCompletionPercentage = Math.round(
    (completedRequired.length / requiredFields.length) * 100
  );
  const totalCompletionPercentage = Math.round(
    ((completedRequired.length + completedOptional.length) / allFields.length) * 100
  );

  return (
    <div className="space-y-8">
      {/* Progress indicator for this step */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
              <Call size={24} color="white" variant="Bold" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Contact Information
              </h3>
              <p className="text-gray-600">
                Phone and email for important communications
              </p>
            </div>
          </div>

          {/* Completion indicator */}
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {totalCompletionPercentage}%
            </div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 transition-all duration-500 ease-out"
            style={{ width: `${totalCompletionPercentage}%` }}
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
            <h4 className="font-semibold text-amber-900 mb-2">
              Contact Requirements
            </h4>
            <ul className="text-amber-800 text-sm space-y-2">
              <li className="flex items-start space-x-2">
                <TickCircle
                  size={16}
                  color="#D97706"
                  variant="Bold"
                  className="mt-0.5 flex-shrink-0"
                />
                <span>
                  <strong>Email is required</strong> - you must have reliable access for 2+ years
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <TickCircle
                  size={16}
                  color="#D97706"
                  variant="Bold"
                  className="mt-0.5 flex-shrink-0"
                />
                <span>
                  <strong>Phone is optional</strong> but recommended for urgent communications
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <TickCircle
                  size={16}
                  color="#D97706"
                  variant="Bold"
                  className="mt-0.5 flex-shrink-0"
                />
                <span>
                  All contact info will be used for <strong>official DV Lottery communications</strong>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Email Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
            <Sms size={20} color="#3B82F6" variant="Bold" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Email Address
            </h3>
            <p className="text-sm text-gray-600">
              Primary method for official communications
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Email Address *"
            type="email"
            placeholder="your.email@example.com"
            value={addressInfo.email || ""}
            onChange={(e) => handleInputChange("email")(e.target.value)}
            onBlur={(e) => validateEmail(e.target.value)}
          />
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Email Requirements:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Must be active and accessible for 2+ years</li>
              <li>• Check spam/junk folders regularly</li>
              <li>• Use a reliable email provider</li>
              <li>• Avoid temporary or disposable email addresses</li>
              <li>• This email will receive your confirmation number if selected</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Phone Number Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg">
            <Mobile size={20} color="#16A34A" variant="Bold" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Phone Number (Optional)
            </h3>
            <p className="text-sm text-gray-600">
              For urgent communications and verification
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <CustomSelect
                label="Country Code"
                placeholder="Select code"
                options={COUNTRY_CODES}
                value={countryCode}
                onChange={handleCountryCodeChange}
              />
            </div>
            
            <div className="md:col-span-2">
              <Input
                label="Phone Number"
                placeholder="555-123-4567"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                onBlur={() => validatePhoneNumber(addressInfo.phoneNumber || "")}
              />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Phone Number Tips:</h4>
            <ul className="text-green-800 text-sm space-y-1">
              <li>• Include your country code for international numbers</li>
              <li>• Use a number where you can be reached reliably</li>
              <li>• Mobile numbers are preferred over landlines</li>
              <li>• This may be used for urgent visa-related communications</li>
            </ul>
          </div>

          {/* Phone preview */}
          {(countryCode || phoneNumber) && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">Full number preview:</p>
              <p className="font-medium text-gray-900">
                {countryCode} {phoneNumber}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Current Residence Country */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-purple-50 rounded-lg">
            <Global size={20} color="#7C3AED" variant="Bold" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Current Residence
            </h3>
            <p className="text-sm text-gray-600">
              Country where you currently live
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* This will be populated from the address info automatically */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <InfoCircle size={16} color="#3B82F6" variant="Bold" />
              <span className="font-medium text-blue-900">Auto-populated from your address</span>
            </div>
            <p className="text-blue-800 text-sm">
              Your current residence country will be automatically set based on the country you selected in your mailing address. 
              If you live in a different country from where you receive mail, you'll be able to specify that separately.
            </p>
          </div>

          {data.addressInfo?.country && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Current residence country:</p>
              <p className="font-medium text-gray-900 text-lg">
                {data.addressInfo.country}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Preview */}
      {(addressInfo.email || addressInfo.phoneNumber) && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-lg">
              <Profile2User size={20} color="#059669" variant="Bold" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Contact Information Summary
              </h3>
              <p className="text-sm text-gray-600">
                How we'll reach you for important updates
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-emerald-200">
            <div className="space-y-3">
              {addressInfo.email && (
                <div className="flex items-center space-x-3">
                  <Sms size={18} color="#059669" variant="Bold" />
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="font-medium text-gray-900">{addressInfo.email}</p>
                  </div>
                </div>
              )}
              
              {addressInfo.phoneNumber && (
                <div className="flex items-center space-x-3">
                  <Call size={18} color="#059669" variant="Bold" />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium text-gray-900">{addressInfo.phoneNumber}</p>
                  </div>
                </div>
              )}

              {data.addressInfo?.country && (
                <div className="flex items-center space-x-3">
                  <Global size={18} color="#059669" variant="Bold" />
                  <div>
                    <p className="text-sm text-gray-600">Current Residence</p>
                    <p className="font-medium text-gray-900">{data.addressInfo.country}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg flex-shrink-0">
            <SecuritySafe size={20} color="#7C3AED" variant="Bold" />
          </div>
          <div>
            <h4 className="font-semibold text-purple-900 mb-2">
              Privacy & Security
            </h4>
            <div className="space-y-2 text-purple-800 text-sm">
              <p>Your contact information is:</p>
              <ul className="space-y-1 ml-4">
                <li>• Encrypted and stored securely</li>
                <li>• Used only for official DV Lottery communications</li>
                <li>• Never shared with third parties</li>
                <li>• Required by U.S. immigration authorities</li>
                <li>• Protected under privacy laws and regulations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-lg ${
              requiredCompletionPercentage === 100 ? "bg-green-50" : "bg-yellow-50"
            }`}
          >
            {requiredCompletionPercentage === 100 ? (
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
              {requiredCompletionPercentage === 100
                ? "Contact information completed! You can proceed to the next step."
                : "Please complete the required email field to continue."}
            </p>
          </div>
        </div>

        {/* Fields checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            className={`flex items-center space-x-3 p-3 rounded-lg ${
              addressInfo.email
                ? "bg-green-50 border border-green-200"
                : "bg-white border border-gray-200"
            }`}
          >
            {addressInfo.email ? (
              <TickCircle size={16} color="#16A34A" variant="Bold" />
            ) : (
              <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
            )}
            <span
              className={`text-sm ${
                addressInfo.email ? "text-green-800 font-medium" : "text-gray-600"
              }`}
            >
              Email Address (Required)
            </span>
          </div>

          <div
            className={`flex items-center space-x-3 p-3 rounded-lg ${
              addressInfo.phoneNumber
                ? "bg-green-50 border border-green-200"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            {addressInfo.phoneNumber ? (
              <TickCircle size={16} color="#16A34A" variant="Bold" />
            ) : (
              <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
            )}
            <span
              className={`text-sm ${
                addressInfo.phoneNumber ? "text-green-800 font-medium" : "text-gray-600"
              }`}
            >
              Phone Number (Optional)
            </span>
          </div>
        </div>

        {/* Progress summary */}
        <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Required fields:</span>
            <span className={`font-medium ${
              requiredCompletionPercentage === 100 ? 'text-green-600' : 'text-orange-600'
            }`}>
              {completedRequired.length}/{requiredFields.length} completed
            </span>
          </div>
          <div className="flex justify-between items-center text-sm mt-1">
            <span className="text-gray-600">Optional fields:</span>
            <span className="font-medium text-blue-600">
              {completedOptional.length}/{optionalFields.length} completed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};