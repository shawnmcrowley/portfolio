'use client'

import { useEffect, useState } from 'react'

export default function ServiceWorkerRegistration() {
  const [registrationStatus, setRegistrationStatus] = useState('checking')

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported in this browser')
      setRegistrationStatus('not-supported')
      return
    }

    // Register service worker
    const registerSW = async () => {
      try {
        console.log('Attempting to register Service Worker...')
        
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        })
        
        console.log('Service Worker registered successfully:', registration)
        setRegistrationStatus('registered')

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          console.log('Service Worker update found:', newWorker)
          
          newWorker.addEventListener('statechange', () => {
            console.log('Service Worker state changed:', newWorker.state)
            
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New Service Worker installed, page will refresh on next visit')
            }
          })
        })

        // Check if service worker is active
        if (registration.active) {
          console.log('Service Worker is active')
        } else if (registration.installing) {
          console.log('Service Worker is installing...')
        } else if (registration.waiting) {
          console.log('Service Worker is waiting')
        }

      } catch (error) {
        console.error('Service Worker registration failed:', error)
        setRegistrationStatus('failed')
        
        // Log more details about the error
        if (error.name === 'TypeError') {
          console.error('This might be because sw.js is not accessible at /sw.js')
        }
      }
    }

    // Wait for page to load before registering
    if (document.readyState === 'complete') {
      registerSW()
    } else {
      window.addEventListener('load', registerSW)
    }

    // Cleanup
    return () => {
      window.removeEventListener('load', registerSW)
    }
  }, [])

  // This component doesn't render anything visible
  return null
}
