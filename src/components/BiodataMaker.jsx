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
    accentColor: "#b45309",
    headerBg: "bg-amber-600 text-white",
    cardBg: "bg-[#FFFDF9]",
    textColor: "text-amber-950",
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
    headerBg: "bg-rose-600 text-white",
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
    setTimeout(() => {
      setIsGenerating(false);
      window.print();
    }, 1000);
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
                  className="bg-rose-50 text-rose-600 border border-rose-200 px-4 py-3 rounded-2xl font-gujarati text-xs font-bold"
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
        <div className="lg:col-span-7 print:block print:w-full print:border-none print:shadow-none print:m-0 print:p-0">
          <h3 className="font-gujarati font-black text-lg text-stone-800 mb-4 flex items-center gap-2 print:hidden">
            <span className="material-symbols-outlined text-primary">visibility</span>
            પ્રીમિયમ ડિઝાઇન લાઈવ પ્રિવ્યૂ (A4 Print-Ready)
          </h3>

          {/* Core Printable Sheet Card */}
          <div
            id="printable-biodata-card"
            className={`w-full max-w-[21cm] min-h-[29.7cm] mx-auto p-8 sm:p-10 relative overflow-hidden transition-all flex flex-col justify-between ${activeTab === 'marriage' ? currentTemplateObj.cardBg : 'bg-white'} ${activeTab === 'marriage' ? currentTemplateObj.borderClass : 'border-none'} ${activeTab === 'marriage' ? 'font-gujarati' : 'font-sans'} ${currentTemplateObj.textColor}`}
          >
            {/* Custom SVG Decoration overlay */}
            {activeTab === 'marriage' && currentTemplateObj.customDecor}

            <div className={`flex-1 mt-6 ${activeTab === 'marriage' ? 'space-y-8' : ''}`}>
              
              {/* Marriage Theme Header Rendering */}
              {activeTab === 'marriage' ? (
                <div className="text-center space-y-3 mt-4">
                  {/* Dynamic God Image or Text Icon */}
                  <div className="flex justify-center select-none">
                    {selectedGod.textIcon ? (
                      <span className="text-[5rem] leading-none drop-shadow-sm" style={{ color: currentTemplateObj.accentColor }}>{selectedGod.textIcon}</span>
                    ) : (
                      <img src={selectedGod.imgUrl} alt={selectedGod.name} className="w-24 h-24 object-contain" />
                    )}
                  </div>
                  <h1 className="font-gujarati font-black text-3xl sm:text-4xl tracking-wide uppercase" style={{ color: currentTemplateObj.accentColor }}>
                    {labels.titleMain}
                  </h1>
                  {/* Dynamic God Salutation Mantra */}
                  <p className="font-gujarati font-black text-[#8B0000]/80">
                    || {lang === 'gu' ? selectedGod.labelGu : selectedGod.labelEn} ||
                  </p>
                  <div className="flex items-center justify-center gap-2 my-2 text-[#8B0000]/40">
                    <span>❀</span><span>❀</span><span>❀</span>
                  </div>
                </div>
              ) : null}

              {/* Data Content Body */}
              {activeTab === 'marriage' ? (
                <div className="space-y-6 text-sm sm:text-base leading-relaxed mt-4">
                  
                  {/* Photo & Primary personal details inline */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-transparent">
                    {/* Uploaded Profile Photo Display */}
                    <div className="h-44 w-36 overflow-hidden border border-[#8B0000]/20 flex-shrink-0 flex items-center justify-center bg-stone-50 relative group">
                      {photoUrl ? (
                        <img src={photoUrl} className="w-full h-full object-cover" alt="Profile" />
                      ) : (
                        <div className="text-center p-4">
                          <span className="material-symbols-outlined text-4xl text-stone-300">person</span>
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mt-1">NO PHOTO</p>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2 w-full">
                      <div className="font-black text-lg border-b border-[#8B0000]/20 pb-1" style={{ color: currentTemplateObj.accentColor }}>
                        {labels.personalHeader}
                      </div>
                      <div className="grid grid-cols-1 gap-y-1 mt-2">
                        <DetailRow label={labels.fullName} value={marriageData.fullName || '----'} />
                        <DetailRow label={labels.dob} value={marriageData.dob || '----'} />
                        <DetailRow label={labels.birthTime} value={marriageData.birthTime || '----'} />
                        <DetailRow label={labels.birthPlace} value={marriageData.birthPlace || '----'} />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center text-[#8B0000]/30 text-xs">❈ ❈ ❈</div>

                  {/* Rest of Personal details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    <DetailRow label={labels.rashi} value={marriageData.rashi || '----'} />
                    <DetailRow label={labels.height} value={marriageData.height || '----'} />
                    <DetailRow label={labels.complexion} value={marriageData.complexion || '----'} />
                    <DetailRow label={labels.bloodGroup} value={marriageData.bloodGroup || '----'} />
                  </div>

                  <div className="flex justify-center text-[#8B0000]/30 text-xs">❈ ❈ ❈</div>

                  {/* Career & Education */}
                  <div className="space-y-3">
                    <div className="font-black text-lg border-b border-[#8B0000]/20 pb-1" style={{ color: currentTemplateObj.accentColor }}>
                      {labels.careerHeader}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pt-1">
                      <DetailRow label={labels.education} value={marriageData.education || '----'} />
                      <DetailRow label={labels.occupation} value={marriageData.occupation || '----'} />
                      <DetailRow label={labels.income} value={marriageData.income || '----'} />
                    </div>
                  </div>

                  <div className="flex justify-center text-[#8B0000]/30 text-xs">❈ ❈ ❈</div>

                  {/* Family details */}
                  <div className="space-y-3">
                    <div className="font-black text-lg border-b border-[#8B0000]/20 pb-1" style={{ color: currentTemplateObj.accentColor }}>
                      {labels.familyHeader}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pt-1">
                      <DetailRow label={labels.fatherName} value={marriageData.fatherName || '----'} />
                      <DetailRow label={labels.fatherOcc} value={marriageData.fatherOcc || '----'} />
                      <DetailRow label={labels.motherName} value={marriageData.motherName || '----'} />
                      <DetailRow label={labels.siblings} value={marriageData.siblings || '----'} />
                      <DetailRow label={labels.maternalUncle} value={marriageData.maternalUncle || '----'} />
                      <DetailRow label={labels.nativePlace} value={marriageData.nativePlace || '----'} />
                    </div>
                  </div>

                  <div className="flex justify-center text-[#8B0000]/30 text-xs">❈ ❈ ❈</div>

                  {/* Contact details */}
                  <div className="space-y-3">
                    <div className="font-black text-lg border-b border-[#8B0000]/20 pb-1" style={{ color: currentTemplateObj.accentColor }}>
                      {labels.contactHeader}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pt-1">
                      <DetailRow label={labels.mobile} value={marriageData.mobile || '----'} />
                      <DetailRow label={labels.address} value={marriageData.address || '----'} />
                    </div>
                  </div>

                </div>
              ) : (
                // JOB BIODATA PREVIEW (Resume) Two-Column Grid
                <div className="flex flex-col sm:flex-row gap-6 h-full font-sans bg-white border-0 text-stone-800 -mx-8 -my-10 sm:-mx-10 h-[calc(100%+5rem)] min-h-[29.7cm]">
                  
                  {/* Left Sidebar 35% */}
                  <div className="w-full sm:w-[35%] bg-stone-50 p-8 flex flex-col gap-8 border-r border-stone-200 shrink-0">
                    
                    {/* Photo */}
                    <div className="h-48 w-48 mx-auto rounded-full overflow-hidden border border-stone-200 bg-white flex items-center justify-center shrink-0">
                      {photoUrl ? (
                        <img src={photoUrl} className="w-full h-full object-cover" alt="Profile" />
                      ) : (
                        <span className="material-symbols-outlined text-5xl text-stone-300">person</span>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3">
                      <h3 className="font-bold text-sm tracking-widest uppercase border-b border-stone-300 pb-2 mb-3" style={{ color: currentTemplateObj.accentColor }}>CONTACT</h3>
                      {jobData.mobile && <p className="text-sm flex items-center gap-2"><span className="material-symbols-outlined text-base">phone</span> {jobData.mobile}</p>}
                      {jobData.email && <p className="text-sm flex items-center gap-2"><span className="material-symbols-outlined text-base">mail</span> <span className="truncate">{jobData.email}</span></p>}
                      {jobData.address && <p className="text-sm flex items-start gap-2"><span className="material-symbols-outlined text-base mt-0.5">location_on</span> <span>{jobData.address}</span></p>}
                      {jobData.linkedin && <p className="text-sm flex items-center gap-2"><span className="material-symbols-outlined text-base">link</span> <span className="truncate">{jobData.linkedin}</span></p>}
                    </div>

                    {/* Skills */}
                    <div className="space-y-3">
                      <h3 className="font-bold text-sm tracking-widest uppercase border-b border-stone-300 pb-2 mb-3" style={{ color: currentTemplateObj.accentColor }}>SKILLS</h3>
                      <div className="whitespace-pre-line text-sm text-stone-700 leading-relaxed">
                        {jobData.skills || 'Your skills...'}
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="space-y-3">
                      <h3 className="font-bold text-sm tracking-widest uppercase border-b border-stone-300 pb-2 mb-3" style={{ color: currentTemplateObj.accentColor }}>LANGUAGES</h3>
                      <div className="whitespace-pre-line text-sm text-stone-700 leading-relaxed">
                        {jobData.languages || 'Languages known...'}
                      </div>
                    </div>
                  </div>

                  {/* Right Content 65% */}
                  <div className="w-full sm:w-[65%] p-8 pl-2 flex flex-col gap-6">
                    {/* Header */}
                    <div className="space-y-1 mb-2">
                      <h1 className="font-black text-4xl text-stone-900 tracking-tight uppercase" style={{ color: currentTemplateObj.accentColor }}>{jobData.fullName || 'FULL NAME'}</h1>
                      <p className="font-semibold text-xl text-stone-500 uppercase tracking-widest">{jobData.title || 'Professional Title'}</p>
                    </div>

                    {/* Summary */}
                    <div className="space-y-3">
                      <h3 className="font-bold text-lg border-b-2 pb-1 inline-block" style={{ color: currentTemplateObj.accentColor, borderColor: currentTemplateObj.accentColor }}>{labels.summaryHeader}</h3>
                      <p className="text-stone-700 leading-relaxed text-sm text-justify">
                        {jobData.summary || 'Professional summary...'}
                      </p>
                    </div>

                    {/* Experience */}
                    <div className="space-y-3">
                      <h3 className="font-bold text-lg border-b-2 pb-1 inline-block" style={{ color: currentTemplateObj.accentColor, borderColor: currentTemplateObj.accentColor }}>{labels.expHeader}</h3>
                      <div className="whitespace-pre-line text-sm text-stone-700 leading-relaxed">
                        {jobData.experience || 'Experience details...'}
                      </div>
                    </div>

                    {/* Education */}
                    <div className="space-y-3">
                      <h3 className="font-bold text-lg border-b-2 pb-1 inline-block" style={{ color: currentTemplateObj.accentColor, borderColor: currentTemplateObj.accentColor }}>{labels.eduHeader}</h3>
                      <div className="whitespace-pre-line text-sm text-stone-700 leading-relaxed">
                        {jobData.education || 'Education details...'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Viral Footer Watermark */}
            <div className="absolute bottom-[-24px] left-0 right-0 text-center select-none print:bottom-[-20px]">
              <p className="text-[10px] italic font-normal text-[#888888] opacity-40">
                આ સુંદર પ્રીમિયમ બાયોડેટા 'ગુજરાતી App' માંથી ફ્રીમાં બનાવેલ છે. ડાઉનલોડ કરો: bit.ly/gujarati-app
              </p>
            </div>
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
