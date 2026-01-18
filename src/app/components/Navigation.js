'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: 'About Me', href: '/', key: 'about' },
    { name: 'Videos', href: '/videos', key: 'videos' },
    { name: 'Pictures', href: '/pictures', key: 'pictures' },
    { name: 'Login', href: '/login', key: 'login' },
  ]

  const getActiveTab = () => {
    if (pathname === '/' || pathname === '/about') return 'about'
    if (pathname === '/videos') return 'videos'
    if (pathname === '/pictures') return 'pictures'
    if (pathname === '/login') return 'login'
    return ''
  }

  const activeTab = getActiveTab()

  return (
    <nav className="bg-white shadow-lg border-b-4 border-gold-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-youthful text-maroon-700">
                Brady R. Crowley's Portfolio
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`tab-button ${activeTab === item.key ? 'active' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-maroon-700 hover:text-gold-600 hover:bg-maroon-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gold-500"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-maroon-50 border-t border-maroon-200">
            {navigation.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  activeTab === item.key
                    ? 'text-gold-600 bg-gold-50'
                    : 'text-maroon-700 hover:text-gold-600 hover:bg-maroon-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
