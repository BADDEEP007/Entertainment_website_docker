# AI Chat Page Persistence Bugfix Design

## Overview

On page reload, the `AIChatPage` component re-mounts and re-initializes `sessions` and `activeId`
from scratch using `useState` defaults. All prior conversation history is lost because no
persistence layer exists. The fix is to hydrate initial state from `localStorage` on mount and
write back to `localStorage` on every `sessions` / `activeId` change, using a dedicated storage
key. The change is confined to `src/Pages/ai_chat_page.jsx` and requires no new dependencies.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug — the page is reloaded (or the
  component unmounts and remounts) while one or more chat sessions with messages exist in memory.
- **Property (P)**: The desired behavior — after reload, `sessions` and `activeId` are restored
  to the values they held before the reload.
- **Preservation**: All existing behaviors that must remain unchanged: sending messages, switching
  modes, creating new chats, choosing director prompts, mouse/keyboard interactions, and UI layout.
- **sessions**: The React state array in `AIChatPage` holding all chat session objects
  (`{ id, title, mode, messages[] }`).
- **activeId**: The React state value tracking which session is currently displayed.
- **msgId**: The module-level counter used to assign unique IDs to new messages.
- **CHAT_STORAGE_KEY**: The `localStorage` key (`"animeai_chat_sessions"`) used to persist state.

## Bug Details

### Bug Condition

The bug manifests whenever the browser page is reloaded (or the component is unmounted and
remounted) while the user has an active chat session. `useState` always initializes from its
default value — it has no knowledge of prior state — so all sessions and messages are discarded.

**Formal Specification:**
```
FUNCTION isBugCondition(context)
  INPUT: context = { localStorage, componentMountEvent }
  OUTPUT: boolean

  RETURN componentMountEvent.isReload = true
         AND localStorage.getItem("animeai_chat_sessions") = null
         AND inMemorySessions.length > 0   // sessions existed before reload
END FUNCTION
```

### Examples

- User sends "A samurai in cherry blossom rain", receives a director choice card, selects
  "Director's Upgrade", sees the image result — then reloads. Expected: history is restored.
  Actual: blank welcome screen, all messages gone.
- User creates three sessions across image and video modes, switches between them — then reloads.
  Expected: all three sessions visible in sidebar, active session restored. Actual: single default
  "New Chat" session, all others lost.
- User opens the page for the first time with no prior history. Expected: default welcome session
  (unchanged behavior). Actual: same as expected — no regression here.
- User sends a message, closes the tab, reopens it. Expected: session restored (same as reload).
  Actual: history lost.

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Sending a message and receiving a director choice card must work exactly as before.
- Clicking "Use Mine" / "Use Director's" on a choice card must work exactly as before.
- Creating a new chat session via the "New Chat" button must work exactly as before.
- Switching between Image and Video modes must work exactly as before.
- Mouse clicks, keyboard shortcuts (Enter / Shift+Enter), and all other UI interactions must be
  unaffected.
- The sidebar session list, mode switcher, suggestion chips, and typing indicator must render
  identically.

**Scope:**
All inputs that do NOT involve a page reload / component remount are completely unaffected by
this fix. The only new code paths are:
- Reading from `localStorage` during initial `useState` hydration.
- Writing to `localStorage` inside a `useEffect` that watches `sessions` and `activeId`.

## Hypothesized Root Cause

1. **No persistence layer**: `sessions` and `activeId` are plain `useState` values with no
   side-effects that write them anywhere durable. On unmount, React discards all state.

2. **Module-level `msgId` counter resets**: After reload, `msgId` resets to `0`. If sessions are
   restored from storage, new messages could receive IDs that collide with stored message IDs.
   The fix must re-seed `msgId` from the maximum existing message ID found in restored sessions.

3. **Stale `initialMode` from URL params**: The `initialMode` derived from `useSearchParams` is
   used as the `useState` default. After hydration from storage, `mode` should reflect the active
   session's mode, not the URL param, to avoid a mismatch.

## Correctness Properties

Property 1: Bug Condition - Sessions Restored After Reload

_For any_ `sessions` and `activeId` state that existed before a page reload, the fixed
`AIChatPage` component SHALL restore those exact sessions (same messages, titles, modes, and
message metadata) and the same `activeId` from `localStorage` upon remount, so the user sees
their prior conversation history.

**Validates: Requirements 1.1, 1.2, 2.1, 2.2**

Property 2: Preservation - Non-Reload Behavior Unchanged

_For any_ user interaction that does NOT involve a page reload (sending messages, switching modes,
creating new chats, clicking choice cards, mouse/keyboard input), the fixed component SHALL
produce exactly the same behavior as the original component, preserving all existing UI and
state-transition logic.

**Validates: Requirements 3.1, 3.2, 3.3**

## Fix Implementation

### Changes Required

**File**: `src/Pages/ai_chat_page.jsx`

**Specific Changes:**

1. **Add storage key constant** (top of file, alongside `MODES`):
   ```js
   const CHAT_STORAGE_KEY = "animeai_chat_sessions"
   ```

