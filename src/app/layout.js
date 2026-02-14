import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import AmplifyConfig from '@/components/AmplifyConfig'
import './globals.css'

export const metadata = {
  title: 'Brady\'s Portfolio',
  description: 'Brady R. Crowley\'s portfolio showcasing videos, pictures, and bio',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#f59e0b',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <AmplifyConfig />
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  )
}
