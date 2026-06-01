import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Web Audio API Sound Synthesizer for Immersive Quiz Experience
const playSound = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'tick') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'correct') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.setValueAtTime(110, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'win') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.15);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.3);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.45);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    }
  } catch (e) {
    // Audio Context not allowed or supported
  }
};

// Rich Question Bank across 10 Categories and Age Groups
const ALL_QUESTIONS = [
  // History (ઇતિહાસ)
  {
    id: "q1", category: "ઇતિહાસ", difficulty: "easy", ageGroup: ["kids", "youth", "adult", "elder"],
    question: "ગુજરાત રાજ્યની સ્થાપના ક્યારે થઈ હતી?",
    options: ["૧ મે ૧૯૬૦", "૧૫ ઓગસ્ટ ૧૯૪૭", "૨૬ જાન્યુઆરી ૧૯૫૦", "૧ નવેમ્બર ૧૯૬૬"],
    correct: "૧ મે ૧૯૬૦",
    explanation: "બૃહદ મુંબઈ રાજ્યમાંથી ૧ મે ૧૯૬૦ના રોજ અલગ ગુજરાત રાજ્યની સ્થાપના રવિશંકર મહારાજના હસ્તે થઈ હતી."
  },
  {
    id: "q2", category: "ઇતિહાસ", difficulty: "medium", ageGroup: ["youth", "adult", "elder"],
    question: "ઐતિહાસિક સોમનાથ મંદિર પર મહમદ ગઝનવીએ ક્યા વર્ષમાં ચડાઈ કરી હતી?",
    options: ["ઇ.સ. ૧૦૨૬", "ઇ.સ. ૧૧૯૨", "ઇ.સ. ૧૫૨૬", "ઇ.સ. ૧૭૬૧"],
    correct: "ઇ.સ. ૧૦૨૬",
    explanation: "ઇ.સ. ૧૦૨૬માં મહમદ ગઝનવીએ સોમનાથ પર આક્રમણ કરી અપાર સંપત્તિ લૂંટી હતી."
  },
  {
    id: "q3", category: "ઇતિહાસ", difficulty: "hard", ageGroup: ["adult", "elder"],
    question: "સિંધુ ખીણની સંસ્કૃતિનું સુપ્રસિદ્ધ બંદર 'લોથલ' ક્યા જિલ્લામાં આવેલું છે?",
    options: ["અમદાવાદ", "કચ્છ", "જામનગર", "ભરૂચ"],
    correct: "અમદાવાદ",
    explanation: "લોથલ અમદાવાદ જિલ્લાના ધોળકા તાલુકામાં ભોગાવો નદીના કિનારે આવેલું છે."
  },
  // Geography (ભૂગોળ)
  {
    id: "q4", category: "ભૂગોળ", difficulty: "easy", ageGroup: ["kids", "youth", "adult", "elder"],
    question: "ગુજરાતની સૌથી મોટી નદી કઈ છે?",
    options: ["નર્મદા", "સાબરમતી", "તાપી", "મહી"],
    correct: "નર્મદા",
    explanation: "નર્મદા ગુજરાતની સૌથી મોટી અને પવિત્ર નદી છે, જેને 'ગુજરાતની જીવાદોરી' પણ કહેવાય છે."
  },
  {
    id: "q5", category: "ભૂગોળ", difficulty: "medium", ageGroup: ["youth", "adult", "elder"],
    question: "કચ્છના નાના રણમાં ક્યા દુર્લભ વન્યજીવનું અભયારણ્ય આવેલું છે?",
    options: ["ઘુડખર (જંગલી ગધેડા)", "સિંહ", "કાળિયાર", "રીંછ"],
    correct: "ઘુડખર (જંગલી ગધેડા)",
    explanation: "કચ્છના નાના રણમાં વિશ્વનું એકમાત્ર જંગલી ગધેડા (ઘુડખર) નું અભયારણ્ય આવેલું છે."
  },
  {
    id: "q6", category: "ભૂગોળ", difficulty: "hard", ageGroup: ["adult", "elder"],
    question: "ગુજરાતનો સૌથી ઊંચો પર્વત ક્યો છે અને તેનું સૌથી ઊંચું શિખર ક્યું છે?",
    options: ["ગિરનાર (ગોરખનાથ)", "પાવાગઢ", "ચોટીલા", "સાપુતારા"],
    correct: "ગિરનાર (ગોરખનાથ)",
    explanation: "જૂનાગઢમાં આવેલ ગિરનાર પર્વત અને તેનું ગોરખનાથ શિખર (૧૧૧૭ મીટર) ગુજરાતનું સૌથી ઊંચું શિખર છે."
  },
  // Culture (સંસ્કૃતિ)
  {
    id: "q7", category: "સંસ્કૃતિ", difficulty: "easy", ageGroup: ["kids", "youth", "adult", "elder"],
    question: "ગુજરાતનો ક્યો તહેવાર વિશ્વનો સૌથી લાંબો નૃત્ય મહોત્સવ ગણાય છે?",
    options: ["નવરાત્રી", "ઉત્તરાયણ", "દિવાળી", "જન્માષ્ટમી"],
    correct: "નવરાત્રી",
    explanation: "નવરાત્રી સળંગ ૯ રાત્રિઓ સુધી ચાલતો વિશ્વનો સૌથી મોટો અને લાંબો લોકનૃત્ય મહોત્સવ છે."
  },
  {
    id: "q8", category: "સંસ્કૃતિ", difficulty: "medium", ageGroup: ["youth", "adult", "elder"],
    question: "પાટણની કઈ કલાત્મક સાડી વિશ્વભરમાં તેના વણાટકામ માટે વિખ્યાત છે?",
    options: ["પટોળા", "બાંધણી", "તનછોઈ", "ઘરચોળું"],
    correct: "પટોળા",
    explanation: "'પાટણના પટોળા' તેની બેવડ ઇક્ત વણાટ પદ્ધતિ અને અદ્ભુત રંગો માટે સેંકડો વર્ષોથી જગજાહેર છે."
  },
  {
    id: "q9", category: "સંસ્કૃતિ", difficulty: "hard", ageGroup: ["adult", "elder"],
    question: "સુપ્રસિદ્ધ 'તરણેતરનો મેળો' ક્યા જિલ્લામાં અને ક્યા ભગવાનના મંદિરે ભરાય છે?",
    options: ["સુરેન્દ્રનગર (ત્રિનેત્રેશ્વર મહાદેવ)", "જૂનાગઢ (ભવનાથ)", "ડાંગ (આહવા)", "બનાસકાંઠા (અંબાજી)"],
    correct: "સુરેન્દ્રનગર (ત્રિનેત્રેશ્વર મહાદેવ)",
    explanation: "સુરેન્દ્રનગર જિલ્લાના થાનગઢ પાસે ત્રિનેત્રેશ્વર મહાદેવના સાનિધ્યમાં ભાદરવા સુદ ચોથથી છઠ સુધી તરણેતરનો મેળો ભરાય છે."
  },
  // Religion (ધર્મ)
  {
    id: "q10", category: "ધર્મ", difficulty: "easy", ageGroup: ["kids", "youth", "adult", "elder"],
    question: "હિન્દુ ધર્મના ૪ પવિત્ર ધામોમાંનું એક 'દ્વારકાધીશ મંદિર' કઈ નદીના સંગમ પર આવેલું છે?",
    options: ["ગોમતી", "સરસ્વતી", "સિંધુ", "નર્મદા"],
    correct: "ગોમતી",
    explanation: "દ્વારકામાં આવેલ જગતમંદિર ગોમતી નદી અને અરબી સમુદ્રના સંગમ તીર્થે આવેલું છે."
  },
  {
    id: "q11", category: "ધર્મ", difficulty: "medium", ageGroup: ["youth", "adult", "elder"],
    question: "ભારતના ૧૨ જ્યોતિર્લિંગોમાંનું સૌપ્રથમ જ્યોતિર્લિંગ ક્યું છે?",
    options: ["સોમનાથ", "મહાકાલેશ્વર", "કાશી વિશ્વનાથ", "ત્ર્યંબકેશ્વર"],
    correct: "સોમનાથ",
    explanation: "પ્રભાસ પાટણ ખાતે બિરાજમાન ભગવાન સોમનાથ એ પૃથ્વી પરના ૧૨ જ્યોતિર્લિંગો પૈકીનું પ્રથમ જ્યોતિર્લિંગ છે."
  },
  {
    id: "q12", category: "ધર્મ", difficulty: "hard", ageGroup: ["adult", "elder"],
    question: "જૈન ધર્મનું અતિ પવિત્ર તીર્થધામ 'પાલીતાણા' ક્યા પર્વત પર આવેલું છે અને ત્યાં કેટલા મંદિરો છે?",
    options: ["શેત્રુંજય (૮૬૩ મંદિરો)", "ગિરનાર (૫૦૦ મંદિરો)", "તારંગા (૩૦૦ મંદિરો)", "પાવાગઢ (૨૫૦ મંદિરો)"],
    correct: "શેત્રુંજય (૮૬૩ મંદિરો)",
    explanation: "ભાવનગર જિલ્લાના પાલીતાણામાં શેત્રુંજય પર્વત પર ૮૬૩ જેટલા જૈન દેરાસરો આવેલા છે."
  },
  // Great Personalities (મહાનુભાવ)
  {
    id: "q13", category: "મહાનુભાવ", difficulty: "easy", ageGroup: ["kids", "youth", "adult", "elder"],
    question: "મહાત્મા ગાંધીનો જન્મ ક્યાં અને ક્યારે થયો હતો?",
    options: ["૨ ઓક્ટોબર ૧૮૬૯, પોરબંદર", "૩૦ જાન્યુઆરી ૧૯૪૮, અમદાવાદ", "૧૫ ઓગસ્ટ ૧૯૪૭, રાજકોટ", "૧ મે ૧૯૬૦, સુરત"],
    correct: "૨ ઓક્ટોબર ૧૮૬૯, પોરબંદર",
    explanation: "રાષ્ટ્રપિતા મહાત્મા ગાંધીનો જન્મ પોરબંદરમાં કીર્તિ મંદિર (સુદામાપુરી) ખાતે થયો હતો."
  },
  {
    id: "q14", category: "મહાનુભાવ", difficulty: "medium", ageGroup: ["youth", "adult", "elder"],
    question: "સરદાર વલ્લભભાઈ પટેલને 'સરદાર' નું બિરુદ ક્યા સત્યાગ્રહની સફળતા પછી મળ્યું?",
    options: ["બારડોલી સત્યાગ્રહ", "દાંડી કૂચ", "ખેડા સત્યાગ્રહ", "ચંપારણ સત્યાગ્રહ"],
    correct: "બારડોલી સત્યાગ્રહ",
    explanation: "૧૯૨૮ના બારડોલી સત્યાગ્રહમાં ખેડૂતોને અપાવેલી ઐતિહાસિક જીત બદલ બારડોલીની મહિલાઓએ તેમને 'સરદાર' કહ્યા."
  },
  {
    id: "q15", category: "મહાનુભાવ", difficulty: "hard", ageGroup: ["youth", "adult", "elder"],
    question: "ભારતના અવકાશ કાર્યક્રમના પિતા અને ઇસરો (ISRO) ના સ્થાપક ગણાતા ગુજરાતી વૈજ્ઞાનિક કોણ હતા?",
    options: ["ડૉ. વિક્રમ સારાભાઈ", "ડૉ. હોમી ભાભા", "ડૉ. એ. પી. જે. અબ્દુલ કલામ", "સી. વી. રામન"],
    correct: "ડૉ. વિક્રમ સારાભાઈ",
    explanation: "અમદાવાદમાં જન્મેલા ડૉ. વિક્રમ સારાભાઈએ ભારતીય અવકાશ સંશોધન સંસ્થા (ISRO) અને IIM અમદાવાદની સ્થાપના કરી હતી."
  },
  // Current Affairs (Current Affairs)
  {
    id: "q16", category: "Current Affairs", difficulty: "medium", ageGroup: ["youth", "adult", "elder"],
    question: "વડાપ્રધાન નરેન્દ્ર મોદીએ ઉદ્ઘાટન કરેલ કેવડિયા સ્થિત વિશ્વની સૌથી ઊંચી પ્રતિમા 'સ્ટેચ્યુ ઓફ યુનિટી' ની ઊંચાઈ કેટલી છે?",
    options: ["૧૮૨ મીટર", "૧૫૦ મીટર", "૨૦૦ મીટર", "૨૫૦ મીટર"],
    correct: "૧૮૨ મીટર",
    explanation: "ગુજરાત વિધાનસભાની ૧૮૨ બેઠકોના પ્રતીક રૂપે સરદાર પટેલની આ પ્રતિમાની ઊંચાઈ ૧૮૨ મીટર રાખવામાં આવી છે."
  },
  {
    id: "q17", category: "Current Affairs", difficulty: "medium", ageGroup: ["youth", "adult", "elder"],
    question: "ગુજરાતનું ક્યું શહેર વિશ્વનું સૌથી મોટું ડાયમંડ બુર્સ (Diamond Bourse) અને કટિંગ સેન્ટર બન્યું છે?",
    options: ["સુરત", "નવસારી", "રાજકોટ", "ભાવનગર"],
    correct: "સુરત",
    explanation: "સુરત ડાયમંડ બુર્સ (SDB) હવે વિશ્વની સૌથી મોટી ઇન્ટરકનેક્ટેડ ઓફિસ બિલ્ડિંગ છે, જ્યાં વિશ્વના ૯૦% હીરા પોલિશ થાય છે."
  },
  // Literature (ભાષા સાહિત્ય)
  {
    id: "q18", category: "ભાષા સાહિત્ય", difficulty: "easy", ageGroup: ["kids", "youth", "adult", "elder"],
    question: "ગુજરાતી ભાષાના આદિકવિ કોને ગણવામાં આવે છે?",
    options: ["નરસિંહ મહેતા", "મીરાંબાઈ", "પ્રેમાનંદ", "અખો"],
    correct: "નરસિંહ મહેતા",
    explanation: "ભક્ત કવિ નરસિંહ મહેતાને ગુજરાતી સાહિત્યના આદિકવિ ગણવામાં આવે છે."
  },
  {
    id: "q19", category: "ભાષા સાહિત્ય", difficulty: "medium", ageGroup: ["youth", "adult", "elder"],
    question: "'જ્યાં જ્યાં વસે એક ગુજરાતી, ત્યાં ત્યાં સદાકાળ ગુજરાત' - આ અમર કાવ્યપંક્તિ ક્યા કવિની છે?",
    options: ["કવિ ખબરદાર", "ઝવેરચંદ મેઘાણી", "ઉમાશંકર જોશી", "નર્મદ"],
    correct: "કવિ ખબરદાર",
    explanation: "અરદેશર ફરામજી ખબરદાર (અદલ) ની આ પંક્તિઓ ગુજરાતી અસ્મિતાનો પર્યાય બની ચૂકી છે."
  },
  {
    id: "q20", category: "ભાષા સાહિત્ય", difficulty: "hard", ageGroup: ["adult", "elder"],
    question: "ગુજરાતી સાહિત્યનો સર્વોચ્ચ પુરસ્કાર 'જ્ઞાનપીઠ એવોર્ડ' સૌપ્રથમ ક્યા સર્જકને અને કઈ કૃતિ માટે મળ્યો હતો?",
    options: ["ઉમાશંકર જોશી ('નિશીથ')", "પન્નાલાલ પટેલ ('માનવીની ભવાઈ')", "રાજેન્દ્ર શાહ ('ધ્વનિ')", "રઘુવીર ચૌધરી ('અમૃતા')"],
    correct: "ઉમાશંકર જોશી ('નિશીથ')",
    explanation: "વર્ષ ૧૯૬૭માં કવિ ઉમાશંકર જોશીને તેમના કાવ્યસંગ્રહ 'નિશીથ' માટે આ સર્વોચ્ચ એવોર્ડ મળ્યો હતો."
  },
  // Science (વિજ્ઞાન)
  {
    id: "q21", category: "વિજ્ઞાન", difficulty: "easy", ageGroup: ["kids", "youth", "adult", "elder"],
    question: "સૂર્યમંડળનો સૌથી મોટો ગ્રહ ક્યો છે?",
    options: ["ગુરુ (Jupiter)", "શનિ", "પૃથ્વી", "મંગળ"],
    correct: "ગુરુ (Jupiter)",
    explanation: "ગુરુ ગ્રહ સૂર્યમંડળનો સૌથી મોટો અને વજનદાર ગ્રહ છે."
  },
  {
    id: "q22", category: "વિજ્ઞાન", difficulty: "medium", ageGroup: ["kids", "youth", "adult", "elder"],
    question: "માનવ શરીરમાં લોહી શુદ્ધ કરવાનું કામ ક્યું અંગ કરે છે?",
    options: ["કિડની (મૂત્રપિંડ)", "હૃદય", "ફેફસાં", "જઠર"],
    correct: "કિડની (મૂત્રપિંડ)",
    explanation: "કિડની લોહીમાંથી કચરો અને વધારાનું પાણી ફિલ્ટર કરીને મૂત્ર દ્વારા બહાર કાઢે છે."
  },
  // Sports (રમત-ગમત)
  {
    id: "q23", category: "રમત-ગમત", difficulty: "easy", ageGroup: ["kids", "youth", "adult", "elder"],
    question: "વિશ્વનું સૌથી મોટું ક્રિકેટ સ્ટેડિયમ 'નરેન્દ્ર મોદી સ્ટેડિયમ' ક્યાં આવેલું છે?",
    options: ["મોટેરા, અમદાવાદ", "વાનખેડે, મુંબઈ", "ઇડન ગાર્ડન્સ, કોલકાતા", "મેલબોર્ન, ઓસ્ટ્રેલિયા"],
    correct: "મોટેરા, અમદાવાદ",
    explanation: "અમદાવાદના મોટેરામાં ૧,૩૨,૦૦૦ પ્રેક્ષકોની ક્ષમતા ધરાવતું વિશ્વનું સૌથી મોટું ક્રિકેટ સ્ટેડિયમ છે."
  },
  {
    id: "q24", category: "રમત-ગમત", difficulty: "medium", ageGroup: ["youth", "adult", "elder"],
    question: "ગુજરાતની કઈ દીકરીએ ટેબલ ટેનિસ અને કોમનવેલ્થ ગેમ્સમાં ગોલ્ડ મેડલ જીતી દેશનું ગૌરવ વધાર્યું છે?",
    options: ["ભાવિના પટેલ / હરમીત દેસાઈ", "પી. વી. સિંધુ", "સાઇના નેહવાલ", "મેરી કોમ"],
    correct: "ભાવિના પટેલ / હરમીત દેસાઈ",
    explanation: "મહેસાણાની ભાવિના પટેલે પેરાલિમ્પિક્સમાં અને સુરતના હરમીત દેસાઈએ કોમનવેલ્થમાં મેડલ જીત્યા છે."
  },
  // Proverbs (ગુજરાતી કહેવત)
  {
    id: "q25", category: "ગુજરાતી કહેવત", difficulty: "easy", ageGroup: ["kids", "youth", "adult", "elder"],
    question: "કહેવત પૂર્ણ કરો: 'ટીંપે ટીંપે સરોવર ભરાય, ને કાંકરે કાંકરે...'",
    options: ["પાળ બંધાય", "ઘર ચણાય", "નદી વહે", "પહાડ બને"],
    correct: "પાળ બંધાય",
    explanation: "નાની નાની બચત કે મહેનતથી ભવિષ્યમાં મોટું કામ સિદ્ધ થાય છે."
  },
  {
    id: "q26", category: "ગુજરાતી કહેવત", difficulty: "medium", ageGroup: ["youth", "adult", "elder"],
    question: "કહેવતનો અર્થ જણાવો: 'ઉતાવળે આંબા ન પાકે'",
    options: ["કોઈ પણ મોટું કામ ધીરજ રાખવાથી જ થાય", "કેરી પકવવા ગરમી જોઈએ", "આંબો બહુ મોટો વૃક્ષ છે", "ઉતાવળ કરવાથી કામ ઝડપથી પતે"],
    correct: "કોઈ પણ મોટું કામ ધીરજ રાખવાથી જ થાય",
    explanation: "જેમ વૃક્ષ પર ફળ આવતા સમય લાગે છે, તેમ ધીરજ વિના ઉત્તમ પરિણામ મળતું નથી."
  },
  {
    id: "q27", category: "ગુજરાતી કહેવત", difficulty: "hard", ageGroup: ["adult", "elder"],
    question: "કહેવતનો સાચો અર્થ શોધો: 'નાચવું નહિ ને આંગણું વાંકુ'",
    options: ["કામ ન કરવું હોય ત્યારે બહાના કાઢવા", "આંગણું સાફ ન હોવું", "નાચતા ન આવડવું", "પગમાં દર્દ હોવું"],
    correct: "કામ ન કરવું હોય ત્યારે બહાના કાઢવા",
    explanation: "પોતાનામાં આવડત ન હોય કે ઈચ્છા ન હોય ત્યારે સંજોગો કે સાધનોનો દોષ કાઢવો."
  },
  {
    id: "q28", category: "ઇતિહાસ", difficulty: "medium", ageGroup: ["youth", "adult", "elder"],
    question: "દાંડી કૂચની શરૂઆત સાબરમતી આશ્રમથી કઈ તારીખે થઈ હતી?",
    options: ["૧૨ માર્ચ ૧૯૩૦", "૬ એપ્રિલ ૧૯૩૦", "૧૫ ઓગસ્ટ ૧૯૪૭", "૨૬ જાન્યુઆરી ૧૯૩૦"],
    correct: "૧૨ માર્ચ ૧૯૩૦",
    explanation: "૧૨ માર્ચ ૧૯૩૦ના રોજ ગાંધીજી અને ૭૮ સાથીઓએ મીઠાના અન્યાયી કાયદા સામે ઐતિહાસિક પદયાત્રા શરૂ કરી હતી."
  },
  {
    id: "q29", category: "સંસ્કૃતિ", difficulty: "easy", ageGroup: ["kids", "youth", "adult", "elder"],
    question: "ગુજરાતમાં ક્યા ભગવાનના મંદિરે દિવાળી પછી અનકૂટ (છપ્પન ભોગ) ધરાવવાની ભવ્ય પરંપરા છે?",
    options: ["શ્રીનાથજી / સ્વામિનારાયણ / વૈષ્ણવ મંદિરો", "મહાદેવ", "હનુમાનજી", "શનિદેવ"],
    correct: "શ્રીનાથજી / સ્વામિનારાયણ / વૈષ્ણવ મંદિરો",
    explanation: "નૂતન વર્ષ અને ગોવર્ધન પૂજાના દિવસે મંદિરોમાં ભગવાનને ૫૬ કે તેથી વધુ પકવાનોનો અન્નકૂટ ધરાવાય છે."
  },
  {
    id: "q30", category: "ભૂગોળ", difficulty: "medium", ageGroup: ["youth", "adult", "elder"],
    question: "ગુજરાતનો દરિયાકિનારો આશરે કેટલા કિલોમીટર લાંબો છે જે દેશમાં સૌથી લાંબો છે?",
    options: ["૧૬૦૦ કિમી (૯૯૦ માઈલ)", "૧૨૦૦ કિમી", "૨૦૦૦ કિમી", "૮૦૦ કિમી"],
    correct: "૧૬૦૦ કિમી (૯૯૦ માઈલ)",
    explanation: "ગુજરાતને ભારતનો સૌથી લાંબો ૧૬૦૦ કિલોમીટરનો સાગરકાંઠો મળ્યો છે."
  }
];

