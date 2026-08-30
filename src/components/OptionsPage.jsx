import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useConversation } from '../context/ConversationContext.jsx'
import { generateOptions } from '../lib/api.js'

const FIT_CLASS = {
  'Strong fit': 'fit-strong',
  'Possible fit': 'fit-possible',
  'Weak fit': 'fit-weak',
}

export default function OptionsPage() {
  const { profile, onboarding, options, setOptions } = useConversation()
  const [loading, setLoading] = useState(false)

  const runGenerate = () => {
    setLoading(true)
    generateOptions({ profile, onboarding }).then((opts) => {
      setOptions(opts)
      setLoading(false)
    })
  }

  useEffect(() => {
    if (options.length === 0) runGenerate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="container" style={{ maxWidth: 960, padding: '48px 24px 80px' }}>
      <span className="eyebrow">Your options</span>
      <h1 style={{ fontSize: 32, marginTop: 10 }}>Possible paths worth testing</h1>
      <p style={{ marginTop: 12, color: 'var(--ink-soft)', maxWidth: 620 }}>
        These come from your conversation so far. Fit labels are directional, not precise scores \u2014
        treat them as a starting point for testing, not a verdict.
      </p>

      {options.length > 0 && !loading && (
        <button className="btn-ghost" style={{ marginTop: 16 }} onClick={runGenerate}>
          Regenerate from latest conversation &rarr;
        </button>
      )}

      {loading && <p style={{ marginTop: 32, color: 'var(--muted)' }}>Generating options&hellip;</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 32 }}>
        {options.map((opt) => (
          <div key={opt.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <span className={FIT_CLASS[opt.fit]} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, textTransform: 'uppercase' }}>
                {opt.fit}
              </span>
              <h3 style={{ fontSize: 20, marginTop: 6 }}>{opt.title}</h3>
            </div>
            <p style={{ fontSize: 14, color: 'var(--ink-soft)' }}>{opt.whyFit}</p>
            <Detail label="Advantages" items={opt.advantages} />
            <Detail label="Challenges" items={opt.challenges} />
            <Detail label="Risks" items={opt.risks} />
            <Detail label="What's required" items={opt.required} />
            <Detail label="Needs testing" items={opt.toTest} />
            <Detail label="Open questions" items={opt.openQuestions} />
          </div>
        ))}
      </div>

      {options.length > 0 && (
        <div style={{ marginTop: 40, display: 'flex', gap: 12 }}>
          <Link to="/compare" className="btn btn-primary">Compare these paths</Link>
          <Link to="/stories" className="btn btn-secondary">See people like you</Link>
        </div>
      )}
    </div>
  )
}

function Detail({ label, items }) {
  if (!items || items.length === 0) return null
  return (
    <div>
      <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: 'var(--ink-soft)' }}>
        {items.map((it, i) => <li key={i} style={{ marginBottom: 3 }}>{it}</li>)}
      </ul>
    </div>
  )
}
