import { useState, useEffect, useRef } from 'react';

const MYSTERIES = [
  {
    id: "m_dumas",
    title_gu: "દુમસ બીચના કાળા રહસ્યો",
    title_en: "Secrets of Dumas Beach",
    place: "સુરત (Surat)",
    avatar: "💀",
    intro: "સુરત પાસે આવેલો દુમસ બીચ પોતાની કાળી રેતી અને સુંદર દૃશ્યો માટે જાણીતો છે. પરંતુ સૂર્યાસ્ત પછી અહીં કેમ કોઈને રોકાવા દેવામાં આવતું નથી? સ્થાનિક લોકોનું કહેવું છે કે રાત્રે અહીંથી વિચિત્ર અવાજો અને રડવાનો અવાજ સંભળાય છે, અને અદ્રશ્ય પવન ફૂંકાય છે. પ્રાચીન સમયમાં આ સ્થળ સ્મશાન ભૂમિ તરીકે વપરાતું હોવાથી આ વાતો વધુ ફેલાઈ છે.",
    riddle: "હું કાળી રેતી ધરાવતો સુરતનો એક દરિયા કિનારો છું. અગાઉ અહીં સ્મશાન ભૂમિ હતી અને આજે પણ રાત્રે લોકો અહી આવતા ડરે છે. જણાવો મારું નામ શું છે?",
    options: ["સુવાલી બીચ", "દુમસ બીચ", "દાંડી બીચ"],
    correctAnswer: "દુમસ બીચ",
    climax: "વૈજ્ઞાનિક અને વાસ્તવિક સત્ય: સંશોધનો મુજબ, આ કિનારાની ભૌગોલિક રચનાને કારણે રાત્રે ફૂંકાતો પવન અને કાળી રેતીમાં રહેલા આયર્ન ઑક્સાઇડ (Iron oxide) ના કણો વચ્ચે થતા ઘર્ષણને લીધે એક ખાસ ધ્વનિ તરંગ ઉત્પન્ન થાય છે જે કોઈ રહસ્યમય અવાજ જેવો સંભળાય છે. તદુપરાંત, ભરતીના પાણીના જોખમને કારણે સુરક્ષા વિભાગે રાત્રે અહીં જવાની બંધી મૂકી છે.",
    coinsReward: 25
  },
  {
    id: "m_lakhpat",
    title_gu: "લખપતનો ઉજ્જડ કિલ્લો",
    title_en: "The Ghost Town of Lakhpat",
    place: "કચ્છ (Kutch)",
    avatar: "🏰",
    intro: "૧૮મી સદીમાં લખપત એક ધમધમતું બંદર હતું જ્યાંથી લાખો રૂપિયાની આવક જકાત સ્વરૂપે થતી હતી. અહીંથી સિંધુ નદી વહેતી હતી જેને કારણે ડાંગરની ખેતી વિપુલ પ્રમાણમાં થતી હતી. પરંતુ અચાનક ૧૮૧૯ પછી આ સમૃદ્ધ નગર એક ભૂતિયા અને ઉજ્જડ ખંડેરમાં ફેરવાઈ ગયું! આખું ગામ એક જ રાતમાં કેમ ખાલી થઈ ગયું?",
    riddle: "કચ્છની સરહદે આવેલો હું એક ઐતિહાસિક કિલ્લો છું. ૧૮૧૯ ના એક શક્તિશાળી ભૂકંપે સિંધુ નદીનો માર્ગ બદલી નાખ્યો અને હું કાયમ માટે ઉજ્જડ બની ગયો. હું કોણ છું?",
    options: ["રોહા કિલ્લો", "ભuજિયો કિલ્લો", "લખપત કિલ્લો"],
    correctAnswer: "લખપત કિલ્લો",
    climax: "ઐતિહાસિક સત્ય: ઈ.સ. ૧૮૧૯ માં કચ્છમાં આવેલા ભયાનક ભૂકંપને કારણે જમીનનો એક મોટો હિસ્સો ઊંચો આવી ગયો (જેને અલ્લાહ બંધ કહેવાય છે). આના લીધે સિંધુ નદીનો પ્રવાહ બદલાઈને પશ્ચિમ તરફ (હાલના પાકિસ્તાન તરફ) વહી ગયો. નદીનો પ્રવાહ બદલાતાં ખેતી અને જળમાર્ગ ઠપ્પ થઈ ગયા, અને લોકો રોજીરોટીની શોધમાં નગર છોડી પલાયન થઈ ગયા.",
    coinsReward: 25
  },
  {
    id: "m_kalodungar",
    title_gu: "કાળા ડુંગરનું એન્ટિ-ગ્રેવિટી રહસ્ય",
    title_en: "Magnetic Gravity of Kalo Dungar",
    place: "કચ્છ (Kutch)",
    avatar: "⛰️",
    intro: "કચ્છનો સૌથી ઊંચો પર્વત એટલે કાળો ડુંગર. અહીંના ચઢાણ વાળા રસ્તા પર એક રહસ્યમય બિંદુ આવેલું છે. જો તમે તમારી ગાડીને ચાવી બંધ કરીને ન્યુટ્રલ ગેરમાં મૂકો, તો પણ ગાડી ઢાળ તરફ ઉતરવાને બદલે આપમેળે પર્વત તરફ ઉપર ચઢવા લાગે છે! વાહનની સ્પીડ ૮૦ કિમી/કલાક સુધી પહોંચી જાય છે. શું અહીં કોઈ દૈવી શક્તિ છે?",
    riddle: "હું કચ્છનો સૌથી ઊંચો પર્વત છું. મારા રસ્તા પર ગુરુત્વાકર્ષણ ઉલટું કામ કરતું હોય તેમ બંધ ગાડી પણ પર્વત તરફ ચઢવા લાગે છે. જણાવો મારું નામ શું છે?",
    options: ["કાળો ડુંગર", "ધીણોધર ડુંગર", "ભુજિયો ડુંગર"],
    correctAnswer: "કાળો ડુંગર",
    climax: "વૈજ્ઞાનિક સત્ય: આ ઘટના પાછળ કોઈ ચમત્કાર નથી પરંતુ એક ભૌગોલિક 'ઓપ્ટિકલ ઇલ્યુઝન' (નજરનો ભ્રમ) છે. આજુબાજુની પહાડીઓ અને ક્ષિતિજ (Horizon) ના ઢોળાવને કારણે રસ્તો આપણને ચઢાણ જેવો દેખાય છે, જ્યારે હકીકતમાં તે રસ્તો નીચેની તરફ ઢળતો હોય છે. તેથી ગુરુત્વાકર્ષણને કારણે વાહન આપમેળે સરકે છે પરંતુ આપણને તે ઉપર જતું લાગે છે.",
    coinsReward: 25
  },
  {
    id: "m_tulsishyam",
    title_gu: "તુલસીશ્યામનું રહસ્યમય પાણી",
    title_en: "The Miracle Springs",
    place: "ગીર સોમનાથ (Gir Somnath)",
    avatar: "⛲",
    intro: "અહીં જંગલની વચ્ચે ગરમ પાણીના કુંડ આવેલા છે. આજુબાજુ બધે સામાન્ય તાપમાન હોવા છતાં, આ કુંડનું પાણી ૨૪ કલાક ઉકળતું રહે છે અને તેમાં સ્નાન કરવાથી ચામડીના રોગો મટી જાય છે. તેની પાછળનું વૈજ્ઞાનિક કારણ આજે પણ રહસ્ય છે.",
    riddle: "હું ગીરના જંગલોની વચ્ચે આવેલો ગરમ પાણીનો કુંડ છું. બધે સામાન્ય વાતાવરણ હોવા છતાં મારું પાણી ૨૪ કલાક ઉકળતું રહે છે. હું કઈ જગ્યા છું?",
    options: ["તુલસીશ્યામ", "ગરમ કુંડ", "ઉનાઈ"],
    correctAnswer: "તુલસીશ્યામ",
    climax: "વૈજ્ઞાનિક કારણ: જમીનની નીચે ટેક્ટોનિક પ્લેટોના હલનચલન અને સલ્ફર (Sulfur) જેવા ખનિજોના કારણે ભૂગર્ભીય ગરમી ઉત્પન્ન થાય છે, જે પાણીને ઉકાળે છે. આ ગરમ પાણીમાં સલ્ફર ઓગળેલું હોવાથી તે કુદરતી એન્ટિ-સેપ્ટિક બને છે અને ચામડીના રોગો મટાડે છે.",
    coinsReward: 25
  },
  {
    id: "m_kabirvad",
    title_gu: "કબીરવડ: એક જ વડનું આખું જંગલ!",
    title_en: "The Single-Tree Forest",
    place: "ભરૂચ (Bharuch)",
    avatar: "🌳",
    intro: "નર્મદા નદીના બેટ પર આવેલો આ વડ અંદાજે ૩૦૦ વર્ષ જૂનો છે. આ વડ એટલો મોટો ફેલાયેલો છે કે તેનું મૂળ (Main Trunk) કયું છે તે શોધવું આજે પણ અશક્ય છે.",
    riddle: "હું નર્મદા નદીના કબીર ટેકરા પર આવેલો ૩૦૦ વર્ષ જૂનો વડલો છું. મારો ઘેરાવ એટલો મોટો છે કે હું આખું જંગલ લાગું છું. જણાવો મારું નામ?",
    options: ["ભાલકા વડ", "કબીરવડ", "અક્ષયવડ"],
    correctAnswer: "કબીરવડ",
    climax: "વૈજ્ઞાનિક સત્ય: વડના ઝાડમાં વડવાઈઓ (Prop Roots) જમીનમાં ઉતરીને નવા થડ બને છે. સેંકડો વર્ષો સુધી આ પ્રક્રિયા ચાલવાને કારણે વડવાઈઓ જ કદાવર થડ બની ગઈ છે, જેથી મુખ્ય થડ કયું છે તે ઓળખી શકાતું નથી. આ એક કુદરતી વનસ્પતિ પ્રસાર પ્રક્રિયા છે.",
    coinsReward: 25
  },
  {
    id: "m_avdhut",
    title_gu: "સિદ્ધપુરનું મુક્તિધામ અથવા રાજકોટનું બગવાડા",
    title_en: "Horror Legends",
    place: "ખેડા / આણંદ (Kheda/Anand)",
    avatar: "🏚️",
    intro: "ગુજરાતમાં કેટલીક એવી હવેલીઓ અને જૂના બંગલા છે (જેમ કે લોથલ નજીકના અવાવરું વિસ્તારો કે સુરતના ડુમસની જેમ જ ચર્ચામાં રહેતા સ્પોટ્સ) જ્યાં રાત્રે વિચિત્ર અવાજો આવતા હોવાની લોકવાયકા છે.",
    riddle: "ગુજરાતમાં હોરર પેરાનોર્મલ દંતકથાઓ માટે કઈ જગ્યાઓ રાત્રે અવાજો આવવા માટે ચર્ચામાં રહે છે?",
    options: ["બગવાડા અને મુક્તિધામ", "દક્ષિણામૂર્તિ", "નવા ગામો"],
    correctAnswer: "બગવાડા અને મુક્તિધામ",
    climax: "વાસ્તવિક સત્ય: વૈજ્ઞાનિક રીતે આ સ્પોટ્સ અવાવરું હોવાથી ત્યાં પક્ષીઓ, ચામાચીડિયાં અને રાત્રિચર પ્રાણીઓના અવાજો તથા જૂની ઇમારતોની તિરાડોમાંથી પસાર થતા પવનને કારણે અવાજો ઉત્પન્ન થાય છે જેને લોકો ભૂત-પ્રેત માની લે છે.",
    coinsReward: 25
  },
  {
    id: "m_dhamaldance",
    title_gu: "સિદ્દીઓનું રહસયમય ધમાલ નૃત્ય",
    title_en: "The Mystical Rhythms",
    place: "ભરૂચ (Bharuch)",
    avatar: "🥁",
    intro: "આફ્રિકાથી આવીને ભરૂચમાં વસેલા સિદ્દી સમુદાયના લોકો જ્યારે આ નૃત્ય કરે છે, ત્યારે તેઓ એક અલગ જ ટ્રાન્સ (ધૂન) માં જતા રહે છે અને લોખંડના નાળિયેર હવામાં ઉછાળી પોતાના માથા પર ફોડે છે, છતાં તેમને લોહી નીકળતું નથી!",
    riddle: "આફ્રિકાથી આવી ભરૂચમાં વસેલી જાતિનું કયું નૃત્ય પ્રખ્યાત છે જેમાં લોકો પોતાના માથા પર નાળિયેર ફોડે છે?",
    options: ["ગિર ગરબા", "ધમાલ નૃત્ય", "ટીપ્પણી નૃત્ય"],
    correctAnswer: "ધમાલ નૃત્ય",
    climax: "સત્ય વિગત: આ નૃત્ય દરમિયાન ઉત્પન્ન થતો સંગીતનો લય (Rhythm) અને સતત ઝડપી હલનચલન નર્તકોમાં એડ્રેનાલિન (Adrenaline) હોર્મોન વધારી દે છે. ટ્રાન્સ અને ઊંડી એકાગ્રતાને લીધે તેમનું મગજ પીડાના સંકેતો બ્લોક કરી દે છે, અને વર્ષોના અભ્યાસથી તેઓ નાળિયેર ફોડવાની સચોટ કળા શીખેલા હોય છે.",
    coinsReward: 25
  },
  {
    id: "m_stambheshwar",
    title_gu: "ગાયબ થતું મંદિર",
    title_en: "The Vanishing Temple",
    place: "કાવી કંબોઈ (Kavi Kamboi)",
    avatar: "🛕",
    intro: "આ મંદિર દરિયા કિનારે આવેલું છે. દિવસમાં બે વાર જ્યારે ભરતી આવે ત્યારે આખું શિવલિંગ અને મંદિર દરિયાના પાણીમાં ગરકાવ (ગાયબ) થઈ જાય છે અને ઓટ આવતા જ ફરી બહાર દેખાય છે. પ્રકૃતિનો આ અદ્ભુત નજારો જોવા જેવો હોય છે.",
    riddle: "દરિયા કાંઠે આવેલું ગુજરાતનું કયું અદ્ભુત મંદિર છે જે દિવસમાં બે વાર ભરતી સમયે પાણીમાં અદ્રશ્ય થઈ જાય છે?",
    options: ["સ્તંભેશ્વર મહાદેવ", "નિષ્કલંક મહાદેવ", "ભડિયાદ પીર"],
    correctAnswer: "સ્તંભેશ્વર મહાદેવ",
    climax: "વૈજ્ઞાનિક સત્ય: આ કોઈ જાદુ નથી પણ સમુદ્રની ભરતી-ઓટ (High/Low Tide) ની ભૌતિક ક્રિયા છે. દર પૂનમ અને અમાસની આજુબાજુ ભરતીના પાણીનું સ્તર એટલું વધી જાય છે કે કાંઠા નજીકનું આ નીચું મંદિર પાણીથી ઢંકાઈ જાય છે. ઓટ આવતા જ પાણી ઓસરી જાય છે અને મંદિર ફરી દેખાય છે.",
    coinsReward: 25
  },
  {
    id: "m_zanzari",
    title_gu: "પથ્થરોમાંથી વહેતી રહસ્યમય ગંગા",
    title_en: "The Perennial Gaumukh",
    place: "દહેગામ (Dahegam)",
    avatar: "💦",
    intro: "વાત્રક નદીના કિનારે આવેલા આ પૌરાણિક સ્થાન પર એક ગાયના આકારના પથ્થર (ગૌમુખ) માંથી સતત પાણી વહેતું રહે છે. ઉનાળામાં નદી સુકાઈ જાય તો પણ આ પાણી ક્યારેય બંધ નથી થતું.",
    riddle: "દહેગામ નજીક વાત્રક કાંઠે આવેલા કયા ધામ પર ગૌમુખ પથ્થરમાંથી બારેમાસ અવિરત પાણી વહે છે?",
    options: ["ઝાંઝરી ગંગામાતા", "કબીર ટેકરી", "ઉત્કંઠેશ્વર"],
    correctAnswer: "ઝાંઝરી ગંગામાતા",
    climax: "વૈજ્ઞાનિક કારણ: પહાડીની નીચે પથ્થરોમાં ચોમાસા દરમિયાન શોષાયેલું પાણી ભૂગર્ભ નહેરો (Aquifers) માં સંગ્રહિત થાય છે. આ ભૂગર્ભ જળસ્ત્રોત કુદરતી દબાણને લીધે ગૌમુખ મુખમાંથી બહાર વહે છે, જે નદી સુકાવા છતાં સતત ચાલુ રહે છે.",
    coinsReward: 25
  },
  {
    id: "m_adikadi",
    title_gu: "અડી-કડી વાવનું લોહીયાળ રહસ્ય",
    title_en: "The Cursed Stepwell",
    place: "જૂનાગઢ (Junagadh)",
    avatar: "🕳️",
    intro: "આ વાવ કોઈ ઈંટ-પથ્થર જોડીને નથી બની, પણ આખો એક જ પહાડ કોતરીને બનાવવામાં આવી છે. એવી લોકવાયકા છે કે વાવ ખોદતી વખતે પાણી નહોતું નીકળ્યું, ત્યારે બે કન્યાઓનું બલિદાન આપવામાં આવ્યું હતું.",
    riddle: "જૂનાગઢના ઉપરકોટ કિલ્લામાં આવેલી કઈ વાવ કોઈ પથ્થર જોડ્યા વિના આખો પહાડ કોતરીને અનોખી શૈલીમાં બનેલી છે?",
    options: ["અડી-કડી વાવ", "રાણકી વાવ", "અડાલજની વાવ"],
    correctAnswer: "અડી-કડી વાવ",
    climax: "વૈજ્ઞાનિક અને આર્કિટેક્ચરલ સત્ય: આ વાવ નરમ ભૂસ્તર કોતરીને બનાવવામાં આવી છે. પથ્થરો જોડ્યા વગર એક અખંડ ખડકમાંથી ૧૨૦ પગથિયાં કોતરીને છેક નીચે કૂવા સુધી જવા માટેનો માર્ગ કાઢવામાં આવ્યો છે. કન્યાઓના બલિદાનની વાત માત્ર કાલ્પનિક લોકવાયકા છે, આ માત્ર પ્રાચીન ઇજનેરી કૌશલ્ય છે.",
    coinsReward: 25
  },
  {
    id: "m_raiyoli_mystery",
    title_gu: "જુરાસિક પાર્ક ઇન ગુજરાત",
    title_en: "The Dinosaur Graveyard",
    place: "મહીસાગર (Balasinor)",
    avatar: "🦕",
    intro: "કરોડો વર્ષ પહેલાં ગુજરાતમાં પણ ડાયનાસોર રહેતા હતા! અહીંથી ડાયનાસોરના અસલી ઈંડા અને અશ્મિઓ (Fossils) મળી આવ્યા છે. ભારતનું આ સૌથી મોટું ડાયનાસોર રહસ્ય છે.",
    riddle: "ગુજરાતના કયા જિલ્લાના રાયઓલી ગામમાંથી ભારતમાં સૌથી વધુ ડાયનાસોરના ઈંડા અને અશ્મિઓ મળી આવ્યા છે?",
    options: ["મહીસાગર (બાલાસિનોર)", "ખેડા", "સાબરકાંઠા"],
    correctAnswer: "મહીસાગર (બાલાસિનોર)",
    climax: "વૈજ્ઞાનિક સત્ય: ભૂસ્તરશાસ્ત્રીય સંશોધનો અનુસાર, ક્રીટેશિયસ સમયગાળા દરમિયાન મહીસાગર નદીની ખીણ પ્રદેશ ડાયનાસોર માટે રહેવા અને સંવર્ધન માટે ઉત્તમ અનુકૂળતા ધરાવતો હતો. રાયઓલીમાં જે અશ્મિભૂત ઈંડા મળ્યા છે તે રાજસૌરસ નર્મદેન્સિસ (Rajasaurus narmadensis) નામના એક વિશેષ ભારતીય ડાયનાસોર પ્રજાતિના હોવાનું પુરવાર થયું છે.",
    coinsReward: 25
  }
];

