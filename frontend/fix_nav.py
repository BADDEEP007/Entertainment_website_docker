f = '/home/baddeep/Projects/Entertainment_website_docker/frontend/src/Components/HomePage/NavBar.jsx'
with open(f, 'r', encoding='utf-8') as fh:
    c = fh.read()

c = c.replace(
    '<li><Link to="/ai">AI Models</Link></li>',
    '<li className="nav-item-disabled"><span className="nav-disabled-link">AI Models<span className="nav-coming-soon">Soon</span></span></li>'
)

with open(f, 'w', encoding='utf-8') as fh:
    fh.write(c)

print('done:', 'nav-item-disabled' in c)
