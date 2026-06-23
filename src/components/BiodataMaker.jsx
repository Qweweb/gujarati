import { uploadToCloudinary } from '../utils/cloudinaryHelper';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GOD_ICONS = [
  {
    id: "ganesha",
    name: "ગણેશજી (Ganesha)",
    imgUrl: "/icons/ganesha.png",
    labelGu: "શ્રી ગણેશાય નમઃ",
    labelEn: "Shree Ganeshaya Namah"
  },
  {
    id: "shiva",
    name: "શિવજી (Shiva)",
    imgUrl: "/icons/shiva.png",
    labelGu: "નમઃ શિવાય",
    labelEn: "Namah Shivaya"
  },
  {
    id: "krishna",
    name: "શ્રી કૃષ્ણ (Krishna)",
    imgUrl: "/icons/krishna.png",
    labelGu: "શ્રી કૃષ્ણાય નમઃ",
    labelEn: "Shree Krishnaya Namah"
  },
  {
    id: "swastika",
    name: "સ્વસ્તિક (Swastik)",
    textIcon: "卐",
    labelGu: "શુભ લાભ",
    labelEn: "Shubh Labh"
  },
  {
    id: "om",
    name: "ૐ (Om Symbol)",
    textIcon: "ॐ",
    labelGu: "હરિ ૐ",
    labelEn: "Hari Om"
  },
  {
    id: "hanuman",
    name: "હનુમાનજી (Hanuman)",
    imgUrl: "/icons/hanuman.png",
    labelGu: "જય શ્રી રામ",
    labelEn: "Jai Shree Ram"
  },
  {
    id: "shree",
    name: "શ્રી / દિપક (Diya)",
    textIcon: "🪔",
    labelGu: "શ્રી હરિ",
    labelEn: "Shree Hari"
  }
];

const RASHI_OPTIONS = [
  { value: "મેષ", label: "મેષ (Aries)" },
  { value: "વૃષભ", label: "વૃષભ (Taurus)" },
  { value: "મિથુન", label: "મિથુન (Gemini)" },
  { value: "કર્ક", label: "કર્ક (Cancer)" },
  { value: "સિંહ", label: "સિંહ (Leo)" },
  { value: "કન્યા", label: "કન્યા (Virgo)" },
  { value: "તુલા", label: "તુલા (Libra)" },
  { value: "વૃશ્ચિક", label: "વૃશ્ચિક (Scorpio)" },
  { value: "ધન", label: "ધન (Sagittarius)" },
  { value: "મકર", label: "મકર (Capricorn)" },
  { value: "કુંભ", label: "કુંભ (Aquarius)" },
  { value: "મીન", label: "મીન (Pisces)" }
];

const COMPLEXION_OPTIONS = [
  { value: "ઘઉંવર્ણ", label: "ઘઉંવર્ણ (Fair)" },
  { value: "ગોરો", label: "ગોરો (Very Fair)" },
  { value: "શ્યામ", label: "શ્યામ (Wheatish)" },
  { value: "તેજસ્વી", label: "તેજસ્વી (Bright)" }
];

const BLOOD_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "નથી ખબર / Unknown"];

const MARRIAGE_TEMPLATES = [
  {
    id: "royal_saffron",
    name: "૧. રોયલ કેસરી (Royal Saffron Vine)",
    accentColor: "#2D3748",
    headerBg: "bg-yellow-700 text-white",
    cardBg: "bg-[#FFFDF9]",
    textColor: "text-yellow-950",
    borderClass: "border-[2pt] border-[#8B0000]",
    customDecor: (
      <>
        <div className="absolute top-4 left-4 text-[#8B0000]/30 text-4xl select-none">🍃</div>
        <div className="absolute top-4 right-4 text-[#8B0000]/30 text-4xl select-none rotate-90">🍃</div>
        <div className="absolute bottom-4 left-4 text-[#8B0000]/30 text-4xl select-none -rotate-90">🍃</div>
        <div className="absolute bottom-4 right-4 text-[#8B0000]/30 text-4xl select-none rotate-180">🍃</div>
      </>
    )
  },
  {
    id: "sunset_shimmer",
    name: "૨. સનસેટ શિમર (Sunset Shimmer)",
    accentColor: "#be185d",
    headerBg: "bg-emerald-600 text-white",
    cardBg: "bg-[#FFFDF9]",
    textColor: "text-rose-950",
    borderClass: "border-[2pt] border-[#8B0000]",
    customDecor: (
      <>
        <div className="absolute top-4 left-4 text-pink-500/50 text-3xl">🌸</div>
        <div className="absolute top-4 right-4 text-pink-500/50 text-3xl">🌸</div>
        <div className="absolute bottom-4 left-4 text-pink-500/50 text-3xl">🌸</div>
        <div className="absolute bottom-4 right-4 text-pink-500/50 text-3xl">🌸</div>
      </>
    )
  },
  {
    id: "peacock_teal",
    name: "૩. મોરપીંછ ટેલ (Peacock Teal)",
    accentColor: "#0f766e",
    headerBg: "bg-teal-700 text-white",
    cardBg: "bg-[#FFFDF9]",
    textColor: "text-teal-950",
    borderClass: "border-[2pt] border-[#D4AF37]",
    customDecor: (
      <>
        <div className="absolute top-4 left-4 text-teal-600/40 text-4xl">🪶</div>
        <div className="absolute top-4 right-4 text-teal-600/40 text-4xl rotate-90">🪶</div>
        <div className="absolute bottom-4 left-4 text-teal-600/40 text-4xl -rotate-90">🪶</div>
        <div className="absolute bottom-4 right-4 text-teal-600/40 text-4xl rotate-180">🪶</div>
      </>
    )
  },
  {
    id: "vintage_ivory",
    name: "૪. વિન્ટેજ આઇવરી (Vintage Ivory)",
    accentColor: "#854d0e",
    headerBg: "bg-yellow-800 text-white",
    cardBg: "bg-[#FFFDF9]",
    textColor: "text-stone-900",
    borderClass: "border-[2pt] border-[#D4AF37]",
    customDecor: (
      <>
        <div className="absolute top-4 left-4 text-[#D4AF37]/40 text-3xl">⚜️</div>
        <div className="absolute top-4 right-4 text-[#D4AF37]/40 text-3xl">⚜️</div>
        <div className="absolute bottom-4 left-4 text-[#D4AF37]/40 text-3xl">⚜️</div>
        <div className="absolute bottom-4 right-4 text-[#D4AF37]/40 text-3xl">⚜️</div>
      </>
    )
  },
  {
    id: "cloud_sky",
    name: "૫. મેઘ મલ્હાર (Cloud Sky)",
    accentColor: "#1e3a8a",
    headerBg: "bg-blue-800 text-white",
    cardBg: "bg-[#FFFDF9]",
    textColor: "text-blue-950",
    borderClass: "border-[2pt] border-[#8B0000]",
    customDecor: (
      <>
        <div className="absolute top-4 left-4 text-blue-500/30 text-3xl">✨</div>
        <div className="absolute top-4 right-4 text-blue-500/30 text-3xl">✨</div>
        <div className="absolute bottom-4 left-4 text-blue-500/30 text-3xl">✨</div>
        <div className="absolute bottom-4 right-4 text-blue-500/30 text-3xl">✨</div>
      </>
    )
  }
];

