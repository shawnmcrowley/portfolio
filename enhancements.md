# AWS S3 Upload Enhancement Plan

## Executive Summary

This plan outlines the integration of AWS S3 storage with AWS Amplify for the portfolio website, enabling real file uploads, storage, and display of videos and pictures with metadata support—all without requiring a dedicated database.

---

## 1. Architecture Overview

### 1.1 Storage Structure

```
S3 Bucket Structure:
├── videos/
│   ├── video-file-1.mp4
│   ├── video-file-2.mp4
│   └── ...
├── pictures/
│   ├── picture-1.jpg
│   ├── picture-2.png
│   └── ...
└── metadata/
    └── media-metadata.json    # Stores descriptions, titles, upload dates
```

### 1.2 Metadata Storage Strategy (No Database Required)

**Primary Solution: S3 Object Metadata + JSON Manifest**

Since we cannot use a dedicated database in AWS Amplify, we'll use a hybrid approach:

1. **S3 Object Metadata**: Store basic info (title, description) as S3 object metadata during upload
2. **JSON Manifest File**: Maintain a single `media-metadata.json` file in the `metadata/` folder containing:
   - File key (S3 path)
   - Title
   - Description
   - Upload date
   - File size
   - Content type
   - Last modified

**Benefits:**
- No database infrastructure needed
- Simple to implement and maintain
- Cost-effective (only S3 storage costs)
- Easy backup (single JSON file)
- Version control possible with S3 versioning

---

## 2. Implementation Phases

### Phase 1: AWS Amplify Storage Setup

#### 2.1.1 Install Dependencies

```bash
npm install aws-amplify @aws-amplify/storage
```

#### 2.1.2 Configure Amplify Storage

Create `amplify/storage/resource.ts`:

```typescript
import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'portfolioStorage',
  access: (allow) => ({
    // Public read access for videos and pictures
    'videos/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
    'pictures/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
    // Only authenticated users can read/write metadata
    'metadata/*': [
      allow.authenticated.to(['read', 'write', 'delete'])
    ]
  })
});
```

#### 2.1.3 Update Backend Configuration

Update `amplify/backend.ts`:

```typescript
import { defineBackend } from '@aws-amplify/backend';
import { storage } from './storage/resource';

defineBackend({
  storage
});
```

#### 2.1.4 Configure Amplify in Application

Update `src/app/layout.js` to configure Amplify:

```javascript
import { Amplify } from 'aws-amplify';
import amplifyconfig from '@/amplifyconfiguration.json';

Amplify.configure(amplifyconfig);
```

---

### Phase 2: Update Authentication (OTP Change)

#### 2.2.1 Update Login Page

**File:** `src/app/login/page.js`

**Changes Required:**
1. Change `demoOTP` from `'123456'` to `'021612'`
2. Remove demo labels and generate new OTP functionality
3. Update UI to remove demo indicators

**Implementation:**

```javascript
// Line 14: Change from
const demoOTP = '123456'
// To:
const correctOTP = '021612'

// Remove the generateNewOTP function (lines 37-40)
// Remove the demo OTP display section (lines 56-70)
```

**UI Updates:**
- Remove "Demo OTP (for testing):" section
- Change title from "Admin Login" to "Secure Admin Access"
- Update description to remove references to demo

---

### Phase 3: Update Admin Panel for S3 Uploads

#### 2.3.1 Create Storage Utilities

Create `src/app/lib/storage.js`:

```javascript
import { uploadData, getUrl, list, remove } from 'aws-amplify/storage';

// Upload video to S3
export async function uploadVideo(file, title, description, onProgress) {
  const key = `videos/${Date.now()}_${file.name}`;
  
  try {
    const result = await uploadData({
      path: key,
      data: file,
      options: {
        contentType: file.type,
        metadata: {
          title: title,
          description: description || '',
          originalName: file.name,
          uploadDate: new Date().toISOString()
        },
        onProgress: (progress) => {
          if (onProgress) {
            onProgress(progress);
          }
        }
      }
    }).result;
    
    return {
      success: true,
      key: key,
      path: result.path
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

// Upload picture to S3
export async function uploadPicture(file, title, description, onProgress) {
  const key = `pictures/${Date.now()}_${file.name}`;
  
  try {
    const result = await uploadData({
      path: key,
      data: file,
      options: {
        contentType: file.type,
        metadata: {
          title: title,
          description: description || '',
          originalName: file.name,
          uploadDate: new Date().toISOString()
        },
        onProgress: (progress) => {
          if (onProgress) {
            onProgress(progress);
          }
        }
      }
    }).result;
    
    return {
      success: true,
      key: key,
      path: result.path
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

// Get media metadata from JSON file
export async function getMediaMetadata() {
  try {
    const { body } = await downloadData({
      path: 'metadata/media-metadata.json'
    }).result;
    
    const text = await body.text();
    return JSON.parse(text);
  } catch (error) {
    // If file doesn't exist, return empty structure
    if (error.name === 'NotFound') {
      return { videos: [], pictures: [] };
    }
    throw error;
  }
}

// Update media metadata JSON file
export async function updateMediaMetadata(metadata) {
  const jsonData = JSON.stringify(metadata, null, 2);
  
  await uploadData({
    path: 'metadata/media-metadata.json',
    data: new Blob([jsonData], { type: 'application/json' }),
    options: {
      contentType: 'application/json'
    }
  }).result;
}

// List all videos
export async function listVideos() {
  const result = await list({
    path: 'videos/'
  });
  return result.items;
}

// List all pictures
export async function listPictures() {
  const result = await list({
    path: 'pictures/'
  });
  return result.items;
}

// Get signed URL for file access
export async function getFileUrl(key) {
  const url = await getUrl({
    path: key
  });
  return url.url;
}

// Delete file from S3
export async function deleteFile(key) {
  await remove({
    path: key
  });
}
```

