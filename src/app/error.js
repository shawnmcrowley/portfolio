'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-50 to-gold-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="card">
          <div className="text-6xl text-red-400 mb-6">⚠️</div>
          
          <h1 className="text-4xl font-youthful text-maroon-700 mb-4">
            Something Went Wrong
          </h1>
          
          <p className="text-maroon-600 mb-8">
            We're sorry, but something unexpected happened. Our team has been notified and is working to fix the issue.
          </p>
          
          {process.env.NODE_ENV === 'development' && error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-sm font-semibold text-red-800 mb-2">Error Details (Development):</h3>
              <pre className="text-xs text-red-700 overflow-auto max-h-32">
                {error.message}
              </pre>
            </div>
          )}
          
          <div className="space-y-4">
            <button
              onClick={reset}
              className="inline-flex items-center px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
              </svg>
              Try Again
            </button>
            
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-maroon-600 hover:bg-maroon-700 text-white font-semibold rounded-lg transition-colors duration-200 ml-4"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
              Go Home
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-maroon-200">
            <p className="text-sm text-maroon-500 mb-4">
              Need help? Try these sections:
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/videos"
                className="text-gold-600 hover:text-gold-800 font-medium transition-colors"
              >
                🎥 Videos
              </Link>
              <Link
                href="/pictures"
                className="text-gold-600 hover:text-gold-800 font-medium transition-colors"
              >
                📸 Pictures
              </Link>
              <Link
                href="/about"
                className="text-gold-600 hover:text-gold-800 font-medium transition-colors"
              >
                👤 About Me
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}