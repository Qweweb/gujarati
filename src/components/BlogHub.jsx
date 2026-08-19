import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ShareButton from './ShareButton';
import { updatePageSEO } from '../utils/seoHelper';

const INITIAL_BLOGS = [
  {
    id: 'b1',
    title: 'પવિત્ર શ્રાવણ માસ ૨૦૨૬: સોમવારના વ્રત અને મહાદેવની પૂજા વિધિ',
    slug: 'shravan-maas-puja-vidhi-2026',
    excerpt: 'શ્રાવણ માસમાં શિવ પૂજા, બીલીપત્ર ચડાવવાનો મહિમા અને શ્રાવણી સોમવારના વ્રત કથા વિશે વિગતવાર માહિતી.',
    content: `શ્રાવણ માસ એ ભગવાન ભોળાનાથની આરાધનાનો સર્વશ્રેષ્ઠ સમય માનવામાં આવે છે. આ માસમાં કરવામાં આવતી પૂજા અને વ્રતથી ભક્તોના તમામ મનોરથ પૂર્ણ થાય છે.\n\n### શ્રાવણી સોમવારનું મહત્વ\nશ્રાવણ મહિનાના દરેક સોમવારે શિવલિંગ પર જળાભિષેક, દૂધાભિષેક અને ત્રિદલ બીલીપત્ર અર્પણ કરવાનું વિશેષ પુણ્ય પ્રાપ્ત થાય છે.\n\n### પૂજા વિધિ અને મંત્ર\n1. સવારે વહેલા ઊઠી સ્નાન કરી સ્વચ્છ વસ્ત્રો ધારણ કરવા.\n2. શિવલિંગ પર 'ઓમ નમઃ શિવાય' મંત્રનો જાપ કરતા જળ અને દૂધ અર્પણ કરવું.\n3. તાજા બીલીપત્ર, ધાતુરાનું પુષ્પ અને અક્ષત ચડાવવા.\n4. શિવ ચાલીસા અથવા મહામૃત્યુંજય મંત્રનો 108 વાર જાપ કરવો.`,
    cover_image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=1000&auto=format&fit=crop',
    category: 'ધર્મ અને ભક્તિ',
    author: 'ગુજરાતી ધર્મ સભા',
    views: 1240,
    created_at: new Date().toISOString()
  },
  {
    id: 'b2',
    title: 'ઘરમાં વાસ્તુ દોષ નિવારણ માટેના ૫ સરળ અને અચૂક ઉપાયો',
    slug: 'vastu-dosha-remedies-home-tips',
    excerpt: 'તમારા ઘરમાં સુખ, શાંતિ અને સમૃદ્ધિ લાવવા માટે આયુર્વેદિક અને વાસ્તુ શાસ્ત્રના 5 સરળ ઉપાયો.',
    content: `ઘરમાં રહેલી નકારાત્મક ઉર્જાને દૂર કરવા અને સકારાત્મક વાતાવરણ ઊભું કરવા વાસ્તુ શાસ્ત્રના નિયમો ખૂબ ઉપયોગી છે.\n\n### ૧. મુખ્ય દ્વારની સફાઈ અને તોરણ\nઘરના મુખ્ય દરવાજા પર રોજ સવારે આસોપાલવ અથવા આમ્રપત્રનું તોરણ બાંધવું શુભ ગણાય છે.\n\n### ૨. ઉત્તર-પૂર્વ (ઈશાન) ખૂણો સ્વચ્છ રાખવો\nઈશાન ખૂણામાં દેવસ્થાન (પૂજા ઘર) રાખવું અને ત્યાં ક્યારેય ભારે સામાન કે કચરો ના રાખવો.`,
    cover_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop',
    category: 'વાસ્તુ અને જ્યોતિષ',
    author: 'આચાર્ય શાસ્ત્રી',
    views: 890,
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'b3',
    title: 'આયુર્વેદ અનુસાર રોજ સવારે નયણે કોઠે ગરમ પાણી પીવાના ફાયદા',
    slug: 'ayurveda-warm-water-benefits-morning',
    excerpt: 'સવારે ઉઠીને માત્ર ૧ ગ્લાસ નવશેકું પાણી પીવાથી પાચન અને ત્વચા પર થતી અદ્ભુત અસરો.',
    content: `આયુર્વેદિક જીવનશૈલીમાં ઉષાપાન (સવારે નયણે કોઠે પાણી પીવું) નું વિશેષ મહત્વ વર્ણવવામાં આવ્યું છે.\n\n### મુખ્ય ફાયદા:\n- પેટની કબજિયાત અને ગેસની સમસ્યામાં રાહત.\n- શરીરના ઝેરી તત્વો (Toxins) બહાર નીકળે છે.\n- વજન નિયંત્રણમાં રાખવામાં મદદરૂપ.`,
    cover_image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop',
    category: 'સ્વાસ્થ્ય અને જીવનશૈલી',
    author: 'વૈદ્યરાજ પટેલ',
    views: 1560,
    created_at: new Date(Date.now() - 172800000).toISOString()
  }
];

