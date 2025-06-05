// src/components/forms/FormWizard.tsx

import React from 'react'
import { useDVLotteryStore } from '@/hooks/useDVLotteryStore'
import type { FormStep } from '@/types/dv-lottery'

// Step indicator component
interface StepIndicatorProps {
  steps: FormStep[]
  currentStep: number
  onStepClick: (step: number) => void
  canGoToStep: (step: number) => boolean
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  steps, 
  currentStep, 
  onStepClick, 
  canGoToStep 
}) => {
  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed'
    if (stepNumber === currentStep) return 'current'
    return 'pending'
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const status = getStepStatus(stepNumber)
          const canClick = canGoToStep(stepNumber)

          return (
            <div key={step.id} className="flex-1 relative">
              {/* Step indicator */}
              <div className="flex items-center">
                <button
                  onClick={() => canClick && onStepClick(stepNumber)}
                  disabled={!canClick}
                  className={`
                    step-indicator ${status}
                    ${canClick ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}
                    transition-transform duration-200
                  `}
                >
                  {status === 'completed' ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </button>
                
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div 
                    className={`
                      flex-1 h-0.5 mx-2
                      ${stepNumber <= currentStep ? 'bg-primary-500' : 'bg-gray-300'}
                      transition-colors duration-300
                    `}
                  />
                )}
              </div>
              
              {/* Step label */}
              <div className="mt-2 text-center">
                <p className={`
                  text-xs font-medium
                  ${status === 'current' ? 'text-primary-600' : ''}
                  ${status === 'completed' ? 'text-primary-500' : ''}
                  ${status === 'pending' ? 'text-gray-500' : ''}
                `}>
                  {step.title}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Navigation buttons component
interface NavigationButtonsProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
  isValid: boolean
  isLoading: boolean
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isValid,
  isLoading
}) => {
  const isFirst = currentStep === 1
  const isLast = currentStep === totalSteps

  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
      <button
        onClick={onPrevious}
        disabled={isFirst || isLoading}
        className={`
          px-6 py-2 rounded-lg font-medium transition-all duration-200
          ${isFirst || isLoading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus-ring'
          }
        `}
      >
        Previous
      </button>

      <div className="flex space-x-3">
        <button
          type="button"
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          onClick={() => {/* Save draft logic */}}
        >
          Save Draft
        </button>
        
        <button
          onClick={onNext}
          disabled={!isValid || isLoading}
          className={`
            px-6 py-2 rounded-lg font-medium transition-all duration-200
            ${!isValid || isLoading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary-500 text-white hover:bg-primary-600 focus-ring'
            }
          `}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Processing...</span>
            </div>
          ) : isLast ? (
            'Submit Application'
          ) : (
            'Next'
          )}
        </button>
      </div>
    </div>
  )
}

// Main Form Wizard component
interface FormWizardProps {
  steps: FormStep[]
  className?: string
}

export const FormWizard: React.FC<FormWizardProps> = ({ steps, className = '' }) => {
  const {
    currentStep,
    totalSteps,
    goToStep,
    nextStep,
    previousStep,
    canGoToStep,
    application,
    isLoading,
    validateCurrentStep
  } = useDVLotteryStore()

  const currentStepData = steps.find(step => step.id === currentStep)
  
  const handleNext = async () => {
    const isStepValid = await validateCurrentStep()
    if (isStepValid) {
      nextStep()
    }
  }

  const handleStepClick = (step: number) => {
    if (canGoToStep(step)) {
      goToStep(step)
    }
  }

  if (!currentStepData) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error: Step not found</p>
      </div>
    )
  }

  const StepComponent = currentStepData.component

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          DV Lottery Application
        </h1>
        <p className="text-gray-600">
          Complete all sections accurately in English
        </p>
      </div>

      {/* Progress indicator */}
      <StepIndicator 
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        canGoToStep={canGoToStep}
      />

      {/* Current step content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600 mt-1">
            {currentStepData.description}
          </p>
        </div>

        <div className="p-6 form-step">
          <StepComponent
            data={application}
            onDataChange={() => {}} // This will be implemented in each step component
            onNext={handleNext}
            onPrevious={previousStep}
            isFirst={currentStep === 1}
            isLast={currentStep === totalSteps}
          />
        </div>

        {/* Navigation buttons */}
        <div className="px-6 pb-6">
          <NavigationButtons
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={handleNext}
            onPrevious={previousStep}
            isValid={currentStepData.isValid}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Application status indicator */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Step {currentStep} of {totalSteps} • 
          {/* Last saved: {application.lastSaved.toLocaleDateString()} */}
        </p>
      </div>
    </div>
  )
}