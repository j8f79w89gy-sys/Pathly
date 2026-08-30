import React from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { useConversation } from './context/ConversationContext.jsx'
import Landing from './components/Landing.jsx'
import Onboarding from './components/Onboarding.jsx'
import ChatUI from './components/ChatUI.jsx'
import ProfilePage from './components/ProfilePage.jsx'
import OptionsPage from './components/OptionsPage.jsx'
import ComparePage from './components/ComparePage.jsx'
import StoriesPage from './components/StoriesPage.jsx'
import SimulatorPage from './components/SimulatorPage.jsx'
import PlanPage from './components/PlanPage.jsx'

const NAV_LINKS = [
  { to: '/conversation', label: 'Talk' },
  { to: '/profile', label: 'Profile' },
  { to: '/options', label: 'Options' },
  { to: '/compare', label: 'Compare' },
  { to: '/stories', label: 'People Like You' },
  { to: '/simulator', label: 'Simulator' },
  { to: '/plan', label: 'Next 90 Days' },
]

function TopNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { resetSession } = useConversation()
  if (location.pathname === '/') return null

  const handleReset = () => {
    if (window.confirm('Start a new session? This clears your current conversation, profile, and options.')) {
      resetSession()
      navigate('/')
    }
  }

  return (
    <header style={{ borderBottom: '1px solid var(--paper-line)', background: 'var(--base)', position: 'sticky', top: 0, zIndex: 10 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600 }}>Pathly</Link>
        <nav style={{ display: 'flex', gap: 22, flexWrap: 'wrap', alignItems: 'center' }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: location.pathname === link.to ? 'var(--ink)' : 'var(--muted)',
                borderBottom: location.pathname === link.to ? '2px solid var(--gold)' : '2px solid transparent',
                paddingBottom: 4,
              }}
            >
              {link.label}
            </Link>
          ))}
          <button className="btn-ghost" style={{ fontSize: 13 }} onClick={handleReset}>Start over</button>
        </nav>
      </div>
    </header>
  )
}

export default function App() {
  return (
    <>
      <TopNav />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/conversation" element={<ChatUI />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/options" element={<OptionsPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/simulator" element={<SimulatorPage />} />
        <Route path="/plan" element={<PlanPage />} />
      </Routes>
    </>
  )
}
