# PRD v2 — Kenny OS
### React Native + Expo + WatermelonDB + Claude API

---

## 1. TECH STACK

| Layer | Technology | Why |
|---|---|---|
| Framework | React Native + Expo | No Mac needed, one codebase, phone + tab |
| Language | TypeScript | Catches bugs early, better AI code gen |
| Database | WatermelonDB (SQLite) | Fast, offline, relational, React Native native |
| AI | Anthropic Claude API | Kenny's brain |
| Voice Input | Expo Speech + Voice | Native mic, works offline for input |
| File Access | Expo FileSystem | Full access to device storage |
| PDF | react-native-pdf + expo-document-picker | Pick and read PDFs |
| Notifications | Expo Notifications | Morning brief, nudges, reminders |
| Background Tasks | Expo TaskManager + BackgroundFetch | Sync, scheduler, watcher |
| Google Services | react-native-google-signin + GDrive API | Drive, Gmail, Calendar sync |
| Navigation | React Navigation v6 | Tab + stack navigation |
| State | Zustand | Lightweight, simple global state |
| Styling | NativeWind (Tailwind for RN) | Fast styling |
| Storage (config) | Expo SecureStore | API keys stored safely |
| Deploy/Test | Expo Go → EAS Build | Test instantly, build APK free |

---

## 2. APP ARCHITECTURE

```
KennyOS/
├── app/
│   ├── index.tsx              ← Kenny chat screen (home)
│   ├── study.tsx
│   ├── gym.tsx
│   ├── food.tsx
│   ├── finance.tsx
│   ├── knowledge.tsx
│   ├── minddump.tsx
│   └── research.tsx
│
├── components/
│   ├── KennyChat.tsx          ← Main chat UI component
│   ├── QuickLog.tsx           ← Bottom quick-tap bar
│   ├── MessageBubble.tsx
│   └── ModuleCard.tsx
│
├── db/
│   ├── index.ts               ← WatermelonDB init
│   ├── schema.ts              ← Full DB schema
│   └── models/
│       ├── Task.ts
│       ├── Subject.ts
│       ├── Topic.ts
│       ├── Card.ts
│       ├── GymLog.ts
│       ├── FoodLog.ts
│       ├── Expense.ts
│       ├── Capture.ts
│       ├── Thought.ts
│       ├── Project.ts
│       ├── Book.ts
│       └── Conversation.ts
│
├── kenny/
│   ├── brain.ts               ← Claude API calls
│   ├── context.ts             ← Builds Kenny's live context from all modules
│   ├── nudge.ts               ← Proactive alert logic
│   ├── brief.ts               ← Morning brief generator
│   └── prompts.ts             ← All system prompts
│
├── services/
│   ├── gdrive.ts              ← Google Drive sync
│   ├── gmail.ts               ← Gmail sync
│   ├── gcal.ts                ← Calendar sync
│   ├── watcher.ts             ← Raw folder watcher
│   ├── scheduler.ts           ← Cron-like task runner
│   └── pdfParser.ts           ← PDF text extraction
│
├── store/
│   └── useStore.ts            ← Zustand global state
│
├── raw/                       ← Your drop zone (device folder)
│   ├── pdfs/
│   ├── notes/
│   ├── links.txt
│   ├── thoughts.txt
│   └── inbox/
│
└── assets/
```

---

## 3. DATABASE SCHEMA (WatermelonDB)

---

### TABLE: tasks
```
id              string    primary key
title           string
description     string    nullable
priority        string    'high' | 'medium' | 'low'
status          string    'pending' | 'done' | 'killed'
source          string    'kenny' | 'manual' | 'minddump' | 'sunday_plan'
due_date        number    unix timestamp, nullable
completed_at    number    unix timestamp, nullable
created_at      number
updated_at      number
```

---

### TABLE: subjects
```
id              string
name            string    e.g. 'Pharmacology'
color           string    hex color for UI
exam_date       number    unix timestamp, nullable
total_topics    number    computed
done_topics     number    computed
created_at      number
updated_at      number
```

---

### TABLE: topics
```
id              string
subject_id      string    → subjects.id
name            string
status          string    'not_started' | 'in_progress' | 'done' | 'unclear'
notes           string    nullable
last_revised_at number    nullable
next_revision_at number   nullable (set by FSRS)
fsrs_state      string    JSON blob — stores FSRS card state
created_at      number
updated_at      number
```

---

### TABLE: cards (spaced repetition)
```
id              string
topic_id        string    → topics.id
front           string
back            string
fsrs_state      string    JSON — stability, difficulty, reps, lapses
due_date        number
last_reviewed   number    nullable
rating_history  string    JSON array of past ratings
created_at      number
updated_at      number
```

---

### TABLE: pdfs
```
id              string
title           string
subject_id      string    nullable → subjects.id
file_path       string    local device path
extracted_text  string    nullable (filled after processing)
page_count      number
tags            string    JSON array
processed       boolean
created_at      number
updated_at      number
```

---

