import { uploadData, getUrl, list, remove, downloadData } from 'aws-amplify/storage';

// S3 Bucket Configuration
const BUCKET_NAME = 'shawnmcrowley-bucket';
const VIDEOS_PREFIX = 'videos/';
const PICTURES_PREFIX = 'pictures/';
const METADATA_KEY = 'metadata/media-metadata.json';

/**
 * Extract filename from S3 key and clean it up for display
 * e.g., "videos/1678901234567_video.mp4" -> "video.mp4"
 */
function extractFilename(key) {
  const parts = key.split('/');
  const filename = parts[parts.length - 1];
  // Remove timestamp prefix if present (e.g., "1678901234567_")
  return filename.replace(/^\d+_/, '').replace(/_/g, ' ');
}

/**
 * Generate a clean title from filename
 * e.g., "my-video-file.mp4" -> "My Video File"
 */
function generateTitle(filename) {
  return filename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[-_]/g, ' ') // Replace dashes/underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
}

// Upload video to S3
export async function uploadVideo(file, title, description, onProgress) {
  // Use timestamp prefix to ensure unique filenames
  const key = `${VIDEOS_PREFIX}${Date.now()}_${file.name}`;
  
  try {
    const result = await uploadData({
      path: key,
      data: file,
      options: {
        bucket: BUCKET_NAME,
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
  const key = `${PICTURES_PREFIX}${Date.now()}_${file.name}`;
  
  try {
    const result = await uploadData({
      path: key,
      data: file,
      options: {
        bucket: BUCKET_NAME,
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
      path: METADATA_KEY,
      options: {
        bucket: BUCKET_NAME
      }
    }).result;
    
    const text = await body.text();
    return JSON.parse(text);
  } catch (error) {
    // If file doesn't exist, return empty structure
    if (error.name === 'NotFound' || error.message?.includes('NotFound') || error.$metadata?.httpStatusCode === 404) {
      return { videos: [], pictures: [] };
    }
    console.warn('Metadata file not found or error reading:', error.message);
    return { videos: [], pictures: [] };
  }
}

// Update media metadata JSON file
export async function updateMediaMetadata(metadata) {
  const jsonData = JSON.stringify(metadata, null, 2);
  
  await uploadData({
    path: METADATA_KEY,
    data: new Blob([jsonData], { type: 'application/json' }),
    options: {
      bucket: BUCKET_NAME,
      contentType: 'application/json'
    }
  }).result;
}

// List all videos with fallback to S3 metadata
export async function listVideos() {
  try {
    const result = await list({
      path: VIDEOS_PREFIX,
      options: {
        bucket: BUCKET_NAME
      }
    });
    
    // Filter out folder prefixes (items ending with / or with 0 bytes)
    const files = result.items.filter(item => {
      // Skip if it's a folder (ends with /) or has 0 bytes
      const isFolder = item.path.endsWith('/');
      const isEmpty = item.size === 0;
      return !isFolder && !isEmpty;
    });
    
    // Get S3 object metadata for each video
    const metadata = await getMediaMetadata();
    
    // Map files with enhanced metadata
    const videos = files.map(item => {
      const meta = metadata.videos.find(v => v.key === item.path) || {};
      const filename = extractFilename(item.path);
      
      return {
        ...item,
        title: meta.title || generateTitle(filename),
        description: meta.description || '',
        displayName: filename
      };
    });
    
    return videos;
  } catch (error) {
    console.error('Error listing videos:', error);
    throw error;
  }
}

// List all pictures with fallback to S3 metadata
export async function listPictures() {
  try {
    const result = await list({
      path: PICTURES_PREFIX,
      options: {
        bucket: BUCKET_NAME
      }
    });
    
    // Filter out folder prefixes (items ending with / or with 0 bytes)
    const files = result.items.filter(item => {
      // Skip if it's a folder (ends with /) or has 0 bytes
      const isFolder = item.path.endsWith('/');
      const isEmpty = item.size === 0;
      return !isFolder && !isEmpty;
    });
    
    // Get metadata for enhancement
    const metadata = await getMediaMetadata();
    
    // Map files with enhanced metadata
    const pictures = files.map(item => {
      const meta = metadata.pictures.find(p => p.key === item.path) || {};
      const filename = extractFilename(item.path);
      
      return {
        ...item,
        title: meta.title || generateTitle(filename),
        description: meta.description || '',
        displayName: filename
      };
    });
    
    return pictures;
  } catch (error) {
    console.error('Error listing pictures:', error);
    throw error;
  }
}

// Get signed URL for file access
export async function getFileUrl(key) {
  try {
    const urlResult = await getUrl({
      path: key,
      options: {
        bucket: BUCKET_NAME,
        expiresIn: 3600 // 1 hour expiration
      }
    });
    return urlResult.url.toString();
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
}

// Delete file from S3
export async function deleteFile(key) {
  try {
    await remove({
      path: key,
      options: {
        bucket: BUCKET_NAME
      }
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

// Utility: Format file size for display
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Utility: Scan existing bucket and create metadata file
export async function scanAndCreateMetadata() {
  try {
    const [videoResult, pictureResult] = await Promise.all([
      list({ path: VIDEOS_PREFIX, options: { bucket: BUCKET_NAME } }),
      list({ path: PICTURES_PREFIX, options: { bucket: BUCKET_NAME } })
    ]);
    
    // Filter out folder prefixes
    const videoFiles = videoResult.items.filter(item => !item.path.endsWith('/') && item.size > 0);
    const pictureFiles = pictureResult.items.filter(item => !item.path.endsWith('/') && item.size > 0);
    
    const metadata = {
      videos: videoFiles.map(item => ({
        key: item.path,
        title: generateTitle(extractFilename(item.path)),
        description: '',
        size: item.size,
        contentType: item.contentType || 'video/mp4',
        uploadDate: item.lastModified || new Date().toISOString()
      })),
      pictures: pictureFiles.map(item => ({
        key: item.path,
        title: generateTitle(extractFilename(item.path)),
        description: '',
        size: item.size,
        contentType: item.contentType || 'image/jpeg',
        uploadDate: item.lastModified || new Date().toISOString()
      }))
    };
    
    await updateMediaMetadata(metadata);
    console.log('Metadata file created with', metadata.videos.length, 'videos and', metadata.pictures.length, 'pictures');
    return metadata;
  } catch (error) {
    console.error('Error scanning bucket:', error);
    throw error;
  }
}
