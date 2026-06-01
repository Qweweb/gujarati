import re

with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update slug generation to support Gujarati/Unicode
old_slug_gen = "let baseSlug = (businessName || name || 'card').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'card';"
new_slug_gen = "let baseSlug = (businessName || name || 'card').toLowerCase().replace(/[\\s_]+/g, '-').replace(/[^\\p{L}\\p{N}-]+/gu, '').replace(/(^-|-$)+/g, '') || 'card';"

code = code.replace(old_slug_gen, new_slug_gen)

# 2. Normalize the search slug when fetching
old_fetch = "const { data, error } = await supabase.from('digital_cards').select('data').eq('slug', slug).single();"
new_fetch = """const searchSlug = slug.replace(/[\\s_]+/g, '-').toLowerCase();
          const { data, error } = await supabase.from('digital_cards').select('data').eq('slug', searchSlug).single();"""

code = code.replace(old_fetch, new_fetch)

with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("Done")
