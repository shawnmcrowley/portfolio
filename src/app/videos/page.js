import Layout from '../components/Layout'

export default function Videos() {
  const videos = [
    {
      id: 1,
      title: "Welcome to My Portfolio",
      description: "An introduction to my work and passion projects",
      filename: "welcome-video.mp4",
      duration: "2:30",
      size: "15.2 MB"
    },
    {
      id: 2,
      title: "Sports Highlights",
      description: "Compilation of my favorite sports moments",
      filename: "sports-highlights.mp4",
      duration: "4:15",
      size: "28.7 MB"
    },
    {
      id: 3,
      title: "Creative Projects",
      description: "Showcase of my latest creative endeavors",
      filename: "creative-projects.mp4",
      duration: "3:45",
      size: "22.1 MB"
    },
    {
      id: 4,
      title: "Behind the Scenes",
      description: "A look at the process behind my work",
      filename: "behind-scenes.mp4",
      duration: "5:20",
      size: "35.8 MB"
    }
  ]

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

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {videos.map((video) => (
            <div key={video.id} className="card hover:shadow-xl transition-shadow duration-300">
              {/* Video Player Placeholder */}
              <div className="relative bg-maroon-100 rounded-lg mb-4 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl text-maroon-400 mb-2">🎥</div>
                  <p className="text-maroon-600 font-semibold">Video Player</p>
                  <p className="text-sm text-maroon-500 mt-1">{video.filename}</p>
                </div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-gold-500 hover:bg-gold-600 text-white rounded-full p-4 transition-colors duration-200 shadow-lg">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 5v10l8-5-8-5z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Video Info */}
              <div>
                <h3 className="text-xl font-bold text-maroon-700 mb-2">
                  {video.title}
                </h3>
                <p className="text-maroon-600 mb-4">
                  {video.description}
                </p>
                
                <div className="flex justify-between items-center text-sm text-maroon-500">
                  <span>Duration: {video.duration}</span>
                  <span>Size: {video.size}</span>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button className="btn-primary flex-1">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 5v10l8-5-8-5z"/>
                    </svg>
                    Play
                  </button>
                  <button className="btn-secondary">
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