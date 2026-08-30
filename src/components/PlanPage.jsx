import React from 'react'
import { useConversation } from '../context/ConversationContext.jsx'

const PLAN = [
  {
    period: 'Weeks 1\u20132',
    title: 'Research and conversations',
    tasks: [
      'Talk to at least 2 people already on a path you\u2019re considering',
      'List what you don\u2019t know yet that would change your decision',
    ],
    evidence: 'Notes from each conversation, written down the same day',
  },
  {
    period: 'Weeks 3\u20134',
    title: 'Test the skill',
    tasks: [
      'Do a small, real version of the work itself \u2014 not just reading about it',
      'Ask someone qualified for honest feedback on what you produced',
    ],
    evidence: 'The feedback itself, quoted as closely as possible',
  },
  {
    period: 'Month 2',
    title: 'Real-world experiment',
    tasks: [
      'Run a slightly bigger, time-boxed version of the path (a project, trial, or role)',
      'Track what parts energized you vs. drained you',
    ],
    evidence: 'A short log of energizing vs. draining moments',
  },
  {
    period: 'Month 3',
    title: 'Evaluate the evidence',
    tasks: [
      'Review everything gathered so far against your original questions',
      'Decide: continue, adjust, or pivot \u2014 based on evidence, not mood',
    ],
    evidence: 'A one-page summary of what you learned',
  },
]

export default function PlanPage() {
  const { onboarding } = useConversation()

  return (
    <div className="container" style={{ maxWidth: 780, padding: '48px 24px 80px' }}>
      <span className="eyebrow">Your next 90 days</span>
      <h1 style={{ fontSize: 32, marginTop: 10 }}>Don't decide your whole life today</h1>
      <p style={{ marginTop: 12, color: 'var(--ink-soft)', maxWidth: 600 }}>
        Test your options intelligently. This is an experiment, not a permanent verdict \u2014
        {onboarding.considering ? ` built around ${onboarding.considering}.` : ' built around what you\u2019ve shared.'}
      </p>

      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {PLAN.map((p) => (
          <div key={p.period} className="card">
            <span className="eyebrow">{p.period}</span>
            <h3 style={{ fontSize: 19, marginTop: 8 }}>{p.title}</h3>
            <ul style={{ marginTop: 12, paddingLeft: 18, fontSize: 14, color: 'var(--ink-soft)' }}>
              {p.tasks.map((t, i) => <li key={i} style={{ marginBottom: 4 }}>{t}</li>)}
            </ul>
            <div style={{ marginTop: 12, fontSize: 13, color: 'var(--teal)' }}>
              <strong>Evidence to collect:</strong> {p.evidence}
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 24, background: 'var(--paper)', border: 'none' }}>
        <span className="eyebrow">Reassessment date</span>
        <p style={{ marginTop: 8, fontSize: 15 }}>
          Come back to Pathly in 90 days with what you've gathered. We'll help you weigh the
          real evidence \u2014 not just how you feel today.
        </p>
      </div>
    </div>
  )
}
