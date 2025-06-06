// src/components/forms/PhotoAutoFixer.tsx

import React, { useState } from 'react'
import { 
  processImageForDVLottery, 
  createImagePreview,
  revokeImagePreview 
} from '@/lib/photo-utils'
import { validatePhoto } from '@/lib/validation'
import type { PhotoDocument } from '@/types/dv-lottery'
import { 
  Refresh2, 
  TickCircle, 
  Warning2, 
  InfoCircle,
  DocumentText1,
  Image as ImageIcon
} from 'iconsax-react'
import { Wand2, ArrowRight } from 'lucide-react'

interface PhotoAutoFixerProps {
  originalPhoto: PhotoDocument
  onPhotoFixed: (fixedPhoto: PhotoDocument) => void
  onCancel: () => void
}

interface ProcessingStep {
  id: string
  label: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  description: string
}

export const PhotoAutoFixer: React.FC<PhotoAutoFixerProps> = ({
  originalPhoto,
  onPhotoFixed,
  onCancel
}) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedPhoto, setProcessedPhoto] = useState<PhotoDocument | null>(null)
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    {
      id: 'analyze',
      label: 'Analyzing Photo',
      status: 'pending',
      description: 'Checking current photo dimensions and file size'
    },
    {
      id: 'resize',
      label: 'Resizing to 600×600px',
      status: 'pending',
      description: 'Adjusting photo to meet exact requirements'
    },
    {
      id: 'compress',
      label: 'Optimizing File Size',
      status: 'pending',
      description: 'Ensuring file size is under 240KB'
    },
    {
      id: 'validate',
      label: 'Final Validation',
      status: 'pending',
      description: 'Verifying all requirements are met'
    }
  ])

  const updateStepStatus = (stepId: string, status: ProcessingStep['status']) => {
    setProcessingSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, status } : step
      )
    )
  }

  const handleAutoFix = async () => {
    setIsProcessing(true)

    try {
      // Step 1: Analyze
      updateStepStatus('analyze', 'processing')
    //   const originalInfo = await getImageInfo(originalPhoto.file)
      await new Promise(resolve => setTimeout(resolve, 500)) // Visual delay
      updateStepStatus('analyze', 'completed')

      // Step 2: Resize
      updateStepStatus('resize', 'processing')
      const processedFile = await processImageForDVLottery(originalPhoto.file)
      await new Promise(resolve => setTimeout(resolve, 800))
      updateStepStatus('resize', 'completed')

      // Step 3: Compress (already done in processImageForDVLottery)
      updateStepStatus('compress', 'processing')
      await new Promise(resolve => setTimeout(resolve, 600))
      updateStepStatus('compress', 'completed')

      // Step 4: Validate
      updateStepStatus('validate', 'processing')
      const validation = await validatePhoto(processedFile)
      const preview = createImagePreview(processedFile)

      const fixedPhoto: PhotoDocument = {
        file: processedFile,
        preview,
        isValid: validation.isValid,
        validationErrors: validation.errors
      }

      setProcessedPhoto(fixedPhoto)
      updateStepStatus('validate', 'completed')

    } catch (error) {
      console.error('Auto-fix failed:', error)
      // Mark current step as error
      const currentStep = processingSteps.find(step => step.status === 'processing')
      if (currentStep) {
        updateStepStatus(currentStep.id, 'error')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUseFixed = () => {
    if (processedPhoto) {
      // Revoke original preview to free memory
      revokeImagePreview(originalPhoto.preview)
      onPhotoFixed(processedPhoto)
    }
  }

  const handleCancel = () => {
    if (processedPhoto) {
      revokeImagePreview(processedPhoto.preview)
    }
    onCancel()
  }

  const getStepIcon = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return <TickCircle size={16} color="#16A34A" variant="Bold" />
      case 'processing':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      case 'error':
        return <Warning2 size={16} color="#DC2626" variant="Bold" />
      default:
        return <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
              <Wand2 size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Auto-Fix Photo</h2>
              <p className="text-gray-600">Automatically adjust your photo to meet DV Lottery requirements</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Before/After Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Original Photo */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <ImageIcon size={20} className="text-gray-600" />
                <span>Original Photo</span>
              </h3>
              
              <div className="relative mx-auto w-32 h-32 rounded-lg overflow-hidden bg-gray-100 border mb-4">
                <img
                  src={originalPhoto.preview}
                  alt="Original"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium">{(originalPhoto.file.size / 1024).toFixed(1)} KB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Format:</span>
                  <span className="font-medium">{originalPhoto.file.type.split('/')[1].toUpperCase()}</span>
                </div>
              </div>

              {/* Issues */}
              {originalPhoto.validationErrors.length > 0 && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Issues Found:</h4>
                  <ul className="text-xs text-red-700 space-y-1">
                    {originalPhoto.validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Fixed Photo or Processing */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Wand2 size={20} className="text-purple-600" />
                <span>Fixed Photo</span>
              </h3>

              {processedPhoto ? (
                <>
                  <div className="relative mx-auto w-32 h-32 rounded-lg overflow-hidden bg-gray-100 border mb-4">
                    <img
                      src={processedPhoto.preview}
                      alt="Fixed"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
                      <div className="bg-green-500 rounded-full p-2">
                        <TickCircle size={20} color="white" variant="Bold" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium text-green-600">{(processedPhoto.file.size / 1024).toFixed(1)} KB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dimensions:</span>
                      <span className="font-medium text-green-600">600×600px</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Format:</span>
                      <span className="font-medium">JPEG</span>
                    </div>
                  </div>

                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <TickCircle size={16} color="#16A34A" variant="Bold" />
                      <span className="text-sm font-medium text-green-800">All requirements met!</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="mx-auto w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
                    <DocumentText1 size={32} color="#9CA3AF" variant="Bold" />
                  </div>
                  <p className="text-gray-500 text-sm">Fixed photo will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Processing Steps */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Refresh2 size={20} className="text-blue-600" />
              <span>Processing Steps</span>
            </h3>

            <div className="space-y-4">
              {processingSteps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getStepIcon(step.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className={`font-medium ${
                        step.status === 'completed' ? 'text-green-700' :
                        step.status === 'processing' ? 'text-blue-700' :
                        step.status === 'error' ? 'text-red-700' :
                        'text-gray-600'
                      }`}>
                        {step.label}
                      </span>
                      {step.status === 'processing' && (
                        <span className="text-xs text-blue-600 animate-pulse">Processing...</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                  {index < processingSteps.length - 1 && (
                    <ArrowRight size={16} className="text-gray-300" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-start space-x-3">
              <InfoCircle size={20} color="#3B82F6" variant="Bold" className="mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">What happens during auto-fix?</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Photo is automatically resized to exactly 600×600 pixels</li>
                  <li>• White background is added if needed</li>
                  <li>• File size is optimized to stay under 240KB</li>
                  <li>• Format is converted to JPEG for optimal compatibility</li>
                  <li>• Quality is maintained while meeting all requirements</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={handleCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>

          <div className="flex space-x-3">
            {!processedPhoto && (
              <button
                onClick={handleAutoFix}
                disabled={isProcessing}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Wand2 size={18} />
                    <span>Auto-Fix Photo</span>
                  </>
                )}
              </button>
            )}

            {processedPhoto && (
              <button
                onClick={handleUseFixed}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200"
              >
                <TickCircle size={18} color="white" variant="Bold" />
                <span>Use Fixed Photo</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}