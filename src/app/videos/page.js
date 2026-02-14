'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import VideoPlayer from '@/components/VideoPlayer'
import { listVideos, getFileUrl, formatFileSize } from '@/lib/storage'

export default function Videos() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      setLoading(true)
      
      // List videos from S3 - now includes enhanced metadata
      const videoList = await listVideos()
      
      // Get URLs for each video
      const videosWithUrls = await Promise.all(
        videoList.map(async (video) => {
          const url = await getFileUrl(video.path)
          
          return {
            id: video.path,
            title: video.title,
            description: video.description,
            url: url,
            size: formatFileSize(video.size),
            lastModified: new Date(video.lastModified).toLocaleDateString()
          }
        })
      )
      
      setVideos(videosWithUrls)
    } catch (err) {
      console.error('Error loading videos:', err)
      setError('Failed to load videos. Please check your AWS configuration.')
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
        <div className="max-w-6xl mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto"></div>
          <p className="mt-4 text-maroon-600">Loading videos...</p>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto text-center py-12">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-maroon-700 mb-4">{error}</p>
          <button 
            onClick={loadVideos}
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-youthful text-maroon-700 mb-4">
            My Videos
          </h1>
          <p className="text-xl text-maroon-600 max-w-2xl mx-auto">
            A collection of videos showcasing my journey, projects, and experiences
          </p>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎥</div>
            <p className="text-maroon-600">No videos found in bucket.</p>
            <p className="text-sm text-maroon-500 mt-2">
              Upload videos through the admin panel to see them here.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {videos.map((video) => (
              <div key={video.id} className="card hover:shadow-xl transition-shadow duration-300">
                {/* Video Player */}
                <VideoPlayer url={video.url} title={video.title} />

                {/* Video Info */}
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-maroon-700 mb-2">
                    {video.title}
                  </h3>
                  <p className="text-maroon-600 mb-4">
                    {video.description}
                  </p>
                  
                  <div className="flex justify-between items-center text-sm text-maroon-500 mb-4">
                    <span>Size: {video.size}</span>
                    <span>Added: {video.lastModified}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => window.open(video.url, '_blank')}
                      className="btn-primary flex-1"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 5v10l8-5-8-5z"/>
                      </svg>
                      Play
                    </button>
                    <button 
                      onClick={() => handleDownload(video.url, video.title + '.mp4')}
                      className="btn-secondary"
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
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

        {/* Admin Notice */}
        <div className="mt-12 bg-gold-50 border border-gold-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="text-2xl mr-3">💡</div>
            <h3 className="text-lg font-bold text-gold-800">Video Management</h3>
          </div>
          <p className="text-gold-700 mb-4">
            Want to add or remove videos? Admin users can upload new content through the admin panel.
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
              Max file size: 50MB
            </span>
          </div>
        </div>
      </div>
    </Layout>
  )
}
