'use client'

import { useState } from 'react'

export default function ImageViewer({ url, title, onClose }) {
  if (!url) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-5xl max-h-full">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gold-500 text-2xl"
        >
          ✕
        </button>
        <img
          src={url}
          alt={title}
          className="max-w-full max-h-[85vh] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
        <p className="text-white text-center mt-4 text-lg">{title}</p>
      </div>
    </div>
  )
}
