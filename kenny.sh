echo "$prompt" | gemini | tee "$target_file"cho "$prompt" | gemini > "$target_file"#!/data/data/com.termux/files/usr/bin/bash

# ═══════════════════════════════════════════════════════════════
# KENNY OS — GEMINI CLI ORCHESTRATOR
# Reads PRD → Plans → Builds → Checks → Resumes anytime
# Usage: bash orchestrate.sh
# ═══════════════════════════════════════════════════════════════

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROGRESS_FILE="$PROJECT_DIR/.kenny_progress.json"
LOG_FILE="$PROJECT_DIR/.kenny_build.log"
PRD_FILE="$PROJECT_DIR/prd.md"
TECH_FILE="$PROJECT_DIR/techstack.md"

# ── COLORS ──────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# ── HELPERS ─────────────────────────────────────────────────────
log() { echo "[$(date '+%H:%M:%S')] $1" >> "$LOG_FILE"; }
title() { echo -e "\n${BOLD}${CYAN}$1${NC}"; log "$1"; }
success() { echo -e "${GREEN}✔ $1${NC}"; log "✔ $1"; }
warn() { echo -e "${YELLOW}⚠ $1${NC}"; log "⚠ $1"; }
fail() { echo -e "${RED}✘ $1${NC}"; log "✘ $1"; }
divider() { echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; }

# ── PROGRESS JSON HELPERS ────────────────────────────────────────
init_progress() {
  if [ ! -f "$PROGRESS_FILE" ]; then
    cat > "$PROGRESS_FILE" << 'EOF'
{
  "current_phase": 1,
  "current_step": 1,
  "total_phases": 7,
  "total_steps": 20,
  "completed_steps": [],
  "failed_steps": [],
  "percent": 0,
  "last_updated": "",
  "status": "in_progress"
}
EOF
    success "Progress file created"
  else
    warn "Resuming from saved progress..."
  fi
}

get_progress() { python3 -c "import json; d=json.load(open('$PROGRESS_FILE')); print(d['$1'])"; }

update_progress() {
  local key=$1 value=$2
  python3 << EOF
import json
from datetime import datetime
d = json.load(open('$PROGRESS_FILE'))
d['$key'] = $value
d['last_updated'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
completed = len(d['completed_steps'])
d['percent'] = round((completed / d['total_steps']) * 100)
json.dump(d, open('$PROGRESS_FILE', 'w'), indent=2)
EOF
}

mark_step_done() {
  local step_id=$1
  python3 << EOF
import json
from datetime import datetime
d = json.load(open('$PROGRESS_FILE'))
if '$step_id' not in d['completed_steps']:
    d['completed_steps'].append('$step_id')
d['percent'] = round((len(d['completed_steps']) / d['total_steps']) * 100)
d['last_updated'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
json.dump(d, open('$PROGRESS_FILE', 'w'), indent=2)
EOF
}

is_step_done() {
  python3 -c "
import json
d = json.load(open('$PROGRESS_FILE'))
print('yes' if '$1' in d['completed_steps'] else 'no')
"
}

show_status() {
  divider
  local phase=$(get_progress current_phase)
  local step=$(get_progress current_step)
  local percent=$(get_progress percent)
  local updated=$(get_progress last_updated)
  local completed=$(python3 -c "import json; d=json.load(open('$PROGRESS_FILE')); print(len(d['completed_steps']))")
  local total=$(get_progress total_steps)

  echo -e "${BOLD}KENNY OS — BUILD STATUS${NC}"
  echo -e "Phase:     ${CYAN}$phase / 7${NC}"
  echo -e "Step:      ${CYAN}$step${NC}"
  echo -e "Progress:  ${GREEN}$completed / $total steps done${NC}"
  echo -e "Complete:  ${BOLD}${GREEN}$percent%${NC}"
  echo -e "Updated:   $updated"

  # Progress bar
  local filled=$(( percent / 5 ))
  local empty=$(( 20 - filled ))
  printf "["
  printf "${GREEN}%${filled}s${NC}" | tr ' ' '█'
  printf "%${empty}s" | tr ' ' '░'
  printf "] ${BOLD}$percent%%${NC}\n"
  divider
}

# ── GEMINI CALL ─────────────────────────────────────────────────
gemini_build() {
  local phase=$1
  local step=$2
  local task=$3
  local target_file=$4
  local step_id="p${phase}_s${step}"

  if [ "$(is_step_done $step_id)" = "yes" ]; then
    success "Phase $phase, Step $step — already done, skipping"
    return 0
  fi

  divider
  echo -e "${BOLD}📍 PHASE $phase — STEP $step${NC}"
  echo -e "${CYAN}▶ $task${NC}"
  echo -e "File: ${YELLOW}$target_file${NC}"
  divider

  local prompt="You are building Kenny OS — a personal AI assistant app.

Read these documents first:
--- PRD ---
$(cat $PRD_FILE)
--- TECH STACK ---
$(cat $TECH_FILE)
---

Current task: Phase $phase, Step $step
Task: $task
Output file: $target_file

Rules:
- JavaScript not TypeScript
- Expo SDK 51
- WatermelonDB for all data
- No unnecessary dependencies
- Write ONLY the file content, no explanation
- The file must be complete and working

Write the complete content of $target_file now."

  echo "$prompt" | gemini | tee "$target_file" 2>> "$LOG_FILE"
  local exit_code=$?

  if [ $exit_code -ne 0 ]; then
    fail "Gemini failed on Phase $phase Step $step"
    log "FAILED: $task → $target_file"
    return 1
  fi

  success "Generated: $target_file"
  log "BUILT: $target_file"
  return 0
}

# ── SELF CHECK ───────────────────────────────────────────────────
check_file() {
  local file=$1
  local phase=$2
  local step=$3
  local step_id="p${phase}_s${step}"

  echo -e "${YELLOW}🔍 Checking $file...${NC}"

  # Check file exists and not empty
  if [ ! -f "$file" ] || [ ! -s "$file" ]; then
    fail "$file is missing or empty"
    return 1
  fi

  # Check JS syntax
  if [[ "$file" == *.js ]]; then
    if ! node --check "$file" 2>> "$LOG_FILE"; then
      fail "Syntax error in $file"

      # Ask Gemini to fix it
      warn "Asking Gemini to fix syntax error..."
      local fix_prompt="This React Native JavaScript file has a syntax error. Fix it and return only the corrected file content:

$(cat $file)"
      echo "$fix_prompt" | gemini > "${file}.fixed" 2>> "$LOG_FILE"
      mv "${file}.fixed" "$file"

      if node --check "$file" 2>> "$LOG_FILE"; then
        success "Fixed: $file"
      else
        fail "Could not fix $file automatically"
        return 1
      fi
    fi
  fi

  mark_step_done "$step_id"
  success "✔ Phase $phase, Step $step — DONE"
  return 0
}

# ── ASK TO CONTINUE ─────────────────────────────────────────────
ask_continue() {
  local phase=$1
  show_status
  echo -e "\n${BOLD}Phase $phase complete.${NC}"
  echo -e "Continue to Phase $(( phase + 1 ))? ${CYAN}[y/n/status]${NC}: "
  read -r answer
  case $answer in
    y|Y|yes) return 0 ;;
    s|status) show_status; ask_continue $phase ;;
    *) 
      warn "Paused. Run bash orchestrate.sh to resume anytime."
      exit 0
      ;;
  esac
}