#### 2.3.2 Update Admin Page

**File:** `src/app/admin/page.js`

**Major Changes:**

1. **Add Description Field:**
   - Add state for video and picture descriptions
   - Add textarea inputs for descriptions

2. **Update Upload Functions:**
   - Replace simulated uploads with real S3 uploads
   - Add progress tracking
   - Update metadata JSON after successful upload

3. **Update Manage Tab:**
   - List actual files from S3
   - Add delete functionality
   - Show file metadata

**Implementation Details:**

```javascript
// Add new state variables (around line 15)
const [videoDescription, setVideoDescription] = useState('')
const [pictureDescription, setPictureDescription] = useState('')
const [uploadProgress, setUploadProgress] = useState({ video: 0, picture: 0 })

// Updated handleVideoUpload function
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

// Similar updates for handlePictureUpload
```

**UI Changes for Admin:**

1. Add description textarea to both video and picture upload forms:

```javascript
// Add after title input in video upload section
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
```

2. Add progress bar for uploads:

```javascript
// Add to upload status section
{uploadProgress.video > 0 && uploadProgress.video < 100 && (
  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
    <div 
      className="bg-gold-500 h-2.5 rounded-full transition-all duration-300" 
      style={{ width: `${uploadProgress.video}%` }}
    ></div>
  </div>
  <p className="text-sm text-maroon-600">{uploadProgress.video}% uploaded</p>
)}
```

---

### Phase 4: Update Videos Page

#### 2.4.1 Create Video Display Components

**File:** `src/app/components/VideoPlayer.js` (new file)

```javascript
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
```

#### 2.4.2 Update Videos Page

**File:** `src/app/videos/page.js`

**Changes Required:**

1. Convert to client component to fetch data
2. Load videos from S3 using `list` API
3. Get signed URLs for playback
4. Add inline video player
5. Add download functionality
6. Display file size from metadata

**Implementation:**

```javascript
'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import VideoPlayer from '@/components/VideoPlayer'
import { listVideos, getFileUrl, getMediaMetadata } from '@/lib/storage'

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
      
      // Get metadata
      const metadata = await getMediaMetadata()
      
      // List videos from S3
      const videoList = await listVideos()
      
      // Combine S3 data with metadata
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
      
      setVideos(videosWithUrls)
    } catch (err) {
      console.error('Error loading videos:', err)
      setError('Failed to load videos')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
          <p className="text-maroon-700">{error}</p>
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
            <p className="text-maroon-600">No videos uploaded yet.</p>
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
```

---

### Phase 5: Update Pictures Page

#### 2.5.1 Create Image Display Components

**File:** `src/app/components/ImageViewer.js` (new file)

```javascript
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
```

#### 2.5.2 Update Pictures Page

**File:** `src/app/pictures/page.js`

**Changes Required:**

1. Convert to client component
2. Load pictures from S3
3. Get signed URLs
4. Add lightbox viewer for full-size images
5. Add download functionality
6. Display file size and dimensions

**Implementation:**

```javascript
'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import ImageViewer from '@/components/ImageViewer'
import { listPictures, getFileUrl, getMediaMetadata } from '@/lib/storage'

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
      
      // Get metadata
      const metadata = await getMediaMetadata()
      
      // List pictures from S3
      const pictureList = await listPictures()
      
      // Combine S3 data with metadata
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
      
      setPictures(picturesWithUrls)
    } catch (err) {
      console.error('Error loading pictures:', err)
      setError('Failed to load pictures')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
          <p className="text-maroon-700">{error}</p>
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
            <p className="text-maroon-600">No pictures uploaded yet.</p>
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
```

