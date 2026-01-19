import Layout from '@/components/Layout'

export default function Home() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-youthful text-maroon-700 mb-4">
            Welcome to Brady R. Crowley's Portfolio
          </h1>
          <p className="text-xl text-maroon-600 max-w-2xl mx-auto">
            A showcase of my journey, experiences, and creative work
          </p>
        </div>

        {/* About Me Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Personal Info Card */}
          <div className="card">
            <h3 className="text-2xl font-bold text-maroon-700 mb-4 flex items-center">
              <span className="text-gold-500 mr-2">👤</span>
              About Me
            </h3>
            <p className="text-maroon-600 mb-4">
              I'm a passionate individual who loves creating, learning, and sharing experiences with others. 
              This portfolio represents my journey and the things I'm most proud of.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gold-100 text-gold-800 px-3 py-1 rounded-full text-sm">Creative</span>
              <span className="bg-maroon-100 text-maroon-800 px-3 py-1 rounded-full text-sm">Passionate</span>
              <span className="bg-gold-100 text-gold-800 px-3 py-1 rounded-full text-sm">Dedicated</span>
            </div>
          </div>

          {/* Skills Card */}
          <div className="card">
            <h3 className="text-2xl font-bold text-maroon-700 mb-4 flex items-center">
              <span className="text-gold-500 mr-2">🚀</span>
              Skills & Abilities
            </h3>
            <ul className="text-maroon-600 space-y-2">
              <li className="flex items-center">
                <span className="text-gold-500 mr-2">•</span>
                Creative Problem Solving
              </li>
              <li className="flex items-center">
                <span className="text-gold-500 mr-2">•</span>
                Team Leadership
              </li>
              <li className="flex items-center">
                <span className="text-gold-500 mr-2">•</span>
                Digital Content Creation
              </li>
              <li className="flex items-center">
                <span className="text-gold-500 mr-2">•</span>
                Communication
              </li>
              <li className="flex items-center">
                <span className="text-gold-500 mr-2">•</span>
                Project Management
              </li>
            </ul>
          </div>

          {/* Interests Card */}
          <div className="card">
            <h3 className="text-2xl font-bold text-maroon-700 mb-4 flex items-center">
              <span className="text-gold-500 mr-2">💡</span>
              Interests
            </h3>
            <p className="text-maroon-600 mb-4">
              I'm fascinated by technology, creativity, and continuous learning. I enjoy exploring new ideas 
              and pushing the boundaries of what's possible.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-gold-500 mr-2">🎥</span>
                <span className="text-sm text-maroon-600">Video Production</span>
              </div>
              <div className="flex items-center">
                <span className="text-gold-500 mr-2">📸</span>
                <span className="text-sm text-maroon-600">Photography</span>
              </div>
              <div className="flex items-center">
                <span className="text-gold-500 mr-2">💻</span>
                <span className="text-sm text-maroon-600">Web Development</span>
              </div>
              <div className="flex items-center">
                <span className="text-gold-500 mr-2">🎨</span>
                <span className="text-sm text-maroon-600">Digital Art</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sports Section */}
        <div className="card mb-8">
          <h3 className="text-3xl font-bold text-maroon-700 mb-6 flex items-center">
            <span className="text-gold-500 mr-3">⚽</span>
            Sports & Recreation
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xl font-semibold text-maroon-600 mb-3">Active Sports</h4>
              <ul className="text-maroon-600 space-y-2">
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">🏀</span>
                  Basketball - Team coordination and strategy
                </li>
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">⚽</span>
                  Soccer - Endurance and teamwork
                </li>
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">🏃‍♂️</span>
                  Running - Personal challenges and fitness
                </li>
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">🏊‍♂️</span>
                  Swimming - Technique and strength
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-maroon-600 mb-3">Sports Philosophy</h4>
              <p className="text-maroon-600 mb-4">
                Sports have taught me valuable life lessons about discipline, perseverance, and the importance 
                of working together toward common goals. Whether competing individually or as part of a team, 
                I believe in giving my best effort and learning from every experience.
              </p>
              <div className="bg-gold-50 p-4 rounded-lg border-l-4 border-gold-500">
                <p className="text-gold-800 italic">
                  "Success in sports, like in life, comes from consistent effort, continuous learning, 
                  and never giving up on your dreams."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-maroon-600 to-gold-600 text-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Let's Connect!</h3>
            <p className="text-lg mb-6">
              Check out my videos and pictures to see more of my work and experiences. 
              For admin access, use the login option above.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/videos" className="bg-white text-maroon-700 px-6 py-3 rounded-lg font-semibold hover:bg-maroon-50 transition-colors">
                View Videos
              </a>
              <a href="/pictures" className="bg-gold-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors">
                View Pictures
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
