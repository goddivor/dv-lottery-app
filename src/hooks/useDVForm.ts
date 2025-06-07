/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useDVForm.ts

import { useState, useEffect, useCallback } from 'react'
import { Gender, EducationLevel, MaritalStatus } from '@/types/dv-lottery'

export interface DVFormData {
  // Personal Info
  lastName: string
  firstName: string
  middleName: string
  gender: Gender | ''
  dateOfBirth: string
  cityOfBirth: string
  countryOfBirth: string
  eligibilityCountry: string
  
  // Address
  addressLine1: string
  addressLine2: string
  city: string
  stateProvince: string
  postalCode: string
  country: string
  
  // Contact
  email: string
  phoneNumber: string
  
  // Education & Family
  educationLevel: EducationLevel | ''
  maritalStatus: MaritalStatus | ''
  numberOfChildren: number
  
  // Photo
  photo: File | null
  
  // Metadata
  lastSaved: string
  completionPercentage: number
}

const STORAGE_KEY = 'dv-lottery-form-data'

const initialFormData: DVFormData = {
  lastName: '',
  firstName: '',
  middleName: '',
  gender: '',
  dateOfBirth: '',
  cityOfBirth: '',
  countryOfBirth: '',
  eligibilityCountry: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  stateProvince: '',
  postalCode: '',
  country: '',
  email: '',
  phoneNumber: '',
  educationLevel: '',
  maritalStatus: '',
  numberOfChildren: 0,
  photo: null,
  lastSaved: '',
  completionPercentage: 0
}

export const useDVForm = () => {
  const [formData, setFormData] = useState<DVFormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(true)

  // Load data from localStorage on mount - SIMPLIFIED
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsedData = JSON.parse(saved)
        setFormData({ ...parsedData, photo: null }) // Photo cannot be serialized
      }
    } catch (error) {
      console.error('Failed to load saved form data:', error)
    }
    setIsLoading(false) // Always set loading to false
  }, []) // Empty dependency array

  // Calculate completion percentage
  const calculateCompletion = useCallback((data: DVFormData): number => {
    const requiredFields = [
      'lastName', 'firstName', 'gender', 'dateOfBirth', 'cityOfBirth',
      'countryOfBirth', 'eligibilityCountry', 'addressLine1', 'city',
      'stateProvince', 'postalCode', 'country', 'email', 'educationLevel',
      'maritalStatus'
    ]
    
    const completedFields = requiredFields.filter(field => {
      const value = data[field as keyof DVFormData]
      return value !== '' && value !== null && value !== undefined
    })
    
    return Math.round((completedFields.length / requiredFields.length) * 100)
  }, [])

  // Save to localStorage - SIMPLIFIED
  const saveToLocal = useCallback(() => {
    try {
      const dataToSave = {
        ...formData,
        photo: null, // Don't save file objects
        lastSaved: new Date().toISOString(),
        completionPercentage: calculateCompletion(formData)
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Failed to save form data:', error)
    }
  }, [formData, calculateCompletion])

  // Update form data - SIMPLIFIED
  const updateField = useCallback((field: keyof DVFormData) => (value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormData)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
    }
  }, [])

  // Export data for submission
  const exportData = useCallback(() => {
    const exportData = {
      ...formData,
      photoInfo: formData.photo ? {
        name: formData.photo.name,
        size: formData.photo.size,
        type: formData.photo.type
      } : null,
      exportedAt: new Date().toISOString()
    }
    
    console.log('DV Lottery Application Data:', exportData)
    return exportData
  }, [formData])

  // Validate required fields
  const validateForm = useCallback((): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []
    
    if (!formData.lastName.trim()) errors.push('Last name is required')
    if (!formData.firstName.trim()) errors.push('First name is required')
    if (!formData.gender) errors.push('Gender is required')
    if (!formData.dateOfBirth) errors.push('Date of birth is required')
    if (!formData.cityOfBirth.trim()) errors.push('City of birth is required')
    if (!formData.countryOfBirth.trim()) errors.push('Country of birth is required')
    if (!formData.eligibilityCountry.trim()) errors.push('Eligibility country is required')
    if (!formData.addressLine1.trim()) errors.push('Address is required')
    if (!formData.city.trim()) errors.push('City is required')
    if (!formData.stateProvince.trim()) errors.push('State/Province is required')
    if (!formData.postalCode.trim()) errors.push('Postal code is required')
    if (!formData.country.trim()) errors.push('Country is required')
    if (!formData.email.trim()) errors.push('Email is required')
    if (!formData.educationLevel) errors.push('Education level is required')
    if (!formData.maritalStatus) errors.push('Marital status is required')
    
    // Age validation
    if (formData.dateOfBirth) {
      const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear()
      if (age < 18) errors.push('Must be at least 18 years old')
    }
    
    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Invalid email format')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }, [formData])

  const completionPercentage = calculateCompletion(formData)

  return {
    formData,
    isLoading,
    updateField,
    resetForm,
    exportData,
    validateForm,
    saveToLocal,
    completionPercentage
  }
}