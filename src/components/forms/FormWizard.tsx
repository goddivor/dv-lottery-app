/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/forms/FormWizard.tsx

import React, { useState } from 'react'
import { useDVLotteryStore } from '@/hooks/useDVLotteryStore'
import type { FormStep } from '@/types/dv-lottery'
import { ArrowLeft, ArrowRight, Save, ChevronDown } from 'lucide-react'
import { TickCircle, DocumentText1, Timer1 } from 'iconsax-react'

// Enhanced step indicator component with modern design
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
  const [showAllSteps, setShowAllSteps] = useState(false);
  
  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed'
    if (stepNumber === currentStep) return 'current'
    return 'pending'
  }

  const getStepsByCategory = () => {
    const categories = steps.reduce((acc, step, index) => {
      const category = step.category || 'General';
      if (!acc[category]) acc[category] = [];
      acc[category].push({ ...step, stepNumber: index + 1 });
      return acc;
    }, {} as Record<string, (FormStep & { stepNumber: number })[]>);
    return categories;
  }

  const categorizedSteps = getStepsByCategory();
  const visibleSteps = showAllSteps ? steps : steps.slice(Math.max(0, currentStep - 3), currentStep + 2);

  return (
    <div className="mb-8">
      {/* Mobile-friendly progress bar */}
      <div className="block lg:hidden mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / steps.length) * 100)}% Complete
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
        
        {/* Current step info */}
        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {(steps[currentStep - 1] as any)?.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {steps[currentStep - 1]?.title}
              </h3>
              <p className="text-sm text-gray-600">
                {steps[currentStep - 1]?.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop step indicator */}
      <div className="hidden lg:block">
        {/* Category-based step navigation */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          {Object.entries(categorizedSteps).map(([category, categorySteps]) => (
            <div key={category} className="relative">
              <div className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">
                {category}
              </div>
              <div className="space-y-2">
                {categorySteps.map((step) => {
                  const status = getStepStatus(step.stepNumber);
                  const canClick = canGoToStep(step.stepNumber);
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => canClick && onStepClick(step.stepNumber)}
                      disabled={!canClick}
                      className={`
                        w-full p-3 rounded-xl text-left transition-all duration-200 border-2
                        ${status === 'completed' 
                          ? 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100' 
                          : status === 'current' 
                          ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-sm' 
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }
                        ${canClick ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`
                          flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium
                          ${status === 'completed' 
                            ? 'bg-green-500 text-white' 
                            : status === 'current' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-300 text-gray-600'
                          }
                        `}>
                          {status === 'completed' ? (
                            <TickCircle size={16} color="white" variant="Bold" />
                          ) : (
                            step.stepNumber
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {step.title}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Traditional horizontal progress */}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            {visibleSteps.map((step, index) => {
              const actualStepNumber = showAllSteps ? index + 1 : Math.max(0, currentStep - 3) + index + 1;
              const status = getStepStatus(actualStepNumber);
              const canClick = canGoToStep(actualStepNumber);

              return (
                <div key={step.id} className="flex-1 relative flex items-center">
                  <button
                    onClick={() => canClick && onStepClick(actualStepNumber)}
                    disabled={!canClick}
                    className={`
                      relative w-12 h-12 rounded-full border-4 font-bold text-lg transition-all duration-300 z-10
                      ${status === 'completed' 
                        ? 'bg-green-500 border-green-500 text-white shadow-lg' 
                        : status === 'current' 
                        ? 'bg-blue-500 border-blue-500 text-white shadow-lg scale-110' 
                        : 'bg-white border-gray-300 text-gray-500'
                      }
                      ${canClick ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}
                    `}
                  >
                    {status === 'completed' ? (
                      <TickCircle size={20} color="white" variant="Bold" />
                    ) : (
                      actualStepNumber
                    )}
                  </button>
                  
                  {/* Connection line */}
                  {index < visibleSteps.length - 1 && (
                    <div 
                      className={`
                        flex-1 h-1 mx-2 transition-all duration-500
                        ${actualStepNumber < currentStep ? 'bg-green-500' : 'bg-gray-300'}
                      `}
                    />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Toggle to show all steps */}
          {steps.length > 5 && (
            <button
              onClick={() => setShowAllSteps(!showAllSteps)}
              className="flex items-center justify-center w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showAllSteps ? 'Show Less' : 'Show All Steps'}
              <ChevronDown 
                size={16} 
                className={`ml-1 transition-transform ${showAllSteps ? 'rotate-180' : ''}`} 
              />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Enhanced navigation buttons component
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
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-200">
      {/* Previous button */}
      <button
        onClick={onPrevious}
        disabled={isFirst || isLoading}
        className={`
          flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
          ${isFirst || isLoading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 focus:ring-4 focus:ring-gray-100'
          }
        `}
      >
        <ArrowLeft size={18} />
        <span>Previous</span>
      </button>

      {/* Middle section with save and progress info */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          type="button"
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
          onClick={() => {/* Save draft logic */}}
        >
          <Save size={16} />
          <span>Auto-saving...</span>
        </button>
        
        <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
          <Timer1 size={16} color="#6B7280" variant="Bold" />
          <span>Last saved: Just now</span>
        </div>
      </div>
      
      {/* Next/Submit button */}
      <button
        onClick={onNext}
        disabled={!isValid || isLoading}
        className={`
          flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 min-w-[140px] justify-center
          ${!isValid || isLoading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-100 shadow-lg hover:shadow-xl transform hover:scale-105'
          }
        `}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>{isLast ? 'Submit Application' : 'Continue'}</span>
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </div>
  )
}

// Main Form Wizard component with enhanced design
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
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
          <DocumentText1 size={32} color="#DC2626" variant="Bold" />
        </div>
        <h3 className="text-xl font-semibold text-red-600 mb-2">Step Not Found</h3>
        <p className="text-gray-600">There was an error loading this step. Please try refreshing the page.</p>
      </div>
    )
  }

  const StepComponent = currentStepData.component

  return (
    <div className={`max-w-6xl mx-auto ${className}`}>
      {/* Enhanced progress indicator */}
      <StepIndicator 
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        canGoToStep={canGoToStep}
      />

      {/* Current step content with enhanced styling */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Step header with gradient */}
        <div className="bg-gradient-to-r from-blue-50 via-white to-purple-50 p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              {currentStepData.icon || <DocumentText1 size={24} color="white" variant="Bold" />}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {currentStepData.title}
              </h2>
              <p className="text-gray-600">
                {currentStepData.description}
              </p>
            </div>
            <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Auto-save enabled</span>
              </div>
              <div className="text-gray-300">•</div>
              <span>Step {currentStep} of {totalSteps}</span>
            </div>
          </div>
        </div>

        {/* Step content with better spacing */}
        <div className="p-8 form-step min-h-[400px]">
          <StepComponent
            data={application}
            onDataChange={() => {}} // This will be implemented in each step component
            onNext={handleNext}
            onPrevious={previousStep}
            isFirst={currentStep === 1}
            isLast={currentStep === totalSteps}
          />
        </div>

        {/* Enhanced navigation section */}
        <div className="px-8 pb-6 bg-gray-50 border-t border-gray-100">
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

      {/* Enhanced status footer */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Progress Summary */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
              <DocumentText1 size={20} color="#3B82F6" variant="Bold" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Application Progress</div>
              <div className="text-xs text-gray-500">
                {Math.round((currentStep / totalSteps) * 100)}% completed
              </div>
            </div>
          </div>
        </div>

        {/* Validation Status */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
              currentStepData.isValid ? 'bg-green-50' : 'bg-yellow-50'
            }`}>
              <TickCircle 
                size={20} 
                color={currentStepData.isValid ? "#16A34A" : "#D97706"} 
                variant="Bold" 
              />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {currentStepData.isValid ? 'Step Complete' : 'In Progress'}
              </div>
              <div className="text-xs text-gray-500">
                {currentStepData.isValid ? 'Ready to continue' : 'Complete required fields'}
              </div>
            </div>
          </div>
        </div>

        {/* Last Saved */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-50 rounded-lg">
              <Timer1 size={20} color="#7C3AED" variant="Bold" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Auto-saved</div>
              <div className="text-xs text-gray-500">
                {application.lastSaved ? new Date(application.lastSaved).toLocaleTimeString() : 'Just now'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help section */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-lg flex-shrink-0">
            <DocumentText1 size={20} color="white" variant="Bold" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 text-sm mb-3">
              Having trouble with this step? Our step-by-step guide and support team are here to help you complete your application successfully.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium underline">
                View Step Guide
              </button>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium underline">
                Contact Support
              </button>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium underline">
                FAQ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}