// English Learning Zone Game Database

export const WORD_EMOJI_PAIRS = [
  // Animals
  { english: 'DOG', emoji: '🐕', gujarati: 'કૂતરો', category: 'animals' },
  { english: 'CAT', emoji: '🐱', gujarati: 'બિલાડી', category: 'animals' },
  { english: 'COW', emoji: '🐄', gujarati: 'ગાય', category: 'animals' },
  { english: 'LION', emoji: '🦁', gujarati: 'સિંહ', category: 'animals' },
  { english: 'TIGER', emoji: '🐯', gujarati: 'વાઘ', category: 'animals' },
  { english: 'ELEPHANT', emoji: '🐘', gujarati: 'હાથી', category: 'animals' },
  { english: 'MONKEY', emoji: '🐒', gujarati: 'વાંદરો', category: 'animals' },
  { english: 'HORSE', emoji: '🐎', gujarati: 'ઘોડો', category: 'animals' },
  { english: 'RABBIT', emoji: '🐇', gujarati: 'સસલું', category: 'animals' },
  { english: 'DEER', emoji: '🦌', gujarati: 'હરણ', category: 'animals' },

  // Fruits
  { english: 'MANGO', emoji: '🥭', gujarati: 'કેરી', category: 'fruits' },
  { english: 'APPLE', emoji: '🍎', gujarati: 'સફરજન', category: 'fruits' },
  { english: 'BANANA', emoji: '🍌', gujarati: 'કેળું', category: 'fruits' },
  { english: 'GRAPE', emoji: '🍇', gujarati: 'દ્રાક્ષ', category: 'fruits' },
  { english: 'ORANGE', emoji: '🍊', gujarati: 'સંતરું', category: 'fruits' },
  { english: 'WATERMELON', emoji: '🍉', gujarati: 'તડબૂચ', category: 'fruits' },
  { english: 'PAPAYA', emoji: '🍍', gujarati: 'પપૈયું', category: 'fruits' },
  { english: 'COCONUT', emoji: '🥥', gujarati: 'નાળિયેર', category: 'fruits' },

  // Vegetables
  { english: 'POTATO', emoji: '🥔', gujarati: 'બટાકા', category: 'vegetables' },
  { english: 'TOMATO', emoji: '🍅', gujarati: 'ટામેટા', category: 'vegetables' },
  { english: 'ONION', emoji: '🧅', gujarati: 'ડુંગળી', category: 'vegetables' },
  { english: 'CARROT', emoji: '🥕', gujarati: 'ગાજર', category: 'vegetables' },
  { english: 'GARLIC', emoji: '🧄', gujarati: 'લસણ', category: 'vegetables' },
  { english: 'CHILI', emoji: '🌶️', gujarati: 'મરચું', category: 'vegetables' },
  { english: 'EGGPLANT', emoji: '🍆', gujarati: 'રીંગણ', category: 'vegetables' },

  // Colors
  { english: 'RED', emoji: '🔴', gujarati: 'લાલ', category: 'colors' },
  { english: 'BLUE', emoji: '🔵', gujarati: 'વાદળી', category: 'colors' },
  { english: 'GREEN', emoji: '🟢', gujarati: 'લીલો', category: 'colors' },
  { english: 'YELLOW', emoji: '🟡', gujarati: 'પીળો', category: 'colors' },
  { english: 'BLACK', emoji: '⚫', gujarati: 'કાળો', category: 'colors' },
  { english: 'WHITE', emoji: '⚪', gujarati: 'સફેદ', category: 'colors' },
  { english: 'ORANGE_COLOR', emoji: '🟠', gujarati: 'કેસરી', category: 'colors' },

  // Body Parts
  { english: 'EYE', emoji: '👁️', gujarati: 'આંખ', category: 'body' },
  { english: 'EAR', emoji: '👂', gujarati: 'કાન', category: 'body' },
  { english: 'HAND', emoji: '✋', gujarati: 'હાથ', category: 'body' },
  { english: 'NOSE', emoji: '👃', gujarati: 'નાક', category: 'body' },
  { english: 'FOOT', emoji: '🦶', gujarati: 'પગ', category: 'body' },
  { english: 'HAIR', emoji: '🦱', gujarati: 'વાળ', category: 'body' },
  { english: 'MOUTH', emoji: '👄', gujarati: 'મોઢું', category: 'body' },

  // Clothes
  { english: 'SHIRT', emoji: '👕', gujarati: 'શર્ટ', category: 'clothes' },
  { english: 'SAREE', emoji: '🥻', gujarati: 'સાડી', category: 'clothes' },
  { english: 'SHOES', emoji: '👟', gujarati: 'બૂટ', category: 'clothes' },
  { english: 'CAP', emoji: '🧢', gujarati: 'ટોપી', category: 'clothes' },
  { english: 'SOCKS', emoji: '🧦', gujarati: 'મોજાં', category: 'clothes' },

  // Household
  { english: 'DOOR', emoji: '🚪', gujarati: 'દરવાજો', category: 'home' },
  { english: 'WINDOW', emoji: '🪟', gujarati: 'બારી', category: 'home' },
  { english: 'BED', emoji: '🛏️', gujarati: 'પલંગ', category: 'home' },
  { english: 'CHAIR', emoji: '🪑', gujarati: 'ખુરશી', category: 'home' },
  { english: 'CLOCK', emoji: '⏰', gujarati: 'ઘડિયાળ', category: 'home' },
  { english: 'KEY', emoji: '🔑', gujarati: 'ચાવી', category: 'home' },

  // School / Office
  { english: 'BOOK', emoji: '📚', gujarati: 'ચોપડી', category: 'school' },
  { english: 'PEN', emoji: '✏️', gujarati: 'પેન', category: 'school' },
  { english: 'BAG', emoji: '🎒', gujarati: 'દફતર', category: 'school' },
  { english: 'LAPTOP', emoji: '💻', gujarati: 'લેપટોપ', category: 'school' },
  { english: 'PAPER', emoji: '📄', gujarati: 'કાગળ', category: 'school' }
];

