'use client'

import { useState } from 'react'
import { X, Shield, Smartphone, CheckCircle } from 'lucide-react'
import { authAPI } from '@/lib/api'

interface TwoFactorSetupProps {
  onClose: () => void
}

export default function TwoFactorSetup({ onClose }: TwoFactorSetupProps) {
  const [step, setStep] = useState(1)
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSetup2FA = async () => {
    setLoading(true)
    try {
      const response = await authAPI.setup2FA()
      setQrCode(response.data.qrCode)
      setSecret(response.data.secret)
      setStep(2)
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to setup 2FA')
    }
    setLoading(false)
  }

  const handleVerify = async () => {
    setLoading(true)
    try {
      await authAPI.verify2FA(verificationCode)
      setStep(3)
    } catch (error: any) {
      setError(error.response?.data?.error || 'Invalid verification code')
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md scrollbar-hide">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-white mr-3" />
              <div>
                <h2 className="text-xl font-bold text-white">Two-Factor Authentication</h2>
                <p className="text-green-100 text-sm">Secure your account</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:text-green-100">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Enable Two-Factor Authentication
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Add an extra layer of security to your account using an authenticator app like Google Authenticator or Authy.
                </p>
              </div>
              <button
                onClick={handleSetup2FA}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Setting up...' : 'Setup 2FA'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Scan QR Code
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Scan this QR code with your authenticator app
                </p>
                {qrCode && (
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
                  </div>
                )}
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Manual entry key:</p>
                  <code className="text-sm font-mono text-gray-900 dark:text-white break-all">{secret}</code>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-center text-lg font-mono"
                  maxLength={6}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <button
                onClick={handleVerify}
                disabled={loading || verificationCode.length !== 6}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Verifying...' : 'Verify & Enable'}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  2FA Enabled Successfully!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Your account is now protected with two-factor authentication. You&apos;ll need to enter a code from your authenticator app when signing in.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}