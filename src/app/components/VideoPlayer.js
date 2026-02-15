'use client'

import { useState, useRef, useEffect } from 'react'

export default function VideoPlayer({ url, title }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    // Reset state when URL changes
    setIsPlaying(false)
    setError(null)
    setLoading(false)
  }, [url])

  const handlePlayClick = () => {
    setLoading(true)
    setIsPlaying(true)
  }

  const handleVideoError = (e) => {
    console.error('Video playback error:', e)
    setError('Unable to play video. Try opening in a new tab.')
    setLoading(false)
  }

  const handleVideoLoad = () => {
    setLoading(false)
  }

  if (error) {
    return (
      <div className="relative bg-maroon-900 rounded-lg aspect-video flex items-center justify-center">
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
    )
  }

  if (!isPlaying) {
    return (
      <div className="relative bg-maroon-900 rounded-lg aspect-video flex items-center justify-center group">
        <button
          onClick={handlePlayClick}
          className="bg-gold-500 hover:bg-gold-600 text-white rounded-full p-4 transition-colors duration-200 shadow-lg transform hover:scale-105"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 5v10l8-5-8-5z"/>
          </svg>
        </button>
        <p className="absolute bottom-4 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          Click to play
        </p>
      </div>
    )
  }

  return (
    <div className="relative rounded-lg aspect-video bg-black overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
        </div>
      )}
      <video
        ref={videoRef}
        controls
        autoPlay
        playsInline
        className="w-full h-full rounded-lg"
        src={url}
        onError={handleVideoError}
        onLoadedData={handleVideoLoad}
        onCanPlay={handleVideoLoad}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