---

### Phase 6: AWS Amplify Backend Deployment

#### 2.6.1 Initialize Amplify Backend

```bash
# Install Amplify CLI globally (if not already installed)
npm install -g @aws-amplify/cli

# Initialize Amplify in the project
amplify init

# Follow prompts:
# ? Enter a name for the project: portfolio-video-website
# ? Initialize the project with the above configuration? Yes
# ? Select the authentication method: AWS Profile
# ? Please choose the profile you want to use: default
```

#### 2.6.2 Add Storage Category

```bash
amplify add storage

# Follow prompts:
# ? Select from one of the below mentioned services: Content (Images, audio, video, etc.)
# ? Provide a friendly name for your resource: portfolioStorage
# ? Provide bucket name: portfolio-video-website-storage
# ? Who should have access: Auth and guest users
# ? What kind of access do you want for Authenticated users? create/update, read, delete
# ? What kind of access do you want for Guest users? read
# ? Do you want to add a Lambda Trigger for your S3 Bucket? No
```

#### 2.6.3 Add Authentication (Optional but Recommended)

For production security, consider adding Cognito authentication:

```bash
amplify add auth

# Follow prompts for basic authentication setup
```

**Note:** For the current OTP-based system, you can skip this and use the existing localStorage-based authentication.

#### 2.6.4 Push Backend to AWS

```bash
amplify push

# This will:
# - Create the S3 bucket
# - Set up IAM roles and permissions
# - Configure storage access rules
# - Generate amplifyconfiguration.json
```

#### 2.6.5 Update Environment Variables

Create `.env.local` file:

```
# AWS Amplify Configuration
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_S3_BUCKET=portfolio-video-website-storage
```

---

### Phase 7: Testing and Validation

#### 2.7.1 Local Testing Checklist

1. **Login Page:**
   - [ ] OTP "021612" works correctly
   - [ ] Demo labels removed
   - [ ] Error messages display properly

2. **Admin Upload:**
   - [ ] Video upload (test with various sizes up to 50MB)
   - [ ] Picture upload (test with various sizes up to 10MB)
   - [ ] Description field works
   - [ ] Progress bar displays during upload
   - [ ] Success/error messages show correctly
   - [ ] Metadata JSON updates after upload

3. **Videos Page:**
   - [ ] Videos load from S3
   - [ ] Video player works inline
   - [ ] File size displays correctly
   - [ ] Download button works
   - [ ] Empty state displays when no videos

4. **Pictures Page:**
   - [ ] Pictures load from S3
   - [ ] Lightbox viewer works
   - [ ] File size displays correctly
   - [ ] Download button works
   - [ ] Empty state displays when no pictures

#### 2.7.2 Production Deployment Checklist

1. **Pre-deployment:**
   - [ ] Run `npm run build` successfully
   - [ ] Run `npm run lint` with no errors
   - [ ] All environment variables set in Amplify Console
   - [ ] S3 bucket CORS configured for web access

2. **Post-deployment:**
   - [ ] Test upload functionality in production
   - [ ] Verify videos display and play
   - [ ] Verify pictures display in lightbox
   - [ ] Test download functionality
   - [ ] Verify mobile responsiveness
   - [ ] Check PWA offline functionality still works

---

## 3. Security Considerations

### 3.1 S3 Bucket Security

1. **Block Public Access:** Keep S3 bucket public access blocked at bucket level
2. **Use Signed URLs:** All file access through signed CloudFront or S3 URLs
3. **CORS Configuration:** Configure CORS for web access only

### 3.2 IAM Permissions

