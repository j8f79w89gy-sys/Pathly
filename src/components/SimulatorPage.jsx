import React from 'react'
import { Link } from 'react-router-dom'
import templates from '../data/pathTemplates.json'

export default function SimulatorPage() {
  return (
    <div className="container" style={{ maxWidth: 960, padding: '48px 24px 80px' }}>
      <span className="eyebrow">Path simulator</span>
      <h1 style={{ fontSize: 32, marginTop: 10 }}>What could each path look like?</h1>
      <p style={{ marginTop: 12, color: 'var(--ink-soft)', maxWidth: 620 }}>
        These are illustrative scenarios to help you think ahead \u2014 not predictions of what will
        actually happen to you.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 32 }}>
        {templates.map((t) => (
          <div key={t.id} className="card">
            <span className="tag" style={{ marginBottom: 12 }}>Illustrative scenario</span>
            <h3 style={{ fontSize: 18, marginTop: 10 }}>{t.label}</h3>
            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column' }}>
              {t.milestones.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: i < t.milestones.length - 1 ? 18 : 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }} />
                    {i < t.milestones.length - 1 && <div style={{ width: 1, flex: 1, background: 'var(--paper-line)', marginTop: 4 }} />}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--teal)' }}>{m.period}</div>
                    <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 2 }}>{m.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40 }}>
        <Link to="/plan" className="btn btn-primary">Build your next 90 days</Link>
      </div>
    </div>
  )
}