export const COMPLETE_SENTENCES = [
  // Level 1: Beginner
  {
    id: 'cs1',
    sentence: "I ___ to school every day.",
    blankWord: "go",
    options: ["go", "goes", "went", "going"],
    gujaratiHint: "હું દરરોજ શાળાએ જાઉં છું.",
    explanation: "સાદા વર્તમાનકાળમાં પ્રથમ પુરુષ (I/We/You/They) સાથે ક્રિયાપદનું મૂળ રૂપ (go) વપરાય છે.",
    level: 1,
    category: "daily"
  },
  {
    id: 'cs2',
    sentence: "The sun ___ in the east.",
    blankWord: "rises",
    options: ["rise", "rises", "rising", "rose"],
    gujaratiHint: "સૂર્ય પૂર્વમાં ઉગે છે.",
    explanation: "સૂર્ય એ ત્રીજો પુરુષ એકવચન (It) હોવાથી ક્રિયાપદને 's' કે 'es' પ્રત્યય લાગે છે.",
    level: 1,
    category: "nature"
  },
  {
    id: 'cs3',
    sentence: "She ___ a beautiful voice.",
    blankWord: "has",
    options: ["have", "has", "is", "are"],
    gujaratiHint: "તેણીનો અવાજ સુંદર છે (તેણી સુંદર અવાજ ધરાવે છે).",
    explanation: "She/He/It સાથે માલિકી દર્શાવવા માટે 'has' વપરાય છે.",
    level: 1,
    category: "daily"
  },
  {
    id: 'cs4',
    sentence: "We ___ playing cricket now.",
    blankWord: "are",
    options: ["am", "is", "are", "was"],
    gujaratiHint: "અમે અત્યારે ક્રિકેટ રમી રહ્યા છીએ.",
    explanation: "ચાલુ વર્તમાનકાળમાં બહુવચન કર્તા (We) સાથે 'are' સહાયકારક ક્રિયાપદ વપરાય છે.",
    level: 1,
    category: "grammar"
  },
  {
    id: 'cs5',
    sentence: "He ___ a letter yesterday.",
    blankWord: "wrote",
    options: ["write", "writes", "wrote", "written"],
    gujaratiHint: "તેણે ગઈકાલે પત્ર લખ્યો હતો.",
    explanation: "વાક્યમાં 'yesterday' હોવાથી ભૂતકાળનું રૂપ 'wrote' વપરાય છે.",
    level: 1,
    category: "grammar"
  },

  // Level 2: Elementary
  {
    id: 'cs6',
    sentence: "The book is ___ the table.",
    blankWord: "on",
    options: ["on", "in", "at", "under"],
    gujaratiHint: "પુસ્તક ટેબલ પર છે.",
    explanation: "કોઈ વસ્તુ સપાટી પર અડીને રહેલી હોય ત્યારે 'on' પ્રિપોઝિશન વપરાય છે.",
    level: 2,
    category: "prepositions"
  },
  {
    id: 'cs7',
    sentence: "I am interested ___ learning English.",
    blankWord: "in",
    options: ["on", "at", "in", "for"],
    gujaratiHint: "મને અંગ્રેજી શીખવામાં રસ છે.",
    explanation: "'Interested' શબ્દ સાથે હંમેશાં 'in' પ્રિપોઝિશન આવે છે.",
    level: 2,
    category: "prepositions"
  },
  {
    id: 'cs8',
    sentence: "They have ___ their lunch.",
    blankWord: "eaten",
    options: ["eat", "ate", "eaten", "eating"],
    gujaratiHint: "તેઓએ તેમનું બપોરનું ભોજન લઈ લીધું છે.",
    explanation: "પૂર્ણ વર્તમાનકાળમાં (have/has) સાથે ક્રિયાપદનું ત્રીજું રૂપ (V3 - eaten) વપરાય છે.",
    level: 2,
    category: "grammar"
  },
  {
    id: 'cs9',
    sentence: "I ___ calling you since morning.",
    blankWord: "have been",
    options: ["have", "has been", "have been", "was"],
    gujaratiHint: "હું તમને સવારથી ફોન કરી રહ્યો છું.",
    explanation: "ચાલુ પૂર્ણ વર્તમાનકાળમાં સમય દર્શાવવા (since morning) સાથે 'have been' વપરાય છે.",
    level: 2,
    category: "grammar"
  },

  // Level 3: Intermediate / Exam English
  {
    id: 'cs10',
    sentence: "If it rains, we ___ the match.",
    blankWord: "will cancel",
    options: ["cancel", "would cancel", "will cancel", "cancelled"],
    gujaratiHint: "જો વરસાદ પડશે, તો અમે મેચ રદ કરીશું.",
    explanation: "શરતી વાક્યમાં જો એક તરફ સાદો વર્તમાનકાળ હોય, તો બીજી બાજુ સાદો ભવિષ્યકાળ (will + V1) આવે.",
    level: 3,
    category: "exams"
  },
  {
    id: 'cs11',
    sentence: "He is senior ___ me in office.",
    blankWord: "to",
    options: ["than", "to", "by", "from"],
    gujaratiHint: "તે ઓફિસમાં મારાથી સિનિયર છે.",
    explanation: "senior, junior, inferior, superior વગેરે શબ્દો સાથે 'than' ને બદલે 'to' વપરાય છે.",
    level: 3,
    category: "exams"
  },
  {
    id: 'cs12',
    sentence: "I am looking forward to ___ you.",
    blankWord: "meeting",
    options: ["meet", "met", "meeting", "meets"],
    gujaratiHint: "હું તમને મળવાની આતુરતાથી રાહ જોઈ રહ્યો છું.",
    explanation: "'looking forward to' ફ્રેઝ પછી હંમેશાં '-ing' વાળું ક્રિયાપદ (Gerund) આવે છે.",
    level: 3,
    category: "exams"
  }
];

