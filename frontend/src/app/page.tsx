'use client'

import { useState } from 'react'
import { Shield, Lock, Key, Eye, Moon, Sun, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        {/* Navigation */}
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400 mr-2" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">SecuVault</span>
              </div>
              
              <div className="flex items-center space-x-6">
                <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  About Us
                </a>
                <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  Contact
                </a>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <Link
                  href="/auth"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-8">
              <Shield className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Your Passwords,
              <span className="text-green-600 dark:text-green-400"> Secured</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              SecuVault is a privacy-first password manager with client-side encryption. 
              Your passwords are encrypted in your browser before they ever reach our servers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth"
                className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <button className="px-8 py-4 border-2 border-green-600 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 font-semibold rounded-lg transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose SecuVault?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Built with security and privacy as our top priorities
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-6">
                  <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Client-Side Encryption
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your passwords are encrypted in your browser before transmission. We never see your plaintext data.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-6">
                  <Key className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Password Generator
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Generate strong, unique passwords with customizable options and instant copy-to-clipboard.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-6">
                  <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Zero-Knowledge
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We can&apos;t see your passwords even if we wanted to. Your data is encrypted with your master password.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Enterprise-Grade Security
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  Your security is our priority. SecuVault uses industry-standard encryption and security practices.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">AES-256 encryption with PBKDF2</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Optional two-factor authentication</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Auto-clear clipboard for security</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">No plaintext data in our servers</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-gray-800 p-8 rounded-2xl">
                <div className="text-center">
                  <Shield className="w-24 h-24 text-green-600 dark:text-green-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Your Data, Your Control
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    With client-side encryption, you&apos;re the only one who can decrypt your passwords. 
                    Not even we can access your data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-green-600 dark:bg-green-700">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Secure Your Passwords?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Join thousands of users who trust SecuVault with their digital security.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Using SecuVault
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="bg-gray-900 dark:bg-black text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <Shield className="w-8 h-8 text-green-400 mr-2" />
                  <span className="text-xl font-bold">SecuVault</span>
                </div>
                <p className="text-gray-400">
                  Privacy-first password manager with client-side encryption.
                </p>
              </div>
              
              <div id="about">
                <h3 className="text-lg font-semibold mb-4">About Us</h3>
                <p className="text-gray-400">
                  SecuVault was built with one mission: to provide secure, private password management 
                  that puts users in complete control of their data.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <p className="text-gray-400">
                  Questions or feedback?<br />
                  Email: hello@secuvault.com<br />
                  Built with ❤️ for security
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 SecuVault. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}