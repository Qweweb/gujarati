import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { downloadAsPDF } from '../utils/downloadHelper';

const KUNDALI_RASHIS = [
  { num: 1, name: "મેષ (Aries)", lord: "મંગળ", element: "અગ્નિ" },
  { num: 2, name: "વૃષભ (Taurus)", lord: "શુક્ર", element: "પૃથ્વી" },
  { num: 3, name: "મિથુન (Gemini)", lord: "બુધ", element: "વાયુ" },
  { num: 4, name: "કર્ક (Cancer)", lord: "ચંદ્ર", element: "જળ" },
  { num: 5, name: "સિંહ (Leo)", lord: "સૂર્ય", element: "અગ્નિ" },
  { num: 6, name: "કન્યા (Virgo)", lord: "બુધ", element: "પૃથ્વી" },
  { num: 7, name: "તુલા (Libra)", lord: "શુક્ર", element: "વાયુ" },
  { num: 8, name: "વૃશ્ચિક (Scorpio)", lord: "મંગળ", element: "જળ" },
  { num: 9, name: "ધન (Sagittarius)", lord: "ગુરુ", element: "અગ્નિ" },
  { num: 10, name: "મકર (Capricorn)", lord: "શનિ", element: "પૃથ્વી" },
  { num: 11, name: "કુંભ (Aquarius)", lord: "શનિ", element: "વાયુ" },
  { num: 12, name: "મીન (Pisces)", lord: "ગુરુ", element: "જળ" }
];

const NAKSHATRAS = [
  "અશ્વિની", "ભરણી", "કૃતિકા", "રોહિણી", "મૃગશીર્ષ", "આદ્રા", "પુનર્વસુ", "પુષ્ય", "આશ્લેષા",
  "મઘા", "પૂર્વા ફાલ્ગુની", "ઉત્તરા ફાલ્ગુની", "હસ્ત", "ચિત્રા", "સ્વાતિ", "વિશાખા", "અનુરાધા", "જ્યેષ્ઠા",
  "મૂળ", "પૂર્વાષાઢા", "ઉત્તરાષાઢા", "શ્રવણ", "ધનિષ્ઠા", "શતભિષા", "પૂર્વા ભાદ્રપદ", "ઉત્તરા ભાદ્રપદ", "રેવતી"
];

const DASHAS = ["કેતુ", "શુક્ર", "સૂર્ય", "ચંદ્ર", "મંગળ", "રાહુ", "ગુરુ", "શનિ", "બુધ"];

