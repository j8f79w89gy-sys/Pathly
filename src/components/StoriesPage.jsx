import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import stories from '../data/stories.json'

export default function StoriesPage() {
  const [openId, setOpenId] = useState(null)

  return (
    <div className="container" style={{ maxWidth: 960, padding: '48px 24px 80px' }}>
      <span className="eyebrow">People like you</span>
      <h1 style={{ fontSize: 32, marginTop: 10 }}>Others who faced a similar fork</h1>
      <p style={{ marginTop: 12, color: 'var(--ink-soft)', maxWidth: 620 }}>
        These are demo stories for the MVP, clearly labeled as such \u2014 not real submitted accounts.
        In production this section is backed by a growing database of real, verified stories.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18, marginTop: 32 }}>
        {stories.map((s) => {
          const open = openId === s.id
          return (
            <div key={s.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: 18 }}>{s.name}</h3>
                {s.isDemo && <span className="tag tag-demo">Demo story</span>}
              </div>
              <p style={{ marginTop: 8, fontSize: 13, color: 'var(--muted)' }}>
                Age {s.ageAtDecision} &middot; {s.country}
              </p>
              <p style={{ marginTop: 12, fontSize: 14, color: 'var(--ink-soft)' }}>
                Wanted <strong>{s.wanted.toLowerCase()}</strong>, ended up choosing to {s.chose.toLowerCase()}.
              </p>

              {open && (
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
                  <Field label="Was considering" value={s.considering} />
                  <Field label="Why they chose it" value={s.why} />
                  <Field label="What happened" value={s.whatHappened} />
                  <Field label="Biggest mistake" value={s.biggestMistake} />
                  <Field label="Biggest success" value={s.biggestSuccess} />
                  <Field label="Would choose again?" value={s.wouldChooseAgain} />
                  <Field label="Advice to younger self" value={s.adviceToYoungerSelf} />
                </div>
              )}

              <button className="btn-ghost" style={{ marginTop: 14 }} onClick={() => setOpenId(open ? null : s.id)}>
                {open ? 'Show less' : 'Read full story \u2192'}
              </button>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 40 }}>
        <Link to="/simulator" className="btn btn-primary">See what each path could look like</Link>
      </div>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', color: 'var(--teal)', marginBottom: 2 }}>{label}</div>
      <div style={{ color: 'var(--ink-soft)' }}>{value}</div>
    </div>
  )
}