# ── BUILD STEP WRAPPER ───────────────────────────────────────────
build_step() {
  local phase=$1 step=$2 task=$3 file=$4
  update_progress current_phase $phase
  update_progress current_step $step
  gemini_build $phase $step "$task" "$file" && check_file "$file" $phase $step
  show_status
}

# ════════════════════════════════════════════════════════════════
# MAIN BUILD SEQUENCE
# ════════════════════════════════════════════════════════════════

clear
title "⚡ KENNY OS — ORCHESTRATOR STARTING"
log "=== BUILD SESSION STARTED ==="

# Check dependencies
if ! command -v gemini &> /dev/null; then
  fail "Gemini CLI not found. Install it first."
  exit 1
fi
if ! command -v node &> /dev/null; then
  fail "Node not found. Run: pkg install nodejs"
  exit 1
fi
if [ ! -f "$PRD_FILE" ]; then
  fail "prd.md not found in $PROJECT_DIR"
  exit 1
fi

init_progress
show_status

# ── PHASE 1 — DATABASE ──────────────────────────────────────────
title "PHASE 1 — DATABASE FOUNDATION"

build_step 1 1 \
  "Build the complete WatermelonDB schema.js with all tables from the PRD: tasks, subjects, topics, cards, gym_logs, gym_goals, skill_logs, food_logs, expenses, budgets, earning_experiments, captures, books, thoughts, projects, project_items, conversations, settings, nudges" \
  "db/schema.js"

build_step 1 2 \
  "Build db/index.js — WatermelonDB database initialisation using the schema from db/schema.js" \
  "db/index.js"

build_step 1 3 \
  "Build all WatermelonDB model files as one combined db/models/index.js — one Model class per table defined in schema.js" \
  "db/models/index.js"

ask_continue 1

# ── PHASE 2 — KENNY'S BRAIN ──────────────────────────────────────
title "PHASE 2 — KENNY'S BRAIN"

build_step 2 4 \
  "Build kenny/prompts.js — Kenny's personality system prompt. He's a smart casual friend, 2nd year MBBS student's personal AI. Direct, honest, never lectures. Includes a {CONTEXT} placeholder for live data injection." \
  "kenny/prompts.js"