export const TRANSLATION_PAIRS = [
  // Gujarati to English (gu-en)
  { gujarati: "ઝડપ", english: "Speed", options: ["Slow", "Speed", "Stop", "Start"], direction: "gu-en" },
  { gujarati: "સુંદર", english: "Beautiful", options: ["Ugly", "Beautiful", "Dirty", "Hard"], direction: "gu-en" },
  { gujarati: "ખેડૂત", english: "Farmer", options: ["Doctor", "Teacher", "Farmer", "Driver"], direction: "gu-en" },
  { gujarati: "ગામડું", english: "Village", options: ["City", "Village", "Town", "State"], direction: "gu-en" },
  { gujarati: "મદદ", english: "Help", options: ["Hate", "Help", "Run", "Walk"], direction: "gu-en" },
  { gujarati: "પરીક્ષા", english: "Exam", options: ["Play", "Exam", "Result", "Class"], direction: "gu-en" },
  { gujarati: "પાણી", english: "Water", options: ["Milk", "Water", "Tea", "Juice"], direction: "gu-en" },
  { gujarati: "નીડર (બહાદુર)", english: "Brave", options: ["Coward", "Brave", "Scared", "Weak"], direction: "gu-en" },
  { gujarati: "શાકભાજી", english: "Vegetables", options: ["Fruits", "Vegetables", "Grains", "Sweets"], direction: "gu-en" },

  // English to Gujarati (en-gu)
  { english: "Knowledge", gujarati: "જ્ઞાન", options: ["જ્ઞાન", "અજ્ઞાન", "ભક્તિ", "વિજ્ઞાન"], direction: "en-gu" },
  { english: "Hospital", gujarati: "દવાખાનું (હોસ્પિટલ)", options: ["શાળા", "દવાખાનું (હોસ્પિટલ)", "બગીચો", "મંદિર"], direction: "en-gu" },
  { english: "Healthy", gujarati: "તંદુરસ્ત", options: ["બીમાર", "તંદુરસ્ત", "નબળું", "થાકેલું"], direction: "en-gu" },
  { english: "Tomorrow", gujarati: "આવતીકાલે", options: ["ગઈકાલે", "આજે", "આવતીકાલે", "પરમદિવસે"], direction: "en-gu" },
  { english: "Always", gujarati: "હંમેશાં", options: ["ક્યારેક", "ક્યારેય નહીં", "હંમેશાં", "વારંવાર"], direction: "en-gu" },
  { english: "Business", gujarati: "વ્યવસાય (ધંધો)", options: ["નોકરી", "ખેતી", "વ્યવસાય (ધંધો)", "ભણતર"], direction: "en-gu" },
  { english: "Window", gujarati: "બારી", options: ["દરવાજો", "બારી", "દીવાલ", "છત"], direction: "en-gu" }
];

