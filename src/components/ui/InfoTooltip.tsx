// src/components/ui/InfoTooltip.tsx

import React, { useState } from 'react'
import { HelpCircle, Info } from 'lucide-react'

interface InfoTooltipProps {
  content: string
  type?: 'info' | 'help'
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  type = 'info',
  position = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2'
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2'
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2'
      default: // top
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
    }
  }

  const getArrowClasses = () => {
    switch (position) {
      case 'bottom':
        return 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-full border-l-transparent border-r-transparent border-b-gray-800'
      case 'left':
        return 'right-0 top-1/2 transform translate-x-full -translate-y-1/2 border-t-transparent border-b-transparent border-l-gray-800'
      case 'right':
        return 'left-0 top-1/2 transform -translate-x-full -translate-y-1/2 border-t-transparent border-b-transparent border-r-gray-800'
      default: // top
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-gray-800'
    }
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className={`inline-flex items-center justify-center w-5 h-5 rounded-full transition-colors ${
          type === 'help' 
            ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        }`}
      >
        {type === 'help' ? (
          <HelpCircle size={16} />
        ) : (
          <Info size={16} />
        )}
      </button>

      {/* Tooltip */}
      {isVisible && (
        <div
          className={`absolute z-50 ${getPositionClasses()}`}
          style={{ minWidth: '200px', maxWidth: '300px' }}
        >
          <div className="bg-gray-800 text-white text-sm rounded-lg px-3 py-2 shadow-lg">
            {content}
            {/* Arrow */}
            <div
              className={`absolute w-0 h-0 border-4 ${getArrowClasses()}`}
            />
          </div>
        </div>
      )}
    </div>
  )
}