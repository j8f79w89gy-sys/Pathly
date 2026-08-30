import React from 'react'
import { Link } from 'react-router-dom'
import { useConversation } from '../context/ConversationContext.jsx'

const FACTORS = [
  { key: 'interest', label: 'Interest alignment' },
  { key: 'strength', label: 'Strength alignment' },
  { key: 'financial', label: 'Financial potential' },
  { key: 'stability', label: 'Stability' },
  { key: 'risk', label: 'Risk level' },
  { key: 'time', label: 'Time required' },
  { key: 'education', label: 'Education requirements' },
  { key: 'flexibility', label: 'Geographic flexibility' },
]

function deriveFactors(opt) {
  const riskyTitle = /focus/i.test(opt.id)
  return {
    interest: opt.fit === 'Strong fit' ? 'High' : opt.fit === 'Possible fit' ? 'Medium' : 'Low',
    strength: opt.fit === 'Weak fit' ? 'Unclear' : 'Worth testing',
    financial: riskyTitle ? 'Uncertain early on' : 'More predictable',
    stability: riskyTitle ? 'Lower' : 'Higher',
    risk: riskyTitle ? 'Higher' : 'Moderate',
    time: 'Significant either way',
    education: /combine|stable/i.test(opt.id) ? 'Likely continues' : 'May pause',
    flexibility: 'Depends on your location and field',
  }
}

export default function ComparePage() {
  const { options } = useConversation()

  if (options.length === 0) {
    return (
      <div className="container" style={{ maxWidth: 720, padding: '48px 24px' }}>
        <p style={{ color: 'var(--muted)' }}>Generate your options first to compare them.</p>
        <Link to="/options" className="btn btn-primary" style={{ marginTop: 16 }}>See options</Link>
      </div>
    )
  }

  return (
    <div className="container" style={{ maxWidth: 960, padding: '48px 24px 80px' }}>
      <span className="eyebrow">Compare paths</span>
      <h1 style={{ fontSize: 32, marginTop: 10 }}>Side by side</h1>
      <p style={{ marginTop: 12, color: 'var(--ink-soft)', maxWidth: 620 }}>
        These are decision-support factors to help you think, not guarantees about how any path will actually go.
      </p>

      <div style={{ overflowX: 'auto', marginTop: 32 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
          <thead>
            <tr>
              <th style={cellStyle(true)}></th>
              {options.map((o) => (
                <th key={o.id} style={cellStyle(true)}>{o.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FACTORS.map((f) => (
              <tr key={f.key}>
                <td style={{ ...cellStyle(false), fontWeight: 600, color: 'var(--ink-soft)', fontSize: 13, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                  {f.label}
                </td>
                {options.map((o) => (
                  <td key={o.id} style={cellStyle(false)}>{deriveFactors(o)[f.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 40 }}>
        <Link to="/stories" className="btn btn-primary">See people who faced similar choices</Link>
      </div>
    </div>
  )
}

function cellStyle(isHeader) {
  return {
    textAlign: 'left',
    padding: '14px 16px',
    borderBottom: '1px solid var(--paper-line)',
    fontSize: 14,
    fontWeight: isHeader ? 600 : 400,
    background: isHeader ? 'var(--paper)' : 'transparent',
    whiteSpace: isHeader ? 'nowrap' : 'normal',
  }
}
