import re

with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Remove the customSlug UI from Section 1
find_ui_section1 = """            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">કસ્ટમ લિંક (Custom URL) <span className="text-stone-400 font-normal lowercase">- અંગ્રેજીમાં લખો</span></label>
              <div className="flex items-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500">
                <span className="pl-4 pr-1 text-stone-400 text-sm">gujaratiapp.in/card/</span>
                <input type="text" className="w-full bg-transparent px-2 py-3 text-sm text-stone-800 dark:text-stone-200 focus:outline-none" placeholder="excellence-global" value={customSlug} onChange={(e) => setCustomSlug(e.target.value)} />
              </div>
              <p className="text-[10px] text-stone-400">જો તમે આ ખાલી રાખશો, તો સિસ્ટમ જાતે જ લિંક બનાવી લેશે.</p>
            </div>"""
code = code.replace(find_ui_section1, "")

# 2. Add the customSlug UI to Section 6, above the Save Progress button
find_ui_section6 = """              <button
                onClick={saveDraft}"""
replace_ui_section6 = """              <div className="space-y-1 mt-6">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">કસ્ટમ લિંક (Custom URL) <span className="text-stone-400 font-normal lowercase">- અંગ્રેજીમાં લખો</span></label>
                <div className="flex items-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500">
                  <span className="pl-4 pr-1 text-stone-400 text-sm">gujaratiapp.in/card/</span>
                  <input type="text" className="w-full bg-transparent px-2 py-3 text-sm text-stone-800 dark:text-stone-200 focus:outline-none" placeholder="excellence-global" value={customSlug} onChange={(e) => setCustomSlug(e.target.value)} />
                </div>
                <p className="text-[10px] text-stone-400">જો તમે આ ખાલી રાખશો, તો સિસ્ટમ જાતે જ રેન્ડમ લિંક (random url) બનાવી લેશે.</p>
              </div>

              <button
                onClick={saveDraft}"""
code = code.replace(find_ui_section6, replace_ui_section6)


# 3. Change slug logic in saveDraft to use Random instead of Transliteration
find_slug_logic = """    let baseSlug = 'card';
    if (customSlug && customSlug.trim() !== '') {
      baseSlug = customSlug.toLowerCase().replace(/[\\s_]+/g, '-').replace(/[^a-z0-9\\-]+/g, '').replace(/(^-|-$)+/g, '') || 'card';
    } else {
      let rawStr = (businessName || name || 'card').toLowerCase();
      let transliterated = transliterateGujarati(rawStr);
      baseSlug = transliterated.replace(/[\\s_]+/g, '-').replace(/[^a-z0-9\\-]+/g, '').replace(/(^-|-$)+/g, '') || 'card';
    }"""
replace_slug_logic = """    let baseSlug = 'card';
    if (customSlug && customSlug.trim() !== '') {
      baseSlug = customSlug.toLowerCase().replace(/[\\s_]+/g, '-').replace(/[^a-z0-9\\-]+/g, '').replace(/(^-|-$)+/g, '') || 'card';
    } else {
      baseSlug = 'card-' + Math.random().toString(36).substring(2, 8);
    }"""
code = code.replace(find_slug_logic, replace_slug_logic)


# 4. Remove the buggy startingwith card- from the "delete old slug" logic, so we don't delete their random slug!
find_delete_old = """    if (currentSlug === 'card' || currentSlug.startsWith('card-') || currentSlug === '-') {"""
replace_delete_old = """    // We won't clear 'card-xyz' anymore because that is our random slug pattern. Just clear 'card' and '-'
    if (currentSlug === 'card' || currentSlug === '-') {"""
code = code.replace(find_delete_old, replace_delete_old)


with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done")