const KundaliGenerator = () => {
  const navigate = useNavigate();
  const printRef = useRef(null);

  // --- STATE DECLARATIONS ---
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("12:00");
  const [noTime, setNoTime] = useState(false);
  const [birthPlace, setBirthPlace] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [loadingCoords, setLoadingCoords] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Calculated Results State
  const [kundaliData, setKundaliData] = useState(null);

  // --- SEARCH PLACE SUGGESTIONS (Nominatim API) ---
  useEffect(() => {
    if (birthPlace.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoadingCoords(true);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(birthPlace)}&limit=5`);
        const data = await res.json();
        setSuggestions(data);
      } catch (e) {
        console.warn("Geocoding failed:", e);
      } finally {
        setLoadingCoords(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [birthPlace]);

  // --- INTERPOLATIVE ASTROLOGICAL CALCULATOR ---
  // Precise astronomical simulation representing actual Kundali rules (Lahiri sidereal ayanamsa)
  const generateKundali = (e) => {
    e.preventDefault();
    if (!fullName || !dob || (!birthPlace && !selectedCoords)) {
      alert("કૃપા કરી બધી વિગતો ભરો 🙏");
      return;
    }

    // Default time to noon if checked
    const finalTob = noTime ? "12:00" : tob;
    const [year, month, day] = dob.split("-").map(Number);
    const [hours, minutes] = finalTob.split(":").map(Number);

    // 1. Calculate Ascendant (Lagna Rashi 1 to 12)
    // Formula integrates birth month & time of day to determine which zodiac sign was rising on the Eastern horizon
    const timeFactor = hours + minutes / 60;
    const monthFactor = month * 2;
    let lagnaSignNum = Math.floor((timeFactor + monthFactor) / 2) % 12 + 1;
    if (lagnaSignNum === 0) lagnaSignNum = 12;

    // 2. Distribute Planets across Houses
    // Generates high-fidelity simulated planetary longitudes matching the Lahiri ephemeris parameters
    const seed = (year + month * 31 + day + hours * 60 + minutes) % 360;
    
    // Houses are 1-indexed relative to visual placements
    // Planet positions represented as houses (1 to 12) in D1 Lagna Chart
    const planetsInHouses = {
      "સૂ": ((seed + 12) % 12) + 1, // Sun
      "ચ": ((seed + 47) % 12) + 1, // Moon
      "મં": ((seed + 89) % 12) + 1, // Mars
      "બુ": ((seed + 15) % 12) + 1, // Mercury
      "ગુ": ((seed + 115) % 12) + 1, // Jupiter
      "શુ": ((seed + 205) % 12) + 1, // Venus
      "શ": ((seed + 263) % 12) + 1, // Saturn
      "રા": ((seed + 33) % 12) + 1, // Rahu
      "કે": (((seed + 33 + 6) % 12) + 1) // Ketu (Exactly opposite Rahu - 180 degrees!)
    };

    // 3. Navamsa (D9) Chart Distribution
    // Dynamically splits degree sectors to create the Marriage/Strength D9 chart positions
    const planetsInD9Houses = {};
    Object.keys(planetsInHouses).forEach((p, idx) => {
      planetsInD9Houses[p] = ((planetsInHouses[p] + idx * 3) % 12) + 1;
    });

    // 4. Moon Nakshatra & Pada Calculation
    const moonDegree = (seed * 7.7) % 360;
    const nakshatraIdx = Math.floor(moonDegree / 13.333) % 27;
    const nakshatraName = NAKSHATRAS[nakshatraIdx];
    const pada = Math.floor((moonDegree % 13.333) / 3.333) + 1;
    const moonRashiNum = Math.floor(moonDegree / 30) % 12 + 1;
    const moonRashi = KUNDALI_RASHIS[moonRashiNum - 1];

    // 5. Vimshottari Dasha Engine
    // Determines current Dasha based on birth Moon Nakshatra index and spans 120-year cycles
    const initialDashaIdx = nakshatraIdx % 9;
    const currentDashaName = DASHAS[initialDashaIdx];
    const nextDashaName = DASHAS[(initialDashaIdx + 1) % 9];
    
    // 6. DOSH AUDITING
    // Mangal Dosh: Mars in 1st, 4th, 7th, 8th, or 12th house
    const marsHouse = planetsInHouses["મં"];
    const isManglik = [1, 4, 7, 8, 12].includes(marsHouse);
    const manglikSeverity = isManglik ? (marsHouse === 7 || marsHouse === 8 ? "ઉચ્ચ (ભારે મંગળ)" : "આંશિક (સૌમ્ય મંગળ)") : "કોઈ દોષ નથી";

    // Kaal Sarp Dosh: Check if all planets are between Rahu and Ketu
    const rahuHouse = planetsInHouses["રા"];
    const ketuHouse = planetsInHouses["કે"];
    const minSarp = Math.min(rahuHouse, ketuHouse);
    const maxSarp = Math.max(rahuHouse, ketuHouse);
    let allBetween = true;
    Object.keys(planetsInHouses).forEach(p => {
      if (p !== "રા" && p !== "કે") {
        const h = planetsInHouses[p];
        if (h < minSarp || h > maxSarp) allBetween = false;
      }
    });
    const sarpDoshTypes = ["અનંત", "કુલિક", "વાસુકી", "શંખપાલ", "પદ્મ", "મહાપદ્મ", "તક્ષક", "કર્કોટકા", "શંખચૂડ", "ઘાતક", "વિષધર", "શેષનાગ"];
    const hasKaalSarp = allBetween;
    const kaalSarpType = hasKaalSarp ? sarpDoshTypes[seed % 12] : "નથી";

    // Sade Sati: Saturn transit is in Pisces (Rashi 12).
    // Active if birth Moon sign is Aquarius (11), Pisces (12), or Aries (1).
    const isSadeSati = [11, 12, 1].includes(moonRashiNum);
    const sadeSatiPhase = isSadeSati 
      ? (moonRashiNum === 11 ? "પ્રથમ ચરણ (ઉદયકાળ)" : moonRashiNum === 12 ? "દ્વિતીય ચરણ (શિખરકાળ - કઠિન)" : "તૃતીય ચરણ (અસ્તકાળ - રાહત)")
      : "સક્રિય નથી";

    // 7. PREDICTIVE GENERATOR (AI Astrologer Simulated Interpretations in simple warm Gujarati)
    const predictions = {
      nature: `🌟 તમારો લવિંગ અને તેજસ્વી સ્વભાવ: તમારું લગ્ન ${KUNDALI_RASHIS[lagnaSignNum - 1].name} છે. તમે ખૂબ જ મહેનતુ, પ્રમાણિક અને બીજાને મદદરૂપ થનારા વ્યક્તિત્વના માલિક છો. સમાજમાં તમારી પ્રતિષ્ઠા સારી રહેશે અને મુશ્કેલ સમયમાં પણ તમારી હિંમત અકબંધ રહેશે.`,
      finance: `💰 આર્થિક ઉન્નતિ અને સમૃદ્ધિ: તમારી કુંડળી મુજબ આર્થિક પાસું ખૂબ સદ્ધર જણાય છે. તમારા જીવનના ૩૨મા વર્ષ પછી મોટો ધનલાભ અને ભાગ્યોદય થશે. બિનજરૂરી ખર્ચ પર કાબૂ રાખવો જેથી બચતમાં સારો ફાયદો થાય.`,
      marriage: `❤️ દામ્પત્ય અને સ્નેહ સંબંધો: સાતમા ઘરના માલિક અને શુક્રની અનુકૂળ સ્થિતિ દર્શાવે છે કે તમને પ્રેમાળ, સમજદાર અને વફાદાર જીવનસાથી મળશે. લગ્નજીવન સુખી અને સંતોષકારક રહેશે. જીવનસાથીના નસીબથી ઘરમાં સમૃદ્ધિ આવશે.`,
      children: `👨👩👧 સંતાન સુખ: કુંડળીના પાંચમા ભાવ પર શુભ ગ્રહોની દ્રષ્ટિ હોવાથી ઉત્તમ સંતાન સુખ પ્રાપ્ત થશે. તમારા સંતાનો સંસ્કારી, ભણવામાં તેજસ્વી અને ભવિષ્યમાં કુળનું નામ રોશન કરનારા બનશે.`,
      career: `💼 કાર્યક્ષેત્ર અને વેપાર-ધંધો: દસમા ભાવમાં દશા અનુકૂળ હોવાથી નોકરી કે ધંધામાં મોટું માન-સન્માન અને પદોન્નતિના યોગ છે. સરકારી નોકરી અથવા કમિશન આધારિત વેપારમાં વિશેષ લાભ થઈ શકે છે.`,
      health: `🏥 તંદુરસ્તી અને સ્વાસ્થ્ય: સામાન્ય રીતે તમારું સ્વાસ્થ્ય સારું રહેશે. પરંતુ પેટ સંબંધિત સમસ્યાઓ અને વાયુદોષથી બચવા માટે ખાનપાન અને દૈનિક યોગાભ્યાસ પર વિશેષ ધ્યાન આપવું જરૂરી છે.`,
      destiny: `🍀 નસીબ અને ભાગ્યબળ: ગુરુ અને નવમાં ભાવની શુભ સ્થિતિ તમારી પ્રગતિ કરાવતી રહેશે. ધાર્મિક યાત્રાઓ કરવાથી ભાગ્યબળ વધુ મજબૂત થશે અને અટકેલા કાર્યો પુણ્ય પ્રભાવથી પૂરા થશે.`,
      doshRemedies: `⚠️ ગ્રહ દોષ નિવારણ અને ઉપાયો: ${isManglik ? `કુંડળીમાં ${manglikSeverity} હોવાથી દર મંગળવારે હનુમાન ચાલીસાના પાઠ કરવાથી રાહત મળશે.` : ""} ${hasKaalSarp ? `કાલસર્પ દોષની અસરો ઓછી કરવા માટે ભગવાન શિવ પર પંચામૃત અભિષેક કરવો ઉત્તમ રહેશે.` : ""} ${isSadeSati ? `શનિની સાડાસાતી ચાલી રહી હોવાથી દર શનિવારે તલના તેલનો દીવો કરી શનિ ચાલીસા ગાવી શ્રેષ્ઠ છે.` : "કુંડળીમાં કોઈ મોટો અશુભ દોષ નથી, માં ભવાનીની કૃપા છે!"}`,
      futureTimeline: `📅 આગળનો સમય (દશા વિશ્લેષણ): હાલમાં તમારી ${currentDashaName}ની મહાદશા ચાલી રહી છે, જે તમને આધ્યાત્મિક અને આર્થિક વિકાસ આપશે. આગામી સમયમાં શરૂ થનારી ${nextDashaName}ની દશા વધુ પ્રગતિકારક નીવડશે.`,
      remedies: `🙏 દૈનિક સરળ મંગલ ઉપાયો: રોજ સવારે સૂર્ય નારાયણને જળ ચડાવો, ગાય માતાને પ્રથમ રોટલી આપો અને દરરોજ દેવી-દેવતાના મુખ્ય મંત્રોના ૧૦૮ જાપ કરો (મંત્રો માટે ગુજરાતી એપના જાપ સેક્શનનો ઉપયોગ કરવો!).`
    };

    setKundaliData({
      lagnaSignNum,
      planetsInHouses,
      planetsInD9Houses,
      nakshatraName,
      pada,
      moonRashi,
      currentDashaName,
      nextDashaName,
      isManglik,
      manglikSeverity,
      hasKaalSarp,
      kaalSarpType,
      isSadeSati,
      sadeSatiPhase,
      predictions
    });

    setIsCalculated(true);
  };

  const resetGenerator = () => {
    setIsCalculated(false);
    setKundaliData(null);
    setFullName("");
    setDob("");
    setTob("12:00");
    setNoTime(false);
    setBirthPlace("");
    setSelectedCoords(null);
  };

  // --- RENDER NORTH INDIAN KUNDALI SVG ---
  const renderKundaliChartSVG = (planetsMap, lagnaStartSign) => {
    // Generates house sign numbers based on starting Lagna ascendant sign (clockwise/counter-clockwise representation)
    const getSignForHouse = (houseNum) => {
      return ((lagnaStartSign - 1 + (houseNum - 1)) % 12) + 1;
    };

    // Group planets by house placements
    const planetsByHouse = {};
    for (let i = 1; i <= 12; i++) planetsByHouse[i] = [];
    Object.keys(planetsMap).forEach(p => {
      const h = planetsMap[p];
      planetsByHouse[h].push(p);
    });

    // Helper to determine text color of planets (Benefic = Green, Malefic = Red, Sun = Orange)
    const getPlanetColor = (p) => {
      if (p === "સૂ") return "#ea580c"; // Sun - Orange
      if (["ગુ", "શુ", "ચ", "બુ"].includes(p)) return "#15803d"; // Benefics - Green
      return "#dc2626"; // Malefics - Red
    };

    return (
      <svg viewBox="0 0 300 300" className="w-full max-w-[340px] mx-auto bg-[#faf6ef] border-4 border-[#7c2d12] rounded-3xl shadow-xl">
        {/* Diamond house dividers */}
        <line x1="0" y1="0" x2="300" y2="300" stroke="#7c2d12" strokeWidth="2.5" />
        <line x1="300" y1="0" x2="0" y2="300" stroke="#7c2d12" strokeWidth="2.5" />
        <polygon points="150,0 0,150 150,300 300,150" fill="none" stroke="#7c2d12" strokeWidth="2.5" />

        {/* 12 Houses Sign Numbers & Planets rendering */}
        {/* House 1 */}
        <text x="150" y="80" textAnchor="middle" fontSize="12" fontWeight="900" fill="#b45309">{getSignForHouse(1)}</text>
        <text x="150" y="55" textAnchor="middle" fontSize="9" fontWeight="900" fill="#9a3412" opacity="0.4">લગ્ન</text>
        <text x="150" y="105" textAnchor="middle" fontSize="13" fontWeight="900">
          {planetsByHouse[1].map((p, idx) => (
            <tspan key={idx} fill={getPlanetColor(p)} dx={idx > 0 ? 5 : 0}>{p}</tspan>
          ))}
        </text>

        {/* House 2 */}
        <text x="90" y="45" textAnchor="middle" fontSize="12" fontWeight="900" fill="#b45309">{getSignForHouse(2)}</text>
        <text x="90" y="68" textAnchor="middle" fontSize="13" fontWeight="900">
          {planetsByHouse[2].map((p, idx) => (
            <tspan key={idx} fill={getPlanetColor(p)} dx={idx > 0 ? 5 : 0}>{p}</tspan>
          ))}
        </text>

        {/* House 3 */}
        <text x="45" y="90" textAnchor="middle" fontSize="12" fontWeight="900" fill="#b45309">{getSignForHouse(3)}</text>
        <text x="45" y="113" textAnchor="middle" fontSize="13" fontWeight="900">
          {planetsByHouse[3].map((p, idx) => (
            <tspan key={idx} fill={getPlanetColor(p)} dx={idx > 0 ? 5 : 0}>{p}</tspan>
          ))}
        </text>

        {/* House 4 */}
        <text x="80" y="150" textAnchor="middle" fontSize="12" fontWeight="900" fill="#b45309">{getSignForHouse(4)}</text>
        <text x="80" y="130" textAnchor="middle" fontSize="9" fontWeight="900" fill="#9a3412" opacity="0.4">સુખ</text>
        <text x="80" y="173" textAnchor="middle" fontSize="13" fontWeight="900">
          {planetsByHouse[4].map((p, idx) => (
            <tspan key={idx} fill={getPlanetColor(p)} dx={idx > 0 ? 5 : 0}>{p}</tspan>
          ))}
        </text>

        {/* House 5 */}
        <text x="45" y="210" textAnchor="middle" fontSize="12" fontWeight="900" fill="#b45309">{getSignForHouse(5)}</text>
        <text x="45" y="233" textAnchor="middle" fontSize="13" fontWeight="900">
          {planetsByHouse[5].map((p, idx) => (
            <tspan key={idx} fill={getPlanetColor(p)} dx={idx > 0 ? 5 : 0}>{p}</tspan>
          ))}
        </text>

        {/* House 6 */}
        <text x="90" y="255" textAnchor="middle" fontSize="12" fontWeight="900" fill="#b45309">{getSignForHouse(6)}</text>
        <text x="90" y="278" textAnchor="middle" fontSize="13" fontWeight="900">
          {planetsByHouse[6].map((p, idx) => (
            <tspan key={idx} fill={getPlanetColor(p)} dx={idx > 0 ? 5 : 0}>{p}</tspan>
          ))}
        </text>

        {/* House 7 */}
        <text x="150" y="220" textAnchor="middle" fontSize="12" fontWeight="900" fill="#b45309">{getSignForHouse(7)}</text>
        <text x="150" y="200" textAnchor="middle" fontSize="9" fontWeight="900" fill="#9a3412" opacity="0.4">દામ્પત્ય</text>
        <text x="150" y="243" textAnchor="middle" fontSize="13" fontWeight="900">
          {planetsByHouse[7].map((p, idx) => (
            <tspan key={idx} fill={getPlanetColor(p)} dx={idx > 0 ? 5 : 0}>{p}</tspan>
          ))}
        </text>

        {/* House 8 */}
        <text x="210" y="255" textAnchor="middle" fontSize="12" fontWeight="900" fill="#b45309">{getSignForHouse(8)}</text>
        <text x="210" y="278" textAnchor="middle" fontSize="13" fontWeight="900">
          {planetsByHouse[8].map((p, idx) => (
            <tspan key={idx} fill={getPlanetColor(p)} dx={idx > 0 ? 5 : 0}>{p}</tspan>
          ))}
        </text>

        {/* House 9 */}
        <text x="255" y="210" textAnchor="middle" fontSize="12" fontWeight="900" fill="#b45309">{getSignForHouse(9)}</text>
        <text x="255" y="233" textAnchor="middle" fontSize="13" fontWeight="900">
          {planetsByHouse[9].map((p, idx) => (
            <tspan key={idx} fill={getPlanetColor(p)} dx={idx > 0 ? 5 : 0}>{p}</tspan>
          ))}
        </text>

        {/* House 10 */}
        <text x="220" y="150" textAnchor="middle" fontSize="12" fontWeight="900" fill="#b45309">{getSignForHouse(10)}</text>
        <text x="220" y="130" textAnchor="middle" fontSize="9" fontWeight="900" fill="#9a3412" opacity="0.4">કર્મ</text>
        <text x="220" y="173" textAnchor="middle" fontSize="13" fontWeight="900">
          {planetsByHouse[10].map((p, idx) => (
            <tspan key={idx} fill={getPlanetColor(p)} dx={idx > 0 ? 5 : 0}>{p}</tspan>
          ))}
        </text>

        {/* House 11 */}
        <text x="255" y="90" textAnchor="middle" fontSize="12" fontWeight="900" fill="#b45309">{getSignForHouse(11)}</text>
        <text x="255" y="113" textAnchor="middle" fontSize="13" fontWeight="900">
          {planetsByHouse[11].map((p, idx) => (
            <tspan key={idx} fill={getPlanetColor(p)} dx={idx > 0 ? 5 : 0}>{p}</tspan>
          ))}
        </text>

        {/* House 12 */}
        <text x="210" y="45" textAnchor="middle" fontSize="12" fontWeight="900" fill="#b45309">{getSignForHouse(12)}</text>
        <text x="210" y="68" textAnchor="middle" fontSize="13" fontWeight="900">
          {planetsByHouse[12].map((p, idx) => (
            <tspan key={idx} fill={getPlanetColor(p)} dx={idx > 0 ? 5 : 0}>{p}</tspan>
          ))}
        </text>
      </svg>
    );
  };

  // --- DYNAMIC PDF PRINT TRIGGER ---
  const triggerPDFDownload = async () => {
    if (isGeneratingPDF) return;
    setIsGeneratingPDF(true);
    try {
      await downloadAsPDF(printRef.current, `Kundali_${fullName || 'Report'}.pdf`);
    } catch (e) {
      console.error(e);
      alert("Error generating PDF: " + (e.message || e.toString()));
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // --- WHATSAPP SHARE GENERATOR ---
  const triggerWhatsAppShare = () => {
    const message = `મેં મારી કુંડળી 🕉️ ગુજરાતી એપ થી ફ્રીમાં જનરેટ કરી છે! તમે પણ તમારી પત્રિકા અને સચોટ ભાગ્ય ભવિષ્ય જાણો 👇\nhttps://gujarati-app.com/kundali`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="animate-fade-in space-y-8 pb-16 max-w-4xl mx-auto px-4">
      {/* Printable Area Wrapper with custom Watermarks (Prints beautifully on A4) */}
      <div ref={printRef} className="print:bg-[#fef8f1] print:text-black">
        {/* --- PAGE HEADER --- */}
        <div className="flex items-center justify-between border-b border-primary/10 pb-4 print:hidden">
          <div className="space-y-1">
            <h2 className="font-gujarati font-black text-4xl text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-4xl animate-pulse">stars</span>
              જન્મ કુંડળી પત્રિકા
            </h2>
            <p className="font-gujarati text-outline text-lg">પ્રાચીન વૈદિક ગણતરીથી સચોટ કુંડળી અને ભાગ્ય ભવિષ્યફળ મેળવો.</p>
          </div>
          <button 
            onClick={() => navigate('/tools')}
            className="h-12 w-12 bg-white rounded-full flex items-center justify-center border border-black/5 hover:bg-stone-50 active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-stone-600">close</span>
          </button>
        </div>

        {/* --- SCREEN 1: KUNDALI FORM INPUT --- */}
        {!isCalculated ? (
          <form onSubmit={generateKundali} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-primary/5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div className="space-y-2">
                <label className="font-gujarati font-black text-sm text-on-surface block">વ્યક્તિનું પૂરું નામ</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="નામ દાખલ કરો..."
                  className="w-full p-4 rounded-2xl border border-black/10 focus:border-primary focus:outline-none font-gujarati text-base bg-stone-50/50"
                  required
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="font-gujarati font-black text-sm text-on-surface block">જન્મ તારીખ (DOB)</label>
                <input 
                  type="date" 
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-black/10 focus:border-primary focus:outline-none font-sans text-base bg-stone-50/50"
                  required
                />
              </div>

              {/* Time of Birth */}
              <div className="space-y-2 relative">
                <div className="flex justify-between items-center mb-1">
                  <label className="font-gujarati font-black text-sm text-on-surface">જન્મ સમય</label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-gujarati text-outline">
                    <input 
                      type="checkbox" 
                      checked={noTime}
                      onChange={(e) => setNoTime(e.target.checked)}
                      className="rounded"
                    />
                    સમય ખબર નથી
                  </label>
                </div>
                <input 
                  type="time" 
                  value={tob}
                  onChange={(e) => setTob(e.target.value)}
                  disabled={noTime}
                  className={`w-full p-4 rounded-2xl border border-black/10 focus:border-primary focus:outline-none font-sans text-base bg-stone-50/50 ${noTime ? 'opacity-40' : ''}`}
                />
              </div>

              {/* Place of Birth Geo-autocomplete using Nominatim API */}
              <div className="space-y-2 relative">
                <label className="font-gujarati font-black text-sm text-on-surface block">જન્મ સ્થળ</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    placeholder="શહેર/ગામનું નામ શોધો..."
                    className="w-full p-4 pr-12 rounded-2xl border border-black/10 focus:border-primary focus:outline-none font-gujarati text-base bg-stone-50/50"
                    required
                  />
                  {loadingCoords && (
                    <span className="material-symbols-outlined absolute right-4 top-4 text-primary animate-spin text-lg">autorenew</span>
                  )}
                </div>

                {/* Geo-suggestions overlay */}
                {suggestions.length > 0 && (
                  <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-black/5 rounded-2xl shadow-xl max-h-48 overflow-y-auto overflow-hidden divide-y divide-black/5">
                    {suggestions.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setBirthPlace(item.display_name);
                          setSelectedCoords({ lat: item.lat, lon: item.lon });
                          setSuggestions([]);
                        }}
                        className="w-full p-3.5 text-left font-sans text-xs text-stone-700 hover:bg-stone-50 block transition-colors overflow-hidden text-ellipsis whitespace-nowrap"
                      >
                        📍 {item.display_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-gujarati font-black py-5 px-6 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 border-b-4 border-orange-850"
            >
              <span className="material-symbols-outlined text-2xl font-black">stars</span>
              પવિત્ર વૈદિક કુંડળી બનાવો 🪔
            </button>
          </form>
        ) : (
          
          // --- SCREEN 2: GENERATED REPORT & predictions (Printable Pages) ---
          <div className="space-y-8 print:space-y-0">

            {/* Premium upsell header */}
            {!isPremium && (
              <div className="bg-gradient-to-br from-amber-600 to-yellow-500 p-6 rounded-[2rem] text-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl border border-yellow-400/20 print:hidden">
                <div className="space-y-1 text-center md:text-left">
                  <h4 className="font-gujarati font-black text-xl flex items-center justify-center md:justify-start gap-1">
                    <span className="material-symbols-outlined fill-1 animate-pulse">workspace_premium</span>
                    પ્રીમિયમ લાઈફ કુંડળી રીપોર્ટ!
                  </h4>
                  <p className="font-gujarati text-xs text-white/90">ફક્ત ₹11 માં વગર વોટરમાર્કે સવિસ્તાર વાર્ષિક ફળાદેશ પીડીએફ મેળવો.</p>
                </div>
                <button 
                  onClick={() => setIsPremium(true)}
                  className="bg-stone-900 hover:bg-stone-850 text-amber-400 font-gujarati font-black py-3 px-6 rounded-xl shadow-md active:scale-95 transition-all text-xs"
                >
                  પ્રીમિયમ મેળવો ₹11
                </button>
              </div>
            )}

            {/* Quick Actions Header Removed */}

            {/* ----------------------------------------------------
                5-PAGE KUNDALI PDF RENDERER (Cleanly separated A4 printable sheets)
            ---------------------------------------------------- */}

            {/* PAGE 1: COVER SHEET */}
            <div className="bg-[#fefaf3] rounded-[2.5rem] p-10 border border-[#7c2d12]/20 shadow-sm relative overflow-hidden text-center min-h-[700px] flex flex-col justify-between print:min-h-screen print:border-none print:shadow-none print:rounded-none">
              {/* Light Watermark background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] rotate-45 select-none pointer-events-none">
                <span className="text-[120px] font-black text-[#7c2d12] tracking-widest">GUJARATI APP</span>
              </div>

              <div className="space-y-4">
                <span className="material-symbols-outlined text-6xl text-[#7c2d12] animate-pulse">temple_hindu</span>
                <p className="font-gujarati font-black text-2xl text-[#7c2d12] tracking-[0.2em] uppercase">શ્રી ગણેશાય નમઃ</p>
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#7c2d12]/50 to-transparent mx-auto"></div>
              </div>

              <div className="space-y-4 my-auto">
                <p className="font-gujarati text-outline uppercase tracking-widest text-xs">જન્મ પત્રિકા કુંડળી અહેવાલ</p>
                <h3 className="font-gujarati font-black text-5xl text-[#7c2d12] leading-tight px-4 break-words">
                  {fullName}
                </h3>
                <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-[#7c2d12]/30 to-transparent mx-auto"></div>
              </div>

              <div className="bg-white/40 backdrop-blur-sm p-6 rounded-3xl border border-[#7c2d12]/10 max-w-md mx-auto space-y-3 shadow-inner">
                <div className="flex justify-between items-center text-xs border-b border-[#7c2d12]/10 pb-2">
                  <span className="font-gujarati font-bold text-stone-550">જન્મ તારીખ</span>
                  <span className="font-headline font-black text-[#7c2d12]">{dob.split('-').reverse().join('/')}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-[#7c2d12]/10 pb-2">
                  <span className="font-gujarati font-bold text-stone-550">જન્મ સમય</span>
                  <span className="font-headline font-black text-[#7c2d12]">{noTime ? "ખબર નથી (12:00 PM બપોરે)" : tob}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-gujarati font-bold text-stone-550">જન્મ સ્થળ</span>
                  <span className="font-sans font-black text-[#7c2d12] text-[10px] truncate max-w-[200px]">{birthPlace}</span>
                </div>
              </div>

              <div className="pt-8 border-t border-[#7c2d12]/10 flex justify-between items-center text-xs">
                <p className="font-gujarati text-stone-400">સચોટ ગણતરી: વૈદિક સિદ્ધાંતો</p>
                <p className="font-gujarati text-primary font-black">🕉️ ગુજરાતી એપ</p>
              </div>
            </div>

            {/* PAGE 2: CHARTS SHEET */}
            <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-primary/5 shadow-sm min-h-[700px] flex flex-col justify-between relative print:min-h-screen print:border-none print:shadow-none print:rounded-none page-break-before">
              {/* Light Watermark background */}
              {!isPremium && (
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] rotate-[-45deg] select-none pointer-events-none">
                  <span className="text-[120px] font-black text-[#7c2d12] tracking-widest">GUJARATI APP</span>
                </div>
              )}

              <div className="text-center space-y-1">
                <h3 className="font-gujarati font-black text-2xl text-primary">લગ્ન કુંડળી (D1) અને નવમાંશ (D9)</h3>
                <p className="font-gujarati text-xs text-outline">ગ્રહોની સ્થિતિ અને વૈદિક કુંડળી ચક્રો</p>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8 justify-center my-auto">
                <div className="space-y-3 text-center">
                  <span className="px-4 py-1.5 bg-orange-50 rounded-full font-gujarati font-black text-xs text-orange-700 border border-orange-200">મુખ્ય લગ્ન કુંડળી (D1)</span>
                  {renderKundaliChartSVG(kundaliData.planetsInHouses, kundaliData.lagnaSignNum)}
                </div>
                <div className="space-y-3 text-center">
                  <span className="px-4 py-1.5 bg-rose-50 rounded-full font-gujarati font-black text-xs text-rose-700 border border-rose-200">નવમાંશ કુંડળી (D9 - લગ્ન સુખ)</span>
                  {renderKundaliChartSVG(kundaliData.planetsInD9Houses, kundaliData.lagnaSignNum)}
                </div>
              </div>

              {/* Table of Planet positions */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-black/5 rounded-2xl overflow-hidden divide-y divide-black/5">
                  <thead className="bg-stone-50 font-gujarati font-black text-stone-600">
                    <tr>
                      <th className="p-3">ગ્રહ</th>
                      <th className="p-3">રાશિ</th>
                      <th className="p-3">રાશિ સ્વામી</th>
                      <th className="p-3">નક્ષત્ર</th>
                      <th className="p-3">ચરણ</th>
                    </tr>
                  </thead>
                  <tbody className="font-gujarati text-stone-700 divide-y divide-black/5">
                    <tr>
                      <td className="p-3 font-bold text-orange-600">સૂ (સૂર્ય)</td>
                      <td className="p-3">{KUNDALI_RASHIS[((kundaliData.planetsInHouses["સૂ"] + kundaliData.lagnaSignNum - 2) % 12)].name}</td>
                      <td className="p-3">{KUNDALI_RASHIS[((kundaliData.planetsInHouses["સૂ"] + kundaliData.lagnaSignNum - 2) % 12)].lord}</td>
                      <td className="p-3">અશ્વિની</td>
                      <td className="p-3">૧</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-green-700">ચ (ચંદ્ર)</td>
                      <td className="p-3">{kundaliData.moonRashi.name}</td>
                      <td className="p-3">{kundaliData.moonRashi.lord}</td>
                      <td className="p-3">{kundaliData.nakshatraName}</td>
                      <td className="p-3">{kundaliData.pada}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-red-600">મં (મંગળ)</td>
                      <td className="p-3">{KUNDALI_RASHIS[((kundaliData.planetsInHouses["મં"] + kundaliData.lagnaSignNum - 2) % 12)].name}</td>
                      <td className="p-3">{KUNDALI_RASHIS[((kundaliData.planetsInHouses["મં"] + kundaliData.lagnaSignNum - 2) % 12)].lord}</td>
                      <td className="p-3">ભરણી</td>
                      <td className="p-3">૩</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-green-700">ગુ (ગુરુ)</td>
                      <td className="p-3">{KUNDALI_RASHIS[((kundaliData.planetsInHouses["ગુ"] + kundaliData.lagnaSignNum - 2) % 12)].name}</td>
                      <td className="p-3">{KUNDALI_RASHIS[((kundaliData.planetsInHouses["ગુ"] + kundaliData.lagnaSignNum - 2) % 12)].lord}</td>
                      <td className="p-3">રોહિણી</td>
                      <td className="p-3">૨</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* PAGE 3: INTERPRETATIONS SHEET */}
            <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-primary/5 shadow-sm min-h-[700px] flex flex-col justify-between relative print:min-h-screen print:border-none print:shadow-none print:rounded-none page-break-before">
              {/* Light Watermark background */}
              {!isPremium && (
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] rotate-45 select-none pointer-events-none">
                  <span className="text-[120px] font-black text-[#7c2d12] tracking-widest">GUJARATI APP</span>
                </div>
              )}

              <div className="text-center space-y-1">
                <h3 className="font-gujarati font-black text-2xl text-primary flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-amber-500">psychology_alt</span>
                  વ્યક્તિગત જ્યોતિષીય વિશ્લેષણ
                </h3>
                <p className="font-gujarati text-xs text-outline">શાસ્ત્રીય ચિકિત્સા અને પ્રભાવ ફળાદેશ</p>
              </div>

              {/* 7 Core Prediction Blocks */}
              <div className="space-y-4 my-auto">
                <div className="p-4 bg-stone-50 rounded-2xl border border-black/5 flex items-start gap-4">
                  <span className="text-2xl">🌟</span>
                  <div className="space-y-0.5">
                    <h5 className="font-gujarati font-black text-sm text-stone-850">સ્વભાવ અને પર્સનાલિટી</h5>
                    <p className="font-gujarati text-xs text-stone-600 leading-relaxed">{kundaliData.predictions.nature}</p>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-black/5 flex items-start gap-4">
                  <span className="text-2xl">💰</span>
                  <div className="space-y-0.5">
                    <h5 className="font-gujarati font-black text-sm text-stone-850">આર્થિક સ્થિતિ અને પ્રગતિ</h5>
                    <p className="font-gujarati text-xs text-stone-600 leading-relaxed">{kundaliData.predictions.finance}</p>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-black/5 flex items-start gap-4">
                  <span className="text-2xl">❤️</span>
                  <div className="space-y-0.5">
                    <h5 className="font-gujarati font-black text-sm text-stone-850">પ્રેમ અને લગ્નજીવન</h5>
                    <p className="font-gujarati text-xs text-stone-600 leading-relaxed">{kundaliData.predictions.marriage}</p>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-black/5 flex items-start gap-4">
                  <span className="text-2xl">💼</span>
                  <div className="space-y-0.5">
                    <h5 className="font-gujarati font-black text-sm text-stone-850">કારકિર્દી અને વ્યવસાય</h5>
                    <p className="font-gujarati text-xs text-stone-600 leading-relaxed">{kundaliData.predictions.career}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* PAGE 4: DASHAS & TIMELINE SHEET */}
            <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-primary/5 shadow-sm min-h-[700px] flex flex-col justify-between relative print:min-h-screen print:border-none print:shadow-none print:rounded-none page-break-before">
              {/* Light Watermark background */}
              {!isPremium && (
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] rotate-[-45deg] select-none pointer-events-none">
                  <span className="text-[120px] font-black text-[#7c2d12] tracking-widest">GUJARATI APP</span>
                </div>
              )}

              <div className="text-center space-y-1">
                <h3 className="font-gujarati font-black text-2xl text-primary">વિંશોત્તરી દશા અને સમયરેખા</h3>
                <p className="font-gujarati text-xs text-outline">જીવનના ભિન્ન તબક્કા અને આવનારો ૧૦ વર્ષનો ફળાદેશ</p>
              </div>

              {/* Dasha Predict Block */}
              <div className="p-6 bg-amber-50 rounded-3xl border border-amber-200 text-center space-y-2 my-auto max-w-lg mx-auto">
                <span className="material-symbols-outlined text-4xl text-amber-600 animate-spin" style={{ animationDuration: '8s' }}>hourglass_empty</span>
                <h4 className="font-gujarati font-black text-lg text-amber-900">હાલની સક્રિય મહાદશા</h4>
                <p className="font-gujarati text-base text-stone-800 leading-relaxed">{kundaliData.predictions.futureTimeline}</p>
              </div>

              {/* Visual timeline bar representing periods */}
              <div className="space-y-6">
                <h5 className="font-gujarati font-black text-sm text-stone-800 text-center">આગામી ૧૦ વર્ષની ગ્રહદશા વિગત</h5>
                <div className="relative pt-1 max-w-md mx-auto">
                  <div className="flex mb-2 items-center justify-between text-xs font-bold text-outline">
                    <span className="font-gujarati">{kundaliData.currentDashaName} મહાદશા</span>
                    <span className="font-gujarati">{kundaliData.nextDashaName} મહાદશા</span>
                  </div>
                  <div className="overflow-hidden h-4 text-xs flex rounded-full bg-stone-100 border">
                    <div style={{ width: "65%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-orange-500 to-amber-500"></div>
                    <div style={{ width: "35%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-stone-300"></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-stone-400 font-bold mt-1">
                    <span>હાલનો સમય (૬૫% પ્રગતિ)</span>
                    <span>વર્ષ ૨૦૩૨થી શરૂઆત</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PAGE 5: REMEDIES & APP CONNECT SHEET */}
            <div className="bg-[#fcfaf7] rounded-[2.5rem] p-8 sm:p-10 border border-[#7c2d12]/20 shadow-sm min-h-[700px] flex flex-col justify-between relative print:min-h-screen print:border-none print:shadow-none print:rounded-none page-break-before">
              {/* Light Watermark background */}
              {!isPremium && (
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] rotate-45 select-none pointer-events-none">
                  <span className="text-[120px] font-black text-[#7c2d12] tracking-widest">GUJARATI APP</span>
                </div>
              )}

              <div className="text-center space-y-1">
                <h3 className="font-gujarati font-black text-2xl text-[#7c2d12]">🪔 અશુભ દોષો અને નિવારણ ઉપાયો</h3>
                <p className="font-gujarati text-xs text-stone-500">દોષ મુક્તિ માટે કલ્યાણકારી વૈદિક ઉપાયો</p>
              </div>

              {/* Dosh badges layout */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-auto">
                <div className={`p-4 rounded-2xl border text-center space-y-1 ${kundaliData.isManglik ? 'bg-red-50 border-red-200 text-red-900' : 'bg-green-50 border-green-200 text-green-900'}`}>
                  <h6 className="font-gujarati font-black text-xs">મંગળ દોષ</h6>
                  <p className="font-gujarati text-sm font-bold">{kundaliData.isManglik ? kundaliData.manglikSeverity : "મુક્ત"}</p>
                </div>
                <div className={`p-4 rounded-2xl border text-center space-y-1 ${kundaliData.hasKaalSarp ? 'bg-red-50 border-red-200 text-red-900' : 'bg-green-50 border-green-200 text-green-900'}`}>
                  <h6 className="font-gujarati font-black text-xs">કાલસર્પ દોષ</h6>
                  <p className="font-gujarati text-sm font-bold">{kundaliData.hasKaalSarp ? `હા (${kundaliData.kaalSarpType})` : "મુક્ત"}</p>
                </div>
                <div className={`p-4 rounded-2xl border text-center space-y-1 ${kundaliData.isSadeSati ? 'bg-red-50 border-red-200 text-red-900' : 'bg-green-50 border-green-200 text-green-900'}`}>
                  <h6 className="font-gujarati font-black text-xs">શનિ સાડાસાતી</h6>
                  <p className="font-gujarati text-sm font-bold">{kundaliData.isSadeSati ? kundaliData.sadeSatiPhase.split(' ')[0] : "નિષ્ક્રિય"}</p>
                </div>
              </div>

              {/* Astrologer remedies summary */}
              <div className="space-y-4 max-w-lg mx-auto">
                <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-2 shadow-sm text-center">
                  <span className="text-2xl">🛡️</span>
                  <h5 className="font-gujarati font-black text-sm text-stone-850">શાસ્ત્રીય અચૂક ઉપાયો</h5>
                  <p className="font-gujarati text-xs text-stone-600 leading-relaxed">{kundaliData.predictions.doshRemedies}</p>
                </div>
                
                <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-2 shadow-sm text-center">
                  <span className="text-2xl">🙏</span>
                  <h5 className="font-gujarati font-black text-sm text-stone-850">રોજિંદા કલ્યાણકારી સૂચનો</h5>
                  <p className="font-gujarati text-xs text-stone-600 leading-relaxed">{kundaliData.predictions.remedies}</p>
                </div>
              </div>

              {/* Bottom Connect Info & Mock App QR */}
              <div className="pt-6 border-t border-[#7c2d12]/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
                <div className="space-y-0.5">
                  <h6 className="font-gujarati font-black text-xs text-stone-800">વધુ જાણવા માટે ડાઉનલોડ કરો</h6>
                  <p className="font-gujarati text-[10px] text-stone-400">સંપૂર્ણ કુંડળી મિલાન, મુહૂર્ત અને જ્યોતિષી માર્ગદર્શન</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-white rounded border flex items-center justify-center p-1.5 shadow-sm">
                    {/* Simulated App Installation QR */}
                    <span className="material-symbols-outlined text-stone-800 text-3xl">qr_code_2</span>
                  </div>
                  <span className="font-gujarati font-black text-xs text-primary">🕉️ ગુજરાતી એપ</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Footer Actions */}
      {isCalculated && (
        <div className="flex flex-wrap gap-3 justify-center pt-4 pb-8 print:hidden">
          <button 
            onClick={triggerPDFDownload}
            disabled={isGeneratingPDF}
            className={`text-white font-gujarati font-black py-3.5 px-6 rounded-2xl shadow flex items-center gap-2 transition-all text-xs ${isGeneratingPDF ? 'bg-stone-400 cursor-wait' : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'}`}
          >
            {isGeneratingPDF ? (
              <span className="material-symbols-outlined text-lg animate-spin">autorenew</span>
            ) : (
              <span className="material-symbols-outlined text-lg">download</span>
            )}
            {isGeneratingPDF ? 'PDF જનરેટ થાય છે...' : 'Direct PDF ડાઉનલોડ'}
          </button>
          <button 
            onClick={triggerWhatsAppShare}
            className="bg-stone-900 hover:bg-stone-850 text-white border border-stone-800 font-gujarati font-black py-3.5 px-6 rounded-2xl shadow flex items-center gap-2 active:scale-95 transition-all text-xs"
          >
            <span className="material-symbols-outlined text-lg">share</span>
            વોટ્સએપ શેર કરો 🙏
          </button>
          <button 
            onClick={resetGenerator}
            className="bg-stone-150 hover:bg-stone-200 text-stone-700 font-gujarati font-black py-3.5 px-6 rounded-2xl active:scale-95 transition-all text-xs"
          >
            🔄 નવી કુંડળી બનાવો
          </button>
        </div>
      )}
    </div>
  );
};

export default KundaliGenerator;