### TABLE: gym_logs
```
id              string
date            number    unix timestamp
exercise        string
sets            number
reps            number
weight_kg       number
notes           string    nullable
created_at      number
```

---

### TABLE: gym_goals
```
id              string
exercise        string
target_weight   number
target_reps     number
target_sets     number
achieved        boolean
achieved_at     number    nullable
created_at      number
```

---

### TABLE: skill_logs (basketball, flute, anything)
```
id              string
skill_name      string    e.g. 'basketball' | 'flute'
duration_mins   number
notes           string    nullable
date            number
created_at      number
```

---

### TABLE: food_logs
```
id              string
date            number
meal_type       string    'breakfast' | 'lunch' | 'dinner' | 'snack'
description     string    free text e.g. "rice dal chicken"
protein_est     string    'low' | 'medium' | 'high'
skipped         boolean
notes           string    nullable
created_at      number
```

---

### TABLE: expenses
```
id              string
amount          number
currency        string    default 'INR'
category        string    'food' | 'transport' | 'subscriptions' | 'medical' | 'random' | 'education'
description     string    nullable
date            number
created_at      number
```

---

### TABLE: budgets
```
id              string
month           string    'YYYY-MM'
limit_amount    number
spent_amount    number    computed from expenses
warned_70       boolean
warned_90       boolean
created_at      number
updated_at      number
```

---

### TABLE: earning_experiments
```
id              string
title           string
description     string    nullable
status          string    'idea' | 'trying' | 'earning' | 'dropped'
amount_earned   number    default 0
notes           string    nullable
created_at      number
updated_at      number
```

---

### TABLE: captures (knowledge inbox)
```
id              string
type            string    'url' | 'text' | 'pdf' | 'youtube' | 'thought'
content         string    raw content or URL
summary         string    nullable (AI generated)
tags            string    JSON array
category        string    'medical' | 'coding' | 'fitness' | 'finance' | 'general' | 'book'
source          string    'manual' | 'gdrive' | 'gmail' | 'raw_folder'
read            boolean   default false
saved_at        number
created_at      number
```

---

### TABLE: books
```
id              string
title           string
author          string    nullable
total_pages     number    nullable
current_page    number    default 0
status          string    'want' | 'reading' | 'done'
highlights      string    JSON array of {page, text}
started_at      number    nullable
finished_at     number    nullable
created_at      number
updated_at      number
```

---

### TABLE: thoughts (mind dump)
```
id              string
raw_text        string    original dump
processed       boolean   default false
tasks_extracted string    JSON array of task ids created from this
ideas_extracted string    JSON array
worries         string    JSON array
decisions       string    JSON array
kenny_response  string    nullable
created_at      number
updated_at      number
```

---

### TABLE: projects (research)
```
id              string
title           string
description     string    nullable
status          string    'idea' | 'reading' | 'writing' | 'done' | 'paused'
tags            string    JSON array
notes           string    nullable (markdown)
created_at      number
updated_at      number
```

---

### TABLE: project_items
```
id              string
project_id      string    → projects.id
type            string    'note' | 'pdf' | 'url' | 'summary'
content         string
title           string    nullable
created_at      number
```

---

### TABLE: conversations (Kenny chat history)
```
id              string
role            string    'user' | 'kenny'
content         string
module_context  string    nullable — which module was active
created_at      number
```

---

### TABLE: settings
```
id              string
key             string    unique
value           string
updated_at      number
```
*Stores: api_key ref, morning_brief_time, theme, username, etc.*

---

### TABLE: nudges (Kenny alert log)
```
id              string
type            string    'revision_due' | 'gym_missed' | 'budget_warning' | 'sunday_followup' | 'custom'
message         string
seen            boolean   default false
created_at      number
```

---

## 4. KENNY'S BRAIN — CONTEXT OBJECT

Every time Kenny responds, this object is built fresh and sent as context:

```typescript
type KennyContext = {
  user: {
    name: string
    current_date: string
    day_of_week: string
  }
  tasks: {
    overdue: Task[]
    due_today: Task[]
    upcoming: Task[]
    sunday_plan_pending: Task[]   // set Sunday, not done by Wednesday
  }
  study: {
    subjects: {
      name: string
      exam_date: string | null
      days_to_exam: number | null
      topics_done: number
      topics_total: number
      last_studied: string | null
      revision_due_today: string[]  // topic names
    }[]
  }
  gym: {
    streak: number
    last_session: string | null
    sessions_this_week: number
    missed_days: number
  }
  food: {
    skipped_meals_this_week: number
    low_protein_days: number
    todays_log: string | null
  }
  finance: {
    month: string
    budget_limit: number
    spent: number
    percent_spent: number
    days_left_in_month: number
  }
  knowledge: {
    unread_captures: number
    suggested_item: Capture | null   // most relevant to current focus
  }
  skills: {
    name: string
    last_practiced: string | null
    sessions_this_week: number
  }[]
  recent_thoughts: Thought[]         // last 3 unprocessed dumps
  active_nudges: Nudge[]
}
```

