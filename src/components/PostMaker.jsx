import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { supabase } from '../supabaseClient';
import { downloadFile } from '../utils/downloadHelper';

// --- Configuration Data ---
const CATEGORIES = [
  { id: 'good_morning', label: 'સુપ્રભાત', icon: 'wb_sunny' },
  { id: 'dharmik', label: 'ધાર્મિક', icon: 'temple_hindu' },
  { id: 'prernadayak', label: 'પ્રેરણાદાયક', icon: 'emoji_objects' },
  { id: 'suvichar', label: 'સુવિચાર', icon: 'format_quote' },
  { id: 'tehvar', label: 'તહેવાર', icon: 'festival' },
  { id: 'anya', label: 'અન્ય', icon: 'more_horiz' },
  { id: 'custom', label: 'નવી ડિઝાઇન', icon: 'star' }
];

export const defaultPostMakerConfig = {
  good_morning: {
    label: "સુપ્રભાત",
    enabled: false,
    bgs: [
      { url: '/quote_template_green.jpg', text: 'સવારનો સૂર્ય નવી આશા લઈને આવે છે.\n\nતમારો દિવસ શુભ રહે!' },
      { url: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1080&auto=format&fit=crop', text: 'સવારનો સૂર્ય નવી આશા લઈને આવે છે.\n\nતમારો દિવસ શુભ રહે!' },
      { url: 'https://images.unsplash.com/photo-1506744626753-1fa44df31c7f?q=80&w=1080&auto=format&fit=crop', text: 'દરેક સવાર એક નવી શરૂઆત છે. સુપ્રભાત!' }
    ],
    layout: {
      brandingX: 40,
      brandingY: 202.5,
      brandingSize: 28,
      brandingLineHeight: 34,
      avatarX: 229.4,
      avatarY: 1119.6,
      avatarSize: 208.8,
      separatorX: 460,
      separatorY: 1144.6,
      separatorHeight: 158.8,
      nameX: 490,
      nameY: 1119.6,
      nameFontSize: 44,
      quoteFontSize: 42,
      quoteLineHeight: 1.6
    }
  },
  dharmik: {
    label: "ધાર્મિક",
    enabled: false,
    bgs: [
      { url: '/quote_template_green.jpg', text: 'કોઇનું સારું થાય એ\nમાટે ભોગ આપવો\n\nએ છપ્પન ભોગ કરતા\nમહત્વનો ભોગ છે...!!' },
      { url: 'https://images.unsplash.com/photo-1590059536060-65c2765d774d?q=80&w=1080&auto=format&fit=crop', text: 'હે પ્રભુ, સૌનું ભલું કરજો. જય શ્રી કૃષ્ણ!' },
      { url: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?q=80&w=1080&auto=format&fit=crop', text: 'ૐ નમઃ શિવાય. હર હર મહાદેવ!' }
    ],
    layout: {
      brandingX: 40,
      brandingY: 202.5,
      brandingSize: 28,
      brandingLineHeight: 34,
      avatarX: 229.4,
      avatarY: 1119.6,
      avatarSize: 208.8,
      separatorX: 460,
      separatorY: 1144.6,
      separatorHeight: 158.8,
      nameX: 490,
      nameY: 1119.6,
      nameFontSize: 44,
      quoteFontSize: 42,
      quoteLineHeight: 1.6
    }
  },
  prernadayak: {
    label: "પ્રેરણાદાયક",
    enabled: false,
    bgs: [
      { url: '/quote_template_green.jpg', text: 'સફળતાનો રસ્તો હંમેશા બાંધકામ હેઠળ હોય છે, પરંતુ મહેનત કરનાર માટે મંઝિલ ક્યારેય દૂર નથી હોતી.' },
      { url: 'https://images.unsplash.com/photo-1552508744-1696d4464960?q=80&w=1080&auto=format&fit=crop', text: 'સફળતાનો રસ્તો હંમેશા બાંધકામ હેઠળ હોય છે, પરંતુ મહેનત કરનાર માટે મંઝિલ ક્યારેય દૂર નથી હોતી.' }
    ],
    layout: {
      brandingX: 40,
      brandingY: 202.5,
      brandingSize: 28,
      brandingLineHeight: 34,
      avatarX: 229.4,
      avatarY: 1119.6,
      avatarSize: 208.8,
      separatorX: 460,
      separatorY: 1144.6,
      separatorHeight: 158.8,
      nameX: 490,
      nameY: 1119.6,
      nameFontSize: 44,
      quoteFontSize: 42,
      quoteLineHeight: 1.6
    }
  },
  suvichar: {
    label: "સુવિચાર",
    enabled: true,
    bgs: [
      { url: '/quote_template_green.jpg', text: 'કોઇનું સારું થાય એ\nમાટે ભોગ આપવો\n\nએ છપ્પન ભોગ કરતા\nમહત્વનો ભોગ છે...!!' },
      { url: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=1080&auto=format&fit=crop', text: 'માણસ પોતાના વિચારોથી જ મોટો બને છે. સારો વિચાર એ જ સાચી સંપત્તિ છે.' }
    ],
    layout: {
      brandingX: 40,
      brandingY: 202.5,
      brandingSize: 28,
      brandingLineHeight: 34,
      avatarX: 229.4,
      avatarY: 1119.6,
      avatarSize: 208.8,
      separatorX: 460,
      separatorY: 1144.6,
      separatorHeight: 158.8,
      nameX: 490,
      nameY: 1119.6,
      nameFontSize: 44,
      quoteFontSize: 42,
      quoteLineHeight: 1.6
    }
  },
  tehvar: {
    label: "તહેવાર",
    enabled: false,
    bgs: [
      { url: '/quote_template_green.jpg', text: 'આપ સૌને પાવન પર્વની હાર્દિક શુભકામનાઓ!' }
    ],
    layout: {
      brandingX: 40,
      brandingY: 202.5,
      brandingSize: 28,
      brandingLineHeight: 34,
      avatarX: 229.4,
      avatarY: 1119.6,
      avatarSize: 208.8,
      separatorX: 460,
      separatorY: 1144.6,
      separatorHeight: 158.8,
      nameX: 490,
      nameY: 1119.6,
      nameFontSize: 44,
      quoteFontSize: 42,
      quoteLineHeight: 1.6
    }
  },
  anya: {
    label: "અન્ય",
    enabled: false,
    bgs: [
      { url: '/quote_template_green.jpg', text: 'જીવન એ એક સુંદર પ્રવાસ છે, તેનો આનંદ માણો!' }
    ],
    layout: {
      brandingX: 40,
      brandingY: 202.5,
      brandingSize: 28,
      brandingLineHeight: 34,
      avatarX: 229.4,
      avatarY: 1119.6,
      avatarSize: 208.8,
      separatorX: 460,
      separatorY: 1144.6,
      separatorHeight: 158.8,
      nameX: 490,
      nameY: 1119.6,
      nameFontSize: 44,
      quoteFontSize: 42,
      quoteLineHeight: 1.6
    }
  }
};

const PostMaker = () => {
  const location = useLocation();
  const passedQuoteText = location.state?.quoteText;
  const [hasInitializedFromState, setHasInitializedFromState] = useState(false);

  const [activeCategory, setActiveCategory] = useState('suvichar');
  const [templateIndex, setTemplateIndex] = useState(0);
  const [customText, setCustomText] = useState('');
  
  // User Details
  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);
  const [businessName, setBusinessName] = useState('');
  const [isBusiness, setIsBusiness] = useState(false);

  // Layout Config from DB
  const [postMakerConfig, setPostMakerConfig] = useState(null);

  // Layout Sizing
  const containerRef = useRef(null);
  const exportRef = useRef(null);
  const [previewWidth, setPreviewWidth] = useState(360);
  const [isDownloading, setIsDownloading] = useState(false);

  const prevCategoryRef = useRef(activeCategory);
  const prevTemplateIndexRef = useRef(templateIndex);

  // Fetch configuration on load
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'post_maker_config')
          .single();
        if (!error && data) {
          setPostMakerConfig(JSON.parse(data.value));
        } else {
          setPostMakerConfig(defaultPostMakerConfig);
        }
      } catch (e) {
        console.error("Failed to load post maker config:", e);
        setPostMakerConfig(defaultPostMakerConfig);
      }
    };
    fetchConfig();
  }, []);

  // Auto-fill details from various sources
  useEffect(() => {
    // 1. Try to load from user_profile
    const userProfileSaved = localStorage.getItem('user_profile');
    if (userProfileSaved) {
      try {
        const profile = JSON.parse(userProfileSaved);
        if (profile.name) setUserName(profile.name);
        if (profile.avatar) setUserPhoto(profile.avatar);
      } catch (e) {}
    }
    
    // 2. Try to load from Google login if still empty
    if (!userName) {
      const gName = localStorage.getItem('google_name') || localStorage.getItem('user_full_name');
      if (gName) setUserName(gName);
    }
    if (!userPhoto) {
      const gAvatar = localStorage.getItem('google_avatar');
      if (gAvatar) setUserPhoto(gAvatar);
    }
    
    // 3. Fallback to digitalCardDraft
    const savedCard = localStorage.getItem('digitalCardDraft');
    if (savedCard) {
      try {
        const d = JSON.parse(savedCard);
        if (!userName && d.name) setUserName(d.name);
        if (!userPhoto && d.profileImage) setUserPhoto(d.profileImage);
        if (d.businessName) setBusinessName(d.businessName);
      } catch(e) {}
    }
  }, []);

  // Update width on resize
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      setPreviewWidth(containerRef.current.clientWidth);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Get active templates and background image URLs
  const activeCategoryBgs = activeCategory === 'custom' 
    ? [{ url: userPhoto || '/quote_template_green.jpg', text: customText }]
    : ((postMakerConfig || defaultPostMakerConfig)[activeCategory]?.bgs || []);
  
  const activeTemplate = activeCategoryBgs[templateIndex] || { url: '/quote_template_green.jpg', text: '' };

  // Update text when category/template changes
  useEffect(() => {
    const hasCategoryChanged = prevCategoryRef.current !== activeCategory;
    const hasTemplateIndexChanged = prevTemplateIndexRef.current !== templateIndex;

    prevCategoryRef.current = activeCategory;
    prevTemplateIndexRef.current = templateIndex;

    if (passedQuoteText && !hasInitializedFromState) {
      setCustomText(passedQuoteText);
      setHasInitializedFromState(true);
    } else if (hasCategoryChanged || hasTemplateIndexChanged || (!passedQuoteText && postMakerConfig)) {
      const defaultText = activeTemplate?.text || '';
      setCustomText(defaultText);
    }
  }, [activeCategory, templateIndex, postMakerConfig, passedQuoteText, hasInitializedFromState]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUserPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    if (!exportRef.current) return;
    setIsDownloading(true);
    try {
      // Small delay to ensure any fonts/images are fully rendered
      await new Promise(r => setTimeout(r, 500));
      
      const canvas = await html2canvas(exportRef.current, {
        scale: 2, // Capture at 2x resolution (2160x2700) for extremely sharp text rendering
        useCORS: true,
        backgroundColor: null
      });
      
      const image = canvas.toDataURL("image/png");
      const filename = `Gujarati_Quote_${Date.now()}.png`;
      await downloadFile(image, filename);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("ઈમેજ ડાઉનલોડ કરવામાં ભૂલ થઈ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper dynamic quote scaling
  const getQuoteStyle = (text, layout) => {
    const baseSize = layout?.quoteFontSize || 42;
    const len = text.length;
    if (len > 120) return { fontSize: baseSize - 6, lineHeight: 1.5 };
    if (len > 80) return { fontSize: baseSize - 2, lineHeight: 1.5 };
    return { fontSize: baseSize, lineHeight: layout?.quoteLineHeight || 1.6 };
  };

  // Unified Render function at any scale 's'
  const renderCanvasContent = (s) => {
    if (activeCategory !== 'custom') {
      const config = (postMakerConfig || defaultPostMakerConfig)[activeCategory] || defaultPostMakerConfig.good_morning;
      const layout = config.layout;
      
      const qStyle = getQuoteStyle(customText, layout);
      const quoteFontSize = qStyle.fontSize * s;
      const quoteLineHeight = qStyle.lineHeight;
      
      // Responsive User Name font sizing
      let nameFontSize = layout.nameFontSize || 44;
      if (userName.length > 20) nameFontSize = nameFontSize * 0.7;
      else if (userName.length > 12) nameFontSize = nameFontSize * 0.82;
      const nameSize = nameFontSize * s;

      // Vertical Balancing offset logic inside safe green area (Y: 220 to 1200)
      const lines = customText.split('\n').filter(l => l.trim()).length;
      let topOffset = 250; // Base top offset
      let containerHeight = 770; // Base height

      if (lines <= 2) {
        topOffset = 310;
        containerHeight = 670;
      } else if (lines >= 5) {
        topOffset = 210;
        containerHeight = 810;
      }

      return (
        <>
          {/* Background Template Image */}
          <img 
            src={activeTemplate?.url || '/quote_template_green.jpg'} 
            alt="Template Background" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
            crossOrigin="anonymous"
          />
          
          {/* Quote Area */}
          <div 
            style={{
              position: 'absolute',
              left: `${100 * s}px`,
              right: `${100 * s}px`,
              top: `${topOffset * s}px`,
              height: `${containerHeight * s}px`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              zIndex: 10
            }}
          >
            <p 
              style={{
                fontFamily: 'Noto Serif Gujarati, serif',
                fontWeight: 'bold',
                fontSize: `${quoteFontSize}px`,
                lineHeight: quoteLineHeight,
                color: '#ffffff',
                margin: 0,
                padding: 0,
                whiteSpace: 'pre-wrap',
                textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                display: '-webkit-box',
                WebkitLineClamp: 8,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {customText}
            </p>
          </div>
          
          {/* Profile Photo Area (Bottom-Left) - Rendered with metallic gold gradient border container */}
          <div 
            style={{
              position: 'absolute',
              left: `${layout.avatarX * s}px`,
              top: `${layout.avatarY * s}px`,
              width: `${layout.avatarSize * s}px`,
              height: `${layout.avatarSize * s}px`,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)', // Shiny metallic gold gradient
              boxShadow: `0 ${4 * s}px ${12 * s}px rgba(0,0,0,0.45)`,
              padding: `${3.5 * s}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 12
            }}
          >
            <div 
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {userPhoto ? (
                <img 
                  src={userPhoto} 
                  alt="User Profile" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  crossOrigin="anonymous" 
                />
              ) : (
                <div style={{ width: '100%', height: '100%', backgroundColor: '#efefef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: `${layout.avatarSize * 0.3 * s}px`, color: '#aaaaaa' }}>person</span>
                </div>
              )}
            </div>
          </div>

          {/* Top-Left Branding Text - Rendered dynamically with custom config parameters */}
          <div 
            style={{
              position: 'absolute',
              left: `${layout.brandingX * s}px`,
              top: `${layout.brandingY * s}px`,
              display: 'flex',
              alignItems: 'center',
              zIndex: 11
            }}
          >
            {/* Taller vertical gold separator line */}
            <span 
              style={{
                display: 'inline-block',
                width: `${2.5 * s}px`,
                height: `${layout.brandingLineHeight * s}px`,
                backgroundColor: '#C5A059',
                marginRight: `${12 * s}px`
              }}
            />
            {/* Branding text with shiny metallic gold color */}
            <span 
              style={{
                fontFamily: 'Noto Sans Gujarati, sans-serif',
                fontWeight: 500, // Medium weight
                fontSize: `${layout.brandingSize * s}px`,
                color: '#DFB15B', // Clean solid gold color compatible with all canvas export engines
                letterSpacing: `${0.5 * s}px`,
                lineHeight: 1,
                display: 'inline-block'
              }}
            >
              Gujarati App
            </span>
          </div>

          {/* Vertical Separator Line - Rendered dynamically with metallic gold gradient */}
          <div 
            style={{
              position: 'absolute',
              left: `${layout.separatorX * s}px`,
              top: `${layout.separatorY * s}px`,
              width: `${2.5 * s}px`,
              height: `${layout.separatorHeight * s}px`,
              background: 'linear-gradient(to bottom, #BF953F, #FCF6BA, #B38728)',
              zIndex: 11
            }}
          />
          
          {/* User Name Area (Right of Profile) - Vertically centered and shifted right */}
          <div 
            style={{
              position: 'absolute',
              left: `${layout.nameX * s}px`,
              top: `${layout.nameY * s}px`,
              width: `${(1080 - layout.nameX - 40) * s}px`,
              height: `${layout.avatarSize * s}px`, // same height to center name vertically
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              zIndex: 12
            }}
          >
            <span 
              style={{
                fontFamily: 'Noto Sans Gujarati, sans-serif',
                fontWeight: 600,
                fontSize: `${nameSize}px`,
                color: '#ffffff',
                margin: 0,
                padding: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textShadow: '0 2px 4px rgba(0,0,0,0.4)'
              }}
            >
              {userName || 'તમારું નામ'}
            </span>
          </div>
        </>
      );
    }
    
    // Default Legacy Render Layout for custom uploads
    return (
      <>
        {/* Background Image */}
        <img 
          src={userPhoto || '/quote_template_green.jpg'} 
          alt="Custom Background" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
          crossOrigin="anonymous"
        />
        
        {/* Quote Content */}
        <div 
          style={{
            position: 'absolute',
            left: '10%',
            right: '10%',
            top: '32%',
            height: '35%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            zIndex: 2
          }}
        >
          <p 
            style={{
              fontFamily: 'Noto Sans Gujarati, sans-serif',
              fontWeight: '900',
              fontSize: `${24 * s}px`,
              lineHeight: 1.4,
              color: '#3E2723',
              margin: 0
            }}
          >
            {customText}
          </p>
        </div>
        
        {/* Footer/Frame */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: `${32 * s}px`, width: '100%' }}>
            <div style={{ width: `${85 * s}px`, height: `${85 * s}px`, borderRadius: '50%', overflow: 'hidden', border: `${3 * s}px solid #FBC02D`, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', backgroundColor: '#ffffff' }}>
              {userPhoto ? (
                <img src={userPhoto} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
              ) : (
                <div style={{ width: '100%', height: '100%', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justify: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: `${36 * s}px`, color: '#a3a3a3' }}>person</span>
                </div>
              )}
            </div>
            <div style={{ marginTop: `${12 * s}px`, textAlign: 'center' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: `${24 * s}px`, color: '#ffffff', margin: 0, textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
                {userName || 'તમારું નામ'}
              </p>
              {isBusiness && businessName && (
                <p style={{ color: '#FBC02D', fontSize: `${14 * s}px`, fontWeight: 'bold', margin: 0, marginTop: `${2 * s}px` }}>
                  {businessName}
                </p>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  const scale = previewWidth / 1080;

  const visibleCategories = CATEGORIES.filter(cat => {
    if (cat.id === 'custom') return true;
    const catConfig = (postMakerConfig || defaultPostMakerConfig)[cat.id];
    return catConfig ? catConfig.enabled !== false : true;
  });

  return (
    <div className="animate-fade-in space-y-6 pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="space-y-1 px-4">
        <h2 className="font-gujarati font-black text-3xl text-primary mt-2">પોસ્ટ મેકર</h2>
        <p className="font-gujarati text-outline text-sm">તમારા નામ અને ફોટા સાથે સુંદર પોસ્ટ બનાવો.</p>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 px-4 hide-scrollbar">
        {visibleCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setTemplateIndex(0);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all font-gujarati font-bold text-sm border ${
              activeCategory === cat.id 
                ? 'bg-primary text-white border-primary shadow-md' 
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Image Preview Area */}
      <div className="px-4" ref={containerRef}>
        <div 
          className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200 bg-stone-250"
          style={{ 
            width: `${previewWidth}px`, 
            height: `${previewWidth * (activeCategory !== 'custom' ? 1.25 : 1.33)}px`, // exact aspect ratio matching (4:5 vs 3:4)
            position: 'relative'
          }}
        >
          {/* Responsive Preview Div */}
          <div 
            style={{ 
              width: `${previewWidth}px`, 
              height: `${previewWidth * (activeCategory !== 'custom' ? 1.25 : 1.33)}px`, 
              position: 'relative', 
              overflow: 'hidden' 
            }}
          >
            {renderCanvasContent(scale)}
          </div>
        </div>
      </div>

      {/* Hidden HD Export Container */}
      <div style={{ position: 'fixed', left: '-9999px', top: '-9999px', overflow: 'hidden' }}>
        <div 
          ref={exportRef}
          style={{ 
            width: '1080px', 
            height: '1350px', // Exact Instagram Portrait 4:5 aspect ratio (1080x1350)
            position: 'relative', 
            overflow: 'hidden', 
            backgroundColor: '#0c2214' 
          }}
        >
          {renderCanvasContent(1)}
        </div>
      </div>

      {/* Template Selector */}
      <div className="px-4 flex gap-2 overflow-x-auto hide-scrollbar">
        {activeCategoryBgs.map((tpl, idx) => (
          <button 
            key={idx}
            onClick={() => setTemplateIndex(idx)}
            className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${templateIndex === idx ? 'border-primary scale-110 shadow-md' : 'border-transparent opacity-70'}`}
          >
            <img src={tpl.url} className="w-full h-full object-cover" alt={`Template ${idx}`} crossOrigin="anonymous" />
          </button>
        ))}
      </div>

      {/* Customization Form */}
      <div className="bg-white rounded-t-[2.5rem] p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] space-y-5">
        <h3 className="font-gujarati font-black text-lg">વિગતો સેટ કરો</h3>
        
        {/* Toggle Personal/Business */}
        <div className="flex bg-stone-100 p-1 rounded-xl">
          <button onClick={() => setIsBusiness(false)} className={`flex-1 py-2 font-gujarati font-bold text-sm rounded-lg transition-all ${!isBusiness ? 'bg-white shadow text-primary' : 'text-stone-500'}`}>વ્યક્તિગત</button>
          <button onClick={() => setIsBusiness(true)} className={`flex-1 py-2 font-gujarati font-bold text-sm rounded-lg transition-all ${isBusiness ? 'bg-white shadow text-primary' : 'text-stone-500'}`}>બિઝનેસ</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-500 ml-1">તમારું નામ</label>
            <input 
              type="text" 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)}
              placeholder="દા.ત. હાર્દિક પટેલ" 
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 font-gujarati mt-1 focus:border-primary outline-none transition-all"
            />
          </div>

          {isBusiness && (
            <div>
              <label className="text-xs font-bold text-stone-500 ml-1">બિઝનેસનું નામ</label>
              <input 
                type="text" 
                value={businessName} 
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="દા.ત. શ્રીજી એન્ટરપ્રાઇઝ" 
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 font-gujarati mt-1 focus:border-primary outline-none transition-all"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-stone-500 ml-1">લખાણ / સુવિચાર</label>
            <textarea 
              value={customText} 
              onChange={(e) => setCustomText(e.target.value)}
              rows="3"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 font-gujarati mt-1 focus:border-primary outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-500 ml-1">પ્રોફાઇલ ફોટો</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handlePhotoUpload}
              className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 mt-2"
            />
          </div>
        </div>

        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className={`w-full py-4 rounded-2xl font-gujarati font-black text-white text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-2 transition-all ${isDownloading ? 'bg-primary/50' : 'bg-primary active:scale-95'}`}
        >
          {isDownloading ? (
            <><span className="material-symbols-outlined animate-spin">refresh</span> ડાઉનલોડ થાય છે...</>
          ) : (
            <><span className="material-symbols-outlined">download</span> ઈમેજ ડાઉનલોડ કરો</>
          )}
        </button>
      </div>
    </div>
  );
};

export default PostMaker;