export const SCRAMBLE_WORDS = [
  { word: "APPLE", emoji: "🍎", gujarati: "સફરજન", level: 1 },
  { word: "MANGO", emoji: "🥭", gujarati: "કેરી", level: 1 },
  { word: "WATER", emoji: "💧", gujarati: "પાણી", level: 1 },
  { word: "HOUSE", emoji: "🏠", gujarati: "ઘર", level: 1 },
  { word: "SCHOOL", emoji: "🏫", gujarati: "શાળા", level: 1 },
  { word: "FARMER", emoji: "👨‍🌾", gujarati: "ખેડૂત", level: 2 },
  { english: "FLOWER", word: "FLOWER", emoji: "🌸", gujarati: "ફૂલ", level: 2 },
  { word: "DOCTOR", emoji: "👨‍⚕️", gujarati: "ડોક્ટર", level: 2 },
  { word: "VILLAGE", emoji: "🏘️", gujarati: "ગામડું", level: 2 },
  { word: "ENGLISH", emoji: "🇬🇧", gujarati: "અંગ્રેજી", level: 3 },
  { word: "TEACHER", emoji: "👩‍🏫", gujarati: "શિક્ષક", level: 3 },
  { word: "COMPUTER", emoji: "💻", gujarati: "કમ્પ્યુટર", level: 3 }
];

export const SPEED_WORDS = [
  { word: "BRAVE", meaning: "નીડર (બહાદુર)", options: ["ડરપોક", "નીડર (બહાદુર)", "દયાવાળું", "ક્રૂર"] },
  { word: "QUICK", meaning: "ઝડપી", options: ["ધીમું", "ઝડપી", "ભારે", "હલકું"] },
  { word: "HONEST", meaning: "પ્રમાણિક", options: ["ગરીબ", "લુચ્ચું", "પ્રમાણિક", "ભણેલું"] },
  { word: "HUNGRY", meaning: "ભૂખ્યું", options: ["તરસ્યું", "ભૂખ્યું", "સુખી", "દુઃખી"] },
  { word: "BEAUTIFUL", meaning: "સુંદર", options: ["કદરૂપું", "ગંદુ", "સુંદર", "મોટું"] },
  { word: "STRONG", meaning: "મજબૂત", options: ["નબળું", "બીમાર", "મજબૂત", "નાનું"] },
  { word: "HAPPY", meaning: "ખુશ (સુખી)", options: ["નારાજ", "ઉદાસ", "ખુશ (સુખી)", "શાંત"] },
  { word: "CLEAN", meaning: "સ્વચ્છ", options: ["ગંદુ", "સ્વચ્છ", "નવું", "જૂનું"] },
  { word: "ALERT", meaning: "સાવધાન", options: ["આળસુ", "સાવધાન", "ઊંઘમાં", "મૂર્ખ"] }
];