const JOB_TEMPLATES = [
  {
    id: "executive_sidebar",
    name: "૧. એક્ઝિક્યુટિવ સાઇડબાર (Executive Sidebar)",
    accentColor: "#1e3a8a",
    bgColor: "#ffffff",
    textColor: "text-stone-800",
    borderStyle: "border-0 bg-white"
  },
  {
    id: "slate_grid",
    name: "૨. પ્રોફેશનલ ગ્રીડ (Symmetrical Slate)",
    accentColor: "#334155",
    bgColor: "#ffffff",
    textColor: "text-stone-950",
    borderStyle: "border-0 bg-white"
  },
  {
    id: "clean_modern",
    name: "૩. મિનિમલ મોડર્ન (Minimal Modern)",
    accentColor: "#0d9488",
    bgColor: "#ffffff",
    textColor: "text-stone-900",
    borderStyle: "border-0 bg-white"
  }
];

const BiodataMaker = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('marriage'); // 'marriage' or 'job'
  const [lang, setLang] = useState('gu'); // 'gu' (Gujarati) or 'en' (English)
  const [selectedTemplate, setSelectedTemplate] = useState('royal_saffron');
  const [selectedGod, setSelectedGod] = useState(GOD_ICONS[0]); // Default Ganesha
  const [isGenerating, setIsGenerating] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);

  // Marriage Fields
  const [marriageData, setMarriageData] = useState({
    fullName: '',
    dob: '',
    birthTime: '',
    birthPlace: '',
    rashi: '',
    height: '',
    complexion: '',
    bloodGroup: '',
    education: '',
    occupation: '',
    income: '',
    fatherName: '',
    fatherOcc: '',
    motherName: '',
    siblings: '',
    maternalUncle: '',
    nativePlace: '',
    mobile: '',
    address: ''
  });

  // Job Resume Fields
  const [jobData, setJobData] = useState({
    fullName: '',
    title: '',
    email: '',
    mobile: '',
    address: '',
    linkedin: '',
    summary: '',
    education: '',
    experience: '',
    skills: '',
    languages: ''
  });

  const handleMarriageChange = (field, value) => {
    setMarriageData(prev => ({ ...prev, [field]: value }));
  };

  const handleJobChange = (field, value) => {
    setJobData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoUrl(URL.createObjectURL(file));
    }
  };

  const currentTemplateObj = activeTab === 'marriage'
    ? MARRIAGE_TEMPLATES.find(t => t.id === selectedTemplate) || MARRIAGE_TEMPLATES[0]
    : JOB_TEMPLATES.find(t => t.id === selectedTemplate) || JOB_TEMPLATES[0];

  const handlePrint = () => {
    setIsGenerating(true);
    setTimeout(async () => {
      try {
        const html2pdf = (await import('html2pdf.js')).default;
        const element = document.getElementById("printable-biodata-card");
        
        const options = {
          margin: 0,
          filename: "Gujarati-Biodata.pdf",
          image: { type: "jpeg", quality: 1 },
          html2canvas: {
            scale: 3,
            useCORS: true,
            backgroundColor: "#ffffff",
            windowWidth: 800
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["avoid-all", "css", "legacy"] }
        };

        await html2pdf().set(options).from(element).save();
      } catch (error) {
        console.error("PDF generation error", error);
      } finally {
        setIsGenerating(false);
      }
    }, 500);
  };

  // Translations Mapping
  const t = {
    gu: {
      personalHeader: "વ્યક્તિગત માહિતી",
      careerHeader: "અભ્યાસ અને નોકરી",
      familyHeader: "પરિવારની વિગત",
      contactHeader: "સંપર્ક વિગત",
      titleMain: "શુભ લગ્ન બાયોડેટા",
      
      // Labels
      fullName: "પૂરું નામ",
      dob: "જન્મ તારીખ",
      birthTime: "જન્મ સમય",
      birthPlace: "જન્મ સ્થળ",
      rashi: "રાશિ",
      height: "ઊંચાઈ",
      complexion: "વર્ણ / રંગ",
      bloodGroup: "બ્લડ ગ્રુપ",
      education: "શિક્ષણ",
      occupation: "વ્યવસાય / નોકરી",
      income: "વાર્ષિક આવક",
      fatherName: "પિતાનું નામ",
      fatherOcc: "પિતાનો વ્યવસાય",
      motherName: "માતાનું નામ",
      siblings: "ભાઈ / બહેન",
      maternalUncle: "મોસાળ (મામાનું ગામ)",
      nativePlace: "મૂળ વતન",
      mobile: "મોબાઈલ નંબર",
      address: "સરનામું",

      // Resume Labels
      summaryHeader: "પ્રોફેશનલ સમરી",
      expHeader: "કામનો અનુભવ",
      eduHeader: "શિક્ષણ લાયકાત",
      skillsHeader: "મુખ્ય કૌશલ્યો",
      langHeader: "જાણીતી ભાષાઓ"
    },
    en: {
      personalHeader: "Personal Details",
      careerHeader: "Education & Career",
      familyHeader: "Family Details",
      contactHeader: "Contact Information",
      titleMain: "MARRIAGE BIODATA",

      // Labels
      fullName: "Full Name",
      dob: "Date of Birth",
      birthTime: "Time of Birth",
      birthPlace: "Place of Birth",
      rashi: "Rashi / Moon Sign",
      height: "Height",
      complexion: "Complexion",
      bloodGroup: "Blood Group",
      education: "Education",
      occupation: "Occupation",
      income: "Annual Income",
      fatherName: "Father's Name",
      fatherOcc: "Father's Occupation",
      motherName: "Mother's Name",
      siblings: "Siblings",
      maternalUncle: "Maternal Uncle",
      nativePlace: "Native Place",
      mobile: "Mobile Number",
      address: "Address",

      // Resume Labels
      summaryHeader: "Professional Summary",
      expHeader: "Work Experience",
      eduHeader: "Education Qualification",
      skillsHeader: "Core Skills",
      langHeader: "Languages Known"
    }
  };

  const labels = t[lang];

  return (
    <div className="animate-fade-in space-y-8 pb-20 print:p-0 print:pb-0">
      
      {/* Header - Hidden on print */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 print:hidden">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/tools')} className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary border border-primary/10 active:scale-95 transition-transform">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="font-gujarati font-black text-2xl text-primary">બાયોડેટા મેકર (Premium Biodata Maker)</h2>
        </div>

        {/* Language Selection Toggle */}
        <div className="flex bg-stone-100 dark:bg-dark-bg p-1 rounded-2xl border border-primary/10 self-start sm:self-center">
          <button
            onClick={() => setLang('gu')}
            className={`px-4 py-2 rounded-xl text-xs font-gujarati font-bold transition-all ${lang === 'gu' ? 'bg-primary text-white shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
          >
            ગુજરાતી ભાષા
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-4 py-2 rounded-xl text-xs font-gujarati font-bold transition-all ${lang === 'en' ? 'bg-primary text-white shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
          >
            English Only
          </button>
        </div>
      </div>

      {/* Mode Tabs - Hidden on print */}
      <div className="flex p-1 bg-stone-100 dark:bg-dark-bg rounded-2xl print:hidden">
        <button
          onClick={() => {
            setActiveTab('marriage');
            setSelectedTemplate('royal_saffron');
          }}
          className={`flex-1 py-3 rounded-xl font-gujarati font-bold transition-all ${activeTab === 'marriage' ? 'bg-primary text-white shadow-lg' : 'text-stone-500 hover:bg-black/5'}`}
        >
          💒 શુભ લગ્ન બાયોડેટા (Marriage)
        </button>
        <button
          onClick={() => {
            setActiveTab('job');
            setSelectedTemplate('executive_sidebar');
          }}
          className={`flex-1 py-3 rounded-xl font-gujarati font-bold transition-all ${activeTab === 'job' ? 'bg-primary text-white shadow-lg' : 'text-stone-500 hover:bg-black/5'}`}
        >
          💼 કંપની નોકરી માટે (Resume)
        </button>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block print:w-full items-start">
        
        {/* Left Form: Hidden on print, Sticky on large screens */}
        <div className="lg:col-span-5 space-y-6 print:hidden lg:sticky lg:top-24 h-fit">
          
          {/* Template Selection */}
          <section className="bg-white dark:bg-dark-surface p-6 rounded-[2.5rem] shadow-sm border border-primary/5 space-y-4">
            <h3 className="font-gujarati font-black text-lg text-stone-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">palette</span>
              થીમ ડિઝાઇન પસંદ કરો
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(activeTab === 'marriage' ? MARRIAGE_TEMPLATES : JOB_TEMPLATES).map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${selectedTemplate === tmpl.id ? 'border-primary bg-primary/5 text-primary scale-105 shadow-md' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                >
                  <span className="font-gujarati font-black text-xs text-center leading-snug">{tmpl.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Spiritual Symbol Selection - Hidden on Job Tab & Print */}
          {activeTab === 'marriage' && (
            <section className="bg-white dark:bg-dark-surface p-6 rounded-[2.5rem] shadow-sm border border-primary/5 space-y-4">
              <h3 className="font-gujarati font-black text-lg text-stone-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">brightness_5</span>
                ભગવાન / આરાધ્ય દેવ પ્રતીક પસંદ કરો
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {GOD_ICONS.map((god) => (
                  <button
                    key={god.id}
                    onClick={() => setSelectedGod(god)}
                    title={god.name}
                    className={`p-2 rounded-2xl border flex flex-col items-center justify-center transition-all ${selectedGod.id === god.id ? 'bg-primary/10 border-primary scale-110 shadow-sm' : 'border-stone-200 bg-stone-50 hover:bg-stone-100'}`}
                  >
                    {god.textIcon ? (
                      <span className="text-3xl drop-shadow-sm">{god.textIcon}</span>
                    ) : (
                      <img src={god.imgUrl} alt={god.name} className="w-10 h-10 object-contain drop-shadow-sm" />
                    )}
                  </button>
                ))}
              </div>
              <p className="font-gujarati text-[11px] text-stone-400 font-bold">
                * નોંધ: પસંદ કરેલા ભગવાન મુજબ બાયોડેટાના ટોચનું પ્રતીક અને નીચેનો મંત્ર આપોઆપ બદલાઈ જશે.
              </p>
            </section>
          )}

          {/* Photo Upload Box */}
          <section className="bg-white dark:bg-dark-surface p-6 rounded-[2.5rem] shadow-sm border border-primary/5 space-y-4">
            <h3 className="font-gujarati font-black text-lg text-stone-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">photo_camera</span>
              પ્રોફાઇલ ફોટો ઉમેરો (Optional Photo Upload)
            </h3>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                id="photo-upload-input"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <label
                htmlFor="photo-upload-input"
                className="cursor-pointer bg-primary/10 text-primary px-6 py-3 rounded-2xl font-gujarati font-bold hover:bg-primary/20 transition-all text-sm active:scale-95"
              >
                ફોટો સિલેક્ટ કરો
              </label>
              {photoUrl && (
                <button
                  onClick={() => setPhotoUrl(null)}
                  className="bg-rose-50 text-emerald-600 border border-rose-200 px-4 py-3 rounded-2xl font-gujarati text-xs font-bold"
                >
                  ફોટો હટાવો
                </button>
              )}
            </div>
          </section>

          {/* Form Fields */}
          {activeTab === 'marriage' ? (
            <div className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-primary/5 space-y-6">
              <h3 className="font-gujarati font-black text-xl text-primary border-b border-stone-100 pb-3">{labels.personalHeader}</h3>
              <div className="space-y-4">
                <Input label="પૂરું નામ (Full Name)" value={marriageData.fullName} onChange={(val) => handleMarriageChange('fullName', val)} placeholder="નામ, પિતાનું નામ, અટક" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="જન્મ તારીખ" type="date" value={marriageData.dob} onChange={(val) => handleMarriageChange('dob', val)} />
                  <Input label="જન્મ સમય" type="time" value={marriageData.birthTime} onChange={(val) => handleMarriageChange('birthTime', val)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="જન્મ સ્થળ" value={marriageData.birthPlace} onChange={(val) => handleMarriageChange('birthPlace', val)} placeholder="દા.ત. સુરત" />
                  <Input
                    label="રાશિ (Rashi)"
                    value={marriageData.rashi}
                    onChange={(val) => handleMarriageChange('rashi', val)}
                    placeholder="-- રાશિ સિલેક્ટ કરો --"
                    options={RASHI_OPTIONS}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="ઊંચાઈ" value={marriageData.height} onChange={(val) => handleMarriageChange('height', val)} placeholder={"દા.ત. 5' 8\""} />
                  <Input
                    label="વર્ણ / રંગ (Complexion)"
                    value={marriageData.complexion}
                    onChange={(val) => handleMarriageChange('complexion', val)}
                    placeholder="-- રંગ સિલેક્ટ કરો --"
                    options={COMPLEXION_OPTIONS}
                  />
                </div>
                <Input
                  label="લોહીનું ગ્રુપ (Blood Group)"
                  value={marriageData.bloodGroup}
                  onChange={(val) => handleMarriageChange('bloodGroup', val)}
                  placeholder="-- બ્લડ ગ્રુપ સિલેક્ટ કરો --"
                  options={BLOOD_OPTIONS}
                />
              </div>

              <h3 className="font-gujarati font-black text-xl text-primary border-b border-stone-100 pb-3 pt-4">{labels.careerHeader}</h3>
              <div className="space-y-4">
                <Input label="શિક્ષણ (Education)" value={marriageData.education} onChange={(val) => handleMarriageChange('education', val)} placeholder="દા.ત. B.Com" />
                <Input label="વ્યવસાય / નોકરી (Occupation)" value={marriageData.occupation} onChange={(val) => handleMarriageChange('occupation', val)} placeholder="દા.ત. બેંક એકાઉન્ટન્ટ" />
                <Input label="વાર્ષિક આવક" value={marriageData.income} onChange={(val) => handleMarriageChange('income', val)} placeholder="દા.ત. ૬,૦૦,૦૦૦ પ્રતિ વર્ષ" />
              </div>

              <h3 className="font-gujarati font-black text-xl text-primary border-b border-stone-100 pb-3 pt-4">{labels.familyHeader}</h3>
              <div className="space-y-4">
                <Input label="પિતાનું નામ" value={marriageData.fatherName} onChange={(val) => handleMarriageChange('fatherName', val)} />
                <Input label="પિતાનો વ્યવસાય" value={marriageData.fatherOcc} onChange={(val) => handleMarriageChange('fatherOcc', val)} />
                <Input label="માતાનું નામ" value={marriageData.motherName} onChange={(val) => handleMarriageChange('motherName', val)} />
                <Input label="ભાઈ / બહેન" value={marriageData.siblings} onChange={(val) => handleMarriageChange('siblings', val)} placeholder="દા.ત. ૧ ભાઈ, ૧ બહેન" />
                <Input label="મોસાળ (મામાનું ગામ)" value={marriageData.maternalUncle} onChange={(val) => handleMarriageChange('maternalUncle', val)} />
                <Input label="મૂળ વતન" value={marriageData.nativePlace} onChange={(val) => handleMarriageChange('nativePlace', val)} />
              </div>

              <h3 className="font-gujarati font-black text-xl text-primary border-b border-stone-100 pb-3 pt-4">{labels.contactHeader}</h3>
              <div className="space-y-4">
                <Input label="મોબાઈલ નંબર" value={marriageData.mobile} onChange={(val) => handleMarriageChange('mobile', val)} />
                <Input label="સરનામું" value={marriageData.address} onChange={(val) => handleMarriageChange('address', val)} />
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-primary/5 space-y-6">
              <h3 className="font-gujarati font-black text-xl text-primary border-b border-stone-100 pb-3">વ્યવસાયિક વિગત (Resume Details)</h3>
              <div className="space-y-4">
                <Input label="પૂરું નામ (Full Name)" value={jobData.fullName} onChange={(val) => handleJobChange('fullName', val)} />
                <Input label="પ્રોફેશનલ શીર્ષક (Job Title)" value={jobData.title} onChange={(val) => handleJobChange('title', val)} placeholder="દા.ત. સિનિયર ડેવલપર" />
                <Input label="પ્રોફેશનલ સમરી (Summary)" value={jobData.summary} onChange={(val) => handleJobChange('summary', val)} placeholder="તમારા કૌશલ્ય વિશે ટૂંકી સમરી..." />
              </div>

              <h3 className="font-gujarati font-black text-xl text-primary border-b border-stone-100 pb-3 pt-4">સંપર્ક વિગત</h3>
              <div className="space-y-4">
                <Input label="ઈમેલ એડ્રેસ" type="email" value={jobData.email} onChange={(val) => handleJobChange('email', val)} />
                <Input label="મોબાઈલ નંબર" value={jobData.mobile} onChange={(val) => handleJobChange('mobile', val)} />
                <Input label="સરનામું" value={jobData.address} onChange={(val) => handleJobChange('address', val)} />
                <Input label="LinkedIn / વેબસાઇટ" value={jobData.linkedin} onChange={(val) => handleJobChange('linkedin', val)} />
              </div>

              <h3 className="font-gujarati font-black text-xl text-primary border-b border-stone-100 pb-3 pt-4">અનુભવ અને શિક્ષણ</h3>
              <div className="space-y-4">
                <Input label="કામનો અનુભવ" value={jobData.experience} onChange={(val) => handleJobChange('experience', val)} placeholder="કંપનીનું નામ, સમય અને રોલ..." />
                <Input label="શિક્ષણ લાયકાત" value={jobData.education} onChange={(val) => handleJobChange('education', val)} placeholder="ડિગ્રી અને સંસ્થા..." />
                <Input label="કૌશલ્યો (Skills)" value={jobData.skills} onChange={(val) => handleJobChange('skills', val)} placeholder="દા.ત. JavaScript, accounting..." />
                <Input label="જાણીતી ભાષાઓ" value={jobData.languages} onChange={(val) => handleJobChange('languages', val)} placeholder="દા.ત. ગુજરાતી, English..." />
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handlePrint}
            disabled={isGenerating}
            className="w-full bg-primary text-white py-5 rounded-[2rem] font-gujarati font-black text-xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
            સુંદર બાયોડેટા PDF ડાઉનલોડ કરો
          </button>
        </div>

        {/* Right Side: Live Premium A4 Sheet Render */}
        <div className="lg:col-span-7 print:block print:w-full print:border-none print:shadow-none print:m-0 print:p-0 min-w-0">
          <h3 className="font-gujarati font-black text-lg text-stone-800 mb-4 flex items-center gap-2 print:hidden">
            <span className="material-symbols-outlined text-primary">visibility</span>
            પ્રીમિયમ ડિઝાઇન લાઈવ પ્રિવ્યૂ (A4 Print-Ready)
          </h3>

          {/* Core Printable Sheet Card Wrapper for Mobile */}
          <div className="w-full flex justify-center pb-4 overflow-hidden">
            <div
              id="printable-biodata-card"
              className={`w-full max-w-[21cm] min-h-[29.7cm] mx-auto relative overflow-hidden transition-all flex flex-col justify-between ${activeTab === 'marriage' ? 'bg-[#f8f5ef] p-0 font-gujarati text-[#333]' : 'p-8 sm:p-10 bg-white font-sans text-stone-800'}`}
            >
            {activeTab === 'marriage' ? (
                <div className="w-full bg-white shadow-[0_0_20px_rgba(0,0,0,0.08)] h-full min-h-[29.7cm]">
                    <div className="text-center text-white p-4 md:p-[30px]" style={{ background: 'linear-gradient(135deg,#9d7a2f,#d4b15f)' }}>
                        <h1 className="text-2xl md:text-[34px] mb-2 md:mb-[10px] font-bold">|| {lang === 'gu' ? selectedGod.labelGu : selectedGod.labelEn} ||</h1>
                        <p className="text-sm md:text-[18px]">❀ {labels.titleMain} ❀</p>
                    </div>

                    <div className="text-center p-4 md:p-[25px]">
                        <img src={photoUrl || "https://via.placeholder.com/170"} className="w-24 h-24 md:w-[170px] md:h-[170px] rounded-full border-4 md:border-[6px] border-[#d4b15f] object-cover mx-auto inline-block bg-stone-100" alt="Profile" />
                    </div>

                    <div className="m-3 md:m-[20px] rounded-lg md:rounded-[15px] overflow-hidden border border-[#ececec]">
                        <div className="bg-[#0B3B36] text-white px-3 py-2 md:px-[20px] md:py-[12px] text-lg md:text-[20px] font-semibold">
                            {labels.personalHeader}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="p-3 md:p-[15px_20px] border-b md:border-r border-[#eee]"><div className="text-[#888] text-xs md:text-[14px] mb-1 md:mb-[5px]">{labels.fullName}</div><div className="text-sm md:text-[17px] font-semibold text-[#222]">{marriageData.fullName || '----'}</div></div>
                            <div className="p-3 md:p-[15px_20px] border-b border-[#eee]"><div className="text-[#888] text-xs md:text-[14px] mb-1 md:mb-[5px]">{labels.dob}</div><div className="text-sm md:text-[17px] font-semibold text-[#222]">{marriageData.dob || '----'}</div></div>
                            <div className="p-3 md:p-[15px_20px] border-b md:border-r border-[#eee]"><div className="text-[#888] text-xs md:text-[14px] mb-1 md:mb-[5px]">{labels.birthTime}</div><div className="text-sm md:text-[17px] font-semibold text-[#222]">{marriageData.birthTime || '----'}</div></div>
                            <div className="p-3 md:p-[15px_20px] border-b border-[#eee]"><div className="text-[#888] text-xs md:text-[14px] mb-1 md:mb-[5px]">{labels.birthPlace}</div><div className="text-sm md:text-[17px] font-semibold text-[#222]">{marriageData.birthPlace || '----'}</div></div>
                            <div className="p-3 md:p-[15px_20px] border-b md:border-r border-[#eee]"><div className="text-[#888] text-xs md:text-[14px] mb-1 md:mb-[5px]">{labels.rashi}</div><div className="text-sm md:text-[17px] font-semibold text-[#222]">{marriageData.rashi || '----'}</div></div>
                            <div className="p-3 md:p-[15px_20px] border-b border-[#eee]"><div className="text-[#888] text-xs md:text-[14px] mb-1 md:mb-[5px]">{labels.height}</div><div className="text-sm md:text-[17px] font-semibold text-[#222]">{marriageData.height || '----'}</div></div>
                            <div className="p-3 md:p-[15px_20px] border-b md:border-r border-[#eee]"><div className="text-[#888] text-xs md:text-[14px] mb-1 md:mb-[5px]">{labels.complexion}</div><div className="text-sm md:text-[17px] font-semibold text-[#222]">{marriageData.complexion || '----'}</div></div>
                            <div className="p-3 md:p-[15px_20px] border-b border-[#eee]"><div className="text-[#888] text-xs md:text-[14px] mb-1 md:mb-[5px]">{labels.bloodGroup}</div><div className="text-sm md:text-[17px] font-semibold text-[#222]">{marriageData.bloodGroup || '----'}</div></div>
                        </div>
                    </div>

                    <div className="m-3 md:m-[20px] rounded-lg md:rounded-[15px] overflow-hidden border border-[#ececec]">
                        <div className="bg-[#0B3B36] text-white px-3 py-2 md:px-[20px] md:py-[12px] text-lg md:text-[20px] font-semibold">
                            {labels.careerHeader}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="col-span-1 md:col-span-2 p-3 md:p-[15px_20px] border-b border-[#eee]"><div className="text-[#888] text-xs md:text-[14px] mb-1 md:mb-[5px]">{labels.education}</div><div className="text-sm md:text-[17px] font-semibold text-[#222]">{marriageData.education || '----'}</div></div>
                            <div className="p-3 md:p-[15px_20px] border-b md:border-r border-[#eee]"><div className="text-[#888] text-xs md:text-[14px] mb-1 md:mb-[5px]">{labels.occupation}</div><div className="text-sm md:text-[17px] font-semibold text-[#222]">{marriageData.occupation || '----'}</div></div>
                            <div className="p-3 md:p-[15px_20px] border-b border-[#eee]"><div className="text-[#888] text-xs md:text-[14px] mb-1 md:mb-[5px]">{labels.income}</div><div className="text-sm md:text-[17px] font-semibold text-[#222]">{marriageData.income || '----'}</div></div>
                        </div>
                    </div>

                    <div className="m-3 md:m-[20px] rounded-lg md:rounded-[15px] overflow-hidden border border-[#ececec]">
                        <div className="bg-[#0B3B36] text-white px-3 py-2 md:px-[20px] md:py-[12px] text-lg md:text-[20px] font-semibold">
                            {labels.familyHeader}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="p-3 md:p-[15px_20px] border-b md:border-r border-[#eee]"><div className="text-[#888] text-xs md:text-[14px] mb-1 md:mb-[5px]">{labels.fatherName}</div><div className="text-sm md:text-[17px] font-semibold text-[#222]">{marriageData.fatherName || '----'}</div></div>
                            <div className="p-3 md:p-[15px_20px] border-b border-[#eee]"><div className="text-[#888] text-xs md:text-[14px] mb-1 md:mb-[5px]">{labels.fatherOcc}</div><div className="text-sm md:text-[17px] font-semibold text-[#222]">{marriageData.fatherOcc || '----'}</div></div>
                            <div className="p-3 md:p-[15px_20px] border-b md:border-r border-[#eee]"><div className="text-[#888] text-xs md:text-[14px] mb-1 md:mb-[5px]">{labels.motherName}</div><div className="text-sm md:text-[17px] font-semibold text-[#222]">{marriageData.motherName || '----'}</div></div>
                            <div className="p-3 md:p-[15px_20px] border-b border-[#eee]"><div className="text-[#888] text-xs md:text-[14px] mb-1 md:mb-[5px]">{labels.siblings}</div><div className="text-sm md:text-[17px] font-semibold text-[#222]">{marriageData.siblings || '----'}</div></div>
                            <div className="p-3 md:p-[15px_20px] border-b md:border-r border-[#eee]"><div className="text-[#888] text-xs md:text-[14px] mb-1 md:mb-[5px]">{labels.maternalUncle}</div><div className="text-sm md:text-[17px] font-semibold text-[#222]">{marriageData.maternalUncle || '----'}</div></div>
                            <div className="p-3 md:p-[15px_20px] border-b border-[#eee]"><div className="text-[#888] text-xs md:text-[14px] mb-1 md:mb-[5px]">{labels.nativePlace}</div><div className="text-sm md:text-[17px] font-semibold text-[#222]">{marriageData.nativePlace || '----'}</div></div>
                        </div>
                    </div>

                    <div className="m-3 md:m-[20px] rounded-lg md:rounded-[15px] overflow-hidden border border-[#ececec]">
                        <div className="bg-[#0B3B36] text-white px-3 py-2 md:px-[20px] md:py-[12px] text-lg md:text-[20px] font-semibold">
                            {labels.contactHeader}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="p-3 md:p-[15px_20px] border-b md:border-r border-[#eee]"><div className="text-[#888] text-xs md:text-[14px] mb-1 md:mb-[5px]">{labels.mobile}</div><div className="text-sm md:text-[17px] font-semibold text-[#222]">{marriageData.mobile || '----'}</div></div>
                            <div className="p-3 md:p-[15px_20px] border-b border-[#eee]"><div className="text-[#888] text-xs md:text-[14px] mb-1 md:mb-[5px]">{labels.address}</div><div className="text-sm md:text-[17px] font-semibold text-[#222]">{marriageData.address || '----'}</div></div>
                        </div>
                    </div>
                </div>
              ) : (
                // JOB BIODATA PREVIEW (Resume) Two-Column Grid
                <div className="flex flex-col md:flex-row w-full h-full min-h-[29.7cm] shadow-[0_10px_40px_rgba(0,0,0,0.08)] bg-white font-[Poppins,sans-serif]">
                  
                  {/* Left Sidebar 32% */}
                  <div className="w-full md:w-[32%] bg-[#0B3B36] text-white p-8 md:p-[35px_25px] flex flex-col min-w-0">
                    
                    {/* Profile */}
                    <div className="text-center mb-[30px]">
                      {photoUrl ? (
                        <img src={photoUrl} className="w-24 h-24 md:w-[140px] md:h-[140px] max-w-full rounded-full object-cover border-[5px] border-white/20 mx-auto" alt="Profile" />
                      ) : (
                        <div className="w-24 h-24 md:w-[140px] md:h-[140px] max-w-full rounded-full border-[5px] border-white/20 mx-auto bg-white/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-4xl md:text-5xl text-white/50">person</span>
                        </div>
                      )}
                      <div className="text-2xl md:text-[28px] font-bold mt-[15px] leading-[1.2]">{jobData.fullName || 'Rahul Patel'}</div>
                      <div className="text-xs md:text-[14px] tracking-[1px] mt-[8px] text-[#d4d9dd]">{jobData.title || 'Full Stack Developer'}</div>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-[30px]">
                      <h3 className="text-[15px] uppercase tracking-[2px] mb-[15px] pb-[8px] border-b border-white/25">Contact</h3>
                      {jobData.mobile && <div className="mb-[12px] text-[14px] leading-[1.6]">📞 {jobData.mobile}</div>}
                      {jobData.email && <div className="mb-[12px] text-[14px] leading-[1.6] break-words">✉ {jobData.email}</div>}
                      {jobData.address && <div className="mb-[12px] text-[14px] leading-[1.6]">📍 {jobData.address}</div>}
                      {jobData.linkedin && <div className="mb-[12px] text-[14px] leading-[1.6] break-words">🌐 {jobData.linkedin}</div>}
                      {!jobData.mobile && !jobData.email && !jobData.address && !jobData.linkedin && (
                         <>
                           <div className="mb-[12px] text-[14px] leading-[1.6]">📞 +91 9876543210</div>
                           <div className="mb-[12px] text-[14px] leading-[1.6]">✉ rahul@gmail.com</div>
                           <div className="mb-[12px] text-[14px] leading-[1.6]">📍 Ahmedabad, Gujarat</div>
                           <div className="mb-[12px] text-[14px] leading-[1.6]">🌐 www.portfolio.com</div>
                         </>
                      )}
                    </div>

                    {/* Skills */}
                    <div className="mt-[30px]">
                      <h3 className="text-[15px] uppercase tracking-[2px] mb-[15px] pb-[8px] border-b border-white/25">Skills</h3>
                      {jobData.skills ? jobData.skills.split('\n').map((skillLine, idx) => {
                          const match = skillLine.match(/^(.*?)\s*(\d+)\s*%?$/);
                          if (match) {
                              const name = match[1].trim();
                              const percent = Math.min(100, Math.max(0, parseInt(match[2])));
                              return (
                                  <div key={idx} className="mb-[15px]">
                                      <div className="flex justify-between text-[14px] mb-[6px]">
                                          <span>{name}</span>
                                          <span>{percent}%</span>
                                      </div>
                                      <div className="h-[8px] bg-[#dfe4e8] rounded-[50px] overflow-hidden">
                                          <div className="h-full bg-[#0B3B36]" style={{ width: `${percent}%` }}></div>
                                      </div>
                                  </div>
                              );
                          } else if (skillLine.trim()) {
                              return <div key={idx} className="mb-[10px] text-[14px] leading-[1.6]">• {skillLine}</div>;
                          }
                          return null;
                      }) : (
                          <>
                            <div className="mb-[15px]">
                                <div className="flex justify-between text-[14px] mb-[6px]"><span>React JS</span><span>90%</span></div>
                                <div className="h-[8px] bg-[#dfe4e8] rounded-[50px] overflow-hidden"><div className="h-full bg-[#0B3B36]" style={{ width: '90%' }}></div></div>
                            </div>
                            <div className="mb-[15px]">
                                <div className="flex justify-between text-[14px] mb-[6px]"><span>Node JS</span><span>85%</span></div>
                                <div className="h-[8px] bg-[#dfe4e8] rounded-[50px] overflow-hidden"><div className="h-full bg-[#0B3B36]" style={{ width: '85%' }}></div></div>
                            </div>
                            <div className="mb-[15px]">
                                <div className="flex justify-between text-[14px] mb-[6px]"><span>Laravel</span><span>92%</span></div>
                                <div className="h-[8px] bg-[#dfe4e8] rounded-[50px] overflow-hidden"><div className="h-full bg-[#0B3B36]" style={{ width: '92%' }}></div></div>
                            </div>
                          </>
                      )}
                    </div>

                    {/* Languages */}
                    <div className="mt-[30px]">
                      <h3 className="text-[15px] uppercase tracking-[2px] mb-[15px] pb-[8px] border-b border-white/25">Languages</h3>
                      <ul className="list-none">
                        {jobData.languages ? jobData.languages.split('\n').filter(l => l.trim()).map((lang, idx) => (
                           <li key={idx} className="mb-[10px] text-[14px] leading-[1.6]">{lang}</li>
                        )) : (
                           <>
                              <li className="mb-[10px] text-[14px] leading-[1.6]">Gujarati</li>
                              <li className="mb-[10px] text-[14px] leading-[1.6]">Hindi</li>
                              <li className="mb-[10px] text-[14px] leading-[1.6]">English</li>
                           </>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Right Content 68% */}
                  <div className="w-full md:w-[68%] p-8 md:p-[40px] flex flex-col bg-white">
                    
                    {/* Summary */}
                    <div className="mb-[35px]">
                      <div className="text-[18px] font-bold text-[#0B3B36] mb-[18px] uppercase tracking-[1px] relative after:content-[''] after:w-[50px] after:h-[3px] after:bg-[#0B3B36] after:absolute after:left-0 after:-bottom-[6px]">
                        Professional Summary
                      </div>
                      <div className="text-[#555] leading-[1.8] text-[14px] whitespace-pre-line text-justify">
                        {jobData.summary || 'Experienced Full Stack Developer with expertise in React, Laravel, Node.js and modern web technologies. Passionate about building scalable applications, optimizing performance and delivering exceptional user experiences.'}
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="mb-[35px]">
                      <div className="text-[18px] font-bold text-[#0B3B36] mb-[18px] uppercase tracking-[1px] relative after:content-[''] after:w-[50px] after:h-[3px] after:bg-[#0B3B36] after:absolute after:left-0 after:-bottom-[6px]">
                        Work Experience
                      </div>
                      {jobData.experience ? jobData.experience.split(/\n\s*\n/).map((block, idx) => {
                          const lines = block.split('\n').map(l => l.trim()).filter(l => l);
                          if (lines.length === 0) return null;
                          return (
                              <div key={idx} className="mb-[25px]">
                                  <h4 className="text-[17px] text-[#222] font-semibold">{lines[0]}</h4>
                                  {lines[1] && <div className="text-[#0B3B36] font-semibold mt-[3px] text-[15px]">{lines[1]}</div>}
                                  {lines[2] && <div className="text-[#888] text-[13px] my-[6px]">{lines[2]}</div>}
                                  {lines.length > 3 && (
                                      <div className="text-[#555] text-[14px] leading-[1.7] whitespace-pre-line mt-[6px]">
                                          {lines.slice(3).join('\n')}
                                      </div>
                                  )}
                              </div>
                          );
                      }) : (
                          <>
                            <div className="mb-[25px]">
                                <h4 className="text-[17px] text-[#222] font-semibold">Senior Full Stack Developer</h4>
                                <div className="text-[#0B3B36] font-semibold mt-[3px] text-[15px]">ABC Technologies</div>
                                <div className="text-[#888] text-[13px] my-[6px]">Jan 2023 - Present</div>
                                <div className="text-[#555] text-[14px] leading-[1.7]">Led development of enterprise applications, managed development teams and improved system performance by 40%.</div>
                            </div>
                            <div className="mb-[25px]">
                                <h4 className="text-[17px] text-[#222] font-semibold">Web Developer</h4>
                                <div className="text-[#0B3B36] font-semibold mt-[3px] text-[15px]">XYZ Solutions</div>
                                <div className="text-[#888] text-[13px] my-[6px]">Jun 2020 - Dec 2022</div>
                                <div className="text-[#555] text-[14px] leading-[1.7]">Built responsive websites and custom CRM systems using Laravel and React.</div>
                            </div>
                          </>
                      )}
                    </div>

                    {/* Education */}
                    <div className="mb-[35px]">
                      <div className="text-[18px] font-bold text-[#0B3B36] mb-[18px] uppercase tracking-[1px] relative after:content-[''] after:w-[50px] after:h-[3px] after:bg-[#0B3B36] after:absolute after:left-0 after:-bottom-[6px]">
                        Education
                      </div>
                      {jobData.education ? jobData.education.split(/\n\s*\n/).map((block, idx) => {
                          const lines = block.split('\n').map(l => l.trim()).filter(l => l);
                          if (lines.length === 0) return null;
                          return (
                              <div key={idx} className="mb-[20px]">
                                  <h4 className="text-[16px] text-[#222] font-semibold">{lines[0]}</h4>
                                  {lines[1] && <div className="text-[#666] text-[14px] mt-[3px]">{lines[1]}</div>}
                                  {lines[2] && <div className="text-[#666] text-[14px]">{lines[2]}</div>}
                                  {lines.length > 3 && (
                                      <div className="text-[#666] text-[14px] mt-[3px] whitespace-pre-line">
                                          {lines.slice(3).join('\n')}
                                      </div>
                                  )}
                              </div>
                          );
                      }) : (
                          <div className="mb-[20px]">
                              <h4 className="text-[16px] text-[#222] font-semibold">B.E Computer Engineering</h4>
                              <div className="text-[#666] text-[14px] mt-[3px]">Gujarat Technological University</div>
                              <div className="text-[#666] text-[14px]">2016 - 2020</div>
                          </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            {/* Viral Footer Watermark */}
            <div className="absolute bottom-[-24px] left-0 right-0 text-center select-none print:bottom-[-20px]">
              <p className="text-[10px] italic font-normal text-[#888888] opacity-40">
                આ સુંદર પ્રીમિયમ બાયોડેટા 'ગુજરાતી App' માંથી ફ્રીમાં બનાવેલ છે. ડાઉનલોડ કરો: bit.ly/gujarati-app
              </p>
            </div>
          </div>
          {/* End of mobile scroll wrapper */}
          </div>
        </div>

      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center py-1 border-b border-stone-100/50 sm:border-none">
    <span className="font-gujarati font-black text-stone-400 text-xs sm:w-2/5 tracking-wider">{label}:</span>
    <span className="font-gujarati font-bold text-stone-850 flex-1">{value}</span>
  </div>
);

const Input = ({ label, type = "text", placeholder = "", value, onChange, options = null }) => (
  <div className="space-y-1.5">
    <label className="font-gujarati font-bold text-sm text-stone-700 block">{label}</label>
    {options ? (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-stone-50 border-2 border-stone-200 focus:border-primary focus:bg-white rounded-2xl py-3.5 px-5 font-gujarati outline-none transition-all text-stone-850 appearance-none cursor-pointer"
      >
        <option value="">{placeholder || "-- સિલેક્ટ કરો --"}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={typeof opt === 'object' ? opt.value : opt}>
            {typeof opt === 'object' ? opt.label : opt}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-stone-50 border-2 border-stone-200 focus:border-primary focus:bg-white rounded-2xl py-3.5 px-5 font-gujarati outline-none transition-all placeholder:text-stone-300 text-stone-800"
        placeholder={placeholder}
      />
    )}
  </div>
);

export default BiodataMaker;
