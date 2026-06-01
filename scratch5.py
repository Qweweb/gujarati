import re

# 1. Update App.jsx to bypass Login for public card routes
with open('d:/Antigravity/Gujarati/src/App.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

find_login = """  if (!isLoggedIn) {
     return <Login onLogin={handleLogin} />;
  }"""

replace_login = """  const currentPath = window.location.pathname;
  const isPublicCardRoute = currentPath === '/c' || currentPath.startsWith('/c/') || (currentPath.startsWith('/card/') && currentPath !== '/card');

  if (!isLoggedIn && !isPublicCardRoute) {
     return <Login onLogin={handleLogin} />;
  }"""

code = code.replace(find_login, replace_login)

with open('d:/Antigravity/Gujarati/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(code)


# 2. Update Layout.jsx to hide shell for /card/:slug
with open('d:/Antigravity/Gujarati/src/components/Layout.jsx', 'r', encoding='utf-8') as f:
    layout_code = f.read()

find_layout = """  const isCardViewer = location.pathname === '/c' || location.pathname.startsWith('/c/');"""
replace_layout = """  const isCardViewer = location.pathname === '/c' || location.pathname.startsWith('/c/') || (location.pathname.startsWith('/card/') && location.pathname !== '/card');"""

layout_code = layout_code.replace(find_layout, replace_layout)

with open('d:/Antigravity/Gujarati/src/components/Layout.jsx', 'w', encoding='utf-8') as f:
    f.write(layout_code)

print("Done")
