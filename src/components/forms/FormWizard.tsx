// src/components/forms/FormWizard.tsx - Simple Dots Step Indicator

import React, { useState } from 'react'
import { useDVLotteryStore } from '@/hooks/useDVLotteryStore'
import type { FormStep } from '@/types/dv-lottery'
import { ArrowLeft, ArrowRight, Save, ChevronDown, ChevronUp } from 'lucide-react'
import { TickCircle, DocumentText1, Timer1 } from 'iconsax-react'

// Simple Dots Step Indicator Component
interface SimpleStepIndicatorProps {
  steps: FormStep[]
  currentStep: number
  onStepClick: (step: number) => void
  canGoToStep: (step: number) => boolean
}

const SimpleStepIndicator: React.FC<SimpleStepIndicatorProps> = ({ 
  steps, 
  currentStep, 
  onStepClick, 
  canGoToStep 
}) => {
  const [showAll, setShowAll] = useState(false);
  
  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed'
    if (stepNumber === currentStep) return 'current'
    return 'pending'
  }

  // Calculate progress
  const completedSteps = steps.filter((_, index) => index + 1 < currentStep).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  // Show limited steps or all based on toggle
  const visibleSteps = showAll ? steps : steps.slice(Math.max(0, currentStep - 3), currentStep + 4);
  const startIndex = showAll ? 0 : Math.max(0, currentStep - 3);

  return (
    <div className="mb-8">
      {/* Progress Summary */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Step {currentStep} of {steps.length}
          </h3>
          <p className="text-sm text-gray-600">
            {steps[currentStep - 1]?.title}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-600">
            {Math.round(progressPercentage)}%
          </div>
          <div className="text-sm text-gray-500">Complete</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-violet-500 to-violet-700 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Step Dots */}
      <div className="relative">
        {/* Desktop view */}
        <div className="hidden md:block">
          <div className="flex items-center justify-center space-x-3 mb-4">
            {visibleSteps.map((step, index) => {
              const actualStepNumber = startIndex + index + 1;
              const status = getStepStatus(actualStepNumber);
              const canClick = canGoToStep(actualStepNumber);

              return (
                <div key={step.id} className="flex items-center">
                  {/* Step Dot */}
                  <button
                    onClick={() => canClick && onStepClick(actualStepNumber)}
                    disabled={!canClick}
                    className={`
                      relative w-12 h-12 rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center
                      ${status === 'completed' 
                        ? 'bg-emerald-500 text-white shadow-lg hover:bg-emerald-600' 
                        : status === 'current' 
                        ? 'bg-gradient-to-r from-violet-500 to-violet-700 text-white shadow-xl scale-125 ring-4 ring-emerald-100' 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }
                      ${canClick ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed opacity-50'}
                    `}
                    title={`Step ${actualStepNumber}: ${step.title}`}
                  >
                    {status === 'completed' ? (
                      <TickCircle size={20} color="white" variant="Bold" />
                    ) : (
                      actualStepNumber
                    )}
                    
                    {/* Current step pulse effect */}
                    {status === 'current' && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 animate-ping opacity-30"></div>
                    )}
                  </button>
                  
                  {/* Connection line */}
                  {index < visibleSteps.length - 1 && (
                    <div className={`
                      w-8 h-0.5 mx-2 transition-all duration-500
                      ${actualStepNumber < currentStep ? 'bg-emerald-500' : 'bg-gray-300'}
                    `} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Show more/less toggle */}
          {steps.length > 7 && (
            <div className="text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showAll ? (
                  <>
                    <span>Show Less</span>
                    <ChevronUp size={16} className="ml-1" />
                  </>
                ) : (
                  <>
                    <span>Show All {steps.length} Steps</span>
                    <ChevronDown size={16} className="ml-1" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Mobile view - Compact horizontal scroll */}
        <div className="md:hidden">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const status = getStepStatus(stepNumber);
              const canClick = canGoToStep(stepNumber);

              return (
                <button
                  key={step.id}
                  onClick={() => canClick && onStepClick(stepNumber)}
                  disabled={!canClick}
                  className={`
                    flex-shrink-0 w-10 h-10 rounded-full text-xs font-semibold transition-all duration-200 flex items-center justify-center
                    ${status === 'completed' 
                      ? 'bg-emerald-500 text-white' 
                      : status === 'current' 
                      ? 'bg-gradient-to-r from-violet-500 to-violet-700 text-white scale-110 shadow-lg' 
                      : 'bg-gray-200 text-gray-600'
                    }
                    ${canClick ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                  `}
                  title={`Step ${stepNumber}: ${step.title}`}
                >
                  {status === 'completed' ? (
                    <TickCircle size={14} color="white" variant="Bold" />
                  ) : (
                    stepNumber
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Current Step Info */}
      <div className="mt-6 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl p-4 border border-emerald-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl flex-shrink-0">
            {steps[currentStep - 1]?.icon || <DocumentText1 size={24} color="white" variant="Bold" />}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-emerald-900 mb-1">
              {steps[currentStep - 1]?.title}
            </h4>
            <p className="text-sm text-emerald-700">
              {steps[currentStep - 1]?.description}
            </p>
            {steps[currentStep - 1]?.estimatedTime && (
              <div className="flex items-center space-x-1 mt-2 text-xs text-emerald-600">
                <Timer1 size={14} color="#059669" variant="Bold" />
                <span>Estimated time: {steps[currentStep - 1].estimatedTime} minutes</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-emerald-800">
              {completedSteps} of {steps.length} completed
            </div>
          </div>
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
            : 'bg-gradient-to-r from-violet-500 to-violet-700 text-white hover:from-emerald-600 hover:to-cyan-700 focus:ring-4 focus:ring-emerald-100 shadow-lg hover:shadow-xl transform hover:scale-105'
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

// Main Form Wizard component with simple step indicator
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
      {/* Simple Step Indicator at the top */}
      <SimpleStepIndicator 
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        canGoToStep={canGoToStep}
      />

      {/* Current step content with enhanced styling */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Step header */}
        <div className="bg-gradient-to-r from-emerald-50 via-white to-cyan-50 p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl">
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
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
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
            <div className="flex items-center justify-center w-10 h-10 bg-emerald-50 rounded-lg">
              <DocumentText1 size={20} color="#10B981" variant="Bold" />
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
              currentStepData.isValid ? 'bg-emerald-50' : 'bg-amber-50'
            }`}>
              <TickCircle 
                size={20} 
                color={currentStepData.isValid ? "#10B981" : "#F59E0B"} 
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
            <div className="flex items-center justify-center w-10 h-10 bg-cyan-50 rounded-lg">
              <Timer1 size={20} color="#06B6D4" variant="Bold" />
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
      <div className="mt-6 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl p-6 border border-emerald-100">
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-10 h-10 bg-emerald-500 rounded-lg flex-shrink-0">
            <DocumentText1 size={20} color="white" variant="Bold" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 text-sm mb-3">
              Having trouble with this step? Our step-by-step guide and support team are here to help you complete your application successfully.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium underline">
                View Step Guide
              </button>
              <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium underline">
                Contact Support
              </button>
              <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium underline">
                FAQ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}