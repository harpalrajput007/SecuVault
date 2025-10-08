'use client'

import { useState } from 'react'
import { Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { validateEmail } from '@/lib/utils'
import { authAPI } from '@/lib/api'
import { setUserPassword } from '@/lib/auth'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{email?: string; password?: string; twoFactor?: string}>({})
  const [loading, setLoading] = useState(false)
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false)
  const [twoFactorCode, setTwoFactorCode] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const newErrors: {email?: string; password?: string; twoFactor?: string} = {}
    
    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    if (requiresTwoFactor && twoFactorCode.length !== 6) {
      newErrors.twoFactor = 'Please enter a valid 6-digit code'
    }
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      try {
        if (isLogin) {
          const response = await authAPI.login(email, password, twoFactorCode || undefined)
          console.log('Login response:', response.data)
          
          if (response.data.requiresTwoFactor) {
            setRequiresTwoFactor(true)
            setLoading(false)
            return
          }
          
          console.log('Login successful')
        } else {
          await authAPI.register(email, password)
          console.log('Registration successful')
          const response = await authAPI.login(email, password)
          console.log('Auto-login successful:', response.data)
        }
        
        setUserPassword(password)
        console.log('Password stored, redirecting to dashboard...')
        
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 100)
        
      } catch (error: any) {
        console.error('Auth error:', error)
        const errorMessage = error.response?.data?.error || error.message || 'Authentication failed'
        if (requiresTwoFactor) {
          setErrors({ twoFactor: errorMessage })
        } else {
          setErrors({ email: errorMessage })
        }
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link 
          href="/"
          className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
              <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SecuVault</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="Enter your email"
                disabled={loading}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {requiresTwoFactor && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Two-Factor Authentication Code
                </label>
                <input
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-center text-lg font-mono tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  disabled={loading}
                />
                {errors.twoFactor && <p className="text-red-500 text-sm mt-1">{errors.twoFactor}</p>}
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {loading ? 'Please wait...' : requiresTwoFactor ? 'Verify Code' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <div className="mt-6 text-center">
            {requiresTwoFactor ? (
              <button
                onClick={() => {
                  setRequiresTwoFactor(false)
                  setTwoFactorCode('')
                  setErrors({})
                }}
                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
                disabled={loading}
              >
                ← Back to login
              </button>
            ) : (
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
                disabled={loading}
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}