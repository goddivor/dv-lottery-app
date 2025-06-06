// src/components/forms/FormWizard.tsx - Enhanced with Floating Vertical Step Indicator

import React, { useState } from 'react'
import { useDVLotteryStore } from '@/hooks/useDVLotteryStore'
import type { FormStep } from '@/types/dv-lottery'
import { ArrowLeft, ArrowRight, Save, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react'
import { TickCircle, DocumentText1, Timer1, ArrowUp2, ArrowDown2 } from 'iconsax-react'

// Floating Vertical Step Indicator Component
interface FloatingStepIndicatorProps {
  steps: FormStep[]
  currentStep: number
  onStepClick: (step: number) => void
  canGoToStep: (step: number) => boolean
}

const FloatingStepIndicator: React.FC<FloatingStepIndicatorProps> = ({ 
  steps, 
  currentStep, 
  onStepClick, 
  canGoToStep 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
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
  const categoryColors = {
    'Identity': '#6366F1',
    'Contact': '#0891B2', 
    'Family': '#EC4899',
    'Documents': '#7C3AED',
    'Qualifications': '#9333EA',
    'Submission': '#16A34A'
  };

  const getCategoryColor = (category: string) => {
    return categoryColors[category as keyof typeof categoryColors] || '#6B7280';
  }

  // Calculate progress
  const completedSteps = steps.filter((_, index) => index + 1 < currentStep).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <>
      {/* Floating Step Indicator */}
      <div className={`fixed left-4 top-1/2 transform -translate-y-1/2 z-40 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}>
        {/* Main Container */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Application Progress</h3>
                  <p className="text-xs text-gray-600">Step {currentStep} of {steps.length}</p>
                </div>
              )}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                {isCollapsed ? (
                  <ChevronRight size={16} className="text-gray-600" />
                ) : (
                  <ChevronLeft size={16} className="text-gray-600" />
                )}
              </button>
            </div>
            
            {!isCollapsed && (
              <>
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{completedSteps} completed</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Steps Content */}
          <div className={`transition-all duration-300 ${
            isCollapsed ? 'h-0 overflow-hidden' : 'max-h-96 overflow-y-auto'
          }`}>
            {!isCollapsed && (
              <div className="p-2">
                {/* Category-based Navigation */}
                {Object.entries(categorizedSteps).map(([category, categorySteps]) => (
                  <div key={category} className="mb-4">
                    {/* Category Header */}
                    <button
                      onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                      className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getCategoryColor(category) }}
                        />
                        <span className="text-sm font-medium text-gray-700">{category}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {categorySteps.length}
                        </span>
                      </div>
                      <ChevronDown 
                        size={14} 
                        className={`text-gray-400 transition-transform ${
                          selectedCategory === category ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Category Steps */}
                    {(selectedCategory === category || selectedCategory === null) && (
                      <div className="ml-2 mt-2 space-y-1">
                        {categorySteps.map((step) => {
                          const status = getStepStatus(step.stepNumber);
                          const canClick = canGoToStep(step.stepNumber);
                          
                          return (
                            <button
                              key={step.id}
                              onClick={() => canClick && onStepClick(step.stepNumber)}
                              disabled={!canClick}
                              className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-all duration-200 group ${
                                status === 'completed' 
                                  ? 'bg-green-50 hover:bg-green-100 border border-green-200' 
                                  : status === 'current' 
                                  ? 'bg-blue-50 border-2 border-blue-300 shadow-sm' 
                                  : 'hover:bg-gray-50 border border-transparent'
                              } ${canClick ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                            >
                              {/* Step Number/Icon */}
                              <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                                status === 'completed' 
                                  ? 'bg-green-500 text-white' 
                                  : status === 'current' 
                                  ? 'bg-blue-500 text-white scale-110' 
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                {status === 'completed' ? (
                                  <TickCircle size={14} color="white" variant="Bold" />
                                ) : (
                                  step.stepNumber
                                )}
                              </div>

                              {/* Step Info */}
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${
                                  status === 'current' ? 'text-blue-900' : 
                                  status === 'completed' ? 'text-green-900' : 'text-gray-700'
                                }`}>
                                  {step.title}
                                </p>
                                {step.estimatedTime && (
                                  <p className="text-xs text-gray-500 flex items-center space-x-1">
                                    <Timer1 size={10} />
                                    <span>{step.estimatedTime}min</span>
                                  </p>
                                )}
                              </div>

                              {/* Step Status Indicator */}
                              {status === 'current' && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Collapsed View - Just show current step */}
          {isCollapsed && (
            <div className="p-3">
              <div className="flex flex-col items-center space-y-2">
                {/* Current Step Indicator */}
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {currentStep}
                </div>
                
                {/* Progress Dots */}
                <div className="flex flex-col space-y-1">
                  {steps.slice(0, 5).map((_, index) => {
                    const stepNum = index + 1;
                    const status = getStepStatus(stepNum);
                    return (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          status === 'completed' ? 'bg-green-500' :
                          status === 'current' ? 'bg-blue-500 scale-125' :
                          'bg-gray-300'
                        }`}
                      />
                    );
                  })}
                  {steps.length > 5 && (
                    <div className="text-xs text-gray-400 text-center">...</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Navigation Buttons */}
        {!isCollapsed && (
          <div className="mt-3 flex space-x-2">
            <button
              onClick={() => currentStep > 1 && onStepClick(currentStep - 1)}
              disabled={currentStep === 1}
              className="flex-1 flex items-center justify-center p-2 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-gray-200/50 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowUp2 color='grey' size={16} className="text-gray-600" />
            </button>
            <button
              onClick={() => currentStep < steps.length && canGoToStep(currentStep + 1) && onStepClick(currentStep + 1)}
              disabled={currentStep === steps.length || !canGoToStep(currentStep + 1)}
              className="flex-1 flex items-center justify-center p-2 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-gray-200/50 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowDown2 color='grey' size={16} className="text-gray-600" />
            </button>
          </div>
        )}
      </div>

      {/* Mobile Progress Bar (replaces floating indicator on mobile) */}
      <div className="lg:hidden mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Current step info */}
        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {steps[currentStep - 1]?.icon}
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
    </>
  )
}

// Enhanced navigation buttons component (unchanged)
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

// Main Form Wizard component with floating step indicator
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
    <>
      {/* Floating Step Indicator */}
      <FloatingStepIndicator 
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        canGoToStep={canGoToStep}
      />

      {/* Main Content Area with left margin for floating indicator */}
      <div className={`lg:ml-96 ${className}`}>
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
    </>
  )
}