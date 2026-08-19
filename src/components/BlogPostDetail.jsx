import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ShareButton from './ShareButton';
import { updatePageSEO } from '../utils/seoHelper';

const INITIAL_BLOGS_MAP = {
  'shravan-maas-puja-vidhi-2026': {
    id: 'b1',
    title: 'પવિત્ર શ્રાવણ માસ ૨૦૨૬: સોમવારના વ્રત અને મહાદેવની પૂજા વિધિ',
    slug: 'shravan-maas-puja-vidhi-2026',
    excerpt: 'શ્રાવણ માસમાં શિવ પૂજા, બીલીપત્ર ચડાવવાનો મહિમા અને શ્રાવણી સોમવારના વ્રત કથા વિશે વિગતવાર માહિતી.',
    content: `શ્રાવણ માસ એ ભગવાન ભોળાનાથની આરાધનાનો સર્વશ્રેષ્ઠ સમય માનવામાં આવે છે. આ માસમાં કરવામાં આવતી પૂજા અને વ્રતથી ભક્તોના તમામ મનોરથ પૂર્ણ થાય છે.\n\n### શ્રાવણી સોમવારનું મહત્વ\nશ્રાવણ મહિનાના દરેક સોમવારે શિવલિંગ પર જળાભિષેક, દૂધાભિષેક અને ત્રિદલ બીલીપત્ર અર્પણ કરવાનું વિશેષ પુણ્ય પ્રાપ્ત થાય છે. શાસ્ત્રો અનુસાર શ્રાવણ સોમવારના વ્રતથી અખંડ સૌભાગ્ય અને મનોવાંછિત ફળ મળે છે.\n\n### શિવ પૂજાની સરળ વિધિ\n1. **ઉષાપાન અને સ્નાન:** સવારે વહેલા ઊઠી બ્રહ્મ મુહૂર્તમાં સ્નાન કરી સફેદ કે પીળા સ્વચ્છ વસ્ત્રો ધારણ કરવા.\n2. **જળાભિષેક:** શિવલિંગ પર 'ઓમ નમઃ શિવાય' અથવા 'મહામૃત્યુંજય મંત્ર' નો જાપ કરતા શુદ્ધ જળ અને ગંગાજળ અર્પણ કરવું.\n3. **દૂધાભિષેક અને પંચામૃત:** કાચું દૂધ, દહીં, ઘી, મધ અને સાકર અર્પણ કરી પુનઃ સ્વચ્છ જળ ચડાવવું.\n4. **બીલીપત્ર અર્પણ:** અખંડ (તૂટેલા ના હોય તેવા) ૩ પાનવાળા બીલીપત્ર પર ચંદનથી 'ઓમ' લખી શિવલિંગ પર ઊંધા (લીસા ભાગ શિવલિંગ સ્પર્શે તેમ) ચડાવવા.\n5. **અક્ષત અને ધાતુરા:** અક્ષત (આખા ચોખા) અને ધાતુરાનું પુષ્પ અર્પણ કરી આરતી ઉતારવી.`,
    cover_image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=1000&auto=format&fit=crop',
    category: 'ધર્મ અને ભક્તિ',
    author: 'ગુજરાતી ધર્મ સભા',
    views: 1245,
    created_at: new Date().toISOString()
  },
  'vastu-dosha-remedies-home-tips': {
    id: 'b2',
    title: 'ઘરમાં વાસ્તુ દોષ નિવારણ માટેના ૫ સરળ અને અચૂક ઉપાયો',
    slug: 'vastu-dosha-remedies-home-tips',
    excerpt: 'તમારા ઘરમાં સુખ, શાંતિ અને સમૃદ્ધિ લાવવા માટે આયુર્વેદિક અને વાસ્તુ શાસ્ત્રના 5 સરળ ઉપાયો.',
    content: `ઘરમાં રહેલી નકારાત્મક ઉર્જાને દૂર કરવા અને સકારાત્મક વાતાવરણ ઊભું કરવા વાસ્તુ શાસ્ત્રના નિયમો ખૂબ ઉપયોગી છે.\n\n### ૧. મુખ્ય દ્વારની સફાઈ અને તોરણ\nઘરના મુખ્ય દરવાજા પર રોજ સવારે આસોપાલવ અથવા આમ્રપત્રનું તોરણ બાંધવું શુભ ગણાય છે. મુખ્ય દ્વાર સ્વચ્છ રાખવાથી લક્ષ્મીજીનો વાસ થાય છે.\n\n### ૨. ઉત્તર-પૂર્વ (ઈશાન) ખૂણો સ્વચ્છ રાખવો\nઈશાન ખૂણામાં દેવસ્થાન (પૂજા ઘર) રાખવું અને ત્યાં ક્યારેય ભારે સામાન કે કચરો ના રાખવો. ત્યાં દરરોજ સાંજે ઘીનો દીવો પ્રગટાવવો.\n\n### ૩. મીઠાનું પાણી (Salt Water Cleaning)\nઅઠવાડિયામાં એકવાર ઘરમાં પોતાં કરતી વખતે પાણીમાં થોડું સમુદ્રી મીઠું (સિંધવ મીઠું) ઉમેરવાથી ઘરમાંથી નકારાત્મકતા દૂર થાય છે.`,
    cover_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop',
    category: 'વાસ્તુ અને જ્યોતિષ',
    author: 'આચાર્ય શાસ્ત્રી',
    views: 895,
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  'ayurveda-warm-water-benefits-morning': {
    id: 'b3',
    title: 'આયુર્વેદ અનુસાર રોજ સવારે નયણે કોઠે ગરમ પાણી પીવાના ફાયદા',
    slug: 'ayurveda-warm-water-benefits-morning',
    excerpt: 'સવારે ઉઠીને માત્ર ૧ ગ્લાસ નવશેકું પાણી પીવાથી પાચન અને ત્વચા પર થતી અદ્ભુત અસરો.',
    content: `આયુર્વેદિક જીવનશૈલીમાં ઉષાપાન (સવારે નયણે કોઠે પાણી પીવું) નું વિશેષ મહત્વ વર્ણવવામાં આવ્યું છે.\n\n### મુખ્ય ફાયદા:\n- **પેટની કબજિયાત:** નવશેકું પાણી આંતરડાની સફાઈ કરે છે.\n- **ટોક્સિન્સ મુક્તિ:** શરીરના ઝેરી તત્વો બહાર નીકળે છે અને ચહેરો તેજસ્વી બને છે.\n- **વજન નિયંત્રણ:** ચયાપચય (Metabolism) દર વધે છે જેથી મેદસ્વિતા ઘટે છે.`,
    cover_image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop',
    category: 'સ્વાસ્થ્ય અને જીવનશૈલી',
    author: 'વૈદ્યરાજ પટેલ',
    views: 1565,
    created_at: new Date(Date.now() - 172800000).toISOString()
  }
};

const BlogPostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchBlogDetail();
  }, [slug]);

  useEffect(() => {
    if (blog) {
      updatePageSEO({
        title: blog.title,
        description: blog.excerpt || (blog.content ? blog.content.substring(0, 160).replace(/[#*>\n]/g, ' ') : ''),
        image: blog.cover_image,
        slug: blog.slug,
        author: blog.author,
        createdAt: blog.created_at,
        updatedAt: blog.updated_at
      });
    }
  }, [blog]);

  const fetchBlogDetail = async () => {
    setLoading(true);
    try {
      // 1. Check Supabase
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        setBlog(data);
        // Increment views
        supabase.from('blogs').update({ views: (data.views || 0) + 1 }).eq('id', data.id);
      } else if (INITIAL_BLOGS_MAP[slug]) {
        setBlog(INITIAL_BLOGS_MAP[slug]);
      } else {
        setBlog(null);
      }
    } catch (e) {
      if (INITIAL_BLOGS_MAP[slug]) {
        setBlog(INITIAL_BLOGS_MAP[slug]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const fullUrl = window.location.href;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="animate-spin h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="font-gujarati text-xs text-stone-400">લેખ લોડ થઈ રહ્યો છે...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 max-w-md text-center border border-stone-200 dark:border-stone-800 shadow-xl space-y-4">
          <span className="material-symbols-outlined text-5xl text-stone-400">article</span>
          <h2 className="font-headline font-bold text-lg text-stone-800 dark:text-stone-100">આ લેખ મળ્યો નથી</h2>
          <p className="font-gujarati text-xs text-stone-500">આ લિંક ભૂલભરેલી હોઈ શકે છે અથવા લેખ દૂર કરવામાં આવ્યો છે.</p>
          <button
            onClick={() => navigate('/blogs')}
            className="px-6 py-2.5 bg-amber-500 text-white rounded-xl font-gujarati text-xs font-bold shadow-md cursor-pointer"
          >
            તમામ બ્લોગ્સ જુઓ →
          </button>
        </div>
      </div>
    );
  }

  const shareText = `📰 *${blog.title}*\n\n${blog.excerpt || ''}\n\nઆખો લેખ વાંચવા માટે અહીં ક્લિક કરો:\n${window.location.href}`;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pb-24 text-stone-900 dark:text-stone-100">
      
      {/* Top Floating Navbar */}
      <div className="sticky top-0 z-50 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 text-white px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/blogs')}
            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 rounded-xl text-xs font-gujarati font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span> બ્લોગ્સ
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-gujarati font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">{copied ? 'check' : 'link'}</span>
              {copied ? 'લિંક કોપી થઈ!' : 'લિંક કોપી કરો'}
            </button>

            <ShareButton
              title={blog.title}
              text={shareText}
              url={window.location.href}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-gujarati font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-sm">share</span> શેર કરો
            </ShareButton>
          </div>
        </div>
      </div>

      {/* Main Article Container */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        {/* Category & Metadata */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/30 text-[11px] font-gujarati font-bold px-3 py-1 rounded-full">
              {blog.category || 'જનરલ'}
            </span>
            <span className="text-xs text-stone-400 font-gujarati">
              • {new Date(blog.created_at).toLocaleDateString('gu-IN')}
            </span>
          </div>

          <h1 className="font-headline font-black text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center justify-between text-xs font-gujarati text-stone-500 dark:text-stone-400 pt-1 border-b border-stone-200/60 dark:border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-amber-500">account_circle</span>
              <span className="font-bold text-stone-700 dark:text-stone-300">{blog.author || 'ગુજરાતી ટીમ'}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">visibility</span> {(blog.views || 0) + 1} વાંચકો
              </span>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {blog.cover_image && (
          <div className="rounded-3xl overflow-hidden shadow-lg border border-stone-200/60 dark:border-stone-800 bg-stone-200 dark:bg-stone-800 max-h-[400px]">
            <img
              src={blog.cover_image}
              alt={blog.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        {/* Excerpt Banner */}
        {blog.excerpt && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-4 rounded-r-2xl font-gujarati text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-medium italic leading-relaxed">
            "{blog.excerpt}"
          </div>
        )}

        {/* Rich Content Body */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200/60 dark:border-stone-800 shadow-sm space-y-4">
          <div className="font-gujarati text-sm sm:text-base leading-relaxed text-stone-800 dark:text-stone-200 whitespace-pre-line space-y-3">
            {(blog.content || '').split('\n\n').map((paragraph, idx) => {
              let renderEl = null;

              if (paragraph.startsWith('## ')) {
                renderEl = (
                  <h2 key={idx} className="font-headline font-black text-xl text-stone-900 dark:text-stone-100 mt-6 mb-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              } else if (paragraph.startsWith('### ')) {
                renderEl = (
                  <h3 key={idx} className="font-headline font-black text-lg text-amber-600 dark:text-amber-400 mt-5 mb-2">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              } else if (paragraph.startsWith('> ')) {
                renderEl = (
                  <blockquote key={idx} className="border-l-4 border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-r-2xl italic text-stone-700 dark:text-stone-300 font-gujarati my-3">
                    {paragraph.replace('> ', '')}
                  </blockquote>
                );
              } else {
                const imgMatch = paragraph.match(/!\[(.*?)\]\((.*?)\)/);
                if (imgMatch) {
                  renderEl = (
                    <div key={idx} className="my-4 rounded-2xl overflow-hidden shadow-md border border-stone-200 dark:border-stone-800 max-h-[450px]">
                      <img src={imgMatch[2]} alt={imgMatch[1] || 'Blog Image'} className="w-full h-full object-cover" />
                      {imgMatch[1] && <p className="text-[11px] text-stone-400 text-center py-1 bg-stone-100 dark:bg-stone-900 font-gujarati">{imgMatch[1]}</p>}
                    </div>
                  );
                } else if (paragraph.includes('<p>') || paragraph.includes('<div>') || paragraph.includes('<h2') || paragraph.includes('<img') || paragraph.includes('<a ')) {
                  renderEl = <div key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />;
                } else if (paragraph.includes('[') && paragraph.includes('](')) {
                  const linkRegex = /\[(.*?)\]\((.*?)\)/g;
                  const parts = [];
                  let lastIndex = 0;
                  let match;

                  while ((match = linkRegex.exec(paragraph)) !== null) {
                    if (match.index > lastIndex) {
                      parts.push(paragraph.substring(lastIndex, match.index));
                    }
                    const label = match[1];
                    const url = match[2];
                    const isInternal = url.startsWith('/') || url.startsWith('#/');

                    parts.push(
                      <a
                        key={match.index}
                        href={url}
                        target={isInternal ? '_self' : '_blank'}
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (isInternal) {
                            e.preventDefault();
                            navigate(url.replace('#', ''));
                          }
                        }}
                        className="text-amber-600 dark:text-amber-400 font-bold underline hover:text-amber-700 mx-0.5 inline-flex items-center gap-0.5"
                      >
                        {label}
                        <span className="material-symbols-outlined text-xs">open_in_new</span>
                      </a>
                    );
                    lastIndex = linkRegex.lastIndex;
                  }

                  if (lastIndex < paragraph.length) {
                    parts.push(paragraph.substring(lastIndex));
                  }

                  renderEl = (
                    <p key={idx} className="leading-relaxed">
                      {parts}
                    </p>
                  );
                } else {
                  renderEl = (
                    <p key={idx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  );
                }
              }

              const showInBodyBanner = (idx + 1) === 5 || (idx + 1) === 13;

              return (
                <React.Fragment key={idx}>
                  {renderEl}
                  {showInBodyBanner && (
                    <div className="my-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 text-white shadow-lg border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-4 font-gujarati animate-fade-in">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 bg-white text-amber-600 rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                          <span className="material-symbols-outlined text-2xl font-bold">smartphone</span>
                        </div>
                        <div>
                          <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            📱 ઑફિશિયલ ગુજરાતી એપ
                          </span>
                          <h4 className="font-headline font-bold text-sm text-white mt-1 leading-snug">
                            આવી જ અવનવી માહિતી, ધર્મ અને મનોરંજન માટે આજે જ ડાઉનલોડ કરો ગુજરાતી એપ
                          </h4>
                        </div>
                      </div>

                      <a
                        href="https://play.google.com/store/apps/details?id=in.gujaratiapp"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-4 py-2.5 bg-white text-amber-900 hover:bg-stone-100 rounded-2xl text-xs font-bold shadow-md transition-all cursor-pointer shrink-0 flex items-center justify-center gap-2 active:scale-95"
                      >
                        <svg className="w-4 h-4 fill-current text-emerald-600" viewBox="0 0 24 24">
                          <path d="M3.609 1.814L13.792 12 3.61 22.186c-.198-.184-.31-.444-.31-.72V2.534c0-.276.112-.536.309-.72zm11.602 11.604l2.457 2.457-12.87 7.428 10.413-9.885zm0-2.836L4.798 .697l12.87 7.428-2.457 2.457zm1.418 1.418l3.414 1.971c.645.372.645.98 0 1.352l-3.414 1.971-2.155-2.155 2.155-2.139z"/>
                        </svg>
                        <span>ડાઉનલોડ કરો Google Play</span>
                      </a>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Bottom Share & Footer */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-headline font-bold text-base">શું તમને આ માહિતી ઉપયોગી લાગી? 🌟</h4>
            <p className="font-gujarati text-xs text-white/90 mt-0.5">તમારા મિત્રો અને વોટ્સએપ ગ્રુપ સાથે જરૂર શેર કરો.</p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Direct WhatsApp Share Button */}
            <button
              onClick={() => {
                const text = `*${blog.title}*\n\n${blog.excerpt || ''}\n\nવધુ વાંચો: ${window.location.href}`;
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
              }}
              title="વોટ્સએપ પર શેર કરો"
              className="h-11 w-11 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-md transition-all cursor-pointer active:scale-95"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.705 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </button>

            {/* Direct Facebook Share Button */}
            <button
              onClick={() => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
              }}
              title="ફેસબુક પર શેર કરો"
              className="h-11 w-11 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center shadow-md transition-all cursor-pointer active:scale-95"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>

            {/* General Share Button */}
            <ShareButton
              title={blog.title}
              text={shareText}
              url={window.location.href}
              className="h-11 px-4 bg-white text-amber-800 hover:bg-stone-100 rounded-2xl text-xs font-gujarati font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <span className="material-symbols-outlined text-base">share</span> શેર કરો
            </ShareButton>
          </div>
        </div>

        {/* Play Store App Download Banner */}
        <div className="bg-stone-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-5 font-gujarati mt-4 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg">
              <span className="material-symbols-outlined text-2xl">get_app</span>
            </div>
            <div>
              <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30 uppercase tracking-wider">
                📲 એપ ડાઉનલોડ કરો
              </span>
              <h4 className="font-headline font-bold text-sm sm:text-base text-stone-100 mt-1 leading-snug">
                આવી જ અવનવી માહિતી, ધર્મ અને મનોરંજન માટે આજે જ ડાઉનલોડ કરો ગુજરાતી એપ
              </h4>
              <p className="text-[11px] text-stone-400 mt-0.5">
                પંચાંગ, કુંડળી, વાસ્તુ, સુવિચાર અને સાહિત્ય મેળવો તમારા મોબાઇલમાં.
              </p>
            </div>
          </div>

          <a
            href="https://play.google.com/store/apps/details?id=in.gujaratiapp"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl text-xs font-bold shadow-lg transition-all cursor-pointer shrink-0 flex items-center justify-center gap-2.5 active:scale-95 group"
          >
            {/* Google Play SVG Icon */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M3.609 1.814L13.792 12 3.61 22.186c-.198-.184-.31-.444-.31-.72V2.534c0-.276.112-.536.309-.72zm11.602 11.604l2.457 2.457-12.87 7.428 10.413-9.885zm0-2.836L4.798 .697l12.87 7.428-2.457 2.457zm1.418 1.418l3.414 1.971c.645.372.645.98 0 1.352l-3.414 1.971-2.155-2.155 2.155-2.139z"/>
            </svg>
            <div className="text-left leading-tight">
              <div className="text-[9px] uppercase font-medium text-emerald-100">GET IT ON</div>
              <div className="text-xs font-black tracking-wide">Google Play</div>
            </div>
          </a>
        </div>

      </article>
    </div>
  );
};

export default BlogPostDetail;