// Leaderboards Mock Data
const MOCK_LEADERBOARD = {
  daily: [
    { rank: 1, name: "રાહુલભાઈ મહેતા", score: 1250, streak: 5, avatar: "https://i.pravatar.cc/150?u=rahul" },
    { rank: 2, name: "પ્રીતિબેન શાહ", score: 1180, streak: 12, avatar: "https://i.pravatar.cc/150?u=priti" },
    { rank: 3, name: "અનિલભાઈ પટેલ", score: 1050, streak: 7, avatar: "https://i.pravatar.cc/150?u=anil" },
    { rank: 4, name: "હર્ષિલ દેસાઈ", score: 980, streak: 3, avatar: "https://i.pravatar.cc/150?u=harshil" },
    { rank: 5, name: "દર્શનાબેન રાવલ", score: 920, streak: 9, avatar: "https://i.pravatar.cc/150?u=darshana" },
  ],
  weekly: [
    { rank: 1, name: "જયેશભાઈ ત્રિવેદી", score: 4850, streak: 15, avatar: "https://i.pravatar.cc/150?u=jayesh" },
    { rank: 2, name: "સ્વાતિબેન પારેખ", score: 4620, streak: 21, avatar: "https://i.pravatar.cc/150?u=swati" },
    { rank: 3, name: "ચિરાગ જોશી", score: 4300, streak: 18, avatar: "https://i.pravatar.cc/150?u=chirag" },
    { rank: 4, name: "રાહુલભાઈ મહેતા", score: 4150, streak: 5, avatar: "https://i.pravatar.cc/150?u=rahul" },
    { rank: 5, name: "સંજયભાઈ સોલંકી", score: 3900, streak: 11, avatar: "https://i.pravatar.cc/150?u=sanjay" },
  ],
  monthly: [
    { rank: 1, name: "સ્વાતિબેન પારેખ", score: 18450, streak: 21, avatar: "https://i.pravatar.cc/150?u=swati" },
    { rank: 2, name: "જયેશભાઈ ત્રિવેદી", score: 17900, streak: 15, avatar: "https://i.pravatar.cc/150?u=jayesh" },
    { rank: 3, name: "નરેશભાઈ અમીન", score: 16800, streak: 30, avatar: "https://i.pravatar.cc/150?u=naresh" },
  ],
  allTime: [
    { rank: 1, name: "નરેશભાઈ અમીન (Grandmaster)", score: 95400, streak: 30, avatar: "https://i.pravatar.cc/150?u=naresh" },
    { rank: 2, name: "સ્વાતિબેન પારેખ", score: 88200, streak: 21, avatar: "https://i.pravatar.cc/150?u=swati" },
    { rank: 3, name: "ડૉ. કેયુર ભટ્ટ", score: 84000, streak: 45, avatar: "https://i.pravatar.cc/150?u=keyur" },
  ]
};

