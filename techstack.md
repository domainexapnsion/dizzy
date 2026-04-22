# Kenny OS — Tech Stack & Feasibility Doc
### Building on Samsung Tab, 8GB RAM, Termux only, Gemini CLI

---

## REALITY CHECK FIRST

| Constraint | Impact |
|---|---|
| 8GB RAM, shared with Android OS | ~4-5GB actually available for Termux |
| Termux on tab = no Android emulator | Test on the same device via Expo Go |
| Gemini CLI doing the building | Give it one file/module at a time |
| No separate PC | Everything lives on the tab |

**The golden rule for this setup:**
Never run Expo dev server + Gemini CLI + a heavy process at the same time. You will hit RAM ceiling. Build in sessions — Gemini builds, you close Gemini, you test.

---

## FINAL TECH STACK

### Core
| What | Technology | Why it works on Termux/tab |
|---|---|---|
| Framework | React Native + Expo SDK 51 | Runs fully in Termux, no emulator needed |
| Language | JavaScript (not TypeScript) | Lighter, faster, Gemini makes fewer errors |
| Testing | Expo Go app | Install on same tab, scan QR, instant preview |
| Package manager | npm | Already in Termux |
| Code editor | `nano` or `micro` in Termux | Lightweight, no RAM overhead |

### Database
| What | Technology | Why |
|---|---|---|
| Main DB | WatermelonDB + SQLite | Offline, fast, relational, React Native native |
| Config/secrets | Expo SecureStore | API keys stored safely on device |
| File metadata | WatermelonDB | Everything in one DB |

### AI & Kenny's Brain
| What | Technology | Why |
|---|---|---|
| Kenny's intelligence | Anthropic Claude API (HTTP fetch) | Simple REST call, no heavy SDK |
| Voice input | Expo Speech Recognition | Native, no extra package |
| Voice output | Expo Speech (text-to-speech) | Built into Expo |

### File & PDF
| What | Technology | Why |
|---|---|---|
| File access | Expo FileSystem | Full device storage access |
| PDF picker | Expo DocumentPicker | Native file picker |
| PDF reading | react-native-pdf | Renders PDFs natively |
| PDF text extract | pdfjs-dist (JS only build) | Runs in RN JS thread |

### Google Services
| What | Technology | Why |
|---|---|---|
| Google Sign In | expo-auth-session | No native linking needed |
| Drive API | Google REST API (fetch) | Pure HTTP, no heavy SDK |
| Gmail API | Google REST API (fetch) | Same |
| Calendar API | Google REST API (fetch) | Same |

### UI & Navigation
| What | Technology | Why |
|---|---|---|
| Navigation | React Navigation v6 | Standard, well supported |
| Styling | StyleSheet (plain RN) | No extra deps, lighter than NativeWind |
| Icons | @expo/vector-icons | Bundled with Expo |

### Background & Notifications
| What | Technology | Why |
|---|---|---|
| Notifications | Expo Notifications | Works on Android without Play Services |
| Background fetch | Expo BackgroundFetch | Sync while app is closed |
| Task manager | Expo TaskManager | Schedule recurring tasks |

### Build & Deploy
| What | Technology | Why |
|---|---|---|
| Dev testing | Expo Go | Free, instant, same device |
| Final APK | EAS Build (cloud) | Free tier, builds in Expo cloud not on your tab |
| Version control | Git + GitHub | Free |

---

## RAM MANAGEMENT PLAN

Your tab has ~4-5GB usable in Termux. Here's how to stay under:

```
Expo dev server        ~300MB
React Native bundle    ~200MB
Gemini CLI             ~500-800MB
npm install (peak)     ~600MB
WatermelonDB           ~50MB
──────────────────────────────
Safe working total     ~1.5GB active at once
```

**Rules:**
- Run Gemini CLI to generate code → close it → run Expo to test
- Never `npm install` while Expo server is running
- Use `expo start --no-dev --minify` for lighter dev server
- If tab gets hot or slow: `expo start --tunnel` offloads some work

---

## WHAT GEMINI CLI CAN AND CANNOT DO

### Can do well:
- Generate full component files from your PRD
- Write WatermelonDB models and schema
- Build screens one at a time
- Write Kenny's context builder and API calls
- Fix specific errors you paste to it

### Will struggle with:
- Building everything at once (hence the 5min freeze you saw)
- Keeping context across many files simultaneously
- WatermelonDB migrations (very specific syntax)
- Expo config plugins

### How to use it properly:
```
One prompt = one file.

Bad:  "Build the entire study module"
Good: "Build the Topic model for WatermelonDB 
       using this schema: [paste schema]"

Bad:  "Build Kenny's brain"
Good: "Build kenny/context.js that reads from 
       these WatermelonDB tables and returns 
       a KennyContext object: [paste tables]"
```

