'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { uploadVideo, uploadPicture, getMediaMetadata, updateMediaMetadata, listVideos, listPictures, deleteFile, getFileUrl } from '@/lib/storage'

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('upload')
  const [videoFile, setVideoFile] = useState(null)
  const [pictureFile, setPictureFile] = useState(null)
  const [videoTitle, setVideoTitle] = useState('')
  const [pictureTitle, setPictureTitle] = useState('')
  const [videoDescription, setVideoDescription] = useState('')
  const [pictureDescription, setPictureDescription] = useState('')
  const [uploadStatus, setUploadStatus] = useState({ video: '', picture: '' })
  const [uploadProgress, setUploadProgress] = useState({ video: 0, picture: 0 })
  const [videos, setVideos] = useState([])
  const [pictures, setPictures] = useState([])
  const [loadingFiles, setLoadingFiles] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    if (typeof window !== 'undefined') {
      const authStatus = localStorage.getItem('adminAuthenticated')
      const loginTime = localStorage.getItem('adminLoginTime')
      
      if (authStatus === 'true' && loginTime) {
        const timeDiff = Date.now() - parseInt(loginTime)
        // Session expires after 24 hours
        if (timeDiff < 24 * 60 * 60 * 1000) {
          setIsAuthenticated(true)
        } else {
          // Session expired
          localStorage.removeItem('adminAuthenticated')
          localStorage.removeItem('adminLoginTime')
        }
      }
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated && activeTab === 'manage') {
      loadFiles()
    }
  }, [isAuthenticated, activeTab])

  const loadFiles = async () => {
    setLoadingFiles(true)
    try {
      const [videoList, pictureList, metadata] = await Promise.all([
        listVideos(),
        listPictures(),
        getMediaMetadata()
      ])

      const videosWithUrls = await Promise.all(
        videoList.map(async (video) => {
          const url = await getFileUrl(video.path)
          const meta = metadata.videos.find(v => v.key === video.path) || {}
          return {
            id: video.path,
            title: meta.title || video.path.split('/').pop(),
            description: meta.description || '',
            url: url,
            size: formatFileSize(video.size),
            lastModified: new Date(video.lastModified).toLocaleDateString()
          }
        })
      )

      const picturesWithUrls = await Promise.all(
        pictureList.map(async (picture) => {
          const url = await getFileUrl(picture.path)
          const meta = metadata.pictures.find(p => p.key === picture.path) || {}
          return {
            id: picture.path,
            title: meta.title || picture.path.split('/').pop(),
            description: meta.description || '',
            url: url,
            size: formatFileSize(picture.size),
            lastModified: new Date(picture.lastModified).toLocaleDateString()
          }
        })
      )

      setVideos(videosWithUrls)
      setPictures(picturesWithUrls)
    } catch (error) {
      console.error('Error loading files:', error)
      setUploadStatus(prev => ({ ...prev, manage: 'Error loading files' }))
    } finally {
      setLoadingFiles(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('adminLoginTime')
    setIsAuthenticated(false)
    router.push('/')
  }

  const validateVideoFile = (file) => {
    const maxSize = 50 * 1024 * 1024 // 50MB
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm']
    
    if (file.size > maxSize) {
      return 'File size must be less than 50MB'
    }
    if (!allowedTypes.includes(file.type)) {
      return 'Only video files (MP4, AVI, MOV, WMV, WebM) are allowed'
    }
    return null
  }

  const validatePictureFile = (file) => {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    
    if (file.size > maxSize) {
      return 'File size must be less than 10MB'
    }
    if (!allowedTypes.includes(file.type)) {
      return 'Only image files (JPEG, PNG, GIF, WebP) are allowed'
    }
    return null
  }

  const handleVideoUpload = async () => {
    if (!videoFile || !videoTitle.trim()) {
      setUploadStatus(prev => ({ ...prev, video: 'Please select a file and enter a title' }))
      return
    }

    const validationError = validateVideoFile(videoFile)
    if (validationError) {
      setUploadStatus(prev => ({ ...prev, video: validationError }))
      return
    }

    setUploadStatus(prev => ({ ...prev, video: 'Uploading...' }))
    
    try {
      // Upload to S3
      const result = await uploadVideo(
        videoFile,
        videoTitle,
        videoDescription,
        (progress) => {
          const percentage = Math.round((progress.loaded / progress.total) * 100)
          setUploadProgress(prev => ({ ...prev, video: percentage }))
        }
      )
      
      // Update metadata JSON
      const metadata = await getMediaMetadata()
      metadata.videos.push({
        key: result.key,
        title: videoTitle,
        description: videoDescription,
        size: videoFile.size,
        contentType: videoFile.type,
        uploadDate: new Date().toISOString()
      })
      await updateMediaMetadata(metadata)
      
      setUploadStatus(prev => ({ 
        ...prev, 
        video: `✅ "${videoTitle}" uploaded successfully!` 
      }))
      
      // Reset form
      setVideoFile(null)
      setVideoTitle('')
      setVideoDescription('')
      setUploadProgress(prev => ({ ...prev, video: 0 }))
    } catch (error) {
      setUploadStatus(prev => ({ 
        ...prev, 
        video: `❌ Upload failed: ${error.message}` 
      }))
    }
  }

  const handlePictureUpload = async () => {
    if (!pictureFile || !pictureTitle.trim()) {
      setUploadStatus(prev => ({ ...prev, picture: 'Please select a file and enter a title' }))
      return
    }

    const validationError = validatePictureFile(pictureFile)
    if (validationError) {
      setUploadStatus(prev => ({ ...prev, picture: validationError }))
      return
    }

    setUploadStatus(prev => ({ ...prev, picture: 'Uploading...' }))
    
    try {
      // Upload to S3
      const result = await uploadPicture(
        pictureFile,
        pictureTitle,
        pictureDescription,
        (progress) => {
          const percentage = Math.round((progress.loaded / progress.total) * 100)
          setUploadProgress(prev => ({ ...prev, picture: percentage }))
        }
      )
      
      // Update metadata JSON
      const metadata = await getMediaMetadata()
      metadata.pictures.push({
        key: result.key,
        title: pictureTitle,
        description: pictureDescription,
        size: pictureFile.size,
        contentType: pictureFile.type,
        uploadDate: new Date().toISOString()
      })
      await updateMediaMetadata(metadata)
      
      setUploadStatus(prev => ({ 
        ...prev, 
        picture: `✅ "${pictureTitle}" uploaded successfully!` 
      }))
      
      // Reset form
      setPictureFile(null)
      setPictureTitle('')
      setPictureDescription('')
      setUploadProgress(prev => ({ ...prev, picture: 0 }))
    } catch (error) {
      setUploadStatus(prev => ({ 
        ...prev, 
        picture: `❌ Upload failed: ${error.message}` 
      }))
    }
  }

  const handleDeleteFile = async (key, type) => {
    if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      return
    }

    try {
      await deleteFile(key)
      
      // Update metadata
      const metadata = await getMediaMetadata()
      if (type === 'video') {
        metadata.videos = metadata.videos.filter(v => v.key !== key)
      } else {
        metadata.pictures = metadata.pictures.filter(p => p.key !== key)
      }
      await updateMediaMetadata(metadata)
      
      // Reload files
      loadFiles()
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('Failed to delete file: ' + error.message)
    }
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-md mx-auto text-center">
          <div className="card">
            <div className="text-6xl text-red-400 mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-maroon-700 mb-4">
              Access Denied
            </h1>
            <p className="text-maroon-600 mb-6">
              You need to be logged in to access the admin panel.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="btn-primary"
            >
              Go to Login
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-youthful text-maroon-700 mb-2">
              Admin Panel
            </h1>
            <p className="text-maroon-600">
              Upload and manage your portfolio content
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm9 8a1 1 0 100-2 1 1 0 000 2zM7 8a1 1 0 00-1 1v4a1 1 0 001 1h1v1a1 1 0 102 0v-1h1a1 1 0 001-1V9a1 1 0 00-1-1H7z" clipRule="evenodd"/>
            </svg>
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-maroon-100 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 px-4 rounded-md font-semibold transition-colors ${
              activeTab === 'upload'
                ? 'bg-white text-maroon-700 shadow-sm'
                : 'text-maroon-600 hover:text-maroon-800'
            }`}
          >
            <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"/>
            </svg>
            Upload Content
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex-1 py-3 px-4 rounded-md font-semibold transition-colors ${
              activeTab === 'manage'
                ? 'bg-white text-maroon-700 shadow-sm'
                : 'text-maroon-600 hover:text-maroon-800'
            }`}
          >
            <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Manage Files
          </button>
        </div>

        {activeTab === 'upload' && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Video Upload */}
            <div className="card">
              <div className="flex items-center mb-6">
                <div className="text-3xl mr-3">🎥</div>
                <h2 className="text-2xl font-bold text-maroon-700">Upload Videos</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-maroon-700 mb-2">
                    Video Title
                  </label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Enter video title"
                    className="w-full px-4 py-2 border border-maroon-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-maroon-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    placeholder="Enter video description"
                    rows={3}
                    className="w-full px-4 py-2 border border-maroon-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-maroon-700 mb-2">
                    Video File
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    className="w-full px-4 py-2 border border-maroon-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  />
                  <p className="text-sm text-maroon-500 mt-1">
                    Max file size: 50MB | Formats: MP4, AVI, MOV, WMV, WebM
                  </p>
                </div>

                {videoFile && (
                  <div className="bg-maroon-50 p-3 rounded-lg">
                    <p className="text-sm text-maroon-700">
                      <strong>Selected:</strong> {videoFile.name}
                    </p>
                    <p className="text-sm text-maroon-600">
                      Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                )}

                {uploadProgress.video > 0 && uploadProgress.video < 100 && (
                  <div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <div 
                        className="bg-gold-500 h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress.video}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-maroon-600">{uploadProgress.video}% uploaded</p>
                  </div>
                )}

                <button
                  onClick={handleVideoUpload}
                  disabled={!videoFile || !videoTitle.trim()}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"/>
                  </svg>
                  Upload Video
                </button>

                {uploadStatus.video && (
                  <div className={`p-3 rounded-lg ${
                    uploadStatus.video.includes('✅') 
                      ? 'bg-green-50 border border-green-200 text-green-700'
                      : uploadStatus.video.includes('❌')
                      ? 'bg-red-50 border border-red-200 text-red-700'
                      : 'bg-blue-50 border border-blue-200 text-blue-700'
                  }`}>
                    {uploadStatus.video}
                  </div>
                )}
              </div>
            </div>

            {/* Picture Upload */}
            <div className="card">
              <div className="flex items-center mb-6">
                <div className="text-3xl mr-3">📸</div>
                <h2 className="text-2xl font-bold text-maroon-700">Upload Pictures</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-maroon-700 mb-2">
                    Picture Title
                  </label>
                  <input
                    type="text"
                    value={pictureTitle}
                    onChange={(e) => setPictureTitle(e.target.value)}
                    placeholder="Enter picture title"
                    className="w-full px-4 py-2 border border-maroon-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-maroon-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={pictureDescription}
                    onChange={(e) => setPictureDescription(e.target.value)}
                    placeholder="Enter picture description"
                    rows={3}
                    className="w-full px-4 py-2 border border-maroon-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-maroon-700 mb-2">
                    Picture File
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPictureFile(e.target.files[0])}
                    className="w-full px-4 py-2 border border-maroon-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  />
                  <p className="text-sm text-maroon-500 mt-1">
                    Max file size: 10MB | Formats: JPEG, PNG, GIF, WebP
                  </p>
                </div>

                {pictureFile && (
                  <div className="bg-maroon-50 p-3 rounded-lg">
                    <p className="text-sm text-maroon-700">
                      <strong>Selected:</strong> {pictureFile.name}
                    </p>
                    <p className="text-sm text-maroon-600">
                      Size: {(pictureFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                )}

                {uploadProgress.picture > 0 && uploadProgress.picture < 100 && (
                  <div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <div 
                        className="bg-gold-500 h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress.picture}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-maroon-600">{uploadProgress.picture}% uploaded</p>
                  </div>
                )}

                <button
                  onClick={handlePictureUpload}
                  disabled={!pictureFile || !pictureTitle.trim()}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"/>
                  </svg>
                  Upload Picture
                </button>

                {uploadStatus.picture && (
                  <div className={`p-3 rounded-lg ${
                    uploadStatus.picture.includes('✅') 
                      ? 'bg-green-50 border border-green-200 text-green-700'
                      : uploadStatus.picture.includes('❌')
                      ? 'bg-red-50 border border-red-200 text-red-700'
                      : 'bg-blue-50 border border-blue-200 text-blue-700'
                  }`}>
                    {uploadStatus.picture}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="space-y-8">
            {/* Videos Section */}
            <div className="card">
              <h2 className="text-2xl font-bold text-maroon-700 mb-6">Manage Videos</h2>
              
              {loadingFiles ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500 mx-auto"></div>
                  <p className="mt-4 text-maroon-600">Loading videos...</p>
                </div>
              ) : videos.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🎥</div>
                  <p className="text-maroon-600">No videos uploaded yet.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {videos.map((video) => (
                    <div key={video.id} className="border border-maroon-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-maroon-700">{video.title}</h3>
                        <button
                          onClick={() => handleDeleteFile(video.id, 'video')}
                          className="text-red-500 hover:text-red-700"
                          title="Delete video"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-maroon-600 mb-2">{video.description}</p>
                      <div className="flex justify-between text-xs text-maroon-500">
                        <span>Size: {video.size}</span>
                        <span>Added: {video.lastModified}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pictures Section */}
            <div className="card">
              <h2 className="text-2xl font-bold text-maroon-700 mb-6">Manage Pictures</h2>
              
              {loadingFiles ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500 mx-auto"></div>
                  <p className="mt-4 text-maroon-600">Loading pictures...</p>
                </div>
              ) : pictures.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📸</div>
                  <p className="text-maroon-600">No pictures uploaded yet.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  {pictures.map((picture) => (
                    <div key={picture.id} className="border border-maroon-200 rounded-lg p-4">
                      <img
                        src={picture.url}
                        alt={picture.title}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-maroon-700 text-sm">{picture.title}</h3>
                        <button
                          onClick={() => handleDeleteFile(picture.id, 'picture')}
                          className="text-red-500 hover:text-red-700"
                          title="Delete picture"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                          </svg>
                        </button>
                      </div>
                      <p className="text-xs text-maroon-600 mb-2">{picture.description}</p>
                      <div className="flex justify-between text-xs text-maroon-500">
                        <span>Size: {picture.size}</span>
                        <span>{picture.lastModified}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