const BlogHub = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState(INITIAL_BLOGS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('તમામ');

  const categories = ['તમામ', 'ધર્મ અને ભક્તિ', 'વાસ્તુ અને જ્યોતિષ', 'સ્વાસ્થ્ય અને જીવનશૈલી', 'સંસ્કૃતિ અને તહેવાર', 'જનરલ'];

  useEffect(() => {
    fetchBlogs();
    updatePageSEO({
      title: 'ગુજરાતી બ્લોગ અને સાહિત્ય હબ',
      description: 'વાંચો પવિત્ર શ્રાવણ માસ પૂજા વિધિ, વાસ્તુ દોષ નિવારણ ઉપાયો, આયુર્વેદ ટિપ્સ, ધાર્મિક વાર્તાઓ અને દૈનિક સુવિચાર.',
      keywords: 'ગુજરાતી બ્લોગ, વાસ્તુ ટિપ્સ, શ્રાવણ માસ પૂજા, આયુર્વેદ ઉપચાર, ધાર્મિક સાહિત્ય'
    });
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setBlogs(data);
      }
    } catch (e) {
      console.warn('Using local fallback blogs:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = selectedCategory === 'તમામ' || blog.category === selectedCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (blog.excerpt && blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pb-24 text-stone-900 dark:text-stone-100">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white pt-6 pb-8 px-4 sm:px-6 rounded-b-[2rem] shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/tools')}
              className="px-3.5 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-xs font-gujarati font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span> પાછા ટૂલ્સમાં જાવ
            </button>
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-gujarati font-bold tracking-wider uppercase">
              📖 ગુજરાતી બ્લોગ્સ & લેખો
            </span>
          </div>

          <div>
            <h1 className="font-headline font-black text-2xl sm:text-3xl text-white tracking-wide">
              ગુજરાતી બ્લોગ અને જ્ઞાન સંગ્રહ 📰
            </h1>
            <p className="font-gujarati text-xs sm:text-sm text-amber-100/90 mt-1 max-w-2xl">
              ધર્મ, સંસ્કૃતિ, વાસ્તુ, આયુર્વેદ અને જીવન ઉપયોગી લેખો વાંચો અને મિત્રો સાથે શેર કરો.
            </p>
          </div>

          {/* Search Box */}
          <div className="pt-1">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-lg">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="બ્લોગ અથવા વિષય શોધો..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-gujarati text-xs sm:text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-5">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-gujarati font-bold whitespace-nowrap shadow-sm transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-white shadow-amber-500/30'
                  : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200/80 dark:border-stone-800 hover:bg-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Cards Grid */}
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="font-gujarati text-xs text-stone-400">બ્લોગ્સ લોડ થઈ રહ્યા છે...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-10 text-center my-6 border border-stone-200/60 dark:border-stone-800 shadow-sm space-y-3">
            <span className="material-symbols-outlined text-4xl text-stone-300">article</span>
            <h3 className="font-gujarati font-bold text-sm text-stone-600 dark:text-stone-400">
              કોઈ બ્લોગ મળ્યો નથી.
            </h3>
            <p className="font-gujarati text-xs text-stone-400">મહેરબાની કરીને બીજો વિષય અથવા કીવર્ડ સર્ચ કરો.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id || blog.slug}
                onClick={() => navigate(`/blog/${blog.slug}`)}
                className="group bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/60 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Cover Image */}
                  <div className="h-48 w-full overflow-hidden relative bg-stone-200 dark:bg-stone-800">
                    <img
                      src={blog.cover_image || 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=1000&auto=format&fit=crop'}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=1000&auto=format&fit=crop';
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-amber-400 text-[10px] font-gujarati font-bold px-3 py-1 rounded-full border border-amber-500/30">
                      {blog.category || 'જનરલ'}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-2.5">
                    <h2 className="font-headline font-bold text-base text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors leading-snug line-clamp-2">
                      {blog.title}
                    </h2>
                    <p className="font-gujarati text-xs text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-3">
                      {blog.excerpt || blog.content.substring(0, 120) + '...'}
                    </p>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="px-5 pb-5 pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[11px] font-gujarati text-stone-400">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs">edit_note</span>
                    <span>{blog.author || 'ગુજરાતી ટીમ'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                    <span>આખો લેખ વાંચો</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogHub;
