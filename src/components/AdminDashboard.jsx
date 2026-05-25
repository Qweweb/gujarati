import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AI_PROVIDERS, getAIConfig, saveAIConfig, testAIConnection } from '../utils/aiService';

const DEFAULT_PIN = "1008";

const MOCK_STATS = {
  dailyUsers: 2450,
  cardsShared: 14820,
  quizPlays: 3890,
  activePremium: 412,
  reportedPosts: 8
};

const MOCK_MATAJI_SUBMISSIONS = [
  { id: 1, name: "શ્રી ખોડિયાર માતાજી", gotra: "પટેલ / કણબી", detail: "ખોડલધામ કાગવડ ઇતિહાસ અને આરતી વિધિની નવી માહિતી.", user: "નરેશ પી.", status: "Pending" },
  { id: 2, name: "શ્રી બહુચરાજી માતાજી", gotra: "બારોટ / ભટ્ટ", detail: "કોકિલા વ્રત અને નાભિ સ્થાન શક્તિપીઠનો મહિમા વિગતવાર.", user: "રાકેશ બી.", status: "Pending" },
  { id: 3, name: "શ્રી મોગલ મા", gotra: "ચારણ / ગઢવી", detail: "કબરાઉ ધામનો ઇતિહાસ અને શ્રદ્ધાળુઓના પરચાઓની વિગત.", user: "હરપાલસિંહ સી.", status: "Pending" }
];

