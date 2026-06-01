import re

with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

find_str = """    let currentSlug = localStorage.getItem('digitalCardSlug');
    if (currentSlug) {"""

replace_str = """    let currentSlug = localStorage.getItem('digitalCardSlug');
    // Clear old default slugs so they get a fresh generated one with the new logic
    if (currentSlug === 'card' || currentSlug.startsWith('card-') || currentSlug === '-') {
      localStorage.removeItem('digitalCardSlug');
      currentSlug = null;
    }
    
    if (currentSlug) {"""

code = code.replace(find_str, replace_str)

with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done")
