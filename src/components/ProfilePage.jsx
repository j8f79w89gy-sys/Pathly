import React from 'react'
import { Link } from 'react-router-dom'
import { useConversation } from '../context/ConversationContext.jsx'

const SECTIONS = [
  { key: 'interests', label: 'Interests' },
  { key: 'strengths', label: 'Strengths' },
  { key: 'values', label: 'Values' },
  { key: 'goals', label: 'Goals' },
  { key: 'constraints', label: 'Constraints' },
  { key: 'concerns', label: 'Concerns' },
  { key: 'motivations', label: 'Motivations' },
]

export default function ProfilePage() {
  const { profile, onboarding } = useConversation()
  const hasAnything = SECTIONS.some((s) => (profile[s.key] || []).length > 0)

  return (
    <div className="container" style={{ maxWidth: 860, padding: '48px 24px 80px' }}>
      <span className="eyebrow">Your profile</span>
      <h1 style={{ fontSize: 32, marginTop: 10 }}>What Pathly is picking up on</h1>
      <p style={{ marginTop: 12, color: 'var(--ink-soft)', maxWidth: 560 }}>
        These are AI-generated observations from your conversation \u2014 not a scientific
        personality measurement. The more you talk with Pathly, the more accurate this gets.
      </p>

      {!hasAnything && (
        <div className="card" style={{ marginTop: 32 }}>
          <p style={{ color: 'var(--muted)' }}>
            Nothing here yet \u2014 head back to the conversation and share a bit more about your situation.
          </p>
          <Link to="/conversation" className="btn btn-primary" style={{ marginTop: 16 }}>Continue talking</Link>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16, marginTop: 32 }}>
        {SECTIONS.map((s) => (
          <div key={s.key} className="card">
            <h3 style={{ fontSize: 16, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--teal)' }}>
              {s.label}
            </h3>
            <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(profile[s.key] || []).length === 0 && <span style={{ color: 'var(--muted)', fontSize: 14 }}>Not enough signal yet</span>}
              {(profile[s.key] || []).map((item) => (
                <span key={item} className="tag">{item}</span>
              ))}
            </div>
          </div>
        ))}

        <div className="card">
          <h3 style={{ fontSize: 16, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--teal)' }}>
            Risk tolerance
          </h3>
          <div style={{ marginTop: 12 }}>
            {profile.riskTolerance
              ? <span className="tag">{profile.riskTolerance}</span>
              : <span style={{ color: 'var(--muted)', fontSize: 14 }}>Not enough signal yet</span>}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 16, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--teal)' }}>
            Currently considering
          </h3>
          <p style={{ marginTop: 12, fontSize: 14, color: 'var(--ink-soft)' }}>
            {onboarding.considering || 'Not specified yet'}
          </p>
        </div>
      </div>

      <div style={{ marginTop: 40, display: 'flex', gap: 12 }}>
        <Link to="/conversation" className="btn btn-secondary">Keep talking</Link>
        <Link to="/options" className="btn btn-primary">See your options</Link>
      </div>
    </div>
  )
}