const KbcQuizGame = ({ initialMode = 'daily', onBack }) => {

  // App Profile State
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('sanskari_kbc_profile');
    if (saved) return JSON.parse(saved);
    return { name: "", age: 25, ageGroup: "adult", photo: "https://i.pravatar.cc/150?img=12", streak: 1 };
  });
  const [isRegistered, setIsRegistered] = useState(() => !!localStorage.getItem('sanskari_kbc_profile'));

  // Screen View: 'register', 'home', 'quiz', 'result', 'leaderboard', 'challenge_setup'
  // Skip home and go straight to quiz based on initialMode
  const [screen, setScreen] = useState('quiz');

  // Quiz Setup State
  const [quizMode, setQuizMode] = useState(initialMode); // daily (10Q), weekly (25Q), monthly (50Q), challenge
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef(null);

  // Lifelines State
  const [lifelines, setLifelines] = useState({
    fiftyFifty: true,
    friendHelp: true,
    changeQuestion: true,
  });
  const [activeLifelineMsg, setActiveLifelineMsg] = useState("");
  const [disabledOptions, setDisabledOptions] = useState([]);
  const [friendHelpCountdown, setFriendHelpCountdown] = useState(0);

  // Leaderboard Tab
  const [leaderboardTab, setLeaderboardTab] = useState('daily');

  // Challenge Mode State
  const [friendName, setFriendName] = useState("");
  const [challengeLink, setChallengeLink] = useState("");

  // Registration Auto Age Group
  const handleRegisterChange = (field, val) => {
    let newProfile = { ...profile, [field]: val };
    if (field === 'age') {
      const ageNum = parseInt(val) || 0;
      let group = 'adult';
      if (ageNum >= 6 && ageNum <= 12) group = 'kids';
      else if (ageNum >= 13 && ageNum <= 25) group = 'youth';
      else if (ageNum >= 26 && ageNum <= 50) group = 'adult';
      else if (ageNum > 50) group = 'elder';
      newProfile.ageGroup = group;
    }
    setProfile(newProfile);
  };

  const saveProfile = (e) => {
    e.preventDefault();
    if (!profile.name) return;
    localStorage.setItem('sanskari_kbc_profile', JSON.stringify(profile));
    setIsRegistered(true);
    setScreen('home');
  };

  // Start Quiz (auto-started on mount if registered)
  const startQuiz = (mode) => {
    setQuizMode(mode);
    let count = 10;
    if (mode === 'weekly') count = 25;
    if (mode === 'monthly') count = 50;

    // Filter by user's age group
    let pool = ALL_QUESTIONS.filter(q => q.ageGroup.includes(profile.ageGroup));
    if (pool.length < count) pool = ALL_QUESTIONS; // Fallback if limited pool

    // Shuffle and pick
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, count);

    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerCorrect(null);
    setScore(0);
    setCorrectCount(0);
    setDisabledOptions([]);
    setActiveLifelineMsg("");
    setLifelines({ fiftyFifty: true, friendHelp: true, changeQuestion: true });
    setTimer(30);
    setIsTimerRunning(true);
    setScreen('quiz');
    playSound('tick');
  };

  useEffect(() => {
    if (isRegistered) {
      startQuiz(initialMode);
    } else {
      setScreen('register');
    }
  }, [initialMode, isRegistered]);

  // Timer Countdown Effect
  useEffect(() => {
    if (!isTimerRunning) return;

    timerIntervalRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          handleTimeUp();
          return 0;
        }
        playSound('tick'); // play sound on every second
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerIntervalRef.current);
  }, [isTimerRunning, currentIndex]);

  const handleTimeUp = () => {
    setIsTimerRunning(false);
    playSound('wrong');
    setIsAnswerCorrect(false);
    setSelectedOption("TIME_UP");
    setTimeout(() => nextQuestion(), 2500);
  };

  // Handle Option Selection
  const handleSelectOption = (opt) => {
    if (!isTimerRunning || selectedOption) return;

    clearInterval(timerIntervalRef.current);
    setIsTimerRunning(false);
    setSelectedOption(opt);

    const currentQ = questions[currentIndex];
    const correct = opt === currentQ.correct;
    setIsAnswerCorrect(correct);

    if (correct) {
      playSound('correct');
      // Calculate Points
      let pts = 100;
      if (timer >= 20) pts += 50; // fast bonus
      setScore(prev => prev + pts);
      setCorrectCount(prev => prev + 1);
    } else {
      playSound('wrong');
    }

    setTimeout(() => nextQuestion(), 3500);
  };

  const nextQuestion = () => {
    setDisabledOptions([]);
    setActiveLifelineMsg("");
    setSelectedOption(null);
    setIsAnswerCorrect(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setTimer(30);
      setIsTimerRunning(true);
    } else {
      // Quiz Finished!
      playSound('win');
      // Update streak and points
      let finalProfile = { ...profile };
      finalProfile.streak = (finalProfile.streak || 1) + 1;
      setProfile(finalProfile);
      localStorage.setItem('sanskari_kbc_profile', JSON.stringify(finalProfile));
      setScreen('result');
    }
  };

  // Lifelines Triggers
  const triggerFiftyFifty = () => {
    if (!lifelines.fiftyFifty || !isTimerRunning || selectedOption) return;
    const currentQ = questions[currentIndex];
    const wrongOptions = currentQ.options.filter(o => o !== currentQ.correct);
    const toDisable = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 2);

    setDisabledOptions(toDisable);
    setLifelines(prev => ({ ...prev, fiftyFifty: false }));
    setActiveLifelineMsg("૫૦-૫૦ લાઈફલાઈન સક્રિય: ૨ ખોટા વિકલ્પો હટાવી દેવાયા છે!");
  };

  const triggerFriendHelp = () => {
    if (!lifelines.friendHelp || !isTimerRunning || selectedOption) return;
    setIsTimerRunning(false); // pause timer for friend help
    setLifelines(prev => ({ ...prev, friendHelp: false }));
    setFriendHelpCountdown(60);

    const currentQ = questions[currentIndex];
    const text = encodeURIComponent(`કેમ છો! હું ગુજરાતી ક્વિઝ રમી રહ્યો છું અને મને આ પ્રશ્નમાં તમારી મદદ જોઈએ છે:\n\nપ્રશ્ન: ${currentQ.question}\nવિકલ્પો: ${currentQ.options.join(', ')}\n\nકૃપા કરીને સાચો જવાબ આપો!`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');

    setActiveLifelineMsg("WhatsApp પર પ્રશ્ન શેર કર્યો. મિત્રના જવાબની ૬૦ સેકન્ડ રાહ જુઓ...");

    const countdownInterval = setInterval(() => {
      setFriendHelpCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setIsTimerRunning(true); // resume timer
          setActiveLifelineMsg("સમય સમાપ્ત! હવે તમારો જવાબ પસંદ કરો.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const triggerChangeQuestion = () => {
    if (!lifelines.changeQuestion || !isTimerRunning || selectedOption) return;
    setLifelines(prev => ({ ...prev, changeQuestion: false }));

    const pool = ALL_QUESTIONS.filter(q => q.ageGroup.includes(profile.ageGroup) && !questions.some(eq => eq.id === q.id));
    if (pool.length > 0) {
      const newQ = pool[Math.floor(Math.random() * pool.length)];
      let copy = [...questions];
      copy[currentIndex] = newQ;
      setQuestions(copy);
      setTimer(30);
      setActiveLifelineMsg("પ્રશ્ન બદલાઈ ગયો છે! નવો પ્રશ્ન તમારી સ્ક્રીન પર છે.");
    }
  };

  // Generate Challenge Link
  const createChallenge = (e) => {
    e.preventDefault();
    if (!friendName) return;
    const link = `${window.location.origin}/kbc-quiz?challenger=${encodeURIComponent(profile.name)}&score=${score || 1200}`;
    setChallengeLink(link);
  };

  // Share Quiz Result
  const shareResult = (platform) => {
    const msg = `મેં ગુજરાતી ક્વિઝમાં ${score} પોઇન્ટ્સ મેળવ્યા! 🏆\nમારા ${correctCount}/${questions.length} સાચા જવાબો છે અને સ્ટ્રીક ${profile.streak || 1} દિવસની છે! 🔥\nશું તમે મારો રેકોર્ડ તોડી શકશો? રમો અહીં: ${window.location.origin}/community`;
    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(msg);
      alert('ક્વિઝ રિઝલ્ટ લિંક કોપી થઈ ગઈ છે!');
    }
  };

  const printCertificate = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 font-body min-h-[85vh] flex flex-col justify-between">
      
      {/* Top Banner Navigation */}
      <div className="flex items-center justify-between pb-6 border-b border-stone-200/50 mb-8 print:hidden">
        <button onClick={onBack} className="flex items-center gap-2 text-primary font-bold hover:underline">
          <span className="material-symbols-outlined">arrow_back</span> પાછા જાઓ
        </button>
        <div className="flex items-center gap-3">
          <span className="text-2xl">👑</span>
          <h1 className="font-headline font-black text-2xl md:text-3xl text-stone-900 tracking-tight">ગુજરાતી ક્વિઝ</h1>
        </div>
        <div className="flex items-center gap-2 bg-amber-100 text-amber-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-xs">
          <span>🔥 {profile.streak || 1} Days</span>
          <button onClick={() => setScreen('register')} className="hover:underline text-primary">({profile.name || "પ્રોફાઇલ"})</button>
        </div>
      </div>

      {/* SCREEN 1: REGISTRATION / PROFILE MODAL */}
      {!isRegistered || screen === 'register' ? (
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-primary/10 max-w-lg mx-auto w-full my-auto animate-fade-in space-y-6">
          <div className="text-center space-y-2">
            <div className="h-20 w-20 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
              🪔
            </div>
            <h2 className="font-headline font-black text-3xl text-stone-900">તમારો Quiz પ્રોફાઇલ બનાવો</h2>
            <p className="text-stone-500 text-sm">ઉંમર મુજબ આપોઆપ ક્વિઝના પ્રશ્નોનું સ્તર નક્કી થશે.</p>
          </div>

          <form onSubmit={saveProfile} className="space-y-4 font-gujarati">
            <div>
              <label className="font-bold text-sm block mb-1 text-stone-700">તમારું પૂરું નામ</label>
              <input
                type="text"
                required
                placeholder="દા.ત. નરેન્દ્રભાઈ પટેલ"
                value={profile.name}
                onChange={(e) => handleRegisterChange('name', e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-stone-200 focus:border-primary outline-none font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-sm block mb-1 text-stone-700">ઉંમર (વર્ષમાં)</label>
                <input
                  type="number"
                  required
                  min="6"
                  max="100"
                  value={profile.age}
                  onChange={(e) => handleRegisterChange('age', e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl border-2 border-stone-200 focus:border-primary outline-none font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-sm block mb-1 text-stone-700">આપોઆપ ગ્રુપ</label>
                <div className="w-full px-4 py-3.5 rounded-2xl bg-amber-50 border-2 border-amber-200 font-black text-amber-900 text-center uppercase text-sm">
                  {profile.ageGroup === 'kids' && "🧒 બાળ (6-12)"}
                  {profile.ageGroup === 'youth' && "🧑 યુવા (13-25)"}
                  {profile.ageGroup === 'adult' && "👨 Adult (26-50)"}
                  {profile.ageGroup === 'elder' && "👴 વડીલ (50+)"}
                </div>
              </div>
            </div>

            <div>
              <label className="font-bold text-sm block mb-1 text-stone-700">પ્રોફાઇલ અવતાર</label>
              <div className="flex items-center gap-3">
                <img src={profile.photo} className="h-16 w-16 rounded-full border-2 border-primary object-cover" alt="Avatar" />
                <button
                  type="button"
                  onClick={() => handleRegisterChange('photo', `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 font-bold text-xs rounded-xl transition"
                >
                  🔄 અવતાર બદલો
                </button>
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-primary text-white rounded-2xl font-black text-lg shadow-lg hover:bg-primary-container transition active:scale-95">
              🚀 ક્વિઝ રમવાનું શરૂ કરો
            </button>
          </form>
        </div>
      ) : screen === 'home' ? (
        /* SCREEN 2: GAME MODES & DASHBOARD */
        <div className="space-y-10 animate-fade-in">
          
          {/* Welcome User Banner */}
          <div className="bg-gradient-to-r from-amber-800 to-amber-950 p-8 md:p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="absolute right-0 top-0 opacity-10 translate-x-10 -translate-y-10 select-none pointer-events-none text-[15rem]">
              👑
            </div>
            <div className="space-y-2 z-10 text-center md:text-left">
              <span className="bg-amber-500/30 text-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest inline-block mb-2">ગુજરાત જ્ઞાન મહોત્સવ</span>
              <h2 className="font-headline font-black text-3xl md:text-4xl text-amber-100">સ્વાગત છે, {profile.name}!</h2>
              <p className="font-gujarati text-amber-200/90 text-lg max-w-xl">તમારી ઉંમર ({profile.age} વર્ષ) મુજબ પ્રશ્નોનું બેંક તૈયાર છે. રોજ રમો, જ્ઞાન વધારો અને સર્ટિફિકેટ જીતો!</p>
            </div>
            <div className="z-10 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center min-w-44 flex flex-col items-center shadow-lg">
              <img src={profile.photo} className="h-16 w-16 rounded-full border-2 border-amber-400 mb-2 shadow-md" alt="User" />
              <span className="text-xs text-amber-200 uppercase font-bold tracking-wider">સ્ટ્રીક (Streak)</span>
              <span className="font-headline font-black text-3xl text-amber-300">🔥 {profile.streak || 1} Days</span>
            </div>
          </div>

          {/* Quiz Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Daily Quiz */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="h-16 w-16 bg-amber-50 text-amber-800 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  🎯
                </div>
                <h3 className="font-gujarati font-black text-2xl text-stone-900">દૈનિક ક્વિઝ</h3>
                <p className="text-stone-500 text-xs leading-relaxed font-gujarati">૧૦ પ્રશ્નો • ૩૦ સેકન્ડ ટાઈમર • રોજ મધ્યરાત્રીએ નવા પ્રશ્નો અપડેટ થાય.</p>
              </div>
              <button onClick={() => startQuiz('daily')} className="w-full py-3.5 bg-primary hover:bg-primary-container text-white rounded-xl font-bold font-gujarati shadow-md transition active:scale-95">
                ⚡ રમો (10 Questions)
              </button>
            </div>

            {/* Weekly Quiz */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl hover:border-blue-600/50 transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="h-16 w-16 bg-blue-50 text-blue-800 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  🏆
                </div>
                <h3 className="font-gujarati font-black text-2xl text-stone-900">સાપ્તાહિક ક્વિઝ</h3>
                <p className="text-stone-500 text-xs leading-relaxed font-gujarati">૨૫ પ્રશ્નો • રવિવારે રિસેટ • ટોપ ૧૦ લીડરબોર્ડ અને સર્ટિફિકેટ.</p>
              </div>
              <button onClick={() => startQuiz('weekly')} className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold font-gujarati shadow-md transition active:scale-95">
                🚀 રમો (25 Questions)
              </button>
            </div>

            {/* Monthly Quiz */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl hover:border-purple-600/50 transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="h-16 w-16 bg-purple-50 text-purple-800 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  🎖️
                </div>
                <h3 className="font-gujarati font-black text-2xl text-stone-900">માસિક ગ્રાન્ડ ક્વિઝ</h3>
                <p className="text-stone-500 text-xs leading-relaxed font-gujarati">૫0 પ્રશ્નો • મહિનાના અંતે ગ્રાન્ડ સર્ટિફિકેટ અને સ્પેશિયલ ગોલ્ડન બેજ.</p>
              </div>
              <button onClick={() => startQuiz('monthly')} className="w-full py-3.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold font-gujarati shadow-md transition active:scale-95">
                👑 રમો (50 Questions)
              </button>
            </div>

            {/* Challenge Mode */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl hover:border-emerald-600/50 transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="h-16 w-16 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  ⚔️
                </div>
                <h3 className="font-gujarati font-black text-2xl text-stone-900">મિત્ર ચેલેન્જ મોડ</h3>
                <p className="text-stone-500 text-xs leading-relaxed font-gujarati">તમારા મિત્રને વોટ્સએપ પર ચેલેન્જ મોકલો અને સ્કોરની સરખામણી કરો.</p>
              </div>
              <button onClick={() => setScreen('challenge_setup')} className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold font-gujarati shadow-md transition active:scale-95">
                🔗 ચેલેન્જ મોકલો
              </button>
            </div>

          </div>

          {/* Leaderboard and Information Section */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <h3 className="font-gujarati font-black text-2xl text-stone-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 font-bold">social_leaderboard</span> 
                ગુજરાતી જ્ઞાન લીડરબોર્ડ
              </h3>
              <div className="flex gap-2">
                {['daily', 'weekly', 'monthly', 'allTime'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setLeaderboardTab(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${leaderboardTab === tab ? 'bg-primary text-white shadow-sm' : 'bg-stone-100 hover:bg-stone-200 text-stone-600'}`}
                  >
                    {tab === 'daily' && "દૈનિક"}
                    {tab === 'weekly' && "સાપ્તાહિક"}
                    {tab === 'monthly' && "માસિક"}
                    {tab === 'allTime' && "Hall of Fame"}
                  </button>
                ))}
              </div>
            </div>

            {/* Leaderboard Table List */}
            <div className="space-y-3 font-gujarati">
              {MOCK_LEADERBOARD[leaderboardTab].map((user) => (
                <div key={user.rank} className={`flex items-center justify-between p-4 rounded-2xl border ${user.name.includes(profile.name) ? 'bg-amber-50 border-amber-300 shadow-sm' : 'border-stone-100 bg-stone-50/50'}`}>
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${user.rank === 1 ? 'bg-amber-500 text-white' : user.rank === 2 ? 'bg-stone-400 text-white' : user.rank === 3 ? 'bg-amber-700 text-white' : 'bg-stone-200 text-stone-700'}`}>
                      {user.rank}
                    </span>
                    <img src={user.avatar} className="w-10 h-10 rounded-full border border-stone-300" alt="Avatar" />
                    <div>
                      <h4 className="font-black text-stone-900 text-base">{user.name}</h4>
                      <span className="text-xs text-stone-500">🔥 {user.streak} Days Streak</span>
                    </div>
                  </div>
                  <div className="font-headline font-black text-lg text-primary">
                    {user.score.toLocaleString()} <span className="text-xs font-normal text-stone-400">pts</span>
                  </div>
                </div>
              ))}
            </div>

            {/* User Rank Highlight Footer */}
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 flex items-center justify-between font-gujarati">
              <div className="flex items-center gap-3">
                <img src={profile.photo} className="w-10 h-10 rounded-full border-2 border-primary" alt="My avatar" />
                <div>
                  <h4 className="font-black text-stone-900">{profile.name} (તમે)</h4>
                  <span className="text-xs text-stone-500">તમારો રેન્ક: #૧૪ (ટોપ ૧૦માં પહોંચવા વધુ ક્વિઝ રમો!)</span>
                </div>
              </div>
              <button onClick={() => startQuiz('daily')} className="bg-primary text-white px-5 py-2 rounded-xl font-bold text-xs shadow hover:bg-primary-container transition">
                સ્કોર વધારો ⚡
              </button>
            </div>

          </div>

        </div>
      ) : screen === 'quiz' ? (
        /* KbcQuizGame: ACTIVE Quiz GAMEPLAY */
        <div className="space-y-6 animate-fade-in my-auto">
          
          {/* Header Stats & Timer Countdown Bar */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between font-gujarati font-bold text-sm">
              <div className="text-center print:hidden">
                <button onClick={onBack} className="text-primary font-bold hover:underline font-gujarati">
                  ← મુખ્ય મેનુ પર પાછા જાઓ
                </button>
              </div>
              <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-xl font-black text-base">
                🏆 સ્કોર: {score.toLocaleString()} pts
              </span>
            </div>

            {/* Animated Visual Countdown Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-stone-500">
                <span>સમય મર્યાદા (Timer)</span>
                <span className={`font-black text-base ${timer <= 10 ? 'text-red-600 animate-pulse' : 'text-stone-800'}`}>{timer} સેકન્ડ</span>
              </div>
              <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${timer > 15 ? 'bg-emerald-500' : timer > 7 ? 'bg-amber-500' : 'bg-red-600 animate-pulse'}`}
                  style={{ width: `${(timer / 30) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Quiz Lifelines Bar (Hidden for now as requested) */}
            <div className="pt-2 border-t border-stone-100 hidden items-center justify-between gap-3 sm:gap-6 font-gujarati">
              <span className="text-xs font-bold text-stone-400 uppercase hidden sm:block">લાઈફલાઈન:</span>
              <div className="flex gap-3 flex-1 justify-end">
                <button
                  onClick={triggerFiftyFifty}
                  disabled={!lifelines.fiftyFifty || !isTimerRunning || selectedOption}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-2xl font-black text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-1.5 ${lifelines.fiftyFifty && isTimerRunning && !selectedOption ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:scale-105 active:scale-95' : 'bg-stone-100 text-stone-300 border border-stone-200 cursor-not-allowed line-through'}`}
                >
                  <span>⚖️</span> 50-50
                </button>

                <button
                  onClick={triggerFriendHelp}
                  disabled={!lifelines.friendHelp || !isTimerRunning || selectedOption}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-2xl font-black text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-1.5 ${lifelines.friendHelp && isTimerRunning && !selectedOption ? 'bg-blue-100 text-blue-900 border border-blue-300 hover:scale-105 active:scale-95' : 'bg-stone-100 text-stone-300 border border-stone-200 cursor-not-allowed line-through'}`}
                >
                  <span>💬</span> મિત્રની મદદ {friendHelpCountdown > 0 && `(${friendHelpCountdown}s)`}
                </button>

                <button
                  onClick={triggerChangeQuestion}
                  disabled={!lifelines.changeQuestion || !isTimerRunning || selectedOption}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-2xl font-black text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-1.5 ${lifelines.changeQuestion && isTimerRunning && !selectedOption ? 'bg-purple-100 text-purple-900 border border-purple-300 hover:scale-105 active:scale-95' : 'bg-stone-100 text-stone-300 border border-stone-200 cursor-not-allowed line-through'}`}
                >
                  <span>🔄</span> પ્રશ્ન બદલો
                </button>
              </div>
            </div>

            {activeLifelineMsg && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold rounded-xl animate-fade-in text-center">
                {activeLifelineMsg}
              </div>
            )}
          </div>

          {/* Question Box */}
          <div className="bg-gradient-to-br from-amber-900 to-stone-950 p-8 md:p-10 rounded-[2.5rem] shadow-2xl border-4 border-amber-500/30 text-white relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 p-4 opacity-10 font-headline font-black text-8xl pointer-events-none select-none">
              ?
            </div>
            <div className="space-y-2">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full inline-block">
                કેટેગરી: {questions[currentIndex]?.category}
              </span>
              <h2 className="font-gujarati font-black text-2xl md:text-3xl leading-snug tracking-wide">
                {questions[currentIndex]?.question}
              </h2>
            </div>

            {/* Answer Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 font-gujarati">
              {questions[currentIndex]?.options.map((option, idx) => {
                const isOptionDisabled = disabledOptions.includes(option);
                const isThisSelected = selectedOption === option;
                const isThisCorrect = option === questions[currentIndex]?.correct;

                let btnStyle = "bg-stone-900/80 border-2 border-amber-500/30 hover:border-amber-400 text-white";

                if (selectedOption) {
                  if (isThisCorrect) {
                    btnStyle = "bg-emerald-600 border-2 border-emerald-400 text-white animate-bounce shadow-lg shadow-emerald-500/50";
                  } else if (isThisSelected) {
                    btnStyle = "bg-red-600 border-2 border-red-400 text-white animate-shake shadow-lg shadow-red-500/50";
                  } else {
                    btnStyle = "bg-stone-900/40 border-2 border-stone-800 text-stone-500 opacity-50";
                  }
                }

                if (isOptionDisabled) {
                  btnStyle = "bg-stone-950 border-2 border-stone-800 text-stone-700 line-through opacity-30 cursor-not-allowed";
                }

                const prefix = ["A", "B", "C", "D"][idx];

                return (
                  <button
                    key={idx}
                    disabled={!!selectedOption || isOptionDisabled || !isTimerRunning}
                    onClick={() => handleSelectOption(option)}
                    className={`p-5 rounded-2xl font-black text-base md:text-lg text-left flex items-center gap-4 transition-all duration-300 ${btnStyle}`}
                  >
                    <span className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center font-headline font-black text-amber-300 shrink-0">
                      {prefix}
                    </span>
                    <span className="flex-1">{option}</span>
                    {selectedOption && isThisCorrect && <span className="text-2xl">✅</span>}
                    {selectedOption && isThisSelected && !isThisCorrect && <span className="text-2xl">❌</span>}
                  </button>
                );
              })}
            </div>

            {/* Explanation box shown after answering */}
            {selectedOption && (
              <div className="p-5 bg-black/40 border border-white/10 rounded-2xl text-amber-200 text-xs sm:text-sm leading-relaxed animate-fade-in font-gujarati space-y-1">
                <p className="font-bold text-amber-400">💡 જ્ઞાન સમજૂતી:</p>
                <p>{questions[currentIndex]?.explanation}</p>
              </div>
            )}
          </div>

        </div>
      ) : screen === 'result' ? (
        /* SCREEN 4: QUIZ RESULT & CERTIFICATE GENERATOR */
        <div className="space-y-8 animate-fade-in my-auto">
          
          <div className="text-center space-y-2">
            <span className="text-5xl inline-block animate-bounce">🏆</span>
            <h2 className="font-headline font-black text-3xl md:text-4xl text-stone-900">ક્વિઝ પૂર્ણ થઈ!</h2>
            <p className="text-stone-500 font-gujarati">ગુજરાતી ક્વિઝ માં તમારું ઉત્કૃષ્ટ પ્રદર્શન બદલ અભિનંદન.</p>
          </div>

          {/* Printable / Shareable Certificate Card DOM */}
          <div id="quiz-certificate-card" className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 p-8 md:p-12 rounded-[2.5rem] border-8 border-amber-700 shadow-2xl relative overflow-hidden font-gujarati text-amber-950 max-w-2xl mx-auto space-y-8 print:w-[21cm] print:h-[29.7cm] print:m-0 print:border-[16px] print:shadow-none print:flex print:flex-col print:justify-between">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 select-none pointer-events-none text-9xl font-headline font-black uppercase rotate-[-30deg]">
              ગુજરાતી ક્વિઝ
            </div>

            <div className="flex justify-between items-center border-b-2 border-amber-800/20 pb-6">
              <div className="flex items-center gap-2">
                <span className="h-12 w-12 bg-amber-800 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow">🪔</span>
                <div>
                  <h4 className="font-headline font-black text-lg text-amber-950">ગુજરાતી એપ</h4>
                  <p className="text-[10px] tracking-widest text-amber-800 uppercase font-black">Gujarati App</p>
                </div>
              </div>
              <div className="text-right">
                <span className="bg-amber-800 text-amber-100 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                  પ્રમાણપત્ર (Certificate of Merit)
                </span>
                <p className="text-xs text-amber-800/80 font-bold mt-1">તારીખ: {new Date().toLocaleDateString('gu-IN')}</p>
              </div>
            </div>

            <div className="text-center space-y-4 py-6 z-10 relative">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800">ગૌરવપૂર્વક એનાયત કરવામાં આવે છે કે</span>
              <div className="flex justify-center my-3">
                <img src={profile.photo} className="w-24 h-24 rounded-full border-4 border-amber-700 shadow-lg object-cover" alt="Winner" />
              </div>
              <h2 className="font-headline font-black text-4xl sm:text-5xl text-amber-950 tracking-wide underline decoration-amber-500 underline-offset-8">
                {profile.name}
              </h2>
              <p className="text-base sm:text-lg text-amber-900/90 max-w-lg mx-auto leading-relaxed">
                એમણે ગુજરાતી ક્વિઝ ({quizMode.toUpperCase()} મોડ) માં ભાગ લઈ અદ્ભુત સામાન્ય જ્ઞાન અને કુશળતાનું શાનદાર પ્રદર્શન કર્યું છે.
              </p>
            </div>

            {/* Score Badges */}
            <div className="grid grid-cols-3 gap-4 bg-amber-800/10 p-6 rounded-3xl border border-amber-800/20 text-center z-10 relative">
              <div>
                <span className="text-xs uppercase text-amber-800 font-bold block mb-1">કુલ સ્કોર</span>
                <span className="font-headline font-black text-3xl sm:text-4xl text-amber-950">{score.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-xs uppercase text-amber-800 font-bold block mb-1">સાચા જવાબો</span>
                <span className="font-headline font-black text-3xl sm:text-4xl text-amber-950">{correctCount}/{questions.length}</span>
              </div>
              <div>
                <span className="text-xs uppercase text-amber-800 font-bold block mb-1">સળંગ સ્ટ્રીક</span>
                <span className="font-headline font-black text-3xl sm:text-4xl text-amber-950">🔥 {profile.streak || 1} Days</span>
              </div>
            </div>

            <div className="flex justify-between items-end pt-6 border-t border-amber-800/20 text-xs font-bold text-amber-900 z-10 relative">
              <div>
                <span className="block italic">સહી: આયોજક સમિતિ</span>
                <span className="text-amber-800 font-black">ગુજરાત જ્ઞાન મહોત્સવ</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 bg-amber-800 text-white rounded-full flex items-center justify-center font-bold">✓</span>
                <span className="tracking-widest uppercase">Verified Record</span>
              </div>
            </div>
          </div>

          {/* Action Buttons for Sharing / Printing */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto print:hidden font-gujarati font-bold">
            <button
              onClick={() => shareResult('whatsapp')}
              className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg flex items-center justify-center gap-2 font-black transition active:scale-95"
            >
              <span>💬</span> WhatsApp પર સર્ટિફિકેટ શેર કરો
            </button>
            <button
              onClick={() => shareResult('copy')}
              className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg flex items-center justify-center gap-2 font-black transition active:scale-95"
            >
              <span>🔗</span> લિંક કોપી
            </button>
            <button
              onClick={printCertificate}
              className="px-6 py-4 bg-amber-800 hover:bg-amber-900 text-white rounded-2xl shadow-lg flex items-center justify-center gap-2 font-black transition active:scale-95"
            >
              <span>🖨️</span> પ્રિન્ટ સર્ટિફિકેટ
            </button>
          </div>

          <div className="text-center print:hidden">
            <button onClick={() => setScreen('home')} className="text-primary font-bold hover:underline font-gujarati">
              ← મુખ્ય મેનુ પર પાછા જાઓ અને ફરી રમો
            </button>
          </div>

        </div>
      ) : screen === 'challenge_setup' ? (
        /* SCREEN 5: FRIEND CHALLENGE SETUP MODAL */
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-primary/10 max-w-lg mx-auto w-full my-auto animate-fade-in space-y-6">
          <div className="text-center space-y-2">
            <span className="text-5xl inline-block">⚔️</span>
            <h2 className="font-headline font-black text-3xl text-stone-900 font-gujarati">મિત્રને ચેલેન્જ મોકલો</h2>
            <p className="text-stone-500 text-sm font-gujarati">તમારા મિત્રનું નામ લખો અને તેમને સમાન પ્રશ્નો રમી તમારો સ્કોર તોડવા પડકારો!</p>
          </div>

          <form onSubmit={createChallenge} className="space-y-4 font-gujarati">
            <div>
              <label className="font-bold text-sm block mb-1 text-stone-700">મિત્રનું પૂરું નામ</label>
              <input
                type="text"
                required
                placeholder="દા.ત. જિગ્નેશભાઈ પંચાલ"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-stone-200 focus:border-primary outline-none font-bold"
              />
            </div>

            <button type="submit" className="w-full py-4 bg-emerald-700 text-white rounded-2xl font-black text-lg shadow-lg hover:bg-emerald-800 transition active:scale-95">
              🔗 યુનિક ચેલેન્જ લિંક બનાવો
            </button>
          </form>

          {challengeLink && (
            <div className="p-6 bg-stone-50 border-2 border-stone-200 rounded-3xl space-y-4 animate-fade-in text-center font-gujarati">
              <h4 className="font-black text-stone-800 text-sm">તમારી યુનિક ચેલેન્જ લિંક તૈયાર છે!</h4>
              <input
                type="text"
                readOnly
                value={challengeLink}
                onClick={(e) => e.target.select()}
                className="w-full p-3 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-600 text-center select-all"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(challengeLink);
                    alert("ચેલેન્જ લિંક કોપી થઈ ગઈ છે! તમારા મિત્રને મોકલો.");
                  }}
                  className="flex-1 py-3 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition"
                >
                  કોપી લિંક 📋
                </button>
                <button
                  onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`હેલો ${friendName}! મેં Quiz ક્વિઝમાં ${score || 1200} સ્કોર કર્યો છે. શું તમે મારી ચેલેન્જ સ્વીકારી મારો સ્કોર તોડી શકશો? રમો અહીં: ${challengeLink}`)}`, '_blank')}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                >
                  <span>💬</span> WhatsApp મોકલો
                </button>
              </div>
            </div>
          )}

          <div className="text-center">
            <button onClick={() => setScreen('home')} className="text-stone-500 font-bold hover:underline font-gujarati text-sm">
              ← મુખ્ય મેનુ પર પાછા
            </button>
          </div>
        </div>
      ) : null}

      {/* Footer Branding */}
      <footer className="pt-8 text-center text-stone-400 text-xs tracking-widest uppercase font-bold border-t border-stone-200/50 mt-12 print:hidden">
        ગુજરાતી ક્વિઝ • Gujarati App જ્ઞાન મહોત્સવ
      </footer>

    </div>
  );
};

export default KbcQuizGame;