build_step 2 5 \
  "Build kenny/brain.js — Anthropic Claude API caller. Takes a user message + KennyContext object, injects context into system prompt from prompts.js, calls Claude API via fetch, returns response string." \
  "kenny/brain.js"

build_step 2 6 \
  "Build kenny/context.js — reads ALL WatermelonDB tables and builds a KennyContext object: overdue tasks, revision due today, gym streak, food skips, budget status, unread captures, active nudges." \
  "kenny/context.js"

ask_continue 2

# ── PHASE 3 — KENNY CHAT UI ──────────────────────────────────────
title "PHASE 3 — KENNY CHAT UI"

build_step 3 7 \
  "Build components/MessageBubble.js — React Native component. Shows a single chat message. Kenny messages on left with subtle avatar, user messages on right. Dark theme. Timestamp shown." \
  "components/MessageBubble.js"

build_step 3 8 \
  "Build components/QuickLogBar.js — React Native horizontal scrollable bar with quick-tap buttons: +Task, +Gym, +Food, +Expense, +Thought. Each calls a prop callback with the type." \
  "components/QuickLogBar.js"

build_step 3 9 \
  "Build screens/HomeScreen.js — Main Kenny chat screen. Uses KennyChat, MessageBubble, QuickLogBar. Loads last 20 conversations from WatermelonDB. Voice input button. Sends message to kenny/brain.js. Saves all messages to conversations table." \
  "screens/HomeScreen.js"

ask_continue 3

# ── PHASE 4 — MODULE SCREENS ─────────────────────────────────────
title "PHASE 4 — MODULE SCREENS"

build_step 4 10 \
  "Build screens/StudyScreen.js — shows subjects list, topics under each, revision due today from FSRS, exam countdown. Add subject/topic buttons. Mark topic status." \
  "screens/StudyScreen.js"

build_step 4 11 \
  "Build screens/GymScreen.js — log exercise/sets/reps/weight, view streak, progress per exercise over time, skill tracker for basketball and flute." \
  "screens/GymScreen.js"

build_step 4 12 \
  "Build screens/FoodScreen.js — log meal type and description, mark if skipped, weekly summary of skipped meals and low protein days." \
  "screens/FoodScreen.js"

build_step 4 13 \
  "Build screens/FinanceScreen.js — log expenses with category, set monthly budget, show % spent with warning colors, earning experiments kanban board." \
  "screens/FinanceScreen.js"

build_step 4 14 \
  "Build screens/KnowledgeScreen.js — capture inbox, paste URL or text, auto-category tag, mark as read, curated feed of unread items." \
  "screens/KnowledgeScreen.js"

build_step 4 15 \
  "Build screens/MindDumpScreen.js — free text voice or typed dump, sends to Kenny to extract tasks/ideas/worries, shows structured result, saves to thoughts table." \
  "screens/MindDumpScreen.js"

build_step 4 16 \
  "Build screens/ResearchScreen.js — list of research projects with status, tap to open project detail with notes/PDFs/links, add items to project, AI summarise button." \
  "screens/ResearchScreen.js"

ask_continue 4

# ── PHASE 5 — NAVIGATION & APP SHELL ─────────────────────────────
title "PHASE 5 — NAVIGATION & APP SHELL"

build_step 5 17 \
  "Build App.js — React Navigation bottom tab navigator with icons. Tabs: Kenny (home), Study, Body (gym+food), Money, Knowledge, Mind, Research. Dark theme. Connects to db/index.js on startup." \
  "App.js"

ask_continue 5

# ── PHASE 6 — KENNY INTELLIGENCE LAYER ───────────────────────────
title "PHASE 6 — KENNY INTELLIGENCE LAYER"

build_step 6 18 \
  "Build kenny/nudge.js — checks all WatermelonDB tables for alert conditions: topic not revised in 7+ days with exam in 14 days, gym missed 3 days, budget over 80%, Sunday tasks not done by Wednesday. Saves nudges to nudges table." \
  "kenny/nudge.js"

build_step 6 19 \
  "Build kenny/brief.js — generates morning brief by reading KennyContext and calling Claude API. Returns a short casual message from Kenny summarising the day ahead." \
  "kenny/brief.js"

ask_continue 6

# ── PHASE 7 — SERVICES ───────────────────────────────────────────
title "PHASE 7 — EXTERNAL SERVICES"

build_step 7 20 \
  "Build services/scheduler.js — uses Expo TaskManager and BackgroundFetch to: run nudge check every 60 mins, run morning brief at 7:30am, check raw/ folder for new files every 30 mins." \
  "services/scheduler.js"

ask_continue 7

# ── DONE ─────────────────────────────────────────────────────────
divider
update_progress status '"complete"'
show_status
echo -e "\n${BOLD}${GREEN}🎉 KENNY OS BUILD COMPLETE${NC}"
echo -e "Run: ${CYAN}npx expo start --no-dev${NC}"
echo -e "Scan QR with Expo Go on this tab."
log "=== BUILD COMPLETE ==="