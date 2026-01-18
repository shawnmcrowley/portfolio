import Navigation from './Navigation'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-50 to-gold-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}