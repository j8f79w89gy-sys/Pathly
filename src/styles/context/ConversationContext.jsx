import React, { createContext, useContext, useState, useEffect } from 'react'

const ConversationContext = createContext(null)

const STAGES = ['understand', 'challenge', 'explore', 'compare', 'recommend', 'plan', 'reassess']

const emptyProfile = {
  interests: [],
  strengths: [],
  values: [],
  goals: [],
  constraints: [],
  concerns: [],
  riskTolerance: null,
  motivations: [],
  currentOptions: [],
}

const STORAGE_KEY = 'pathly-session-v1'

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function ConversationProvider({ children }) {
  const persisted = typeof window !== 'undefined' ? loadPersisted() : null

  const [onboarding, setOnboarding] = useState(persisted?.onboarding || {})
  const [messages, setMessages] = useState(persisted?.messages || [])
  const [profile, setProfile] = useState(persisted?.profile || emptyProfile)
  const [stage, setStage] = useState(persisted?.stage || 'understand')
  const [options, setOptions] = useState(persisted?.options || [])

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ onboarding, messages, profile, stage, options })
      )
    } catch {
      // storage full or unavailable — non-fatal, just skip persistence
    }
  }, [onboarding, messages, profile, stage, options])

  const advanceStage = () => {
    setStage((current) => {
      const idx = STAGES.indexOf(current)
      return STAGES[Math.min(idx + 1, STAGES.length - 1)]
    })
  }

  const mergeProfile = (partial) => {
    setProfile((prev) => {
      const next = { ...prev }
      for (const key of Object.keys(partial)) {
        if (Array.isArray(partial[key])) {
          const merged = new Set([...(prev[key] || []), ...partial[key]])
          next[key] = Array.from(merged)
        } else if (partial[key] !== undefined) {
          next[key] = partial[key]
        }
      }
      return next
    })
  }

  const resetSession = () => {
    setOnboarding({})
    setMessages([])
    setProfile(emptyProfile)
    setStage('understand')
    setOptions([])
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* noop */ }
  }

  const value = {
    onboarding, setOnboarding,
    messages, setMessages,
    profile, setProfile, mergeProfile,
    stage, setStage, advanceStage, STAGES,
    options, setOptions,
    resetSession,
  }

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  )
}

export function useConversation() {
  const ctx = useContext(ConversationContext)
  if (!ctx) throw new Error('useConversation must be used within ConversationProvider')
  return ctx
}
