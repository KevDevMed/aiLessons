import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import './styles/global.css'
import App from './App'

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined
const root = createRoot(document.getElementById('root')!)

if (!convexUrl) {
  console.error(
    'VITE_CONVEX_URL is not set. Set it in your build environment (or run `npx convex dev` locally).',
  )
  root.render(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 520 }}>
        <h1 style={{ fontSize: 20, marginBottom: 12 }}>Configuration error</h1>
        <p style={{ opacity: 0.8, lineHeight: 1.5 }}>
          <code>VITE_CONVEX_URL</code> is not set. The app can't start without a
          Convex deployment URL. Set it in the production build environment and
          redeploy.
        </p>
      </div>
    </div>,
  )
} else {
  const convex = new ConvexReactClient(convexUrl)
  root.render(
    <StrictMode>
      <ConvexProvider client={convex}>
        <App />
      </ConvexProvider>
    </StrictMode>,
  )
}
