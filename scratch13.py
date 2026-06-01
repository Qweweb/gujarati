import re

with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

find_logic = """  const saveDraft = async () => {
    const data = { name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, facebook, instagram, linkedin, twitter, youtube, themeId, customColor, bgPattern, products, gallery, layoutStyle, profileImage, customSlug };
    localStorage.setItem('digitalCardDraft', JSON.stringify(data));
    
    triggerLocalToast("⏳ સેવ થઈ રહ્યું છે...");
    
    let currentSlug = localStorage.getItem('digitalCardSlug');
    // We won't clear 'card-xyz' anymore because that is our random slug pattern. Just clear 'card' and '-'
    if (currentSlug === 'card' || currentSlug === '-') {
      localStorage.removeItem('digitalCardSlug');
      currentSlug = null;
    }
    
    if (currentSlug) {
      // Update existing
      const { error } = await supabase.from('digital_cards').update({ data }).eq('slug', currentSlug);
      if (!error) {
        triggerLocalToast("💾 ડેટા સફળતાપૂર્વક અપડેટ થઈ ગયો છે!");
        return;
      }
    }
    
    // Create new
    let baseSlug = 'card';
    if (customSlug && customSlug.trim() !== '') {
      baseSlug = customSlug.toLowerCase().replace(/[\\s_]+/g, '-').replace(/[^a-z0-9\\-]+/g, '').replace(/(^-|-$)+/g, '') || 'card';
    } else {
      baseSlug = 'card-' + Math.random().toString(36).substring(2, 8);
    }
    let finalSlug = baseSlug;
    let counter = 1;
    let isAvailable = false;
    
    while (!isAvailable) {
       const { data: existing } = await supabase.from('digital_cards').select('slug').eq('slug', finalSlug).maybeSingle();
       if (!existing) {
         isAvailable = true;
       } else {
         finalSlug = `${baseSlug}-${counter}`;
         counter++;
       }
    }
    
    const { data: inserted, error } = await supabase.from('digital_cards').insert([
       { slug: finalSlug, data: data }
    ]).select('slug').single();
    
    if (!error && inserted) {
       localStorage.setItem('digitalCardSlug', inserted.slug);
       triggerLocalToast("🚀 કાર્ડ સફળતાપૂર્વક પબ્લિશ થઈ ગયું છે!");
    } else {
       triggerLocalToast("❌ પબ્લિશ કરવામાં ભૂલ થઈ!");
       console.error(error);
    }
  };"""

replace_logic = """  const saveDraft = async () => {
    const data = { name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, facebook, instagram, linkedin, twitter, youtube, themeId, customColor, bgPattern, products, gallery, layoutStyle, profileImage, customSlug };
    localStorage.setItem('digitalCardDraft', JSON.stringify(data));
    triggerLocalToast("⏳ સેવ થઈ રહ્યું છે...");
    
    let currentSlug = localStorage.getItem('digitalCardSlug');
    if (currentSlug === 'card' || currentSlug === '-') {
      localStorage.removeItem('digitalCardSlug');
      currentSlug = null;
    }
    
    let desiredSlug = currentSlug;
    if (customSlug && customSlug.trim() !== '') {
      desiredSlug = customSlug.toLowerCase().replace(/[\\s_]+/g, '-').replace(/[^a-z0-9\\-]+/g, '').replace(/(^-|-$)+/g, '');
    } else if (!currentSlug) {
      desiredSlug = 'card-' + Math.random().toString(36).substring(2, 8);
    }
    
    // If slug is unchanged, just update data
    if (currentSlug && desiredSlug === currentSlug) {
      const { error } = await supabase.from('digital_cards').update({ data }).eq('slug', currentSlug);
      if (!error) {
        triggerLocalToast("💾 ડેટા સફળતાપૂર્વક અપડેટ થઈ ગયો છે!");
        return;
      }
    }
    
    // If slug is changed or new
    let finalSlug = desiredSlug || 'card';
    let counter = 1;
    let isAvailable = false;
    
    while (!isAvailable) {
       const { data: existing } = await supabase.from('digital_cards').select('slug').eq('slug', finalSlug).maybeSingle();
       if (!existing || (currentSlug && existing.slug === currentSlug)) {
         isAvailable = true;
       } else {
         finalSlug = `${desiredSlug || 'card'}-${counter}`;
         counter++;
       }
    }
    
    if (currentSlug) {
      // Update existing row with NEW slug
      const { error } = await supabase.from('digital_cards').update({ slug: finalSlug, data }).eq('slug', currentSlug);
      if (!error) {
         localStorage.setItem('digitalCardSlug', finalSlug);
         if (customSlug !== finalSlug) setCustomSlug(finalSlug);
         triggerLocalToast("💾 ડેટા અને નવી લિંક અપડેટ થઈ ગઈ છે!");
         return;
      }
    } else {
      // Insert new
      const { data: inserted, error } = await supabase.from('digital_cards').insert([
         { slug: finalSlug, data: data }
      ]).select('slug').single();
      
      if (!error && inserted) {
         localStorage.setItem('digitalCardSlug', inserted.slug);
         if (customSlug !== inserted.slug) setCustomSlug(inserted.slug);
         triggerLocalToast("🚀 કાર્ડ સફળતાપૂર્વક પબ્લિશ થઈ ગયું છે!");
         return;
      }
    }
    triggerLocalToast("❌ પબ્લિશ કરવામાં ભૂલ થઈ!");
  };"""

if find_logic in code:
    code = code.replace(find_logic, replace_logic)
    with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Done")
else:
    print("Could not find the logic block to replace.")
