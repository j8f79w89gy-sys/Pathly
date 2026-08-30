import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConversation } from '../context/ConversationContext.jsx'
import { sendConversationTurn } from '../lib/api.js'

const STAGE_LABELS = {
  understand: 'Understanding your situation',
  challenge: 'Challenging assumptions',
  explore: 'Exploring possibilities',
  compare: 'Comparing paths',
  recommend: 'Shaping a direction',
  plan: 'Planning your next 90 days',
  reassess: 'Ready to reassess',
}

const OPENING_MESSAGE = "I'm glad you're here. Tell me what's on your mind \u2014 the decision, the pull you're feeling, whatever's true right now. There's no wrong way to start."

export default function ChatUI() {
  const { onboarding, messages, setMessages, profile, mergeProfile, stage, setStage } = useConversation()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [turnCountInStage, setTurnCountInStage] = useState(0)
  const [askedCount, setAskedCount] = useState(0)
  const scrollRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (messages.length === 0) {
      const opener = onboarding.considering
        ? `${OPENING_MESSAGE} I noted you're weighing ${onboarding.considering} \u2014 start wherever feels most true.`
        : OPENING_MESSAGE
      setMessages([{ role: 'assistant', text: opener }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isTyping) return
    setMessages((m) => [...m, { role: 'user', text }])
    setInput('')
    setIsTyping(true)

    const result = await sendConversationTurn({
      userText: text,
      stage,
      turnCountInStage,
      askedCount,
      profile,
      history: messages,
      onboarding,
    })

    mergeProfile(result.profileUpdates)
    setMessages((m) => [...m, { role: 'assistant', text: result.reply, isSummary: result.isSummary }])
    setIsTyping(false)

    if (result.isSummary) {
      setTurnCountInStage(0)
    } else {
      setTurnCountInStage((c) => c + 1)
      setAskedCount((c) => c + 1)
    }
    if (result.nextStage !== stage) setStage(result.nextStage)
  }

  const confirmSummary = (correct) => {
    setMessages((m) => [
      ...m,
      { role: 'user', text: correct ? "Yes, that's right." : "Not quite \u2014 let me clarify." },
    ])
  }

  return (
    <div className="container" style={{ maxWidth: 720, padding: '24px 24px 0', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      <div style={{ paddingBottom: 16, borderBottom: '1px solid var(--paper-line)' }}>
        <span className="tag" style={{ background: 'var(--teal-soft)', color: 'var(--teal)' }}>
          {STAGE_LABELS[stage]}
        </span>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 4px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.map((m, i) => (
          <Bubble key={i} msg={m} onConfirm={m.isSummary ? confirmSummary : undefined} />
        ))}
        {isTyping && <TypingBubble />}
      </div>

      <div style={{ padding: '16px 0 24px', borderTop: '1px solid var(--paper-line)' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <textarea
            rows={1}
            value={input}
            placeholder="Type what's on your mind..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            style={{
              flex: 1,
              resize: 'none',
              padding: '13px 16px',
              border: '1px solid var(--paper-line)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-body)',
              fontSize: 15,
            }}
          />
          <button className="btn btn-primary" onClick={handleSend} disabled={isTyping}>Send</button>
        </div>
        {profile.interests.length > 0 && (
          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-ghost" onClick={() => navigate('/profile')}>
              See your profile so far &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Bubble({ msg, onConfirm }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <div style={{
        maxWidth: '80%',
        background: isUser ? 'var(--ink)' : (msg.isSummary ? 'var(--teal-soft)' : 'var(--paper)'),
        color: isUser ? 'var(--base)' : 'var(--ink)',
        padding: '13px 16px',
        borderRadius: isUser ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
        fontSize: 15,
        lineHeight: 1.5,
      }}>
        {msg.text}
        {onConfirm && (
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn btn-secondary" style={{ padding: '7px 14px', fontSize: 13 }} onClick={() => onConfirm(true)}>That's right</button>
            <button className="btn btn-secondary" style={{ padding: '7px 14px', fontSize: 13 }} onClick={() => onConfirm(false)}>Not quite</button>
          </div>
        )}
      </div>
    </div>
  )
}

function TypingBubble() {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ background: 'var(--paper)', padding: '13px 18px', borderRadius: '14px 14px 14px 3px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--muted)' }}>
        Pathly is thinking&hellip;
      </div>
    </div>
  )
}
