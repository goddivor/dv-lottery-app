/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/forms/steps/PhotoUploadStep.tsx

import React, { useState, useCallback, useRef } from "react";
import { type FormStepProps, type PhotoDocument } from "@/types/dv-lottery";
import { useDVLotteryStore } from "@/hooks/useDVLotteryStore";
import { validatePhoto } from "@/lib/validation";
import { useToast } from "@/context/toast-context";
import {
  Camera,
  DocumentUpload,
  Gallery,
  CloseCircle,
  TickCircle,
  Warning2,
  InfoCircle,
  Refresh2,
  Eye,
  DocumentText1,
  Image as ImageIcon,
} from "iconsax-react";
import { X, Upload, AlertTriangle, Wand2 } from "lucide-react";
import { PhotoAutoFixer } from "@/components/forms/PhotoAutoFixer";

// Photo preview component with validation indicators
interface PhotoPreviewProps {
  photo: PhotoDocument;
  onRemove: () => void;
  onRetake: () => void;
  onAutoFix: () => void;
}

const PhotoPreview: React.FC<PhotoPreviewProps> = ({
  photo,
  onRemove,
  onRetake,
  onAutoFix,
}) => {
  const [showFullPreview, setShowFullPreview] = useState(false);

  return (
    <>
      <div className="relative bg-white border-2 border-gray-200 rounded-xl p-6">
        {/* Photo container */}
        <div className="relative mx-auto w-40 h-40 rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
          <img
            src={photo.preview}
            alt="Uploaded photo"
            className="w-full h-full object-cover"
          />

          {/* Validation overlay */}
          <div
            className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center ${
              photo.isValid
                ? "bg-green-500 bg-opacity-20"
                : "bg-red-500 bg-opacity-30"
            }`}
          >
            {photo.isValid ? (
              <div className="bg-green-500 rounded-full p-2">
                <TickCircle size={24} color="white" variant="Bold" />
              </div>
            ) : (
              <div className="bg-red-500 rounded-full p-2">
                <CloseCircle size={24} color="white" variant="Bold" />
              </div>
            )}
          </div>
        </div>

        {/* Photo info */}
        <div className="mt-4 text-center">
          <div className="text-sm font-medium text-gray-900 mb-2">
            {photo.file.name}
          </div>
          <div className="text-xs text-gray-500 mb-3">
            Size: {(photo.file.size / 1024).toFixed(1)} KB
          </div>

          {/* Validation status */}
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              photo.isValid
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {photo.isValid ? (
              <>
                <TickCircle
                  size={14}
                  color="#16A34A"
                  variant="Bold"
                  className="mr-1"
                />
                Valid Photo
              </>
            ) : (
              <>
                <CloseCircle
                  size={14}
                  color="#DC2626"
                  variant="Bold"
                  className="mr-1"
                />
                Invalid Photo
              </>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => setShowFullPreview(true)}
            className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-sm"
          >
            <Eye size={16} />
            <span>Preview</span>
          </button>

          {!photo.isValid && (
            <button
              onClick={onAutoFix}
              className="flex items-center space-x-1 px-3 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors text-sm font-medium"
            >
              <Wand2 size={16} />
              <span>Auto-Fix</span>
            </button>
          )}

          <button
            onClick={onRetake}
            className="flex items-center space-x-1 px-3 py-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors text-sm"
          >
            <Refresh2 size={16} />
            <span>Replace</span>
          </button>

          <button
            onClick={onRemove}
            className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm"
          >
            <X size={16} />
            <span>Remove</span>
          </button>
        </div>

        {/* Validation errors */}
        {!photo.isValid && photo.validationErrors.length > 0 && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle
                size={16}
                className="text-red-500 mt-0.5 flex-shrink-0"
              />
              <div>
                <h4 className="text-sm font-medium text-red-800 mb-1">
                  Photo Issues:
                </h4>
                <ul className="text-xs text-red-700 space-y-1">
                  {photo.validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full screen preview modal */}
      {showFullPreview && (
        <div className=" shadow-2xl fixed inset-0 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Photo Preview
              </h3>
              <button
                onClick={() => setShowFullPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <img
                src={photo.preview}
                alt="Photo preview"
                className="mx-auto max-w-full max-h-96 rounded-lg border"
              />
              <div className="mt-4 text-center text-sm text-gray-600">
                {photo.file.name} • {(photo.file.size / 1024).toFixed(1)} KB
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Main drag and drop upload area
interface DropZoneProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({ onFileSelect, isUploading }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith("image/")) {
          onFileSelect(file);
        }
      }
    },
    [onFileSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
        isDragActive
          ? "border-blue-400 bg-blue-50 scale-105"
          : isUploading
          ? "border-green-400 bg-green-50"
          : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
      }`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileInput}
        className="hidden"
      />

      {isUploading ? (
        <div className="space-y-4">
          <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto">
            <div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              Processing Photo...
            </h3>
            <p className="text-sm text-green-600">
              Please wait while we validate your photo
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Upload icon */}
          <div
            className={`flex items-center justify-center w-20 h-20 rounded-full mx-auto transition-all duration-300 ${
              isDragActive ? "bg-blue-100 scale-110" : "bg-gray-100"
            }`}
          >
            {isDragActive ? (
              <DocumentUpload size={32} color="#3B82F6" variant="Bold" />
            ) : (
              <Camera size={32} color="#6B7280" variant="Bold" />
            )}
          </div>

          {/* Upload text */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isDragActive ? "Drop your photo here" : "Upload Your Photo"}
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your photo here, or click to browse
            </p>
          </div>

          {/* Upload button */}
          <button
            onClick={openFileDialog}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <Upload size={20} />
            <span>Choose Photo</span>
          </button>

          {/* File format info */}
          <div className="text-xs text-gray-500">
            Supports: JPEG, PNG • Max size: 240KB • Required: 600×600 pixels
          </div>
        </div>
      )}
    </div>
  );
};

