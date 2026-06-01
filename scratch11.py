import re

with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add customSlug state
state_find = "  const [name, setName] = useState('આર્યન દેસાઈ');"
state_replace = "  const [customSlug, setCustomSlug] = useState('');\n  const [name, setName] = useState('આર્યન દેસાઈ');"
code = code.replace(state_find, state_replace)

# 2. Update saveDraft localstorage
draft_find = "const data = { name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, facebook, instagram, linkedin, twitter, youtube, themeId, customColor, bgPattern, products, gallery, layoutStyle, profileImage };"
draft_replace = "const data = { name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, facebook, instagram, linkedin, twitter, youtube, themeId, customColor, bgPattern, products, gallery, layoutStyle, profileImage, customSlug };"
code = code.replace(draft_find, draft_replace).replace(draft_find, draft_replace) # Doing it twice because there are two instances in useEffect and saveDraft

# 3. Update useEffect loading draft
load_find = "setBusinessName(parsed.businessName || '');"
load_replace = "setBusinessName(parsed.businessName || '');\n        if (parsed.customSlug !== undefined) setCustomSlug(parsed.customSlug);"
code = code.replace(load_find, load_replace)

# 4. Modify slug generation logic in saveDraft
slug_find = """    let rawStr = (businessName || name || 'card').toLowerCase();
    let transliterated = transliterateGujarati(rawStr);
    let baseSlug = transliterated.replace(/[\\s_]+/g, '-').replace(/[^a-z0-9\\-]+/g, '').replace(/(^-|-$)+/g, '') || 'card';"""

slug_replace = """    let baseSlug = 'card';
    if (customSlug && customSlug.trim() !== '') {
      baseSlug = customSlug.toLowerCase().replace(/[\\s_]+/g, '-').replace(/[^a-z0-9\\-]+/g, '').replace(/(^-|-$)+/g, '') || 'card';
    } else {
      let rawStr = (businessName || name || 'card').toLowerCase();
      let transliterated = transliterateGujarati(rawStr);
      baseSlug = transliterated.replace(/[\\s_]+/g, '-').replace(/[^a-z0-9\\-]+/g, '').replace(/(^-|-$)+/g, '') || 'card';
    }"""
code = code.replace(slug_find, slug_replace)

# 5. Add UI Input for Custom Slug in the Form
ui_find = """              <input type="text" className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 font-gujarati text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="દા.ત. શિવમ ટ્રેડર્સ" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            </div>"""

ui_replace = """              <input type="text" className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 font-gujarati text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="દા.ત. શિવમ ટ્રેડર્સ" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">કસ્ટમ લિંક (Custom URL) <span className="text-stone-400 font-normal lowercase">- અંગ્રેજીમાં લખો</span></label>
              <div className="flex items-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500">
                <span className="pl-4 pr-1 text-stone-400 text-sm">gujaratiapp.in/card/</span>
                <input type="text" className="w-full bg-transparent px-2 py-3 text-sm text-stone-800 dark:text-stone-200 focus:outline-none" placeholder="excellence-global" value={customSlug} onChange={(e) => setCustomSlug(e.target.value)} />
              </div>
              <p className="text-[10px] text-stone-400">જો તમે આ ખાલી રાખશો, તો સિસ્ટમ જાતે જ લિંક બનાવી લેશે.</p>
            </div>"""
code = code.replace(ui_find, ui_replace)

with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done")
