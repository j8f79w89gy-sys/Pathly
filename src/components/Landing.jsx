import React from 'react'
import { Link } from 'react-router-dom'

const PROCESS = [
  { key: 'Understand', note: 'Listen to your situation without rushing to advice' },
  { key: 'Challenge', note: 'Ask the questions you might be avoiding' },
  { key: 'Explore', note: 'Surface options you haven\u2019t fully considered' },
  { key: 'Compare', note: 'Weigh them on the factors that matter to you' },
  { key: 'Recommend', note: 'Name a direction \u2014 with reasoning, not a verdict' },
  { key: 'Plan', note: 'Turn it into a 90-day experiment' },
  { key: 'Reassess', note: 'Revisit with real evidence, not just a feeling' },
]

const FEATURES = [
  {
    title: 'Talk to Pathly',
    body: 'Explain your situation the way you would to a thoughtful friend who happens to ask very good questions.',
  },
  {
    title: 'Discover your options',
    body: 'See paths you hadn\u2019t named yet \u2014 including the ones that combine what you thought were opposites.',
  },
  {
    title: 'Learn from real experiences',
    body: 'Read structured accounts from people who faced a similar fork, including what they\u2019d do differently.',
  },
  {
    title: 'Build your next 90 days',
    body: 'Leave with a small, testable plan \u2014 not a permanent verdict on the rest of your life.',
  },
]

export default function Landing() {
  return (
    <div>
      <section style={{ padding: '96px 0 64px', borderBottom: '1px solid var(--paper-line)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <span className="eyebrow">Pathly</span>
          <h1 style={{ fontSize: 'clamp(34px, 6vw, 56px)', marginTop: 18, letterSpacing: '-0.01em' }}>
            What do you actually want to do with your life?
          </h1>
          <p style={{ fontSize: 19, color: 'var(--ink-soft)', marginTop: 22, maxWidth: 560 }}>
            Talk it through. Explore your options. Learn from people who've been there.
            Find your next right step.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 34, flexWrap: 'wrap' }}>
            <Link to="/onboarding" className="btn btn-primary">Start your journey</Link>
            <a href="#how-it-works" className="btn btn-secondary">Explore how it works</a>
          </div>
          <p style={{ marginTop: 18, fontSize: 13, color: 'var(--muted)' }}>
            You don't need to have your whole life figured out. You just need to find your next right step.
          </p>
        </div>
      </section>

      <section id="how-it-works" style={{ padding: '72px 0', borderBottom: '1px solid var(--paper-line)' }}>
        <div className="container">
          <span className="eyebrow">How it works</span>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', marginTop: 10, marginBottom: 44, maxWidth: 520 }}>
            A real process, not a quiz result
          </h2>
          <PathDiagram />
        </div>
      </section>

      <section style={{ padding: '72px 0' }}>
        <div className="container">
          <span className="eyebrow">What you'll do</span>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: 20,
            marginTop: 28,
          }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="card">
                <h3 style={{ fontSize: 19 }}>{f.title}</h3>
                <p style={{ marginTop: 10, color: 'var(--ink-soft)', fontSize: 15 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '64px 0 96px' }}>
        <div className="container" style={{
          background: 'var(--ink)',
          color: 'var(--base)',
          borderRadius: 'var(--radius-lg)',
          padding: '56px 44px',
          textAlign: 'center',
        }}>
          <h2 style={{ color: 'var(--base)', fontSize: 'clamp(24px, 4vw, 32px)', maxWidth: 520, margin: '0 auto' }}>
            Your next right step doesn't have to be your final answer.
          </h2>
          <div style={{ marginTop: 28 }}>
            <Link to="/onboarding" className="btn" style={{ background: 'var(--gold)', color: 'var(--ink)' }}>
              Start your journey
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function PathDiagram() {
  const n = PROCESS.length
  const width = 1000
  const height = 260
  const points = PROCESS.map((_, i) => {
    const x = 40 + (i * (width - 80)) / (n - 1)
    const y = 130 + Math.sin(i * 1.15) * 70
    return { x, y }
  })
  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `Q ${(points[i - 1].x + p.x) / 2 + 10} ${points[i - 1].y} ${p.x} ${p.y}`))
    .join(' ')

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${width} ${height + 70}`} style={{ minWidth: 720, width: '100%' }} role="img" aria-label="Seven-stage Pathly process">
        <path d={pathD} fill="none" stroke="var(--gold-soft)" strokeWidth="3" strokeDasharray="1 10" strokeLinecap="round" />
        {points.map((p, i) => (
          <g key={i}>
            
