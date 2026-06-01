with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# ---- 1. State: change youtube single string to array ----
code = code.replace(
    "  const [youtube, setYoutube] = useState('youtube.com/@example');",
    "  const [youtubeLinks, setYoutubeLinks] = useState(['']);"
)

# ---- 2. Load draft: update youtube loading ----
code = code.replace(
    "          if (d.youtube) setYoutube(d.youtube);",
    "          if (d.youtubeLinks) setYoutubeLinks(d.youtubeLinks);\n          else if (d.youtube && d.youtube !== 'youtube.com/@example') setYoutubeLinks([d.youtube]);"
)

# ---- 3. Save data objects: replace youtube with youtubeLinks ----
# There are multiple data object constructions, replace all
code = code.replace(
    "name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, facebook, instagram, linkedin, twitter, youtube, themeId, customColor, bgPattern, products, gallery, layoutStyle, profileImage, customSlug }",
    "name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, facebook, instagram, linkedin, twitter, youtubeLinks, themeId, customColor, bgPattern, products, gallery, layoutStyle, profileImage, customSlug }"
)
code = code.replace(
    "name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, facebook, instagram, linkedin, twitter, youtube, themeId, customColor, bgPattern, products, gallery, layoutStyle, profileImage }",
    "name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, facebook, instagram, linkedin, twitter, youtubeLinks, themeId, customColor, bgPattern, products, gallery, layoutStyle, profileImage }"
)

# ---- 4. useEffect dependency array ----
code = code.replace(
    "name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, facebook, instagram, linkedin, twitter, youtube, themeId, customColor, bgPattern, products, gallery, layoutStyle, profileImage, isViewer]",
    "name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, facebook, instagram, linkedin, twitter, youtubeLinks, themeId, customColor, bgPattern, products, gallery, layoutStyle, profileImage, isViewer]"
)

# ---- 5. generateShareLink cardData ----
code = code.replace(
    "name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, themeId, customColor, bgPattern, products, gallery, layoutStyle, profileImage, facebook, instagram, linkedin, twitter, youtube",
    "name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, themeId, customColor, bgPattern, products, gallery, layoutStyle, profileImage, facebook, instagram, linkedin, twitter, youtubeLinks"
)

# ---- 6. Replace the YouTube editor input with multi-link inputs ----
code = code.replace(
    """                {activeSocialTab === 'youtube' && (
                  <FormInput label="YouTube Link" value={youtube} onChange={e => setYoutube(e.target.value)} placeholder="https://youtube.com/..." type="url" />""",
    """                {activeSocialTab === 'youtube' && (
                  <div className="space-y-2">
                    <label className="font-bold text-xs text-stone-600 dark:text-stone-300">YouTube Videos (મહત્તમ 5)</label>
                    {youtubeLinks.map((link, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="url"
                          value={link}
                          onChange={e => { const a = [...youtubeLinks]; a[idx] = e.target.value; setYoutubeLinks(a); }}
                          placeholder={`YouTube Link ${idx + 1}`}
                          className="w-full bg-stone-50 dark:bg-stone-900/40 border border-stone-250 dark:border-stone-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 transition-all text-on-surface dark:text-stone-100"
                        />
                        {youtubeLinks.length > 1 && (
                          <button onClick={() => setYoutubeLinks(youtubeLinks.filter((_, i) => i !== idx))} className="shrink-0 w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        )}
                      </div>
                    ))}
                    {youtubeLinks.length < 5 && (
                      <button onClick={() => setYoutubeLinks([...youtubeLinks, ''])} className="w-full py-2.5 rounded-xl border border-dashed border-amber-500/40 text-amber-600 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-amber-500/5 transition-colors">
                        <span className="material-symbols-outlined text-sm">add</span> વધુ Video ઉમેરો
                      </button>
                    )}
                  </div>"""
)

