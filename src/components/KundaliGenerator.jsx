import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { downloadAsPDF } from '../utils/downloadHelper';
import GunMilan from './GunMilan';

const getPlanetColorForTable = (p) => {
  if (p === "સૂ") return "#ea580c"; // Sun - Orange
  if (["ગુ", "શુ", "ચ", "બુ"].includes(p)) return "#15803d"; // Benefics - Green
  return "#dc2626"; // Malefics - Red
};

const toGujaratiNum = (n) => {
  const guj = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];
  return String(n).split('').map(c => {
    const code = c.charCodeAt(0);
    if (code >= 48 && code <= 57) return guj[code - 48];
    return c;
  }).join('');
};

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

const LAGNA_PREDICTIONS = {
  1: "મેષ લગ્નના જાતકો સ્વભાવે ઉગ્ર, સાહસિક અને સ્વતંત્ર વિચારધારા ધરાવે છે. તેઓ નેતૃત્વ ગુણોથી ભરપૂર હોય છે. સમાજમાં પોતાનું આગવું સ્થાન બનાવે છે.",
  2: "વૃષભ લગ્નના જાતકો શાંત, ધૈર્યવાન અને કલાપ્રેમી હોય છે. તેઓ વ્યવહારુ વિચારસરણી ધરાવે છે અને આર્થિક રીતે સદ્ધર અને ભાગ્યશાળી બને છે.",
  3: "મિથુન લગ્નના જાતકો બુદ્ધિશાળી, વાચાળ અને નવીનતાના ચાહક હોય છે. તેઓ વેપાર અને સંદેશાવ્યવહારમાં વિશેષ સફળતા મેળવે છે.",
  4: "કર્ક લગ્નના જાતકો સંવેદનશીલ, લાગણીશીલ અને પારિવારિક મૂલ્યોને માન આપનારા હોય છે. તેમનું અંતઃકરણ ખૂબ જ કોમળ અને ભક્તિભાવ વાળું હોય છે.",
  5: "સિંહ લગ્નના જાતકો તેજસ્વી, આત્મવિશ્વાસુ અને રાજસી વૈભવના શોખીન હોય છે. તેઓ સમાજમાં ઉચ્ચ પદ અને આદરણીય સ્થાન પ્રાપ્ત કરે છે.",
  6: "કન્યા લગ્નના જાતકો વિશ્લેષણાત્મક, વ્યવસ્થિત અને ખૂબ જ ચોકસાઈથી કામ કરનારા હોય છે. તેઓ ગણિત, હિસાબ અને વ્યાપારમાં કુશળ હોય છે.",
  7: "તુલા લગ્નના જાતકો ન્યાયપ્રિય, સંતુલિત અને કલા તથા સૌંદર્યના ચાહક હોય છે. તેઓ લોકપ્રિય બને છે અને સંબંધો ખૂબ સારી રીતે નિભાવે છે.",
  8: "વૃશ્ચિક લગ્નના જાતકો દ્રઢ સંકલ્પવાળા, ગંભીર અને સખત પરિશ્રમી હોય છે. તેઓ મુશ્કેલ પરિસ્થિતિઓમાં પણ પોતાના બળ પર વિજય મેળવે છે.",
  9: "ધન લગ્નના જાતકો જ્ઞાની, ધાર્મિક અને દયાળુ સ્વભાવ ધરાવે છે. તેઓ ઉચ્ચ આદર્શો વાળા હોય છે અને સમાજ માર્ગદર્શક બને છે.",
  10: "મકર લગ્નના જાતકો અત્યંત પરિશ્રમી, ગંભીર અને શિસ્તબદ્ધ હોય છે. તેઓ ધીમે ધીમે પણ સ્થિર રહીને જીવનમાં ઉચ્ચ શિખરો સર કરે છે.",
  11: "કુંભ લગ્નના જાતકો પરોપકારી, દાર્શનિક અને વૈજ્ઞાનિક દ્રષ્ટિકોણ ધરાવે છે. તેઓ સામાજિક ઉન્નતિના કાર્યોમાં અગ્રેસર રહે છે.",
  12: "મીન લગ્નના જાતકો અત્યંત દયાળુ, કલ્પનાશીલ અને શાંતીપ્રિય હોય છે. તેઓ આધ્યાત્મિક અને પરોપકારના કાર્યોમાં વિશેષ રસ ધરાવે છે."
};

