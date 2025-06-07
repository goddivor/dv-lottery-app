// src/pages/dv-lottery/simple/index.tsx

import React from 'react'
import { DVLotteryForm } from '@/components/forms/DVLotteryForm'
import { FileText, Shield, Clock, Globe } from 'lucide-react'

export const SimpleDVLotteryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DV Lottery Application</h1>
                <p className="text-sm text-gray-600">Diversity Visa Program 2026</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Application Open</span>
              </div>
              <div className="text-gray-500">Deadline: November 5, 2024</div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-200" />
              <div>
                <div className="font-semibold">Secure & Private</div>
                <div className="text-blue-200 text-sm">Your data is protected</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-blue-200" />
              <div>
                <div className="font-semibold">Save as you go</div>
                <div className="text-blue-200 text-sm">Auto-saved locally</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Globe className="w-8 h-8 text-blue-200" />
              <div>
                <div className="font-semibold">Official Format</div>
                <div className="text-blue-200 text-sm">Follows DV requirements</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <DVLotteryForm />

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">
              ⚠️ This is a practice application form
            </p>
            <p className="text-gray-300 text-sm">
              Submit your official application at{' '}
              <a 
                href="https://dvprogram.state.gov" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                dvprogram.state.gov
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}