# Agent Guidelines for Portfolio Video Website

## Project Overview

A Next.js 16 portfolio website with video/picture galleries and admin functionality. Built with React 19, Tailwind CSS, and PWA support.

## Build/Lint/Development Commands

```bash
# Development server (uses Turbopack by default)
npm run dev

# Production build
npm run build

# Run ESLint
npm run lint

# Static export (currently commented out in next.config.js)
npm run export

# Start production server
npm run start
```

**Note:** No test framework is currently installed. To run tests, you'll need to install one (Jest, Vitest, or Playwright) and configure it first.

## Technology Stack

- **Framework**: Next.js 16.1.3 with App Router
- **React**: Version 19.0.0
- **Language**: Pure JavaScript (no TypeScript)
- **Styling**: Tailwind CSS 3.4.19 with custom theme
- **Build Tool**: Turbopack (Next.js 16+ default, no webpack needed)
- **Package Manager**: npm

## Code Style Guidelines

### File Structure

```
src/app/
├── components/          # Reusable components
│   ├── Layout.js       # Main layout wrapper
│   ├── Navigation.js   # Navigation component
│   └── ServiceWorkerRegistration.js
├── admin/              # Admin panel page
├── login/              # OTP login page
├── videos/             # Video gallery page
├── pictures/           # Picture gallery page
├── page.js             # Home/About page (default export)
├── layout.js           # Root layout with metadata
├── error.js            # Error boundary
├── not_found.js        # 404 page
└── globals.css         # Global styles
```

### Imports

- Use path aliases defined in `jsconfig.json`:
  - `@/` maps to `src/app/`
  - `@/components/` maps to `src/app/components/`
  - `@/lib/` maps to `src/app/lib/`
- Examples:
```javascript
import Layout from '@/components/Layout'
import './globals.css'
```

### Server vs Client Components

- **Server Components** (default): No directive needed
- **Client Components**: Add `'use client'` at the top of the file:
```javascript
'use client'

import { useState } from 'react'
```

Use client components only when needed:
- State management (`useState`, `useReducer`)
- Effects (`useEffect`)
- Browser APIs (`window`, `document`, `localStorage`)
- Event handlers

### Naming Conventions

- **Components**: PascalCase (e.g., `Navigation.js`, `Layout.js`)
- **Pages**: camelCase for files in route directories (e.g., `page.js`, `layout.js`)
- **CSS Classes**: Use Tailwind utility classes with kebab-case custom classes in `globals.css`
- **Variables/Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE

### Styling with Tailwind CSS

**Color Palette** (defined in `tailwind.config.js`):
- **Maroon**: Primary brand color (`maroon-50` to `maroon-950`)
- **Gold**: Accent color (`gold-50` to `gold-950`)

**Custom Component Classes** (in `globals.css`):
- `btn-primary`: Gold button with hover state
- `btn-secondary`: Maroon button with hover state
- `card`: White card with shadow and border
- `tab-button`: Navigation tab styling

**Typography**:
- `font-playful`: Comic Neue font family
- `font-youthful`: Fredoka One font family

### Component Structure

```javascript
// Server Component pattern
export default function ComponentName() {
  return (
    <div className="...">
      {/* JSX content */}
    </div>
  )
}

// Client Component pattern
'use client'

import { useState } from 'react'

export default function ClientComponent() {
  const [state, setState] = useState(initialValue)
  
  return (
    <div className="...">
      {/* JSX content */}
    </div>
  )
}
```

### Error Handling

- Use Next.js error boundary pattern in `error.js`:
```javascript
'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### Metadata

Define metadata in layout.js:
```javascript
export const metadata = {
  title: 'Page Title',
  description: 'Page description',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f59e0b',
}
```

### Navigation

Use Next.js `Link` component:
```javascript
import Link from 'next/link'

<Link href="/videos" className="...">
  Videos
</Link>
```

### Icons

Use inline SVGs or emoji. Avoid external icon libraries.

## ESLint Configuration

Uses `eslint-config-next` (Next.js built-in ESLint config). No custom rules configured.

## Best Practices

1. **Server Components by Default**: Start with server components, only add `'use client'` when browser APIs or React hooks are needed
2. **Minimal Client Code**: Keep client-side JavaScript minimal
3. **Safe Service Worker**: Never use `innerHTML` or `document.write`
4. **File Size Limits**: Videos max 50MB, pictures max 10MB
5. **PWA Support**: All pages should work offline
6. **Responsive Design**: Mobile-first approach with Tailwind breakpoints

## Deployment

- **Platform**: AWS Amplify
- **Output Directory**: `out/` (when `output: 'export'` is enabled)
- **Trailing Slashes**: Enabled (`trailingSlash: true`)
- **Images**: Unoptimized for static export (`images.unoptimized: true`)

## Common Tasks

### Adding a New Page

1. Create directory: `src/app/newpage/`
2. Create `page.js` with default export component
3. Add navigation link in `Navigation.js`
4. Update `getActiveTab()` function in Navigation.js

### Adding a New Component

1. Create file in `src/app/components/`
2. Use PascalCase filename
3. Export as default
4. Import using `@/components/ComponentName`

### Customizing Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  maroon: { /* shades */ },
  gold: { /* shades */ },
}
```

Then use in classes: `text-maroon-700`, `bg-gold-500`
