// src/lib/photo-utils.ts

import { PHOTO_REQUIREMENTS } from '@/types/dv-lottery'

/**
 * Resizes an image file to the exact DV Lottery requirements (600x600px)
 * @param file - The original image file
 * @param quality - JPEG quality (0.1 to 1.0, default 0.9)
 * @returns Promise<File> - The resized image file
 */
export const resizeImageToRequirements = (
  file: File, 
  quality: number = 0.9
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    if (!ctx) {
      reject(new Error('Could not get canvas context'))
      return
    }

    img.onload = () => {
      // Set canvas to required dimensions
      canvas.width = PHOTO_REQUIREMENTS.width
      canvas.height = PHOTO_REQUIREMENTS.height

      // Fill with white background
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Calculate scaling to maintain aspect ratio while filling the canvas
      const scale = Math.max(
        canvas.width / img.width,
        canvas.height / img.height
      )

      const scaledWidth = img.width * scale
      const scaledHeight = img.height * scale

      // Center the image
      const x = (canvas.width - scaledWidth) / 2
      const y = (canvas.height - scaledHeight) / 2

      // Draw the image
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight)

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob from canvas'))
            return
          }

          // Create a new File object
          const resizedFile = new File(
            [blob],
            `resized_${file.name}`,
            {
              type: 'image/jpeg',
              lastModified: Date.now()
            }
          )

          resolve(resizedFile)
        },
        'image/jpeg',
        quality
      )
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    // Load the image
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Compresses an image file to meet size requirements
 * @param file - The image file to compress
 * @param maxSizeBytes - Maximum file size in bytes
 * @param initialQuality - Starting quality (default 0.9)
 * @returns Promise<File> - The compressed image file
 */
export const compressImageToSize = async (
  file: File,
  maxSizeBytes: number = PHOTO_REQUIREMENTS.maxSizeBytes,
  initialQuality: number = 0.9
): Promise<File> => {
  let quality = initialQuality
  let compressedFile = file

  // If file is already small enough, return as is
  if (file.size <= maxSizeBytes) {
    return file
  }

  while (quality > 0.1 && compressedFile.size > maxSizeBytes) {
    quality -= 0.1
    compressedFile = await resizeImageToRequirements(file, quality)
  }

  return compressedFile
}

/**
 * Process an image file to meet all DV Lottery requirements
 * @param file - The original image file
 * @returns Promise<File> - The processed image file
 */
export const processImageForDVLottery = async (file: File): Promise<File> => {
  try {
    // First resize to correct dimensions
    let processedFile = await resizeImageToRequirements(file, 0.9)

    // Then compress if needed
    processedFile = await compressImageToSize(processedFile)

    return processedFile
  } catch (error) {
    throw new Error(`Failed to process image: ${error}`)
  }
}

/**
 * Validates image dimensions
 * @param file - The image file to validate
 * @returns Promise<{width: number, height: number, isValid: boolean}>
 */
export const validateImageDimensions = (file: File): Promise<{
  width: number
  height: number
  isValid: boolean
}> => {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      const isValid = img.width === PHOTO_REQUIREMENTS.width && 
                     img.height === PHOTO_REQUIREMENTS.height

      resolve({
        width: img.width,
        height: img.height,
        isValid
      })

      URL.revokeObjectURL(img.src)
    }

    img.onerror = () => {
      reject(new Error('Failed to load image for dimension validation'))
    }

    img.src = URL.createObjectURL(file)
  })
}

/**
 * Creates a preview URL for an image file
 * @param file - The image file
 * @returns string - Preview URL
 */
export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file)
}

/**
 * Revokes a preview URL to free memory
 * @param url - The preview URL to revoke
 */
export const revokeImagePreview = (url: string): void => {
  URL.revokeObjectURL(url)
}

/**
 * Gets image file information
 * @param file - The image file
 * @returns Object with file information
 */
export const getImageInfo = async (file: File) => {
  const dimensions = await validateImageDimensions(file)
  
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    sizeKB: Math.round(file.size / 1024),
    dimensions,
    lastModified: new Date(file.lastModified)
  }
}