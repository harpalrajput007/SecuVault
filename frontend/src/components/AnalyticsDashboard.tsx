'use client'

import { useState, useEffect } from 'react'
import { X, Shield, Key, TrendingUp, AlertTriangle, Star, Calendar } from 'lucide-react'
import { VaultEntry } from '@/types'

interface AnalyticsDashboardProps {
  entries: VaultEntry[]
  onClose: () => void
}

export default function AnalyticsDashboard({ entries, onClose }: AnalyticsDashboardProps) {
  const [stats, setStats] = useState({
    totalEntries: 0,
    favoriteEntries: 0,
    weakPasswords: 0,
    strongPasswords: 0,
    categoryCounts: {} as Record<string, number>,
    recentEntries: 0,
    averagePasswordLength: 0
  })

  useEffect(() => {
    calculateStats()
  }, [entries])

  const calculateStats = () => {
    const categoryCounts: Record<string, number> = {}
    let weakCount = 0
    let strongCount = 0
    let totalLength = 0
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    entries.forEach(entry => {
      // Category counts
      const category = entry.category || 'General'
      categoryCounts[category] = (categoryCounts[category] || 0) + 1

      // Password strength
      const strength = calculatePasswordStrength(entry.password)
      if (strength <= 2) weakCount++
      else if (strength >= 4) strongCount++

      // Password length
      totalLength += entry.password.length

      // Recent entries (created in last week)
      if (new Date(entry.createdAt) > oneWeekAgo) {
        // recentCount++
      }
    })

    setStats({
      totalEntries: entries.length,
      favoriteEntries: entries.filter(e => e.isFavorite).length,
      weakPasswords: weakCount,
      strongPasswords: strongCount,
      categoryCounts,
      recentEntries: entries.filter(e => new Date(e.createdAt) > oneWeekAgo).length,
      averagePasswordLength: entries.length > 0 ? Math.round(totalLength / entries.length) : 0
    })
  }

  const calculatePasswordStrength = (password: string): number => {
    let score = 0
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1
    return Math.min(score, 5)
  }

  const getSecurityScore = (): number => {
    if (stats.totalEntries === 0) return 0
    const strongRatio = stats.strongPasswords / stats.totalEntries
    const weakRatio = stats.weakPasswords / stats.totalEntries
    return Math.round((strongRatio * 100) - (weakRatio * 50))
  }

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const securityScore = getSecurityScore()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-white mr-3" />
              <div>
                <h2 className="text-xl font-bold text-white">Analytics Dashboard</h2>
                <p className="text-green-100 text-sm">Your vault insights</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:text-green-100">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Security Score */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Security Score
              </h3>
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(securityScore)}`}>
                {securityScore}/100
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Based on password strength and security practices
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Entries</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalEntries}</p>
                </div>
                <Key className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Favorites</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.favoriteEntries}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Strong Passwords</p>
                  <p className="text-2xl font-bold text-green-600">{stats.strongPasswords}</p>
                </div>
                <Shield className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Weak Passwords</p>
                  <p className="text-2xl font-bold text-red-600">{stats.weakPasswords}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>

          {/* Categories Breakdown */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Categories Breakdown
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.categoryCounts).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{category}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(count / stats.totalEntries) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="flex items-center space-x-3">
                <Calendar className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.recentEntries}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Entries added this week</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Password Quality
              </h3>
              <div className="flex items-center space-x-3">
                <Key className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averagePasswordLength}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Average password length</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {(stats.weakPasswords > 0 || stats.totalEntries === 0) && (
            <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
                Security Recommendations
              </h3>
              <ul className="space-y-2 text-yellow-700 dark:text-yellow-300 text-sm">
                {stats.weakPasswords > 0 && (
                  <li>• Update {stats.weakPasswords} weak password{stats.weakPasswords > 1 ? 's' : ''} to improve security</li>
                )}
                {stats.totalEntries === 0 && (
                  <li>• Start by adding your most important passwords to SecuVault</li>
                )}
                <li>• Enable two-factor authentication for enhanced security</li>
                <li>• Use the password generator to create strong, unique passwords</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}