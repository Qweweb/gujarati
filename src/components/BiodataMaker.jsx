import { uploadToCloudinary } from '../utils/cloudinaryHelper';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BiodataStyle.css';
import './JobResume.css';

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

const parseExperience = (text) => {
  if (!text) return [];
  return text.split(/\n\s*\n/).map(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length === 0) return null;
    const role = lines[0] || '';
    const company = lines[1] || '';
    const duration = lines[2] || '';
    const points = lines.slice(3).map(pt => pt.replace(/^[\s•\-\*]+/, '')) || [];
    return { role, company, duration, points };
  }).filter(x => x !== null);
};

const parseProjects = (text) => {
  if (!text) return [];
  return text.split(/\n\s*\n/).map(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length === 0) return null;
    const title = lines[0] || '';
    const tech = lines[1] || '';
    const points = lines.slice(2).map(pt => pt.replace(/^[\s•\-\*]+/, '')) || [];
    return { title, tech, points };
  }).filter(x => x !== null);
};

const parseCommaSkills = (text) => {
  if (!text) return [];
  return text.split(',').map(s => s.trim()).filter(s => s);
};

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
    name: '',
    jobTitle: '',
    location: '',
    phone: '',
    email: '',
    linkedin: '',
    showPhotoPlaceholder: true,
    summary: '',
    experienceText: '', // raw textarea string to be parsed
    projectsText: '', // raw textarea string to be parsed
    frontendSkills: '', // comma separated list
    backendSkills: '', // comma separated list
    degree: '',
    institute: '',
    year: '',
    grade: '',
    dob: '',
    gender: '',
    languages: '',
    personalLocation: ''
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

          {activeTab === 'marriage' ? (
            <div className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-primary/5 space-y-6">
              <h3 className="font-gujarati font-black text-xl text-primary border-b border-stone-100 pb-3">{labels.personalHeader}</h3>
              <div className="space-y-4">
                <Input label="પૂરું નામ (Full Name)" value={marriageData.name} onChange={(val) => handleMarriageChange('name', val)} placeholder="નામ, પિતાનું નામ, અટક" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="અભ્યાસ ટાઇટલ (Education Title)" value={marriageData.educationTitle} onChange={(val) => handleMarriageChange('educationTitle', val)} placeholder="દા.ત. BE Computer" />
                  <Input label="વર્તમાન શહેર (Current City)" value={marriageData.city} onChange={(val) => handleMarriageChange('city', val)} placeholder="દા.ત. અમદાવાદ" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="જન્મ તારીખ" type="date" value={marriageData.dob} onChange={(val) => handleMarriageChange('dob', val)} />
                  <Input label="જન્મ સમય" type="time" value={marriageData.time} onChange={(val) => handleMarriageChange('time', val)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="જન્મ સ્થળ" value={marriageData.place} onChange={(val) => handleMarriageChange('place', val)} placeholder="દા.ત. સુરત" />
                  <Input label="ઉંમર (Age)" value={marriageData.age} onChange={(val) => handleMarriageChange('age', val)} placeholder="દા.ત. ૨૬ વર્ષ" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="ઊંચાઈ (Height)" value={marriageData.height} onChange={(val) => handleMarriageChange('height', val)} placeholder={"દા.ત. 5' 6\""} />
                  <Input label="વજન (Weight)" value={marriageData.weight} onChange={(val) => handleMarriageChange('weight', val)} placeholder="દા.ત. ૬૫ કિગ્રા" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="વર્ણ / રંગ (Complexion)" value={marriageData.complexion} onChange={(val) => handleMarriageChange('complexion', val)} placeholder="દા.ત. ગોરો, ઘઉંવર્ણ" />
                  <Input label="જ્ઞાતિ (Caste)" value={marriageData.caste} onChange={(val) => handleMarriageChange('caste', val)} placeholder="દા.ત. પટેલ, બ્રાહ્મણ" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="ધર્મ (Religion)" value={marriageData.religion} onChange={(val) => handleMarriageChange('religion', val)} placeholder="દા.ત. હિન્દુ" />
                  <Input label="માતૃભાષા / ભાષાઓ" value={marriageData.languages} onChange={(val) => handleMarriageChange('languages', val)} placeholder="દા.ત. ગુજરાતી, હિન્દી, English" />
                </div>
                <Input label="ખોરાક / આહાર (Diet)" value={marriageData.diet} onChange={(val) => handleMarriageChange('diet', val)} placeholder="દા.ત. શાકાહારી (Vegetarian)" />
              </div>

              <h3 className="font-gujarati font-black text-xl text-primary border-b border-stone-100 pb-3 pt-4">{labels.careerHeader}</h3>
              <div className="space-y-4">
                <Input label="શિક્ષણ વિગત (Detailed Education)" value={marriageData.education} onChange={(val) => handleMarriageChange('education', val)} placeholder="દા.ત. B.Tech in IT" />
                <Input label="સ્કૂલ / કોલેજનું નામ" value={marriageData.college} onChange={(val) => handleMarriageChange('college', val)} placeholder="દા.ત. Nirma University" />
                <Input label="વ્યવસાય / નોકરી (Occupation)" value={marriageData.occupation} onChange={(val) => handleMarriageChange('occupation', val)} placeholder="દા.ત. સિનિયર સોફ્ટવેર એન્જિનિયર" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="કંપની / વ્યવસાય પ્રકાર" value={marriageData.companyType} onChange={(val) => handleMarriageChange('companyType', val)} placeholder="દા.ત. MNC Software Co." />
                  <Input label="વાર્ષિક આવક (Income)" value={marriageData.income} onChange={(val) => handleMarriageChange('income', val)} placeholder="દા.ત. ૧૨ લાખ પ્રતિ વર્ષ" />
                </div>
                <Input label="નોકરીનું લોકેશન (Work Location)" value={marriageData.workLocation} onChange={(val) => handleMarriageChange('workLocation', val)} placeholder="દા.ત. પુણે, મહારાષ્ટ્ર" />
              </div>

              <h3 className="font-gujarati font-black text-xl text-primary border-b border-stone-100 pb-3 pt-4">{labels.familyHeader}</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="પિતાનું નામ" value={marriageData.fatherName} onChange={(val) => handleMarriageChange('fatherName', val)} />
                  <Input label="પિતાનો વ્યવસાય" value={marriageData.fatherOcc} onChange={(val) => handleMarriageChange('fatherOcc', val)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="માતાનું નામ" value={marriageData.motherName} onChange={(val) => handleMarriageChange('motherName', val)} />
                  <Input label="માતાનો વ્યવસાય" value={marriageData.motherOcc} onChange={(val) => handleMarriageChange('motherOcc', val)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="ભાઈની વિગત" value={marriageData.brotherDetails} onChange={(val) => handleMarriageChange('brotherDetails', val)} placeholder="દા.ત. ૧ ભાઈ (અપરણિત)" />
                  <Input label="બહેનની વિગત" value={marriageData.sisterDetails} onChange={(val) => handleMarriageChange('sisterDetails', val)} placeholder="દા.ત. ૧ બહેન (પરણેલ)" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="કુટુંબનો પ્રકાર" value={marriageData.familyType} onChange={(val) => handleMarriageChange('familyType', val)} placeholder="દા.ત. સંયુક્ત કુટુંબ" />
                  <Input label="મોસાળ (Maternal)" value={marriageData.mosal} onChange={(val) => handleMarriageChange('mosal', val)} placeholder="દા.ત. મહેસાણા (પટેલ)" />
                </div>
                <Input label="મૂળ વતન" value={marriageData.nativePlace} onChange={(val) => handleMarriageChange('nativePlace', val)} placeholder="દા.ત. સિદ્ધપુર, પાટણ" />
              </div>

              <h3 className="font-gujarati font-black text-xl text-primary border-b border-stone-100 pb-3 pt-4">{labels.contactHeader}</h3>
              <div className="space-y-4">
                <Input label="મોબાઈલ નંબર" value={marriageData.contactPhones} onChange={(val) => handleMarriageChange('contactPhones', val)} placeholder="દા.ત. 98765 43210" />
                <Input label="ઈમેલ એડ્રેસ" type="email" value={marriageData.email} onChange={(val) => handleMarriageChange('email', val)} placeholder="દા.ત. example@gmail.com" />
                <Input label="રહેઠાણનું સરનામું" value={marriageData.address} onChange={(val) => handleMarriageChange('address', val)} placeholder="દા.ત. ઘરનું પૂરું સરનામું" />
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-primary/5 space-y-6">
              <h3 className="font-gujarati font-black text-xl text-primary border-b border-stone-100 pb-3">ઉમેદવાર વિગત (Candidate Info)</h3>
              <div className="space-y-4">
                <Input label="પૂરું નામ (Full Name)" value={jobData.name} onChange={(val) => handleJobChange('name', val)} placeholder="દા.ત. DHRUVISHA" />
                <Input label="પ્રોફેશનલ શીર્ષક (Job Title)" value={jobData.jobTitle} onChange={(val) => handleJobChange('jobTitle', val)} placeholder="દા.ત. Software Engineer / Frontend Developer" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="મોબાઈલ નંબર (Phone)" value={jobData.phone} onChange={(val) => handleJobChange('phone', val)} placeholder="દા.ત. +91 98XXX XXXXX" />
                  <Input label="ઈમેલ (Email)" type="email" value={jobData.email} onChange={(val) => handleJobChange('email', val)} placeholder="દા.ત. email@example.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="શહેર / લોકેશન" value={jobData.location} onChange={(val) => handleJobChange('location', val)} placeholder="દા.ત. Jamnagar / Ahmedabad" />
                  <Input label="LinkedIn URL (Optional)" value={jobData.linkedin} onChange={(val) => handleJobChange('linkedin', val)} placeholder="દા.ત. linkedin.com/in/username" />
                </div>
                <div className="space-y-1.5">
                  <label className="font-gujarati font-bold text-sm text-stone-700 block">જો ફોટો ન હોય તો પ્લેસહોલ્ડર બતાવવું?</label>
                  <select
                    value={jobData.showPhotoPlaceholder ? "yes" : "no"}
                    onChange={(e) => handleJobChange('showPhotoPlaceholder', e.target.value === "yes")}
                    className="w-full bg-stone-50 border-2 border-stone-200 focus:border-primary focus:bg-white rounded-2xl py-3.5 px-5 font-gujarati outline-none transition-all text-stone-850"
                  >
                    <option value="yes">હા, પ્લેસહોલ્ડર બતાવો</option>
                    <option value="no">ના, ફોટો એરિયા છુપાવો</option>
                  </select>
                </div>
              </div>

              <h3 className="font-gujarati font-black text-xl text-primary border-b border-stone-100 pb-3 pt-4">પ્રોફેશનલ સમરી (Summary)</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-gujarati font-bold text-sm text-stone-700 block">સમરી (Professional Summary)</label>
                  <textarea
                    rows={4}
                    value={jobData.summary}
                    onChange={(e) => handleJobChange('summary', e.target.value)}
                    className="w-full bg-stone-50 border-2 border-stone-200 focus:border-primary focus:bg-white rounded-2xl py-3.5 px-5 font-gujarati outline-none transition-all placeholder:text-stone-300 text-stone-800"
                    placeholder="તમારા કૌશલ્ય અને અનુભવ વિશે ટૂંકી વિગત..."
                  />
                </div>
              </div>

              <h3 className="font-gujarati font-black text-xl text-primary border-b border-stone-100 pb-3 pt-4">કામનો અનુભવ (Work Experience)</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-gujarati font-bold text-sm text-stone-700 block">અનુભવ બ્લોક્સ (Double Newline થી અલગ કરો)</label>
                  <textarea
                    rows={6}
                    value={jobData.experienceText}
                    onChange={(e) => handleJobChange('experienceText', e.target.value)}
                    className="w-full bg-stone-50 border-2 border-stone-200 focus:border-primary focus:bg-white rounded-2xl py-3.5 px-5 font-mono text-sm outline-none transition-all text-stone-850"
                    placeholder={"ફોર્મેટ બરાબર રાખવું:\nરોલ / હોદ્દો\nકંપનીનું નામ\nકામનો સમયગાળો (દા.ત. 2024 - Present)\n• પ્રથમ પોઈન્ટ\n• બીજો પોઈન્ટ\n\n(અલગ કરવા વચ્ચે એક ખાલી લાઇન છોડો)"}
                  />
                </div>
              </div>

              <h3 className="font-gujarati font-black text-xl text-primary border-b border-stone-100 pb-3 pt-4">પ્રોજેક્ટ્સ (Key Projects)</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-gujarati font-bold text-sm text-stone-700 block">પ્રોજેક્ટ બ્લોક્સ (Double Newline થી અલગ કરો)</label>
                  <textarea
                    rows={5}
                    value={jobData.projectsText}
                    onChange={(e) => handleJobChange('projectsText', e.target.value)}
                    className="w-full bg-stone-50 border-2 border-stone-200 focus:border-primary focus:bg-white rounded-2xl py-3.5 px-5 font-mono text-sm outline-none transition-all text-stone-850"
                    placeholder={"પ્રોજેક્ટ નામ\nટેકનોલોજી લિસ્ટ\n• પ્રોજેક્ટની મુખ્ય વિશેષતા ૧\n• પ્રોજેક્ટની મુખ્ય વિશેષતા ૨\n\n(અલગ કરવા વચ્ચે એક ખાલી લાઇન છોડો)"}
                  />
                </div>
              </div>

              <h3 className="font-gujarati font-black text-xl text-primary border-b border-stone-100 pb-3 pt-4">કૌશલ્યો (Technical Skills)</h3>
              <div className="space-y-4">
                <Input label="Frontend & UI Skills (અલ્પવિરામથી અલગ કરો)" value={jobData.frontendSkills} onChange={(val) => handleJobChange('frontendSkills', val)} placeholder="React.js, JavaScript, Tailwind CSS" />
                <Input label="Backend & Tools (અલ્પવિરામથી અલગ કરો)" value={jobData.backendSkills} onChange={(val) => handleJobChange('backendSkills', val)} placeholder="Node.js, REST APIs, Git, VS Code" />
              </div>

              <h3 className="font-gujarati font-black text-xl text-primary border-b border-stone-100 pb-3 pt-4">અભ્યાસ (Education)</h3>
              <div className="space-y-4">
                <Input label="ડિગ્રીનું નામ (Degree Name)" value={jobData.degree} onChange={(val) => handleJobChange('degree', val)} placeholder="દા.ત. B.Tech in Computer Engineering" />
                <Input label="કોલેજ / યુનિવર્સિટી (Institute Name)" value={jobData.institute} onChange={(val) => handleJobChange('institute', val)} placeholder="દા.ત. GTU Nadiad" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="વર્ષ (Year)" value={jobData.year} onChange={(val) => handleJobChange('year', val)} placeholder="દા.ત. 2018 - 2022" />
                  <Input label="ગ્રેડ / પર્સન્ટેજ (Grade/Result)" value={jobData.grade} onChange={(val) => handleJobChange('grade', val)} placeholder="દા.ત. First Class Distinction" />
                </div>
              </div>

              <h3 className="font-gujarati font-black text-xl text-primary border-b border-stone-100 pb-3 pt-4">વ્યક્તિગત વિગત (Personal Details)</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="જન્મ તારીખ (DOB)" value={jobData.dob} onChange={(val) => handleJobChange('dob', val)} placeholder="દા.ત. 15-05-2002" />
                  <Input label="લિંગ (Gender)" value={jobData.gender} onChange={(val) => handleJobChange('gender', val)} placeholder="દા.ત. Female / Male" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="જાણીતી ભાષાઓ (Languages)" value={jobData.languages} onChange={(val) => handleJobChange('languages', val)} placeholder="દા.ત. English, Gujarati, Hindi" />
                  <Input label="લોકેશન / વતન" value={jobData.personalLocation} onChange={(val) => handleJobChange('personalLocation', val)} placeholder="દા.ત. Jamnagar, Gujarat" />
                </div>
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
              className={`w-full max-w-[21cm] min-h-[29.7cm] mx-auto relative overflow-hidden transition-all flex flex-col justify-between ${activeTab === 'marriage' ? 'p-0 font-gujarati text-[#2b2016]' : 'p-0 bg-white font-sans text-stone-850'}`}
            >
              {activeTab === 'marriage' ? (
                <div className="biodata-wrapper w-full bg-[#fffdfa] text-[#2b2016] h-full min-h-[29.7cm]">
                  <div className="royal-border">
                    {/* ઓર્નામેન્ટલ કોર્નર્સ */}
                    <div className="corner c-top-left"></div>
                    <div className="corner c-top-right"></div>
                    <div className="corner c-bottom-left"></div>
                    <div className="corner c-bottom-right"></div>

                    <div>
                      {/* ૧. હેડર */}
                      <div className="bio-header">
                        <div className="bio-om">॥ શ્રી ગણેશાય નમઃ ॥</div>
                        <div className="bio-main-title">|| લગ્ન માટેનો બાયોડેટા ||</div>
                      </div>

                      {/* ૨. ફોટો અને નામ પ્રોફાઇલ */}
                      <div className="bio-hero">
                        <div>
                          <h2 className="bio-name">{marriageData.name || 'નામ દર્શાવવા અહીં લખો'}</h2>
                          <div className="bio-edu-tag">🎓 {marriageData.educationTitle || 'શિક્ષણ લાયકાત'}</div>
                          <div className="bio-location-tag">📍 રહેઠાણ: {marriageData.city || 'શહેર / ગામ'}</div>
                        </div>
                        {photoUrl ? (
                          <img src={photoUrl} alt="candidate" className="bio-img" />
                        ) : (
                          <div className="bio-photo-placeholder">
                            ફોટો અપલોડ
                          </div>
                        )}
                      </div>

                      {/* ૩. વ્યક્તિગત વિગતો */}
                      <div className="bio-section-title">૧. વ્યક્તિગત માહિતી (Personal Details)</div>
                      <table className="bio-table">
                        <tbody>
                          <tr>
                            <td className="lbl">જન્મ તારીખ:</td>
                            <td className="val"><b>{marriageData.dob ? marriageData.dob.split('-').reverse().join('-') : '----'}</b></td>
                            <td className="lbl">જન્મ સમય:</td>
                            <td className="val">{marriageData.time || '----'}</td>
                          </tr>
                          <tr>
                            <td className="lbl">જન્મ સ્થળ:</td>
                            <td className="val">{marriageData.place || '----'}</td>
                            <td className="lbl">ઉંમર (Age):</td>
                            <td className="val">{marriageData.age || '----'}</td>
                          </tr>
                          <tr>
                            <td className="lbl">ઊંચાઈ (Height):</td>
                            <td className="val">{marriageData.height || '----'}</td>
                            <td className="lbl">વજન (Weight):</td>
                            <td className="val">{marriageData.weight || '----'}</td>
                          </tr>
                          <tr>
                            <td className="lbl">વર્ણ / રંગ:</td>
                            <td className="val">{marriageData.complexion || '----'}</td>
                            <td className="lbl">જ્ઞાતિ (Caste):</td>
                            <td className="val"><b>{marriageData.caste || '----'}</b></td>
                          </tr>
                          <tr>
                            <td className="lbl">ધર્મ (Religion):</td>
                            <td className="val">{marriageData.religion || '----'}</td>
                            <td className="lbl">માતૃભાષા:</td>
                            <td className="val">{marriageData.languages || '----'}</td>
                          </tr>
                          <tr>
                            <td className="lbl">ખોરાક (Diet):</td>
                            <td className="val" colSpan="3">{marriageData.diet || '----'}</td>
                          </tr>
                        </tbody>
                      </table>

                      {/* ૪. શૈક્ષણિક અને વ્યવસાયિક વિગતો */}
                      <div className="bio-section-title">૨. શૈક્ષણિક અને વ્યવસાયિક વિગતો (Education & Job)</div>
                      <table className="bio-table">
                        <tbody>
                          <tr>
                            <td className="lbl">ઉચ્ચ શિક્ષણ:</td>
                            <td className="val" colSpan="3"><b>{marriageData.education || '----'}</b></td>
                          </tr>
                          <tr>
                            <td className="lbl">સ્કૂલ / કોલેજ:</td>
                            <td className="val" colSpan="3">{marriageData.college || '----'}</td>
                          </tr>
                          <tr>
                            <td className="lbl">વ્યવસાય / હોદ્દો:</td>
                            <td className="val val-bold">{marriageData.occupation || '----'}</td>
                            <td className="lbl">કંપની / બિઝનેસ:</td>
                            <td className="val">{marriageData.companyType || '----'}</td>
                          </tr>
                          <tr>
                            <td className="lbl">વાર્ષિક આવક:</td>
                            <td className="val">{marriageData.income || '----'}</td>
                            <td className="lbl">કાર્ય સ્થળ:</td>
                            <td className="val">{marriageData.workLocation || '----'}</td>
                          </tr>
                        </tbody>
                      </table>

                      {/* ૫. પારિવારિક માહિતી */}
                      <div className="bio-section-title">૩. પારિવારિક માહિતી (Family Background)</div>
                      <table className="bio-table">
                        <tbody>
                          <tr>
                            <td className="lbl-full">પિતાનું નામ:</td>
                            <td className="val-full"><b>{marriageData.fatherName || '----'}</b> ({marriageData.fatherOcc || '----'})</td>
                          </tr>
                          <tr>
                            <td className="lbl-full">માતાનું નામ:</td>
                            <td className="val-full"><b>{marriageData.motherName || '----'}</b> ({marriageData.motherOcc || '----'})</td>
                          </tr>
                          <tr>
                            <td className="lbl-full">ભાઈની વિગત:</td>
                            <td className="val-full">{marriageData.brotherDetails || '----'}</td>
                          </tr>
                          <tr>
                            <td className="lbl-full">બહેનની વિગત:</td>
                            <td className="val-full">{marriageData.sisterDetails || '----'}</td>
                          </tr>
                          <tr>
                            <td className="lbl-full">કુટુંબનો પ્રકાર:</td>
                            <td className="val-full">{marriageData.familyType || '----'}</td>
                          </tr>
                          <tr>
                            <td className="lbl-full">મોસાળ (Maternal):</td>
                            <td className="val-full">{marriageData.mosal || '----'}</td>
                          </tr>
                          <tr>
                            <td className="lbl-full">મૂળ વતન:</td>
                            <td className="val-full">{marriageData.nativePlace || '----'}</td>
                          </tr>
                        </tbody>
                      </table>

                      {/* ૬. સંપર્ક વિગતો */}
                      <div className="bio-contact-box">
                        <div className="bio-contact-title">📞 સંપર્ક અને સરનામું (Contact Information)</div>
                        <table className="bio-contact-table">
                          <tbody>
                            <tr>
                              <td style={{ width: '24%', fontWeight: 'bold', color: '#78350f' }}>મોબાઈલ નંબર:</td>
                              <td style={{ width: '76%' }}><b>{marriageData.contactPhones || '----'}</b></td>
                            </tr>
                            <tr>
                              <td style={{ fontWeight: 'bold', color: '#78350f' }}>ઈમેલ એડ્રેસ:</td>
                              <td>{marriageData.email || '----'}</td>
                            </tr>
                            <tr>
                              <td style={{ fontWeight: 'bold', color: '#78350f', verticalAlign: 'top' }}>રહેઠાણનું સરનામું:</td>
                              <td>{marriageData.address || '----'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="footer-note">
                      આપેલા તમામ ડેટા અને પારિવારિક વિગતો સંપૂર્ણ સત્ય અને પ્રામાણિક છે.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="job-resume-wrapper w-full bg-white text-[#1e293b] h-full min-h-[29.7cm]">
                  <div className="resume-container">
                    <div>
                      {/* ૧. હેડર (Spacious Contact Badges + Optional Photo) */}
                      <div className="header-container">
                        <div className="header-left">
                          <h1 className="candidate-name">{jobData.name || 'DHRUVISHA'}</h1>
                          <div className="candidate-title">{jobData.jobTitle || 'Software Engineer / Full-Stack & Frontend Developer'}</div>
                          
                          {/* Spaced Contact Badges */}
                          <div className="contact-row">
                            <div className="contact-badge">📍 {jobData.location || 'Jamnagar / Ahmedabad'}</div>
                            <div className="contact-badge">📞 {jobData.phone || '+91 98XXX XXXXX'}</div>
                            <div className="contact-badge">✉️ {jobData.email || 'dhruvisha.work@email.com'}</div>
                            {jobData.linkedin && <div className="contact-badge">🔗 {jobData.linkedin}</div>}
                          </div>
                        </div>

                        {/* Optional Photo Box */}
                        {photoUrl ? (
                          <div className="header-photo-box">
                            <img src={photoUrl} alt={jobData.name} className="profile-photo" />
                          </div>
                        ) : jobData.showPhotoPlaceholder ? (
                          <div className="header-photo-box">
                            <div className="photo-placeholder">PHOTO<br />(Optional)</div>
                          </div>
                        ) : null}
                      </div>

                      {/* ૨. સમરી */}
                      <div className="section-block">
                        <div className="section-title">Professional Summary</div>
                        <p className="summary-text">
                          {jobData.summary || 'Dynamic and detail-oriented Software Engineer with 2+ years of experience building modern, responsive, and high-performance web applications. Proficient in React.js, TypeScript/JavaScript, RESTful APIs, and automated UI workflows with a strong focus on clean architecture and scalable code.'}
                        </p>
                      </div>

                      {/* ૩. વર્ક એક્સપિરિયન્સ */}
                      <div className="section-block">
                        <div className="section-title">Work Experience</div>
                        {(jobData.experienceText ? parseExperience(jobData.experienceText) : [
                          {
                            role: "Software Developer",
                            company: "Tech Solutions Pvt. Ltd.",
                            duration: "2024 - Present | Hybrid",
                            points: [
                              "Developed responsive React SPAs, cutting page load times by 35% through code-splitting and asset optimization.",
                              "Engineered reusable UI component libraries using Tailwind CSS and modern state management.",
                              "Integrated REST APIs and dynamic client-side report generation engines with PDF exports."
                            ]
                          },
                          {
                            role: "Junior Web Developer",
                            company: "Innovate Tech Labs",
                            duration: "2022 - 2024 | Ahmedabad",
                            points: [
                              "Built interactive dashboards, dynamic table grids, and client webhook integration pipelines.",
                              "Ensured cross-browser compatibility, WCAG accessibility, and pixel-perfect mobile responsiveness."
                            ]
                          }
                        ]).map((exp, idx) => (
                          <div key={idx} className="item-card">
                            <div className="item-header">
                              <div>
                                <span className="item-role">{exp.role}</span> &bull; <span className="item-company">{exp.company}</span>
                              </div>
                              <span className="item-date">{exp.duration}</span>
                            </div>
                            <ul className="clean-list list-disc pl-5">
                              {exp.points.map((pt, i) => (
                                <li key={i}>{pt}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* ૪. પ્રોજેક્ટ્સ */}
                      <div className="section-block">
                        <div className="section-title">Key Projects</div>
                        {(jobData.projectsText ? parseProjects(jobData.projectsText) : [
                          {
                            title: "Client Automation & Document Generation SaaS",
                            tech: "React.js • Node.js • Tailwind CSS • REST API",
                            points: [
                              "Developed a self-service client dashboard that dynamically compiles user inputs into styled PDF documents with one-click export."
                            ]
                          }
                        ]).map((proj, idx) => (
                          <div key={idx} className="item-card">
                            <div className="item-header">
                              <span className="item-role">{proj.title}</span>
                              <span className="proj-tech">{proj.tech}</span>
                            </div>
                            <ul className="clean-list list-disc pl-5">
                              {proj.points.map((pt, i) => (
                                <li key={i}>{pt}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* ૫. ટેકનિકલ સ્કિલ્સ (Horizontal Flowing Pills) */}
                      <div className="section-block">
                        <div className="section-title">Technical Skills</div>
                        <table className="skills-table">
                          <tbody>
                            <tr>
                              <td className="skill-cat-title">Frontend & UI:</td>
                              <td>
                                <div className="skill-pills-wrap">
                                  {(jobData.frontendSkills ? parseCommaSkills(jobData.frontendSkills) : ["React.js", "JavaScript (ES6+)", "TypeScript", "Tailwind CSS", "HTML5 / CSS3", "Bootstrap"]).map((s, i) => (
                                    <span key={i} className="skill-badge">{s}</span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className="skill-cat-title">Backend & Tools:</td>
                              <td>
                                <div className="skill-pills-wrap">
                                  {(jobData.backendSkills ? parseCommaSkills(jobData.backendSkills) : ["Node.js", "REST APIs", "Git / GitHub", "Postman", "Vite / Webpack"]).map((s, i) => (
                                    <span key={i} className="skill-badge">{s}</span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* ૬. એજ્યુકેશન */}
                      <div className="section-block">
                        <div className="section-title">Education</div>
                        <div className="item-card">
                          <div className="item-header">
                            <div>
                              <span className="item-role">{jobData.degree || 'B.Tech in Computer Engineering'}</span> &bull; <span className="item-company">{jobData.institute || 'Gujarat Technological University (GTU)'}</span>
                            </div>
                            <span className="item-date">{jobData.year || '2018 - 2022'} | {jobData.grade || 'First Class Distinction'}</span>
                          </div>
                        </div>
                      </div>

                      {/* ૭. પર્સનલ ડિટેલ્સ (Horizontal 2x2 Grid) */}
                      <div className="section-block" style={{ marginBottom: 0 }}>
                        <div className="section-title">Personal Details</div>
                        <table className="personal-grid-table">
                          <tbody>
                            <tr>
                              <td className="p-head">Date of Birth:</td>
                              <td className="p-value">{jobData.dob || '15-05-2002'}</td>
                              <td className="p-head">Languages:</td>
                              <td className="p-value">{jobData.languages || 'English, Gujarati, Hindi'}</td>
                            </tr>
                            <tr>
                              <td className="p-head">Gender:</td>
                              <td className="p-value">{jobData.gender || 'Female'}</td>
                              <td className="p-head">Location:</td>
                              <td className="p-value">{jobData.personalLocation || 'Jamnagar / Ahmedabad, Gujarat'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* ૮. ડિક્લેરેશન ફૂટર */}
                    <div className="declaration-footer">
                      <span><b>Declaration:</b> I hereby declare that the information provided above is true to the best of my knowledge.</span>
                      <span><b>{jobData.name || 'DHRUVISHA'}</b></span>
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
