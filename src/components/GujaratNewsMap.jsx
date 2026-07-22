import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 33 Districts of Gujarat with coordinates for schematic layout
const GUJARAT_DISTRICTS = [
  { id: 'kutch', name: 'કચ્છ', x: 22, y: 30, color: '#0D9488' },
  // North Gujarat
  { id: 'banaskantha', name: 'બનાસકાંઠા', x: 48, y: 15, color: '#0284C7' },
  { id: 'patan', name: 'પાટણ', x: 44, y: 24, color: '#0284C7' },
  { id: 'mehsana', name: 'મહેસાણા', x: 50, y: 29, color: '#0284C7' },
  { id: 'sabarkantha', name: 'સાબરકાંઠા', x: 60, y: 20, color: '#0284C7' },
  { id: 'aravalli', name: 'અરવલ્લી', x: 64, y: 27, color: '#0284C7' },
  { id: 'gandhinagar', name: 'ગાંધીનગર', x: 54, y: 35, color: '#0284C7' },
  // Saurashtra & Kutch
  { id: 'morbi', name: 'મોરબી', x: 34, y: 44, color: '#D97706' },
  { id: 'surendranagar', name: 'સુરેન્દ્રનગર', x: 45, y: 45, color: '#D97706' },
  { id: 'rajkot', name: 'રાજકોટ', x: 35, y: 55, color: '#D97706' },
  { id: 'jamnagar', name: 'જામનગર', x: 24, y: 50, color: '#D97706' },
  { id: 'dwarka', name: 'દેવભૂમિ દ્વારકા', x: 14, y: 52, color: '#D97706' },
  { id: 'porbandar', name: 'પોરબંદર', x: 17, y: 64, color: '#D97706' },
  { id: 'junagadh', name: 'જૂનાગઢ', x: 26, y: 70, color: '#D97706' },
  { id: 'somnath', name: 'ગીર સોમનાથ', x: 31, y: 80, color: '#D97706' },
  { id: 'amreli', name: 'અમરેલી', x: 42, y: 68, color: '#D97706' },
  { id: 'bhavnagar', name: 'ભાવનગર', x: 52, y: 64, color: '#D97706' },
  { id: 'botad', name: 'બોટાદ', x: 47, y: 56, color: '#D97706' },
  // Central Gujarat
  { id: 'ahmedabad', name: 'અમદાવાદ', x: 55, y: 44, color: '#4F46E5' },
  { id: 'kheda', name: 'ખેડા', x: 61, y: 42, color: '#4F46E5' },
  { id: 'anand', name: 'આણંદ', x: 63, y: 48, color: '#4F46E5' },
  { id: 'vadodara', name: 'વડોદરા', x: 69, y: 51, color: '#4F46E5' },
  { id: 'panchmahal', name: 'પંચમહાલ', x: 71, y: 39, color: '#4F46E5' },
  { id: 'dahod', name: 'દાહોદ', x: 80, y: 37, color: '#4F46E5' },
  { id: 'mahisagar', name: 'મહીસાગર', x: 69, y: 32, color: '#4F46E5' },
  { id: 'chhotaudepur', name: 'છોટાઉદેપુર', x: 77, y: 53, color: '#4F46E5' },
  // South Gujarat
  { id: 'bharuch', name: 'ભરૂચ', x: 65, y: 61, color: '#DB2777' },
  { id: 'narmada', name: 'નર્મદા', x: 73, y: 63, color: '#DB2777' },
  { id: 'surat', name: 'સુરત', x: 67, y: 72, color: '#DB2777' },
  { id: 'tapi', name: 'તાપી', x: 75, y: 74, color: '#DB2777' },
  { id: 'navsari', name: 'નવસારી', x: 68, y: 81, color: '#DB2777' },
  { id: 'dang', name: 'ડાંગ', x: 76, y: 83, color: '#DB2777' },
  { id: 'valsad', name: 'વલસાડ', x: 67, y: 89, color: '#DB2777' }
];

// Talukas and Towns associated with parents, visible upon zoomLevel > 1.3
const GUJARAT_TOWNS = [
  // Dwarka
  { id: 'khambhaliya', parentId: 'dwarka', name: 'ખંભાળિયા', x: 17, y: 56 },
  { id: 'okha', parentId: 'dwarka', name: 'ઓખા', x: 10, y: 48 },
  // Ahmedabad
  { id: 'viramgam', parentId: 'ahmedabad', name: 'વિરમગામ', x: 51, y: 39 },
  { id: 'dholka', parentId: 'ahmedabad', name: 'ધોળકા', x: 58, y: 47 },
  // Kutch
  { id: 'bhuj', parentId: 'kutch', name: 'ભુજ', x: 18, y: 27 },
  { id: 'anjar', parentId: 'kutch', name: 'અંજાર', x: 26, y: 28 },
  { id: 'mundra', parentId: 'kutch', name: 'મુન્દ્રા', x: 23, y: 35 },
  // Morbi
  { id: 'halvad', parentId: 'morbi', name: 'હળવદ', x: 39, y: 41 },
  { id: 'wankaner', parentId: 'morbi', name: 'વાંકાનેર', x: 36, y: 47 },
  // Surat
  { id: 'bardoli', parentId: 'surat', name: 'બારડોલી', x: 72, y: 73 },
  // Vadodara
  { id: 'dabhoi', parentId: 'vadodara', name: 'ડભોઈ', x: 72, y: 53 },
  // Rajkot
  { id: 'gondal', parentId: 'rajkot', name: 'ગોંડલ', x: 37, y: 60 },
  { id: 'jetpur', parentId: 'rajkot', name: 'જેતપુર', x: 34, y: 64 }
];

