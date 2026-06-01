import re

with open('d:/Antigravity/Gujarati/src/App.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

find_str = """          <Route path="/profile" element={<Profile />} />
          <Route path="/card" element={<DigitalCard />} />"""

replace_str = """          <Route path="/profile" element={<Profile />} />
          <Route path="/card" element={<DigitalCard />} />
          <Route path="/card/:slug" element={<DigitalCard />} />"""

code = code.replace(find_str, replace_str)

with open('d:/Antigravity/Gujarati/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("Done")
