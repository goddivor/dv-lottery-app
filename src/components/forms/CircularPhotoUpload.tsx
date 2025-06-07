// src/components/forms/CircularPhotoUpload.tsx

import React, { useState, useRef } from 'react'
import { Camera, Upload, X, RotateCcw, Wand2 } from 'lucide-react'
import { validatePhoto } from '@/lib/validation'
import { PhotoAutoFixer } from '@/components/forms/PhotoAutoFixer'
import { useToast } from '@/context/toast-context'
import type { PhotoDocument } from '@/types/dv-lottery'

interface CircularPhotoUploadProps {
  onPhotoChange: (file: File | null) => void
  currentPhoto?: File | null
  className?: string
}

export const CircularPhotoUpload: React.FC<CircularPhotoUploadProps> = ({
  onPhotoChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  currentPhoto,
  className = ''
}) => {
  const [photoDoc, setPhotoDoc] = useState<PhotoDocument | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showAutoFixer, setShowAutoFixer] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { success, error } = useToast()

  const handleFileSelect = async (file: File) => {
    setIsUploading(true)

    try {
      // Validate the photo
      const validation = await validatePhoto(file)
      
      // Create preview URL
      const preview = URL.createObjectURL(file)

      // Create photo document
      const newPhotoDoc: PhotoDocument = {
        file,
        preview,
        isValid: validation.isValid,
        validationErrors: validation.errors,
      }

      setPhotoDoc(newPhotoDoc)
      onPhotoChange(file)

      if (validation.isValid) {
        success('Photo uploaded!', 'Your photo meets all requirements')
      } else {
        error('Photo validation failed', 'Check the requirements and try again')
      }
    } catch (err) {
      error('Upload failed', 'There was an error processing your photo')
      console.error('Photo upload error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleRemovePhoto = () => {
    if (photoDoc?.preview) {
      URL.revokeObjectURL(photoDoc.preview)
    }
    setPhotoDoc(null)
    onPhotoChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAutoFix = () => {
    setShowAutoFixer(true)
  }

  const handleAutoFixComplete = (fixedPhoto: PhotoDocument) => {
    if (photoDoc?.preview) {
      URL.revokeObjectURL(photoDoc.preview)
    }
    setPhotoDoc(fixedPhoto)
    onPhotoChange(fixedPhoto.file)
    setShowAutoFixer(false)
    success('Photo fixed!', 'Your photo now meets all requirements')
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Circular photo container */}
      <div className="relative">
        <div className="w-40 h-40 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 hover:border-gray-400 transition-colors">
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-gray-600">Processing...</span>
            </div>
          ) : photoDoc ? (
            <img
              src={photoDoc.preview}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="flex flex-col items-center space-y-2 text-gray-400">
              <Camera size={32} />
              <span className="text-xs text-center">Upload Photo</span>
            </div>
          )}
        </div>

        {/* Validation indicator */}
        {photoDoc && (
          <div className={`absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center ${
            photoDoc.isValid 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {photoDoc.isValid ? '✓' : '!'}
          </div>
        )}

        {/* Upload button overlay */}
        {!isUploading && (
          <button
            type="button"
            onClick={openFileDialog}
            className="absolute inset-0 rounded-full bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center"
          >
            <Upload className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
          </button>
        )}
      </div>

      {/* File input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Photo info and actions */}
      {photoDoc && (
        <div className="text-center space-y-3">
          <div className="text-sm text-gray-600">
            <div>{photoDoc.file.name}</div>
            <div>{(photoDoc.file.size / 1024).toFixed(1)} KB</div>
          </div>

          {/* Validation status */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            photoDoc.isValid
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {photoDoc.isValid ? '✓ Valid Photo' : '⚠ Needs Attention'}
          </div>

          {/* Error messages */}
          {!photoDoc.isValid && photoDoc.validationErrors.length > 0 && (
            <div className="text-xs text-red-600 max-w-xs">
              <div className="font-medium mb-1">Issues:</div>
              <ul className="space-y-1">
                {photoDoc.validationErrors.slice(0, 2).map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-center space-x-2">
            <button
              type="button"
              onClick={openFileDialog}
              className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-sm"
            >
              <RotateCcw size={14} />
              <span>Replace</span>
            </button>

            {!photoDoc.isValid && (
              <button
                type="button"
                onClick={handleAutoFix}
                className="flex items-center space-x-1 px-3 py-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors text-sm font-medium"
              >
                <Wand2 size={14} />
                <span>Fix</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleRemovePhoto}
              className="flex items-center space-x-1 px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm"
            >
              <X size={14} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      )}

      {/* Upload instructions */}
      {!photoDoc && !isUploading && (
        <div className="text-center space-y-2">
          <button
            type="button"
            onClick={openFileDialog}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload size={16} />
            <span>Choose Photo</span>
          </button>
          
          <div className="text-xs text-gray-500 max-w-xs">
            <div className="font-medium mb-1">Requirements:</div>
            <div>• 600×600 pixels</div>
            <div>• JPEG/PNG format</div>
            <div>• Max 240KB</div>
            <div>• Recent photo, white background</div>
          </div>
        </div>
      )}

      {/* Auto-Fixer Modal */}
      {showAutoFixer && photoDoc && (
        <PhotoAutoFixer
          originalPhoto={photoDoc}
          onPhotoFixed={handleAutoFixComplete}
          onCancel={() => setShowAutoFixer(false)}
        />
      )}
    </div>
  )
}