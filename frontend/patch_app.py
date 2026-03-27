path = '/home/baddeep/Projects/Entertainment_website_docker/frontend/src/App.jsx'

with open(path, 'r') as f:
    c = f.read()

c = c.replace(
    "import { AIPage } from './Pages/ai_page.jsx'",
    "import { AIPage } from './Pages/ai_page.jsx'\nimport { AIChatPage } from './Pages/ai_chat_page.jsx'"
)

c = c.replace(
    '<Route path="/ai" element={<AIPage />} />',
    '<Route path="/ai" element={<AIPage />} />\n        <Route path="/ai/chat" element={<AIChatPage />} />'
)

with open(path, 'w') as f:
    f.write(c)

print('done')
