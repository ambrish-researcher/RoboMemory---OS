import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import MemoriesPage from './pages/MemoriesPage'
import GraphPage from './pages/GraphPage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{
        height: '56px',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100
      }}>

        <span style={{
          fontFamily: 'Space Grotesk',
          fontSize: '18px',
          color: 'var(--accent-primary)',
          animation: 'roboGlow 2s infinite'
        }}>
          🤖 RoboMemoryOS
        </span>

        <div style={{ display: 'flex', gap: '32px' }}>
          {[
            { path: '/', label: 'Chat' },
            { path: '/memories', label: 'Memories' },
            { path: '/graph', label: 'Graph' },
            { path: '/profile', label: 'Profile' }
          ].map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              style={({ isActive }) => ({
                color: isActive
                  ? 'var(--accent-primary)'
                  : 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                borderBottom: isActive
                  ? '2px solid var(--accent-primary)'
                  : '2px solid transparent',
                paddingBottom: '4px'
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '11px',
            color: 'var(--accent-primary)',
            fontFamily: 'JetBrains Mono'
          }}>
            ROBO ONLINE
          </span>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: 'var(--accent-primary)',
            animation: 'pulse 2s infinite'
          }} />
        </div>
      </nav>

      <div style={{ paddingTop: '56px', height: '100vh' }}>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/memories" element={<MemoriesPage />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
