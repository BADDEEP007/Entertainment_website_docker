f = '/home/baddeep/Projects/Entertainment_website_docker/frontend/src/Pages/ai_chat_page.jsx'
with open(f, 'r', encoding='utf-8') as fh:
    c = fh.read()

old_pending = '''                            ) : msg.type === "image-pending" ? (
                                <div className="message-bubble">
                                    <div className="result-placeholder">
                                        <div className="typing-indicator"><span /><span /><span /></div>
                                        <p style={{ fontSize: "0.88rem", opacity: 0.6 }}>{msg.content}</p>
                                    </div>
                                </div>'''

new_pending = '''                            ) : msg.type === "image-pending" ? (
                                <div className="message-bubble image-generating">
                                    <div className="img-gen-loader">
                                        <div className="img-gen-shimmer" />
                                        <div className="img-gen-bars">
                                            <span /><span /><span /><span /><span />
                                        </div>
                                        <p className="img-gen-label">&#10024; Painting your vision...</p>
                                    </div>
                                </div>'''

c = c.replace(old_pending, new_pending)

with open(f, 'w', encoding='utf-8') as fh:
    fh.write(c)

print('new loader:', 'img-gen-loader' in c)
