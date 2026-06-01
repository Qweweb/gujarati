import re

with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Imports
find_imports = "import { useLocation, useNavigate } from 'react-router-dom';"
replace_imports = "import { useLocation, useNavigate, useParams } from 'react-router-dom';\nimport { supabase } from '../supabaseClient';"
code = code.replace(find_imports, replace_imports)

# 2. Hooks initialization
find_hooks = """  const location = useLocation();
  const navigate = useNavigate();
  const isViewer = location.pathname.startsWith('/c');"""
replace_hooks = """  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();
  const isViewer = Boolean(slug) || location.pathname.startsWith('/c');"""
code = code.replace(find_hooks, replace_hooks)

# 3. Viewer Mode `useEffect`
find_viewer_effect = """  // On mount: If Viewer Mode, read URL hash parameters and load
  useEffect(() => {
    if (isViewer) {
      const hash = location.hash;
      if (hash && hash.startsWith('#d=')) {"""

replace_viewer_effect = """  // On mount: If Viewer Mode, read URL hash parameters and load
  useEffect(() => {
    if (isViewer) {
      if (slug) {
        const fetchCard = async () => {
          const { data, error } = await supabase.from('digital_cards').select('data').eq('slug', slug).single();
          if (data && data.data) {
            setViewerData(data.data);
          } else {
            triggerLocalToast("❌ કાર્ડ મળ્યું નથી!");
            setViewerData({ name: 'Error', tagline: 'Card Not Found' });
          }
        };
        fetchCard();
      } else {
        const hash = location.hash;
        if (hash && hash.startsWith('#d=')) {"""

find_viewer_effect_end = """        }
      }
    }
  }, [isViewer]);"""

replace_viewer_effect_end = """        }
      }
    }
  }, [isViewer, slug, location.hash]);"""

code = code.replace(find_viewer_effect, replace_viewer_effect)
code = code.replace(find_viewer_effect_end, replace_viewer_effect_end)

# 4. saveDraft function
find_save_draft = """  const saveDraft = () => {
    const data = { name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, facebook, instagram, linkedin, twitter, youtube, themeId, customColor, bgPattern, products, gallery, layoutStyle, profileImage };
    localStorage.setItem('digitalCardDraft', JSON.stringify(data));
    triggerLocalToast("💾 ડેટા સફળતાપૂર્વક સેવ થઈ ગયો છે!");
  };"""

replace_save_draft = """  const saveDraft = async () => {
    const data = { name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, facebook, instagram, linkedin, twitter, youtube, themeId, customColor, bgPattern, products, gallery, layoutStyle, profileImage };
    localStorage.setItem('digitalCardDraft', JSON.stringify(data));
    
    triggerLocalToast("⏳ સેવ થઈ રહ્યું છે...");
    
    let currentSlug = localStorage.getItem('digitalCardSlug');
    if (currentSlug) {
      // Update existing
      const { error } = await supabase.from('digital_cards').update({ data }).eq('slug', currentSlug);
      if (!error) {
        triggerLocalToast("💾 ડેટા સફળતાપૂર્વક અપડેટ થઈ ગયો છે!");
        return;
      }
    }
    
    // Create new
    let baseSlug = (businessName || name || 'card').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'card';
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

code = code.replace(find_save_draft, replace_save_draft)


# 5. generateShareLink
find_generate = """  const generateShareLink = () => {
    const cardData = {
      name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, themeId, customColor, bgPattern, products, gallery, layoutStyle, profileImage, facebook, instagram, linkedin, twitter, youtube
    };
    const b64 = encodeCardData(cardData);
    return `${window.location.origin}/c#d=${b64}`;
  };"""

replace_generate = """  const generateShareLink = () => {
    const slug = localStorage.getItem('digitalCardSlug');
    if (slug) {
      return `${window.location.origin}/card/${slug}`;
    }
    
    const cardData = {
      name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, themeId, customColor, bgPattern, products, gallery, layoutStyle, profileImage, facebook, instagram, linkedin, twitter, youtube
    };
    const b64 = encodeCardData(cardData);
    return `${window.location.origin}/c#d=${b64}`;
  };"""

code = code.replace(find_generate, replace_generate)

with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("Done")