export default function MysteryHub() {
  const [solvedMysteries, setSolvedMysteries] = useState({});
  const [selectedMystery, setSelectedMystery] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isScratching, setIsScratching] = useState(false);
  const [showRiddleModal, setShowRiddleModal] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [scratchedToReveal, setScratchedToReveal] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const solved = JSON.parse(localStorage.getItem('otlo_solved_mysteries') || '{}');
    setSolvedMysteries(solved);
  }, []);

  const handleOpenMystery = (mystery) => {
    setSelectedMystery(mystery);
    setSelectedAnswer("");
    setScratchPercent(0);
    setScratchedToReveal(false);
    setShowRiddleModal(true);
  };

  const handleAnswerSubmit = (option) => {
    setSelectedAnswer(option);
    if (option === selectedMystery.correctAnswer) {
      // Mark as solved
      const updated = { ...solvedMysteries, [selectedMystery.id]: true };
      localStorage.setItem('otlo_solved_mysteries', JSON.stringify(updated));
      setSolvedMysteries(updated);

      // Reward Coins
      const coins = parseInt(localStorage.getItem('gujarat_coins') || '0', 10);
      localStorage.setItem('gujarat_coins', (coins + selectedMystery.coinsReward).toString());
      window.dispatchEvent(new Event('coins-updated'));
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: `🎉 કોયડો સાચો! રહસ્ય ખૂલી ગયું છે! (+${selectedMystery.coinsReward} સિક્કા)` } }));
    } else {
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: `❌ ખોટો જવાબ! ફરીથી વિચારો.` } }));
    }
  };

  // Canvas Scratching for Climax Reveal (in case they don't want to solve the riddle)
  useEffect(() => {
    if (isScratching && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = 300;
      canvas.height = 180;

      // Draw dark parchment layer
      ctx.fillStyle = '#4a2f1b';
      ctx.fillRect(0, 0, 300, 180);

      ctx.font = 'bold 15px sans-serif';
      ctx.fillStyle = '#e6ccb2';
      ctx.textAlign = 'center';
      ctx.fillText('રહસ્ય ઘસીને પ્રગટ કરો 🕵️‍♂️', 150, 80);
      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#b5835a';
      ctx.fillText('જવાબ ખબર ન હોય તો અહીં ઘસો (+૧૦ કોઈન્સ)', 150, 110);

      // Texture dots
      ctx.fillStyle = 'rgba(230,204,178,0.15)';
      for (let x = 10; x < 300; x += 20) {
        for (let y = 10; y < 180; y += 20) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }, [isScratching]);

  const handleScratchMove = (e) => {
    if (!isScratching || scratchedToReveal || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Get mouse/touch coordinates
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 32;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();

    // Calculate percent scratched
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) transparent++;
    }
    const pct = Math.round((transparent / (pixels.length / 16)) * 100);
    setScratchPercent(pct);

    if (pct > 45) {
      setScratchedToReveal(true);
      // Mark solved
      const updated = { ...solvedMysteries, [selectedMystery.id]: true };
      localStorage.setItem('otlo_solved_mysteries', JSON.stringify(updated));
      setSolvedMysteries(updated);

      // Reward lesser Coins for skipping the riddle
      const coins = parseInt(localStorage.getItem('gujarat_coins') || '0', 10);
      localStorage.setItem('gujarat_coins', (coins + 10).toString());
      window.dispatchEvent(new Event('coins-updated'));
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: `📜 રહસ્ય પ્રગટ થયું! (+૧૦ સિક્કા)` } }));
    }
  };

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      {/* Page Header */}
      <div className="space-y-1">
        <h2 className="font-gujarati font-black text-4xl text-primary">ગુજરાતના રહસ્યો (Mystery Hub) 🕵️‍♂️</h2>
        <p className="font-gujarati text-outline text-lg">શું તમે આ વણઉકેલાયેલી વાર્તાઓ અને સ્થળો પાછળ છુપાયેલું વિજ્ઞાન અને સત્ય જાણવા તૈયાર છો?</p>
      </div>

      {/* Mysteries Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MYSTERIES.map((m) => {
          const isSolved = !!solvedMysteries[m.id];
          return (
            <div 
              key={m.id}
              onClick={() => handleOpenMystery(m)}
              className="cursor-pointer bg-[#fbf5ee] dark:bg-stone-900 border-2 border-[#d5bdaf]/40 hover:border-amber-600/40 p-6 rounded-[2.5rem] shadow-sm flex flex-col justify-between gap-5 relative overflow-hidden transition-all duration-350 hover:scale-[1.02] group"
            >
              {/* Parchment texture simulation overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#d5bdaf_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>

              {/* Status Header Badge */}
              <div className="flex justify-between items-center z-10">
                <span className="bg-[#f0e6df] dark:bg-stone-850 px-3.5 py-1.5 rounded-full text-xs font-gujarati font-black text-stone-700 dark:text-stone-300">
                  📍 {m.place}
                </span>
                <span className={`text-xs font-gujarati font-black px-3 py-1 rounded-full ${isSolved ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450' : 'bg-amber-500/10 text-amber-700 dark:bg-amber-950/20 dark:text-amber-450'}`}>
                  {isSolved ? "ખોલેલ ✓" : "લોક થયેલ 🔒"}
                </span>
              </div>

              {/* Mystery Meta Info */}
              <div className="space-y-3 z-10 flex-1">
                <div className="flex gap-3 items-center">
                  <span className="text-4xl filter drop-shadow-sm select-none">{m.avatar}</span>
                  <div>
                    <h4 className="font-gujarati font-black text-xl text-stone-850 dark:text-stone-100 group-hover:text-primary transition-colors leading-tight">
                      {m.title_gu}
                    </h4>
                    <p className="font-gujarati text-[10px] text-stone-400 font-bold mt-0.5">({m.title_en})</p>
                  </div>
                </div>
                <p className="font-gujarati font-bold text-xs text-stone-605 dark:text-stone-300 line-clamp-3 leading-relaxed">
                  {m.intro}
                </p>
              </div>

              {/* Action Button at bottom */}
              <button className={`w-full py-3.5 rounded-2xl font-gujarati font-black text-xs transition-all z-10 active:scale-95 ${isSolved ? 'bg-emerald-500 hover:bg-emerald-450 text-white shadow-md' : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'}`}>
                {isSolved ? "સત્ય વાંચો 📖" : "કોયડો ઉકેલો / સ્ક્રેચ કરો 🔓"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Riddle & Scratch Unlock Modal */}
      {showRiddleModal && selectedMystery && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in overflow-y-auto">
          <div className="bg-[#faf1e6] dark:bg-stone-950 border-4 border-[#8c6239]/20 text-stone-850 dark:text-stone-100 rounded-[2.5rem] p-6 max-w-lg w-full shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Close modal Button */}
            <button
              onClick={() => {
                setShowRiddleModal(false);
                setIsScratching(false);
              }}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-[#f0d8c0]/50 hover:bg-[#e0c8b0] text-[#5c3e21] dark:bg-stone-850 dark:text-stone-300 flex items-center justify-center transition-all"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            {/* Mystery Header */}
            <div className="flex gap-4 items-center border-b-2 border-dashed border-[#d5bdaf]/30 pb-4">
              <span className="text-4xl filter drop-shadow-md select-none">{selectedMystery.avatar}</span>
              <div>
                <h3 className="font-gujarati font-black text-2xl text-[#5c3e21] dark:text-[#f4d6b6]">{selectedMystery.title_gu}</h3>
                <p className="font-gujarati text-[10px] text-stone-400 font-bold">({selectedMystery.title_en}) • {selectedMystery.place}</p>
              </div>
            </div>

            {/* Story Introduction text */}
            <div className="bg-white/40 dark:bg-stone-900/40 border border-[#d5bdaf]/10 p-5 rounded-3xl leading-relaxed text-sm font-gujarati font-bold">
              {selectedMystery.intro}
            </div>

            {/* Solved state view or Riddle solving state */}
            {solvedMysteries[selectedMystery.id] ? (
              <div className="space-y-4 bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl animate-fade-in">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <span className="material-symbols-outlined text-2xl">verified</span>
                  <h4 className="font-gujarati font-black text-lg">રહસ્યનું સત્ય (Revealed Truth)</h4>
                </div>
                <p className="font-gujarati font-bold text-sm text-stone-750 dark:text-stone-200 leading-relaxed">
                  {selectedMystery.climax}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Mode Selector Option: Riddle vs Scratch Card */}
                {!isScratching ? (
                  <div className="space-y-5">
                    {/* Riddle Box */}
                    <div className="bg-[#f0e0d0]/60 dark:bg-stone-900 border border-[#8c6239]/20 p-5 rounded-3xl relative">
                      <span className="bg-[#8c6239] text-[#faf1e6] px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest absolute -top-3 left-4">
                        કોયડો / Riddle 💡
                      </span>
                      <p className="font-gujarati font-black text-sm text-[#5c3e21] dark:text-[#f4d6b6] leading-relaxed mt-1">
                        "{selectedMystery.riddle}"
                      </p>
                    </div>

                    {/* Multiple Choice Options */}
                    <div className="space-y-3">
                      <p className="font-gujarati text-[10px] text-stone-400 font-bold uppercase tracking-widest pl-2">સાચો જવાબ પસંદ કરો:</p>
                      <div className="grid grid-cols-1 gap-2.5">
                        {selectedMystery.options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAnswerSubmit(option)}
                            className={`w-full py-4 px-5 rounded-2xl font-gujarati font-black text-sm text-left border-2 transition-all active:scale-[0.99] flex items-center justify-between ${selectedAnswer === option ? (option === selectedMystery.correctAnswer ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-rose-500 text-white border-rose-500') : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-amber-600/40 text-stone-800 dark:text-stone-200'}`}
                          >
                            <span>{option}</span>
                            {selectedAnswer === option && (
                              <span className="material-symbols-outlined">
                                {option === selectedMystery.correctAnswer ? 'check_circle' : 'cancel'}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Fallback to scratch */}
                    <div className="text-center pt-2">
                      <button
                        onClick={() => setIsScratching(true)}
                        className="text-xs text-[#8c6239] hover:text-amber-600 font-gujarati font-black hover:underline flex items-center gap-1 mx-auto"
                      >
                        <span className="material-symbols-outlined text-sm">payments</span>
                        જવાબ નથી ખબર? કોઈન્સ ખર્ચ્યા વિના રહસ્ય ઘસીને જાણો!
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4">
                    {/* Scratch Card container */}
                    <div className="relative w-[300px] h-[180px] rounded-2xl overflow-hidden shadow-inner border border-[#8c6239]/20 bg-white dark:bg-stone-900 flex flex-col items-center justify-center p-4">
                      
                      {/* Inside details revealed */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center space-y-2">
                        <span className="material-symbols-outlined text-4xl text-emerald-500 animate-bounce">lock_open</span>
                        <h4 className="font-gujarati font-black text-base text-stone-800 dark:text-stone-150">નવું રહસ્ય અનલોક થયું!</h4>
                        <p className="font-gujarati text-[10px] text-stone-500 leading-normal">
                          નીચેનું સત્ય બટન દબાવીને વાસ્તવિક સત્ય જાણો.
                        </p>
                      </div>

                      {/* Scratch Overlay Canvas */}
                      {!scratchedToReveal && (
                        <canvas
                          ref={canvasRef}
                          onMouseDown={() => setIsScratching(true)}
                          onMouseMove={handleScratchMove}
                          onTouchMove={handleScratchMove}
                          className="absolute inset-0 cursor-pointer touch-none select-none z-10"
                        />
                      )}
                    </div>

                    {scratchedToReveal ? (
                      <button
                        onClick={() => {
                          setIsScratching(false);
                        }}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-3.5 rounded-2xl font-gujarati font-black text-sm active:scale-95 transition-transform"
                      >
                        વાસ્તવિક સત્ય વાંચો 📖
                      </button>
                    ) : (
                      <div className="space-y-1.5 text-center">
                        <p className="font-gujarati text-[10px] text-stone-400 animate-pulse">
                          ઘસવાની પ્રગતિ: {scratchPercent}% (૪૫% ઘસીને રહસ્ય ખુલ્લું કરો)
                        </p>
                        <button
                          onClick={() => setIsScratching(false)}
                          className="text-[10px] text-stone-500 hover:underline font-gujarati"
                        >
                          કોયડો પદ્ધતિ પર પાછા જાઓ ⤶
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
