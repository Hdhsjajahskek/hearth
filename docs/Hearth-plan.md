# Hearth — Master Plan

> **Forget nothing that matters.**
> A personal OS built by Bhupesh / Forge.

**Last updated:** 2026-10-05
**Status:** Pre-build. Vision locked. V1 scope defined.

---

## TABLE OF CONTENTS

1. The Philosophy
2. The Loop
3. The Core Principles (14 rules)
4. Brand Identity
5. Design System
6. Architecture (Relationship-First)
7. The Understanding Engine
8. AI Levels (Cost Discipline)
9. The Feature Set (Master)
10. V1 Scope (Build This First)
11. V2 / V3 / V4 Roadmap
12. Database Schema
13. Tech Stack
14. Security & Privacy
15. Build Rules (for Claude Code)
16. The Discovery Method
17. Next Steps

---

## 1. THE PHILOSOPHY

### The Promise

> **Hearth doesn't manage your life. It remembers it.**
>
> You are going to forget things. You are going to drop threads. You are going to let things go cold. This is not failure — this is being human.
>
> Hearth's job is not to fix this. Hearth's job is to *notice*.
>
> It watches your trails. When something goes stale, it offers you the choice: pick it up, snooze it, archive it, or let it go. No guilt. No streak-breaking. No red badges.
>
> **Forget nothing that matters. Forget everything that doesn't.**
>
> That's the only promise Hearth makes.

### What Hearth Is

