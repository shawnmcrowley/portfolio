'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '../components/Layout'

export default function Login() {
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Demo OTP - in production this would be generated dynamically
  const demoOTP = '123456'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate API call delay
    setTimeout(() => {
      if (otp === demoOTP) {
        // Store admin session
        if (typeof window !== 'undefined') {
          localStorage.setItem('adminAuthenticated', 'true')
          localStorage.setItem('adminLoginTime', Date.now().toString())
        }
        router.push('/admin')
      } else {
        setError('Invalid OTP. Please try again.')
      }
      setIsLoading(false)
    }, 1000)
  }

  const generateNewOTP = () => {
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString()
    alert(`Demo OTP: ${newOTP}\n\nIn a real application, this would be sent to your registered email or phone.`)
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="card">
          <div className="text-center mb-8">
            <div className="text-6xl text-maroon-400 mb-4">🔐</div>
            <h1 className="text-3xl font-youthful text-maroon-700 mb-2">
              Admin Login
            </h1>
            <p className="text-maroon-600">
              Enter the One Time Password to access the admin panel
            </p>
          </div>

          {/* Demo OTP Display */}
          <div className="bg-gold-50 border border-gold-200 rounded-lg p-4 mb-6">
            <div className="text-center">
              <p className="text-gold-700 text-sm font-semibold mb-2">Demo OTP (for testing):</p>
              <div className="text-2xl font-bold text-gold-800 font-mono tracking-wider">
                {demoOTP}
              </div>
              <button
                onClick={generateNewOTP}
                className="mt-2 text-sm text-gold-600 hover:text-gold-800 underline"
              >
                Generate New Demo OTP
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-semibold text-maroon-700 mb-2">
                One Time Password
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-3 border border-maroon-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-center text-2xl font-mono tracking-widest"
                maxLength={6}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-red-500 mr-2">⚠️</div>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12l-2-2h4l-2 2zM10 2a8 8 0 100 16 8 8 0 000-16z"/>
                  </svg>
                  Verify OTP
                </>
              )}
            </button>
          </form>

          {/* Security Info */}
          <div className="mt-8 pt-6 border-t border-maroon-200">
            <div className="flex items-start space-x-3">
              <div className="text-green-500 mt-1">🛡️</div>
              <div>
                <h4 className="text-sm font-semibold text-maroon-700 mb-1">Secure Access</h4>
                <p className="text-xs text-maroon-600">
                  This admin panel is protected with OTP authentication. Only authorized users with the correct password can upload content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}