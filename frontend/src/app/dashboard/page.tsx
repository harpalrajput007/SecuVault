'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Moon, Sun, LogOut, Shield, Key, BarChart3, Download, Filter, Star } from 'lucide-react'
import { VaultEntry } from '@/types'
import VaultEntryCard from '@/components/VaultEntryCard'
import VaultEntryModal from '@/components/VaultEntryModal'
import PasswordGenerator from '@/components/PasswordGenerator'
import TwoFactorSetup from '@/components/TwoFactorSetup'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import { vaultAPI, authAPI } from '@/lib/api'
import { ClientCrypto } from '@/lib/crypto'
import { getUserPassword, clearUserPassword } from '@/lib/auth'

export default function Dashboard() {
  const [entries, setEntries] = useState<VaultEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showGenerator, setShowGenerator] = useState(false)
  const [show2FA, setShow2FA] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [editingEntry, setEditingEntry] = useState<VaultEntry | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const userPassword = getUserPassword()

  useEffect(() => {
    console.log('Dashboard mounted, checking auth...')
    console.log('User password available:', !!userPassword)
    
    if (!userPassword) {
      console.log('No user password found, redirecting to login')
      window.location.href = '/'
      return
    }
    
    console.log('User authenticated, loading entries...')
    loadEntries()
  }, [userPassword])

  const loadEntries = async (search?: string) => {
    try {
      const response = await vaultAPI.getItems(search)
      const decryptedEntries = response.data.map((item: any) => {
        try {
          return {
            ...ClientCrypto.decryptVaultItem(item, userPassword!),
            id: item._id,
            category: item.category || 'General',
            isFavorite: item.isFavorite || false
          }
        } catch {
          return null
        }
      }).filter(Boolean)
      setEntries(decryptedEntries)
    } catch (error) {
      console.error('Failed to load entries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (userPassword) loadEntries(searchTerm)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const handleSaveEntry = async (entry: Omit<VaultEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('Saving entry:', entry)
      console.log('User password available:', !!userPassword)
      
      const encryptedEntry = ClientCrypto.encryptVaultItem(entry, userPassword!)
      console.log('Entry encrypted successfully')
      
      if (editingEntry) {
        console.log('Updating existing entry:', editingEntry.id)
        await vaultAPI.updateItem(editingEntry.id, encryptedEntry)
      } else {
        console.log('Creating new entry')
        await vaultAPI.createItem(encryptedEntry)
      }
      
      console.log('Entry saved successfully')
      await loadEntries(searchTerm)
      setShowModal(false)
      setEditingEntry(null)
    } catch (error) {
      console.error('Failed to save entry:', error)
      alert('Failed to save entry. Please check the console for details.')
    }
  }

  const handleEditEntry = (entry: VaultEntry) => {
    setEditingEntry(entry)
    setShowModal(true)
  }

  const handleDeleteEntry = async (id: string) => {
    try {
      await vaultAPI.deleteItem(id)
      await loadEntries(searchTerm)
    } catch (error) {
      console.error('Failed to delete entry')
    }
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      clearUserPassword()
      window.location.href = '/'
    } catch (error) {
      clearUserPassword()
      window.location.href = '/'
    }
  }

  const exportToPDF = async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    
    doc.setFontSize(20)
    doc.text('SecuVault - Password Export', 20, 30)
    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40)
    
    let yPosition = 60
    
    filteredEntries.forEach((entry, index) => {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 30
      }
      
      doc.setFontSize(12)
      doc.text(`${index + 1}. ${entry.title}`, 20, yPosition)
      doc.setFontSize(10)
      doc.text(`Username: ${entry.username}`, 30, yPosition + 10)
      doc.text(`Password: ${entry.password}`, 30, yPosition + 20)
      if (entry.url) doc.text(`URL: ${entry.url}`, 30, yPosition + 30)
      if (entry.category) doc.text(`Category: ${entry.category}`, 30, yPosition + 40)
      
      yPosition += 60
    })
    
    doc.save('secuvault-passwords.pdf')
  }

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || entry.category === categoryFilter
    const matchesFavorite = !showFavoritesOnly || entry.isFavorite
    
    return matchesSearch && matchesCategory && matchesFavorite
  })

  const categories = ['All', ...Array.from(new Set(entries.map(e => e.category || 'General')))]

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400 mr-2" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">SecuVault</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowGenerator(true)}
                  className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 rounded-lg transition-colors font-medium"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Generate
                </button>
                <button
                  onClick={() => setShowAnalytics(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg transition-colors font-medium"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </button>
                <button
                  onClick={() => setShow2FA(true)}
                  className="text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
                  title="Setup 2FA"
                >
                  <Shield className="w-5 h-5" />
                </button>
                <button
                  onClick={exportToPDF}
                  className="text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
                  title="Export PDF"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Entry
              </button>
            </div>
            
            {/* Advanced Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showFavoritesOnly 
                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Star className="w-4 h-4 mr-1" />
                Favorites Only
              </button>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {filteredEntries.length} of {entries.length} entries
              </div>
            </div>
          </div>

          {/* Entries Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Loading...</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredEntries.map(entry => (
                  <VaultEntryCard
                    key={entry.id}
                    entry={entry}
                    onEdit={handleEditEntry}
                    onDelete={handleDeleteEntry}
                  />
                ))}
              </div>

              {filteredEntries.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchTerm || categoryFilter !== 'All' || showFavoritesOnly 
                      ? 'No entries found matching your filters.' 
                      : 'No vault entries yet. Add your first entry!'}
                  </p>
                </div>
              )}
            </>
          )}
        </main>

        {/* Modals */}
        {showModal && (
          <VaultEntryModal
            entry={editingEntry}
            onSave={handleSaveEntry}
            onClose={() => {
              setShowModal(false)
              setEditingEntry(null)
            }}
          />
        )}

        {showGenerator && (
          <PasswordGenerator onClose={() => setShowGenerator(false)} />
        )}

        {show2FA && (
          <TwoFactorSetup onClose={() => setShow2FA(false)} />
        )}

        {showAnalytics && (
          <AnalyticsDashboard 
            entries={entries} 
            onClose={() => setShowAnalytics(false)} 
          />
        )}
      </div>
    </div>
  )
}