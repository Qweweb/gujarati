import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toPng } from 'html-to-image';

// ─── SHOCK MESSAGES PRESETS ───────────────────────────────
const SHOK_MESSAGES = [
  {
    id: "preset_1",
    title: "૧. તુલસીપત્ર શોક સંદેશ (આદર્શ)",
    text: "દિલગીરી સાથે જણાવવાનું કે અમારા પૂજ્ય [સંબંધ જેમ કે પિતાશ્રી] સ્વ. [નામ] (ગામ: [ગામ]) નું તારીખ [સ્વર્ગવાસ તારીખ] ના રોજ સ્વર્ગવાસ થયેલ છે. પરમ કૃપાળુ પરમાત્મા સદ્ગતના દિવ્ય આત્માને પરમ શાંતિ અર્પે અને મોક્ષ પ્રદાન કરે તેવી પ્રાર્થના."
  },
  {
    id: "preset_2",
    title: "૨. ગીતા શ્લોક યુક્ત (આધ્યાત્મિક)",
    text: "ન જાયતે મ્રિયતે વા કદાચિન્ નાયં ભૂત્વા ભવિતા વા ન ભૂયઃ।\nઅજો નિત્યઃ શાશ્વતોડયં પુરાણો ન હન્યતે હન્યમાને શરીરે॥\nઅમારા પૂજ્ય સ્વ. [નામ] ના વૈકુંઠવાસ નિમિત્તે તેમના દિવ્ય આત્માના મોક્ષાર્થે પ્રાર્થના સભા (બેસણું) રાખેલ છે."
  },
  {
    id: "preset_3",
    title: "૩. મંત્ર સહિત શોક સંદેશ",
    text: "ૐ શાંતિઃ શાંતિઃ શાંતિઃ।\nઅત્યંત દુઃખદ સમાચાર કે અમારા હૃદયસ્થ સ્વ. [નામ] (ઉંમર: [ઉંમર]) નું દેવલોક ગમન થયેલ છે. પ્રભુ તેમના પવિત્ર આત્માને ચરણોમાં સ્થાન આપે એ જ અભ્યર્થના."
  },
  {
    id: "preset_4",
    title: "૪. અકાળ અવસાન (શોકાતુર)",
    text: "અમારા વહાલા સ્વ. [નામ] ના અકાળ અને આકસ્મિક અવસાનથી અમારો સમગ્ર પરિવાર ઊંડા આઘાતમાં સરી પડ્યો છે. સદગતના આત્માની શાંતિ માટે ભગવાન શ્રી હરિ ચરણોમાં વિનંતી સહ પ્રાર્થના."
  },
  {
    id: "preset_5",
    title: "૫. માતૃશ્રી વંદના (માતા માટે)",
    text: "પૂજ્ય માતૃશ્રી સ્વ. [નામ] ની વાત્સલ્યમય મમતા અને પવિત્ર આશીર્વાદ હંમેશાં અમારી સ્મૃતિમાં જીવંત રહેશે. તેમના દિવ્ય આત્માના મોક્ષાર્થે શોકસભાનું આયોજન કરેલ છે."
  },
  {
    id: "preset_6",
    title: "૬. પિતૃ વંદના (પિતા માટે)",
    text: "અમારા પૂજ્ય પિતાશ્રી સ્વ. [નામ] જેમણે જીવનભર અમને આંગળી પકડીને સાચો માર્ગ બતાવ્યો. તેઓ શારીરિક રીતે આપણી વચ્ચે નથી પણ તેમની છત્રછાયા સદાય રહેશે. સદગતના આત્માના શ્રેયાર્થે પ્રાર્થના સભા."
  },
  {
    id: "preset_7",
    title: "૭. મિત્ર શ્રદ્ધાંજલિ (મિત્ર માટે)",
    text: "મારા પરમ મિત્ર સ્વ. [નામ] ના અકાળ વિદાયથી અમે જીવનમાં એક અમૂલ્ય સ્નેહી ગુમાવ્યો છે. ઈશ્વર તેમના પરિવારને આ મુશ્કેલ સમયમાં હિંમત અને શાંતિ પ્રદાન કરે."
  },
  {
    id: "preset_8",
    title: "૮. ભક્તિમય શ્રદ્ધાંજલિ",
    text: "જન્મ અને મૃત્યુ એ કુદરતનો અફર નિયમ છે. પ્રભુ ચરણોમાં લીન થયેલ અમારા પ્રિય વડીલ સ્વ. [નામ] ની પવિત્ર યાદો સાથે અમે તેમને ભીની આંખે શ્રદ્ધાંજલિ અર્પણ કરીએ છીએ."
  },
  {
    id: "preset_9",
    title: "૯. સંયુક્ત બેસણું અને ઉઠમણું",
    text: "અમારા પરિવારના માર્ગદર્શક સ્વ. [નામ] ના દુઃખદ અવસાન નિમિત્તે સદગતના આત્માની શાંતિ અર્થે બેસણું તથા ઉઠમણું સંયુક્ત રીતે રાખવામાં આવેલ છે."
  },
  {
    id: "preset_10",
    title: "૧૦. સરળ શોક સભા",
    text: "અમારા પૂજ્ય સ્વ. [નામ] ના અવસાન નિમિત્તે શોકાંજલિ સભાનું આયોજન કરેલ છે. આપ સહુને સામૂહિક પ્રાર્થના સભામાં ઉપસ્થિત રહી શાંતિ પાઠમાં સહભાગી થવા નમ્ર અપીલ."
  },
  {
    id: "preset_11",
    title: "૧૧. સ્મરણાંજલિ (યાદોમાં)",
    text: "અમારા વડીલ સ્વ. [નામ] એ હંમેશાં સ્નેહ અને સંસ્કારોનું સિંચન કર્યું. તેઓ શારીરિક રીતે વિદાય પામ્યા છે પણ હૃદયમાં સદા અમર રહેશે. દિવ્ય આત્માને પ્રભુ ચરણોમાં મોક્ષ મળે."
  },
  {
    id: "preset_12",
    title: "૧૨. વૈકુંઠધામ પ્રાર્થના",
    text: "પરમ કૃપાળુ પરમાત્મા અમારા પ્રિય મોભી સ્વ. [નામ] ના આત્માને વૈકુંઠધામમાં મોક્ષ પ્રદાન કરે અને પરિવારજનો પર આશીર્વાદ વરસાવે એ જ મંગલ કામના."
  },
  {
    id: "preset_13",
    title: "૧૩. પુત્ર/પુત્રી ના સ્મરણાર્થે (યુવાન/બાળક)",
    text: "અત્યંત ભારે હૈયે જણાવવાનું કે અમારા વહાલા [સંબંધ જેમ કે પિતાશ્રી] સ્વ. [નામ] નું નાની ઉંમરે દુઃખદ અવસાન થયેલ છે. કુદરતના આ આઘાતજનક નિર્ણય સામે નતમસ્તક થઈ પ્રભુ તેમના પવિત્ર આત્માને પરમ શાંતિ આપે તેવી પ્રાર્થના."
  },
  {
    id: "preset_14",
    title: "૧૪. વડીલ મોભી આશીર્વાદ (પૂજ્ય વડીલ)",
    text: "અમારા પરિવારના આધારસ્તંભ અને વડીલ મોભી સ્વ. [નામ] નું તારીખ [સ્વર્ગવાસ તારીખ] ના રોજ વૈકુંઠગમન થયેલ છે. તેમની નિષ્કામ સેવા અને પ્રેરણાદાયી વિચારો હંમેશાં અમારા આખા પરિવાર માટે માર્ગદર્શક રહેશે."
  },
  {
    id: "preset_15",
    title: "૧૫. કાવ્યમય શ્રદ્ધાંજલિ (શબ્દાંજલિ)",
    text: "નયનોમાં અશ્રુ મૂકીને વિદાય તમે લીધી, સ્મરણોની મીઠી સૌગાદ ભેટ અમને દીધી.\nઅમારા પ્રિય સ્વ. [નામ] ના પવિત્ર સ્મરણો સદાય અમારા હૃદયમાં જીવંત રહેશે. પ્રભુ તેમના દિવ્ય આત્માને મોક્ષ પ્રદાન કરે."
  }
];

