import re

with open('d:/Antigravity/Gujarati/src/App.jsx', 'r', encoding='utf-8') as f:
    app_code = f.read()

# 1. Add import DigitalCard
if "import DigitalCard from './components/DigitalCard';" not in app_code:
    # insert it after import Profile from './components/Profile';
    import_str = "import Profile from './components/Profile';\nimport DigitalCard from './components/DigitalCard';"
    app_code = app_code.replace("import Profile from './components/Profile';", import_str)

# 2. Add route for /card
if '<Route path="/card" element={<DigitalCard />} />' not in app_code:
    # insert it after <Route path="/profile" element={<Profile />} />
    route_str = '<Route path="/profile" element={<Profile />} />\n          <Route path="/card" element={<DigitalCard />} />'
    app_code = app_code.replace('<Route path="/profile" element={<Profile />} />', route_str)

with open('d:/Antigravity/Gujarati/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(app_code)
print("Done")