---

## 5. KENNY'S SYSTEM PROMPT STRUCTURE

```
[IDENTITY]
You are Kenny. A personal AI built for [name], a 2nd year MBBS student.
You talk like a smart friend who's been watching his life all year.
Casual, honest, direct. Never lecture. Never sugarcoat.

[CONTEXT]
{KennyContext injected here as JSON every call}

[RULES]
- Always give ONE priority when asked what to do
- Reference real data from context, not generic advice
- If something looks off in the data, bring it up yourself
- Never say "I don't have access to that" — everything is in context
- Keep responses short unless asked to elaborate
- Remember the last 10 messages for continuity
```

---

## 6. FSRS INTEGRATION (Spaced Repetition)

Library: `ts-fsrs` (works in React Native via JS)

Each topic card stores FSRS state:
```typescript
type FSRSState = {
  due: Date
  stability: number
  difficulty: number
  elapsed_days: number
  scheduled_days: number
  reps: number
  lapses: number
  state: 'New' | 'Learning' | 'Review' | 'Relearning'
  last_review: Date | null
}
```

After each review, FSRS updates the card and sets the next `due` date automatically. Kenny reads all cards where `due <= today` and includes them in the morning brief.

---

## 7. BACKGROUND SERVICES

Using Expo TaskManager + BackgroundFetch:

```
TASK: MORNING_BRIEF       → fires at 7:30am daily
TASK: SYNC_GDRIVE         → every 30 mins
TASK: SYNC_GMAIL          → every 60 mins
TASK: SYNC_GCAL           → every 60 mins
TASK: RAW_WATCHER         → watches raw/ folder on device
TASK: NUDGE_CHECK         → every 60 mins, checks nudge rules
TASK: WEEKLY_REVIEW       → Sunday 8pm
```

---

## 8. RAW FOLDER FLOW

```
raw/pdfs/       → auto-imported to pdfs table + subject tagged by Kenny
raw/notes/      → parsed as captures, tagged, summarised
raw/links.txt   → each line fetched, summarised, saved to captures
raw/thoughts.txt → each line processed as mind dump entry
raw/inbox/      → filled by GDrive sync, processed same as above
```

Watcher checks raw/ every time app opens + in background every 30 mins.

---

## 9. GOOGLE SERVICES SYNC

**Google Drive:**
- Watches a specific folder: `GDrive/Kenny/`
- Pulls new PDFs, notes, docs into `raw/inbox/`
- Deletes from inbox after processing (original stays on Drive)

**Gmail:**
- Pulls starred emails + emails with PDF attachments
- Subject line + body saved as capture
- Attachments downloaded to `raw/inbox/`

**Google Calendar:**
- Pulls all events with keyword "exam", "test", "submission", "practical"
- Auto-creates or updates exam dates in subjects table
- Other events added to tasks table

---

## 10. BUILD ORDER

### Phase 0 — Setup (Day 1)
- Expo project init with TypeScript
- WatermelonDB setup + full schema migration
- Folder structure
- SecureStore for API key

### Phase 1 — Kenny Shell (Week 1)
- Chat UI (KennyChat.tsx)
- Claude API connected
- Basic context object (just tasks + date for now)
- QuickLog bar (+ Task, + Gym, + Food, + Expense, + Thought)
- Conversations saved to DB

### Phase 2 — Study System (Week 2)
- Subjects + Topics screens
- FSRS card engine
- PDF picker + viewer
- "Ask Kenny about this PDF"
- Morning brief with revision due

### Phase 3 — Body + Finance (Week 3)
- Gym logger + progress view
- Food logger
- Finance tracker + budget warning
- Earning experiments board
- Skill tracker (basketball, flute)

### Phase 4 — Knowledge + Mind (Week 4)
- Knowledge capture inbox
- Mind dump screen
- Kenny processes dump → extracts tasks/ideas/worries
- Book tracker
- Research project organiser

### Phase 5 — Full Kenny Layer (Week 5)
- Full KennyContext object wired to all modules
- Nudge engine live
- Weekly review flow
- Sunday plan follow-up logic
- Multi-AI project context exporter

### Phase 6 — External Sync (Week 6)
- Google Drive sync
- Gmail sync
- Google Calendar sync
- Raw folder watcher
- Background tasks

### Phase 7 — Polish (Week 7)
- Tab vs phone layout (responsive)
- Notifications (morning brief, nudges)
- Dark theme tuning
- Data backup/export as JSON
- Build APK via EAS Build (free tier)

---

## 11. FREE TOOLS SUMMARY

| Tool | Free Tier |
|---|---|
| Expo | Free, open source |
| EAS Build | Free tier — 30 builds/month |
| WatermelonDB | Free, open source |
| Anthropic API | Free tier credits |
| Google APIs | Free quota (Drive, Gmail, Cal) |
| ts-fsrs | Free, open source |
| GitHub | Free |
| Expo Go | Free app for testing |