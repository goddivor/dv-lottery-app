// src/components/forms/PhotoUploadToast.tsx

import React from 'react'
import type { DetailedPhotoValidation } from '@/lib/enhanced-validation'
import { getPhotoQualityScore, getPhotoRecommendations } from '@/lib/enhanced-validation'
import { 
  TickCircle, 
  Warning2, 
  CloseCircle, 
  InfoCircle,
  DocumentText1
} from 'iconsax-react'
import { Wand2, X } from 'lucide-react'

interface PhotoUploadToastProps {
  validation: DetailedPhotoValidation
  onAutoFix?: () => void
  onDismiss: () => void
  showAutoFixButton?: boolean
}

export const PhotoUploadToast: React.FC<PhotoUploadToastProps> = ({
  validation,
  onAutoFix,
  onDismiss,
  showAutoFixButton = true
}) => {
  const qualityScore = getPhotoQualityScore(validation)
  const recommendations = getPhotoRecommendations(validation)

  const getToastColor = () => {
    if (validation.isValid) return 'green'
    if (validation.errors.length > 0) return 'red'
    return 'yellow'
  }

  const getToastIcon = () => {
    const color = getToastColor()
    const iconProps = { size: 24, variant: "Bold" as const }

    switch (color) {
      case 'green':
        return <TickCircle color="#16A34A" {...iconProps} />
      case 'red':
        return <CloseCircle color="#DC2626" {...iconProps} />
      case 'yellow':
        return <Warning2 color="#D97706" {...iconProps} />
      default:
        return <InfoCircle color="#3B82F6" {...iconProps} />
    }
  }

  const getToastStyles = () => {
    const color = getToastColor()
    const baseStyles = "relative max-w-md w-full bg-white border rounded-xl shadow-lg overflow-hidden"

    switch (color) {
      case 'green':
        return `${baseStyles} border-green-200`
      case 'red':
        return `${baseStyles} border-red-200`
      case 'yellow':
        return `${baseStyles} border-yellow-200`
      default:
        return `${baseStyles} border-blue-200`
    }
  }

  const getHeaderStyles = () => {
    const color = getToastColor()

    switch (color) {
      case 'green':
        return "bg-green-50 border-green-200"
      case 'red':
        return "bg-red-50 border-red-200"
      case 'yellow':
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  const getTitle = () => {
    if (validation.isValid) return 'Photo Upload Successful!'
    if (validation.errors.length > 0) return 'Photo Validation Failed'
    return 'Photo Upload Warning'
  }

  const getDescription = () => {
    if (validation.isValid) {
      return 'Your photo meets all DV Lottery requirements and is ready for submission.'
    }
    if (validation.errors.length > 0) {
      return 'Your photo has issues that must be fixed before you can proceed.'
    }
    return 'Your photo has been uploaded but there are some recommendations for improvement.'
  }

  return (
    <div className={getToastStyles()}>
      {/* Header */}
      <div className={`p-4 border-b ${getHeaderStyles()}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getToastIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900">{getTitle()}</h3>
              <p className="text-sm text-gray-600 mt-1">{getDescription()}</p>
            </div>
          </div>
          
          <button
            onClick={onDismiss}
            className="flex-shrink-0 ml-3 p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Quality Score */}
        <div className="mt-4 flex items-center space-x-3">
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">Photo Quality</span>
              <span className={`font-bold ${
                qualityScore >= 80 ? 'text-green-600' :
                qualityScore >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {qualityScore}/100
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  qualityScore >= 80 ? 'bg-green-500' :
                  qualityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${qualityScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Photo Info */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">File Size:</span>
            <span className={`ml-2 font-medium ${
              validation.requirements.sizeOk ? 'text-green-600' : 'text-red-600'
            }`}>
              {validation.fileInfo.sizeKB} KB
            </span>
          </div>
          <div>
            <span className="text-gray-600">Format:</span>
            <span className={`ml-2 font-medium ${
              validation.requirements.formatOk ? 'text-green-600' : 'text-red-600'
            }`}>
              {validation.fileInfo.type.split('/')[1].toUpperCase()}
            </span>
          </div>
          {validation.fileInfo.dimensions && (
            <>
              <div>
                <span className="text-gray-600">Dimensions:</span>
                <span className={`ml-2 font-medium ${
                  validation.requirements.dimensionsOk ? 'text-green-600' : 'text-red-600'
                }`}>
                  {validation.fileInfo.dimensions.width}×{validation.fileInfo.dimensions.height}px
                </span>
              </div>
              <div>
                <span className="text-gray-600">Required:</span>
                <span className="ml-2 font-medium text-gray-800">600×600px</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Issues */}
      {validation.errors.length > 0 && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <h4 className="text-sm font-semibold text-red-800 mb-2 flex items-center space-x-2">
            <CloseCircle size={16} color="#DC2626" variant="Bold" />
            <span>Issues Found ({validation.errors.length})</span>
          </h4>
          <ul className="text-sm text-red-700 space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-red-500 mt-1">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {validation.warnings.length > 0 && (
        <div className="p-4 bg-yellow-50 border-b border-yellow-200">
          <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center space-x-2">
            <Warning2 size={16} color="#D97706" variant="Bold" />
            <span>Warnings ({validation.warnings.length})</span>
          </h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            {validation.warnings.map((warning, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-yellow-500 mt-1">•</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="p-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <DocumentText1 size={16} color="#374151" variant="Bold" />
            <span>Recommendations</span>
          </h4>
          <ul className="text-sm text-gray-600 space-y-2">
            {recommendations.slice(0, 3).map((rec, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="mt-1">{rec.split(' ')[0]}</span>
                <span>{rec.substring(rec.indexOf(' ') + 1)}</span>
              </li>
            ))}
          </ul>
          
          {recommendations.length > 3 && (
            <p className="text-xs text-gray-500 mt-2">
              +{recommendations.length - 3} more recommendations...
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            File: {validation.fileInfo.name}
          </div>
          
          {showAutoFixButton && !validation.isValid && onAutoFix && (
            <button
              onClick={onAutoFix}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
            >
              <Wand2 size={14} />
              <span>Auto-Fix</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}