2. **Hydrate `sessions` from localStorage** — replace the plain `useState` default:
   ```js
   // Before
   const [sessions, setSessions] = useState([
       { id: 1, title: "New Chat", mode: initialMode, messages: [newMsg("assistant", WELCOME[initialMode])] },
   ])

   // After
   const [sessions, setSessions] = useState(() => {
       try {
           const stored = localStorage.getItem(CHAT_STORAGE_KEY)
           if (stored) {
               const parsed = JSON.parse(stored)
               if (parsed.sessions?.length) {
                   // Re-seed msgId to avoid ID collisions with restored messages
                   const maxId = parsed.sessions
                       .flatMap(s => s.messages)
                       .reduce((max, m) => Math.max(max, m.id ?? 0), 0)
                   msgId = maxId
                   return parsed.sessions
               }
           }
       } catch { /* ignore corrupt storage */ }
       return [{ id: 1, title: "New Chat", mode: initialMode, messages: [newMsg("assistant", WELCOME[initialMode])] }]
   })
   ```

3. **Hydrate `activeId` from localStorage**:
   ```js
   // Before
   const [activeId, setActiveId] = useState(1)

   // After
   const [activeId, setActiveId] = useState(() => {
       try {
           const stored = localStorage.getItem(CHAT_STORAGE_KEY)
           if (stored) {
               const parsed = JSON.parse(stored)
               if (parsed.activeId) return parsed.activeId
           }
       } catch { /* ignore */ }
       return 1
   })
   ```

4. **Sync state to localStorage on every change** — add a `useEffect`:
   ```js
   useEffect(() => {
       try {
           localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify({ sessions, activeId }))
       } catch { /* ignore quota errors */ }
   }, [sessions, activeId])
   ```

5. **Seed `mode` from the restored active session** to avoid URL-param mismatch:
   The existing `mode` state is initialized from `initialMode` (URL param). After hydration,
   `activeSession.mode` is the source of truth, and `mode` is already kept in sync via
   `handleModeSwitch` and `setMode` calls — no additional change needed here since `mode` is
   derived from the active session's mode when switching sessions.

## Testing Strategy

### Validation Approach

Two-phase approach: first run exploratory tests on the unfixed code to confirm the bug and
understand the root cause, then verify the fix and preservation after implementing it.

### Exploratory Bug Condition Checking

**Goal**: Confirm that sessions are lost on remount with the unfixed code.

**Test Plan**: Mount `AIChatPage`, simulate sending a message (populating sessions state beyond
the default), unmount the component, remount it, and assert that the sessions state still
contains the sent message. Run on UNFIXED code — expect failure.

**Test Cases:**
1. **Single session reload**: Send one message, remount, assert message is present in sessions.
   (will fail on unfixed code)
2. **Multi-session reload**: Create two sessions, remount, assert both sessions exist in sidebar.
   (will fail on unfixed code)
3. **Active session restored**: Set activeId to a non-default session, remount, assert activeId
   matches. (will fail on unfixed code)
4. **Empty storage default**: No prior storage, mount fresh, assert default welcome session
   exists. (should pass on both unfixed and fixed code — baseline check)

**Expected Counterexamples:**
- After remount, `sessions` resets to the single default "New Chat" session regardless of what
  was in memory before.
- `activeId` resets to `1` regardless of which session was active.

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed component restores
state correctly.

**Pseudocode:**
```
FOR ALL state WHERE isBugCondition(state) DO
  // Simulate: write sessions + activeId to localStorage, remount component
  result := mountAIChatPage_fixed(localStorage = serialize(state))
  ASSERT result.sessions = state.sessions
  ASSERT result.activeId = state.activeId
END FOR
```

### Preservation Checking

**Goal**: Verify that all non-reload interactions behave identically before and after the fix.

**Pseudocode:**
```
FOR ALL interaction WHERE NOT isBugCondition(interaction) DO
  ASSERT AIChatPage_original(interaction) = AIChatPage_fixed(interaction)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because
it generates many random interaction sequences (send message, new chat, mode switch, choice
selection) and verifies that the resulting sessions state and rendered output are identical
between the original and fixed component.

**Test Cases:**
1. **Send message preservation**: Verify that sending a message appends it to sessions and
   updates the title, identical to original behavior.
2. **New chat preservation**: Verify that clicking "New Chat" prepends a fresh session, identical
   to original behavior.
3. **Mode switch preservation**: Verify that switching modes appends a welcome message to the
   active session, identical to original behavior.
4. **Choice card preservation**: Verify that selecting "Mine" or "Director's" resolves the choice
   card and triggers generation, identical to original behavior.

### Unit Tests

- Test that `useState` initializer reads from `localStorage` when data is present.
- Test that `useState` initializer falls back to default session when `localStorage` is empty.
- Test that `useState` initializer falls back to default when `localStorage` contains corrupt JSON.
- Test that `msgId` is re-seeded to `max(existing message IDs)` after hydration to prevent
  ID collisions.
- Test that the `useEffect` writes `{ sessions, activeId }` to `localStorage` after each state
  change.

### Property-Based Tests

- Generate random sequences of user actions (send, new chat, mode switch) and verify that
  mounting a fresh component with the resulting `localStorage` snapshot produces identical
  `sessions` and `activeId` state (round-trip property).
- Generate random `sessions` arrays and verify that serialization → deserialization is lossless
  (all message fields preserved: `id`, `role`, `content`, `type`, `meta`).
- Generate random non-reload interactions and verify that the fixed component's output matches
  the original component's output for all such inputs (preservation property).

### Integration Tests

- Full flow: send a message, receive a choice card, select a prompt, see a result, reload the
  page, verify the full conversation history is visible.
- Multi-session flow: create three sessions, switch between them, reload, verify all three
  sessions appear in the sidebar and the correct one is active.
- Fresh load: clear `localStorage`, load the page, verify the default welcome session appears
  with no errors.
