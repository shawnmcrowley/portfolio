'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import ImageViewer from '@/components/ImageViewer'
import { listPictures, getFileUrl, formatFileSize } from '@/lib/storage'

export default function Pictures() {
  const [pictures, setPictures] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    loadPictures()
  }, [])

  const loadPictures = async () => {
    try {
      setLoading(true)
      
      // List pictures from S3 - now includes enhanced metadata
      const pictureList = await listPictures()
      
      // Get URLs for each picture
      const picturesWithUrls = await Promise.all(
        pictureList.map(async (picture) => {
          const url = await getFileUrl(picture.path)
          
          return {
            id: picture.path,
            title: picture.title,
            description: picture.description,
            url: url,
            size: formatFileSize(picture.size),
            lastModified: new Date(picture.lastModified).toLocaleDateString()
          }
        })
      )
      
      setPictures(picturesWithUrls)
    } catch (err) {
      console.error('Error loading pictures:', err)
      setError('Failed to load pictures. Please check your AWS configuration.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (url, filename) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto"></div>
          <p className="mt-4 text-maroon-600">Loading pictures...</p>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-maroon-700 mb-4">{error}</p>
          <button 
            onClick={loadPictures}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-youthful text-maroon-700 mb-4">
            My Pictures
          </h1>
          <p className="text-xl text-maroon-600 max-w-2xl mx-auto">
            A curated collection of photography capturing moments, places, and experiences
          </p>
        </div>

        {pictures.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📸</div>
            <p className="text-maroon-600">No pictures found in bucket.</p>
            <p className="text-sm text-maroon-500 mt-2">
              Upload pictures through the admin panel to see them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pictures.map((picture) => (
              <div key={picture.id} className="card hover:shadow-xl transition-all duration-300 group">
                {/* Image Preview */}
                <div 
                  className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-gradient-to-br from-maroon-100 to-gold-100 cursor-pointer"
                  onClick={() => setSelectedImage(picture)}
                >
                  <img
                    src={picture.url}
                    alt={picture.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <button className="bg-white text-maroon-700 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold">
                      View Full Size
                    </button>
                  </div>
                </div>

                {/* Picture Info */}
                <div>
                  <h3 className="text-lg font-bold text-maroon-700 mb-2">
                    {picture.title}
                  </h3>
                  <p className="text-maroon-600 text-sm mb-3">
                    {picture.description}
                  </p>
                  
                  <div className="flex justify-between items-center text-xs text-maroon-500 mb-4">
                    <span>Size: {picture.size}</span>
                    <span>{picture.lastModified}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedImage(picture)}
                      className="btn-primary flex-1 text-sm"
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
                      </svg>
                      View
                    </button>
                    <button 
                      onClick={() => handleDownload(picture.url, picture.title + '.jpg')}
                      className="btn-secondary text-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4v12h12V4H4zm0 14V6h8v12H4z"/>
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Image Viewer Modal */}
        {selectedImage && (
          <ImageViewer
            url={selectedImage.url}
            title={selectedImage.title}
            onClose={() => setSelectedImage(null)}
          />
        )}

        {/* Admin Notice */}
        <div className="mt-12 bg-gold-50 border border-gold-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="text-2xl mr-3">🖼️</div>
            <h3 className="text-lg font-bold text-gold-800">Photo Management</h3>
          </div>
          <p className="text-gold-700 mb-4">
            Looking to add new photos to the gallery? Admin users can upload new images through the admin panel.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="/login" className="btn-primary inline-flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12l-2-2h4l-2 2zM10 2a8 8 0 100 16 8 8 0 000-16z"/>
              </svg>
              Admin Login
            </a>
            <span className="text-sm text-gold-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
              </svg>
              Max file size: 10MB
            </span>
          </div>
        </div>
      </div>
    </Layout>
  )
}
