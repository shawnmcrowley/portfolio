'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-50 to-gold-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="card">
          <div className="text-6xl text-maroon-400 mb-6">🔍</div>
          
          <h1 className="text-4xl font-youthful text-maroon-700 mb-4">
            Page Not Found
          </h1>
          
          <p className="text-maroon-600 mb-8">
            Oops! The page you're looking for doesn't exist. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
              </svg>
              Go Home
            </Link>
            
            <div className="pt-4 border-t border-maroon-200">
              <p className="text-sm text-maroon-500 mb-4">
                Or try these sections:
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
                  href="/admin"
                  className="text-gold-600 hover:text-gold-800 font-medium transition-colors"
                >
                  ⚙️ Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}