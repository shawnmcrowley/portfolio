'use client'

import { useState, useRef, useEffect } from 'react'

export default function VideoPlayer({ url, title }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [canPlay, setCanPlay] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    // Reset state when URL changes
    setIsPlaying(false)
    setError(null)
    setLoading(false)
    setCanPlay(false)
  }, [url])

  const handlePlayClick = () => {
    setLoading(true)
    setIsPlaying(true)
  }

  const handleVideoError = (e) => {
    console.error('Video playback error:', e)
    console.error('Video error code:', videoRef.current?.error?.code)
    console.error('Video error message:', videoRef.current?.error?.message)
    setError('Unable to play video. Try opening in a new tab.')
    setLoading(false)
  }

  const handleLoadedMetadata = () => {
    console.log('Video metadata loaded')
    setCanPlay(true)
  }

  const handleCanPlay = () => {
    console.log('Video can play')
    setLoading(false)
    setCanPlay(true)
    
    // Try to play if autoplay is enabled
    if (videoRef.current && isPlaying) {
      videoRef.current.play().catch(err => {
        console.warn('Autoplay prevented:', err)
      })
    }
  }

  const handleWaiting = () => {
    setLoading(true)
  }

  const handlePlaying = () => {
    setLoading(false)
  }

  if (error) {
    return (
      <div className="relative bg-maroon-900 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <div className="text-4xl mb-2">⚠️</div>
            <p className="text-sm mb-3">{error}</p>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gold-400 hover:text-gold-300 underline text-sm"
            >
              Open in new tab →
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (!isPlaying) {
    return (
      <div 
        className="relative bg-maroon-900 rounded-lg overflow-hidden cursor-pointer group"
        style={{ aspectRatio: '16/9' }}
        onClick={handlePlayClick}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            className="bg-gold-500 hover:bg-gold-600 text-white rounded-full p-4 transition-all duration-200 shadow-lg transform hover:scale-110"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 5v10l8-5-8-5z"/>
            </svg>
          </button>
        </div>
        <p className="absolute bottom-4 left-0 right-0 text-center text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          Click to play
        </p>
      </div>
    )
  }

  return (
    <div 
      className="relative rounded-lg overflow-hidden bg-black"
      style={{ aspectRatio: '16/9' }}
    >
      {/* Loading spinner */}
      {(loading || !canPlay) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold-500"></div>
        </div>
      )}
      
      {/* Video element */}
      <video
        ref={videoRef}
        controls
        autoPlay
        playsInline
        muted={false}
        preload="auto"
        className="w-full h-full block"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block'
        }}
        src={url}
        onError={handleVideoError}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
