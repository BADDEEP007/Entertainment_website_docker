# Implementation Plan

- [ ] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Chat History Lost on Page Reload
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: For this deterministic bug, scope the property to the concrete failing case: a session with at least one user message exists in state, then the component unmounts and remounts (simulating a page reload)
  - Bug Condition: `isBugCondition(state)` where `state.sessions` contains messages beyond the initial welcome message AND `localStorage` has no persisted sessions key
  - Simulate the bug: render `AIChatPage`, send a message (so sessions state has user content), unmount the component, remount it — assert that the restored sessions contain the previously sent message
  - The test assertions should match Expected Behavior: after remount, `sessions` should equal what was in state before unmount (loaded from localStorage)
  - Run test on UNFIXED code (sessions initialized with plain `useState`, no localStorage read/write)
  - **EXPECTED OUTCOME**: Test FAILS — remounted component shows only the default "New Chat" session with welcome message, not the previously sent messages (this proves the bug exists)
  - Document counterexamples found: e.g., "After sending 'A samurai in cherry blossom rain' and reloading, sessions resets to [{id:1, title:'New Chat', messages:[welcome]}]"
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Non-Persistence Behavior Remains Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs (interactions that don't involve reload):
    - Observe: sending a message appends it to `activeSession.messages`
    - Observe: `handleNewChat` prepends a new session and sets it as active
    - Observe: `handleModeSwitch` appends a welcome message for the new mode to the active session
    - Observe: `handleChoice` marks the choice card as resolved and triggers `generateWithPrompt`
    - Observe: `showSuggestions` is true only when `activeSession.messages.length <= 1`
  - Write property-based tests: for all interactions that do NOT involve a page reload, the in-memory session state behaves identically to the unfixed code
  - Verify tests pass on UNFIXED code before implementing the fix
  - **EXPECTED OUTCOME**: Tests PASS — confirms baseline in-memory behavior to preserve
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 3. Fix chat history persistence on page reload

  - [ ] 3.1 Implement the fix
    - Replace the plain `useState` initializer for `sessions` with a lazy initializer that reads from `localStorage.getItem("ai_chat_sessions")` and parses the JSON; fall back to the default single "New Chat" session if the key is absent or JSON is invalid
    - Replace the plain `useState` initializer for `activeId` with a lazy initializer that reads from `localStorage.getItem("ai_chat_active_id")` and parses it; fall back to `1`
    - Add a `useEffect` that serializes `sessions` to `localStorage.setItem("ai_chat_sessions", JSON.stringify(sessions))` whenever `sessions` changes
    - Add a `useEffect` that serializes `activeId` to `localStorage.setItem("ai_chat_active_id", JSON.stringify(activeId))` whenever `activeId` changes
    - Ensure the `msgId` counter is initialized from the max id found in the restored sessions so new messages never collide with persisted ids
    - _Bug_Condition: `isBugCondition(state)` where `sessions` has user content but `localStorage["ai_chat_sessions"]` is absent (plain useState never writes to localStorage)_
    - _Expected_Behavior: after remount, `sessions` and `activeId` are restored from localStorage so the user sees their previous chat history_
    - _Preservation: all in-memory session mutations (send, new chat, mode switch, choice) continue to work identically; only the initialization and persistence side-effects are added_
    - _Requirements: 1.1, 2.1, 2.2, 2.3, 3.1, 3.2_

  - [ ] 3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Chat History Restored After Reload
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior: after unmount/remount, sessions are restored from localStorage
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES — confirms the bug is fixed
    - _Requirements: 1.1_

  - [ ] 3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - In-Memory Session Behavior Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS — confirms no regressions in send, new chat, mode switch, or choice handling
    - Confirm all tests still pass after fix

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
