import re

with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Transliteration function to inject
translit_func = """
const gujToEngMap = {
  'અ':'a','આ':'aa','ઇ':'i','ઈ':'ii','ઉ':'u','ઊ':'uu','એ':'e','ઐ':'ai','ઓ':'o','ઔ':'au',
  'ક':'k','ખ':'kh','ગ':'g','ઘ':'gh','ચ':'ch','છ':'chh','જ':'j','ઝ':'z','ટ':'t','ઠ':'th',
  'ડ':'d','ઢ':'dh','ણ':'n','ત':'t','થ':'th','દ':'d','ધ':'dh','ન':'n','પ':'p','ફ':'f',
  'બ':'b','ભ':'bh','મ':'m','ય':'y','ર':'r','લ':'l','વ':'v','શ':'sh','ષ':'sh','સ':'s',
  'હ':'h','ળ':'l','ક્ષ':'ksh','જ્ઞ':'gn',
  'ા':'a','િ':'i','ી':'i','ુ':'u','ૂ':'u','ે':'e','ૈ':'ai','ો':'o','ૌ':'au','ં':'n','ઃ':'h','ૃ':'ru','્':''
};

const transliterateGujarati = (str) => {
  if (!str) return '';
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    result += gujToEngMap[char] !== undefined ? gujToEngMap[char] : char;
  }
  return result;
};

// Compressed URL-safe Encoding/Decoding using lz-string
"""

code = code.replace("// Compressed URL-safe Encoding/Decoding using lz-string", translit_func)

# Replace slug logic inside saveDraft
old_slug = "let baseSlug = (businessName || name || 'card').toLowerCase().replace(/[\\s_]+/g, '-').replace(/[^\\p{L}\\p{N}-]+/gu, '').replace(/(^-|-$)+/g, '') || 'card';"
new_slug = "let rawStr = (businessName || name || 'card').toLowerCase();\n    let transliterated = transliterateGujarati(rawStr);\n    let baseSlug = transliterated.replace(/[\\s_]+/g, '-').replace(/[^a-z0-9\\-]+/g, '').replace(/(^-|-$)+/g, '') || 'card';"

code = code.replace(old_slug, new_slug)

with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done")
