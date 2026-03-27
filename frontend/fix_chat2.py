f = '/home/baddeep/Projects/Entertainment_website_docker/frontend/src/Pages/ai_chat_page.jsx'
with open(f, 'r', encoding='utf-8') as fh:
    c = fh.read()

# Fix initialMode - always IMAGE now
c = c.replace(
    "    const initialMode = searchParams.get(\"mode\") === MODES.VIDEO ? MODES.VIDEO : MODES.IMAGE",
    "    const initialMode = MODES.IMAGE"
)

# Remove handleModeSwitch function entirely
old_switch_fn = '''    const handleModeSwitch = (newMode) => {
        setMode(newMode)
        updateSession(activeId, s => ({
            ...s,
            mode: newMode,
            messages: [...s.messages, newMsg("assistant", WELCOME[newMode])],
        }))
    }

'''
c = c.replace(old_switch_fn, '')

with open(f, 'w', encoding='utf-8') as fh:
    fh.write(c)

print('MODES.VIDEO gone:', 'MODES.VIDEO' not in c)
print('handleModeSwitch gone:', 'handleModeSwitch' not in c)