**Authenticated Users:**
- `s3:PutObject` (videos/*, pictures/*, metadata/*)
- `s3:GetObject` (all paths)
- `s3:DeleteObject` (all paths)
- `s3:ListBucket` (bucket level)

**Guest Users:**
- `s3:GetObject` (videos/*, pictures/* only)

### 3.3 File Validation

Maintain existing validation in admin page:
- Videos: Max 50MB, allowed types: MP4, AVI, MOV, WMV, WebM
- Pictures: Max 10MB, allowed types: JPEG, PNG, GIF, WebP

---

## 4. Cost Estimation

### 4.1 AWS Services Costs (Monthly Estimate)

**S3 Storage:**
- First 50 GB: $0.023 per GB
- Example: 10GB storage = ~$0.23/month

**S3 Requests:**
- PUT, COPY, POST, LIST requests: $0.005 per 1,000 requests
- GET, SELECT requests: $0.0004 per 1,000 requests

**Data Transfer:**
- Data transfer out to internet: $0.09 per GB (first 10TB)

**Total Estimate:** $1-5/month for low to moderate usage

### 4.2 Free Tier Eligibility

- S3: 5GB standard storage, 20,000 GET requests, 2,000 PUT requests free for 12 months
- Great for development and small portfolios

---

## 5. Alternative Metadata Storage Options

### Option 1: S3 Object Metadata (Currently Recommended)
**Pros:**
- Native to S3, no additional infrastructure
- Stored with the object
- Simple to implement

**Cons:**
- Limited to 2KB per object
- Hard to query/update in bulk

### Option 2: Single JSON File in S3 (Hybrid Approach)
**Pros:**
- Centralized metadata
- Easy to read all at once
- Version control with S3 versioning

**Cons:**
- Concurrent updates can cause conflicts
- Need to handle race conditions

### Option 3: DynamoDB (If Budget Allows)
**Pros:**
- Fast queries
- Scalable
- ACID transactions

**Cons:**
- Additional cost (~$1.25/month for on-demand)
- More complex setup
- Requires backend API

**Recommendation:** Use Option 2 (Single JSON File) as it provides the best balance of simplicity and functionality without a database.

---

## 6. Implementation Timeline

| Phase | Task | Estimated Time |
|-------|------|----------------|
| 1 | Setup AWS Amplify backend | 2 hours |
| 2 | Update Login page (OTP) | 30 minutes |
| 3 | Create storage utilities | 1.5 hours |
| 4 | Update Admin panel | 2 hours |
| 5 | Update Videos page | 1.5 hours |
| 6 | Update Pictures page | 1.5 hours |
| 7 | Testing and deployment | 2 hours |
| **Total** | | **11 hours** |

---

## 7. Files to Modify/Create

### New Files:
1. `src/app/lib/storage.js` - Storage utility functions
2. `src/app/components/VideoPlayer.js` - Video player component
3. `src/app/components/ImageViewer.js` - Image lightbox component
4. `amplify/storage/resource.ts` - Amplify storage configuration

### Modified Files:
1. `src/app/login/page.js` - Update OTP and remove demo labels
2. `src/app/admin/page.js` - Real S3 upload functionality
3. `src/app/videos/page.js` - Load from S3 with player
4. `src/app/pictures/page.js` - Load from S3 with viewer
5. `src/app/layout.js` - Add Amplify configuration
6. `package.json` - Add aws-amplify dependencies

---

## 8. Risk Mitigation

### Potential Risks:

1. **Concurrent Metadata Updates:**
   - **Risk:** Two admins uploading simultaneously could overwrite metadata
   - **Mitigation:** Use optimistic locking with ETag or implement simple queuing

2. **Large File Uploads:**
   - **Risk:** Network interruptions during large video uploads
   - **Mitigation:** AWS Amplify Storage supports resumable uploads automatically

3. **S3 Costs:**
   - **Risk:** Unexpected costs from high traffic
   - **Mitigation:** Set up AWS Budgets alerts; use CloudFront for caching

4. **Cold Start Latency:**
   - **Risk:** Slow initial load of media list
   - **Mitigation:** Implement caching with SWR or React Query

---

## 9. Success Criteria

The implementation will be considered successful when:

1. ✅ Admin can upload videos up to 50MB to S3
2. ✅ Admin can upload pictures up to 10MB to S3
3. ✅ Descriptions are stored and displayed with media
4. ✅ Videos page shows inline player with working playback
5. ✅ Pictures page shows inline images with lightbox viewer
6. ✅ Download buttons work for both videos and pictures
7. ✅ File sizes are displayed accurately
8. ✅ OTP "021612" grants admin access
9. ✅ All demo labels are removed
10. ✅ No database infrastructure is required

---

## 10. Next Steps

1. **Review this plan** with stakeholders
2. **Set up AWS account** and configure AWS CLI
3. **Initialize Amplify backend** in the project
4. **Begin Phase 1** implementation
5. **Test each phase** thoroughly before proceeding
6. **Deploy to production** once all phases complete

---

## Appendix A: CORS Configuration for S3 Bucket

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

**Note:** For production, replace `"*"` with your actual domain(s).

---

## Appendix B: Environment Variables Template

Create `.env.local`:

```bash
# AWS Configuration
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_USER_POOL_ID=your_pool_id
NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID=your_client_id
NEXT_PUBLIC_AWS_IDENTITY_POOL_ID=your_identity_pool_id
NEXT_PUBLIC_S3_BUCKET=your_bucket_name

# Admin Configuration
ADMIN_OTP=021612
```

---

**Document Version:** 1.0  
**Last Updated:** 2026-02-10  
**Author:** AI Assistant  
**Status:** Ready for Review