// News Categories (Politics, Local/City, Health, Crime, Weather, Business)
const CATEGORIES = [
  { id: 'all', name: 'બધા સમાચાર' },
  { id: 'politics', name: 'રાજકારણ' },
  { id: 'local', name: 'સ્થાનિક' },
  { id: 'health', name: 'સ્વાસ્થ્ય' },
  { id: 'crime', name: 'ગુનાખોરી' },
  { id: 'weather', name: 'હવામાન' },
  { id: 'business', name: 'વ્યવસાય' }
];

// Mock news database matching categories, districts, towns, and minutes ago
const MOCK_NEWS = [
  // Morbi & Halvad
  { 
    id: 1, 
    district: 'morbi', 
    source: 'દિવ્ય ભાસ્કર', 
    logo: '🔥', 
    title: 'મોરબી ખેડૂત આંદોલન: નેહલ અમૃતિયા અને ગુરનામ ચઢૂનીનો કાર્યક્રમ રદ', 
    desc: 'મોરબીના જેતપર રોડ પર ખેડૂતોના વીજપોલ વિરોધ પ્રદર્શન અંગે આંદોલનકારીઓની સભા અનિવાર્ય સંજોગોસર રદ કરવામાં આવી છે.', 
    category: 'local', 
    minutesAgo: 12, 
    link: 'https://www.divyabhaskar.co.in/local/gujarat/morbi/news/morbi-farmer-protest-nehul-amrutiya-gurman-chadhuni-program-cancelled-138357420.html' 
  },
  { 
    id: 2, 
    district: 'morbi', 
    source: 'સંદેશ સમાચાર', 
    logo: '📰', 
    title: 'હળવદના રાણેકપર ગામમાં મંદિર નજીક વાડ બનાવવા મુદ્દે બે જૂથો વચ્ચે ધમાલ', 
    desc: 'ધાર્મિક સ્થળ નજીક તારની વાડ ઉભી કરવા બાબતે હિંસક ઝપાઝપી થતા પોલીસે બંને પક્ષે સામસામી ફરિયાદ નોંધી વધુ તપાસ હાથ ધરી છે.', 
    category: 'crime', 
    minutesAgo: 45, 
    link: 'https://sandesh.com/gujarat/news/maru-saher-maru-gaam/ahmedabad/read-important-news-from-08-am-to-12-pm-04-july-2026' 
  },
  
  // Dwarka & Okha / Khambhaliya
  { 
    id: 3, 
    district: 'dwarka', 
    town: 'okha', 
    source: 'દિવ્ય ભાસ્કર', 
    logo: '🔥', 
    title: 'ઓખા પોર્ટ પર ૩ નંબરનું સિગ્નલ લાગુ: માછીમારોને એલર્ટ', 
    desc: 'અરબી સમુદ્રમાં સર્જાયેલા ડિપ્રેશનને કારણે ૬૦ કિમી પ્રતિ કલાકની ઝડપે ભારે પવન ફૂંકાવાની આગાહીને પગલે ઓખા બંદરે ચેતવણી સિગ્નલ લગાવાયું છે.', 
    category: 'weather', 
    minutesAgo: 28, 
    link: 'https://www.divyabhaskar.co.in/local/gujarat/dwarka/news/okha-port-3-signal-60kmph-wind-fishermen-alert-138357332.html' 
  },
  { 
    id: 4, 
    district: 'dwarka', 
    town: 'khambhaliya', 
    source: 'દિવ્ય ભાસ્કર', 
    logo: '🔥', 
    title: 'દ્વારકાના દરિયાકાંઠાના વિસ્તારોમાં સુરક્ષા વ્યવસ્થા સજ્જ કરાઈ', 
    desc: 'મોન્સૂન સીઝનને લઈને યાત્રાધામ દ્વારકા અને ઓખા કોસ્ટલ બેલ્ટ પર મરીન પોલીસ અને કોસ્ટગાર્ડની ટીમો તૈનાત કરવામાં આવી છે.', 
    category: 'local', 
    minutesAgo: 180, 
    link: 'https://www.divyabhaskar.co.in/local/gujarat/dwarka/news/security-arrangements-have-been-tightened-along-the-coast-dbp-138354290.html' 
  },
  
  // Ahmedabad & Viramgam / Dholka
  { 
    id: 5, 
    district: 'ahmedabad', 
    town: 'viramgam', 
    source: 'સંદેશ સમાચાર', 
    logo: '📰', 
    title: 'અમદાવાદમાં ગેરકાયદે હુક્કાબાર પર ત્રાટકી પોલીસ, કાફેમાં નશીલી ફ્લેવર જપ્ત', 
    desc: 'હુક્કાબાર પર ત્રાટકી પોલીસ, છારોડીના કાફેમાં નશીલી ફ્લેવરનું વેચાણ ઝડપાયું, સંચાલક અને મેનેજર સામે ગુનો દાખલ.', 
    category: 'crime', 
    minutesAgo: 15, 
    link: 'https://sandesh.com/gujarat/news/ahmedabad/ahmedabad-chharodi-elysium-cafe-illegal-hookah-bar-raid-sola-police-action' 
  },
  { 
    id: 6, 
    district: 'ahmedabad', 
    town: 'dholka', 
    source: 'દિવ્ય ભાસ્કર', 
    logo: '🔥', 
    title: 'અમદાવાદમાં મુશળધાર વરસાદ: સુભાષ બ્રિજ અને માધુપુરા અંડરપાસમાં ભરાયા પાણી', 
    desc: 'શહેરમાં બે કલાકમાં દોઢ ઇંચ વરસાદ ખાબકતા નીચાણવાળા વિસ્તારો જળબંબાકાર થયા છે. વાહનચાલકોને ભારે હાલાકીનો સામનો કરવો પડી રહ્યો છે.', 
    category: 'weather', 
    minutesAgo: 24, 
    link: 'https://www.divyabhaskar.co.in/local/gujarat/ahmedabad/news/ahmedabad-rain-subhash-bridge-madhupura-shahibaug-138357344.html' 
  },
  
  // Kutch & Mundra / Bhuj
  { 
    id: 7, 
    district: 'kutch', 
    town: 'mundra', 
    source: 'સંદેશ સમાચાર', 
    logo: '📰', 
    title: 'એલ નીનો: ગુજરાતના ૨૩ સહિત ૩૧૫ જિલ્લાઓ સંવેદનશીલ જાહેર', 
    desc: 'અલનીનોની અસર સામે લડવા કેન્દ્ર સરકાર સજ્જ. હવામાન અને પાકના રક્ષણ માટે આગોતરા પગલાં લેવામાં આવશે.', 
    category: 'weather', 
    minutesAgo: 35, 
    link: 'https://sandesh.com/gujarat/news/el-nino-315-districts-including-23-in-gujarat-declared-vulnerable-centres-preparations-against-el-nino' 
  },
  { 
    id: 8, 
    district: 'kutch', 
    town: 'bhuj', 
    source: 'દિવ્ય ભાસ્કર', 
    logo: '🔥', 
    title: 'સાણંદમાં દેશનો ત્રીજો સેમિકન્ડક્ટર પ્લાન્ટ સ્થાપવા પાયો નંખાયો', 
    desc: 'કેન્દ્રીય મંત્રી અશ્વિની વૈષ્ણવની અમદાવાદ મુલાકાત દરમિયાન સાણંદ ખાતે નવા સેમિકન્ડક્ટર એસેમ્બલી અને ટેસ્ટિંગ પ્લાન્ટને મંજૂરી આપવામાં આવી છે.', 
    category: 'business', 
    minutesAgo: 720, 
    link: 'https://www.divyabhaskar.co.in/local/gujarat/ahmedabad/news/sanand-cg-semi-osat-plant-chip-launch-modi-138353317.html' 
  },
  
  // Surat & Bardoli
  { 
    id: 9, 
    district: 'surat', 
    town: 'bardoli', 
    source: 'સંદેશ સમાચાર', 
    logo: '📰', 
    title: 'સુરતની કિમ નદીમાં ઘોડાપૂર: માંગરોળ બ્રિજ સુધી પાણી પહોંચ્યા', 
    desc: 'ઉપરવાસમાં પડેલા ભારે વરસાદથી સુરતની કિમ નદી બે કાંઠે વહી રહી છે. માંગરોળ અને મોટા બોરસરા બ્રિજ પાસે તંત્ર એલર્ટ મોડ પર મુકાયું છે.', 
    category: 'weather', 
    minutesAgo: 900, 
    link: 'https://sandesh.com/weather/news/gujarat/surat/monsoon-2026-surat-kim-river-flooded-mangrol-mota-borsara-bridge-water-level-rise' 
  },
  
  // Rajkot & Gondal
  { 
    id: 10, 
    district: 'rajkot', 
    town: 'gondal', 
    source: 'સંદેશ સમાચાર', 
    logo: '📰', 
    title: 'રાજકોટ: વોર્ડ ૧૮ના કોઠારીયા અને વિરાણી અઘાટમાં દોઢ ઇંચ વરસાદમાં રોડ તૂટ્યા', 
    desc: 'કોઠારીયા રોડ પર ભારે પાણી ભરાવાથી રસ્તાઓ ધોવાયા છે. વાહનચાલકો માટે અકસ્માતનું જોખમ વધતાં સ્થાનિકોમાં રોષ.', 
    category: 'local', 
    minutesAgo: 45, 
    link: 'https://sandesh.com/gujarat/news/rajkot/heavy-rain-road-damaged-virani-aghat-ward-18-kothariya-sub-water-system-line-issues' 
  },
  
  // Gandhinagar
  { 
    id: 11, 
    district: 'gandhinagar', 
    source: 'દિવ્ય ભાસ્કર', 
    logo: '🔥', 
    title: 'ગુજરાત સેમિકન્ડક્ટર હબ બનશે: ૧.૨૪ લાખ કરોડના રોકાણથી ૫૦,૦૦૦ નોકરીઓ', 
    desc: 'ગાંધીનગર મહાત્મા મંદિર ખાતે સેમિકન્ડક્ટર પોલીસી હેઠળ મોટા રોકાણને મંજૂરી. વૈશ્વિક સેમિકન્ડક્ટર કંપનીઓ ગુજરાતમાં ઇન્ફ્રાસ્ટ્રક્ચર સ્થાપશે.', 
    category: 'business', 
    minutesAgo: 25, 
    link: 'https://www.divyabhaskar.co.in/local/gujarat/gandhinagar/news/gujarat-semiconductor-hub-124-lakh-crore-projects-50k-jobs-138357971.html' 
  }
];