// ─── FLOWER GARLAND STYLES ─────────────────────────────────
const GARLAND_STYLES = {
  marigold: { label: "ગલગોટો (Marigold)", emoji: "🌸🏵️🌸🏵️🌸" },
  rose: { label: "લાલ ગુલાબ (Rose)", emoji: "🌹🌹🌹🌹🌹" },
  lotus: { label: "શ્વેત કમળ (Lotus)", emoji: "🪷🪷🪷🪷🪷" },
  gold_border: { label: "સોનેરી બોર્ડર (Gold)", emoji: "✨👑✨👑✨" }
};

// ─── CARD TEMPLATE DESIGNS ───────────────────────────────
const CARD_TEMPLATES = [
  {
    id: "saffron_heritage",
    name: "૧. કેસરી હેરીટેજ",
    accentColor: "#b45309",
    bgClass: "bg-gradient-to-br from-orange-50 via-[#fdfaf2] to-amber-50",
    borderStyle: "border-[12px] border-double border-amber-600",
    textColor: "text-amber-950",
    ornaments: (
      <>
        <div className="absolute top-4 left-4 text-amber-600/40 text-4xl select-none">🏵️</div>
        <div className="absolute top-4 right-4 text-amber-600/40 text-4xl select-none">🏵️</div>
        <div className="absolute bottom-4 left-4 text-amber-600/40 text-4xl select-none">🏵️</div>
        <div className="absolute bottom-4 right-4 text-amber-600/40 text-4xl select-none">🏵️</div>
      </>
    )
  },
  {
    id: "silent_white",
    name: "૨. શાંત શ્વેત (મિનિમલ)",
    accentColor: "#1c1917",
    bgClass: "bg-white",
    borderStyle: "border-[8px] border-double border-stone-800",
    textColor: "text-stone-900",
    ornaments: (
      <>
        <div className="absolute top-3 left-3 text-stone-800/30 text-3xl select-none">🪷</div>
        <div className="absolute top-3 right-3 text-stone-800/30 text-3xl select-none">🪷</div>
        <div className="absolute bottom-3 left-3 text-stone-800/30 text-3xl select-none">🪷</div>
        <div className="absolute bottom-3 right-3 text-stone-800/30 text-3xl select-none">🪷</div>
      </>
    )
  },
  {
    id: "royal_purple",
    name: "૩. શાહી જાંબલી",
    accentColor: "#4338ca",
    bgClass: "bg-gradient-to-br from-purple-50 via-indigo-50/20 to-purple-100/40",
    borderStyle: "border-[12px] border-double border-indigo-700/40",
    textColor: "text-indigo-950",
    ornaments: (
      <>
        <div className="absolute top-4 left-4 text-indigo-700/35 text-3xl select-none">🪻</div>
        <div className="absolute top-4 right-4 text-indigo-700/35 text-3xl select-none">🪻</div>
        <div className="absolute bottom-4 left-4 text-indigo-700/35 text-3xl select-none">🪻</div>
        <div className="absolute bottom-4 right-4 text-indigo-700/35 text-3xl select-none">🪻</div>
      </>
    )
  },
  {
    id: "forest_green",
    name: "૪. વનરાજી લીલો",
    accentColor: "#047857",
    bgClass: "bg-gradient-to-br from-emerald-50/60 via-green-50/20 to-teal-50/40",
    borderStyle: "border-[12px] border-double border-emerald-600/40",
    textColor: "text-emerald-950",
    ornaments: (
      <>
        <div className="absolute top-4 left-4 text-emerald-600/35 text-4xl select-none">🍃</div>
        <div className="absolute top-4 right-4 text-emerald-600/35 text-4xl select-none rotate-90">🍃</div>
        <div className="absolute bottom-4 left-4 text-emerald-600/35 text-4xl select-none -rotate-90">🍃</div>
        <div className="absolute bottom-4 right-4 text-emerald-600/35 text-4xl select-none rotate-180">🍃</div>
      </>
    )
  },
  {
    id: "sky_blue",
    name: "૫. આકાશી વાદળી",
    accentColor: "#1d4ed8",
    bgClass: "bg-gradient-to-br from-sky-50 via-blue-50/20 to-indigo-50/40",
    borderStyle: "border-[12px] border-double border-blue-600/30",
    textColor: "text-blue-950",
    ornaments: (
      <>
        <div className="absolute top-4 left-4 text-blue-600/30 text-3xl select-none">🔹</div>
        <div className="absolute top-4 right-4 text-blue-600/30 text-3xl select-none">🔹</div>
        <div className="absolute bottom-4 left-4 text-blue-600/30 text-3xl select-none">🔹</div>
        <div className="absolute bottom-4 right-4 text-blue-600/30 text-3xl select-none">🔹</div>
      </>
    )
  },
  {
    id: "vintage_ivory",
    name: "૬. વિન્ટેજ આઇવરી",
    accentColor: "#7c2d12",
    bgClass: "bg-[#fcf7ed]",
    borderStyle: "border-[10px] border-double border-amber-800/60",
    textColor: "text-amber-950",
    ornaments: (
      <>
        <div className="absolute top-3 left-3 text-amber-800/40 text-3xl select-none">⚜️</div>
        <div className="absolute top-3 right-3 text-amber-800/40 text-3xl select-none">⚜️</div>
        <div className="absolute bottom-3 left-3 text-amber-800/40 text-3xl select-none">⚜️</div>
        <div className="absolute bottom-3 right-3 text-amber-800/40 text-3xl select-none">⚜️</div>
      </>
    )
  },
  {
    id: "slate_grey",
    name: "૭. શાંત રાખોડી",
    accentColor: "#334155",
    bgClass: "bg-gradient-to-br from-slate-50 via-zinc-100/50 to-slate-100",
    borderStyle: "border-[10px] border-double border-slate-700/50",
    textColor: "text-slate-900",
    ornaments: (
      <>
        <div className="absolute top-4 left-4 text-slate-500/25 text-3xl select-none">💮</div>
        <div className="absolute top-4 right-4 text-slate-500/25 text-3xl select-none">💮</div>
        <div className="absolute bottom-4 left-4 text-slate-500/25 text-3xl select-none">💮</div>
        <div className="absolute bottom-4 right-4 text-slate-500/25 text-3xl select-none">💮</div>
      </>
    )
  },
  {
    id: "divine_glow",
    name: "૮. દિવ્ય પ્રભા",
    accentColor: "#9a3412",
    bgClass: "bg-gradient-to-br from-yellow-50/70 via-orange-50/20 to-yellow-100/40",
    borderStyle: "border-[12px] border-double border-orange-700/30",
    textColor: "text-orange-950",
    ornaments: (
      <>
        <div className="absolute top-4 left-4 text-orange-600/30 text-3xl select-none">🕯️</div>
        <div className="absolute top-4 right-4 text-orange-600/30 text-3xl select-none">🕯️</div>
        <div className="absolute bottom-4 left-4 text-orange-600/30 text-3xl select-none">🪔</div>
        <div className="absolute bottom-4 right-4 text-orange-600/30 text-3xl select-none">🪔</div>
      </>
    )
  },
  {
    id: "tranquil_teal",
    name: "૯. ગંગા મૈયા (ટેલ)",
    accentColor: "#0f766e",
    bgClass: "bg-gradient-to-br from-teal-50 via-cyan-50/30 to-teal-100/30",
    borderStyle: "border-[12px] border-double border-teal-700/30",
    textColor: "text-teal-950",
    ornaments: (
      <>
        <div className="absolute top-4 left-4 text-teal-600/30 text-3xl select-none">💧</div>
        <div className="absolute top-4 right-4 text-teal-600/30 text-3xl select-none">💧</div>
        <div className="absolute bottom-4 left-4 text-teal-600/30 text-3xl select-none">💧</div>
        <div className="absolute bottom-4 right-4 text-teal-600/30 text-3xl select-none">💧</div>
      </>
    )
  }
];

