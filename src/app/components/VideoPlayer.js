'use client'

import { useState } from 'react'

export default function VideoPlayer({ url, title }) {
  const [isPlaying, setIsPlaying] = useState(false)

  if (!isPlaying) {
    return (
      <div className="relative bg-maroon-900 rounded-lg aspect-video flex items-center justify-center">
        <button
          onClick={() => setIsPlaying(true)}
          className="bg-gold-500 hover:bg-gold-600 text-white rounded-full p-4 transition-colors duration-200 shadow-lg"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 5v10l8-5-8-5z"/>
          </svg>
        </button>
      </div>
    )
  }

  return (
    <video
      controls
      autoPlay
      className="w-full rounded-lg aspect-video bg-black"
      src={url}
    >
      Your browser does not support the video tag.
    </video>
  )
}