export default function GujaratNewsMap() {
    const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedTown, setSelectedTown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Load live news dynamically from VPS JSON feed
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/news_api.php');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        // Calculate minutesAgo dynamically relative to client current time
        const updated = data.map(item => {
          if (item.published_at) {
            const pubTime = new Date(item.published_at).getTime();
            const nowTime = new Date().getTime();
            const diffMin = Math.max(1, Math.floor((nowTime - pubTime) / 60000));
            return { ...item, minutesAgo: diffMin };
          }
          return item;
        });
        
        // Sort: newest first
        updated.sort((a, b) => a.minutesAgo - b.minutesAgo);
        setNewsList(updated);
      } catch (err) {
        console.warn("Using fallback seed news:", err);
        // Fallback to MOCK_NEWS but with calculated current relative times
        const nowTime = new Date().getTime();
        const updatedMock = MOCK_NEWS.map(item => {
          // Give them some variety in minutesAgo if they don't have published_at
          return { ...item };
        });
        setNewsList(updatedMock);
      }
    };

    fetchNews();
    // Auto-refresh news list every 30 seconds for live feeling!
    const interval = setInterval(fetchNews, 30000);
    return () => clearInterval(interval);
  }, []);

  // Zoom & Drag State
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Pinch-to-zoom states
  const [startPinchDist, setStartPinchDist] = useState(0);
  const [startZoom, setStartZoom] = useState(1);

  const mapContainerRef = useRef(null);

  // Mouse / Touch Drag Handlers
  const handleStartDrag = (clientX, clientY) => {
    setIsDragging(true);
    setDragStart({ x: clientX - panOffset.x, y: clientY - panOffset.y });
  };

  const handleDrag = (clientX, clientY) => {
    if (!isDragging) return;
    const maxPan = zoomLevel * 180;
    const nextX = Math.min(maxPan, Math.max(-maxPan, clientX - dragStart.x));
    const nextY = Math.min(maxPan, Math.max(-maxPan, clientY - dragStart.y));
    setPanOffset({ x: nextX, y: nextY });
  };

  const handleStopDrag = () => {
    setIsDragging(false);
  };

  // Pinch Zoom Handlers
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setStartPinchDist(dist);
      setStartZoom(zoomLevel);
    } else if (e.touches.length === 1) {
      handleStartDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && startPinchDist > 0) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / startPinchDist;
      setZoomLevel(Math.min(4, Math.max(1, startZoom * factor)));
    } else if (e.touches.length === 1) {
      handleDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    setStartPinchDist(0);
    handleStopDrag();
  };

  // Zoom Button Controls
  const zoomIn = () => setZoomLevel(prev => Math.min(4, prev + 0.5));
  const zoomOut = () => {
    setZoomLevel(prev => {
      const nextZoom = Math.max(1, prev - 0.5);
      if (nextZoom === 1) setPanOffset({ x: 0, y: 0 }); // reset pan
      return nextZoom;
    });
  };

  // Determine if a news item was published within the last 3 hours
  const isRecentNews = (newsItem) => {
    return newsItem.minutesAgo !== undefined && newsItem.minutesAgo <= 180;
  };

  // Filter towns/talukas based on zoomLevel > 1.3
  const activeTowns = useMemo(() => {
    if (zoomLevel <= 1.3) return [];
    if (selectedDistrict) {
      return GUJARAT_TOWNS.filter(t => t.parentId === selectedDistrict.id);
    }
    return GUJARAT_TOWNS;
  }, [zoomLevel, selectedDistrict]);

  // Suggestions for search
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    
    const matchedDistricts = GUJARAT_DISTRICTS.filter(d => 
      d.name.includes(q) || d.id.includes(q)
    );
    const matchedTowns = GUJARAT_TOWNS.filter(t => 
      t.name.includes(q) || t.id.includes(q)
    );
    
    return [...matchedDistricts, ...matchedTowns].slice(0, 5);
  }, [searchQuery]);

  // Unified filter logic (Last 24 Hours, Category, District, Town)
  const filteredNews = useMemo(() => {
    // Only news from last 24 hours (24 * 60 = 1440 minutes)
    let result = newsList.filter(n => n.minutesAgo <= 1440);

    // Apply category filter
    if (activeCategory !== 'all') {
      result = result.filter(n => n.category === activeCategory);
    }

    // Apply location filter (District or Town)
    if (selectedTown) {
      result = result.filter(n => n.town === selectedTown.id);
    } else if (selectedDistrict) {
      result = result.filter(n => n.district === selectedDistrict.id);
    } else if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(n => 
        n.title.toLowerCase().includes(q) || 
        n.desc.toLowerCase().includes(q) ||
        n.district.toLowerCase().includes(q) ||
        GUJARAT_DISTRICTS.find(d => d.id === n.district)?.name.includes(q) ||
        GUJARAT_TOWNS.find(t => t.id === n.town)?.name.includes(q)
      );
    }

    return result;
  }, [selectedDistrict, selectedTown, activeCategory, searchQuery]);

  const handleSelectDistrict = (dist) => {
    setSelectedTown(null); // Clear town selection
    if (selectedDistrict?.id === dist.id) {
      setSelectedDistrict(null);
    } else {
      setSelectedDistrict(dist);
      setSearchQuery('');
      // Auto zoom-in to focus on district if not zoomed
      if (zoomLevel === 1) {
        setZoomLevel(2.0);
        // Calculate offset to center the clicked district
        const centerX = (50 - dist.x) * 4;
        const centerY = (35 - dist.y) * 4;
        setPanOffset({ x: centerX, y: centerY });
      }
    }
  };

  const handleSelectTown = (town) => {
    if (selectedTown?.id === town.id) {
      setSelectedTown(null);
    } else {
      setSelectedTown(town);
      setSelectedDistrict(GUJARAT_DISTRICTS.find(d => d.id === town.parentId));
      setSearchQuery('');
    }
  };

  const handleSuggestionClick = (item) => {
    setSearchQuery('');
    if (item.parentId) {
      handleSelectTown(item);
    } else {
      handleSelectDistrict(item);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in relative min-h-screen px-4 pt-4 text-on-surface">
      {/* Background Dots Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#0D9488_1px,transparent_1px)] dark:bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none rounded-[3rem] z-0"></div>

      {/* Header block */}
      <div className="relative z-10 flex items-center justify-between">
        <button 
          onClick={() => navigate('/tools')}
          className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-850 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 px-4 py-2.5 rounded-2xl font-gujarati font-black text-xs active:scale-95 transition-all shadow-sm border border-stone-200 dark:border-stone-850"
        >
          <span className="material-symbols-outlined text-sm font-bold">arrow_back</span>
          સાધનો મેનુ
        </button>
        <h2 className="font-gujarati font-black text-xl text-teal-700 dark:text-teal-400">જીપીએસ સમાચાર નકશો 🗺️</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* LEFT COLUMN: Map & Search (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-surface p-5 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-6 flex flex-col justify-between">
          
          {/* Search bar & dropdown */}
          <div className="relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="જિલ્લો કે તાલુકો શોધો... (દા.ત. હળવદ, જામખંભાળિયા, મુન્દ્રા)"
              className="w-full bg-[#F4F4F0] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-12 py-3.5 font-gujarati text-xs focus:outline-none focus:border-teal-600 text-on-surface"
            />
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-lg">search</span>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}

            {/* Suggestions Dropdown */}
            {filteredSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl z-20 overflow-hidden">
                {filteredSuggestions.map(item => (
                  <button 
                    key={item.id}
                    onClick={() => handleSuggestionClick(item)}
                    className="w-full text-left px-4 py-3 hover:bg-stone-50 dark:hover:bg-stone-850 font-gujarati text-xs text-stone-700 dark:text-stone-300 flex items-center gap-2 border-b border-stone-100 dark:border-stone-800/30 last:border-b-0"
                  >
                    <span className="material-symbols-outlined text-xs text-teal-600">location_on</span>
                    {item.name} {item.parentId ? '(તાલુકો)' : '(જિલ્લો)'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Zoomable Map Canvas */}
          <div 
            ref={mapContainerRef}
            className="relative border border-teal-500/10 bg-[#F8FAFC] dark:bg-stone-900/50 rounded-3xl p-4 flex flex-col justify-center min-h-[420px] overflow-hidden select-none"
            onMouseDown={(e) => handleStartDrag(e.clientX, e.clientY)}
            onMouseMove={(e) => handleDrag(e.clientX, e.clientY)}
            onMouseUp={handleStopDrag}
            onMouseLeave={handleStopDrag}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Map Header Indicators */}
            <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
              <span className="font-gujarati text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                નકશો {zoomLevel > 1.3 ? '(તાલુકા મોડ • Zoomed)' : '(જિલ્લા મોડ)'}
              </span>
              <div className="flex gap-2 items-center mt-1">
                <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse"></span>
                <span className="font-gujarati text-[9px] text-stone-500 font-bold">છેલ્લા ૩ કલાકના લાઈવ ન્યૂઝ</span>
              </div>
            </div>

            {/* Clear All Map Filter Reset */}
            {(selectedDistrict || selectedTown || zoomLevel > 1) && (
              <button 
                onClick={() => {
                  setSelectedDistrict(null);
                  setSelectedTown(null);
                  setZoomLevel(1);
                  setPanOffset({ x: 0, y: 0 });
                }}
                className="absolute top-4 right-4 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400 px-3 py-1.5 rounded-full font-gujarati text-[10px] font-black flex items-center gap-1 border border-teal-600/20 active:scale-95 transition-all z-10"
              >
                <span className="material-symbols-outlined text-xs">refresh</span>
                રીસેટ વ્યૂ
              </button>
            )}

            {/* Zoom (+ / -) Control Buttons - Google Map Position (Bottom Right) */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
              <button 
                onClick={(e) => { e.stopPropagation(); zoomIn(); }}
                className="h-10 w-10 bg-white dark:bg-stone-850 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl shadow-md border border-stone-200 dark:border-stone-800 flex items-center justify-center font-black active:scale-90 transition-transform cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg font-bold">add</span>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); zoomOut(); }}
                className="h-10 w-10 bg-white dark:bg-stone-850 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl shadow-md border border-stone-200 dark:border-stone-800 flex items-center justify-center font-black active:scale-90 transition-transform cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg font-bold">remove</span>
              </button>
            </div>

            {/* Scale & Transformable Map Body */}
            <div 
              className="relative w-full aspect-[4/3] max-w-lg mx-auto"
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
            >
              {/* background map - Scales based on zoomLevel */}
              <div 
                className="absolute inset-0 transition-transform duration-200 ease-out"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center center'
                }}
              >
                {/* Stylized region borders & connecting vector lines of Gujarat */}
                <svg className="w-full h-full opacity-35" viewBox="0 0 100 100">
                  {/* region boundaries / low poly segments */}
                  {/* Kutch region border path */}
                  <polygon points="5,28 35,25 38,40 25,45 5,35" fill="rgba(13, 148, 136, 0.05)" stroke="#0D9488" strokeWidth="0.8" strokeDasharray="1,1" />
                  {/* Saurashtra region border path */}
                  <polygon points="25,45 38,40 48,46 56,44 54,66 44,70 34,82 28,72 18,66 15,54" fill="rgba(217, 119, 6, 0.05)" stroke="#D97706" strokeWidth="0.8" strokeDasharray="1,1" />
                  {/* North region border path */}
                  <polygon points="35,25 48,15 62,20 65,28 55,35 38,32" fill="rgba(2, 132, 199, 0.05)" stroke="#0284C7" strokeWidth="0.8" strokeDasharray="1,1" />
                  {/* Central region border path */}
                  <polygon points="55,35 65,28 72,40 82,38 79,54 70,52 56,44" fill="rgba(79, 70, 229, 0.05)" stroke="#4F46E5" strokeWidth="0.8" strokeDasharray="1,1" />
                  {/* South region border path */}
                  <polygon points="70,52 79,54 74,64 76,75 77,84 68,90 69,82 66,62" fill="rgba(219, 39, 119, 0.05)" stroke="#DB2777" strokeWidth="0.8" strokeDasharray="1,1" />

                  {/* Wire networks */}
                  <line x1="22" y1="30" x2="34" y2="44" stroke="#888888" strokeWidth="0.3" />
                  <line x1="34" y1="44" x2="35" y2="55" stroke="#888888" strokeWidth="0.3" />
                  <line x1="34" y1="44" x2="45" y2="45" stroke="#888888" strokeWidth="0.3" />
                  <line x1="45" y1="45" x2="55" y2="44" stroke="#888888" strokeWidth="0.3" />
                  <line x1="55" y1="44" x2="54" y2="35" stroke="#888888" strokeWidth="0.3" />
                  <line x1="54" y1="35" x2="50" y2="29" stroke="#888888" strokeWidth="0.3" />
                  <line x1="55" y1="44" x2="61" y2="42" stroke="#888888" strokeWidth="0.3" />
                  <line x1="61" y1="42" x2="69" y2="51" stroke="#888888" strokeWidth="0.3" />

                  {/* sub-town wire links when zoomed */}
                  {zoomLevel > 1.3 && activeTowns.map((town, idx) => {
                    const parentDist = GUJARAT_DISTRICTS.find(d => d.id === town.parentId);
                    if (!parentDist) return null;
                    return (
                      <line 
                        key={`wire-${town.id}-${idx}`}
                        x1={parentDist.x} y1={parentDist.y} 
                        x2={town.x} y2={town.y} 
                        stroke="#aaaaaa" 
                        strokeWidth="0.25" 
                        strokeDasharray="1,1" 
                      />
                    );
                  })}
                </svg>
              </div>

              {/* RENDER DISTRICTS - Coordinates calculated with zoomLevel multiplication but nodes scale stays exactly scale(1.0) */}
              {GUJARAT_DISTRICTS.map((dist) => {
                const isActive = selectedDistrict?.id === dist.id && !selectedTown;
                const distNews = newsList.filter(n => n.district === dist.id);
                const hasNews = distNews.length > 0;
                const hasRecent = distNews.some(n => isRecentNews(n));

                // Position calculation shifted based on zoomLevel center scale
                // Map center is 50%, 35%
                const mapCenterX = 50;
                const mapCenterY = 35;
                const finalX = mapCenterX + (dist.x - mapCenterX) * zoomLevel;
                const finalY = mapCenterY + (dist.y - mapCenterY) * zoomLevel;

                return (
                  <button
                    key={dist.id}
                    onClick={(e) => { e.stopPropagation(); handleSelectDistrict(dist); }}
                    className="absolute group active:scale-95 transition-all duration-300"
                    style={{ 
                      left: `${finalX}%`, 
                      top: `${finalY}%`,
                      transform: 'translate(-50%, -50%)', // NO ZOOM SCALE applied to circles!
                      zIndex: isActive ? 20 : 10 
                    }}
                    title={dist.name}
                  >
                    {/* Glowing pulse rings */}
                    {hasRecent && (
                      <span className="absolute -inset-3 rounded-full bg-rose-500/40 dark:bg-rose-500/25 animate-ping opacity-90 pointer-events-none"></span>
                    )}
                    {hasNews && !hasRecent && (
                      <span className="absolute -inset-2.5 rounded-full bg-amber-500/35 dark:bg-amber-400/20 animate-pulse pointer-events-none"></span>
                    )}

                    {/* District circular node */}
                    <div 
                      className={`h-7 w-7 rounded-full flex items-center justify-center font-gujarati text-[9px] font-black text-white shadow-md border-2 transition-all duration-300 ${
                        isActive 
                          ? 'bg-[#BE123C] border-white scale-110 ring-4 ring-[#BE123C]/20' 
                          : hasRecent 
                            ? 'bg-rose-600 border-rose-300 scale-105'
                            : 'bg-[#2D3748] border-teal-500/40 hover:bg-[#0D9488]/80'
                      }`}
                    >
                      {dist.name.substring(0, 2)}
                    </div>

                    {/* Popover tooltip - constant scale */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-stone-900 text-white text-[9px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-25 border border-stone-800">
                      {dist.name} {hasRecent ? '• લાઈવ સમાચાર 🔴' : hasNews ? '• ૨૪ કલાકના સમાચાર' : ''}
                    </div>
                  </button>
                );
              })}

              {/* RENDER TOWNS / TALUKAS (Only when zoomLevel > 1.3) */}
              {zoomLevel > 1.3 && activeTowns.map((town) => {
                const isActive = selectedTown?.id === town.id;
                const townNews = newsList.filter(n => n.town === town.id);
                const hasNews = townNews.length > 0;
                const hasRecent = townNews.some(n => isRecentNews(n));

                const mapCenterX = 50;
                const mapCenterY = 35;
                const finalX = mapCenterX + (town.x - mapCenterX) * zoomLevel;
                const finalY = mapCenterY + (town.y - mapCenterY) * zoomLevel;

                return (
                  <button
                    key={town.id}
                    onClick={(e) => { e.stopPropagation(); handleSelectTown(town); }}
                    className="absolute group active:scale-95 transition-all duration-300"
                    style={{ 
                      left: `${finalX}%`, 
                      top: `${finalY}%`,
                      transform: 'translate(-50%, -50%)', // constant size
                      zIndex: isActive ? 21 : 15 
                    }}
                    title={town.name}
                  >
                    {/* Glowing pulse rings for town */}
                    {hasRecent && (
                      <span className="absolute -inset-2 rounded-full bg-rose-500/50 animate-ping opacity-90 pointer-events-none"></span>
                    )}

                    {/* Small rounded tag for town */}
                    <div 
                      className={`h-5 w-5 rounded-lg flex items-center justify-center font-gujarati text-[7px] font-black text-white shadow-sm border transition-all duration-300 ${
                        isActive 
                          ? 'bg-rose-500 border-white scale-110 z-20 shadow-md' 
                          : hasRecent
                            ? 'bg-rose-600 border-rose-300'
                            : hasNews 
                              ? 'bg-amber-600 border-amber-300'
                              : 'bg-stone-500 border-stone-400 hover:bg-stone-600'
                      }`}
                    >
                      {town.name.substring(0, 2)}
                    </div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-stone-900 text-white text-[9px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-25 border border-stone-800">
                      {town.name} {hasRecent ? '(તાલુકો • લાઈવ 🔴)' : '(તાલુકો)'}
                    </div>
                  </button>
                );
              })}

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: News Feed with Category Filter (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="bg-white dark:bg-dark-surface p-6 rounded-[2.5rem] border border-primary/5 shadow-sm flex-1 flex flex-col min-h-[440px]">
            
            {/* Header info */}
            <div className="border-b border-stone-100 dark:border-stone-850 pb-3 mb-3">
              <h3 className="font-gujarati font-black text-lg text-on-surface">
                {selectedTown 
                  ? `${selectedTown.name} તાલુકો 🏢` 
                  : selectedDistrict 
                    ? `${selectedDistrict.name} જિલ્લો 🏢` 
                    : 'તાજા સમાચાર (૨૪ કલાક)'
                }
              </h3>
              <p className="font-gujarati text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-1">
                {selectedTown 
                  ? `${selectedTown.name} ના છેલ્લી ૨૪ કલાકના સમાચાર`
                  : selectedDistrict 
                    ? `${selectedDistrict.name} ના સમાચાર ફિલ્ટર કરેલા છે`
                    : 'ગુજરાતના જુદા જુદા શહેરોમાંથી અપડેટ્સ'
                }
              </p>
            </div>

            {/* News Categories Filters Horizontal Scrolling list */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-none">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full font-gujarati text-[10px] font-black shrink-0 active:scale-95 transition-all border ${
                    activeCategory === cat.id
                      ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                      : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* News Feed scroll area */}
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[450px] pr-1">
              {filteredNews.map((news) => {
                const recent = isRecentNews(news);
                return (
                  <a 
                    key={news.id}
                    href={news.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block p-4 rounded-2.5xl border transition-all duration-300 group hover:shadow-xs active:scale-98 text-left ${
                      recent 
                        ? 'bg-rose-50/50 hover:bg-rose-50 dark:bg-rose-950/10 dark:hover:bg-rose-950/20 border-rose-200/60 dark:border-rose-900/40' 
                        : 'bg-stone-50 hover:bg-stone-100/80 dark:bg-stone-900/30 dark:hover:bg-stone-900/70 border-stone-200/50 dark:border-stone-800/40'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="bg-[#2D3748] text-white dark:bg-stone-800 dark:text-stone-300 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg flex items-center gap-1 border border-[#0D9488]/30">
                        <span>{news.logo}</span>
                        <span>{news.source}</span>
                      </span>
                      
                      {/* Live Badge for last 3 hours */}
                      {recent ? (
                        <span className="bg-rose-600 text-white text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                          લગભગ તાજી 🔴
                        </span>
                      ) : (
                        <span className="text-[9px] text-stone-400 font-bold">
                          {news.minutesAgo >= 60 
                            ? `${toGujaratiDigits(Math.floor(news.minutesAgo / 60))} કલાક પહેલાં` 
                            : `${toGujaratiDigits(news.minutesAgo)} મિનિટ પહેલાં`
                          }
                        </span>
                      )}
                    </div>
                    
                    <h4 className="font-gujarati font-black text-xs text-stone-850 dark:text-stone-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 leading-snug">
                      {news.title}
                    </h4>
                    
                    <p className="font-gujarati text-[10px] text-stone-500 dark:text-stone-400 leading-relaxed mt-1.5 line-clamp-2">
                      {news.desc}
                    </p>
                    
                    <span className="text-[9px] text-teal-600 dark:text-teal-400 font-black flex items-center gap-0.5 mt-2 hover:underline">
                      મૂળ આર્ટિકલ વાંચો <span className="material-symbols-outlined text-[10px] font-black">arrow_forward</span>
                    </span>
                  </a>
                );
              })}

              {filteredNews.length === 0 && (
                <div className="text-center py-20 space-y-3">
                  <span className="material-symbols-outlined text-4xl text-stone-350">feed</span>
                  <p className="font-gujarati text-xs text-stone-400">આ કેટેગરી કે સ્થાન માટે હાલ કોઈ તાજા સમાચાર મળ્યા નથી.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Helper to convert numbers to Gujarati digits
function toGujaratiDigits(num) {
  const gujaratiNums = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];
  return num.toString().split('').map(digit => {
    return gujaratiNums[parseInt(digit)] || digit;
  }).join('');
}