export const SENTENCE_BUILDER_DATA = [
  {
    id: "sb1",
    jumbled: ["going", "I", "school", "to", "am"],
    correct: "I am going to school",
    gujaratiMeaning: "હું શાળાએ જઈ રહ્યો છું.",
    grammarTip: "વાક્ય રચના: કર્તા (I) + to-be ક્રિયાપદ (am) + વર્તમાન કૃદંત (going) + પ્રિપોઝિશન/કર્મ (to school)."
  },
  {
    id: "sb2",
    jumbled: ["like", "apples", "I", "eating"],
    correct: "I like eating apples",
    gujaratiMeaning: "મને સફરજન ખાવા ગમે છે.",
    grammarTip: "'like' ક્રિયાપદ પછી સામાન્ય રીતે Gerund (-ing વાળું નામ) 'eating' વપરાય છે."
  },
  {
    id: "sb3",
    jumbled: ["is", "doctor", "father", "a", "my"],
    correct: "My father is a doctor",
    gujaratiMeaning: "મારા પિતા એક ડોક્ટર છે.",
    grammarTip: "સંબંધક વિશેષણ (My father) + એકવચન ક્રિયાપદ (is) + આર્ટિકલ અને વ્યવસાય (a doctor)."
  },
  {
    id: "sb4",
    jumbled: ["live", "we", "in", "Gujarat"],
    correct: "We live in Gujarat",
    gujaratiMeaning: "અમે ગુજરાતમાં રહીએ છીએ.",
    grammarTip: "ચોક્કસ ભૌગોલિક રાજ્ય કે દેશના નામની આગળ અંદર રહેવા માટે 'in' પ્રિપોઝિશન વપરાય છે."
  }
];

export const DAILY_CONVERSATIONS = [
  {
    situation: "દવાખાનામાં (At the Doctor)",
    dialogues: [
      {
        id: "d1",
        speaker: "Doctor",
        prompt: "Doctor: What is the problem? What ___ to you?",
        text: "What is the problem? What happened to you?",
        blankWord: "happened",
        options: ["happen", "happened", "happening", "happens"],
        gujaratiHint: "ડોક્ટર: શું તકલીફ છે? તમને શું થયું છે?",
        explanation: "ભૂતકાળની ઘટના પૂછવા માટે ક્રિયાપદનું ભૂતકાળનું રૂપ 'happened' યોગ્ય છે."
      },
      {
        id: "d2",
        speaker: "Patient",
        prompt: "Patient: I have a ___ since yesterday.",
        text: "I have a headache since yesterday.",
        blankWord: "headache",
        options: ["painful", "headache", "aching", "hurt"],
        gujaratiHint: "દર્દી: મને ગઈકાલથી માથું દુખે છે.",
        explanation: "નામ તરીકે 'headache' (માથાનો દુખાવો) વપરાય છે."
      },
      {
        id: "d3",
        speaker: "Doctor",
        prompt: "Doctor: Take this medicine ___ a day.",
        text: "Take this medicine twice a day.",
        blankWord: "twice",
        options: ["two", "twice", "double", "second"],
        gujaratiHint: "ડોક્ટર: આ દવા દિવસમાં બે વાર લેજો.",
        explanation: "દિવસમાં કેટલી વાર તે દર્શાવવા માટે 'twice' (બે વાર) નો ઉપયોગ થાય છે."
      }
    ]
  },
  {
    situation: "દુકાનદાર સાથે (At the Shop)",
    dialogues: [
      {
        id: "d4",
        speaker: "Customer",
        prompt: "Customer: How ___ is this shirt?",
        text: "How much is this shirt?",
        blankWord: "much",
        options: ["many", "much", "cost", "price"],
        gujaratiHint: "ગ્રાહક: આ શર્ટની કિંમત કેટલી છે?",
        explanation: "કિંમત પૂછવા માટે સામાન્ય રીતે 'How much' નો પ્રયોગ થાય છે."
      },
      {
        id: "d5",
        speaker: "Shopkeeper",
        prompt: "Shopkeeper: It ___ five hundred rupees.",
        text: "It costs five hundred rupees.",
        blankWord: "costs",
        options: ["cost", "costs", "costing", "price"],
        gujaratiHint: "દુકાનદાર: તેની કિંમત ૫૦૦ રૂપિયા છે.",
        explanation: "It (ત્રીજો પુરુષ એકવચન) કર્તા હોવાથી ક્રિયાપદને 's' લાગીને 'costs' બને છે."
      }
    ]
  }
];
