// Official Gujarat Administrative Location Database
// Sourced dynamically from Gujarat Government GP dataset (14,292 Gram Panchayats)
// Renders cascading selections for Otlo Hyper-local Community Setup

export const DISTRICTS = [
  { id: "ahmedabad", name_en: "Ahmedabad", name_gu: "અમદાવાદ" },
  { id: "amreli", name_en: "Amreli", name_gu: "અમરેલી" },
  { id: "anand", name_en: "Anand", name_gu: "આણંદ" },
  { id: "aravalli", name_en: "Aravalli", name_gu: "અરવલ્લી" },
  { id: "banaskantha", name_en: "Banaskantha", name_gu: "બનાસકાંઠા" },
  { id: "bharuch", name_en: "Bharuch", name_gu: "ભરૂચ" },
  { id: "bhavnagar", name_en: "Bhavnagar", name_gu: "ભાવનગર" },
  { id: "botad", name_en: "Botad", name_gu: "બોટાદ" },
  { id: "chhota_udaipur", name_en: "Chhota Udepur", name_gu: "છોટા ઉદેપુર" },
  { id: "dahod", name_en: "Dahod", name_gu: "દાહોદ" },
  { id: "dang", name_en: "Dang", name_gu: "ડાંગ" },
  { id: "devbhumi_dwarka", name_en: "Devbhumi Dwarka", name_gu: "દેવભૂમિ દ્વારકા" },
  { id: "gandhinagar", name_en: "Gandhinagar", name_gu: "ગાંધીનગર" },
  { id: "gir_somnath", name_en: "Gir Somnath", name_gu: "ગીર સોમનાથ" },
  { id: "jamnagar", name_en: "Jamnagar", name_gu: "જામનગર" },
  { id: "junagadh", name_en: "Junagadh", name_gu: "જૂનાગઢ" },
  { id: "kheda", name_en: "Kheda", name_gu: "ખેડા" },
  { id: "kutch", name_en: "Kutch", name_gu: "કચ્છ" },
  { id: "mahisagar", name_en: "Mahisagar", name_gu: "મહીસાગર" },
  { id: "mehsana", name_en: "Mehsana", name_gu: "મહેસાણા" },
  { id: "morbi", name_en: "Morbi", name_gu: "મોરબી" },
  { id: "narmada", name_en: "Narmada", name_gu: "નર્મદા" },
  { id: "navsari", name_en: "Navsari", name_gu: "નવસારી" },
  { id: "panchmahal", name_en: "Panchmahal", name_gu: "પંચમહાલ" },
  { id: "patan", name_en: "Patan", name_gu: "પાટણ" },
  { id: "porbandar", name_en: "Porbandar", name_gu: "પોરબંદર" },
  { id: "rajkot", name_en: "Rajkot", name_gu: "રાજકોટ" },
  { id: "sabarkantha", name_en: "Sabarkantha", name_gu: "સાબરકાંઠા" },
  { id: "surat", name_en: "Surat", name_gu: "સુરત" },
  { id: "surendranagar", name_en: "Surendranagar", name_gu: "સુરેન્દ્રનગર" },
  { id: "tapi", name_en: "Tapi", name_gu: "તાપી" },
  { id: "vadodara", name_en: "Vadodara", name_gu: "વડોદરા" },
  { id: "valsad", name_en: "Valsad", name_gu: "વલસાડ" },
];

