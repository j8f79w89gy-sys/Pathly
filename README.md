# Pathly

"You don't need to have your whole life figured out. You just need to find your next right step."

An AI-powered life and career decision coach — not a career quiz.

## What's included (MVP)

1. Landing page
2. Onboarding
3. AI conversation UI (Understand → Challenge → Explore → Compare → Recommend → Plan → Reassess)
4. Dynamic AI-generated profile
5. Options generation
6. Path comparison
7. "People Like You" (demo stories, clearly labeled)
8. Path simulator
9. Your Next 90 Days plan

## Running it — frontend only (fastest way to see it)

The frontend currently runs a **local, rule-based simulation** of the AI
coach (see `src/lib/api.js`), so you can try the whole app with no API key
and no backend running.

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

## Connecting the real AI backend

The `backend/` folder is a working Express server that calls the real
Anthropic API. The frontend **auto-detects** whether it's running — no code
changes needed either way:

1. `cd backend && npm install`
2. `cp .env.example .env` and add your real `ANTHROPIC_API_KEY`
3. `npm run dev` (starts the API on http://localhost:8787)
4. Run the frontend as usual (`npm run dev` from the project root) — Vite
   proxies `/api` requests to the backend (see `vite.config.js`).

With the backend running, every conversation turn and option-generation call
goes to Claude. Without it, the app transparently falls back to the local
simulation in `src/lib/api.js` — so it's always demoable, backend or not.

**Never** put the Anthropic API key in any frontend file — it must only ever
live in `backend/.env`, which is never bundled or shipped to the browser.

## Other niceties included

- Your conversation, profile, and options persist in the browser
  (`localStorage`) across refreshes — no accounts needed for the demo.
- A "Start over" link in the nav clears the session cleanly.

## What costs money

- Anthropic API calls (once you connect the real backend) — billed per token
- Everything else here (static frontend, small Node backend, demo JSON data)
  runs free on most hosting platforms

## Not yet built (documented for future work)

User accounts, persistent profiles/conversations, a real story database with
submission + verification, multiple languages, salary/university data,
progress tracking, voice conversation, mobile apps, payments, analytics,
expert verification, and community features. The current architecture
(stateless API calls, JSON-shaped data contracts) is designed so a database
can be added behind the same routes without changing the frontend.

## Safety notes baked into the design

- The AI is instructed never to claim to know anyone's "perfect" career, and
  never to make medical, legal, or financial decisions for the user.
- Fit labels are qualitative ("Strong fit" / "Possible fit" / "Weak fit"),
  never fake precise percentages.
- Demo stories are always visibly labeled "Demo story" and are never
  presented as real people.
- The system prompts explicitly forbid dependency-creating language like
  "you only need me" or "ignore your family."
