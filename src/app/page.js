import Layout from '@/components/Layout'

export default function Home() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-youthful text-maroon-700 mb-4">
            Brady R. Crowley
          </h1>
          <p className="text-xl text-maroon-600 max-w-2xl mx-auto font-semibold">
            Driven. Disciplined. Unstoppable.
          </p>
          <p className="text-lg text-gold-600 mt-2 italic">
            "Slow is smooth, smooth is fast" - Navy SEALs
          </p>
        </div>

        {/* About Me Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Personal Info Card */}
          <div className="card">
            <h3 className="text-2xl font-bold text-maroon-700 mb-4 flex items-center">
              <span className="text-gold-500 mr-2">⚡</span>
              About Me
            </h3>
            <p className="text-maroon-600 mb-4">
              I'm a high-energy, goal-driven individual who attacks every challenge with relentless focus. 
              Whether in the gym, on the field, or pursuing personal growth, I lead by example and never settle for mediocrity. 
              Every day is an opportunity to become stronger, faster, and better than yesterday.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gold-100 text-gold-800 px-3 py-1 rounded-full text-sm font-semibold">Goal Crusher</span>
              <span className="bg-maroon-100 text-maroon-800 px-3 py-1 rounded-full text-sm font-semibold">Relentless</span>
              <span className="bg-gold-100 text-gold-800 px-3 py-1 rounded-full text-sm font-semibold">Lead by Example</span>
            </div>
          </div>

          {/* Skills & Mindset Card */}
          <div className="card">
            <h3 className="text-2xl font-bold text-maroon-700 mb-4 flex items-center">
              <span className="text-gold-500 mr-2">🎯</span>
              Mindset & Discipline
            </h3>
            <ul className="text-maroon-600 space-y-2">
              <li className="flex items-center">
                <span className="text-gold-500 mr-2">•</span>
                Goal-Oriented: Set it, chase it, crush it
              </li>
              <li className="flex items-center">
                <span className="text-gold-500 mr-2">•</span>
                Lead by Example: Actions speak louder than words
              </li>
              <li className="flex items-center">
                <span className="text-gold-500 mr-2">•</span>
                Relentless Work Ethic: Outwork the competition
              </li>
              <li className="flex items-center">
                <span className="text-gold-500 mr-2">•</span>
                Continuous Improvement: Stronger, bigger, faster every day
              </li>
              <li className="flex items-center">
                <span className="text-gold-500 mr-2">•</span>
                Mental Toughness: Navy SEALs philosophy
              </li>
            </ul>
            <div className="mt-4 bg-gold-50 p-3 rounded-lg border-l-4 border-gold-500">
              <p className="text-gold-800 italic text-sm font-semibold">
                "Slow is smooth, smooth is fast"
              </p>
            </div>
          </div>

          {/* Sports & Passions Card */}
          <div className="card">
            <h3 className="text-2xl font-bold text-maroon-700 mb-4 flex items-center">
              <span className="text-gold-500 mr-2">🏆</span>
              Sports & Passions
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-maroon-700 font-semibold mb-2">Competitive Sports:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-maroon-100 text-maroon-800 px-2 py-1 rounded text-sm">⚾ Baseball</span>
                  <span className="bg-maroon-100 text-maroon-800 px-2 py-1 rounded text-sm">🏈 Football</span>
                  <span className="bg-maroon-100 text-maroon-800 px-2 py-1 rounded text-sm">🤼 Wrestling</span>
                  <span className="bg-maroon-100 text-maroon-800 px-2 py-1 rounded text-sm">⛳ Golf</span>
                  <span className="bg-maroon-100 text-maroon-800 px-2 py-1 rounded text-sm">🏀 Basketball</span>
                </div>
              </div>
              <div>
                <p className="text-maroon-700 font-semibold mb-2">Training & Growth:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gold-100 text-gold-800 px-2 py-1 rounded text-sm">💪 Working Out</span>
                  <span className="bg-gold-100 text-gold-800 px-2 py-1 rounded text-sm">📚 Learning</span>
                  <span className="bg-gold-100 text-gold-800 px-2 py-1 rounded text-sm">🎵 Music</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="card mb-8">
          <h3 className="text-3xl font-bold text-maroon-700 mb-6 flex items-center">
            <span className="text-gold-500 mr-3">🔥</span>
            My Philosophy
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xl font-semibold text-maroon-600 mb-3">Training & Performance</h4>
              <p className="text-maroon-600 mb-4">
                Every rep, every set, every practice is a step toward greatness. I believe in the grind—the early mornings, 
                the extra miles, the uncomfortable moments that forge champions. Sports taught me that talent gets you started, 
                but discipline and relentless effort get you to the top.
              </p>
              <ul className="text-maroon-600 space-y-2">
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">✓</span>
                  Baseball: Precision and patience under pressure
                </li>
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">✓</span>
                  Football: Power, strategy, and team execution
                </li>
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">✓</span>
                  Wrestling: Mental toughness and one-on-one combat
                </li>
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">✓</span>
                  Golf: Focus and mastery of the mental game
                </li>
                <li className="flex items-center">
                  <span className="text-gold-500 mr-2">✓</span>
                  Basketball: Speed, agility, and court vision
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-maroon-600 mb-3">Beyond Sports</h4>
              <p className="text-maroon-600 mb-4">
                My drive doesn't stop at athletics. I'm passionate about constant learning—whether it's mastering a new skill, 
                understanding complex ideas, or growing as a person. Music fuels my workouts and focuses my mind. 
                Every goal I set, I pursue with the same intensity I bring to competition.
              </p>
              <div className="bg-gold-50 p-4 rounded-lg border-l-4 border-gold-500">
                <p className="text-gold-800 font-semibold mb-2">
                  "Slow is smooth, smooth is fast"
                </p>
                <p className="text-gold-700 text-sm italic">
                  The Navy SEALs mantra that guides my approach: master the fundamentals, 
                  perfect your technique, and speed will follow. Excellence is built one deliberate step at a time.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Leadership Section */}
        <div className="card mb-8">
          <h3 className="text-3xl font-bold text-maroon-700 mb-6 flex items-center">
            <span className="text-gold-500 mr-3">👑</span>
            Lead By Example
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">💪</div>
              <h4 className="text-lg font-semibold text-maroon-700 mb-2">Show, Don't Tell</h4>
              <p className="text-maroon-600 text-sm">
                I don't ask others to do what I wouldn't do myself. My work ethic and dedication set the standard.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h4 className="text-lg font-semibold text-maroon-700 mb-2">Goal-Oriented</h4>
              <p className="text-maroon-600 text-sm">
                Every mission needs a target. I set clear goals, create actionable plans, and execute with precision.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h4 className="text-lg font-semibold text-maroon-700 mb-2">Relentless Energy</h4>
              <p className="text-maroon-600 text-sm">
                Full throttle, all the time. I bring intensity and passion to everything I pursue.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-maroon-600 to-gold-600 text-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Let's Connect!</h3>
            <p className="text-lg mb-6">
              Check out my videos and pictures to see my journey, training, and experiences in action. 
              Built with discipline and dedication.
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