export default function ShradhanjaliMaker() {
  const navigate = useNavigate();
  const printableRef = useRef(null);

  // ─── STATE VARIABLES ─────────────────────────────────────
  const [selectedTemplate, setSelectedTemplate] = useState("saffron_heritage");
  const [cardLayout, setCardLayout] = useState("A4"); // 'A4' (Portrait) or 'Square'
  const [photoUrl, setPhotoUrl] = useState(null);
  const [showGarland, setShowGarland] = useState(true);
  const [garlandStyle, setGarlandStyle] = useState("marigold"); // 'marigold', 'rose', 'lotus', 'gold_border'
  const [photoFilter, setPhotoFilter] = useState("grayscale"); // 'grayscale' or 'normal'
  const [base64QrCode, setBase64QrCode] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Font customization
  const [textColorOverride, setTextColorOverride] = useState(null); // Custom hex if set
  const [textSizeAdjust, setTextSizeAdjust] = useState(0); // in pixels offset

  // Main Form fields
  const [headerText, setHeaderText] = useState("શ્રદ્ધાંજલિ"); // e.g. શ્રદ્ધાંજલિ, બેસણું, ઉઠમણું
  const [name, setName] = useState("નયનભાઈ જીવાભાઈ કેટરિયા");
  const [age, setAge] = useState("૫૮ વર્ષ");
  const [village, setVillage] = useState("ગામ - અંબાજી");
  const [relationship, setRelationship] = useState("અમારા પૂજ્ય પિતાશ્રી");
  const [dateOfDeath, setDateOfDeath] = useState("તારીખ: ૧૦-૦૭-૨૦૨૫, ગુરુવાર");
  const [besnuDate, setBesnuDate] = useState("તારીખ: ૧૨-૦૭-૨૦૨૫, શનિવાર");
  const [besnuTime, setBesnuTime] = useState("સાંજે ૦૪:૦૦ થી ૦૬:૦૦ વાગ્યા સુધી");
  const [besnuVenue, setBesnuVenue] = useState("સંતોષીબાગ ની વાડી, અહેમદાબાદ, ગુજરાત");
  const [mapsLink, setMapsLink] = useState("");
  const [message, setMessage] = useState(
    "દિલગીરી સાથે જણાવવાનું કે અમારા પૂજ્ય પિતાશ્રી સ્વ. નયનભાઈ જીવાભાઈ કેટરિયા (ગામ: અંબાજી) નું તારીખ ૧૦-૦૭-૨૦૨૫ ના રોજ સ્વર્ગવાસ થયેલ છે. પરમ કૃપાળુ પરમાત્મા સદ્ગતના દિવ્ય આત્માને પરમ શાંતિ અર્પે અને મોક્ષ પ્રદાન કરે તેવી પ્રાર્થના."
  );
  const [relatives, setRelatives] = useState(
    "લિ. કેટરિયા પરિવાર અને સ્નેહીજનો\nરાધે કૃષ્ણ ક્રિએશન"
  );

  // ─── HANDLERS ────────────────────────────────────────────
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPresetMessage = (preset) => {
    let replacedText = preset.text
      .replace("[નામ]", name || "નયનભાઈ જીવાભાઈ કેટરિયા")
      .replace("[ઉંમર]", age || "૫૮ વર્ષ")
      .replace("[ગામ]", village ? village.replace("ગામ - ", "") : "અંબાજી")
      .replace("[સંબંધ જેમ કે પિતાશ્રી]", relationship || "પિતાશ્રી")
      .replace("[સ્વર્ગવાસ તારીખ]", dateOfDeath ? dateOfDeath.replace("તારીખ: ", "") : "૧૦-૦૭-૨૦૨૫, ગુરુવાર");
    
    setMessage(replacedText);
  };

  const handleDownload = async () => {
    if (!printableRef.current) return;
    setIsGenerating(true);

    try {
      // Small timeout to allow styles/images to settle
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const dataUri = await toPng(printableRef.current, {
        pixelRatio: 2.5,
        cacheBust: true,
        style: { background: '#ffffff' }
      });

      const link = document.createElement("a");
      link.download = `shradhanjali_${name.trim().replace(/\s+/g, '_') || 'card'}.png`;
      link.href = dataUri;
      link.click();
    } catch (e) {
      console.error("Error generating canvas:", e);
      alert("કાર્ડ ઇમેજ બનાવવામાં ભૂલ આવી, મહેરબાની કરીને ફરી પ્રયાસ કરો.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCopyWhatsAppText = () => {
    const mapsText = mapsLink.trim() ? `\n📍 લોકેશન (ગૂગલ મેપ્સ):\n🔗 ${mapsLink.trim()}` : '';
    const formattedText = `*ૐ શાંતિઃ* 🙏

અત્યંત દુઃખદ સમાચાર સાથે જણાવવાનું કે અમારા ${relationship || 'પૂજ્ય વડીલ'} *સ્વ. ${name || '[સ્વર્ગસ્થનું નામ]' }* (${village || 'ગામ'}) નું તારીખ ${dateOfDeath ? dateOfDeath.replace("તારીખ: ", "") : '[તારીખ]'} ના રોજ દેવલોક ગમન થયેલ છે.

ભગવાન સદગતના પવિત્ર આત્માને પરમ શાંતિ અર્પે તેવી પ્રાર્થના સહ. 🙏

*બેસણું (પ્રાર્થના સભા):*
📅 તારીખ: ${besnuDate ? besnuDate.replace("તારીખ: ", "") : '[બેસણા તારીખ]'}
⏰ સમય: ${besnuTime || '[બેસણા સમય]'}
📍 સ્થળ: ${besnuVenue || '[બેસણા સ્થળ]'}
${mapsText}

*લિ. શોકાતુર / સ્નેહીજનો:*
${relatives || '[પરિવારજનોના નામ]'}

_(ગુજરાતી શ્રદ્ધાંજલિ કાર્ડ મેકર એપ દ્વારા મોકલેલ)_`;

    navigator.clipboard.writeText(formattedText);
    alert("📲 વોટ્સએપ આમંત્રણ લખાણ ક્લિપબોર્ડ પર કોપી થઈ ગયું છે! તમે સીધું વોટ્સએપ પર પેસ્ટ કરીને શેર કરી શકો છો.");
  };

  const activeTemplateObj = CARD_TEMPLATES.find(t => t.id === selectedTemplate) || CARD_TEMPLATES[0];

  useEffect(() => {
    if (!mapsLink.trim()) {
      setBase64QrCode(null);
      return;
    }
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(mapsLink.trim())}`;
    const fetchBase64 = async () => {
      try {
        const res = await fetch(url, { mode: 'cors', cache: 'no-cache' });
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onloadend = () => setBase64QrCode(reader.result);
        reader.readAsDataURL(blob);
      } catch (e) {
        console.warn("QR code base64 fetch failed", e);
        setBase64QrCode(url);
      }
    };
    fetchBase64();
  }, [mapsLink]);

  const qrCodeUrl = base64QrCode;

  return (
    <div className="animate-fade-in space-y-8 pb-20 print:p-0 print:pb-0 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-primary/10 shadow-lg mt-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/tools')} className="h-12 w-12 bg-white dark:bg-stone-800 rounded-2xl shadow-sm flex items-center justify-center text-primary dark:text-amber-500 border border-primary/10 hover:bg-primary/5 transition-all active:scale-95">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div>
            <h2 className="font-gujarati font-black text-2xl sm:text-3xl bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">શ્રદ્ધાંજલિ કાર્ડ મેકર</h2>
            <p className="font-gujarati text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">શાંતિ અને આદર સાથે બેસણું કે શોક સભા પત્રિકા બનાવો</p>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Form Controls */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          
          {/* Template Selector */}
          <section className="bg-white dark:bg-dark-surface p-5 rounded-[2rem] shadow-sm border border-primary/5 space-y-3">
            <h3 className="font-gujarati font-black text-sm text-stone-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">palette</span>
              ૧. થીમ ડિઝાઇન પસંદ કરો
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CARD_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all
                    ${selectedTemplate === tmpl.id
                      ? 'border-primary bg-primary/5 text-primary font-black scale-[1.02] shadow-sm'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                >
                  <span className="font-gujarati text-xs text-center leading-snug">{tmpl.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Layout Selector */}
          <section className="bg-white dark:bg-dark-surface p-5 rounded-[2rem] shadow-sm border border-primary/5 space-y-3">
            <h3 className="font-gujarati font-black text-sm text-stone-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">aspect_ratio</span>
              ૨. કાર્ડ સાઈઝ પસંદ કરો
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => setCardLayout("A4")}
                className={`flex-1 py-3 rounded-xl border font-gujarati text-xs font-bold transition-all flex items-center justify-center gap-2
                  ${cardLayout === "A4" ? 'bg-primary text-white border-primary shadow-md' : 'border-stone-200 text-stone-500 hover:bg-stone-50'}`}
              >
                <span className="material-symbols-outlined text-base">portrait</span>
                A4 ઊભું કાર્ડ (WhatsApp/Print)
              </button>
              <button
                onClick={() => setCardLayout("Square")}
                className={`flex-1 py-3 rounded-xl border font-gujarati text-xs font-bold transition-all flex items-center justify-center gap-2
                  ${cardLayout === "Square" ? 'bg-primary text-white border-primary shadow-md' : 'border-stone-200 text-stone-500 hover:bg-stone-50'}`}
              >
                <span className="material-symbols-outlined text-base">crop_square</span>
                ચોરસ કાર્ડ (Insta/FB Post)
              </button>
            </div>
          </section>

          {/* Deceased Photo Upload & Options */}
          <section className="bg-white dark:bg-dark-surface p-5 rounded-[2rem] shadow-sm border border-primary/5 space-y-4">
            <h3 className="font-gujarati font-black text-sm text-stone-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">photo_camera</span>
              ૩. સ્વર્ગસ્થનો ફોટો ઉમેરો
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="file"
                accept="image/*"
                id="shradhanjali-photo-input"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <label
                htmlFor="shradhanjali-photo-input"
                className="cursor-pointer bg-primary/10 text-primary px-5 py-2.5 rounded-xl font-gujarati font-bold hover:bg-primary/20 transition-all text-xs active:scale-95"
              >
                ફોટો અપલોડ કરો
              </label>
              {photoUrl && (
                <button
                  onClick={() => setPhotoUrl(null)}
                  className="bg-rose-50 text-rose-600 border border-rose-200 px-4 py-2.5 rounded-xl font-gujarati text-xs font-bold active:scale-95 transition-all"
                >
                  ફોટો હટાવો
                </button>
              )}
            </div>

            {photoUrl && (
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stone-100">
                {/* Photo Filter Toggle */}
                <div>
                  <label className="block text-[11px] font-black text-stone-400 font-gujarati mb-1">ફોટો કલર ફિલ્ટર:</label>
                  <div className="flex bg-stone-100 rounded-lg p-0.5 border">
                    <button
                      onClick={() => setPhotoFilter("grayscale")}
                      className={`flex-1 py-1 text-[10px] font-gujarati font-bold rounded ${photoFilter === "grayscale" ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'}`}
                    >
                      B&W (બ્લેક એન્ડ વ્હાઇટ)
                    </button>
                    <button
                      onClick={() => setPhotoFilter("normal")}
                      className={`flex-1 py-1 text-[10px] font-gujarati font-bold rounded ${photoFilter === "normal" ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'}`}
                    >
                      સામાન્ય કલર
                    </button>
                  </div>
                </div>

                {/* Garland Frame Toggle & Style selection */}
                <div className="flex flex-col justify-end space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer py-1 self-start">
                    <input
                      type="checkbox"
                      checked={showGarland}
                      onChange={(e) => setShowGarland(e.target.checked)}
                      className="accent-primary h-4 w-4 rounded"
                    />
                    <span className="font-gujarati text-xs text-stone-700 font-bold select-none">હારી/બોર્ડર (Garland) લગાવો</span>
                  </label>
                  
                  {showGarland && (
                    <div className="flex bg-stone-100 dark:bg-stone-850 rounded-lg p-0.5 border gap-0.5">
                      {[
                        { id: "marigold", icon: "🏵️" },
                        { id: "rose", icon: "🌹" },
                        { id: "lotus", icon: "🪷" },
                        { id: "gold_border", icon: "👑" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setGarlandStyle(item.id)}
                          title={GARLAND_STYLES[item.id].label}
                          className={`flex-1 py-1 px-1.5 text-xs rounded transition-all flex items-center justify-center
                            ${garlandStyle === item.id ? 'bg-white dark:bg-stone-700 text-stone-900 shadow-xs' : 'text-stone-400 hover:text-stone-600'}`}
                        >
                          {item.icon}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Form Input fields */}
          <section className="bg-white dark:bg-dark-surface p-5 rounded-[2rem] shadow-sm border border-primary/5 space-y-4">
            <h3 className="font-gujarati font-black text-sm text-stone-800 flex items-center gap-2 border-b pb-2">
              <span className="material-symbols-outlined text-primary text-lg">edit_note</span>
              ૪. વિગતો ભરો
            </h3>

            <div className="space-y-3.5">
              {/* Header Text option */}
              <div>
                <label className="block text-xs font-black text-stone-500 font-gujarati mb-1">કાર્ડનું શીર્ષક (Header):</label>
                <div className="flex flex-wrap gap-1.5">
                  {["શ્રદ્ધાંજલિ", "ભાવપૂર્ણ શ્રદ્ધાંજલિ", "બેસણું", "બેસણું અને ઉઠમણું", "પ્રાર્થના સભા"].map(hdr => (
                    <button
                      key={hdr}
                      onClick={() => setHeaderText(hdr)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-gujarati font-bold border transition-colors
                        ${headerText === hdr ? 'bg-amber-600 border-amber-600 text-white' : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'}`}
                    >
                      {hdr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormInput label="સ્વર્ગસ્થનું પૂરું નામ" value={name} onChange={setName} placeholder="દા.ત. નયનભાઈ જીવાભાઈ..." />
                <FormInput label="ઉંમર (Age)" value={age} onChange={setAge} placeholder="દા.ત. ૫૮ વર્ષ" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormInput label="વતન/ગામ" value={village} onChange={setVillage} placeholder="દા.ત. ગામ - અંબાજી" />
                <FormInput label="સ્વર્ગસ્થ સાથે સંબંધ" value={relationship} onChange={setRelationship} placeholder="દા.ત. અમારા પૂજ્ય પિતાશ્રી" />
              </div>

              <FormInput label="સ્વર્ગવાસની તારીખ (અને તિથિ)" value={dateOfDeath} onChange={setDateOfDeath} placeholder="દા.ત. તારીખ: ૧૦-૦૭-૨૦૨૫, ગુરુવાર" />

              <div className="h-px bg-stone-100 my-2"></div>
              <p className="font-gujarati text-[10px] text-stone-400 font-bold uppercase tracking-wider">બેસણાની વિગતો</p>

              <div className="grid grid-cols-2 gap-3">
                <FormInput label="બેસણાની તારીખ" value={besnuDate} onChange={setBesnuDate} placeholder="દા.ત. તારીખ: ૧૨-૦૭-૨૦૨૫..." />
                <FormInput label="બેસણાનો સમય" value={besnuTime} onChange={setBesnuTime} placeholder="દા.ત. સાંજે ૦૪:૦૦ થી..." />
              </div>

              <FormInput label="સ્થળ / સરનામું (Besnu Venue)" value={besnuVenue} onChange={setBesnuVenue} placeholder="દા.ત. સંતોષીબાગ ની વાડી..." />

              {/* Maps Link Integration */}
              <div className="bg-amber-500/5 p-3 rounded-2xl border border-amber-500/10 space-y-1">
                <FormInput 
                  label="ગૂગલ મેપ્સ લિંક (Google Maps Link)" 
                  value={mapsLink} 
                  onChange={setMapsLink} 
                  placeholder="મેપ્સ લિંક પેસ્ટ કરો (QR Code જનરેટ થશે)..." 
                />
                <p className="font-gujarati text-[10px] text-amber-700/80 leading-snug">
                  💡 જો તમે ગૂગલ મેપ્સની લિંક નાખશો, તો કાર્ડ પર ઓટોમેટિક **QR કોડ** પ્રિન્ટ થઈ જશે જેથી લોકો સ્કેન કરીને સીધા લોકેશન પર પહોંચી શકે.
                </p>
              </div>

              {/* Condolence Message Preset selection */}
              <div>
                <label className="block text-xs font-black text-stone-500 font-gujarati mb-1">શોક સંદેશ નમૂના (Message Presets):</label>
                <div className="max-h-32 overflow-y-auto border rounded-xl divide-y bg-stone-50">
                  {SHOK_MESSAGES.map(msg => (
                    <button
                      key={msg.id}
                      onClick={() => selectPresetMessage(msg)}
                      className="w-full text-left p-2.5 text-xs font-gujarati text-stone-700 hover:bg-amber-50 transition-colors block leading-relaxed"
                    >
                      {msg.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-stone-600 dark:text-stone-300 font-gujarati tracking-wide">શોક સંદેશ (Message Content):</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900 text-xs sm:text-sm font-gujarati leading-relaxed focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-stone-950 transition-all resize-none text-stone-800 dark:text-stone-100"
                  placeholder="શોક સંદેશ વિગત..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-stone-600 dark:text-stone-300 font-gujarati tracking-wide">લિ. / સ્નેહીજનોના નામ:</label>
                <textarea
                  value={relatives}
                  onChange={(e) => setRelatives(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900 text-xs sm:text-sm font-gujarati leading-relaxed focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-stone-950 transition-all resize-none text-stone-800 dark:text-stone-100"
                  placeholder="લિ. પરિવારોના નામ..."
                />
              </div>
            </div>
          </section>

          {/* Actions: Download & Copy WhatsApp Text */}
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-[2rem] font-gujarati font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-2xl">{isGenerating ? 'hourglass_top' : 'download'}</span>
              {isGenerating ? 'કાર્ડ તૈયાર થઈ રહ્યું છે...' : 'શ્રદ્ધાંજલિ કાર્ડ ડાઉનલોડ કરો'}
            </button>

            <button
              onClick={handleCopyWhatsAppText}
              type="button"
              className="w-full bg-white dark:bg-[#251508] hover:bg-amber-500/5 border-2 border-primary/20 text-primary py-4 rounded-[2rem] font-gujarati font-black text-lg active:scale-95 transition-all flex items-center justify-center gap-2.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-2xl">content_copy</span>
              વોટ્સએપ આમંત્રણ લખાણ કોપી કરો
            </button>
          </div>
        </div>

        {/* Right Side: Live Premium Card Preview & Adjustments */}
        <div className="lg:col-span-7 flex flex-col items-center">
          
          {/* Card Formatting Toolbar */}
          <div className="w-full max-w-[500px] bg-white dark:bg-dark-surface p-4 rounded-3xl border border-primary/5 shadow-xs mb-4 space-y-3.5 print:hidden">
            <h4 className="font-gujarati font-black text-xs text-stone-400 uppercase tracking-wider">અક્ષર અને કલર એડજસ્ટ કરો (Font & Colors)</h4>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Text color picker */}
              <div className="space-y-1.5">
                <p className="font-gujarati text-[11px] font-black text-stone-500">લખાણનો કલર (Text Color):</p>
                <div className="flex gap-2">
                  {[
                    { label: "Default", val: null, color: "bg-stone-300" },
                    { label: "Dark Gray", val: "#292524", color: "bg-stone-800" },
                    { label: "Deep Saffron", val: "#7c2d12", color: "bg-amber-900" },
                    { label: "Navy Blue", val: "#1e3a8a", color: "bg-blue-900" },
                    { label: "Maroon", val: "#7f1d1d", color: "bg-red-900" },
                    { label: "Pine Green", val: "#064e3b", color: "bg-emerald-900" }
                  ].map((c) => (
                    <button
                      key={c.label}
                      onClick={() => setTextColorOverride(c.val)}
                      title={c.label}
                      className={`h-7 w-7 rounded-full border-2 transition-all flex items-center justify-center ${textColorOverride === c.val ? 'border-amber-500 scale-110 shadow-sm' : 'border-transparent'}`}
                    >
                      <span className={`h-full w-full rounded-full ${c.color}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Text size slider */}
              <div className="flex-1 w-full max-w-[180px] space-y-1">
                <div className="flex justify-between text-[11px] font-black text-stone-500 font-gujarati">
                  <span>અક્ષરનું માપ (Size):</span>
                  <span className="text-primary font-sans">{textSizeAdjust >= 0 ? `+${textSizeAdjust}` : textSizeAdjust}px</span>
                </div>
                <input
                  type="range"
                  min="-4"
                  max="6"
                  value={textSizeAdjust}
                  onChange={(e) => setTextSizeAdjust(parseInt(e.target.value, 10))}
                  className="w-full accent-primary h-1 bg-stone-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <h3 className="font-gujarati font-black text-sm text-stone-800 mb-2 self-start flex items-center gap-2 print:hidden">
            <span className="material-symbols-outlined text-primary text-lg">visibility</span>
            કાર્ડ લાઈવ પ્રિવ્યૂ (Live Preview)
          </h3>

          {/* Core Printable Card Component */}
          <div className="w-full overflow-x-auto no-scrollbar py-2 flex justify-center">
            <div
              ref={printableRef}
              id="shradhanjali-card"
              className={`w-[500px] shrink-0 p-8 rounded-[2rem] border relative overflow-hidden transition-all flex flex-col justify-between select-none
                ${activeTemplateObj.bgClass} ${activeTemplateObj.borderStyle} ${textColorOverride ? '' : activeTemplateObj.textColor}
                ${cardLayout === "A4" ? "h-[707px]" : "h-[500px]"}`}
              style={{
                color: textColorOverride || undefined,
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              {/* Corner Ornaments */}
              {activeTemplateObj.ornaments}

              {/* Top Title Section */}
              <div className="text-center space-y-1 z-10 pt-2 flex-shrink-0">
                <p className="text-amber-600 dark:text-amber-500 font-gujarati font-bold text-xs tracking-widest uppercase">🕉️ ૐ શાંતિ 🕉️</p>
                <h1
                  className="font-gujarati font-black tracking-wide uppercase mt-0.5"
                  style={{
                    color: textColorOverride || activeTemplateObj.accentColor,
                    fontSize: `${28 + textSizeAdjust}px`,
                    lineHeight: '1.2'
                  }}
                >
                  :: {headerText} ::
                </h1>
                <div className="h-[2px] w-24 mx-auto mt-1.5" style={{ backgroundColor: textColorOverride || activeTemplateObj.accentColor }}></div>
              </div>

              {/* Middle Section: Photo & Core Details */}
              <div className="flex-1 flex flex-col justify-center items-center space-y-4 my-2 z-10 overflow-hidden">
                
                {/* Image block and Details Side by Side */}
                <div className="flex items-center gap-6 w-full px-4 justify-center">
                  
                  {/* Photo Container */}
                  <div className={`h-32 w-28 rounded-2xl overflow-hidden shadow-md bg-stone-100 flex-shrink-0 flex items-center justify-center relative select-none
                    ${showGarland && garlandStyle === 'gold_border' ? 'border-[4px] border-amber-400 ring-2 ring-amber-600/30' : 'border-[3px] border-white'}`}
                  >
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        className="w-full h-full object-cover"
                        alt="Deceased"
                        style={{ filter: photoFilter === "grayscale" ? "grayscale(100%)" : "none" }}
                      />
                    ) : (
                      <div className="text-center p-3 flex flex-col items-center">
                        <svg className="w-10 h-10 text-stone-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <p className="text-[8px] font-black text-stone-400 mt-1 uppercase tracking-wider">UPLOAD PHOTO</p>
                      </div>
                    )}
                    {/* Flower Garland Overlay */}
                    {photoUrl && showGarland && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/30 to-transparent flex items-center justify-center p-0.5 leading-none z-20">
                        <span className="text-base drop-shadow-md tracking-tighter">
                          {GARLAND_STYLES[garlandStyle]?.emoji || "🌸🏵️🌸🏵️🌸"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right side core details */}
                  <div className="space-y-1.5 text-left flex-1 min-w-0">
                    {relationship && (
                      <p className="font-gujarati text-[10px] font-bold opacity-75 uppercase tracking-wide">
                        {relationship}
                      </p>
                    )}
                    <h2
                      className="font-gujarati font-black tracking-tight truncate leading-tight"
                      style={{ fontSize: `${20 + textSizeAdjust}px` }}
                    >
                      સ્વ. {name || "[ સ્વર્ગસ્થનું નામ ]"}
                    </h2>
                    <div className="flex flex-wrap gap-2 text-xs font-gujarati font-black opacity-85">
                      {age && <span>(ઉંમર: {age})</span>}
                      {village && <span>({village})</span>}
                    </div>
                    {dateOfDeath && (
                      <p className="font-gujarati text-xs leading-normal opacity-90 border-t border-black/5 dark:border-white/5 pt-1.5 font-bold">
                        {dateOfDeath}
                      </p>
                    )}
                  </div>
                </div>

                {/* Shok Sandesh Message - Only shown fully in A4, truncated in Square if too long */}
                <div className="w-full px-4 text-center leading-relaxed">
                  <p
                    className="font-gujarati leading-relaxed"
                    style={{ fontSize: `${12.5 + textSizeAdjust}px` }}
                  >
                    {cardLayout === "Square" && message.length > 150
                      ? `${message.slice(0, 145)}...`
                      : message}
                  </p>
                </div>

                {/* Besnu Timing & Venue Details */}
                <div className="w-full px-4 bg-white/40 dark:bg-stone-900/10 p-3 rounded-2xl border border-white/50 dark:border-white/5 space-y-1.5 shadow-xs">
                  <div className="flex items-center gap-4 text-xs font-gujarati font-bold justify-center">
                    <span className="bg-amber-600/10 text-amber-800 dark:text-amber-400 px-2 py-0.5 rounded-md font-black">બેસણું સમય</span>
                    <span className="opacity-90">{besnuDate}</span>
                  </div>
                  <p className="font-gujarati text-xs text-center opacity-90">{besnuTime}</p>
                  <div className="h-px bg-black/5 dark:bg-white/5 w-1/3 mx-auto"></div>
                  <div className="flex items-center justify-center gap-1.5 font-gujarati text-xs">
                    <span className="material-symbols-outlined text-sm shrink-0" style={{ color: textColorOverride || activeTemplateObj.accentColor }}>location_on</span>
                    <span className="font-bold truncate max-w-[90%]">{besnuVenue}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Relatives Section & Google Maps QR Code */}
              <div className="border-t border-stone-300/30 pt-3 flex items-center justify-between gap-4 z-10 flex-shrink-0">
                <div className="text-left flex-1 min-w-0">
                  <p className="font-gujarati text-[9px] font-black uppercase opacity-60">શોકાતુર / સ્નેહીજનો:</p>
                  <p
                    className="font-gujarati leading-tight font-black opacity-85 whitespace-pre-line truncate mt-0.5"
                    style={{ fontSize: `${11 + textSizeAdjust}px` }}
                  >
                    {relatives || "...\n..."}
                  </p>
                </div>

                {/* Dynamic Location QR Code display */}
                {qrCodeUrl && (
                  <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border shadow-xs select-none">
                    <div className="text-right font-gujarati text-[8px] leading-tight text-stone-400 shrink-0">
                      <p className="font-black text-[9px] text-stone-600">નકશા લિંક</p>
                      <p>સ્કેન કરો</p>
                    </div>
                    <img 
                      src={qrCodeUrl} 
                      alt="Google Maps QR Code" 
                      className="w-12 h-12 object-contain" 
                      crossOrigin={qrCodeUrl?.startsWith('data:') ? undefined : "anonymous"} 
                    />
                  </div>
                )}
              </div>

              {/* Card Watermark */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 opacity-30 select-none text-[8px] font-sans font-bold uppercase tracking-widest text-center">
                gujarati app • shradhanjali maker
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// ─── HELPER COMPONENTS ────────────────────────────────────
function FormInput({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="space-y-1.5 w-full text-left">
      <label className="block text-xs font-black text-stone-600 dark:text-stone-300 font-gujarati tracking-wide">{label}:</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900 text-xs sm:text-sm font-gujarati focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-stone-950 transition-all text-stone-800 dark:text-stone-100 placeholder-stone-400"
        placeholder={placeholder}
      />
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text", options }) {
  if (options) {
    return (
      <div className="space-y-1 w-full text-left">
        <label className="block text-xs font-black text-stone-500 font-gujarati">{label}:</label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-gujarati focus:outline-none focus:border-primary transition-all bg-white"
        >
          <option value="" disabled>{placeholder}</option>
          {options.map(opt => (
            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="space-y-1 w-full text-left">
      <label className="block text-xs font-black text-stone-500 font-gujarati">{label}:</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-gujarati focus:outline-none focus:border-primary transition-all"
        placeholder={placeholder}
      />
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-center text-xs sm:text-sm border-b border-black/5 dark:border-white/5 py-1">
      <span className="font-gujarati font-bold opacity-75">{label}:</span>
      <span className="font-gujarati font-black text-right truncate max-w-[70%]">{value}</span>
    </div>
  );
}