// Photo requirements checklist component
const PhotoRequirements: React.FC = () => {
  const requirements = [
    { id: 1, text: "Exactly 600×600 pixels (square format)", icon: "📐" },
    { id: 2, text: "JPEG or PNG format only", icon: "🖼️" },
    { id: 3, text: "Maximum file size: 240KB", icon: "💾" },
    { id: 4, text: "Taken within the last 6 months", icon: "📅" },
    { id: 5, text: "White or light-colored background", icon: "⚪" },
    { id: 6, text: "Face directly towards camera", icon: "👤" },
    { id: 7, text: "No glasses, hats, or head coverings", icon: "🚫" },
    { id: 8, text: "Natural expression, eyes open", icon: "👁️" },
    { id: 9, text: "Good lighting, no shadows", icon: "💡" },
    { id: 10, text: "No filters or digital alterations", icon: "🔍" },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
          <DocumentText1 size={20} color="#3B82F6" variant="Bold" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Photo Requirements
          </h3>
          <p className="text-sm text-gray-600">
            Your photo must meet all official DV Lottery requirements
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {requirements.map((req) => (
          <div
            key={req.id}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
          >
            <span className="text-lg">{req.icon}</span>
            <span className="text-sm text-gray-700">{req.text}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Warning2
            size={20}
            color="#D97706"
            variant="Bold"
            className="mt-0.5 flex-shrink-0"
          />
          <div className="text-sm">
            <p className="font-medium text-amber-900 mb-1">
              Critical Photo Guidelines:
            </p>
            <p className="text-amber-800">
              Photos that don't meet these exact requirements will cause your DV
              Lottery application to be automatically disqualified. When in
              doubt, retake your photo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main photo upload step component
export const PhotoUploadStep: React.FC<FormStepProps> = ({ data }) => {
  const { updateApplicantPhoto } = useDVLotteryStore();
  const { success, error } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [showAutoFixer, setShowAutoFixer] = useState(false);

  const currentPhoto = data.applicantPhoto;

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);

    try {
      // Validate the photo
      const validation = await validatePhoto(file);

      // Create preview URL
      const preview = URL.createObjectURL(file);

      // Create photo document
      const photoDoc: PhotoDocument = {
        file,
        preview,
        isValid: validation.isValid,
        validationErrors: validation.errors,
      };

      // Update store
      updateApplicantPhoto(photoDoc);

      if (validation.isValid) {
        success(
          "Photo uploaded successfully!",
          "Your photo meets all requirements and is ready for submission."
        );
      } else {
        error(
          "Photo validation failed",
          "Please check the requirements and upload a compliant photo."
        );
      }
    } catch (err) {
      error(
        "Upload failed",
        "There was an error processing your photo. Please try again."
      );
      console.error("Photo upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    if (currentPhoto?.preview) {
      URL.revokeObjectURL(currentPhoto.preview);
    }
    updateApplicantPhoto(undefined);
    success("Photo removed", "You can upload a new photo when ready.");
  };

  const handleRetakePhoto = () => {
    handleRemovePhoto();
  };

  const handleAutoFix = () => {
    setShowAutoFixer(true);
  };

  const handleAutoFixComplete = (fixedPhoto: PhotoDocument) => {
    updateApplicantPhoto(fixedPhoto);
    setShowAutoFixer(false);
    success(
      "Photo fixed successfully!",
      "Your photo now meets all DV Lottery requirements."
    );
  };

  const handleAutoFixCancel = () => {
    setShowAutoFixer(false);
  };

  // Calculate completion status
  const isCompleted = currentPhoto?.isValid || false;
  const hasPhoto = !!currentPhoto;

  return (
    <div className="space-y-8">
      {/* Progress indicator for this step */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
              <Camera size={24} color="white" variant="Bold" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Photo Upload</h3>
              <p className="text-gray-600">
                Upload your official DV Lottery photo
              </p>
            </div>
          </div>

          {/* Completion indicator */}
          <div className="text-right">
            <div
              className={`text-2xl font-bold ${
                isCompleted
                  ? "text-green-600"
                  : hasPhoto
                  ? "text-orange-600"
                  : "text-gray-400"
              }`}
            >
              {isCompleted ? "✓" : hasPhoto ? "⚠" : "○"}
            </div>
            <div className="text-sm text-gray-500">
              {isCompleted ? "Valid" : hasPhoto ? "Invalid" : "Pending"}
            </div>
          </div>
        </div>
      </div>

      {/* Main upload area or photo preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {currentPhoto ? (
            <PhotoPreview
              photo={currentPhoto}
              onRemove={handleRemovePhoto}
              onRetake={handleRetakePhoto}
              onAutoFix={handleAutoFix}
            />
          ) : (
            <DropZone
              onFileSelect={handleFileSelect}
              isUploading={isUploading}
            />
          )}

          {/* Photo tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                <InfoCircle size={20} color="#3B82F6" variant="Bold" />
              </div>
              <h4 className="font-semibold text-blue-900">Photo Tips</h4>
            </div>
            <ul className="text-blue-800 text-sm space-y-2">
              <li className="flex items-start space-x-2">
                <Camera
                  size={16}
                  color="#3B82F6"
                  variant="Bold"
                  className="mt-0.5 flex-shrink-0"
                />
                <span>
                  Use a smartphone or digital camera with good resolution
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <ImageIcon
                  size={16}
                  className="mt-0.5 flex-shrink-0 text-blue-600"
                />
                <span>
                  Ensure the photo is exactly 600×600 pixels before uploading
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <Gallery
                  size={16}
                  color="#3B82F6"
                  variant="Bold"
                  className="mt-0.5 flex-shrink-0"
                />
                <span>Take multiple shots and choose the best one</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Requirements panel */}
        <div>
          <PhotoRequirements />
        </div>
      </div>

      {/* Status summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-lg ${
              isCompleted
                ? "bg-green-50"
                : hasPhoto
                ? "bg-orange-50"
                : "bg-gray-50"
            }`}
          >
            {isCompleted ? (
              <TickCircle size={20} color="#16A34A" variant="Bold" />
            ) : hasPhoto ? (
              <Warning2 size={20} color="#D97706" variant="Bold" />
            ) : (
              <DocumentUpload size={20} color="#6B7280" variant="Bold" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Photo Status
            </h3>
            <p className="text-sm text-gray-600">
              {isCompleted
                ? "Your photo is valid and ready for submission!"
                : hasPhoto
                ? "Photo uploaded but needs attention - please check validation errors above"
                : "Please upload your photo to continue"}
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-sm font-medium text-gray-900">
              Required Size
            </div>
            <div className="text-xs text-gray-600">600×600 px</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-sm font-medium text-gray-900">
              Max File Size
            </div>
            <div className="text-xs text-gray-600">240 KB</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-sm font-medium text-gray-900">Format</div>
            <div className="text-xs text-gray-600">JPEG/PNG</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-sm font-medium text-gray-900">Background</div>
            <div className="text-xs text-gray-600">White/Light</div>
          </div>
        </div>
      </div>
      {/* Auto-Fixer Modal */}
      {showAutoFixer && currentPhoto && (
        <PhotoAutoFixer
          originalPhoto={currentPhoto}
          onPhotoFixed={handleAutoFixComplete}
          onCancel={handleAutoFixCancel}
        />
      )}
    </div>
  );
};
