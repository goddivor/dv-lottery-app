// src/lib/enhanced-validation.ts - Enhanced photo validation with detailed feedback

import { PHOTO_REQUIREMENTS } from "@/types/dv-lottery";

export interface DetailedPhotoValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  fileInfo: {
    name: string;
    size: number;
    sizeKB: number;
    type: string;
    dimensions?: {
      width: number;
      height: number;
    };
  };
  requirements: {
    dimensionsOk: boolean;
    sizeOk: boolean;
    formatOk: boolean;
  };
}

/**
 * Enhanced photo validation with detailed feedback
 * @param file - The image file to validate
 * @returns Promise<DetailedPhotoValidation>
 */
export const validatePhotoDetailed = (
  file: File
): Promise<DetailedPhotoValidation> => {
  return new Promise((resolve) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    const fileInfo: {
      name: string;
      size: number;
      sizeKB: number;
      type: string;
      dimensions?: {
        width: number;
        height: number;
      };
    } = {
      name: file.name,
      size: file.size,
      sizeKB: Math.round(file.size / 1024),
      type: file.type,
    };

    // Check file type first
    const formatOk = PHOTO_REQUIREMENTS.allowedFormats.includes(file.type);
    if (!formatOk) {
      errors.push(
        `File format must be JPEG or PNG, not ${file.type
          .split("/")[1]
          .toUpperCase()}`
      );
      suggestions.push("Convert your photo to JPEG or PNG format");
    }

    // Check file size
    const sizeOk = file.size <= PHOTO_REQUIREMENTS.maxSizeBytes;
    if (!sizeOk) {
      errors.push(
        `File size is ${fileInfo.sizeKB}KB, must be under ${
          PHOTO_REQUIREMENTS.maxSizeBytes / 1024
        }KB`
      );
      suggestions.push("Compress your photo or reduce image quality");
    } else if (file.size > PHOTO_REQUIREMENTS.maxSizeBytes * 0.8) {
      warnings.push(
        `File size is ${fileInfo.sizeKB}KB, close to the ${
          PHOTO_REQUIREMENTS.maxSizeBytes / 1024
        }KB limit`
      );
      suggestions.push("Consider slightly compressing to ensure compliance");
    }

    // Check dimensions
    const img = new Image();
    img.onload = () => {
      const dimensions = {
        width: img.width,
        height: img.height,
      };

      fileInfo.dimensions = dimensions;

      const dimensionsOk =
        img.width === PHOTO_REQUIREMENTS.width &&
        img.height === PHOTO_REQUIREMENTS.height;

      if (!dimensionsOk) {
        if (img.width !== img.height) {
          errors.push(
            `Photo must be square (${PHOTO_REQUIREMENTS.width}×${PHOTO_REQUIREMENTS.height}px), current: ${img.width}×${img.height}px`
          );
          suggestions.push(
            "Crop your photo to a square format before uploading"
          );
        } else if (img.width < PHOTO_REQUIREMENTS.width) {
          errors.push(
            `Photo is too small (${img.width}×${img.height}px), must be exactly ${PHOTO_REQUIREMENTS.width}×${PHOTO_REQUIREMENTS.height}px`
          );
          suggestions.push(
            "Use a higher resolution photo or retake with better camera"
          );
        } else if (img.width > PHOTO_REQUIREMENTS.width) {
          errors.push(
            `Photo is too large (${img.width}×${img.height}px), must be exactly ${PHOTO_REQUIREMENTS.width}×${PHOTO_REQUIREMENTS.height}px`
          );
          suggestions.push("Resize your photo to exactly 600×600 pixels");
        }
      }

      // Additional quality checks
      if (file.size < 10 * 1024) {
        // Less than 10KB
        warnings.push(
          "Photo file size is very small, which may indicate poor quality"
        );
        suggestions.push("Ensure your photo is clear and high-quality");
      }

      // File name checks
      if (file.name.length > 50) {
        warnings.push("File name is very long");
        suggestions.push("Consider renaming to a shorter filename");
      }

      const validation: DetailedPhotoValidation = {
        isValid: errors.length === 0,
        errors,
        warnings,
        suggestions,
        fileInfo,
        requirements: {
          dimensionsOk,
          sizeOk,
          formatOk,
        },
      };

      resolve(validation);
      URL.revokeObjectURL(img.src);
    };

    img.onerror = () => {
      errors.push("Unable to read image file - file may be corrupted");
      suggestions.push("Try uploading a different photo");

      const validation: DetailedPhotoValidation = {
        isValid: false,
        errors,
        warnings,
        suggestions,
        fileInfo,
        requirements: {
          dimensionsOk: false,
          sizeOk,
          formatOk,
        },
      };

      resolve(validation);
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Get photo quality score based on validation results
 * @param validation - The detailed validation result
 * @returns number - Quality score from 0 to 100
 */
export const getPhotoQualityScore = (
  validation: DetailedPhotoValidation
): number => {
  let score = 100;

  // Deduct points for errors
  score -= validation.errors.length * 25;

  // Deduct points for warnings
  score -= validation.warnings.length * 10;

  // Bonus points for optimal file size (between 50KB and 200KB)
  if (validation.fileInfo.sizeKB >= 50 && validation.fileInfo.sizeKB <= 200) {
    score += 5;
  }

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
};

/**
 * Get recommendations for improving photo quality
 * @param validation - The detailed validation result
 * @returns string[] - Array of recommendations
 */
export const getPhotoRecommendations = (
  validation: DetailedPhotoValidation
): string[] => {
  const recommendations: string[] = [];

  if (!validation.requirements.dimensionsOk && validation.fileInfo.dimensions) {
    const { width, height } = validation.fileInfo.dimensions;

    if (width !== height) {
      recommendations.push("🔲 Crop your photo to make it perfectly square");
    }

    if (width > PHOTO_REQUIREMENTS.width) {
      recommendations.push("📏 Resize your photo to exactly 600×600 pixels");
    }

    if (width < PHOTO_REQUIREMENTS.width) {
      recommendations.push("📸 Take a new photo with higher resolution");
    }
  }

  if (!validation.requirements.sizeOk) {
    recommendations.push(
      "🗜️ Compress your photo to reduce file size under 240KB"
    );
  }

  if (!validation.requirements.formatOk) {
    recommendations.push("🖼️ Convert your photo to JPEG or PNG format");
  }

  if (validation.fileInfo.sizeKB < 30) {
    recommendations.push("✨ Use a higher quality photo for better results");
  }

  // General DV Lottery photo recommendations
  if (validation.isValid) {
    recommendations.push(
      "✅ Ensure the photo shows your head and shoulders clearly"
    );
    recommendations.push("✅ Use a white or light-colored background");
    recommendations.push("✅ Face the camera directly with eyes open");
    recommendations.push("✅ Remove glasses, hats, or head coverings");
    recommendations.push("✅ Use natural lighting without shadows");
  }

  return recommendations;
};

/**
 * Check if photo can be auto-fixed
 * @param validation - The detailed validation result
 * @returns boolean - Whether auto-fix is possible
 */
export const canAutoFixPhoto = (
  validation: DetailedPhotoValidation
): boolean => {
  // Can auto-fix if format is correct and file isn't corrupted
  return (
    validation.requirements.formatOk &&
    validation.fileInfo.dimensions !== undefined
  );
};

/**
 * Get auto-fix description for a photo
 * @param validation - The detailed validation result
 * @returns string - Description of what auto-fix will do
 */
export const getAutoFixDescription = (
  validation: DetailedPhotoValidation
): string => {
  const fixes: string[] = [];

  if (!validation.requirements.dimensionsOk) {
    fixes.push("resize to 600×600 pixels");
  }

  if (!validation.requirements.sizeOk) {
    fixes.push("compress to under 240KB");
  }

  if (validation.fileInfo.type !== "image/jpeg") {
    fixes.push("convert to JPEG format");
  }

  if (fixes.length === 0) {
    return "Optimize photo for best compatibility";
  }

  return `Auto-fix will: ${fixes.join(", ")}`;
};
