'use client'

import { useState, useEffect } from 'react'
import { X, Copy, RefreshCw, Shield, Zap, CheckCircle } from 'lucide-react'
import { generatePassword, copyToClipboard } from '@/lib/utils'

interface PasswordGeneratorProps {
  onClose: () => void
}

export default function PasswordGenerator({ onClose }: PasswordGeneratorProps) {
  const [length, setLength] = useState(12)
  const [includeLetters, setIncludeLetters] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeLookAlikes, setExcludeLookAlikes] = useState(true)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [autoCleared, setAutoCleared] = useState(false)
  const [strength, setStrength] = useState(0)

  const calculateStrength = (pwd: string) => {
    let score = 0
    if (pwd.length >= 8) score += 1
    if (pwd.length >= 12) score += 1
    if (/[a-z]/.test(pwd)) score += 1
    if (/[A-Z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd)) score += 1
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1
    return Math.min(score, 5)
  }

  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return 'bg-red-500'
    if (strength <= 3) return 'bg-yellow-500'
    if (strength <= 4) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getStrengthText = (strength: number) => {
    if (strength <= 2) return 'Weak'
    if (strength <= 3) return 'Fair'
    if (strength <= 4) return 'Good'
    return 'Strong'
  }

  const generateNewPassword = () => {
    const newPassword = generatePassword(length, includeLetters, includeNumbers, includeSymbols, excludeLookAlikes)
    setPassword(newPassword)
    setStrength(calculateStrength(newPassword))
    setCopied(false)
    setAutoCleared(false)
  }

  useEffect(() => {
    generateNewPassword()
  }, [length, includeLetters, includeNumbers, includeSymbols, excludeLookAlikes])

  const handleCopy = async () => {
    const success = await copyToClipboard(password)
    if (success) {
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setAutoCleared(true)
        setTimeout(() => setAutoCleared(false), 2000)
      }, 15000)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Password Generator</h2>
                <p className="text-green-100 text-sm">Create secure passwords instantly</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-green-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Generated Password */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-lg font-semibold text-gray-900 dark:text-white">
                Your Secure Password
              </label>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {getStrengthText(strength)}
                </span>
              </div>
            </div>
            
            {/* Password Display */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600 p-4 mb-4">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={password}
                  readOnly
                  className="flex-1 bg-transparent text-lg font-mono text-gray-900 dark:text-white focus:outline-none"
                />
                <button
                  onClick={generateNewPassword}
                  className="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Generate new password"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium flex items-center space-x-2"
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Strength Indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Password Strength</span>
                <span className={`font-medium ${strength >= 4 ? 'text-green-600' : strength >= 3 ? 'text-blue-600' : strength >= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {getStrengthText(strength)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strength)}`}
                  style={{ width: `${(strength / 5) * 100}%` }}
                />
              </div>
            </div>

            {copied && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
                <p className="text-green-700 dark:text-green-300 text-sm flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Password copied! Will auto-clear in 15 seconds for security.
                </p>
              </div>
            )}
            
            {autoCleared && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Clipboard cleared for security
                </p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Length Slider */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Password Length: <span className="text-green-600 dark:text-green-400 font-bold">{length}</span>
                </label>
                <input
                  type="range"
                  min="4"
                  max="50"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #16a34a 0%, #16a34a ${((length - 4) / 46) * 100}%, #e5e7eb ${((length - 4) / 46) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>4</span>
                  <span>50</span>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Include Characters:</h3>
              
              <div className="space-y-3">
                <label className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeLetters}
                    onChange={(e) => setIncludeLetters(e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Letters</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">A-Z, a-z</p>
                  </div>
                </label>

                <label className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Numbers</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">0-9</p>
                  </div>
                </label>

                <label className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Symbols</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">!@#$%^&*</p>
                  </div>
                </label>

                <label className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={excludeLookAlikes}
                    onChange={(e) => setExcludeLookAlikes(e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500 mr-3"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Exclude Look-alikes</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">0, O, l, 1, I</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              💡 Tip: Use unique passwords for each account
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}