export const TALUKAS = {
  ahmedabad: [
    { id: "bavla", name_en: "Bavla", name_gu: "બાવળા" },
    { id: "daskroi", name_en: "Daskroi", name_gu: "દસક્રોઈ" },
    { id: "detroj_rampura", name_en: "Detroj-Rampura", name_gu: "દેત્રોજ-રામપુરા" },
    { id: "dhandhuka", name_en: "Dhandhuka", name_gu: "ધંધુકા" },
    { id: "dholera", name_en: "Dholera", name_gu: "ધોલેરા" },
    { id: "dholka", name_en: "Dholka", name_gu: "ધોળકા" },
    { id: "mandal", name_en: "Mandal", name_gu: "મંડળ" },
    { id: "sanand", name_en: "Sanand", name_gu: "સાણંદ" },
    { id: "viramgam", name_en: "Viramgam", name_gu: "વિરમગામ" },
  ],
  amreli: [
    { id: "amreli_t", name_en: "Amreli", name_gu: "અમરેલી" },
    { id: "babra", name_en: "Babra", name_gu: "બાબરા" },
    { id: "bagasara", name_en: "Bagasara", name_gu: "બગસરા" },
    { id: "dhari", name_en: "Dhari", name_gu: "ધારી" },
    { id: "jafrabad", name_en: "Jafrabad", name_gu: "જાફરાબાદ" },
    { id: "khambha", name_en: "Khambha", name_gu: "ખાંભા" },
    { id: "kunkavav_vadia", name_en: "Kunkavav Vadia", name_gu: "કુંકાવાવ વડીયા" },
    { id: "lathi", name_en: "Lathi", name_gu: "લાઠી" },
    { id: "lilia", name_en: "Lilia", name_gu: "લીલીયા" },
    { id: "rajula", name_en: "Rajula", name_gu: "રાજુલા" },
    { id: "savar_kundla", name_en: "Savar Kundla", name_gu: "સાવર કુંડલા" },
  ],
  anand: [
    { id: "anand_t", name_en: "Anand", name_gu: "આણંદ" },
    { id: "anklav", name_en: "Anklav", name_gu: "આંકલાવ" },
    { id: "borsad", name_en: "Borsad", name_gu: "બોરસદ" },
    { id: "khambhat", name_en: "Khambhat", name_gu: "ખંભાત" },
    { id: "petlad", name_en: "Petlad", name_gu: "પેટલાદ" },
    { id: "sojitra", name_en: "Sojitra", name_gu: "સોજીત્રા" },
    { id: "tarapur", name_en: "Tarapur", name_gu: "તારાપુર" },
    { id: "umreth", name_en: "Umreth", name_gu: "ઉમરેઠ" },
  ],
  aravalli: [
    { id: "bayad", name_en: "Bayad", name_gu: "બાયડ" },
    { id: "bhiloda", name_en: "Bhiloda", name_gu: "ભિલોડા" },
    { id: "dhansura", name_en: "Dhansura", name_gu: "ધનસુરા" },
    { id: "malpur", name_en: "Malpur", name_gu: "માલપુર" },
    { id: "meghraj", name_en: "Meghraj", name_gu: "મેઘરાજ" },
    { id: "modasa", name_en: "Modasa", name_gu: "મોડાસા" },
  ],
  banaskantha: [
    { id: "amirgadh", name_en: "Amirgadh", name_gu: "અમીરગઢ" },
    { id: "bhabhar", name_en: "Bhabhar", name_gu: "ભાભર" },
    { id: "danta", name_en: "Danta", name_gu: "દાંતા" },
    { id: "dantiwada", name_en: "Dantiwada", name_gu: "દાંતીવાડા" },
    { id: "deesa", name_en: "Deesa", name_gu: "ડીસા" },
    { id: "deodar", name_en: "Deodar", name_gu: "દિયોદર" },
    { id: "dhanera", name_en: "Dhanera", name_gu: "ધાનેરા" },
    { id: "kankrej", name_en: "Kankrej", name_gu: "કાંકરેજ" },
    { id: "lakhani", name_en: "Lakhani", name_gu: "લાખાણી" },
    { id: "palanpur", name_en: "Palanpur", name_gu: "પાલનપુર" },
    { id: "suigam", name_en: "Suigam", name_gu: "સુઇગામ" },
    { id: "tharad", name_en: "Tharad", name_gu: "થરાદ" },
    { id: "vadgam", name_en: "Vadgam", name_gu: "વડગામ" },
    { id: "vav", name_en: "Vav", name_gu: "વાવ" },
  ],
  bharuch: [
    { id: "amod", name_en: "Amod", name_gu: "આમોદ" },
    { id: "anklesvar", name_en: "Anklesvar", name_gu: "અંકલેશ્વર" },
    { id: "bharuch_t", name_en: "Bharuch", name_gu: "ભરૂચ" },
    { id: "hansot", name_en: "Hansot", name_gu: "હાંસોટ" },
    { id: "jambusar", name_en: "Jambusar", name_gu: "જંબુસર" },
    { id: "jhagadia", name_en: "Jhagadia", name_gu: "ઝગડિયા" },
    { id: "netrang", name_en: "Netrang", name_gu: "નેત્રંગ" },
    { id: "vagra", name_en: "Vagra", name_gu: "વાગરા" },
    { id: "valia", name_en: "Valia", name_gu: "વાલિયા" },
  ],
  bhavnagar: [
    { id: "bhavnagar_t", name_en: "Bhavnagar", name_gu: "ભાવનગર" },
    { id: "gariadhar", name_en: "Gariadhar", name_gu: "ગારીયાધાર" },
    { id: "ghogha", name_en: "Ghogha", name_gu: "ઘોઘા" },
    { id: "jesar", name_en: "Jesar", name_gu: "જેસર" },
    { id: "mahuva", name_en: "Mahuva", name_gu: "મહુવા" },
    { id: "palitana", name_en: "Palitana", name_gu: "પાલીતાણા" },
    { id: "sihor", name_en: "Sihor", name_gu: "સિહોર" },
    { id: "talaja", name_en: "Talaja", name_gu: "તળાજા" },
    { id: "umrala", name_en: "Umrala", name_gu: "ઉમરાળા" },
    { id: "vallabhipur", name_en: "Vallabhipur", name_gu: "વલ્લભીપુર" },
  ],
  botad: [
    { id: "barwala", name_en: "Barwala", name_gu: "બરવાળા" },
    { id: "botad_t", name_en: "Botad", name_gu: "બોટાદ" },
    { id: "gadhada", name_en: "Gadhada", name_gu: "ગધાડા" },
    { id: "ranpur", name_en: "Ranpur", name_gu: "રાણપુર" },
  ],
  chhota_udaipur: [
    { id: "bodeli", name_en: "Bodeli", name_gu: "બોડેલી" },
    { id: "chhota_udaipur_t", name_en: "Chhota Udaipur", name_gu: "છોટા ઉદેપુર" },
    { id: "jetpur_pavi", name_en: "Jetpur Pavi", name_gu: "જેતપુર પાવી" },
    { id: "kavant", name_en: "Kavant", name_gu: "કવંત" },
    { id: "nasvadi", name_en: "Nasvadi", name_gu: "નસવાડી" },
    { id: "sankheda", name_en: "Sankheda", name_gu: "સંખેડા" },
  ],
  dahod: [
    { id: "dahod_t", name_en: "Dahod", name_gu: "દાહોદ" },
    { id: "devgadbaria", name_en: "Devgadbaria", name_gu: "દેવગઢબારિયા" },
    { id: "dhanpur", name_en: "Dhanpur", name_gu: "ધાનપુર" },
    { id: "fatepura", name_en: "Fatepura", name_gu: "ફતેપુરા" },
    { id: "garbada", name_en: "Garbada", name_gu: "ગરબાડા" },
    { id: "jhalod", name_en: "Jhalod", name_gu: "ઝાલોદ" },
    { id: "limkheda", name_en: "Limkheda", name_gu: "લીમખેડા" },
    { id: "sanjeli", name_en: "Sanjeli", name_gu: "સંજેલી" },
    { id: "singvad", name_en: "Singvad", name_gu: "સિંગવડ" },
  ],
  dang: [
    { id: "ahwa", name_en: "Ahwa", name_gu: "આહવા" },
    { id: "subir", name_en: "Subir", name_gu: "સુબીર" },
    { id: "vagai", name_en: "Vagai", name_gu: "વગાઈ" },
  ],
  devbhumi_dwarka: [
    { id: "bhanvad", name_en: "Bhanvad", name_gu: "ભાણવડ" },
    { id: "kalyanpur", name_en: "Kalyanpur", name_gu: "કલ્યાણપુર" },
    { id: "khambhalia", name_en: "Khambhalia", name_gu: "ખંભાળિયા" },
    { id: "okhamandal", name_en: "Okhamandal", name_gu: "ઓખામંડળ" },
  ],
  gandhinagar: [
    { id: "dehgam", name_en: "Dehgam", name_gu: "દહેગામ" },
    { id: "gandhinagar_t", name_en: "Gandhinagar", name_gu: "ગાંધીનગર" },
    { id: "kalol", name_en: "Kalol", name_gu: "કલોલ" },
    { id: "mansa", name_en: "Mansa", name_gu: "માણસા" },
  ],
  gir_somnath: [
    { id: "gir_gadhada", name_en: "Gir-Gadhada", name_gu: "ગીર-ગઢડા" },
    { id: "kodinar", name_en: "Kodinar", name_gu: "કોડીનાર" },
    { id: "patan_veraval", name_en: "Patan-Veraval", name_gu: "પાટણ-વેરાવળ" },
    { id: "sutrapada", name_en: "Sutrapada", name_gu: "સુત્રાપાડા" },
    { id: "talala", name_en: "Talala", name_gu: "તાલાલા" },
    { id: "una", name_en: "Una", name_gu: "ઉના" },
  ],
  jamnagar: [
    { id: "dhrol", name_en: "Dhrol", name_gu: "ધ્રોલ" },
    { id: "jamjodhpur", name_en: "Jamjodhpur", name_gu: "જામજોધપુર" },
    { id: "jamnagar_rural", name_en: "Jamnagar Rural", name_gu: "જામનગર ગ્રામ્ય" },
    { id: "jodiya", name_en: "Jodiya", name_gu: "જોડીયા" },
    { id: "kalavad", name_en: "Kalavad", name_gu: "કાલાવડ" },
    { id: "lalpur", name_en: "Lalpur", name_gu: "લાલપુર" },
  ],
  junagadh: [
    { id: "bhesan", name_en: "Bhesan", name_gu: "ભેસાણ" },
    { id: "junagadh_t", name_en: "Junagadh", name_gu: "જૂનાગઢ" },
    { id: "keshod", name_en: "Keshod", name_gu: "કેશોદ" },
    { id: "malia", name_en: "Malia", name_gu: "માલિયા" },
    { id: "manavadar", name_en: "Manavadar", name_gu: "માણાવદર" },
    { id: "mangrol", name_en: "Mangrol", name_gu: "માંગરોળ" },
    { id: "mendarda", name_en: "Mendarda", name_gu: "મેંદરડા" },
    { id: "vanthali", name_en: "Vanthali", name_gu: "વંથલી" },
    { id: "visavadar", name_en: "Visavadar", name_gu: "વિસાવદર" },
  ],
  kheda: [
    { id: "galteshwar", name_en: "Galteshwar", name_gu: "ગલતેશ્વર" },
    { id: "kapadvanj", name_en: "Kapadvanj", name_gu: "કપડવંજ" },
    { id: "kathlal", name_en: "Kathlal", name_gu: "કાથલાલ" },
    { id: "kheda_t", name_en: "Kheda", name_gu: "ખેડા" },
    { id: "mahudha", name_en: "Mahudha", name_gu: "મહુધા" },
    { id: "matar", name_en: "Matar", name_gu: "માતર" },
    { id: "mehmedabad", name_en: "Mehmedabad", name_gu: "મહેમદાવાદ" },
    { id: "nadiad", name_en: "Nadiad", name_gu: "નડિયાદ" },
    { id: "thasra", name_en: "Thasra", name_gu: "થસરા" },
    { id: "vaso", name_en: "Vaso", name_gu: "વસો" },
  ],
  kutch: [
    { id: "abdasa", name_en: "Abdasa", name_gu: "અબડાસા" },
    { id: "anjar", name_en: "Anjar", name_gu: "અંજાર" },
    { id: "bhachau", name_en: "Bhachau", name_gu: "ભચાઉ" },
    { id: "bhuj", name_en: "Bhuj", name_gu: "ભુજ" },
    { id: "gandhidham", name_en: "Gandhidham", name_gu: "ગાંધીધામ" },
    { id: "lakhpat", name_en: "Lakhpat", name_gu: "લખપત" },
    { id: "mandvi", name_en: "Mandvi", name_gu: "માંડવી" },
    { id: "mundra", name_en: "Mundra", name_gu: "મુન્દ્રા" },
    { id: "nakhatrana", name_en: "Nakhatrana", name_gu: "નખત્રાણા" },
    { id: "rapar", name_en: "Rapar", name_gu: "રાપર" },
  ],
  mahisagar: [
    { id: "balasinor", name_en: "Balasinor", name_gu: "બાલાસિનોર" },
    { id: "kadana", name_en: "Kadana", name_gu: "કડાણા" },
    { id: "khanpur", name_en: "Khanpur", name_gu: "ખાનપુર" },
    { id: "lunawada", name_en: "Lunawada", name_gu: "લુણાવાડા" },
    { id: "santrampur", name_en: "Santrampur", name_gu: "સંતરામપુર" },
    { id: "virpur", name_en: "Virpur", name_gu: "વિરપુર" },
  ],
  mehsana: [
    { id: "becharaji", name_en: "Becharaji", name_gu: "બેચરાજી" },
    { id: "jotana", name_en: "Jotana", name_gu: "જોટાણા" },
    { id: "kadi", name_en: "Kadi", name_gu: "કડી" },
    { id: "kheralu", name_en: "Kheralu", name_gu: "ખેરાલુ" },
    { id: "mehsana_t", name_en: "Mahesana", name_gu: "મહેસાણા" },
    { id: "satlasana", name_en: "Satlasana", name_gu: "સતલાસણા" },
    { id: "unjha", name_en: "Unjha", name_gu: "ઊંઝા" },
    { id: "vadnagar", name_en: "Vadnagar", name_gu: "વડનગર" },
    { id: "vijapur", name_en: "Vijapur", name_gu: "વિજાપુર" },
    { id: "visnagar", name_en: "Visnagar", name_gu: "વિસનગર" },
  ],
  morbi: [
    { id: "halvad", name_en: "Halvad", name_gu: "હળવદ" },
    { id: "maliya_morbi", name_en: "Maliya Morbi", name_gu: "માળીયા મોરબી" },
    { id: "morvi", name_en: "Morvi", name_gu: "મોરવી" },
    { id: "tankara", name_en: "Tankara", name_gu: "ટંકારા" },
    { id: "wankaner", name_en: "Wankaner", name_gu: "વાંકાનેર" },
  ],
  narmada: [
    { id: "dediapada", name_en: "Dediapada", name_gu: "દેડિયાપાડા" },
    { id: "garudeshwar", name_en: "Garudeshwar", name_gu: "ગરુડેશ્વર" },
    { id: "nandod", name_en: "Nandod", name_gu: "નાંદોદ" },
    { id: "sagbara", name_en: "Sagbara", name_gu: "સાગબારા" },
    { id: "tilakwada", name_en: "Tilakwada", name_gu: "તિલકવાડા" },
  ],
  navsari: [
    { id: "chikhli", name_en: "Chikhli", name_gu: "ચીખલી" },
    { id: "gandevi", name_en: "Gandevi", name_gu: "ગણદેવી" },
    { id: "jalalpore", name_en: "Jalalpore", name_gu: "જલાલપોર" },
    { id: "khergam", name_en: "Khergam", name_gu: "ખેરગામ" },
    { id: "navsari_t", name_en: "Navsari", name_gu: "નવસારી" },
    { id: "vansada", name_en: "Vansada", name_gu: "વાંસડા" },
  ],
  panchmahal: [
    { id: "ghoghamba", name_en: "Ghoghamba", name_gu: "ઘોઘંબા" },
    { id: "godhra", name_en: "Godhra", name_gu: "ગોધરા" },
    { id: "halol", name_en: "Halol", name_gu: "હાલોલ" },
    { id: "jambughoda", name_en: "Jambughoda", name_gu: "જાંબુઘોડા" },
    { id: "kalol_panch", name_en: "Kalol Panch", name_gu: "કલોલ પં" },
    { id: "morwa_hadaf", name_en: "Morwa (Hadaf)", name_gu: "મોરવા (હડફ)" },
    { id: "shehera", name_en: "Shehera", name_gu: "શેહેરા" },
  ],
  patan: [
    { id: "chanasma", name_en: "Chanasma", name_gu: "ચાણસ્મા" },
    { id: "harij", name_en: "Harij", name_gu: "હારીજ" },
    { id: "patan_t", name_en: "Patan", name_gu: "પાટણ" },
    { id: "radhanpur", name_en: "Radhanpur", name_gu: "રાધનપુર" },
    { id: "sami", name_en: "Sami", name_gu: "સામી" },
    { id: "sankheshwar", name_en: "Sankheshwar", name_gu: "સંખેશ્વર" },
    { id: "santalpur", name_en: "Santalpur", name_gu: "સાંતલપુર" },
    { id: "saraswati", name_en: "Saraswati", name_gu: "સરસ્વતી" },
    { id: "sidhpur", name_en: "Sidhpur", name_gu: "સિદ્ધપુર" },
  ],
  porbandar: [
    { id: "kutiyana", name_en: "Kutiyana", name_gu: "કુતિયાણા" },
    { id: "porbandar_t", name_en: "Porbandar", name_gu: "પોરબંદર" },
    { id: "ranavav", name_en: "Ranavav", name_gu: "રાણાવાવ" },
  ],
  rajkot: [
    { id: "dhoraji", name_en: "Dhoraji", name_gu: "ધોરાજી" },
    { id: "gondal", name_en: "Gondal", name_gu: "ગોંડલ" },
    { id: "jamkandorna", name_en: "Jamkandorna", name_gu: "જામકંડોરણા" },
    { id: "jasdan", name_en: "Jasdan", name_gu: "જસદણ" },
    { id: "jetpur", name_en: "Jetpur", name_gu: "જેતપુર" },
    { id: "kotda_sangani", name_en: "Kotda Sangani", name_gu: "કોટડા સાંગાણી" },
    { id: "lodhika", name_en: "Lodhika", name_gu: "લોધીકા" },
    { id: "paddhari", name_en: "Paddhari", name_gu: "પડધરી" },
    { id: "rajkot_t", name_en: "Rajkot", name_gu: "રાજકોટ" },
    { id: "upleta", name_en: "Upleta", name_gu: "ઉપલેટા" },
    { id: "vinchhiya", name_en: "Vinchhiya", name_gu: "વિંછીયા" },
  ],
  sabarkantha: [
    { id: "himatnagar", name_en: "Himatnagar", name_gu: "હિમતનગર" },
    { id: "idar", name_en: "Idar", name_gu: "ઇડર" },
    { id: "khedbrahma", name_en: "Khedbrahma", name_gu: "ખેડબ્રહ્મા" },
    { id: "poshina", name_en: "Poshina", name_gu: "પોશીના" },
    { id: "prantij", name_en: "Prantij", name_gu: "પ્રાંતિજ" },
    { id: "talod", name_en: "Talod", name_gu: "તલોદ" },
    { id: "vadali", name_en: "Vadali", name_gu: "વડાલી" },
    { id: "vijaynagar", name_en: "Vijaynagar", name_gu: "વિજયનગર" },
  ],
  surat: [
    { id: "bardoli", name_en: "Bardoli", name_gu: "બારડોલી" },
    { id: "chorasi", name_en: "Chorasi", name_gu: "ચોરાસી" },
    { id: "kamrej", name_en: "Kamrej", name_gu: "કામરેજ" },
    { id: "madvi", name_en: "Madvi", name_gu: "માડવી" },
    { id: "mahuva_surat", name_en: "Mahuva Surat", name_gu: "મહુવા સુરત" },
    { id: "mangrol", name_en: "Mangrol", name_gu: "માંગરોળ" },
    { id: "olpad", name_en: "Olpad", name_gu: "ઓલપાડ" },
    { id: "palsana", name_en: "Palsana", name_gu: "પલસાણા" },
    { id: "umarpada", name_en: "Umarpada", name_gu: "ઉમરપાડા" },
  ],
  surendranagar: [
    { id: "chotila", name_en: "Chotila", name_gu: "ચોટીલા" },
    { id: "chuda", name_en: "Chuda", name_gu: "ચૂડા" },
    { id: "dasada", name_en: "Dasada", name_gu: "દસાડા" },
    { id: "dhrangadhra", name_en: "Dhrangadhra", name_gu: "ધ્રાંગધ્રા" },
    { id: "lakhtar", name_en: "Lakhtar", name_gu: "લખતર" },
    { id: "limbdi", name_en: "Limbdi", name_gu: "લીંબડી" },
    { id: "muli", name_en: "Muli", name_gu: "મુલી" },
    { id: "sayla", name_en: "Sayla", name_gu: "સાયલા" },
    { id: "thangadh", name_en: "Thangadh", name_gu: "થાનગઢ" },
    { id: "wadhwan", name_en: "Wadhwan", name_gu: "વઢવાણ" },
  ],
  tapi: [
    { id: "dolvan", name_en: "Dolvan", name_gu: "ડોલવણ" },
    { id: "kukarmunda", name_en: "Kukarmunda", name_gu: "કુકરમુંડા" },
    { id: "nizar", name_en: "Nizar", name_gu: "નિઝર" },
    { id: "songadh", name_en: "Songadh", name_gu: "સોનગઢ" },
    { id: "uchchhal", name_en: "Uchchhal", name_gu: "ઉચ્છલ" },
    { id: "valod", name_en: "Valod", name_gu: "વાલોડ" },
    { id: "vyara", name_en: "Vyara", name_gu: "વ્યારા" },
  ],
  vadodara: [
    { id: "dabhoi", name_en: "Dabhoi", name_gu: "ડભોઇ" },
    { id: "desar", name_en: "Desar", name_gu: "દેસર" },
    { id: "karajan", name_en: "Karajan", name_gu: "કરજણ" },
    { id: "padra", name_en: "Padra", name_gu: "પાદરા" },
    { id: "savli", name_en: "Savli", name_gu: "સાવલી" },
    { id: "sinor", name_en: "Sinor", name_gu: "સિનોર" },
    { id: "vadodara_t", name_en: "Vadodara", name_gu: "વડોદરા" },
    { id: "vaghodia", name_en: "Vaghodia", name_gu: "વાઘોડિયા" },
  ],
  valsad: [
    { id: "dharampur", name_en: "Dharampur", name_gu: "ધરમપુર" },
    { id: "kaprada", name_en: "Kaprada", name_gu: "કપરાડા" },
    { id: "pardi", name_en: "Pardi", name_gu: "પારડી" },
    { id: "umbergaon", name_en: "Umbergaon", name_gu: "ઉમ્બરગાંવ" },
    { id: "valsad_t", name_en: "Valsad", name_gu: "વલસાડ" },
    { id: "vapi", name_en: "Vapi", name_gu: "વાપી" },
  ],
};

// Dynamic village caching mechanisms
let cachedVillages = null;

export const setDynamicVillages = (data) => {
  cachedVillages = data;
};

export const getDistrictName = (id) => {
  const d = DISTRICTS.find(item => item.id === id);
  return d ? d.name_gu : "";
};

export const getTalukaName = (distId, id) => {
  const list = TALUKAS[distId] || [];
  const t = list.find(item => item.id === id);
  return t ? t.name_gu : "";
};

export const getVillageName = (talukaId, id) => {
  // 1. If we have loaded villages JSON in memory, look up the name there
  if (cachedVillages && cachedVillages[talukaId]) {
    const v = cachedVillages[talukaId].find(item => item.id === id);
    if (v) return v.name_gu;
  }
  
  // 2. Check if it matches the current user's village in localStorage
  try {
    const saved = localStorage.getItem('user_location');
    if (saved) {
      const loc = JSON.parse(saved);
      if (loc.villageId === id) {
        return loc.villageNameGu || id;
      }
    }
  } catch (err) {
    console.error("Error reading village from local storage:", err);
  }
  
  // 3. Fallback to parsing the ID if readable or raw ID
  return id;
};