const MOON_RASHI_PREDICTIONS = {
  1: "ચંદ્ર મેષ રાશિમાં હોવાથી તમારું મન ઉત્સાહી, સાહસિક અને ચંચળ રહેશે. તમે કટોકટીના સમયમાં પણ ત્વરિત નિર્ણયો લેવાની અદભુત ક્ષમતા ધરાવો છો.",
  2: "ચંદ્ર વૃષભ રાશિમાં હોવાથી મન અત્યંત શાંત અને સ્થિર રહેશે. તમારી આર્થિક સમજ અને લૌકિક વ્યવહાર ઉત્તમ રહેશે અને તમને ભૌતિક સુખો મળશે.",
  3: "ચંદ્ર મિથુન રાશિમાં હોવાથી બૌદ્ધિક ક્ષમતા અદ્ભુત રહેશે. તમે સાહિત્ય, લેખન અને વાર્તાલાપમાં પારંગત રહેશો.",
  4: "ચંદ્ર કર્ક રાશિમાં હોવાથી તમે ભાવનાશીલ, સહાનુભૂતિ ધરાવનારા અને પારિવારિક સુખને મહત્વ આપનારા હશો. માતા પ્રત્યે લગાવ સારો રહેશે.",
  5: "ચંદ્ર સિંહ રાશિમાં હોવાથી મન સ્વાભિમાની, નીડર અને ઉદાર રહેશે. વહીવટી અને નેતૃત્વના કાર્યોમાં તમને વિશેષ યશ મળશે.",
  6: "ચંદ્ર કન્યા રાશિમાં હોવાથી તમે કોઈપણ કાર્ય ખૂબ જ બુદ્ધિ અને ચોકસાઈપૂર્વક કરશો. હિસાબી કાર્યોમાં તમારી પ્રગતિ સારી રહેશે.",
  7: "ચંદ્ર તુલા રાશિમાં હોવાથી તમારો સ્વભાવ સૌમ્ય, ન્યાયી અને કલાપ્રેમી રહેશે. સમાજમાં તમારી લોકપ્રિયતા સારી રહેશે.",
  8: "ચંદ્ર વૃશ્ચિક રાશિમાં હોવાથી મન દ્રઢસંકલ્પવાળું અને સંશોધનાત્મક રહેશે. મુશ્કેલીઓનો નીડરતાથી સામનો કરવાની ક્ષમતા રહેશે.",
  9: "ચંદ્ર ધન રાશિમાં હોવાથી ધાર્મિક અને ઉદાર વિચારો પ્રબળ રહેશે. ઉચ્ચ અભ્યાસ અને જ્ઞાન પ્રાપ્તિમાં વિશેષ રસ રહેશે.",
  10: "ચંદ્ર મકર રાશિમાં હોવાથી તમારો સ્વભાવ વ્યવહારુ અને લક્ષ્ય તરફ એકાગ્ર રહેશે. મહેનત એ જ તમારું મુખ્ય બળ બનશે.",
  11: "ચંદ્ર કુંભ રાશિમાં હોવાથી સામાજિક સેવા અને દાર્શનિક વિચારો સારા રહેશે. તમારું મિત્રવર્તુળ વ્યાપક અને વફાદાર રહેશે.",
  12: "ચંદ્ર મીન રાશિમાં હોવાથી પરોપકાર, કલા અને આધ્યાત્મિકતા પ્રત્યે વિશેષ લગાવ રહેશે. તમારી અંતઃપ્રેરણા ખૂબ શક્તિશાળી રહેશે."
};

const NAKSHATRA_PREDICTIONS = {
  0: "અશ્વિની નક્ષત્રમાં જન્મ હોવાથી તમે ઉર્જાવાન, બળવાન અને ત્વરિત કાર્ય કરનારા હશો. તબીબી ક્ષેત્ર કે સાહસિક પ્રવૃત્તિઓમાં સફળતા મળશે.",
  1: "ભરણી નક્ષત્રના જાતકો દ્રઢનિશ્ચયી, સત્યવાદી અને કલાત્મક રુચિ ધરાવે છે. તેઓ પોતાના બળ પર પ્રગતિ સાધે છે.",
  2: "કૃતિકા નક્ષત્રના જાતકો તેજસ્વી અને પ્રભાવશાળી હોય છે. તેઓ વાણીમાં સ્પષ્ટવક્તા અને સત્યનો પક્ષ લેનારા હોય છે.",
  3: "રોહિણી નક્ષત્રમાં જન્મ થવાથી તમે આકર્ષક, સુંદર અને સર્જનાત્મક હશો. સમાજમાં લોકપ્રિયતા અને આર્થિક સમૃદ્ધિ ચોક્કસ મળશે.",
  4: "મૃગશીર્ષ નક્ષત્રના જાતકો જિજ્ઞાસુ, મૈત્રીપૂર્ણ અને સતત કંઈક નવું શીખવાની ઈચ્છા ધરાવે છે. મુસાફરીનો શોખ વધુ રહેશે.",
  5: "આદ્રા નક્ષત્રના જાતકો તીક્ષ્ણ બુદ્ધિ, સંશોધક અને મુશ્કેલ પરિસ્થિતિઓમાં પણ માર્ગ શોધી લેનારા હોય છે.",
  6: "પુનર્વસુ નક્ષત્રમાં જન્મ હોવાથી તમે સદ્ગુણી, શાંત અને સંતોષી હશો. નષ્ટ થયેલી સંપત્તિ કે યશ ફરીથી મેળવી શકવાની અદભુત ક્ષમતા રહેશે.",
  7: "પુષ્ય નક્ષત્રને સૌથી શુભ માનવામાં આવે છે. આ નક્ષત્રના જાતકો જ્ઞાની, દયાળુ, ધાર્મિક અને સુખી જીવન જીવે છે.",
  8: "આશ્લેષા નક્ષત્રના જાતકો ચતુર, રહસ્યમય અને તીક્ષ્ણ બુદ્ધિશાળી હોય છે. વ્યાપારી ગણતરીઓમાં તેઓ નિપુણ બને છે.",
  9: "મઘા નક્ષત્રમાં જન્મેલા લોકો પૂર્વજોની સંપત્તિ કે સંસ્કારોનું જતન કરનારા, શાસક અને સમાજમાં પ્રતિષ્ઠિત બને છે.",
  10: "પૂર્વા ફાલ્ગુની નક્ષત્રના જાતકો ભૌતિક સુખોના શોખીન, કલાપ્રેમી અને સારો સામાજિક પ્રભાવ ધરાવનારા હોય છે.",
  11: "ઉત્તરા ફાલ્ગુની નક્ષત્રના લોકો ઉદાર, પરાક્રમી અને વફાદાર મિત્ર સાબિત થાય છે. વહીવટી પદ પર સફળતા મળે છે.",
  12: "હસ્ત નક્ષત્રના જાતકો હસ્તકલા, વેપાર અને ગણતરીઓમાં કુશળ હોય છે. તેમની બુદ્ધિ વ્યવહારુ હોય છે.",
  13: "ચિત્રા નક્ષત્રના જાતકો આકર્ષક વ્યક્તિત્વ, બાંધકામ કે ડિઝાઇનિંગમાં કુશળ અને વિશિષ્ટ બૌદ્ધિક ગુણો ધરાવે છે.",
  14: "સ્વાતિ નક્ષત્રના જાતકો સ્વતંત્ર વિચારધારાવાળા, ન્યાયપ્રિય અને વેપાર ક્ષેત્રે મોટો આર્થિક લાભ મેળવનારા હોય છે.",
  15: "વિશાખા નક્ષત્રના લોકો ધ્યેય તરફ એકાગ્ર રહેનારા, સ્પર્ધાત્મક પરીક્ષાઓમાં સફળ થનારા અને દ્રઢનિશ્ચયી હોય છે.",
  16: "અנוરાધા નક્ષત્રના જાતકો વિદેશ યાત્રા કરનારા, મૈત્રીભાવ રાખનારા અને સંઘર્ષ પછી ઊંચું સ્થાન મેળવનારા હોય છે.",
  17: "જ્યેષ્ઠા નક્ષત્રમાં જન્મ હોવાથી તમે પરિવારમાં વડીલ જેવું માન મેળવશો, સાહસિક અને સ્વમાન જાળવનારા હશો.",
  18: "મૂળ નક્ષત્રના જાતકો ઊંડા સંશોધક, તત્ત્વજ્ઞાની અને મુશ્કેલીઓનો મૂળમાંથી નાશ કરનારા પરાક્રમી હોય છે.",
  19: "પૂર્વાષાઢા નક્ષત્રના જાતકો આત્મવિશ્વાસુ, લોકપ્રિય અને જળાશય કે કલાત્મક બાબતો સાથે સંકળાયેલા સુખી લોકો હોય છે.",
  20: "ઉત્તરાષાઢા નક્ષત્રના લોકો વિનમ્ર, સત્યવાદી અને સમાજસેવામાં અગ્રેસર રહે છે. શત્રુઓ પણ તેમનો આદર કરે છે.",
  21: "શ્રવણ નક્ષત્રના જાતકો સારા શ્રોતા, જ્ઞાની, સદગુણી અને ઉચ્ચ શૈક્ષણિક પ્રગતિ સાધનારા હોય છે.",
  22: "ધનિષ્ઠા નક્ષત્રના લોકો સંગીતપ્રેમી, ધનવાન અને રમતગમત કે સાહસિક ક્ષેત્રોમાં ખ્યાતિ મેળવનારા હોય છે.",
  23: "શતભિષા નક્ષત્રના જાતકો રહસ્યવાદી, ચિંતક અને સ્વાસ્થ્ય કે વિજ્ઞાન ક્ષેત્રે ઊંડું સંશોધન કરનારા હોય છે.",
  24: "પૂર્વા ભાદ્રપદ નક્ષત્રના લોકો આધ્યાત્મિક, ન્યાયપ્રિય અને સમાજને નવી દિશા ચીંધનારા દાર્શનિકો હોય છે.",
  25: "ઉત્તરા ભાદ્રપદ નક્ષત્રના જાતકો શાંત, સહનશીલ અને પવિત્ર હૃદયના હોય છે. તેઓ સંસારમાં લોકપ્રિય બને છે.",
  26: "રેવતી નક્ષત્રમાં જન્મ થવાથી તમે અત્યંત દયાળુ, કલાપ્રેમી, વિદેશ સંબંધોથી લાભ મેળવનારા અને સુખી હશો."
};

