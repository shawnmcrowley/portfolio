'use client'

import { useEffect, useState } from 'react'

export default function ServiceWorkerRegistration() {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (!('serviceWorker' in navigator)) {
      console.log('[SW] Service Worker not supported')
      setStatus('not-supported')
      return
    }

    const registerSW = async () => {
      try {
        console.log('[SW] Starting registration...')
        
        // Unregister any existing service workers first (clean slate)
        const existingRegistrations = await navigator.serviceWorker.getRegistrations()
        for (const reg of existingRegistrations) {
          if (reg.scope === window.location.origin + '/') {
            console.log('[SW] Found existing registration, updating...')
          }
        }
        
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'imports'
        })
        
        console.log('[SW] Registered successfully:', registration.scope)
        setStatus('registered')

        // Handle state changes
        const handleStateChange = () => {
          const sw = registration.installing || registration.waiting || registration.active
          if (sw) {
            console.log('[SW] State:', sw.state)
            
            if (sw.state === 'redundant') {
              console.warn('[SW] Service worker became redundant - will retry')
              // Force re-registration after a delay
              setTimeout(() => {
                registration.update()
              }, 5000)
            }
          }
        }

        if (registration.installing) {
          registration.installing.addEventListener('statechange', handleStateChange)
        }
        if (registration.waiting) {
          registration.waiting.addEventListener('statechange', handleStateChange)
        }
        if (registration.active) {
          registration.active.addEventListener('statechange', handleStateChange)
        }

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          console.log('[SW] Update found, installing...')
          
          newWorker.addEventListener('statechange', () => {
            console.log('[SW] New worker state:', newWorker.state)
            
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[SW] New version available, reloading recommended')
            }
          })
        })

      } catch (error) {
        console.error('[SW] Registration failed:', error)
        setStatus('failed')
      }
    }

    // Register immediately
    registerSW()

    // Also register on load
    if (document.readyState === 'loading') {
      window.addEventListener('load', registerSW)
      return () => window.removeEventListener('load', registerSW)
    }
  }, [])

  return null
}