# ---- 7. Add YouTube carousel helper before CardLayout component ----
yt_helper = """
// Extract YouTube video ID from any YouTube URL
const getYouTubeId = (url) => {
  if (!url) return null;
  try {
    const u = new URL(url.startsWith('http') ? url : 'https://' + url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1).split('?')[0];
    return u.searchParams.get('v') || null;
  } catch { return null; }
};

// YouTube Video Carousel for card viewer
const YouTubeCarousel = ({ links, customColor }) => {
  const validLinks = (links || []).filter(l => l && getYouTubeId(l));
  if (validLinks.length === 0) return null;
  return (
    <div className="space-y-2 w-full">
      <h3 className="font-gujarati font-black text-[10px] border-l-2 pl-2 text-left" style={{ borderColor: customColor }}>YouTube Videos</h3>
      <div
        className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth"
        style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {validLinks.map((link, idx) => {
          const vidId = getYouTubeId(link);
          return (
            <div
              key={idx}
              className="shrink-0 snap-center rounded-2xl overflow-hidden border border-white/10 shadow-lg"
              style={{ width: 'calc(100% - 2rem)', maxWidth: '280px' }}
            >
              <div className="relative" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${vidId}?rel=0&modestbranding=1`}
                  title={`YouTube video ${idx + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {validLinks.length > 1 && (
        <div className="flex justify-center gap-1 pt-1">
          {validLinks.map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />
          ))}
        </div>
      )}
    </div>
  );
};

"""

code = code.replace(
    "// =========================================================================\n// PREMIUM CREATOR HELPERS\n// =========================================================================",
    yt_helper + "// =========================================================================\n// PREMIUM CREATOR HELPERS\n// ========================================================================="
)

# ---- 8. Add YouTubeCarousel in classic layout (default case) before UPI ----
code = code.replace(
    """          {/* UPI Payment Section */}
          {data.upiId && (
            <div className="space-y-2 text-left">
              <h3 className="font-gujarati font-black text-[10px] border-l-2 pl-2" style={{ borderColor: customColor }}>ઝડપી ચૂકવણી</h3>""",
    """          {/* YouTube Videos */}
          <YouTubeCarousel links={data.youtubeLinks} customColor={customColor} />

          {/* UPI Payment Section */}
          {data.upiId && (
            <div className="space-y-2 text-left">
              <h3 className="font-gujarati font-black text-[10px] border-l-2 pl-2" style={{ borderColor: customColor }}>ઝડપી ચૂકવણી</h3>"""
)

# ---- 9. Add YouTubeCarousel in split layout before UPI ----
code = code.replace(
    """          {/* UPI */}
          {data.upiId && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">""",
    """          {/* YouTube Videos */}
          <YouTubeCarousel links={data.youtubeLinks} customColor={customColor} />

          {/* UPI */}
          {data.upiId && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">""",
    1  # Replace only first match (split layout UPI)
)

# ---- 10. Add YouTubeCarousel in glass layout before UPI ----
code = code.replace(
    """          {/* UPI */}
          {data.upiId && (
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/15 rounded-2.5xl p-3 flex items-center justify-between gap-3 text-left">""",
    """          {/* YouTube Videos */}
          <YouTubeCarousel links={data.youtubeLinks} customColor={customColor} />

          {/* UPI */}
          {data.upiId && (
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/15 rounded-2.5xl p-3 flex items-center justify-between gap-3 text-left">"""
)

# ---- 11. Add YouTubeCarousel in shop layout before UPI ----
code = code.replace(
    """          {/* UPI Payment Shop card */}
          {data.upiId && (""",
    """          {/* YouTube Videos */}
          <YouTubeCarousel links={data.youtubeLinks} customColor={customColor} />

          {/* UPI Payment Shop card */}
          {data.upiId && ("""
)

# ---- 12. Fix: replace() doesn't accept a 3rd arg - handle split layout differently ----
# check if split is correct - already done above using the first unique occurrence

with open('d:/Antigravity/Gujarati/src/components/DigitalCard.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done")