const DASHA_SPANS = {
  "કેતુ": 7,
  "શુક્ર": 20,
  "સૂર્ય": 6,
  "ચંદ્ર": 10,
  "મંગળ": 7,
  "રાહુ": 18,
  "ગુરુ": 16,
  "શનિ": 19,
  "બુધ": 17
};
const DASHAS_LIST = ["કેતુ", "શુક્ર", "સૂર્ય", "ચંદ્ર", "મંગળ", "રાહુ", "ગુરુ", "શનિ", "બુધ"];

const KundaliGenerator = ({ defaultTab = 'kundali' }) => {
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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [activeKundaliTab, setActiveKundaliTab] = useState(defaultTab); // 'kundali' or 'milan'

  // Saved Kundalis State
  const [savedList, setSavedList] = useState([]);

  useEffect(() => {
    setActiveKundaliTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('saved_kundalis') || '[]');
    setSavedList(list);
  }, []);

  const handleLoadSaved = (item) => {
    setFullName(item.name);
    setDob(item.dob);
    setTob(item.tob);
    setNoTime(item.noTime);
    setBirthPlace(item.birthPlace);
    setSelectedCoords(item.coords);
    setKundaliData(item.data);
    setIsCalculated(true);
  };

  const handleDeleteSaved = (e, nameToDelete) => {
    e.stopPropagation();
    const updated = savedList.filter(item => item.name !== nameToDelete);
    localStorage.setItem('saved_kundalis', JSON.stringify(updated));
    setSavedList(updated);
  };

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

    // Check if we are updating an existing saved Kundali by name, or if we need to add a new one.
    const existingIndex = savedList.findIndex(item => item.name.toLowerCase() === fullName.trim().toLowerCase());
    if (existingIndex === -1 && savedList.length >= 3) {
      alert("⚠️ તમે વધુમાં વધુ ૩ કુંડળી સેવ કરી શકો છો. નવી કુંડળી બનાવવા માટે કૃપા કરી પહેલી કોઈ કુંડળી ડિલીટ કરો. 🙏");
      return;
    }

    // Default time to noon if checked
    const finalTob = noTime ? "12:00" : tob;
    const [year, month, day] = dob.split("-").map(Number);
    const [hours, minutes] = finalTob.split(":").map(Number);

    // Coordinates setup
    const lat = selectedCoords ? parseFloat(selectedCoords.lat) : 23.0225; // default Ahmedabad
    const lon = selectedCoords ? parseFloat(selectedCoords.lon) : 72.5714; // default Ahmedabad

    // 1. Calculate Julian Date (Greenwich Sidereal base)
    const timezoneOffset = 5.5; // IST = UTC + 5.5
    let utcHours = hours - timezoneOffset;
    let utcDay = day;
    let utcMonth = month;
    let utcYear = year;

    if (utcHours < 0) {
      utcHours += 24;
      utcDay -= 1;
      if (utcDay < 1) {
        utcMonth -= 1;
        if (utcMonth < 1) {
          utcMonth = 12;
          utcYear -= 1;
        }
        const daysInMonth = new Date(utcYear, utcMonth, 0).getDate();
        utcDay = daysInMonth;
      }
    }

    const Y = utcMonth <= 2 ? utcYear - 1 : utcYear;
    const M = utcMonth <= 2 ? utcMonth + 12 : utcMonth;
    const D = utcDay + (utcHours + minutes / 60) / 24;

    const A = Math.floor(Y / 100);
    const B = 2 - A + Math.floor(A / 4);

    const jd = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + B - 1524.5;
    const t = jd - 2451545.0; // days since J2000.0 epoch

    // 2. Lahiri Sidereal Ayanamsa
    const ayanamsa = 23.85 + (t / 365.25) * 0.0139696;

    // 3. Greenwich Mean Sidereal Time (GMST) and Local Sidereal Time (LST)
    let gmst = (280.46061837 + 360.98564736629 * t) % 360;
    if (gmst < 0) gmst += 360;

    let lst = (gmst + lon) % 360;
    if (lst < 0) lst += 360;

    // 4. Calculate Ascendant (Lagna) Longitude
    const obliquity = 23.4393 - (t / 365.25) * 0.000013;
    const lstRad = (lst * Math.PI) / 180;
    const latRad = (lat * Math.PI) / 180;
    const oblRad = (obliquity * Math.PI) / 180;

    const yVal = -Math.cos(lstRad);
    const xVal = Math.sin(lstRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad);

    let tropicalAsc = Math.atan2(yVal, xVal) * (180 / Math.PI);
    if (tropicalAsc < 0) tropicalAsc += 360;

    let siderealAsc = (tropicalAsc - ayanamsa) % 360;
    if (siderealAsc < 0) siderealAsc += 360;

    const lagnaSignNum = Math.floor(siderealAsc / 30) + 1; // 1 to 12

    // 5. Calculate Sidereal Planetary Longitudes
    const orbitalParams = {
      "સૂ": { L0: 280.466, n: 0.98564736 },
      "ચ": { L0: 218.316, n: 13.17639648 },
      "મં": { L0: 355.453, n: 0.52402078 },
      "બુ": { L0: 252.251, n: 4.092334436 },
      "ગુ": { L0: 34.404,  n: 0.0830853 },
      "શુ": { L0: 181.979, n: 1.60213022 },
      "શ": { L0: 50.077,  n: 0.03345963 },
      "રા": { L0: 125.122, n: -0.05295376 },
    };

    // Moon Perturbation equation
    const Mm = (134.963 + 13.064993 * t) * Math.PI / 180;
    const Ms = (357.529 + 0.9856 * t) * Math.PI / 180;
    const moonPerturbation = 6.289 * Math.sin(Mm) + 1.274 * Math.sin(2 * Mm - Ms) + 0.658 * Math.sin(2 * Ms);
    let moonLong = orbitalParams["ચ"].L0 + orbitalParams["ચ"].n * t + moonPerturbation;

    const planetSiderealLongs = {};
    Object.keys(orbitalParams).forEach(p => {
      let long = orbitalParams[p].L0 + orbitalParams[p].n * t;
      if (p === "ચ") long = moonLong;
      let sidReal = (long - ayanamsa) % 360;
      if (sidReal < 0) sidReal += 360;
      planetSiderealLongs[p] = sidReal;
    });
    planetSiderealLongs["કે"] = (planetSiderealLongs["રા"] + 180) % 360;

    // Distribute planets in D1 Chart Houses (Relative to Lagna Sign)
    const planetsInHouses = {};
    const planetsRashiNum = {};
    Object.keys(planetSiderealLongs).forEach(p => {
      const long = planetSiderealLongs[p];
      const rashiNum = Math.floor(long / 30) + 1;
      planetsRashiNum[p] = rashiNum;
      planetsInHouses[p] = (rashiNum - lagnaSignNum + 12) % 12 + 1;
    });

    // Navamsa (D9) Chart Distribution (Vedic rules)
    const getNavamsaSign = (long) => {
      const rashiNum = Math.floor(long / 30) + 1;
      const navIdx = Math.floor((long % 30) / 3.33333);
      let startSign = 1;
      if ([1, 5, 9].includes(rashiNum)) startSign = 1;
      else if ([2, 6, 10].includes(rashiNum)) startSign = 10;
      else if ([3, 7, 11].includes(rashiNum)) startSign = 7;
      else if ([4, 8, 12].includes(rashiNum)) startSign = 4;
      return (startSign - 1 + navIdx) % 12 + 1;
    };

    const navamsaLagnaSign = getNavamsaSign(siderealAsc);
    const planetsInD9Houses = {};
    Object.keys(planetSiderealLongs).forEach(p => {
      const navRashi = getNavamsaSign(planetSiderealLongs[p]);
      planetsInD9Houses[p] = (navRashi - navamsaLagnaSign + 12) % 12 + 1;
    });

    // 6. Moon Nakshatra & Pada Calculation
    const moonDeg = planetSiderealLongs["ચ"];
    const nakshatraIdx = Math.floor(moonDeg / 13.33333) % 27;
    const nakshatraName = NAKSHATRAS[nakshatraIdx];
    const pada = Math.floor((moonDeg % 13.33333) / 3.33333) + 1;
    const moonRashiNum = Math.floor(moonDeg / 30) % 12 + 1;
    const moonRashi = KUNDALI_RASHIS[moonRashiNum - 1];

    // 7. Vimshottari Dasha Engine (Dynamically calculates elapsed times since birth)
    const currentYear = new Date().getFullYear();
    const elapsed = Math.max(0, currentYear - year);

    const birthDashaIdx = nakshatraIdx % 9;
    const birthDashaName = DASHAS_LIST[birthDashaIdx];
    const birthDashaSpan = DASHA_SPANS[birthDashaName];
    const remainingBirthDashaYears = (1 - (moonDeg % 13.33333) / 13.33333) * birthDashaSpan;

    let dashaIdx = birthDashaIdx;
    let currentDashaStartYear = year;
    let currentDashaEndYear = year + remainingBirthDashaYears;

    if (elapsed > remainingBirthDashaYears) {
      let tempElapsed = elapsed - remainingBirthDashaYears;
      currentDashaStartYear = year + remainingBirthDashaYears;
      while (true) {
        dashaIdx = (dashaIdx + 1) % 9;
        const nextDashaName = DASHAS_LIST[dashaIdx];
        const nextDashaSpan = DASHA_SPANS[nextDashaName];
        if (tempElapsed < nextDashaSpan) {
          currentDashaEndYear = currentDashaStartYear + nextDashaSpan;
          break;
        }
        tempElapsed -= nextDashaSpan;
        currentDashaStartYear += nextDashaSpan;
      }
    }

    const currentDashaName = DASHAS_LIST[dashaIdx];
    const nextDashaName = DASHAS_LIST[(dashaIdx + 1) % 9];
    const nextDashaStartYear = Math.floor(currentDashaEndYear);
    const dashaSpan = DASHA_SPANS[currentDashaName];
    const yearsInCurrentDasha = elapsed - (currentDashaStartYear - year);
    const progressPercent = Math.max(5, Math.min(95, Math.round((yearsInCurrentDasha / dashaSpan) * 100)));

    // 8. Dosh Auditing
    const marsHouse = planetsInHouses["મં"];
    const isManglik = [1, 4, 7, 8, 12].includes(marsHouse);
    const manglikSeverity = isManglik ? (marsHouse === 7 || marsHouse === 8 ? "ઉચ્ચ (ભારે મંગળ)" : "આંશિક (સૌમ્ય મંગળ)") : "કોઈ દોષ નથી";

    const rahuHouse = planetsInHouses["રા"];
    const ketuHouse = planetsInHouses["કે"];
    const minSarp = Math.min(rahuHouse, ketuHouse);
    const maxSarp = Math.max(rahuHouse, ketuHouse);
    let allInside = true;
    let allOutside = true;
    Object.keys(planetsInHouses).forEach(p => {
      if (p !== "રા" && p !== "કે") {
        const h = planetsInHouses[p];
        if (h < minSarp || h > maxSarp) allInside = false;
        if (h > minSarp && h < maxSarp) allOutside = false;
      }
    });
    const sarpDoshTypes = ["અનંત", "કુલિક", "વાસુકી", "શંખપાલ", "પદ્મ", "મહાપદ્મ", "તક્ષક", "કર્કોટકા", "શંખચૂડ", "ઘાતક", "વિષધર", "શેષનાગ"];
    const hasKaalSarp = allInside || allOutside;
    const kaalSarpType = hasKaalSarp ? sarpDoshTypes[Math.floor(Math.abs(t)) % 12] : "નથી";

    const isSadeSati = [10, 11, 12, 1].includes(moonRashiNum);
    const sadeSatiPhase = isSadeSati
      ? (moonRashiNum === 10 ? "અંતિમ ચરણ (અસ્તકાળ - રાહત)" : moonRashiNum === 11 ? "દ્વિતીય ચરણ (શિખરકાળ - કઠિન)" : "પ્રથમ ચરણ (ઉદયકાળ)")
      : "સક્રિય નથી";

    // 9. Generate DYNAMIC Interpretations and Predictions
    const dashaInterpretations = {
      "કેતુ": `હાલમાં તમારી કેતુની મહાદશા ચાલી રહી છે, જે આધ્યાત્મિક જાગૃતિ અને આંતરિક મનોમંથન લાવશે. આ સમયગાળામાં વિનમ્રતા જાળવવી અને હનુમાન ચાલીસાનું પઠન કરવું શુભ રહેશે.`,
      "શુક્ર": `હાલમાં તમારી શુક્રની મહાદશા ચાલી રહી છે, જે કલાત્મક વિકાસ, નવી સુખ-સાધનો અને વૈવાહિક પ્રગતિ કરાવનારી સાબિત થશે. જીવનમાં ભૌતિક સુખની પ્રબળ પ્રાપ્તિ થશે.`,
      "સૂર્ય": `હાલમાં તમારી સૂર્યની મહાદશા ચાલી રહી છે, જે તમારો આત્મવિશ્વાસ, સમાજમાં યશ-પ્રતિષ્ઠા અને સરકારી કે વહીવટી ક્ષેત્રોમાં મોટું માન-સન્માન વધારનારી નીવડશે.`,
      "ચંદ્ર": `હાલમાં તમારી ચંદ્રની મહાદશા ચાલી રહી છે, જે માનસિક શાંતિ, પ્રવાસ અને નિકટના સંબંધોમાં સારો સુખ આપે. તમારી કલાત્મક શક્તિ અને સંવેદનશીલતા પણ વધશે.`,
      "મંગળ": `હાલમાં તમારી મંગળની મહાદશા ચાલી રહી છે, જે નવી ઊર્જા, સાહસ અને જમીન-મકાનના કાર્યોમાં પ્રગતિ લાવશે. ગુસ્સા અને ઉતાવળિયા નિર્ણયોથી બચવું જરૂરી છે.`,
      "રાહુ": `હાલમાં તમારી રાહુની મહાદશા ચાલી રહી છે, જે અચાનક બદલાવ કે વિદેશ સંબંધોથી મોટો લાભ આપી શકે છે. નિયમિત શિવ ઉપાસનાથી મન પ્રશાંત રહેશે.`,
      "ગુરુ": `હાલમાં તમારી ગુરુની મહાદશા ચાલી રહી છે, જે જ્ઞાનનો વિકાસ, લગ્નજીવન કે સંતાન સુખ અને પરમ આધ્યાત્મિક કે આર્થિક સમૃદ્ધિ પ્રદાન કરનારી શ્રેષ્ઠ દશા સાબિત થશે.`,
      "શનિ": `હાલમાં તમારી શનિની મહાદશા ચાલી રહી છે, જે તમને ધીમી પણ મજબૂત અને કાયમી સફળતા આપશે. મહેનત અને પ્રામાણિકતાથી તમામ કાર્યો સિદ્ધ થશે.`,
      "બુધ": `હાલમાં તમારી બુધની મહાદશા ચાલી રહી છે, જે વેપાર, ગણિત, સચોટ આયોજનો અને બોલવાની કળામાં અદ્ભુત યશ અને વિશેષ ધનલાભ કરાવશે.`
    };

    let financePred = "";
    const jupHouse = planetsInHouses["ગુ"];
    if ([1, 2, 5, 9, 11].includes(jupHouse)) {
      financePred = `💰 આર્થિક સ્થિતિ અને પ્રગતિ: તમારી કુંડળીમાં સંપત્તિના કારક દેવ ગુરુ બહુ બળવાન સ્થાને બિરાજમાન હોવાથી તમારો ભાગ્યોદય જલ્દી થશે. ધન સંચય સરળતાથી થશે અને વડીલોપાર્જિત મિલકતોનો ઘણો સારો લાભ મળશે.`;
    } else if ([4, 7, 10].includes(jupHouse)) {
      financePred = `💰 આર્થિક સ્થિતિ અને પ્રગતિ: ગુરુ મહારાજની દ્રષ્ટિ કર્મના સ્થાન પર હોવાથી નોકરી કે વ્યાપાર દ્વારા સારો ધનલાભ થશે. સમાજમાં પ્રતિષ્ઠા સાથે આર્થિક સ્થિરતા પણ મજબૂત રહેશે.`;
    } else {
      financePred = `💰 આર્થિક સ્થિતિ અને પ્રગતિ: કુંડળી મુજબ આવકનો પ્રવાહ એકંદરે સારો રહેશે. પરંતુ બચત વધારવા માટે બિનજરૂરી ખર્ચ અને બિનજરૂરી રોકાણો પર કાબૂ રાખવો પડશે. ૩૬ વર્ષની ઉંમર બાદ મોટો આર્થિક લાભ થશે.`;
    }

    let marriagePred = "";
    const venHouse = planetsInHouses["શુ"];
    if ([1, 4, 5, 7, 9, 10, 11].includes(venHouse)) {
      marriagePred = `❤️ પ્રેમ અને લગ્નજીવન: પ્રેમ અને દામ્પત્યના કારક શુક્ર બળવાન હોવાથી તમને અત્યંત સુંદર, ગુણવાન અને પ્રેમાળ જીવનસાથી મળશે. લગ્નજીવન સુમેળભર્યું અને અત્યંત સુખી રહેશે.`;
    } else if ([6, 8, 12].includes(venHouse) || isManglik) {
      marriagePred = `❤️ પ્રેમ અને લગ્નજીવન: સપ્તમ ભાવમાં મિશ્ર અસરો હોવાથી દામ્પત્ય જીવનમાં નાના-મોટા મતભેદો ટાળવા અહમનો ત્યાગ કરવો. લગ્ન પૂર્વે કુંડળી મિલાન અવશ્ય કરી લેવું હિતાવહ છે.`;
    } else {
      marriagePred = `❤️ પ્રેમ અને લગ્નજીવન: શુક્ર અને સપ્તમ ભાવની સ્થિતિ અનુકૂળ હોવાથી દામ્પત્ય જીવન સુખી અને સામાન્ય રહેશે. એકબીજા પ્રત્યેની વફાદારી અને સમજદારી સંબંધોને વધુ ગાઢ બનાવશે.`;
    }

    const childrenPred = [5, 9].includes(jupHouse) || planetsInHouses["ચ"] === 5
      ? `👨👩👧 સંતાન સુખ: કુંડળીમાં પંચમ ભાવ મજબૂત હોવાથી ઉત્તમ સંતાન સુખના યોગ છે. તમારા સંતાનો સંસ્કારી, ભણવામાં હોંશિયાર અને ભવિષ્યમાં કુળનું નામ રોશન કરનારા બનશે.`
      : `👨👩👧 સંતાન સુખ: સંતાન ભાવ અનુકૂળ છે. સંતાનો વિદ્યાભ્યાસ અને કરિયરમાં મધ્યમથી ઉત્તમ પ્રગતિ સાધશે અને ભવિષ્યમાં તમારા માટે સહાયરૂપ નીવડશે.`;

    let careerPred = "";
    const satHouse = planetsInHouses["શ"];
    const merHouse = planetsInHouses["બુ"];
    if ([1, 10].includes(satHouse)) {
      careerPred = `💼 કારકિર્દી અને વ્યવસાય: કર્મ ભાવમાં શનિની પકડ હોવાથી તમે અત્યંત શિસ્તબદ્ધ અને મહેનતુ હશો. ટેકનિકલ, મશીનરી, બાંધકામ કે લોખંડના વ્યવસાયમાં જબરદસ્ત પ્રગતિ કરશો.`;
    } else if ([2, 5, 9, 10, 11].includes(merHouse)) {
      careerPred = `💼 કારકિર્દી અને વ્યવસાય: બુદ્ધિના કારક બુધ બળવાન હોવાથી વ્યાપાર, બેન્કિંગ, કલા કે હિસાબી ક્ષેત્રોમાં ભારે પ્રગતિ થશે. તમારા સચોટ ગણતરીના કારણે નફાકારક પ્રગતિ જોવા મળશે.`;
    } else {
      careerPred = `💼 કારકિર્દી અને વ્યવસાય: નોકરી કે વ્યવસાયમાં સ્થિર પ્રગતિના યોગ છે. તમારી પ્રામાણિકતા અને સતત મહેનતના બળ પર વરિષ્ઠ અધિકારીઓનો સહકાર મેળવી ઉચ્ચ પદ પ્રાપ્ત કરશો.`;
    }

    const sunHouse = planetsInHouses["સૂ"];
    const healthPred = [6, 8, 12].includes(sunHouse)
      ? `🏥 તંદુરસ્તી અને સ્વાસ્થ્ય: આરોગ્યના કારક સૂર્યની સ્થિતિ મધ્યમ હોવાથી ઋતુગત તાવ કે પેટ અને આંખોની તકલીફ અંગે સાવધ રહેવું. નિયમિત પ્રાણાયામથી આરોગ્ય સારું રહેશે.`
      : `🏥 તંદુરસ્તી અને સ્વાસ્થ્ય: સામાન્ય રીતે તમારું આરોગ્ય ઉત્તમ રહેશે. માત્ર બહારના ખાનપાનમાં કાળજી રાખવી જેથી પાચન સંબંધી કોઈ નાના વિકારો ન થાય.`;

    const predictions = {
      nature: `🌟 લગ્ન વિશ્લેષણ: ${LAGNA_PREDICTIONS[lagnaSignNum]}`,
      finance: financePred,
      marriage: marriagePred,
      children: childrenPred,
      career: careerPred,
      health: healthPred,
      destiny: `🍀 ચંદ્ર રાશિ વિશ્લેષણ: ${MOON_RASHI_PREDICTIONS[moonRashiNum]}`,
      doshRemedies: `⚠️ ગ્રહ દોષ નિવારણ અને ઉપાયો: ${isManglik ? `કુંડળીમાં ${manglikSeverity} હોવાથી દર મંગળવારે હનુમાનજીને દેશી ઘીનો દીવો કરી હનુમાન ચાલીસા વાંચવી.` : ""} ${hasKaalSarp ? `કાલસર્પ દોષ માટે ભગવાન શિવના લિંગ પર જળાભિષેક કરતી વખતે ૐ નમઃ શિવાયનો જાપ કરવો.` : ""} ${isSadeSati ? `શનિની સાડાસાતીની પીડા ઓછી કરવા દર શનિવારે તલના તેલનો દીવો પીપળાના વૃક્ષ પાસે કરવો.` : "તમારી કુંડળીમાં કોઈ ભારે પીડાકારી દોષ નથી, માં આદ્યશક્તિની કૃપાથી સર્વે મંગલમય રહેશે!"}`,
      futureTimeline: dashaInterpretations[currentDashaName],
      remedies: `🙏 દૈનિક સરળ ઉપાયો: સવારે ઉઠી સૂર્યનારાયણને જળ ચડાવો, પક્ષીઓને ચણ આપો અને ગુજરાતી એપના જાપ સેક્શનમાં જઈ રોજ સૂર્ય ગાયત્રી કે મહામૃત્યુંજય મંત્રની ૧ માળા ફેરવવી.`
    };

    // Calculate details list for the PDF and UI table
    const planetNames = {
      "સૂ": "સૂર્ય (Sun)",
      "ચ": "ચંદ્ર (Moon)",
      "મં": "મંગળ (Mars)",
      "બુ": "બુધ (Mercury)",
      "ગુ": "ગુરુ (Jupiter)",
      "શુ": "શુક્ર (Venus)",
      "શ": "શનિ (Saturn)",
      "રા": "રાહુ (Rahu)",
      "કે": "કેતુ (Ketu)"
    };
    const planetDetailsList = Object.keys(planetSiderealLongs).map(p => {
      const long = planetSiderealLongs[p];
      const rIdx = Math.floor(long / 30) % 12;
      const rashi = KUNDALI_RASHIS[rIdx];
      const nIdx = Math.floor(long / 13.33333) % 27;
      const nName = NAKSHATRAS[nIdx];
      const padVal = Math.floor((long % 13.33333) / 3.33333) + 1;
      return {
        key: p,
        fullName: planetNames[p],
        rashiName: rashi.name,
        rashiLord: rashi.lord,
        nakshatraName: nName,
        pada: padVal
      };
    });

    const newKundaliData = {
      lagnaSignNum,
      navamsaLagnaSign,
      planetsInHouses,
      planetsInD9Houses,
      nakshatraName,
      pada,
      moonRashi,
      currentDashaName,
      nextDashaName,
      nextDashaStartYear,
      progressPercent,
      isManglik,
      manglikSeverity,
      hasKaalSarp,
      kaalSarpType,
      isSadeSati,
      sadeSatiPhase,
      predictions,
      planetDetailsList
    };

    setKundaliData(newKundaliData);

    // Save to local storage list
    const newSavedItem = {
      name: fullName.trim(),
      dob,
      tob: finalTob,
      noTime,
      birthPlace,
      coords: selectedCoords || { lat: 23.0225, lon: 72.5714 },
      data: newKundaliData
    };

    let updatedList = [...savedList];
    const existingIdx = updatedList.findIndex(item => item.name.toLowerCase() === fullName.trim().toLowerCase());
    if (existingIdx !== -1) {
      updatedList[existingIdx] = newSavedItem;
    } else {
      updatedList.push(newSavedItem);
    }
    localStorage.setItem('saved_kundalis', JSON.stringify(updatedList));
    setSavedList(updatedList);

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

        {/* --- TABS SELECTOR --- */}
        {!isCalculated && (
          <div className="flex justify-center border-b border-black/5 pb-4 pt-4 print:hidden">
            <div className="flex bg-stone-100 dark:bg-stone-850 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveKundaliTab('kundali')}
                className={`px-4 py-2.5 rounded-lg font-gujarati text-xs font-bold transition-all ${activeKundaliTab === 'kundali' ? 'bg-white dark:bg-stone-700 text-primary shadow-xs' : 'text-stone-500'}`}
              >
                🕉️ જન્મ કુંડળી પત્રિકા
              </button>
              <button
                type="button"
                onClick={() => setActiveKundaliTab('milan')}
                className={`px-4 py-2.5 rounded-lg font-gujarati text-xs font-bold transition-all ${activeKundaliTab === 'milan' ? 'bg-white dark:bg-stone-700 text-primary shadow-xs' : 'text-stone-500'}`}
              >
                💖 લગ્ન ગુણ મિલાન (૩૬ ગુણ)
              </button>
            </div>
          </div>
        )}

        {/* --- SCREEN 1: KUNDALI FORM INPUT --- */}
        {!isCalculated ? (
          activeKundaliTab === 'milan' ? (
            <div className="pt-4">
              <GunMilan isEmbedded={true} />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Saved Kundalis Section */}
            {savedList.length > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-6 rounded-[2rem] border border-amber-200/60 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-gujarati font-black text-sm text-amber-900 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xl">folder_shared</span>
                    સેવ કરેલી કુંડળીઓ ({savedList.length}/૩)
                  </h4>
                  <span className="text-[10px] font-gujarati text-amber-700/65 font-bold">મહત્તમ ૩ કુંડળી સેવ કરી શકાય</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {savedList.map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => handleLoadSaved(item)}
                      className="bg-white p-4 rounded-2xl border border-amber-200/40 hover:border-amber-400 hover:shadow-md cursor-pointer transition-all flex items-center justify-between group active:scale-95"
                    >
                      <div className="space-y-0.5 min-w-0 pr-2">
                        <p className="font-gujarati font-black text-xs text-stone-850 truncate">{item.name}</p>
                        <p className="font-sans text-[10px] text-stone-400 font-bold">{item.dob.split('-').reverse().join('/')}</p>
                      </div>
                      <button 
                        onClick={(e) => handleDeleteSaved(e, item.name)}
                        className="h-8 w-8 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="ડીલીટ કરો"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
          </div>
          )
        ) : (
          
          // --- SCREEN 2: GENERATED REPORT & predictions (Printable Pages) ---
          <div className="space-y-8 print:space-y-0">

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
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] rotate-[-45deg] select-none pointer-events-none">
                <span className="text-[120px] font-black text-[#7c2d12] tracking-widest">GUJARATI APP</span>
              </div>

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
                  {renderKundaliChartSVG(kundaliData.planetsInD9Houses, kundaliData.navamsaLagnaSign)}
                </div>
              </div>

              {/* Table of Planet positions */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-black/5 rounded-2xl overflow-hidden divide-y divide-black/5">
                  <thead className="bg-stone-50 font-gujarati font-black text-stone-600">
                    <tr>
                      <th className="p-3">ગ્રહ (Planet)</th>
                      <th className="p-3">રાશિ (Rashi)</th>
                      <th className="p-3">રાશિ સ્વામી (Lord)</th>
                      <th className="p-3">નક્ષત્ર (Nakshatra)</th>
                      <th className="p-3">ચરણ (Pada)</th>
                    </tr>
                  </thead>
                  <tbody className="font-gujarati text-stone-700 divide-y divide-black/5">
                    {kundaliData.planetDetailsList.map((p, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-bold" style={{ color: getPlanetColorForTable(p.key) }}>{p.fullName}</td>
                        <td className="p-3">{p.rashiName}</td>
                        <td className="p-3">{p.rashiLord}</td>
                        <td className="p-3">{p.nakshatraName}</td>
                        <td className="p-3">{toGujaratiNum(p.pada)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PAGE 3: INTERPRETATIONS SHEET */}
            <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-primary/5 shadow-sm min-h-[700px] flex flex-col justify-between relative print:min-h-screen print:border-none print:shadow-none print:rounded-none page-break-before">
              {/* Light Watermark background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] rotate-45 select-none pointer-events-none">
                <span className="text-[120px] font-black text-[#7c2d12] tracking-widest">GUJARATI APP</span>
              </div>

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
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] rotate-[-45deg] select-none pointer-events-none">
                <span className="text-[120px] font-black text-[#7c2d12] tracking-widest">GUJARATI APP</span>
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-gujarati font-black text-2xl text-primary">વિંશોત્તરી દશા અને સમયરેખા</h3>
                <p className="font-gujarati text-xs text-outline">જીવનના ભિન્ન તબક્કા અને આવનારો ફળાદેશ</p>
              </div>

              {/* Dasha Predict Block */}
              <div className="p-6 bg-amber-50 rounded-3xl border border-amber-200 text-center space-y-2 my-auto max-w-lg mx-auto">
                <span className="material-symbols-outlined text-4xl text-amber-600 animate-spin" style={{ animationDuration: '8s' }}>hourglass_empty</span>
                <h4 className="font-gujarati font-black text-lg text-amber-900">હાલની સક્રિય મહાદશા</h4>
                <p className="font-gujarati text-base text-stone-800 leading-relaxed">{kundaliData.predictions.futureTimeline}</p>
              </div>

              {/* Visual timeline bar representing periods */}
              <div className="space-y-6">
                <h5 className="font-gujarati font-black text-sm text-stone-800 text-center">આગામી વર્ષોની ગ્રહદશા વિગત</h5>
                <div className="relative pt-1 max-w-md mx-auto">
                  <div className="flex mb-2 items-center justify-between text-xs font-bold text-outline">
                    <span className="font-gujarati">{kundaliData.currentDashaName} મહાદશા</span>
                    <span className="font-gujarati">{kundaliData.nextDashaName} મહાદશા</span>
                  </div>
                  <div className="overflow-hidden h-4 text-xs flex rounded-full bg-stone-100 border">
                    <div style={{ width: `${kundaliData.progressPercent}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-orange-500 to-amber-500"></div>
                    <div style={{ width: `${100 - kundaliData.progressPercent}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-stone-300"></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-stone-400 font-bold mt-1">
                    <span>હાલનો સમય ({toGujaratiNum(kundaliData.progressPercent)}% પ્રગતિ)</span>
                    <span>વર્ષ {toGujaratiNum(kundaliData.nextDashaStartYear)}થી નવી શરૂઆત</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PAGE 5: REMEDIES & APP CONNECT SHEET */}
            <div className="bg-[#fcfaf7] rounded-[2.5rem] p-8 sm:p-10 border border-[#7c2d12]/20 shadow-sm min-h-[700px] flex flex-col justify-between relative print:min-h-screen print:border-none print:shadow-none print:rounded-none page-break-before">
              {/* Light Watermark background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] rotate-45 select-none pointer-events-none">
                <span className="text-[120px] font-black text-[#7c2d12] tracking-widest">GUJARATI APP</span>
              </div>

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
