/**
 * PATHLY conversation engine.
 *
 * Tries the real backend first (if running with an ANTHROPIC_API_KEY
 * configured); if it isn't reachable, transparently falls back to a local
 * rule-based simulation so the app always works out of the box.
 */

let backendAvailable = null

async function checkBackend() {
  if (backendAvailable !== null) return backendAvailable
  try {
    const res = await fetch('/api/health', { signal: AbortSignal.timeout(1500) })
    backendAvailable = res.ok
  } catch {
    backendAvailable = false
  }
  return backendAvailable
}

const STAGE_ORDER = ['understand', 'challenge', 'explore', 'compare', 'recommend', 'plan', 'reassess']

const KEYWORD_MAP = {
  interests: ['cricket', 'football', 'sport', 'business', 'startup', 'medicine', 'doctor', 'art', 'music', 'design', 'writing', 'engineering', 'finance', 'coding', 'programming', 'science', 'teaching'],
  constraints: ['money', 'financial', 'afford', 'visa', 'family', 'parents', 'time', 'age', 'location', 'scholarship', 'debt', 'loan'],
  concerns: ['worried', 'scared', 'afraid', 'anxious', 'uncertain', 'risk', 'fail', 'failure', 'pressure', 'stress'],
  values: ['stability', 'freedom', 'creativity', 'impact', 'money', 'independence', 'family', 'recognition', 'growth', 'balance'],
  motivations: ['love', 'passion', 'enjoy', 'excited', 'proud', 'happy'],
}

const RISK_WORDS = {
  high: ['all in', 'no backup', 'risk it', 'go all the way', 'quit everything'],
  low: ['safe', 'backup plan', 'fallback', 'cautious', 'careful'],
}

function extractSignals(text) {
  const lower = text.toLowerCase()
  const found = { interests: [], constraints: [], concerns: [], values: [], motivations: [] }
  for (const key of Object.keys(KEYWORD_MAP)) {
    for (const word of KEYWORD_MAP[key]) {
      if (lower.includes(word)) found[key].push(word)
    }
  }
  let riskTolerance = null
  if (RISK_WORDS.high.some((w) => lower.includes(w))) riskTolerance = 'high'
  if (RISK_WORDS.low.some((w) => lower.includes(w))) riskTolerance = 'low'
  return { ...found, riskTolerance }
}

const FOLLOWUPS = {
  understand: [
    "What does a realistic version of that path actually look like day-to-day right now — not the dream version, the current one?",
    "How long have you been seriously considering this, and what's changed recently that's made it more urgent?",
    "When you imagine telling someone about this choice in five years, what outcome are you hoping to describe?",
  ],
  challenge: [
    "What evidence do you already have that you're good at this — feedback from someone qualified to judge, not just your own sense of it?",
    "If this path doesn't work out the way you hope, what happens next? Walk me through that.",
    "Is there anything you've told me that seems to pull in two different directions at once?",
  ],
  explore: [
    "Is there a version of this that isn't all-or-nothing — some way to combine or sequence the options you're weighing?",
    "Who do you know, even loosely, who's tried something similar? What did you learn from watching them?",
    "What would need to be true for the 'safer' option to actually feel exciting to you?",
  ],
  compare: [
    "Between the paths we've named, which one are you more afraid of choosing wrong — and why do you think that is?",
    "If money and other people's opinions were both removed from the equation, does your answer change?",
  ],
  recommend: [
    "Of everything we've discussed, which option are you least able to stop thinking about?",
  ],
  plan: [
    "What's the smallest real-world test you could run in the next two weeks to get actual evidence, not just more thinking?",
  ],
  reassess: [
    "What would have to happen for you to say this experiment gave you a clear answer?",
  ],
}

function pickFollowup(stage, askedCount) {
  const bank = FOLLOWUPS[stage] || FOLLOWUPS.understand
  return bank[askedCount % bank.length]
}

function shouldSummarize(turnCountInStage) {
  return turnCountInStage > 0 && turnCountInStage % 3 === 0
}

function buildSummary(profile) {
  const parts = []
  if (profile.interests.length) parts.push(`you're drawn to ${profile.interests.slice(0, 3).join(', ')}`)
  if (profile.constraints.length) parts.push(`you're navigating ${profile.constraints.slice(0, 2).join(' and ')} as real constraints`)
  if (profile.concerns.length) parts.push(`there's some real worry about ${profile.concerns.slice(0, 2).join(' and ')}`)
  if (profile.values.length) parts.push(`${profile.values.slice(0, 2).join(' and ')} seem to matter a lot to you`)
  if (!parts.length) return "Here's what