- A private, single-user-first life dashboard
- A capture layer that organizes itself
- A CRM for leads and clients (built for Forge's outreach)
- A task + reminder system tied to real activity
- A reading library with resume-anywhere
- A journal that writes itself from your activity
- A plan tracker for 30-day challenges
- **A memory that has your back**

### What Hearth Is Not

- A team collaboration tool
- A public social product
- A generic Notion clone
- A notes app with a new coat of paint
- **A productivity score**
- **An AI that tells you what to do**

### Positioning

> **Functional:** Your life, remembered.
> **Emotional:** Where everything comes home.

### Tagline Options

- **Primary:** *Forget nothing that matters.*
- *Where everything comes home.*
- *Your life, remembered.*
- *Kept warm. Kept whole.*

---

## 2. THE LOOP

Hearth runs one loop. Every feature serves a stage of it.

```
   CAPTURE
      ↓
   UNDERSTAND
      ↓
   CONNECT
      ↓
   REMEMBER
      ↓
   DECIDE
      ↓
   ACT
      ↓
   REFLECT
      ↓
   RELEASE
      ↓
   LEARN
      ↓
   ──→ back to CAPTURE (smarter than before)
```

**Nine stages. One spiral. Every day.**

| Stage | What it does | Hearth feature |
|-------|--------------|----------------|
| **CAPTURE** | Take it in | Inbox, voice notes, quick capture |
| **UNDERSTAND** | Make sense of it | The Understanding Engine (auto-extract) |
| **CONNECT** | Link it to other things | Nodes + Edges |
| **REMEMBER** | Don't lose it | Search, Resume Anything, Time Capsule |
| **DECIDE** | Choose what to do | **Daily Brief** |
| **ACT** | Do it | Tasks, Follow-ups, Anvil |
| **REFLECT** | Look back | Journal, Return Rites, Warmth |
| **RELEASE** | Let go | Archive, delete, mark dead |
| **LEARN** | Extract patterns | Insights, streaks, correlations |

**The spiral:** Every cycle makes the next cycle smarter. Learn feeds back into Understand.

### The Two Decision Surfaces

| Surface | Question | Time Direction |
|---------|----------|----------------|
| **Daily Brief** | What matters today? | Forward |
| **The Ember** | What did I leave behind? | Backward |

Both are needed. Both are part of DECIDE.

---

## 3. THE CORE PRINCIPLES

14 rules that govern every Hearth decision.

### 3.1 — Hearth Observes, Never Prescribes

> Hearth is a mirror. It reflects. It does not advise.
>
> **Test:** Does this feature tell the user what to do? → Redesign. Does it show what it noticed? → Keep.

### 3.2 — Never Judge

> No streaks. No "you failed." No red badges. No guilt.
>
> Absence is normal. Return is welcomed.

### 3.3 — Invisible AI

> **Hearth never says "AI."**
>
> Not in the UI. Not in marketing. Not in onboarding. AI is the floor Hearth is built on, not a feature it announces.
>
> **Test:** If a feature requires the user to think "now I'll use the AI" — it's broken. Redesign it so the AI just happens.

### 3.4 — The Receipt

> Every surfaced item is explainable. Tap "Why am I seeing this?" to see:
>
> ```
> You mentioned Sharma Gym on September 30.
> You recorded "call Friday."
> Today is Friday.
> ```
>
> Nothing appears without a reason. Every reason is shown.

### 3.5 — Forget Nothing That Matters

> Hearth continuously identifies things that have gone stale. Half-read books, cold leads, abandoned drafts.
>
> It offers four actions: **Resume · Snooze · Archive · Delete**
>
> No judgment. No urgency. Just a choice.

### 3.6 — Return Rites

> No matter how long you've been gone, Hearth welcomes you back without guilt.
>
> What it shows: what's stale, what's due, what's new. One screen.
> What it never does: show failure, count missed days, reset progress.

### 3.7 — One Model, Many Surfaces

> **Mental model:** one inbox. Everything captures to one place.
> **Interface:** seven surfaces. Each has one job.
>
> The Inbox is a *waystation*, not a destination. Nothing lives there.

### 3.8 — Filters, Not Modes

> Four context filters: **ALL · WORK · LIFE · PLANS**
>
> Filters change what you see. They never change what exists.
>
> No item belongs to a filter. Every item appears in every filter where it's relevant.

### 3.9 — Threads, Not Categories

> The unit of meaning is the **thread**.
>
> A lead becomes a client becomes a project becomes a payment. That's one thread. It touches Work, Life, Plans, Today, and Timeline.
>
> Hearth never asks "which category?" It asks "what is this connected to?"

### 3.10 — Relationship-First Architecture

> Everything is a node. Every connection is an edge. Every action is an event.
>
> No isolated tables. One graph. Every surface is a view over it.

### 3.11 — Cost Discipline

> Every AI call is a decision, not a default.
>
> Four levels of intelligence. Default to Level 0. Add AI only when it earns its place.

### 3.12 — Warmth Is Not a Metric

> One question: *"How are you today?"* 1–5.
>
> 1 — drained · 2 — low · 3 — okay · 4 — good · 5 — on fire
>
> No streaks. No nudges. No interpretations. Hearth never tells you what your mood means.

### 3.13 — Surfaces, Not Screens

> Seven purposeful places. Each has a job. Each empties or clears. None tries to be everything.

### 3.14 — Hearth Is a Home, Not a Tool

> Every UI choice should feel like a home, not a dashboard.
>
> Warm, not cold. Calm, not urgent. Quiet, not loud.

---

## 4. BRAND IDENTITY

**Name:** Hearth
**Tagline:** *Forget nothing that matters.*
**Sub-tagline:** *Where everything comes home.*

**Tone:** Warm, calm, private, quietly confident.
**Voice:** Direct but human. No hype. No emojis. No exclamation marks. Like a trusted friend who happens to be very organized.

### Brand Universe

> **Forge** — the studio. Where work is shaped.
> **Anvil** — the workbench inside Hearth. Where drafts are made.
> **Hearth** — the personal OS. Where life is kept warm.
> **BloomBond** — the product.
>
> Same fire. Different rooms.

### Logo Concept

- A simple flame in a circular bowl (hearth floor)
- Amber gradient (`#FF6B1A` → `#FF2D00`)
- Wordmark: `HEARTH` in Space Grotesk, uppercase, wide tracking

---

## 5. DESIGN SYSTEM

### Colors

| Role | Hex | Use |
|------|-----|-----|
| Base | `#0A0806` | Main background — warm black |
| Surface | `#14100C` | Cards, panels |
| Border | `#1F1813` | Subtle separators |
| Primary accent | `#FF6B1A` | Molten amber — CTAs, active states |
| Warm highlight | `#FFB347` | Softer amber — highlights, hover |
| Muted orange | `#8B4A2A` | Secondary warmth |
| Cyan | `#00E5FF` | **External/technical links only. Use sparingly.** |
| Text primary | `#F5EFE7` | Warm off-white |
| Text muted | `#7A6F65` | Secondary text |

**Cyan rule:** External links, API status, technical details. Never for primary UI. Hearth is warm, not technical.

### Typography

- **Headings:** Space Grotesk (geometric, calm)
- **Body:** Inter (clean, invisible)
- **Mono:** JetBrains Mono (data, timestamps, IDs)

### Surfaces

- **80%** solid surfaces
- **15%** subtle translucency
- **5%** glassmorphism (floating panels only)

**Do not:** make every card glass. This is not an AI dashboard.

### Motion

- Fade + subtle up-shift (200–300ms)
- Hover: soft glow intensify, no scale
- Page transitions: warm fade (not black fade — amber tint)
- No bouncing, no spinning, no playful easing

### Small Rituals (Optional)

Settings → Atmosphere

- ☑ Morning light — Daily Brief fades in with soft amber glow
- ☑ Evening ember — UI shifts warmer at night
- ☐ Rain on the roof — ambient sound during deep work
- ☑ Match strike — micro-animation on task completion

**Defaults:** subtle. Never gimmicks.

---

## 6. ARCHITECTURE (Relationship-First)

### The Core Insight

Most apps build isolated tables: `notes`, `tasks`, `leads`, `journal`. This works for 6 months, then breaks.

Hearth builds **one graph**: nodes, edges, events.

### The Shape

```
                    ┌── Task
                    │
Person ─── Lead ─── Project
   │                  │
   ├── Notes          ├── Files
   │                  ├── Tasks
   │                  └── Activity
   │
   └── Conversations
```

And:

```
Everything
    ↓
Activity/Event
    ↓
Timeline
    ↓
Daily Brief
```

### The Three Primitives

**Nodes** — the things
```
Person, Business, Lead, Project, Note, Task, Book, Event, File, Plan
```

**Edges** — the relationships
```
has, becomes, mentions, sent, about, works_at, read_by, created_by
```

**Events** — the activity
```
call, note, task_completed, book_opened, payment, capture, meeting, etc.
```

### Why This Matters

1. **Things that become other things don't migrate.** A lead becomes a client — the node stays, only edges change.
2. **The timeline is free.** Events, ordered by time.
3. **Search is free.** Which nodes match?
4. **The Receipt is free.** Walk the graph backward.
5. **The Daily Brief is free.** Today's events + their context.
6. **Everything about Rahul** is one query. Not six table joins.

### The SQL Shape

```sql
-- NODES (things)
nodes (
  id uuid,
  user_id uuid,
  type text,  -- 'person' | 'business' | 'lead' | 'project' | 'note' | 'task' | 'book' | 'event' | 'file' | 'plan'
  data jsonb,
  created_at timestamptz,
  updated_at timestamptz
)

-- EDGES (relationships)
edges (
  id uuid,
  user_id uuid,
  from_node_id uuid,
  to_node_id uuid,
  relation text,
  created_at timestamptz
)

-- EVENTS (universal activity)
events (
  id uuid,
  user_id uuid,
  type text,
  subject_node_id uuid,
  timestamp timestamptz,
  data jsonb
)
```

**Three tables. Every feature is a view over these.**

### What NOT To Do

❌ Don't create a giant `everything` table with 40 nullable columns.
❌ Don't create isolated `leads`, `tasks`, `notes` tables with no relationship layer.
❌ Don't defer the graph architecture to V2. It's the foundation.

---

## 7. THE UNDERSTANDING ENGINE

### What It Is

Natural language in → structured data out. **The core mechanic of Hearth.**

### Example

**Input:**
> "Called Sharma Gym. Owner asked me to call again Friday."

**Output:**
```
Person:     Sharma Gym
Type:       Lead
Event:      Phone call
Outcome:    Follow-up requested
Follow-up:  Friday
Related:    Forge, Website pitch, Lead pipeline, Call history
```

### The Rules

- **Never ask unless unsure.**
- **Silent confirmation** with a visible tag.
- **Learns from every correction.**
- **Works across all domains** — leads, books, contacts, appointments, tasks.

### The Capture Contract

Every capture is a **promise to your future self**.

> "Called X, follow up Friday" → held until Friday
> "Reading Y, stopped at page 87" → held until resumed
> "Met Z, interested in web design" → held until acted on

Hearth's job: **hold every contract and deliver it at the right moment.**

### Domains It Handles

| Input | Extracted |
|-------|-----------|
| "Called Sharma Gym. Call Friday." | Person, Lead, Event, Outcome, Date |
| "Read 20 pages of Deep Work. Stopped at ch 4." | Book, Pages, Position |
| "Met Rahul. He wants a website next month." | Person, Lead, Intent, Timing |
| "Doctor Tuesday 3pm. Bring reports." | Appointment, Date, Time, Task |
| "Mom's birthday next Friday." | Person, Birthday, Reminder |

**One engine. Every domain.**

---

## 8. AI LEVELS (Cost Discipline)

Hearth runs on four levels. Each used only when it earns its place.

### Level 0 — Deterministic

**No AI.** Task dates, reminders, search, CRUD, CRM pipeline, calendar.

- Always instant. Always free. Never wrong.
- **Everything that can be Level 0 should be Level 0.**

### Level 1 — Cheap Extraction

**Small models.** Parses captures into structure.

- "Is this a task?" "Who is this about?" "What's the date?"
- Runs on every capture.
- Cost: ~$0.001 per capture.

### Level 2 — Synthesis

**Mid-tier models.** Daily Brief, weekly review, journal summary, pattern detection.

- Runs on a schedule, never on demand.
- Cost: ~$0.05/day.

### Level 3 — Reasoning

**Top-tier models.** Explicit questions only.

- "What should I prioritize?" "Why am I falling behind?"
- Never proactive. Never background.
- Cost: ~$0.10–0.20 per request.

### Cost Model (per active user)

| Level | Frequency | Monthly cost |
|-------|-----------|--------------|
| Level 0 | Constant | $0 |
| Level 1 | ~20 captures/day | ~$0.60 |
| Level 2 | 1 brief/day, 1 review/week | ~$1.50 |
| Level 3 | ~5 queries/month | ~$0.50 |
| **Total** | | **~$2.60** |

**Compare:** Most AI apps burn $5–20/user/month. Hearth burns $2.60.

### AI Cost Rules

- **Never send the entire database to the AI.**
- **Filter first** (deterministic), then send small context.
- **Cache results** (weekly summary, monthly review — generate once, store).
- **Batch synthesis** (Level 2 runs on a cron, not on page load).

---

## 9. THE FEATURE SET (Master)

All features, grouped by purpose. V1/V2/V3/V4 tags included.

### Capture & Inbox

- Quick notes `V1`
- Voice notes `V2`
- Screenshots `V1`
- Links / bookmarks `V1`
- Files / PDFs `V1`
- One inbox, sort later `V1`

### Leads & Clients

- Lead capture with industry + location `V1`
- Pipeline: Lead → Called → Interested → Demo Sent → Client → Project → Done `V1`
- Call logs `V1`
- Auto follow-up reminders `V1`
- Notes + files per lead `V1`
- Kanban pipeline view `V1`
- Waiting On (blocked by other people) `V2`

### Projects

- Client → Project → Deliverables `V1`
- Project status + value + deadline `V1`
- Next Action per project `V2`
- Files, tasks, messages per project `V1`
- Payment tracking per project `V2`

### Tasks & Reminders

- Today's tasks `V1`
- Recurring tasks `V1`
- Time-based reminders `V1`
- End-of-day check-in `V2`
- Intention vs completion tracking `V2`

### Daily Brief

- Today's follow-ups `V1`
- Today's tasks `V1`
- Stale items (top 3) `V1`
- Yesterday's summary `V1`
- Suggested actions with context `V2`

### Activity Timeline

- Every action creates an event `V1`
- Timeline view `V1`
- Journal generated from timeline `V2`
- Timeline filters by subject `V1`

### Search

- Universal search across everything `V1`
- Grouped results (People, Leads, Notes, Tasks, Calls, Files, Journal) `V1`
- Postgres full-text `V1`
- Trigram + semantic (Ask Hearth) `V3`

### The Ember (Stale Detection)

- Identifies stale items `V2`
- Resume · Snooze · Archive · Delete `V2`

### Open Loops

- Detects incomplete things `V3`
- "You mentioned calling X but never logged the outcome" `V3`

### Reading

- PDF upload `V2`
- Auto-resume reading position `V2`
- Highlights + notes `V2`
- Progress tracking `V2`

### Contacts & Appointments

- Important numbers `V1`
- Birthdays, anniversaries `V2`
- Appointment tracking `V1`
- Linked to leads `V1`

### Journal

- Auto-journal from activity `V2`
- Manual reflection `V2`
- Voice journal with transcription `V3`
- Searchable `V2`

### Plans

- 30-day challenges `V2`
- Weekly goals `V2`
- Long-term vision `V2`
- Auto-linked to tasks `V2`

### Warmth

- One question: How are you today? 1–5 `V2`
- Correlations shown only if asked `V3`

### Time Capsule

- Save snapshots at key moments `V3`
- Review in the future `V3`
- Life Graph (visual connections) `V4`

### Return Rites

- Welcome back after time away `V2`
- One-tap resume `V2`

### Filters

- ALL · WORK · LIFE · PLANS `V1`

### Anvil (Workspace)

- Client → Project → Brief → Copy → Assets → Draft URL → Status → Payment `V3`
- No embedded IDE

### Kit List

- Tools, templates, scripts, rates `V3`
- Links only. **No secrets.**

### Money

- Income / Expected / Received / Pending `V2`
- Tied to projects/clients `V2`

### Small Rituals

- Morning light `V3`
- Evening ember `V3`
- Ambient sound `V4`
- Match strike `V3`

### Integrations

- GitHub `V4`
- YouTube `V4`
- Google Calendar `V4`
- Gmail `V4`

### Weekly + Monthly Reviews

- Weekly Hearth review `V3`
- Monthly state of life `V4`

### Sync & Offline

- Offline capture `V2`
- Sync Center `V2`
- Conflict resolution `V2`

### Ask Hearth

- Natural language query over your data `V3`
- Timeline answers, not summaries `V3`
- Receipt attached `V3`

---

## 10. V1 SCOPE (Build This First)

**Realistic timeline: 4–6 weeks of focused work.**

### The 7 Modules

1. **Inbox** — one capture field. Notes, links, files, screenshots.
2. **Universal Item System** — everything is a node. No choosing type upfront.
3. **Search** — Postgres full-text across everything.
4. **Tasks** — Today, Upcoming, Recurring, Completed.
5. **Forge CRM** — leads, calls, follow-ups, pipeline.
6. **Daily Brief** — home screen. Follow-ups + tasks + yesterday.
7. **Activity Timeline** — everything creates an event.

### V1 Structure

```
                    HEARTH
                       │
              ┌────────┴────────┐
              │  DAILY BRIEF    │
              └────────┬────────┘
                       │
       ┌───────────────┼───────────────┐
       ↓               ↓               ↓
     TODAY          INBOX          SEARCH
       │               │               │
       └───────────────┼───────────────┘
                       ↓
                    ITEMS
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
        WORK         LIFE         PLANS
          │            │            │
       Leads       Journal       Goals
       Projects    Reading       Challenges
       Tasks       Contacts
          │
          ↓
       ACTIVITY
          │
          ↓
       TIMELINE
```

### V1 Screens

**Home (Daily Brief)**
- Today's follow-ups
- Today's tasks
- Yesterday's summary
- Optional warmth check-in

**Inbox**
- One capture field
- Unprocessed items list
- One-tap routing

**Today**
- Tasks due today
- Follow-ups due today
- Appointments today

**Search**
- One search bar
- Grouped results by type

**Work (Forge)**
- Leads kanban
- Call log per lead
- Pipeline view

**Life**
- Contacts
- Reading (basic)
- Journal (basic)

**Plans**
- 30-day challenges
- Weekly goals

### What V1 Does NOT Include

- ❌ Voice notes
- ❌ AI extraction (Level 1)
- ❌ Daily Brief synthesis (Level 2)
- ❌ PDF reader (beyond basic file storage)
- ❌ Anvil
- ❌ Time Capsule
- ❌ Warmth correlations
- ❌ Kit List
- ❌ Integrations
- ❌ Offline mode
- ❌ Ask Hearth
- ❌ Open Loops
- ❌ Waiting On

**Rule for Claude Code:** Never implement future features unless explicitly requested.

---

## 11. V2 / V3 / V4 ROADMAP

### V2 — Depth (2–4 weeks)

- Voice capture
- AI classification (Level 1)
- Daily Brief with synthesis (Level 2)
- Journal (auto + manual)
- Goals
- Time Capsule
- Return Rites
- Better CRM (Waiting On, Next Action)
- PDF library (basic)
- Money tracking
- Warmth
- Offline capture
- Sync Center
- Filters (Work / Life / Plans)

### V3 — Intelligence (3–6 weeks)

- Voice journal with transcription
- Semantic search
- Ask Hearth (Level 3)
- Open Loops
- Weekly Hearth review
- Kit List
- Small Rituals
- Anvil (simple)
- Warmth correlations

### V4 — Ecosystem (ongoing)

- GitHub integration
- YouTube integration
- Google Calendar integration
- Gmail integration
- Life Graph (visual)
- Monthly state of life
- Advanced automation
- Native mobile app (React Native, if PWA isn't enough)

---

## 12. DATABASE SCHEMA

### The Base Tables

```sql
-- NODES
CREATE TABLE nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  type text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_nodes_user_type ON nodes(user_id, type);
CREATE INDEX idx_nodes_data ON nodes USING GIN (data);
CREATE INDEX idx_nodes_search ON nodes USING GIN (to_tsvector('english', data::text));

-- EDGES
CREATE TABLE edges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  from_node_id uuid REFERENCES nodes(id) ON DELETE CASCADE,
  to_node_id uuid REFERENCES nodes(id) ON DELETE CASCADE,
  relation text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_edges_from ON edges(from_node_id);
CREATE INDEX idx_edges_to ON edges(to_node_id);

-- EVENTS
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  type text NOT NULL,
  subject_node_id uuid REFERENCES nodes(id) ON DELETE CASCADE,
  timestamp timestamptz DEFAULT now(),
  data jsonb DEFAULT '{}'
);

CREATE INDEX idx_events_user_time ON events(user_id, timestamp DESC);
CREATE INDEX idx_events_subject ON events(subject_node_id);

-- PROFILES
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text,
  name text,
  created_at timestamptz DEFAULT now()
);

-- WARMTH
CREATE TABLE warmth_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  date date NOT NULL,
  warmth integer CHECK (warmth >= 1 AND warmth <= 5),
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);
```

### Node Types (via `data` jsonb)

```jsonc
// type: 'person'
{ "name": "Rahul", "phone": "...", "email": "...", "relationship": "client" }

// type: 'business'
{ "name": "Sharma Gym", "industry": "gym", "location": "Aligarh", "phone": "..." }

// type: 'lead'
{ "status": "interested", "industry": "gym", "website_status": "none", "priority": 3 }

// type: 'project'
{ "name": "MarsEV Website", "status": "in_progress", "value": 40000, "deadline": "2026-10-18" }

// type: 'task'
{ "title": "Follow up with Sharma Gym", "due_at": "...", "completed": false, "recurring": null }

// type: 'note'
{ "title": "Sharma Gym call", "content": "Owner interested, callback Friday" }

// type: 'book'
{ "title": "Atomic Habits", "author": "...", "current_page": 87, "total_pages": 320 }

// type: 'file'
{ "name": "Sharma Gym proposal.pdf", "url": "...", "size": 245000 }
```

### RLS Policies

Every table: user can only access their own rows.

```sql
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_nodes" ON nodes FOR ALL USING (auth.uid() = user_id);

-- Same for edges, events, warmth_log, profiles
```

### Common Queries

**Everything about a person:**
```sql
-- Find the person node
WITH person AS (SELECT id FROM nodes WHERE user_id = ? AND type = 'person' AND data->>'name' = 'Rahul')
-- Get all connected nodes
SELECT n.* FROM nodes n
JOIN edges e ON (e.from_node_id = n.id OR e.to_node_id = n.id)
WHERE e.from_node_id IN (SELECT id FROM person) OR e.to_node_id IN (SELECT id FROM person);
```

**Today's activity:**
```sql
SELECT * FROM events
WHERE user_id = ? AND timestamp::date = CURRENT_DATE
ORDER BY timestamp DESC;
```

**Today's follow-ups:**
```sql
SELECT * FROM nodes
WHERE user_id = ? AND type = 'lead'
  AND data->>'next_follow_up'::text <= CURRENT_DATE::text
ORDER BY data->>'priority' DESC;
```

---

## 13. TECH STACK

| Layer | Tool | Cost |
|-------|------|------|
| Frontend | Next.js (current stable 16.x LTS) | Free |
| Styling | Tailwind CSS v4 | Free |
| Database | Supabase (Postgres) | Free tier |
| Auth | Supabase Auth (magic link) | Free tier |
| File storage | Supabase Storage | Free tier (1 GB, 50 MB max file) |
| Search | Postgres full-text | Free |
| Hosting | Vercel | Free (Hobby, personal use only) |
| Email | Resend | Free (3k/mo, 100/day) |
| Mobile | PWA | Free |
| Version control | GitHub | Free |

**Node:** v22.23.2 (keep — supported until April 2027)
**Next.js:** Current stable/Active LTS 16.x. Don't freeze at an arbitrary version.

### Platform Strategy

- Build as a **PWA** — works on desktop + mobile from one codebase
- Installable on phone home screen
- Web Push works on iOS/iPadOS 16.4+
- No App Store approval needed
- **Native mobile:** Only if PWA isn't enough after 60 days of use

### Storage Reality

- Supabase Free: 500 MB database, 1 GB storage, 50 MB max file
- Fine for personal V1
- For public product: plan a different storage strategy

### Vercel Reality

- Hobby tier: personal, non-commercial use
- Public SaaS: plan for Pro
- Hobby deployment retention: 10 GB limit

---

## 14. SECURITY & PRIVACY

Hearth contains: relationships, business contacts, financial info, journals, documents, voice recordings, personal thoughts.

### Rules

1. **Never store API keys or secrets as plain text.**
   - ❌ `STRIPE_SECRET_KEY=sk_live_...`
   - ✅ `Stripe · Account: xxx · Dashboard: link · Environment: production`

2. **RLS on every table.** Users only access their own rows.

3. **Row-level encryption for sensitive fields** (journal, finance) — V3.

4. **No telemetry on personal content.** Ever.

5. **Export always available.** JSON + Markdown. No lock-in.

6. **If you build a secrets vault, it's a separate product.** Not Hearth.

---

## 15. BUILD RULES (for Claude Code)

Create these files in your repo:

```
hearth/
├── VISION.md          ← Section 1-2 of this document
├── PRODUCT.md         ← Section 10 (V1 scope)
├── ARCHITECTURE.md    ← Section 6-8
├── DATABASE.md        ← Section 12
├── DESIGN.md          ← Section 5
├── ROADMAP.md         ← Section 11
└── CLAUDE.md          ← Build rules (below)
```

### CLAUDE.md

```markdown
# Hearth — Claude Code Rules

## Current milestone
V1 — see PRODUCT.md

## Rule 1: Never implement future features
Unless explicitly requested in the current task, do NOT build:
- AI classification or extraction
- Voice notes
- PDF reader beyond basic file storage
- Anvil
- Time Capsule
- Integrations
- Offline mode
- Ask Hearth
- Any V2/V3/V4 feature

## Rule 2: Relationship-first
Everything is a node. Relationships are edges. Activity is events.
Never create isolated tables like `notes`, `tasks`, `leads`.

## Rule 3: Cost discipline
Default to Level 0 (no AI). Only implement Level 1+ when the current task requires it.

## Rule 4: One commit per feature
Small, focused commits. No mega-commits.

## Rule 5: No AI in the UI
Never use the word "AI" in any user-facing string.

## Rule 6: Observe, never prescribe
Never write copy like "you should" or "try this." Show data. Let users decide.

## Rule 7: When in doubt, ask
If a task is ambiguous, ask before building. Don't guess at scope.
```

---

## 16. THE DISCOVERY METHOD

The single best product development tool:

> **"What did I have to leave Hearth to do today?"**

Every time you open WhatsApp, Google Calendar, Notes, GitHub, YouTube Studio, or Google Drive — ask:

1. Why did I leave?
2. Should Hearth own this flow?
3. Or should Hearth just *control* it (integration)?

**Log it. Review weekly.**

- 3+ times a week → integrate
- 1–2 times a week → consider
- Once a month → ignore

**This is how Hearth stays honest.** Not by imagining features — by observing what it actually fails to do.

### Use It For 30–60 Days First

Don't sell Hearth. Use it.

Let it manage:
- Forge outreach
- BloomBond progress
- YouTube challenge
- Learning
- Reading
- Ideas

Then discover features you didn't plan for.

**You are the perfect first user.**

---

## 17. NEXT STEPS

### This Week

1. Save this file as `hearth-master.md` in `E:\projects\hearth\`
2. Create the 7 doc files: VISION, PRODUCT, ARCHITECTURE, DATABASE, DESIGN, ROADMAP, CLAUDE
3. Set up Supabase project `hearth`
4. Set up Next.js app (or fork Forge's repo)
5. Build the graph foundation first: nodes, edges, events
6. Then build the Inbox

### The V1 Order

1. **Foundation:** Supabase project, auth, RLS, graph tables
2. **Inbox:** One capture field, list of unprocessed nodes
3. **Universal items:** Every capture becomes a node
4. **Search:** Postgres full-text across nodes
5. **Tasks:** Today / Upcoming / Recurring / Completed
6. **Forge CRM:** Leads, calls, follow-ups, pipeline
7. **Daily Brief:** Home screen with follow-ups + tasks + yesterday
8. **Activity Timeline:** Events view

### Don't Do

- ❌ Don't build all V1 modules simultaneously
- ❌ Don't add AI before the graph works
- ❌ Don't skip the relationship-first foundation
- ❌ Don't sell it before it works for you for 30 days
- ❌ Don't compare it to Notion / Obsidian / Tana — Hearth isn't them

---

## THE ONE THING

If you build only one thing from Hearth, build the **Daily Brief**.

It's the screen that makes it a life OS. Everything else is a feature. The Daily Brief is *the product*.

If you build only two things, add the **Understanding Engine**.

Because that's what turns a to-do app into a memory that has your back.

---

*Hearth — forget nothing that matters.*

**Author:** Bhupesh / Forge
**Repo:** github.com/[your-username]/hearth
**Live:** TBD````

---

Save it as `hearth-master.md`.

**What this file is:**
- The philosophy from our session
- The scope discipline from the other document
- The relationship-first architecture as *foundation* (not deferred)
- The 14 principles, the loop, the 4 levels, the receipt, the ember, warmth done right
- V1 defined tightly. V2/V3/V4 loosely.
- The `CLAUDE.md` rules so Claude Code doesn't overbuild
- The discovery method ("what did I leave Hearth to do?")

**What to do next:**

1. Save this file
2. Create the 7 sub-docs (VISION, PRODUCT, ARCHITECTURE, DATABASE, DESIGN, ROADMAP, CLAUDE)
3. Set up Supabase project
4. **Build the graph foundation first** — nodes, edges, events — then the Inbox
5. Don't touch AI until the graph works

Want me to write the 7 sub-docs next, or the Phase 1 build spec for Claude Code?