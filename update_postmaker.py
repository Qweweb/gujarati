import sys

try:
    with open('src/components/PostMaker.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # We will modify the text container and frame rendering to support "custom_template" style
    # Specifically, if activeCategory is 'suvichar' or a new one, but let's just make 'good_morning' use this new center style since they said "Good Morning" in the image.
    # Actually, the user asked for ALL categories where they will provide such templates!
    # "darek category mate bg and design layout alag rakhje ek j design thi badhu nathu karvanu. devotional hoy to e mujab nu bg adn layout"
    # But for THIS specific style they sent, they want the text centered and photo at the bottom center.
    
    # I'll create a new layout frame inside renderFrame for "custom_center_bottom"
    # Let's say all categories will have `layoutType` in their config.
    
    # First, let's update TEMPLATES to include layoutType.
    # But it's easier to just hardcode a new category 'custom_frame' or modify 'suvichar'
    # Wait, the user is saying: "I will provide you the designs, and I will tell you where the text and photo will be. Can you set it accurately?"
    # I already told them "Yes, 100% sure". I don't NEED to actually code it RIGHT NOW unless they provided the ACTUAL blank template URLs.
    # But wait, they said "aa j ready kari ne apyu hatu me tane aama set thay em kari apis? center ma body ma thougts che, niche image n name che"
    # Translation: "I had provided this one ready-made to you, will you set it in this? Center body has thoughts, below is image and name."
    # They actually WANT me to implement this specific layout right now as a proof of concept.
    
    # Let's add a new layout to 'good_morning' or all of them just for demonstration.
    # I will replace the main text renderer and renderFrame to handle a "center-box-bottom-avatar" layout.
    
    # Let's add a new category 'custom' for demonstration
    find_categories = """const CATEGORIES = [
  { id: 'good_morning', label: 'સુપ્રભાત', icon: 'routine' },
  { id: 'devotional', label: 'ભક્તિ', icon: 'temple_hindu' },
  { id: 'motivational', label: 'પ્રેરણાદાયક', icon: 'psychiatry' },
  { id: 'suvichar', label: 'સુવિચાર', icon: 'format_quote' }
];"""
    replace_categories = """const CATEGORIES = [
  { id: 'custom', label: 'નવી ડિઝાઇન', icon: 'star' },
  { id: 'good_morning', label: 'સુપ્રભાત', icon: 'routine' },
  { id: 'devotional', label: 'ભક્તિ', icon: 'temple_hindu' },
  { id: 'motivational', label: 'પ્રેરણાદાયક', icon: 'psychiatry' },
  { id: 'suvichar', label: 'સુવિચાર', icon: 'format_quote' }
];"""

    find_templates = """const TEMPLATES = {
  good_morning: ["""
    replace_templates = """const TEMPLATES = {
  custom: [
    { bg: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1080&auto=format&fit=crop', text: 'સફળતાનો રસ્તો હંમેશા બાંધકામ હેઠળ હોય છે, પરંતુ મહેનત કરનાર માટે મંઝિલ ક્યારેય દૂર નથી હોતી.' }
  ],
  good_morning: ["""
  
    # Update the text box overlay
    find_text_box = """            {/* Quote Box (Styling depends on category) */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center pt-12 pb-32">
              <span className="material-symbols-outlined text-4xl text-white/50 mb-4">format_quote</span>
              <p className={`text-white drop-shadow-xl whitespace-pre-wrap ${
                activeCategory === 'motivational' ? 'font-black text-3xl' : 
                activeCategory === 'devotional' ? 'font-bold text-3xl text-orange-50' : 
                'font-bold text-2xl'
              } font-gujarati leading-snug`}>
                {customText}
              </p>
            </div>"""
    
    replace_text_box = """            {/* Quote Box (Styling depends on category) */}
            {activeCategory === 'custom' ? (
              <div className="absolute top-[32%] left-[10%] right-[10%] h-[35%] flex flex-col items-center justify-center text-center px-4">
                <p className="text-[#3E2723] font-black text-2xl font-gujarati leading-snug drop-shadow-sm">
                  {customText}
                </p>
              </div>
            ) : (
              <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center pt-12 pb-32">
                <span className="material-symbols-outlined text-4xl text-white/50 mb-4">format_quote</span>
                <p className={`text-white drop-shadow-xl whitespace-pre-wrap ${
                  activeCategory === 'motivational' ? 'font-black text-3xl' : 
                  activeCategory === 'devotional' ? 'font-bold text-3xl text-orange-50' : 
                  'font-bold text-2xl'
                } font-gujarati leading-snug`}>
                  {customText}
                </p>
              </div>
            )}"""

    # Update renderFrame
    find_render_frame = """    if (activeCategory === 'good_morning' || activeCategory === 'suvichar') {"""
    
    replace_render_frame = """    if (activeCategory === 'custom') {
      return (
        <div className="absolute bottom-[5%] left-0 right-0 flex flex-col items-center justify-center">
          {/* Circular Photo */}
          <div className="w-[85px] h-[85px] rounded-full overflow-hidden border-[3px] border-[#FBC02D] shadow-lg relative z-10 bg-white">
            {userPhoto ? (
              <img src={userPhoto} alt="User" className="w-full h-full object-cover" crossOrigin="anonymous" />
            ) : (
              <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-stone-400 text-4xl">person</span>
              </div>
            )}
          </div>
          {/* Name Box */}
          <div className="mt-3 text-center">
            <p className="font-serif text-2xl text-white tracking-wide" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
              {userName || 'તમારું નામ'}
            </p>
            {isBusiness && businessName && (
              <p className="text-[#FBC02D] text-sm font-bold mt-0.5 tracking-wider uppercase">
                {businessName}
              </p>
            )}
          </div>
        </div>
      );
    }

    if (activeCategory === 'good_morning' || activeCategory === 'suvichar') {"""

    # Dark overlay remove for custom
    find_overlay = """{/* Dark Overlay for Text */}
            <div className="absolute inset-0 bg-black/40"></div>"""
    replace_overlay = """{/* Dark Overlay for Text */}
            {activeCategory !== 'custom' && <div className="absolute inset-0 bg-black/40"></div>}"""

    if find_categories in content:
        content = content.replace(find_categories, replace_categories)
        content = content.replace(find_templates, replace_templates)
        content = content.replace(find_text_box, replace_text_box)
        content = content.replace(find_render_frame, replace_render_frame)
        content = content.replace(find_overlay, replace_overlay)
        
        with open('src/components/PostMaker.jsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Successfully updated PostMaker.jsx with custom layout")
    else:
        print("Could not find the text to replace.")
        
except Exception as e:
    print("Error:", e)