const MOCK_REPORTED_POSTS = [
  { id: 1, author: "વિજય આર.", content: "આ ખોટી માહિતી ફેલાવી રહ્યું છે, પંચાંગ ચોઘડિયામાં સમય સાચો નથી.", reports: 4, timestamp: "૨ કલાક પહેલાં" },
  { id: 2, author: "સુરેશ એમ.", content: "જાહેરાત: ભક્તિ પ્રમોશન માટે કોન્ટેક્ટ કરો 9898xxxxxx", reports: 2, timestamp: "૫ કલાક પહેલાં" },
  { id: 3, author: "ગીતા પી.", content: "કોઈપણ અપશબ્દો વાળી વાત કે પોસ્ટ", reports: 5, timestamp: "૧ દિવસ પહેલાં" }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Local storage backed state
  const [stats, setStats] = useState(MOCK_STATS);
  const [matajiSubmissions, setMatajiSubmissions] = useState(MOCK_MATAJI_SUBMISSIONS);
  const [reportedPosts, setReportedPosts] = useState(MOCK_REPORTED_POSTS);
  
  // AI Settings State
  const [aiConfig, setAiConfig] = useState(() => getAIConfig());
  const [aiTestResult, setAiTestResult] = useState(null);
  const [aiTesting, setAiTesting] = useState(false);
  const [aiSaved, setAiSaved] = useState(false);
  const selectedProvider = AI_PROVIDERS.find(p => p.id === aiConfig.provider) || null;
  
  // Custom Quotes State
  const [customQuotes, setCustomQuotes] = useState(() => {
    const saved = localStorage.getItem('sanskari_custom_quotes');
    return saved ? JSON.parse(saved) : {
      bhakti: [], morning: [], night: [], festival: [], prerna: [], health: [], jyotish: [], sahitya: []
    };
  });

  const [newQuoteText, setNewQuoteText] = useState("");
  const [newQuoteSource, setNewQuoteSource] = useState("");
  const [newQuoteCategory, setNewQuoteCategory] = useState("bhakti");

  // Premium Management
  const [promoCodes, setPromoCodes] = useState([
    { code: "JAYSHREEKRISHNA", discount: "50%", type: "Festival Special", status: "Active" },
    { code: "KULDEVIPRASAD", discount: "100%", type: "Free Trial", status: "Active" },
  ]);
  const [newPromoCode, setNewPromoCode] = useState("");
  const [newPromoDiscount, setNewPromoDiscount] = useState("50%");

  // Load actual application stats
  useEffect(() => {
    // Generate some randomized live-looking numbers based on local storage activity
    const cardsGenerated = parseInt(localStorage.getItem('sanskari_cards_generated_count') || "430");
    setStats(prev => ({
      ...prev,
      cardsShared: prev.cardsShared + cardsGenerated
    }));
  }, []);

  const handlePinSubmit = (val) => {
    const currentPin = val || pin;
    if (currentPin === DEFAULT_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin("");
      setTimeout(() => setPinError(false), 800);
    }
  };

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      if (nextPin.length === 4) {
        handlePinSubmit(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  // Add Custom Quote
  const handleAddQuote = (e) => {
    e.preventDefault();
    if (!newQuoteText || !newQuoteSource) return;

    const newQuote = {
      text: newQuoteText,
      source: newQuoteSource
    };

    const updated = {
      ...customQuotes,
      [newQuoteCategory]: [...(customQuotes[newQuoteCategory] || []), newQuote]
    };

    setCustomQuotes(updated);
    localStorage.setItem('sanskari_custom_quotes', JSON.stringify(updated));
    
    // Clear Form
    setNewQuoteText("");
    setNewQuoteSource("");
    alert("સુવિચાર સફળતાપૂર્વક ઉમેરાઈ ગયો!");
  };

  // Delete Custom Quote
  const handleDeleteQuote = (category, index) => {
    const updatedCategoryList = [...customQuotes[category]];
    updatedCategoryList.splice(index, 1);
    
    const updated = {
      ...customQuotes,
      [category]: updatedCategoryList
    };

    setCustomQuotes(updated);
    localStorage.setItem('sanskari_custom_quotes', JSON.stringify(updated));
  };

  // Community post action
  const handleResolveReport = (id, action) => {
    setReportedPosts(prev => prev.filter(post => post.id !== id));
    if (action === 'delete') {
      alert("પોસ્ટ કમ્યુનિટીમાંથી સફળતાપૂર્વક દૂર કરવામાં આવી.");
    } else {
      alert("પોસ્ટને ક્લીન ચીટ આપીને રિપોર્ટ રદ કરાયો.");
    }
  };

  // Mataji Form approve
  const handleApproveMataji = (id) => {
    setMatajiSubmissions(prev => prev.map(sub => sub.id === id ? { ...sub, status: "Approved" } : sub));
    alert("માહિતી અપ્રુવ કરવામાં આવી. આ વિગતો એપના 'માતાજી ઇતિહાસ' સેક્શનમાં એડ થઈ જશે.");
  };

  const handleDeclineMataji = (id) => {
    setMatajiSubmissions(prev => prev.filter(sub => sub.id !== id));
    alert("સબમિશન અસ્વીકાર કરવામાં આવ્યું.");
  };

  // Add Promo Code
  const handleAddPromo = (e) => {
    e.preventDefault();
    if (!newPromoCode) return;
    setPromoCodes([...promoCodes, {
      code: newPromoCode.toUpperCase(),
      discount: newPromoDiscount,
      type: "Custom Code",
      status: "Active"
    }]);
    setNewPromoCode("");
  };

  // PIN PROTECTION SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] bg-[#fef8f1] dark:bg-[#1a0a00] flex flex-col items-center justify-center p-4 font-body transition-colors">
        <div className={`w-full max-w-sm bg-white dark:bg-stone-900 rounded-[2.5rem] p-8 border border-amber-200/50 dark:border-stone-800 shadow-xl text-center transition-all ${pinError ? 'animate-shake' : ''}`}>
          
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-amber-600 text-3xl">admin_panel_settings</span>
          </div>

          <h2 className="font-headline font-black text-2xl tracking-tight text-stone-900 dark:text-stone-100">સંસ્કારી એડમિન લોગિન</h2>
          <p className="text-stone-500 dark:text-stone-400 font-gujarati text-xs mt-2 mb-6">
            એપ મેનેજમેન્ટ કરવા માટે ૪-અંકનો સિક્રેટ પિન એન્ટર કરો. (Default: 1008)
          </p>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                  pinError 
                    ? 'bg-rose-500 border-rose-500 scale-110' 
                    : i < pin.length 
                      ? 'bg-amber-500 border-amber-500 scale-110' 
                      : 'border-stone-300 dark:border-stone-700 bg-transparent'
                }`}
              />
            ))}
          </div>

          {/* Custom Keypad */}
          <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button 
                key={num}
                onClick={() => handleKeyPress(num.toString())}
                className="h-14 bg-stone-50 dark:bg-stone-800/50 hover:bg-amber-50 dark:hover:bg-stone-800 font-headline font-bold text-lg rounded-2xl flex items-center justify-center active:scale-95 transition-all text-stone-800 dark:text-stone-200 border border-stone-100 dark:border-stone-800"
              >
                {num}
              </button>
            ))}
            <button 
              onClick={() => navigate('/')}
              className="h-14 bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100 dark:hover:bg-stone-800 font-gujarati font-bold text-xs rounded-2xl flex items-center justify-center active:scale-95 transition-all text-stone-500 border border-stone-100 dark:border-stone-800"
            >
              બહાર જાઓ
            </button>
            <button 
              onClick={() => handleKeyPress("0")}
              className="h-14 bg-stone-50 dark:bg-stone-800/50 hover:bg-amber-50 dark:hover:bg-stone-800 font-headline font-bold text-lg rounded-2xl flex items-center justify-center active:scale-95 transition-all text-stone-800 dark:text-stone-200 border border-stone-100 dark:border-stone-800"
            >
              0
            </button>
            <button 
              onClick={handleBackspace}
              className="h-14 bg-stone-50 dark:bg-stone-800/50 hover:bg-rose-50 dark:hover:bg-stone-800 text-rose-500 rounded-2xl flex items-center justify-center active:scale-95 transition-all border border-stone-100 dark:border-stone-800"
            >
              <span className="material-symbols-outlined text-xl">backspace</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // LOGGED IN ADMIN DASHBOARD SCREEN
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 font-body min-h-[85vh] text-stone-800 dark:text-stone-200 transition-colors">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800 mb-8">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
          </div>
          <div>
            <h1 className="font-headline font-black text-2xl tracking-tight flex items-center gap-2">
              ગુજરાતી એપ એડમિન કંટ્રોલર
            </h1>
            <p className="text-stone-500 dark:text-stone-400 font-gujarati text-xs mt-1">
              એપ્લિકેશનના લાઇવ કન્ટેન્ટ, રિપોર્ટ્સ અને યુઝર્સને મેનેજ કરો.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 rounded-xl font-gujarati font-bold text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-50 transition active:scale-95 shadow-sm flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">lock</span> લોક આઉટ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar Drawer */}
        <div className="lg:col-span-3 space-y-2">
          <div className="bg-white dark:bg-stone-950 p-4 rounded-[2rem] border border-stone-200/50 dark:border-stone-900 shadow-sm space-y-1">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-gujarati font-bold text-sm transition-all ${
                activeTab === "overview" 
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10' 
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900'
              }`}
            >
              <span className="material-symbols-outlined text-lg">monitoring</span>
              મેનેજમેન્ટ ડેશબોર્ડ
            </button>
            <button 
              onClick={() => setActiveTab("mataji")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-gujarati font-bold text-sm transition-all ${
                activeTab === "mataji" 
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10' 
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900'
              }`}
            >
              <span className="material-symbols-outlined text-lg">edit_note</span>
              માતાજી વિગતો સ્વીકૃતિ
              {matajiSubmissions.filter(s => s.status === 'Pending').length > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-headline font-bold">
                  {matajiSubmissions.filter(s => s.status === 'Pending').length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("quotes")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-gujarati font-bold text-sm transition-all ${
                activeTab === "quotes" 
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10' 
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900'
              }`}
            >
              <span className="material-symbols-outlined text-lg">rate_review</span>
              સુવિચાર કસ્ટમાઇઝેશન
            </button>
            <button 
              onClick={() => setActiveTab("moderator")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-gujarati font-bold text-sm transition-all ${
                activeTab === "moderator" 
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10' 
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900'
              }`}
            >
              <span className="material-symbols-outlined text-lg">gavel</span>
              કમ્યુનિટી મોડરેટર
              {reportedPosts.length > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-headline font-bold">
                  {reportedPosts.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("premium")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-gujarati font-bold text-sm transition-all ${
                activeTab === "premium" 
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10' 
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900'
              }`}
            >
              <span className="material-symbols-outlined text-lg">card_membership</span>
              પ્રીમિયમ અને પ્રોમો કોડ
            </button>
            <button 
              onClick={() => setActiveTab("ai")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-gujarati font-bold text-sm transition-all ${
                activeTab === "ai" 
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20' 
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900'
              }`}
            >
              <span className="material-symbols-outlined text-lg">smart_toy</span>
              🤖 AI સેટિંગ
              {aiConfig.enabled && aiConfig.provider && (
                <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </button>
          </div>
        </div>

        {/* Tab Contents Panel */}
        <div className="lg:col-span-9">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200/50 dark:border-stone-850 shadow-sm flex flex-col justify-between">
                  <span className="text-stone-400 font-gujarati text-xs">દૈનિક યુઝર્સ (Live)</span>
                  <span className="font-headline font-black text-3xl text-amber-500 mt-2">{stats.dailyUsers}</span>
                  <span className="text-[10px] text-emerald-500 font-bold mt-1">↑ ૧૪% વધારો</span>
                </div>
                <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200/50 dark:border-stone-850 shadow-sm flex flex-col justify-between">
                  <span className="text-stone-400 font-gujarati text-xs">કુલ જનરેટ કરેલ કાર્ડ્સ</span>
                  <span className="font-headline font-black text-3xl text-amber-500 mt-2">{stats.cardsShared}</span>
                  <span className="text-[10px] text-emerald-500 font-bold mt-1">↑ ૨૫% સોશિયલ શેર</span>
                </div>
                <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200/50 dark:border-stone-850 shadow-sm flex flex-col justify-between">
                  <span className="text-stone-400 font-gujarati text-xs">રમાયેલ ક્વિઝ ગેમ્સ</span>
                  <span className="font-headline font-black text-3xl text-amber-500 mt-2">{stats.quizPlays}</span>
                  <span className="text-[10px] text-emerald-500 font-bold mt-1">↑ ૮% રીટેન્શન વધ્યું</span>
                </div>
                <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200/50 dark:border-stone-850 shadow-sm flex flex-col justify-between">
                  <span className="text-stone-400 font-gujarati text-xs">એક્ટિવ પ્રીમિયમ યુઝર્સ</span>
                  <span className="font-headline font-black text-3xl text-amber-500 mt-2">{stats.activePremium}</span>
                  <span className="text-[10px] text-emerald-500 font-bold mt-1">આજે ૨ અપગ્રેડ થયાં</span>
                </div>
              </div>

              {/* Graphic Stats Chart Visualizer */}
              <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-6 border border-stone-200/50 dark:border-stone-850 shadow-sm">
                <h3 className="font-gujarati font-bold text-sm text-stone-700 dark:text-stone-300 mb-6">છેલ્લા ૭ દિવસની એપ એક્ટિવિટી</h3>
                <div className="h-48 flex items-end justify-between gap-2 pt-4 px-2">
                  {[
                    { day: "સોમ", val: 40 },
                    { day: "મંગળ", val: 55 },
                    { day: "બુધ", val: 48 },
                    { day: "ગુરૂ", val: 70 },
                    { day: "શુક્ર", val: 65 },
                    { day: "શનિ", val: 85 },
                    { day: "રવિ", val: 95 }
                  ].map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-full relative bg-amber-500/10 dark:bg-stone-800 rounded-t-lg overflow-hidden h-36 flex items-end">
                        <div 
                          style={{ height: `${item.val}%` }}
                          className="w-full bg-gradient-to-t from-amber-600 to-amber-400 group-hover:brightness-110 transition-all rounded-t-sm"
                        />
                      </div>
                      <span className="font-gujarati text-[10px] text-stone-500 dark:text-stone-400">{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-[2rem] p-6">
                <h4 className="font-gujarati font-bold text-xs text-amber-700 dark:text-amber-550 uppercase tracking-wider mb-3">એડમિન ક્વિક એક્શન ટાસ્ક લિસ્ટ</h4>
                <ul className="space-y-2 font-gujarati text-xs text-stone-600 dark:text-stone-400">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-rose-500 animate-pulse">info</span>
                    માતાજી વિગતો સેક્શનમાં મળેલા નવા ૩ સબમિશન્સ રીવ્યુ કરો.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-amber-500">warning</span>
                    કમ્યુનિટી પોસ્ટમાં ફ્લેગ કરેલી ૩ વિવાદિત કોમેન્ટ્સ પર મોડરેટર એક્શન લો.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-emerald-500">check_circle</span>
                    આજનો પંચાંગ અને શુભ સમય ચોઘડિયા પ્રોટોકોલ બરાબર સિંક થઈ ગયો છે.
                  </li>
                </ul>
              </div>

            </div>
          )}

          {/* TAB 2: MATAJI GUIDE SUBMISSIONS */}
          {activeTab === "mataji" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-headline font-black text-lg text-stone-900 dark:text-stone-100">માતાજી અને કુળદેવી કલેક્શન સબમિશન્સ</h3>
                <span className="font-gujarati text-xs text-stone-500">યુઝર્સ તરફથી મળેલ ગૂગલ ફોર્મ સબમિશન્સ લિસ્ટ</span>
              </div>

              {matajiSubmissions.length === 0 ? (
                <div className="bg-stone-50 dark:bg-stone-900 rounded-[2rem] p-12 text-center border border-stone-200/50 dark:border-stone-850">
                  <span className="material-symbols-outlined text-stone-400 text-5xl mb-3">inbox</span>
                  <p className="font-gujarati font-bold text-stone-500">હાલમાં કોઈ નવું સબમિશન નથી.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {matajiSubmissions.map(sub => (
                    <div 
                      key={sub.id} 
                      className={`bg-white dark:bg-stone-900 p-6 rounded-[2rem] border shadow-sm transition-all ${
                        sub.status === 'Approved' 
                          ? 'border-emerald-200 bg-emerald-500/5 dark:border-emerald-950 dark:bg-emerald-950/10' 
                          : 'border-stone-200 dark:border-stone-850'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div>
                          <span className="bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-md text-[10px] font-gujarati font-bold">{sub.gotra} કુળ માટે</span>
                          <h4 className="font-gujarati font-bold text-base mt-1 text-stone-800 dark:text-stone-200">{sub.name}</h4>
                        </div>
                        <span className={`text-[10px] font-gujarati font-bold px-2 py-1 rounded-full ${
                          sub.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>{sub.status}</span>
                      </div>
                      
                      <p className="font-gujarati text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4 p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-100 dark:border-stone-900">
                        {sub.detail}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-stone-400 font-gujarati">યુઝર: {sub.user} દ્વારા સબમિટ કરેલ</span>
                        
                        {sub.status === 'Pending' && (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleDeclineMataji(sub.id)}
                              className="px-3 py-1.5 border border-stone-200 dark:border-stone-800 hover:bg-rose-50 text-rose-500 rounded-lg text-xs font-gujarati font-bold transition active:scale-95"
                            >
                              નકારો
                            </button>
                            <button 
                              onClick={() => handleApproveMataji(sub.id)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-gujarati font-bold transition active:scale-95"
                            >
                              અપ્રુવ અને પબ્લિશ
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CUSTOM QUOTES */}
          {activeTab === "quotes" && (
            <div className="space-y-8">
              
              {/* Add Quote Form */}
              <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-6 border border-stone-200/50 dark:border-stone-850 shadow-sm">
                <h3 className="font-headline font-black text-base text-stone-900 dark:text-stone-100 mb-4">૧. નવો સુવિચાર ઉમેરો</h3>
                <form onSubmit={handleAddQuote} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">સુવિચાર કેટેગરી</label>
                      <select 
                        value={newQuoteCategory}
                        onChange={(e) => setNewQuoteCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 font-gujarati text-sm"
                      >
                        <option value="bhakti">ભક્તિ (Devotional)</option>
                        <option value="morning">સવાર (Morning)</option>
                        <option value="night">રાત (Night)</option>
                        <option value="festival">તહેવાર (Festival)</option>
                        <option value="prerna">પ્રેરણા (Inspirational)</option>
                        <option value="health">આરોગ્ય (Health)</option>
                        <option value="jyotish">જ્યોતિષ (Astrology)</option>
                        <option value="sahitya">સાહિત્ય (Literature)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">સંદર્ભ (Source)</label>
                      <input 
                        type="text"
                        placeholder="દા.ત. શ્રીમદ્ ભગવદ્ ગીતા, કબીરજી કે લેખક"
                        value={newQuoteSource}
                        onChange={(e) => setNewQuoteSource(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 font-gujarati text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">સુવિચાર વિગત (Gujarati Text)</label>
                    <textarea 
                      rows="3"
                      placeholder="અહીં ગુજરાતીમાં સુવિચાર ટાઈપ કરો..."
                      value={newQuoteText}
                      onChange={(e) => setNewQuoteText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 font-gujarati text-sm"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button 
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-600 text-white font-gujarati font-bold text-sm px-6 py-2.5 rounded-xl transition active:scale-95 shadow-md shadow-amber-500/10"
                    >
                      સુવિચાર સેવ કરો
                    </button>
                  </div>
                </form>
              </div>

              {/* View Custom Quotes List */}
              <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-6 border border-stone-200/50 dark:border-stone-850 shadow-sm">
                <h3 className="font-headline font-black text-base text-stone-900 dark:text-stone-100 mb-4">૨. તમારા ઉમેરેલા કસ્ટમ સુવિચારો</h3>
                
                {Object.values(customQuotes).every(arr => arr.length === 0) ? (
                  <p className="text-stone-400 font-gujarati text-xs text-center py-6">હજુ સુધી કોઈ કસ્ટમ સુવિચાર ઉમેરેલ નથી.</p>
                ) : (
                  <div className="space-y-6">
                    {Object.keys(customQuotes).map(catKey => {
                      const list = customQuotes[catKey] || [];
                      if (list.length === 0) return null;
                      return (
                        <div key={catKey} className="border-b border-stone-100 dark:border-stone-800 pb-4 last:border-0 last:pb-0">
                          <h4 className="font-gujarati font-bold text-xs text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-3">{catKey} કેટેગરી</h4>
                          <div className="space-y-3">
                            {list.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center gap-4 bg-stone-50 dark:bg-stone-950 p-3 rounded-xl border border-stone-100 dark:border-stone-900">
                                <div className="font-gujarati text-xs">
                                  <p className="font-bold text-stone-800 dark:text-stone-200">"{item.text}"</p>
                                  <p className="text-stone-400 mt-1">— {item.source}</p>
                                </div>
                                <button 
                                  onClick={() => handleDeleteQuote(catKey, idx)}
                                  className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition active:scale-95"
                                >
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: COMMUNITY MODERATION */}
          {activeTab === "moderator" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-headline font-black text-lg text-stone-900 dark:text-stone-100">કમ્યુનિટી પોસ્ટ અને રિપોર્ટ્સ કંટ્રોલ</h3>
                <span className="font-gujarati text-xs text-stone-500">યુઝર્સે ફ્લેગ કરેલી શંકાસ્પદ પોસ્ટ્સ</span>
              </div>

              {reportedPosts.length === 0 ? (
                <div className="bg-stone-50 dark:bg-stone-900 rounded-[2rem] p-12 text-center border border-stone-200/50 dark:border-stone-850">
                  <span className="material-symbols-outlined text-emerald-500 text-5xl mb-3">verified</span>
                  <p className="font-gujarati font-bold text-emerald-600">બધી પોસ્ટ્સ ક્લીન છે! કોઈ સક્રિય રિપોર્ટ નથી.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reportedPosts.map(post => (
                    <div key={post.id} className="bg-white dark:bg-stone-900 p-6 rounded-[2rem] border border-rose-100 dark:border-rose-950/20 shadow-sm">
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div>
                          <h4 className="font-gujarati font-bold text-sm text-stone-800 dark:text-stone-200">લેખક: {post.author}</h4>
                          <span className="text-[10px] text-stone-400 font-gujarati">{post.timestamp}</span>
                        </div>
                        <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-1 rounded-full text-[10px] font-gujarati font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">report</span>
                          {post.reports} યુઝર્સે રિપોર્ટ કર્યો
                        </span>
                      </div>
                      
                      <p className="font-gujarati text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4 p-3 bg-stone-50 dark:bg-stone-950 rounded-xl">
                        {post.content}
                      </p>

                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleResolveReport(post.id, 'keep')}
                          className="px-4 py-2 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 rounded-xl text-xs font-gujarati font-bold transition active:scale-95"
                        >
                          રિપોર્ટ રદ કરો
                        </button>
                        <button 
                          onClick={() => handleResolveReport(post.id, 'delete')}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-gujarati font-bold transition active:scale-95 shadow-md shadow-rose-500/10"
                        >
                          પોસ્ટ ડીલીટ કરો
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PREMIUM SETTINGS & PROMO CODES */}
          {activeTab === "premium" && (
            <div className="space-y-8">
              
              {/* Add Promo Code Form */}
              <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-6 border border-stone-200/50 dark:border-stone-850 shadow-sm">
                <h3 className="font-headline font-black text-base text-stone-900 dark:text-stone-100 mb-4">૧. નવો પ્રોમો કોડ જનરેટ કરો</h3>
                <form onSubmit={handleAddPromo} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">પ્રોમો કોડ (Promo Code Name)</label>
                      <input 
                        type="text"
                        placeholder="દા.ત. FESIV100"
                        value={newPromoCode}
                        onChange={(e) => setNewPromoCode(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 font-gujarati text-sm uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">ડિસ્કાઉન્ટ ટકાવારી</label>
                      <select 
                        value={newPromoDiscount}
                        onChange={(e) => setNewPromoDiscount(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 font-gujarati text-sm"
                      >
                        <option value="૧૦%">10% Discount</option>
                        <option value="૨૫%">25% Discount</option>
                        <option value="૫૦%">50% Discount</option>
                        <option value="૧૦૦% (FREE)">100% (FREE TRIAL)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button 
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-600 text-white font-gujarati font-bold text-sm px-6 py-2.5 rounded-xl transition active:scale-95 shadow-md"
                    >
                      પ્રોમો કોડ એક્ટિવ કરો
                    </button>
                  </div>
                </form>
              </div>

              {/* Promo Code list */}
              <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-6 border border-stone-200/50 dark:border-stone-850 shadow-sm">
                <h3 className="font-headline font-black text-base text-stone-900 dark:text-stone-100 mb-4">૨. એક્ટિવ પ્રોમો કોડ લિસ્ટ</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-gujarati text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400">
                        <th className="py-2 pb-3">કોડ</th>
                        <th className="py-2 pb-3">ડિસ્કાઉન્ટ</th>
                        <th className="py-2 pb-3">પ્રકાર</th>
                        <th className="py-2 pb-3">સ્ટેટસ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {promoCodes.map((promo, idx) => (
                        <tr key={idx} className="border-b border-stone-100 dark:border-stone-900 last:border-0">
                          <td className="py-3 font-bold text-amber-600">{promo.code}</td>
                          <td className="py-3">{promo.discount}</td>
                          <td className="py-3 text-stone-400">{promo.type}</td>
                          <td className="py-3">
                            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md text-[10px] font-bold">
                              {promo.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* TAB 6: AI SETTINGS */}
      {activeTab === "ai" && (
        <div className="space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-headline font-black text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
                🤖 AI Model Configuration
              </h3>
              <p className="font-gujarati text-xs text-stone-500 mt-1">દાદી-મા Chatbot માટે AI Provider અને API Key સેટ કરો.</p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-gujarati font-bold ${
              aiConfig.enabled && aiConfig.provider
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700'
                : 'bg-stone-100 dark:bg-stone-900 text-stone-500'
            }`}>
              <span className={`h-2 w-2 rounded-full ${aiConfig.enabled && aiConfig.provider ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`}></span>
              {aiConfig.enabled && aiConfig.provider ? '🟢 Active' : '🔴 Not Configured'}
            </div>
          </div>

          {/* Provider Cards Grid */}
          <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-6 border border-stone-200/50 dark:border-stone-850 shadow-sm">
            <h4 className="font-gujarati font-bold text-sm text-stone-700 dark:text-stone-300 mb-4">1. AI Provider પસંદ કરો</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AI_PROVIDERS.map(provider => (
                <button
                  key={provider.id}
                  onClick={() => setAiConfig(prev => ({ ...prev, provider: provider.id, model: provider.models[0].id, baseUrl: provider.baseUrl || '' }))}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    aiConfig.provider === provider.id
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/20'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{provider.emoji}</div>
                  <p className="font-headline font-bold text-xs text-stone-800 dark:text-stone-200 leading-tight">{provider.name}</p>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded font-gujarati ${
                    provider.tagColor === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                    provider.tagColor === 'blue' ? 'bg-blue-100 text-blue-700' :
                    provider.tagColor === 'orange' ? 'bg-orange-100 text-orange-700' :
                    provider.tagColor === 'purple' ? 'bg-purple-100 text-purple-700' :
                    'bg-stone-100 text-stone-600'
                  }`}>{provider.tag}</span>
                  <p className="font-gujarati text-[10px] text-stone-400 mt-1">{provider.costNote}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Model + Config */}
          {selectedProvider && (
            <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-6 border border-stone-200/50 dark:border-stone-850 shadow-sm space-y-4">
              <h4 className="font-gujarati font-bold text-sm text-stone-700 dark:text-stone-300">2. Model અને Configuration</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Model Selector */}
                <div>
                  <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">AI Model</label>
                  <select
                    value={aiConfig.model}
                    onChange={e => setAiConfig(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 font-gujarati text-sm"
                  >
                    {selectedProvider.models.map(m => (
                      <option key={m.id} value={m.id}>{m.name}{m.recommended ? ' ⭐' : ''}</option>
                    ))}
                  </select>
                </div>

                {/* Custom Model ID (for custom provider) */}
                {aiConfig.provider === 'custom' && (
                  <div>
                    <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">Custom Model ID</label>
                    <input
                      type="text"
                      value={aiConfig.model}
                      onChange={e => setAiConfig(prev => ({ ...prev, model: e.target.value }))}
                      placeholder="e.g. llama3, gpt-4o-mini"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 font-gujarati text-sm"
                    />
                  </div>
                )}

                {/* API Key */}
                {selectedProvider.requiresApiKey && (
                  <div>
                    <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1 flex items-center justify-between">
                      API Key
                      {selectedProvider.apiKeyUrl && (
                        <a href={selectedProvider.apiKeyUrl} target="_blank" rel="noreferrer" className="text-violet-500 hover:underline">
                          ← Key મળો
                        </a>
                      )}
                    </label>
                    <input
                      type="password"
                      value={aiConfig.apiKey || ''}
                      onChange={e => setAiConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="Paste your API key here..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 font-gujarati text-sm font-mono"
                    />
                  </div>
                )}

                {/* Base URL (Ollama / Custom) */}
                {(aiConfig.provider === 'ollama' || aiConfig.provider === 'custom') && (
                  <div>
                    <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">Base URL</label>
                    <input
                      type="text"
                      value={aiConfig.baseUrl || ''}
                      onChange={e => setAiConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                      placeholder={aiConfig.provider === 'ollama' ? 'http://localhost:11434' : 'https://your-api.com/v1'}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 font-gujarati text-sm font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Enable Toggle */}
              <div className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800">
                <div>
                  <p className="font-gujarati font-bold text-sm text-stone-800 dark:text-stone-200">AI Fallback ચાલુ/બંધ</p>
                  <p className="font-gujarati text-xs text-stone-400">Local DB માં ન મળ્યો તો AI ને call કરે</p>
                </div>
                <button
                  onClick={() => setAiConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className={`relative h-7 w-12 rounded-full transition-colors ${
                    aiConfig.enabled ? 'bg-emerald-500' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <span className={`absolute top-1 h-5 w-5 bg-white rounded-full shadow transition-all ${
                    aiConfig.enabled ? 'right-1' : 'left-1'
                  }`}></span>
                </button>
              </div>

              {/* Test + Save Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={async () => {
                    setAiTesting(true);
                    setAiTestResult(null);
                    const result = await testAIConnection(aiConfig);
                    setAiTestResult(result);
                    setAiTesting(false);
                  }}
                  disabled={aiTesting}
                  className="flex items-center gap-2 px-5 py-2.5 border-2 border-violet-500 text-violet-600 dark:text-violet-400 font-gujarati font-bold text-sm rounded-xl hover:bg-violet-50 dark:hover:bg-violet-950/20 transition active:scale-95 disabled:opacity-50"
                >
                  {aiTesting ? (
                    <><span className="animate-spin material-symbols-outlined text-sm">sync</span> ટેસ્ટ ચાલુ...</>
                  ) : (
                    <><span className="material-symbols-outlined text-sm">wifi</span> Connection ટેસ્ટ કરો</>
                  )}
                </button>

                <button
                  onClick={() => {
                    saveAIConfig(aiConfig);
                    setAiSaved(true);
                    setTimeout(() => setAiSaved(false), 3000);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-gujarati font-bold text-sm rounded-xl shadow-md shadow-violet-500/20 transition active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  {aiSaved ? '✅ સેવ થઈ ગયું!' : 'સેટિંગ સેવ કરો'}
                </button>
              </div>

              {/* Test Result */}
              {aiTestResult && (
                <div className={`p-4 rounded-2xl border font-gujarati text-sm ${
                  aiTestResult.success
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-emerald-700'
                    : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900 text-rose-700'
                }`}>
                  {aiTestResult.success ? (
                    <div>
                      <p className="font-bold">✅ Connection Successful! AI ready.</p>
                      <p className="text-xs mt-1 opacity-80">Response: {aiTestResult.response?.slice(0, 120)}...</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold">❌ Connection Failed</p>
                      <p className="text-xs mt-1 font-mono opacity-80">{aiTestResult.error}</p>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 p-4 rounded-2xl">
              <p className="font-headline font-bold text-sm text-emerald-700">⚡ Free Options</p>
              <p className="font-gujarati text-xs text-emerald-600 mt-1">Gemini Flash, Groq, OpenRouter free models — zero cost AI!</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 p-4 rounded-2xl">
              <p className="font-headline font-bold text-sm text-blue-700">🏠 Ollama (Local)</p>
              <p className="font-gujarati text-xs text-blue-600 mt-1">PC પર install કરો — 100% free, private, no internet needed!</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-4 rounded-2xl">
              <p className="font-headline font-bold text-sm text-amber-700">📚 Hybrid Mode</p>
              <p className="font-gujarati text-xs text-amber-600 mt-1">200+ DB answers = free. AI only for unknown questions = minimal cost!</p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