Always paste the relevant schema or existing code in the prompt. Gemini has no memory between sessions.

---

## PACKAGES TO INSTALL
### All at once, run this in Termux:

```bash
# Base setup
pkg update -y
pkg install -y nodejs git

# Create project
npx create-expo-app@latest kenny-os --template blank
cd kenny-os

# Core packages (install in 3 batches to avoid RAM spike)

# Batch 1 — DB & storage
npm install @nozbe/watermelondb @nozbe/with-observables
npm install expo-secure-store expo-file-system expo-document-picker

# Batch 2 — UI & navigation
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install @expo/vector-icons

# Batch 3 — Features
npm install expo-speech expo-notifications expo-background-fetch
npm install expo-task-manager expo-auth-session expo-web-browser
npm install react-native-pdf ts-fsrs
```

---

## FOLDER STRUCTURE FOR GEMINI TO BUILD INTO

```
kenny-os/
├── App.js
├── app.json
├── .env                        ← never push to GitHub
│
├── db/
│   ├── index.js                ← WatermelonDB init
│   ├── schema.js               ← Full schema
│   └── models/
│       ├── Task.js
│       ├── Subject.js
│       ├── Topic.js
│       ├── Card.js
│       ├── GymLog.js
│       ├── FoodLog.js
│       ├── Expense.js
│       ├── Capture.js
│       ├── Thought.js
│       ├── Project.js
│       ├── Book.js
│       └── Conversation.js
│
├── kenny/
│   ├── brain.js                ← Claude API call
│   ├── context.js              ← Builds KennyContext from DB
│   ├── nudge.js                ← Alert rules
│   ├── brief.js                ← Morning brief
│   └── prompts.js              ← System prompts
│
├── screens/
│   ├── HomeScreen.js           ← Kenny chat
│   ├── StudyScreen.js
│   ├── GymScreen.js
│   ├── FoodScreen.js
│   ├── FinanceScreen.js
│   ├── KnowledgeScreen.js
│   ├── MindDumpScreen.js
│   └── ResearchScreen.js
│
├── components/
│   ├── KennyChat.js
│   ├── QuickLogBar.js
│   ├── MessageBubble.js
│   └── ModuleCard.js
│
├── services/
│   ├── gdrive.js
│   ├── gmail.js
│   ├── gcal.js
│   └── scheduler.js
│
└── raw/                        ← Your drop zone
    ├── pdfs/
    ├── notes/
    ├── inbox/
    ├── links.txt
    └── thoughts.txt
```

---

## BUILD ORDER FOR GEMINI CLI

Feed Gemini exactly one task per session in this order:

```
Session 1:  db/schema.js
Session 2:  db/index.js + all models/ files
Session 3:  kenny/prompts.js + kenny/brain.js
Session 4:  kenny/context.js
Session 5:  components/MessageBubble.js + KennyChat.js
Session 6:  components/QuickLogBar.js
Session 7:  screens/HomeScreen.js (Kenny chat screen)
Session 8:  App.js + navigation setup
----- TEST: Kenny talking works -----
Session 9:  screens/StudyScreen.js
Session 10: screens/GymScreen.js
Session 11: screens/FoodScreen.js
Session 12: screens/FinanceScreen.js
Session 13: screens/KnowledgeScreen.js
Session 14: screens/MindDumpScreen.js
Session 15: screens/ResearchScreen.js
----- TEST: All screens working -----
Session 16: kenny/nudge.js + kenny/brief.js
Session 17: services/gdrive.js
Session 18: services/gmail.js
Session 19: services/gcal.js
Session 20: services/scheduler.js
----- FINAL TEST: Full system -----
```

---

## PROMPT TEMPLATE FOR GEMINI

Use this exact format every session:

```
Context: I'm building Kenny OS — a personal AI assistant 
app in React Native + Expo + WatermelonDB.

Here is the relevant schema/existing code:
[paste schema or related file]

Task: Build [filename] that does [specific thing].

Rules:
- JavaScript not TypeScript
- Expo SDK 51 compatible
- WatermelonDB for all data
- No unnecessary dependencies
- Export as default
```

---

## WHAT TO DO WHEN GEMINI FREEZES

1. `Ctrl+C` immediately
2. Check what file it was working on
3. Break that file into smaller pieces
4. Give it only that one piece

If it freezes twice on the same thing — paste the error or the task to me. I'll write that specific file for you.

---

## TESTING WORKFLOW ON THE SAME TAB

```bash
# Terminal 1 — keep Expo running
npx expo start --no-dev

# Scan QR with Expo Go app on the same tab
# (Expo Go and Termux run simultaneously fine)

# Terminal 2 — only open when building
# Run Gemini CLI here
# Close when done, switch back to Terminal 1
```

Termux supports multiple sessions — swipe from left edge to switch.