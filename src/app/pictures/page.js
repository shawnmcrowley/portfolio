import Layout from '@/components/Layout'

export default function Pictures() {
  const pictures = [
    {
      id: 1,
      title: "Portrait Session",
      description: "Professional portrait photography showcase",
      filename: "portrait-session.jpg",
      size: "2.3 MB",
      dimensions: "1920x1080"
    },
    {
      id: 2,
      title: "Nature Photography",
      description: "Capturing the beauty of natural landscapes",
      filename: "nature-photography.jpg",
      size: "4.7 MB",
      dimensions: "2560x1440"
    },
    {
      id: 3,
      title: "Sports Action",
      description: "Dynamic sports photography from various events",
      filename: "sports-action.jpg",
      size: "3.1 MB",
      dimensions: "2048x1536"
    },
    {
      id: 4,
      title: "Creative Projects",
      description: "Behind the scenes of creative work and projects",
      filename: "creative-projects.jpg",
      size: "5.2 MB",
      dimensions: "2880x1920"
    },
    {
      id: 5,
      title: "Urban Exploration",
      description: "Street photography and urban landscape shots",
      filename: "urban-exploration.jpg",
      size: "3.8 MB",
      dimensions: "2400x1600"
    },
    {
      id: 6,
      title: "Event Coverage",
      description: "Memorable moments from various events and gatherings",
      filename: "event-coverage.jpg",
      size: "4.1 MB",
      dimensions: "2560x1707"
    }
  ]

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

        {/* Pictures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pictures.map((picture) => (
            <div key={picture.id} className="card hover:shadow-xl transition-all duration-300 group">
              {/* Image Placeholder */}
              <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-gradient-to-br from-maroon-100 to-gold-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl text-maroon-300 mb-2">📸</div>
                    <p className="text-maroon-600 font-semibold">Photo Gallery</p>
                  </div>
                </div>
                
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
                  <span>{picture.dimensions}</span>
                </div>
                
                <div className="flex gap-2">
                  <button className="btn-primary flex-1 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
                    </svg>
                    View
                  </button>
                  <button className="btn-secondary text-sm">
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

        {/* Photo Categories */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="text-4xl mb-4">🎭</div>
            <h3 className="text-xl font-bold text-maroon-700 mb-2">Portrait & People</h3>
            <p className="text-maroon-600 text-sm">
              Capturing personalities and emotions through portrait photography
            </p>
          </div>
          
          <div className="card text-center">
            <div className="text-4xl mb-4">🌿</div>
            <h3 className="text-xl font-bold text-maroon-700 mb-2">Nature & Landscapes</h3>
            <p className="text-maroon-600 text-sm">
              The beauty of natural world and outdoor adventures
            </p>
          </div>
          
          <div className="card text-center">
            <div className="text-4xl mb-4">🏙️</div>
            <h3 className="text-xl font-bold text-maroon-700 mb-2">Urban & Events</h3>
            <p className="text-maroon-600 text-sm">
              City life, architecture, and memorable event moments
            </p>
          </div>
        </div>

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