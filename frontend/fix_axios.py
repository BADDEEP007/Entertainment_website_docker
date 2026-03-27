import re

f = '/home/baddeep/Projects/Entertainment_website_docker/frontend/src/Pages/ai_chat_page.jsx'
with open(f, 'r', encoding='utf-8') as fh:
    content = fh.read()

# Add axios import
old_import = 'import { useState, useRef, useEffect } from "react"'
new_import = 'import { useState, useRef, useEffect } from "react"\nimport axios from "axios"'
content = content.replace(old_import, new_import, 1)

# Replace fetch block with axios
fetch_pattern = r'const res = await fetch\("https://tvadh-34-126-170-190\.a\.free\.pinggy\.link/generate",\s*\{.*?body: JSON\.stringify\(\{ prompts: \[chosenPrompt\] \}\),\s*\}\)\s*console\.log\(res\)\s*if \(!res\.status\) throw new Error\(`Image API error: \$\{res\.status\}`\)\s*const data = await res\.json\(\)\s*console\.log\(data\)'

axios_replacement = '''const { data } = await axios.post("https://tvadh-34-126-170-190.a.free.pinggy.link/generate", { prompts: [chosenPrompt] }, {
                headers: { "Content-Type": "application/json", "x-pinggy-no-screen": "true" },
            })'''

content = re.sub(fetch_pattern, axios_replacement, content, flags=re.DOTALL)

with open(f, 'w', encoding='utf-8') as fh:
    fh.write(content)

print('axios import:', 'import axios' in content)
print('axios.post:', 'axios.post' in content)
print('old fetch:', 'await fetch(' in content)
