f = '/home/baddeep/Projects/Entertainment_website_docker/frontend/src/Pages/ai_chat_page.jsx'
with open(f, 'r', encoding='utf-8') as fh:
    c = fh.read()

# Add API_URL constant after imports (after the axios import line)
if 'const API_URL' not in c:
    c = c.replace(
        'import axios from "axios";',
        'import axios from "axios"\n\nconst API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000"'
    )

# Update the axios call to use API_URL
c = c.replace(
    'const { data } = await axios.post("/api/generate", { prompts: [chosenPrompt] }, {',
    'const { data } = await axios.post(`${API_URL}/generate`, { prompts: [chosenPrompt] }, {'
)

with open(f, 'w', encoding='utf-8') as fh:
    fh.write(c)

print('API_URL const:', 'const API_URL' in c)
print('uses API_URL:', '`${API_URL}/generate`' in c)
