# Portfolio Video Website

A modern, responsive portfolio website built with Next.js 16, featuring video and picture galleries with admin upload functionality.

## Features

- 🎨 **Modern Design**: Maroon and gold color scheme with playful, youthful typography
- 📱 **Responsive**: Mobile-first design that works on all devices
- 🔐 **Secure Admin**: OTP-based authentication for content management
- 📁 **Content Management**: Upload videos (max 50MB) and pictures (max 10MB)
- 🌐 **PWA Support**: Installable as a mobile app with offline capabilities
- 🚀 **Static Deployment**: Optimized for AWS Amplify and S3 deployment

## Technology Stack

- **Framework**: Next.js 16.1.3 with App Router
- **React**: Version 19.0.0
- **Styling**: Tailwind CSS with custom maroon/gold theme
- **Fonts**: Comic Neue (playful) and Fredoka One (youthful)
- **PWA**: Service Worker for offline support
- **Authentication**: Client-side OTP system (demo implementation)
- **Build**: Turbopack (Next.js 16+ default, no webpack needed)
- **Architecture**: Next.js best practices with `src` directory

## Project Structure

```
portfolio/
├── src/
│   └── app/
│       ├── components/          # Reusable components
│       │   ├── Layout.js       # Main layout wrapper
│       │   ├── Navigation.js   # Navigation component
│       │   └── ServiceWorkerRegistration.js # PWA registration
│       ├── admin/              # Admin panel for content management
│       ├── login/              # OTP login page
│       ├── videos/             # Video gallery
│       ├── pictures/           # Picture gallery
│       ├── page.js             # Home/About page
│       ├── layout.js           # Root layout with PWA setup
│       ├── globals.css         # Global styles and Tailwind
│       ├── error.js            # Error handling
│       └── not_found.js        # 404 page
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                  # Service worker
│   ├── favicon.ico            # Site icon
│   └── icon-*.png             # PWA icons
├── tailwind.config.js          # Tailwind configuration
├── next.config.js              # Clean Next.js config (Turbopack enabled)
└── package.json               # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Credentials

- **OTP**: `123456`
- **Admin Access**: Use the login page with the demo OTP to access the admin panel

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `out` directory, ready for static deployment.

## Clean Architecture

### Simplified Configuration
- **No webpack configuration needed** - Next.js 16+ uses Turbopack by default
- **Minimal next.config.js** - Only essential settings for static export
- **Fast builds** - Turbopack provides lightning-fast development and production builds
- **Best practices structure** - All application code in `src/app` directory

### Component Structure
- **Separation of concerns** - Client logic in separate components
- **Safe service worker registration** - No dangerous innerHTML
- **Clean imports** - Relative paths within `src/app`
- **Pure JavaScript** - No TypeScript dependencies

## Deployment

### AWS Amplify

1. Connect your GitHub repository to AWS Amplify
2. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: out
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

### Manual S3 Deployment

1. Build the project: `npm run build`
2. Upload the `out` directory contents to your S3 bucket
3. Configure the bucket for static website hosting

## Admin Features

- **OTP Authentication**: Secure login with one-time passwords
- **Video Upload**: Support for MP4, AVI, MOV, WMV, WebM (max 50MB)
- **Picture Upload**: Support for JPEG, PNG, GIF, WebP (max 10MB)
- **Session Management**: 24-hour admin sessions
- **File Validation**: Client-side validation for file types and sizes

## Customization

### Colors
The color scheme is defined in `tailwind.config.js`:
- **Maroon**: Primary brand color (shades 50-950)
- **Gold**: Accent color for CTAs and highlights (shades 50-950)

### Content
- Update the About Me section in `src/app/page.js`
- Modify video and picture data in their respective pages
- Customize the hero text and personal information

### Styling
- Font families are defined in `tailwind.config.js`
- Custom CSS classes are in `src/app/globals.css`
- Component-specific styles use Tailwind utility classes

## PWA Features

- **Offline Support**: Core pages cached for offline viewing
- **Installable**: Can be installed on mobile devices
- **App-like Experience**: Standalone display mode
- **Fast Loading**: Cached resources for quick startup
- **Safe Registration**: Clean service worker setup without dangerous innerHTML

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- PWA features require HTTPS in production

## Security Notes

- This is a demo implementation with client-side authentication
- For production use, implement server-side authentication and file storage
- Consider using a backend API for secure file uploads
- Add proper input sanitization and validation

## License

This project is open source and available under the MIT License.