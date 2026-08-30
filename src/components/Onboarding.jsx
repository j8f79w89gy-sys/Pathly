import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConversation } from '../context/ConversationContext.jsx'

const QUESTIONS = [
  { key: 'age', label: 'How old are you?', type: 'text', placeholder: 'e.g. 20' },
  { key: 'country', label: 'What country are you in?', type: 'text', placeholder: 'e.g. Kenya' },
  { key: 'situation', label: 'What\u2019s your current education or work situation?', type: 'text', placeholder: 'e.g. Second-year university student' },
  { key: 'considering', label: 'What are you currently considering?', type: 'text', placeholder: 'e.g. Cricket or business' },
  { key: 'confusing', label: 'What\u2019s confusing you most about this?', type: 'text', placeholder: 'Optional, but helpful' },
  { key: 'matters', label: 'What matters most to you right now?', type: 'text', placeholder: 'e.g. Stability, freedom, family expectations' },
  { key: 'concerns', label: 'What are your biggest concerns?', type: 'text', placeholder: 'Optional' },
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const { setOnboarding } = useConversation()
  const navigate = useNavigate()

  const q = QUESTIONS[step]
  const isLast = step === QUESTIONS.length - 1

  const goNext = () => {
    if (isLast) {
      setOnboarding(answers)
      navigate('/conversation')
    } else {
      setStep((s) => s + 1)
    }
  }

  const handleChange = (val) => setAnswers((a) => ({ ...a, [q.key]: val }))

  return (
    <div className="container" style={{ maxWidth: 560, padding: '72px 24px' }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 40 }}>
        {QUESTIONS.map((_, i) => (
          <div
            key={i}
            style={{
              height: 4,
              flex: 1,
              borderRadius: 2,
              background: i <= step ? 'var(--gold)' : 'var(--paper-line)',
            }}
          />
        ))}
      </div>

      <span className="eyebrow">Question {step + 1} of {QUESTIONS.length}</span>
      <h2 style={{ fontSize: 28, marginTop: 12, marginBottom: 24 }}>{q.label}</h2>

      <input
        autoFocus
        type="text"
        value={answers[q.key] || ''}
        placeholder={q.placeholder}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && goNext()}
        style={{
          width: '100%',
          padding: '14px 16px',
          fontSize: 16,
          border: '1px solid var(--paper-line)',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-body)',
          background: 'var(--white)',
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
        <button className="btn-ghost" onClick={goNext}>Skip this question</button>
        <button className="btn btn-primary" onClick={goNext}>
          {isLast ? 'Start talking to Pathly' : 'Next'}
        </button>
      </div>
    </div>
  )
}
