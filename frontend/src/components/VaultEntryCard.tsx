'use client'

import { useState } from 'react'
import { Eye, EyeOff, Copy, Edit, Trash2, ExternalLink, Star, Tag } from 'lucide-react'
import { VaultEntry } from '@/types'
import { copyToClipboard } from '@/lib/utils'

interface VaultEntryCardProps {
  entry: VaultEntry
  onEdit: (entry: VaultEntry) => void
  onDelete: (id: string) => void
}

export default function VaultEntryCard({ entry, onEdit, onDelete }: VaultEntryCardProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = async (text: string, type: string) => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopied(type)
      setTimeout(() => {
        setCopied(null)
        navigator.clipboard.writeText('')
      }, 15000)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{entry.title}</h3>
            {entry.isFavorite && (
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
            )}
          </div>
          {entry.category && (
            <div className="flex items-center space-x-1 mb-2">
              <Tag className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {entry.category}
              </span>
            </div>
          )}
          {entry.url && (
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm inline-flex items-center mt-1"
            >
              {entry.url}
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(entry)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Username</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-900 dark:text-white font-mono">{entry.username}</span>
            <button
              onClick={() => handleCopy(entry.username, 'username')}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Password</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-900 dark:text-white font-mono">
              {showPassword ? entry.password : '••••••••'}
            </span>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleCopy(entry.password, 'password')}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {entry.notes && (
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">{entry.notes}</p>
          </div>
        )}
      </div>

      {copied && (
        <div className="mt-3 text-xs text-green-600 dark:text-green-400">
          {copied} copied to clipboard!
        </div>
      )}
    </div>
  )
}