import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ShareButton from './ShareButton';

const RAM_SHALAKA_LETTERS = [
  "सु", "प्र", "उ", "बि", "हो", "मु", "ग", "ब", "सु", "नु", "बि", "घ", "धि", "इ", "द",
  "र", "रु", "फ", "सि", "सि", "रें", "बस", "है", "मं", "ल", "न", "ल", "य", "न", "अं",
  "सु", "सो", "ग", "सु", "कु", "म", "स", "ग", "त", "न", "ई", "ल", "धा", "बे", "नो",
  "त्य", "र", "न", "कु", "जो", "म", "रि", "र", "र", "अ", "की", "हो", "सं", "रा", "य",
  "पु", "सु", "थ", "सी", "जे", "इ", "ग", "म", "सं", "क", "रे", "हो", "स", "स", "नि",
  "त", "र", "त", "र", "स", "इ", "ह", "ब", "ब", "प", "चि", "स", "य", "स", "तु",
  "म", "का", "ऽ", "र", "र", "मा", "मि", "मी", "म्हा", "ऽ", "जा", "हू", "हीं", "ऽ", "जू",
  "ता", "रा", "रे", "री", "हृ", "का", "फ", "खा", "जि", "ई", "र", "रा", "पू", "द", "ल",
  "नि", "को", "मि", "गो", "न", "मु", "जि", "य", "ने", "म", "क", "ज", "प", "स", "ल",
  "हि", "रा", "म", "स", "रि", "ग", "द", "न", "ष", "म", "ख", "जि", "म", "त", "जं",
  "सिं", "मु", "न", "न", "कौ", "मि", "नि", "र", "ग", "धु", "ख", "सु", "કા", "स", "र",
  "गु", "क", "म", "अ", "ध", "नि", "म", "ल", "ऽ", "न", "ब", "ती", "न", "रि", "भ",
  "ना", "पु", "व", "अ", "ढा", "र", "त", "का", "ए", "तु", "र", "न", "नु", "व", "थ",
  "सि", "ह", "स", "म्ह", "रा", "र", "स", "हिं", "र", "ત", "ન", "ષ", "ऽ", "જ", "ऽ",
  "ર", "સા", "ऽ", "લા", "ધી", "ऽ", "રી", "જ", "હૂ", "હીં", "ષ", "જૂ", "ઈ", "રા", "રે"
];

const CHAUPAIS = [

  {
    verse: "सुनु सिय सत्य असीस हमारी। पूजिहि मन कामना तुम्हारी॥",
    category: "અતિ શુભ (Highly Auspicious)",
    badgeColor: "bg-emerald-600 text-white border-emerald-400",
    meaning: "આ સંકેત અતંયત મંગલમય અને શુભ છે. ભગવાન શ્રી રામચંદ્રજીના કૃપા-આશીર્વાદથી તમારી મનોકામના ખૂબ જ ઝડપથી પૂર્ણ થશે અને તમારા કાર્યમાં ભવ્ય સફળતા મળશે."
  },
  {
    verse: "प्रबिसि नगर कीजे सब काजा। हृदयँ राखि कोसलपुर राजा॥",
    category: "સંપૂર્ણ સફળતા (Success)",
    badgeColor: "bg-emerald-500 text-white border-emerald-300",
    meaning: "ભગવાન શ્રીરામને હૃદયમાં રાખીને તમારું કાર્ય શરૂ કરો. હિંમતપૂર્વક આગળ વધો, અટકેલા કાર્યો આપોઆપ પૂર્ણ થશે અને તમને દરેક પગલે સફળતા પ્રાપ્ત થશે."
  },
  {
    verse: "उघरे अंत न होइ निबाहू। कालनेमि जिमि रावन राहू॥",
    category: "અશુભ / સાવધાન (Caution Required)",
    badgeColor: "bg-rose-600 text-white border-rose-400",
    meaning: "આ સંકેત સૂચવે છે કે આ કાર્યની શરૂઆત ભલે સારી લાગે, પણ લાંબા ગાળે તેનું પરિણામ હિતકારક નથી. કાર્ય કરવાથી નુકસાન કે પસ્તાવો થઈ શકે છે, માટે અત્યારે આ નિર્ણય મોકૂફ રાખવો યોગ્ય રહેશે."
  },
  {
    verse: "बिधि बस सुजन कुसंगत परहीं। फनि मनि सम निज गुन नहिं हरहीं॥",
    category: "मધ્યમ / સાવધાની (Caution / Alert)",
    badgeColor: "bg-orange-500 text-white border-orange-300",
    meaning: "આ કાર્યમાં સંગતની ખાસ કાળજી રાખવાની જરૂર છે. કોઈ અયોગ્ય કે સ્વાર્થી વ્યક્તિ તમને નુકસાન પહોંચાડી શકે છે. સાવધાની રાખીને વિવેકપૂર્ણ નિર્ણય લેવા સલાહ છે."
  },
  {
    verse: "होइहै सोई जो राम रचि राखा। को करि तरक बढ़ावै साखा॥",
    category: "ઈશ્વર ઈચ્છા (Destiny / Trust God)",
    badgeColor: "bg-indigo-600 text-white border-indigo-400",
    meaning: "વ્યર્થ ચિંતા કરવાનું છોડી દો. જે પ્રભુ શ્રી રામે વિધાતાના વિધાન અનુસાર નક્કી કર્યું છે તે જ થવાનું છે. પ્રભુના શરણે રહો અને કર્તવ્ય પથ પર આગળ વધો, ફળ માટે થોડી ધીરજ રાખો."
  },
  {
    verse: "जौं जनम संकट हरन को। मंगल करन अमंगल हरन को॥",
    category: "અતિ મંગલમય (Auspicious)",
    badgeColor: "bg-amber-600 text-white border-amber-400",
    meaning: "તમારા તમામ કષ્ટો, ચિંતાઓ અને વિઘ્નોનો અંત આવી રહ્યો છે. આ ખૂબ જ પવિત્ર સંકેત છે. કાર્ય કરવાથી કલ્યાણ અને ખૂબ જ શુભ પરિણામો મળશે."
  },
  {
    verse: "गरल सुधा रिपु करहिं मिताई। गोपद सिंधु अनल सितलाई॥",
    category: "પરમ સફળતા (Auspicious / Success)",
    badgeColor: "bg-teal-600 text-white border-teal-400",
    meaning: "તમારા વિરોધીઓ કે શત્રુઓ પણ મિત્ર બની જશે. મોટી મુશ્કેલીઓ કે સંકટો પણ ગાયના ખરીના ખાડા સમાન નાની અને સરળ બની જશે. તમામ વિઘ્નો દૂર થઈ જશે."
  },
  {
    verse: "तात जनक तजि जनहु उपाई। प्रियतम रामु पाय बिनु आई॥",
    category: "ઉત્તમ ફળ (Easy Success)",
    badgeColor: "bg-emerald-600 text-white border-emerald-400",
    meaning: "તમારે કોઈપણ ચિંતા કરવાની જરૂર નથી. ભગવાનના વિશેષ સ્નેહ અને કૃપાથી આ કાર્ય કોઈપણ વિઘ્ન વિના અને ખૂબ જ ઓછી મહેનતે સુંદરતાથી સિદ્ધ થઈ જશે."
  },
  {
    verse: "धीरज धरहु मिलहिं मनमाने। बनइ काज बरषहिं हरषाने॥",
    category: "ધૈર્ય / સફળતા (Patience Needed)",
    badgeColor: "bg-blue-600 text-white border-blue-400",
    meaning: "તમારી ઈચ્છા ચોક્કસપણે પૂરી થશે, પરંતુ તેમાં થોડો સમય અને વિલંબ થશે. અધિરા ન થતાં પ્રભુ પર અતૂટ શ્રદ્ધા રાખો અને યોગ્ય સમયની પ્રતીક્ષા કરો."
  }
];

const DURGA_PRASHNAVALI_ANSWERS = [
  {
    name: "૧. શૈલપુત્રી",
    shloka: "ॐ ह्रीं दुं दुर्गायै नमः॥",
    category: "પૂર્ણ સફળતા (Success)",
    badgeColor: "bg-emerald-600 text-white border-emerald-400",
    meaning: "જગદંબા ભગવતી શૈલપુત્રીના આશીર્વાદથી તમારું કાર્ય ખૂબ જ જલ્દી અને ભવ્ય રીતે પૂર્ણ થશે. મનમાં રાખેલી મનોકામના ચોક્કસ પૂરી થશે, શ્રદ્ધા સાથે આગળ વધો."
  },
  {
    name: "૨. બ્રહ્મચારિણી",
    shloka: "सर्वमङ्गलमङ्गल्ये शिवे सर्वार्थसाधिके। शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तुते॥",
    category: "શુભ સમાચાર (Very Auspicious)",
    badgeColor: "bg-emerald-500 text-white border-emerald-300",
    meaning: "તમારા ઘરમાં ખૂબ જ જલ્દી કોઈ સુંદર મંગલકારી કાર્ય થશે. માતા બ્રહ્મચારિણીની કૃપાથી તમારા રોકાયેલા કે અટકેલા કાર્યોમાં અણધારી સફળતા અને વિજય મળશે."
  },
  {
    name: "૩. ચંદ્રઘંટા",
    shloka: "ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे॥",
    category: "લાભદાયી પ્રવાસ (Gain / Success)",
    badgeColor: "bg-teal-600 text-white border-teal-400",
    meaning: "નવા કાર્યો કે યાત્રા-પ્રવાસથી અદ્ભુત ફાયદો થશે. જો કોઈ જગ્યાએ જવાનું કે નવી શરૂઆત કરવાનું આયોજન હોય તો આગળ વધો, તે અત્યંત ફળદાયી રહેશે."
  },
  {
    name: "૪. કુષ્માંડા",
    shloka: "शरणागतदीनार्तपरित्राणपरायणे। सर्वस्यार्तिहरे देवि नारायणि नमोऽस्तुते॥",
    category: "ધીરજ રાખો (Caution / Wait)",
    badgeColor: "bg-rose-600 text-white border-rose-400",
    meaning: "આ કાર્યમાં થોડી મુશ્કેલીઓ, વિઘ્નો કે અડચણ આવી શકે છે. અત્યારે ગુસ્સો કે ઉતાવળમાં કોઈ નિર્ણય ન લેવો. શાંતિ અને ધીરજપૂર્વક સમય પસાર કરવો યોગ્ય રહેશે."
  },
  {
    name: "૫. સ્કંદમાતા",
    shloka: "या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता। नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः॥",
    category: "સતત પ્રયાસ / વિલંબ (Patience Needed)",
    badgeColor: "bg-orange-500 text-white border-orange-300",
    meaning: "આ કાર્ય સિદ્ધ થવામાં થોડો સમય લાગશે અને વધુ મહેનતની જરૂર પડશે. હિંમત હાર્યા વિના માં ભવાની પર અતૂટ શ્રદ્ધા રાખીને સતત પ્રયત્નો ચાલુ રાખો, અંતે વિજય થશે."
  },
  {
    name: "૬. કાત્યાયની",
    shloka: "देहि सौभाग्यमारोग्यं देहि मे परमं सुखम्। रूपं देहि जयं देहि यशो देहि द्विषो जहि॥",
    category: "સાવધાની રાખો (Caution / Alert)",
    badgeColor: "bg-rose-600 text-white border-rose-400",
    meaning: "આર્થિક રોકાણ, પૈસાની લેવડ-દેવડ કે તબિયત અંગે ખાસ સાવધાની રાખવી. અત્યારે કોઈ નવો જોખમી સોદો કે કોઈના પર આંધળો વિશ્વાસ કરવો હિતકારક નથી."
  },
  {
    name: "૭. કાલરાત્રિ",
    shloka: "जयन्ती मङ्गला काली भद्रकाली कपालिनी। दुर्गा क्षमा शिवा धात्री स्वाहा स्वधा नमोऽस्तुते॥",
    category: "સહયોગથી સફળતા (Success with Help)",
    badgeColor: "bg-teal-600 text-white border-teal-400",
    meaning: "તમારા સ્વજનો, સાચા મિત્રો કે કોઈ સ્નેહી સ્ત્રીના ઉત્તમ સહયોગથી કાર્ય સિદ્ધ થશે. એકલા બધું કરવાને બદલે અનુભવી લોકોની મદદ અને સલાહ લેવી ફળદાયી નીવડશે."
  },
  {
    name: "૮. મહાગૌરી",
    shloka: "सर्वबाधाप्रशमनं त्रैलोक्यस्याखिलेश्वरि। एवमेव त्वया कार्यमस्मद्वैरिविनाशनम्॥",
    category: "સંકટ મુક્તિ (Relief / Auspicious)",
    badgeColor: "bg-amber-600 text-white border-amber-400",
    meaning: "લાંબા સમયથી ચાલી રહેલી માનસિક ચિંતા, જૂનું સંકટ, બીમારી કે આર્થિક મુશ્કેલીઓ આપોઆપ દૂર થઈ જશે. માં ગૌરીની અસીમ કૃપાથી તમારો સારો સમય શરૂ થઈ રહ્યો છે."
  },
  {
    name: "૯. સિદ્ધિદાત્રી",
    shloka: "प्रणतानां प्रसीद त्वं देवि विश्वार्तिहारिणि। त्रैलोक्यवासिनामीड्ये लोकानां वरदा भव॥",
    category: "સંપૂર્ણ વિજય (Triumph / Success)",
    badgeColor: "bg-emerald-600 text-white border-emerald-400",
    meaning: "કાર્યમાં ભવ્ય વિજય મળશે. જો કોઈ કોર્ટ-કચેરી, સરકારી અટકેલા કામો કે સ્પર્ધાત્મક બાબતો હોય, તો તેમાં પરિણામ તમારી તરફેણમાં આવશે. મંગલમય સમય છે."
  },
  {
    name: "૧૦. દુર્ગા",
    shloka: "दुर्गे स्मृता हरसि भीतिमशेषजन्तोः। स्वस्थैः स्मृता मतिमतीव शुभां ददासि॥",
    category: "સુખ-સમૃદ્ધિ (Happiness / Gain)",
    badgeColor: "bg-emerald-500 text-white border-emerald-300",
    meaning: "આ કાર્યથી તમારા ઘરમાં સુખ, શાંતિ અને સમૃદ્ધિનું આગમન થશે. સંતાનો તરફથી ઉત્તમ સમાચાર મળશે અને તમારી સુખ-શાંતિમાં વધારો થશે."
  },
  {
    name: "૧૧. ભદ્રકાલી",
    shloka: "ॐ जयन्ती मङ्गला काली भद्रकाली कपालिनी॥",
    category: "પરમ સૌભાગ્ય (Highly Auspicious)",
    badgeColor: "bg-amber-600 text-white border-amber-400",
    meaning: "તમારું ભાગ્ય અત્યારે સાનુકૂળ ચાલી રહ્યું છે. તમે જે પણ કામ હાથમાં લેશો, તેમાં ચોક્કસ સફળતા, યશ અને સામાજિક પ્રતિષ્ઠા પ્રાપ્ત થશે."
  },
  {
    name: "૧૨. જગદંબા",
    shloka: "दुर्गे देवि नमस्तुभ्यं सर्वकामार्थसाधिके। मम सिद्धिमसिद्धं वा स्वप्ने सर्वं प्रदर्शय॥",
    category: "ચોક્કસ સફળતા (Guaranteed Success)",
    badgeColor: "bg-emerald-600 text-white border-emerald-400",
    meaning: "જગદંબા માતાજીના પૂર્ણ મંત્ર સ્મરણ સાથે આ કાર્ય કરશો તો દુનિયાની કોઈ તાકાત તમને રોકી શકશે નહીં. ખૂબ જ ભવ્ય અને ગૌરવશાળી સફળતા મળશે."
  },
  {
    name: "૧૩. ભવાની",
    shloka: "भवानि त्वं महामाया सर्वलोकभयङ्करी। मम बाधां शमयाशु विघ्नराजप्रसादिता॥",
    category: "ધન લાભ (Financial Gain)",
    badgeColor: "bg-emerald-500 text-white border-emerald-300",
    meaning: "ધંધા, નોકરી કે વ્યાપારમાં અચાનક સારો અને મોટો ધનલાભ થવાની સંભાવના છે. નાણાકીય ક્ષેત્રે ચાલી રહેલી ખેંચતાણ અને સમસ્યાઓનો અંત આવશે."
  },
  {
    name: "૧૪. કાલી",
    shloka: "काली काली महाकाली कालिके पापहारिणी। धर्मकामप्रदे देवि नारायणि नमोऽस्तुते॥",
    category: "યશ અને કીર્તિ (Social Success)",
    badgeColor: "bg-teal-600 text-white border-teal-400",
    meaning: "સમાજ, કુટુંબ કે તમારા કાર્યક્ષેત્રમાં તમારી નામના, પ્રભાવ અને યશમાં વધારો થશે. તમારા સાચા વિચારો અને પુરુષાર્થની ચારેય તરફ પ્રશંસા થશે."
  },
  {
    name: "૧૫. અંબે",
    shloka: "ॐ अम्बे अम्बिकेऽम्बालिके न मा नयति कश्चन॥",
    category: "રાહ જુઓ / પ્રતિકૂળ સમય (Wait / Pray)",
    badgeColor: "bg-indigo-600 text-white border-indigo-400",
    meaning: "અત્યારનો સમય નવું સાહસ કે મોટો નિર્ણય લેવા માટે અનુકૂળ નથી. કોઈપણ નવું સાહસ ટાળવું અને રોજ નિયમિત માં અંબાની પૂજા-આરાધના ચાલુ રાખવી."
  }
];

const MANTRA_DEITIES = [
  {
    id: "shiva",
    name: "🔱 ભગવાન શિવ",
    color: "from-sky-700 to-slate-800",
    badgeColor: "bg-sky-50 dark:bg-sky-950/20 text-sky-700 border-sky-200",
    mantras: [
      { name: "ૐ નમઃ શિવાય", defaultCount: 108 },
      { name: "મહામૃત્યુંજય મંત્ર", defaultCount: 108 },
      { name: "શિવ તાંડવ સ્તોત્ર", defaultCount: 1 },
      { name: "શિવ પંચાક્ષર", defaultCount: 108 },
      { name: "રુદ્રાષ્ટક", defaultCount: 1 }
    ]
  },
  {
    id: "vishnu",
    name: "🌸 વિષ્ણુ / કૃષ્ણ",
    color: "from-amber-600 to-yellow-500",
    badgeColor: "bg-amber-50 dark:bg-amber-950/20 text-amber-700 border-amber-200",
    mantras: [
      { name: "ૐ નમો ભગવતે વાસુદેવાય", defaultCount: 108 },
      { name: "હરે કૃષ્ણ મહામંત્ર", defaultCount: 108 },
      { name: "ૐ નમો નારાયણાય", defaultCount: 108 },
      { name: "વિષ્ણુ સહસ્રનામ", defaultCount: 1 },
      { name: "ગોવિંદ નામ", defaultCount: 108 }
    ]
  },
  {
    id: "hanuman",
    name: "🚩 હનુમાનજી",
    color: "from-orange-650 to-red-600",
    badgeColor: "bg-orange-50 dark:bg-orange-950/20 text-orange-700 border-orange-200",
    mantras: [
      { name: "હનુમાન ચાલીસા", defaultCount: 7 },
      { name: "ૐ હં હનુમતે નમઃ", defaultCount: 108 },
      { name: "બજરંગ બાણ", defaultCount: 3 },
      { name: "રામ નામ", defaultCount: 108 }
    ]
  },
  {
    id: "devi",
    name: "🌺 આદિશક્તિ દેવી",
    color: "from-rose-700 to-pink-650",
    badgeColor: "bg-rose-50 dark:bg-rose-950/20 text-rose-700 border-rose-200",
    mantras: [
      { name: "નવાર્ણ મંત્ર", defaultCount: 108 },
      { name: "દુર્ગા ચાલીસા", defaultCount: 7 },
      { name: "સરસ્વતી મંત્ર", defaultCount: 108 },
      { name: "લક્ષ્મી મંત્ર", defaultCount: 108 },
      { name: "ૐ ઐં હ્રીં ક્લીં", defaultCount: 108 },
      { name: "ચામુંડા મંત્ર", defaultCount: 108 },
      { name: "અંબે માં આરતી", defaultCount: 1 }
    ]
  },
  {
    id: "ganesha",
    name: "🐘 ગણેશજી",
    color: "from-amber-700 to-red-500",
    badgeColor: "bg-amber-50 dark:bg-amber-950/20 text-amber-700 border-amber-200",
    mantras: [
      { name: "ૐ ગં ગણપતયે નમઃ", defaultCount: 108 },
      { name: "ગણેશ ચાલીસા", defaultCount: 3 },
      { name: "વક્રતુંડ મહાકાય", defaultCount: 21 },
      { name: "ગણેશ આરતી", defaultCount: 1 }
    ]
  },
  {
    id: "surya",
    name: "☀️ સૂર્ય / ગ્રહ",
    color: "from-yellow-600 to-orange-500",
    badgeColor: "bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 border-yellow-200",
    mantras: [
      { name: "ગાયત્રી મંત્ર", defaultCount: 108 },
      { name: "સૂર્ય નમસ્કાર મંત્ર", defaultCount: 12 },
      { name: "નવગ્રહ મંત્ર", defaultCount: 108 },
      { name: "શનિ મંત્ર", defaultCount: 19 },
      { name: "રાહુ/કેતુ મંત્ર", defaultCount: 18 }
    ]
  },
  {
    id: "ram",
    name: "🏹 પ્રભુ શ્રી રામ",
    color: "from-orange-500 to-amber-600",
    badgeColor: "bg-orange-50 dark:bg-orange-950/20 text-orange-700 border-orange-200",
    mantras: [
      { name: "શ્રી રામ જય રામ", defaultCount: 108 },
      { name: "રામ નામ", defaultCount: 108 },
      { name: "સુંદરકાંડ", defaultCount: 1 },
      { name: "રામ રક્ષા સ્તોત્ર", defaultCount: 1 }
    ]
  },
  {
    id: "universal",
    name: "🌟 સનાતન મંત્રો",
    color: "from-indigo-600 to-purple-650",
    badgeColor: "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 border-indigo-200",
    mantras: [
      { name: "ૐ", defaultCount: 108 },
      { name: "ૐ શાંતિ", defaultCount: 3 },
      { name: "મૃત્યુંજય", defaultCount: 108 },
      { name: "સોહં", defaultCount: 108 }
    ]
  }
];

const TEMPLE_CATEGORIES = [
  { id: 'shiva', name_gu: 'જ્યોતિર્લિંગ અને શિવ', name_en: 'Jyotirlinga & Shiva', emoji: '🔱' },
  { id: 'krishna', name_gu: 'કૃષ્ણ ભક્તિ અને વૈષ્ણવ', name_en: 'Krishna & Vaishnav', emoji: '🚩' },
  { id: 'devi', name_gu: 'શક્તિપીઠ અને માતાજી', name_en: 'Shaktipitha & Devi', emoji: '🌺' },
  { id: 'architecture', name_gu: 'સૂર્ય મંદિર અને સ્થાપત્ય', name_en: 'Architecture & Sun', emoji: '☀️' },
  { id: 'jain', name_gu: 'જૈન તીર્થધામો', name_en: 'Jain Pilgrimages', emoji: '🏺' },
  { id: 'charity', name_gu: 'સેવાધામ અને અન્ય', name_en: 'Charitable & Others', emoji: '📿' }
];

const TEMPLES = [
  // 1. શિવ મંદિરો (Shiva Temples)
  {
    id: "somnath",
    category: "shiva",
    name_gu: "સોમનાથ મહાદેવ",
    name_en: "Somnath Temple",
    location_gu: "પ્રભાસ પાટણ, ગીર સોમનાથ",
    location_en: "Prabhas Patan, Gir Somnath",
    emoji: "🛕",
    highlight_gu: "પ્રથમ જ્યોતિર્લિંગ",
    highlight_en: "1st Jyotirlinga",
    description_gu: "ભગવાન શિવના ૧૨ પવિત્ર જ્યોતિર્લિંગોમાં પ્રથમ સ્થાન ધરાવતું આ ભવ્ય મંદિર ત્રિવેણી સંગમ (કપિલા, હિરણ અને સરસ્વતી નદી) પર આવેલું છે. આ મંદિરનો ઈતિહાસ અત્યંત ગૌરવશાળી છે, જેનું પુનઃનિર્માણ સ્વતંત્રતા બાદ સરદાર વલ્લભભાઈ પટેલના સંકલ્પથી થયું હતું.",
    description_en: "The first among the twelve holy Jyotirlingas of Lord Shiva, situated at the sacred confluence of three rivers. Rebuilt after independence under the guidance of Sardar Vallabhbhai Patel, it stands as a symbol of pride and resilience."
  },
  {
    id: "nageshwar",
    category: "shiva",
    name_gu: "નાગેશ્વર જ્યોતિર્લિંગ",
    name_en: "Nageshwar Temple",
    location_gu: "દ્વારકા નજીક, દેવભૂમિ દ્વારકા",
    location_en: "Near Dwarka, Devbhumi Dwarka",
    emoji: "🔱",
    highlight_gu: "૧૨ જ્યોતિર્લિંગ પૈકીનું એક",
    highlight_en: "One of 12 Jyotirlingas",
    description_gu: "દ્વારકાથી આશરે ૧૭ કિમી દૂર આવેલું આ પવિત્ર જ્યોતિર્લિંગ ધામ છે. પૌરાણિક કથા મુજબ દારૂકા વનમાં રાક્ષસોના ત્રાસથી ભક્તોની રક્ષા કરવા ભગવાન શિવ અહીં પ્રગટ થયા હતા. અહીં ૨૫ ફૂટ ઊંચી શિવજીની ભવ્ય મૂર્તિ વિશેષ આકર્ષણનું કેન્દ્ર છે.",
    description_en: "A highly revered Jyotirlinga shrine located near Dwarka. Legends state Lord Shiva appeared here to save his devotee from the demon Daruka. It features a majestic 25-foot statue of Lord Shiva outdoors."
  },
  {
    id: "koteshwar",
    category: "shiva",
    name_gu: "કોટેશ્વર મહાદેવ",
    name_en: "Koteshwar Temple",
    location_gu: "લખપત સરહદ, કચ્છ",
    location_en: "Lakhpat Border, Kutch",
    emoji: "🛕",
    highlight_gu: "ભારતની પશ્ચિમ સરહદે સ્થિત",
    highlight_en: "Indo-Pak Border Region",
    description_gu: "કચ્છના દરિયા કિનારે સરહદ નજીક આવેલું આ પૌરાણિક મંદિર છે. લોકવાયકા મુજબ રાવણે પોતાની કઠોર તપસ્યાથી શિવજી પાસેથી મેળવેલું આત્મલિંગ અહીં જમીન પર મૂકી દીધું હતું અને તે અહીં જ સ્થાયી થઈ ગયું.",
    description_en: "An ancient Shiva temple situated close to the sea border in Kutch. Legend says Ravana placed the divine Atmalinga here on the ground, and it permanently installed itself at this very spot."
  },
  {
    id: "nishkalank",
    category: "shiva",
    name_gu: "નિષ્કલંક મહાદેવ",
    name_en: "Nishkalank Mahadev",
    location_gu: "કોળિયાક દરિયો, ભાવનગર",
    location_en: "Koliyak Beach, Bhavnagar",
    emoji: "🌊",
    highlight_gu: "દરિયા વચ્ચે સ્વયંભૂ પાંચ શિવલિંગ",
    highlight_en: "Submerged Shivalingas",
    description_gu: "ભાવનગર નજીક કોળિયાક દરિયામાં કિનારેથી ૨ કિમી અંદર આવેલું આ અદ્ભુત મંદિર છે. મહાભારત યુદ્ધ પછી પાંડવોએ પોતાના પાપોની મુક્તિ માટે અહીં કાળા ધ્વજ અને પાંચ શિવલિંગની સ્થાપના કરી હતી, જે માત્ર ઓટના સમયે જ જોઈ શકાય છે.",
    description_en: "A unique temple located 2 km inside the sea near Bhavnagar. Established by the Pandavas to cleanse their sins after the Kurukshetra war, the five Shivalingas are only accessible during low tides."
  },
  // 2. કૃષ્ણ અને વૈષ્ણવ (Krishna & Vaishnav)
  {
    id: "dwarkadhish",
    category: "krishna",
    name_gu: "દ્વારકાધીશ જગત મંદિર",
    name_en: "Dwarkadhish Temple",
    location_gu: "દ્વારકા નગરી, દેવભૂમિ દ્વારકા",
    location_en: "Dwarka City, Devbhumi Dwarka",
    emoji: "🚩",
    highlight_gu: "પવિત્ર ચાર ધામ પૈકીનું એક",
    highlight_en: "One of the Char Dham",
    description_gu: "ભગવાન શ્રીકૃષ્ણની સુવર્ણ નગરી દ્વારકામાં આવેલું આ જગપ્રસિદ્ધ મંદિર પંચાયતન શૈલીમાં અને ૫ માળનું બનેલું છે. ૭૨ સ્તંભો પર આધારિત આ સ્થાપત્ય અને તેના શિખર પર લહેરાતી પંચરંગી ધ્વજા ભક્તોમાં પરમ શ્રદ્ધાનું પ્રતીક છે.",
    description_en: "Dedicated to Lord Krishna as the King of Dwarka. This legendary 5-storied temple, built on 72 pillars, is a major pilgrimage center of the Char Dham circuit, known for its colossal multi-colored flag."
  },
  {
    id: "dakor",
    category: "krishna",
    name_gu: "ડાકોર રણછોડરાયજી મંદિર",
    name_en: "Dakor Temple",
    location_gu: "ડાકોર ટાઉન, ખેડા",
    location_en: "Dakor Town, Kheda",
    emoji: "👑",
    highlight_gu: "ભક્ત બોડાણાની પ્રેમ ભૂમિ",
    highlight_en: "Legend of Bhakta Bodana",
    description_gu: "અહીં ભગવાન શ્રીકૃષ્ણ રણછોડરાયજી સ્વરૂપે બિરાજમાન છે. એવી માન્યતા છે કે ભક્ત બોડાણાની સાચી ભક્તિથી પ્રસન્ન થઈને ભગવાન દ્વારકાથી સ્વયં તેની સાથે ડાકોર આવ્યા હતા અને બદલામાં સોનાથી તોલાયા હતા.",
    description_en: "A prominent temple where Lord Krishna is worshipped as Ranchhodraiji. Legends say Krishna left Dwarka and traveled to Dakor for his absolute devotee Bodana, allowing himself to be weighed against a gold ring."
  },
  {
    id: "shamlaji",
    category: "krishna",
    name_gu: "શામળાજી વિષ્ણુ મંદિર",
    name_en: "Shamlaji Temple",
    location_gu: "મેશ્વો નદી કાંઠે, અરવલ્લી",
    location_en: "Arvalli District",
    emoji: "🌸",
    highlight_gu: "ગદાધર શામળિયા ઠાકોર",
    highlight_en: "11th Century Gadadhar Temple",
    description_gu: "મેશ્વો નદીના કિનારે આવેલું અતિ પ્રાચીન મંદિર છે જ્યાં ભગવાન વિષ્ણુની ચતુર્ભુજ શ્યામ મૂર્તિ બિરાજમાન છે. આ મંદિર તેના ઝીણવટભરી નકશીકામ અને પૌરાણિક શિલ્પકલાના બેજોડ સ્થાપત્ય માટે પ્રખ્યાત છે.",
    description_en: "An ancient Vaishnavite temple housing a beautiful black-stone idol of Lord Vishnu. Situated on the banks of Meswo, it exhibits splendid carvings depicting stories from epics like Ramayana and Mahabharata."
  },
  {
    id: "bhalkatirth",
    category: "krishna",
    name_gu: "ભાલકા તીર્થ",
    name_en: "Bhalka Tirth",
    location_gu: "વેરાવળ રોડ, ગીર સોમનાથ",
    location_en: "Veraval Road, Gir Somnath",
    emoji: "🏹",
    highlight_gu: "શ્રી કૃષ્ણનું નિજધામ ગમન સ્થળ",
    highlight_en: "Krishna's Final Earthly Site",
    description_gu: "સોમનાથ નજીક આવેલું એ પવિત્ર વૃક્ષ સ્થાન છે, જ્યાં પીપળાના ઝાડ નીચે યોગમુદ્રામાં બેઠેલા ભગવાન શ્રીકૃષ્ણને જરા નામના પારધીએ હરણની આંખ સમજીને તીર માર્યું હતું, જેના બાદ તેમણે વૈકુંઠ ગમન કર્યું હતું.",
    description_en: "The historic spot where Lord Krishna was resting under a Banyan tree when a hunter's arrow struck his foot. This location marks the end of Lord Krishna's earthly journey (avatar)."
  },
  // 3. શક્તિપીઠો (Shaktipithas)
  {
    id: "ambaji",
    category: "devi",
    name_gu: "અંબાજી શક્તિપીઠ",
    name_en: "Ambaji Temple",
    location_gu: "આરાસુર ડુંગર, બનાસકાંઠા",
    location_en: "Arasur Hills, Banaskantha",
    emoji: "🌺",
    highlight_gu: "હૃદય શક્તિપીઠ - ભવ્ય વિસાયંત્ર",
    highlight_en: "Heart Shaktipitha",
    description_gu: "ભારતની ૫૧ શક્તિપીઠો પૈકીનું પરમ આસ્થા ધામ છે જ્યાં માં સતીનું હૃદય પડ્યું હતું. અહી કોઈ મૂર્તિ નથી, પરંતુ સોનાના પતરા પર અંકિત શ્રી યંત્રની ભક્તિપૂર્વક પૂજા કરવામાં આવે છે. ગબ્બર પર્વત પર માંની અખંડ જ્યોત પ્રજ્વલિત છે.",
    description_en: "One of the most sacred Shaktipithas where Sati's heart fell. The temple worships a golden 'Visayantra' instead of an idol. Millions visit during Bhadarvi Poonam for worship and traditional garba."
  },
  {
    id: "pavagadh",
    category: "devi",
    name_gu: "પાવાગઢ મહાકાળી મંદિર",
    name_en: "Pavagadh Temple",
    location_gu: "પાવાગઢ પહાડ, પંચમહાલ",
    location_en: "Pavagadh Hill, Panchmahal",
    emoji: "🔱",
    highlight_gu: "ચંપાનેર હેરિટેજ નજીક સ્થિત",
    highlight_en: "Hilltop Shaktipitha",
    description_gu: "પાવાગઢ પર્વતની ઉંચી ખીણ પર આવેલું શક્તિ સ્વરૂપ મહાકાળી માતાજીનું પવિત્ર ધામ છે. ચંપાનેર ઐતિહાસિક શહેર નજીક પથરાયેલી આ ટેકરી શ્રદ્ધાળુઓ અને પ્રવાસીઓ માટે રોપવે અને પદયાત્રા માર્ગથી આકર્ષણનું કેન્દ્ર બનેલી છે.",
    description_en: "Goddess Mahakali's shrine situated on the peak of Pavagadh Hill. It is a key spiritual center overlooking the historical ruins of Champaner, accessible by foot or ropeway."
  },
  {
    id: "bahucharaji",
    category: "devi",
    name_gu: "બહુચરાજી શક્તિપીઠ",
    name_en: "Bahucharaji Temple",
    location_gu: "બહુચરાજી ટાઉન, મહેસાણા",
    location_en: "Becharaji, Mehesana",
    emoji: "🐓",
    highlight_gu: "કૂકડા વાહન અને બાળ મુંડન સંસ્કાર",
    highlight_en: "Traditional Tonsure Center",
    description_gu: "આ પવિત્ર શક્તિપીઠ છે જ્યાં માં સતીના હાથનો ભાગ પડ્યો હતો. માં બહુચર કૂકડાના વાહન પર સવારી કરે છે. અહીં બાળકોના બાબરી (મુંડન) સંસ્કાર કરાવવાની વર્ષો જૂની પવિત્ર પરંપરા છે.",
    description_en: "A major Shaktipitha where Sati's hand fell. Goddess Bahuchara is seated on a rooster. The temple is especially popular for hosting traditional hair-cutting (tonsure) ceremonies of toddlers."
  },
  {
    id: "chotila",
    category: "devi",
    name_gu: "ચોટીલા ચામુંડા માતાજી",
    name_en: "Chotila Hill Temple",
    location_gu: "ચોટીલા ડુંગર, સુરેન્દ્રનગર",
    location_en: "Chotila Hill, Surendranagar",
    emoji: "⛰️",
    highlight_gu: "૬૫૦+ પગથિયાં વાળો પર્વત",
    highlight_en: "Volcanic Hill Temple",
    description_gu: "રાજકોટ-અમદાવાદ હાઇવે પર આવેલા ચોટીલા પર્વતની ટોચ પર માં ચામુંડાનું ભવ્ય મંદિર છે. આશરે ૬૫૦ થી વધુ પગથિયાં ચડીને ભક્તો પર્વતના શિખરે બિરાજમાન આદિશક્તિના દર્શન કરવા પહોંચે છે.",
    description_en: "A famous temple of Goddess Chamunda located atop a high volcanic hill in Chotila. Pilgrims climb over 600 stone steps to reach the shrine and experience breathtaking views."
  },
  {
    id: "khodiyarmata",
    category: "devi",
    name_gu: "ખોડલધામ (કાગવડ)",
    name_en: "Khodaldham Temple",
    location_gu: "કાગવડ ગામ, રાજકોટ",
    location_en: "Kagvad Village, Rajkot",
    emoji: "🐊",
    highlight_gu: "મહાન શિલ્પકલા ધરાવતું સંકુલ",
    highlight_en: "Grand Patidar Cultural Monument",
    description_gu: "લેઉવા પટેલ સમાજના આસ્થાના પ્રતીક સમાન આ વિશાળ ખોડલધામ મંદિર છે જેની અદ્ભુત શિલ્પકલા અને નકશીકામ જોવાલાયક છે. માં ખોડિયાર મગરના વાહન સાથે સમગ્ર ગુજરાત અને રાજસ્થાનના શ્રદ્ધાળુઓનું પરમ કેન્દ્ર છે.",
    description_en: "A massive, beautifully crafted stone temple complex dedicated to Goddess Khodiyar. Built by the Patidar community, it features extensive cultural exhibitions and lush gardens."
  },
  // 4. સ્થાપત્ય અને સૂર્ય (Architecture & Sun)
  {
    id: "modhera_sun",
    category: "architecture",
    name_gu: "મોઢેરા સૂર્ય મંદિર",
    name_en: "Modhera Sun Temple",
    location_gu: "મોઢેરા ગામ, મહેસાણા",
    location_en: "Modhera Village, Mehesana",
    emoji: "☀️",
    highlight_gu: "સોલંકી સ્થાપત્ય અને મોટો કુંડ",
    highlight_en: "UNESCO Tentative Site",
    description_gu: "સોલંકી વંશના રાજા ભીમદેવ પ્રથમ દ્વારા ૧૦૨૬ ઈ.સ. માં નિર્મિત આ સૂર્ય મંદિર તેની અજોડ કોતરણી અને સૂર્યકુંડ માટે વિશ્વભરમાં પ્રખ્યાત છે. અહીં વર્ષમાં વિષુવવૃત્ત (Equinox) ના દિવસે સૂર્યનું પ્રથમ કિરણ સીધું ગર્ભગૃહના સૂર્યબિંબ પર પડતું હતું.",
    description_en: "An architectural masterpiece built in 1026 AD by King Bhimdev I of the Solanki dynasty. Dedicated to the Sun God, it features an ornate stepped reservoir and a pillared assembly hall."
  },
  {
    id: "akshardham",
    category: "architecture",
    name_gu: "ગાંધીનગર અક્ષરધામ",
    name_en: "Akshardham Temple",
    location_gu: "સેક્ટર ૨૦, ગાંધીનગર",
    location_en: "Sector 20, Gandhinagar",
    emoji: "🏛️",
    highlight_gu: "કલા અને આધુનિક પ્રદર્શન શો",
    highlight_en: "Cultural & Heritage Oasis",
    description_gu: "પિંક સેન્ડસ્ટોન (ગુલાબી પથ્થર) માંથી બનેલું આ વિશાળ સ્વામિનારાયણ મંદિર આધ્યાત્મિકતા અને ભારતીય કલાનું ઉત્તમ ઉદાહરણ છે. અહીંના હાઇ-ટેક પ્રદર્શન શો, સુંદર સરોવર અને વોટર પ્રદર્શન શો પ્રવાસીઓને મંત્રમુગ્ધ કરે છે.",
    description_en: "A magnificent pink sandstone temple complex displaying traditional Hindu architecture and cultural exhibitions. Known for its gorgeous landscaping, interactive galleries, and light-water show."
  },
  // 5. જૈન તીર્થધામો (Jain Pilgrimages)
  {
    id: "palitana",
    category: "jain",
    name_gu: "પાલિતાણા શત્રુંજય તીર્થ",
    name_en: "Palitana Jain Temples",
    location_gu: "શત્રુંજય પર્વત, ભાવનગર",
    location_en: "Shatrunjaya Hills, Bhavnagar",
    emoji: "🏺",
    highlight_gu: "૮६૩ થી વધુ આરસના દેરાસર",
    highlight_en: "World's Largest Temple Cluster",
    description_gu: "જૈન શ્રદ્ધાળુઓનું પરમ પવિત્ર મોક્ષ ધામ છે. શત્રુંજય ડુંગર પર ૮૬૩ થી પણ વધુ ભવ્ય આરસપહાણથી કંડારેલા જૈન દેરાસરો આવેલા છે. ૩૮૦૦ થી વધુ પગથિયાં ચડીને આવવું એ જૈન શ્રદ્ધાળુઓની જીવનની મુખ્ય પદયાત્રા માનવામાં આવે છે.",
    description_en: "The holiest pilgrimage for Jainism, containing over 863 beautifully carved marble shrines on Shatrunjaya Hill. Reaching the peak requires climbing over 3,800 steps."
  },
  {
    id: "girnar_jain",
    category: "jain",
    name_gu: "ગિરનાર જૈન દેરાસર",
    name_en: "Girnar Jain Temples",
    location_gu: "ગિરનાર પર્વત, જૂનાગઢ",
    location_en: "Girnar Hill, Junagadh",
    emoji: "⛰️",
    highlight_gu: "ભગવાન નેમિનાથની નિર્વાણ ભૂમિ",
    highlight_en: "Lord Neminath's Shrine",
    description_gu: "ગિરનાર પર્વતના પ્રથમ શિખરથી દત્ત શિખર વચ્ચે પથરાયેલા જૈન દેરાસરોમાં ૨૨મા તીર્થંકર ભગવાન નેમિનાથનું પ્રમુખ મંદિર આવેલું છે. આ પથ્થરો કોતરીને બનાવેલી દેરીઓ જૈન અને હિન્દુ ધર્મના ઐતિહાસિક સમન્વયનું સાક્ષી છે.",
    description_en: "An ancient group of shrines dedicated to the 22nd Jain Tirthankar, Lord Neminath. Carved in fine stone on the steep slopes of Mount Girnar, offering a divine mountain trek."
  },
  {
    id: "taranga",
    category: "jain",
    name_gu: "તારંગા અજીતનાથ દેરાસર",
    name_en: "Taranga Jain Temple",
    location_gu: "તારંગા હિલ્સ, મહેસાણા",
    location_en: "Taranga Hills, Mehesana",
    emoji: "🛕",
    highlight_gu: "રાજા કુમારપાળ નિર્મિત ભવ્ય મંદિર",
    highlight_en: "12th Century Solanki Architecture",
    description_gu: "તારંગા પહાડીઓની વચ્ચે આવેલું આ ૧૨મી સદીનું ઐતિહાસિક દેરાસર છે જે દ્વિતીય તીર્થંકર અજીતનાથ પ્રભુને સમર્પિત છે. રાજા કુમારપાળે બંધાવેલું આ સ્થાપત્ય જૈન ધર્મના ગુરુઓની આરાધના માટેનું અત્યંત શાંત ધામ છે.",
    description_en: "A beautiful 12th-century temple nestled among hills, dedicated to Lord Ajitnath. Constructed by the Solanki King Kumarapala, it stands as a prime example of historical stone carving."
  },
  {
    id: "shankheshwar",
    category: "jain",
    name_gu: "શંખેશ્વર પાર્શ્વનાથ તીર્થ",
    name_en: "Shankheshwar Temple",
    location_gu: "શંખેશ્વર ટાઉન, પાટણ",
    location_en: "Shankheshwar Town, Patan",
    emoji: "🐚",
    highlight_gu: "મહા પ્રભાવશાળી પાર્શ્વનાથ પ્રભુ",
    highlight_en: "Ancient Pilgrimage Center",
    description_gu: "જૈન ધર્મના ૨૩મા તીર્થંકર ભગવાન પાર્શ્વનાથનું આ અતિ પ્રભાવશાળી અને આરાધનાથી સમૃદ્ધ મુખ્ય મનાતું ધામ છે. વર્ષોથી દેશભરમાંથી ભક્તો અહીં અઠ્ઠાઈ તપ અને વિશેષ પવિત્ર જૈન અનુષ્ઠાન માટે પધારે છે.",
    description_en: "An ancient and highly revered Jain shrine dedicated to Lord Parshvanath. It is a global center for spiritual learning, meditation, and rigorous traditional Jain penance."
  },
  // 6. સેવાધામ અને અન્ય (Charity & Others)
  {
    id: "virpur",
    category: "charity",
    name_gu: "જલારામ બાપા મંદિર (વીરપુર)",
    name_en: "Jalaram Bapa Temple",
    location_gu: "વીરપુર ગામ, રાજકોટ",
    location_en: "Virpur Village, Rajkot",
    emoji: "📿",
    highlight_gu: "જ્યાં દાન સ્વીકારાતું નથી",
    highlight_en: "Zero-Donation Sadavrat",
    description_gu: "સંત શિરોમણી જલારામ બાપાની પવિત્ર પૂજ્ય ભૂમિ છે. અહીં છેલ્લા ૧૫૦ વર્ષથી વધુ સમયથી અવિરત 'સદાવ્રત' (મફત ભોજન સેન્ટર) ચાલે છે. વર્ષ ૨૦૦૦ થી આ મંદિરમાં દેશ કે વિદેશના કોઈ પણ ભક્ત પાસેથી એક પણ રૂપિયો દાન લેવાનું સંપૂર્ણ બંધ છે.",
    description_en: "The divine shrine of Saint Jalaram Bapa. It runs a massive daily community kitchen (Sadavrat) that feeds all visitors. Remarkably, since 2000, it accepts no donations or offerings."
  },
  {
    id: "satadhar",
    category: "charity",
    name_gu: "પરબ વાવડી અને સતાધાર",
    name_en: "Satadhar & Parab Dham",
    location_gu: "ગીર સરહદ, જુનાગઢ",
    location_en: "Gir Region, Junagadh",
    emoji: "🪔",
    highlight_gu: "ગરીબો અને ગાયોની પરમ સેવા",
    highlight_en: "Saint Devidas's Sevadham",
    description_gu: "સંત દેવીદાસ બાપુ અને ગીગા બાપાના આ પવિત્ર આશ્રમો છે જે ગરીબો અને રક્તપિત્તના દર્દીઓની નિઃસ્વાર્થ સેવા માટે જાણીતા છે. અહીં ગાયોની રક્ષા અને ૨૪ કલાક ભક્તો માટે ચાલતું સદાવ્રત એ સૌરાષ્ટ્રની લોક સંસ્કૃતિનું મોટું ઉદાહરણ છે.",
    description_en: "Holy ashrams established by Saint Devidas and Giga Bapa, dedicated to serving the poor, curing leprosy patients, and housing stray cows, run entirely on community volunteerism."
  },
  {
    id: "sarangpur_hanuman",
    category: "charity",
    name_gu: "સાળંગપુર કષ્ટભંજન દેવ",
    name_en: "Sarangpur Hanumanji",
    location_gu: "સાળંગપુર ગામ, બોટાદ",
    location_en: "Sarangpur, Botad",
    emoji: "🐵",
    highlight_gu: "૫૪ ફૂટ ઊંચી કાંસ્ય પ્રતિમા",
    highlight_en: "Grand Bronze Statue",
    description_gu: "સ્વામિનારાયણ સંપ્રદાય હસ્તકનું આ જગવિખ્યાત હનુમાનજીનું મંદિર છે. ગોપાળાનંદ સ્વામી દ્વારા પ્રતિષ્ઠિત આ મૂર્તિ ભક્તોના સર્વ વિઘ્નો અને નકારાત્મક અસરો દૂર કરનારી મનાય છે. પરિસરમાં 'કિંગ ઓફ સાળંગપુર' નામે ૫૪ ફૂટ ઊંચી પ્રતિમા આવેલી છે.",
    description_en: "A massive, powerful shrine dedicated to Lord Hanuman, believed to eliminate obstacles and negative energy. Features a stunning 54-foot tall bronze statue of Hanuman."
  },
  {
    id: "bhadkeshwar",
    category: "charity",
    name_gu: "ભદકેશ્વર મહાદેવ",
    name_en: "Bhadkeshwar Temple",
    location_gu: "દ્વારકા દરિયો, દેવભૂમિ દ્વારકા",
    location_en: "Dwarka Coast, Devbhumi Dwarka",
    emoji: "🌊",
    highlight_gu: "દરીયાઈ પહાડી પર બનેલ શિવ ગુફા",
    highlight_en: "Sea-Submerged Path",
    description_gu: "દ્વારકાના સમુદ્ર કિનારે એક પહાડી પર બનેલું શિવજીનું સુંદર સ્થાન છે. પૌરાણિક કથા મુજબ શિવલિંગ સ્વયંભૂ પ્રગટ થયું હતું. ભરતીના સમયે દરિયાઈ મોજાં શિવલિંગ પર જળાભિષેક કરે છે તે સમયનું દ્રશ્ય અતિ નયનરમ્ય બને છે.",
    description_en: "A picturesque Shiva temple located on a hillock in the Arabian Sea. During high tides, sea waves naturally wash over the Shivalinga, and the walking bridge gets submerged."
  }
];

const DevotionalHub = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [count, setCount] = useState(108);
  const [playingStory, setPlayingStory] = useState(null);
  const [activeOracle, setActiveOracle] = useState('ram'); // 'ram' or 'durga'
  const [showTemplesModal, setShowTemplesModal] = useState(false);
  const [activeTempleCategory, setActiveTempleCategory] = useState('shiva');
  const [highlightedTempleId, setHighlightedTempleId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get('section') || params.get('feature');
    const templeId = params.get('templeId');
    if (section === 'ram-shalaka') {
      setActiveOracle('ram');
    } else if (section === 'durga-prashnavali') {
      setActiveOracle('durga');
    } else if (section === 'temples') {
      setShowTemplesModal(true);
      if (templeId) {
        setHighlightedTempleId(templeId);
        const tObj = TEMPLES.find(t => t.id === templeId);
        if (tObj) {
          setActiveTempleCategory(tObj.category);
          setTimeout(() => {
            const el = document.getElementById(`temple-${templeId}`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 350);
        }
      }
    }
  }, [location]);
  const [showRules, setShowRules] = useState(false);

  // --- MANTRA JAAP HUB STATES ---
  const [mantraScreen, setMantraScreen] = useState('deity'); // 'deity' | 'mantra' | 'target' | 'active' | 'certificate'
  const [selectedDeity, setSelectedDeity] = useState(null);
  const [selectedMantra, setSelectedMantra] = useState(null);
  const [mantraTarget, setMantraTarget] = useState(108);
  const [mantraCount, setMantraCount] = useState(0);
  const [completedMalas, setCompletedMalas] = useState(0);
  const [motionActive, setMotionActive] = useState(false);
  const [streakCount, setStreakCount] = useState(() => {
    return parseInt(localStorage.getItem('mantra_streak') || '0', 10);
  });
  const [communityCount, setCommunityCount] = useState(() => {
    // Generate a beautiful, realistic dynamic initial community count
    const base = 18420 + Math.floor(Math.random() * 150);
    return base;
  });

  // Simulated live update of community counts to make the app feel alive and viral!
  useEffect(() => {
    const interval = setInterval(() => {
      setCommunityCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Programmatic, ultra-realistic synthesizer for Temple Bell sound to ensure 100% offline and browser compatibility without loading external MP3 files!
  const playTempleBell = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Main strike node
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4 note for clear bell
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 1.5);
      
      // Overtones for rich resonance
      const overtone1 = ctx.createOscillator();
      const overtoneGain1 = ctx.createGain();
      overtone1.type = 'sine';
      overtone1.frequency.setValueAtTime(880, ctx.currentTime); // Octave higher
      overtoneGain1.gain.setValueAtTime(0.3, ctx.currentTime);
      overtoneGain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      
      const overtone2 = ctx.createOscillator();
      const overtoneGain2 = ctx.createGain();
      overtone2.type = 'sine';
      overtone2.frequency.setValueAtTime(1320, ctx.currentTime); // Perfect fifth overtone
      overtoneGain2.type = 'sine';
      overtoneGain2.gain.setValueAtTime(0.15, ctx.currentTime);
      overtoneGain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      gainNode.gain.setValueAtTime(0.8, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0); // Slow decay ring
      
      osc.connect(gainNode);
      overtone1.connect(overtoneGain1);
      overtoneGain1.connect(gainNode);
      overtone2.connect(overtoneGain2);
      overtoneGain2.connect(gainNode);
      
      gainNode.connect(ctx.destination);
      
      osc.start();
      overtone1.start();
      overtone2.start();
      
      osc.stop(ctx.currentTime + 2.0);
      overtone1.stop(ctx.currentTime + 2.0);
      overtone2.stop(ctx.currentTime + 2.0);
    } catch (e) {
      console.warn("AudioContext failed:", e);
    }
  };

  // Programmatic, subtle micro-click/tick sound for each manual tap
  const playClickSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  };

  // Japa Incrementation logic (supports sound playing and transition to certificate)
  const incrementJapa = () => {
    playClickSound();
    setMantraCount(prev => {
      const next = prev + 1;
      if (next >= mantraTarget) {
        // Completion flow!
        playTempleBell();
        handleCompletion();
        return mantraTarget;
      }
      // Calculate finished Malas
      if (next % 108 === 0) {
        setCompletedMalas(m => m + 1);
        playTempleBell(); // Play a bell for each completed Mala!
      }
      return next;
    });
  };

  // Gyroscope Wave Listener
  useEffect(() => {
    if (!motionActive || mantraScreen !== 'active') return;

    let lastUpdate = 0;
    const threshold = 12; // shake acceleration threshold

    const handleMotion = (event) => {
      const acc = event.acceleration || event.accelerationIncludingGravity;
      if (!acc) return;

      const currTime = Date.now();
      if ((currTime - lastUpdate) > 800) { // Debounce by 800ms
        lastUpdate = currTime;

        const x = acc.x || 0;
        const y = acc.y || 0;
        const z = acc.z || 0;

        const speed = Math.sqrt(x*x + y*y + z*z);
        if (speed > threshold) {
          incrementJapa();
        }
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [motionActive, mantraScreen, mantraTarget]);

  // Handle Streak calculation and save on completion
  const handleCompletion = () => {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('mantra_last_date');
    let nextStreak = streakCount;

    if (lastDate !== today) {
      if (lastDate === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()) {
        // Converted next day
        nextStreak += 1;
      } else if (!lastDate) {
        // First time
        nextStreak = 1;
      } else {
        // Streak broken, restart
        nextStreak = 1;
      }
      localStorage.setItem('mantra_streak', nextStreak.toString());
      localStorage.setItem('mantra_last_date', today);
      setStreakCount(nextStreak);
    }
    
    setMantraScreen('certificate');
  };

  const resetMantraJapa = () => {
    setMantraCount(0);
    setCompletedMalas(0);
    setMotionActive(false);
    setMantraScreen('deity');
  };
  
  // Ram Shalaka States
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [showResult, setShowResult] = useState(false);

  // Durga Prashnavali States
  const [selectedDurgaIdx, setSelectedDurgaIdx] = useState(null);
  const [durgaAnimating, setDurgaAnimating] = useState(false);
  const [durgaHighlightedCells, setDurgaHighlightedCells] = useState([]);
  const [durgaShowResult, setDurgaShowResult] = useState(false);

  const startShalakaQuery = (idx) => {
    if (animating || showResult) return;
    setSelectedIdx(idx);
    setAnimating(true);
    setHighlightedCells([idx]);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < 9) {
        const nextIdx = (idx + step * 9) % 225;
        setHighlightedCells(prev => [...prev, nextIdx]);
      } else {
        clearInterval(interval);
        setAnimating(false);
        setShowResult(true);
      }
    }, 200);
  };

  const resetShalaka = () => {
    setSelectedIdx(null);
    setAnimating(false);
    setHighlightedCells([]);
    setShowResult(false);
  };

  const startDurgaQuery = (idx) => {
    if (durgaAnimating || durgaShowResult) return;
    setSelectedDurgaIdx(idx);
    setDurgaAnimating(true);
    setDurgaHighlightedCells([idx]);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < 6) {
        const nextIdx = (idx + step * 3) % 15;
        setDurgaHighlightedCells(prev => [...prev, nextIdx]);
      } else {
        clearInterval(interval);
        setDurgaAnimating(false);
        setDurgaShowResult(true);
      }
    }, 200);
  };

  const resetDurga = () => {
    setSelectedDurgaIdx(null);
    setDurgaAnimating(false);
    setDurgaHighlightedCells([]);
    setDurgaShowResult(false);
  };


  const [festivals, setFestivals] = useState([
    { title: "રથસપ્તમી", date: "૨૫ જાન્યુઆરી", month: "મહા સુદ ૭", day: "રવિવાર", image: "https://images.unsplash.com/photo-1590059536060-65c2765d774d?auto=format&fit=crop&q=80&w=400", story: "આ દિવસે સૂર્ય દેવનો જન્મ થયો હતો. આથી તેને સૂર્ય જયંતી પણ કહેવાય છે." },
    { title: "મહાશિવરાત્રિ", date: "૧૫ ફેબ્રુઆરી", month: "મહા વદ ૧૩", day: "રવિવાર", image: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&q=80&w=400", story: "આ શિવ અને શક્તિના મિલનની રાત્રિ છે." },
    { title: "મકરસંક્રાંતિ", date: "૧૪ જાન્યુઆરી", month: "પોષ વદ ૧૧", day: "બુધવાર", image: "https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?auto=format&fit=crop&q=80&w=400", story: "સૂર્ય ધન રાશિમાંથી મકર રાશિમાં પ્રવેશ કરે છે." }
  ]);

  const increment = () => setCount(prev => prev + 1);
  const reset = () => setCount(0);

  const handleStoryPlay = (fest) => {
    if (playingStory === fest.title) {
        setPlayingStory(null);
    } else {
        setPlayingStory(fest.title);
        const speech = new SpeechSynthesisUtterance(fest.story);
        speech.lang = 'gu-IN';
        window.speechSynthesis.speak(speech);
        speech.onend = () => setPlayingStory(null);
    }
  };

  const stotras = [
    { title: "હનુમાન ચાલીસા", artist: "ગુલશન કુમાર", time: "09:41", icon: "play_circle", active: true },
    { title: "શિવ તાંડવ સ્તોત્ર", artist: "શંકર મહાદેવન", time: "12:20", icon: "audiotrack" },
    { title: "વૈષ્ણવ જન તો", artist: "નરસિંહ મહેતા", time: "06:15", icon: "audiotrack" },
  ];

  return (
    <div className="animate-fade-in space-y-10 pb-12">
      {/* Featured Festivals Section - KEPT AS TEAL/MAROON AS REQUESTED Header */}
      <section id="festivals-section" className="space-y-6">
        <div className="relative bg-teal p-8 rounded-[2.5rem] text-white shadow-xl overflow-hidden group">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-maroon"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-maroon"></div>
            
            <div className="relative flex justify-between items-center z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h2 className="font-gujarati font-black text-3xl">તહેવાર-વ્રતો</h2>
                        <ShareButton sectionId="festivals-section" successMessage="📅 તહેવાર-વ્રતો વિભાગની ડાયરેક્ટ લિંક કોપી થઈ ગઈ છે!" />
                    </div>
                    <p className="font-gujarati text-white/70 text-sm">આ મહિનાના વિશેષ દિવસો</p>
                </div>
                <span className="material-symbols-outlined text-4xl text-white/50">event_available</span>
            </div>
        </div>
        
        <div className="space-y-4">
            {festivals.map((fest, idx) => (
                <div key={idx} className="flex gap-4 p-5 bg-white rounded-3xl shadow-sm border border-teal/5 group border-l-8 border-l-maroon">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                        <img src={fest.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={fest.title} />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                        <p className="font-gujarati text-maroon text-xs font-bold uppercase tracking-wider">{fest.date} • {fest.month}</p>
                        <h4 className="font-gujarati font-black text-2xl text-teal mt-1">{fest.title}</h4>
                        <button 
                            onClick={() => handleStoryPlay(fest)}
                            className={`mt-2 flex items-center gap-2 font-gujarati text-sm font-bold ${playingStory === fest.title ? 'text-teal font-black animate-pulse' : 'text-outline hover:text-maroon'} transition-colors`}
                        >
                            <span className="material-symbols-outlined text-xl">{playingStory === fest.title ? 'equalizer' : 'record_voice_over'}</span>
                            {playingStory === fest.title ? 'વાર્તા સંભળાઈ રહી છે...' : 'દાદીમાની વાર્તા સાંભળો'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* Live Mandir Darshan Section - REVERTED TO BROWN Header */}
      <section id="mandir-section" className="space-y-6">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <h2 className="font-gujarati font-black text-3xl text-primary">લાઈવ મંદિર દર્શન</h2>
                <ShareButton sectionId="mandir-section" successMessage="🪔 લાઈવ મંદિર દર્શન વિભાગની ડાયરેક્ટ લિંક કોપી થઈ ગઈ છે!" />
            </div>
            <button className="text-outline text-sm font-gujarati font-bold">બધા જુઓ</button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            <div className="flex-shrink-0 w-72 h-[450px] relative rounded-[2.5rem] overflow-hidden shadow-2xl group">
                <img src="https://images.unsplash.com/photo-1590059536060-65c2765d774d?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Somnath" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute top-6 left-6 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1 uppercase">
                    <span className="h-2 w-2 bg-white rounded-full animate-pulse"></span> LIVE
                </div>
                <div className="absolute bottom-10 left-8 space-y-1">
                    <h3 className="font-gujarati font-black text-4xl text-white">સોમનાથ મહાદેવ</h3>
                    <p className="font-gujarati text-white/70 text-lg">પ્રભાસ પાટણ, વેરાવળ</p>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="w-48 h-[217px] relative rounded-[2.5rem] overflow-hidden shadow-xl group">
                    <img src="https://images.unsplash.com/photo-1620131448661-0422d36f2fca?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Dwarka" />
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute bottom-6 left-6 text-white font-gujarati font-black text-xl leading-tight">દ્વારકાધીશ<br/>મંદિર</div>
                </div>
                <div className="w-48 h-[217px] relative rounded-[2.5rem] overflow-hidden shadow-xl group">
                    <img src="https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Ambaji" />
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute bottom-6 left-6 text-white font-gujarati font-black text-xl leading-tight">અંબાજી<br/>શક્તિપીઠ</div>
                </div>
            </div>
        </div>
      </section>

      {/* Kuldevi Guide Banner */}
      <section id="kuldevi-section" className="space-y-6">
        <div 
          onClick={() => navigate('/kuldevi')}
          className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-red-650 p-6 sm:p-8 rounded-[2.5rem] text-white shadow-xl overflow-hidden group cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all duration-305 border-2 border-amber-500/20"
        >
          {/* Decorative Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="absolute -right-10 -bottom-10 opacity-15 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[150px]" style={{ fontVariationSettings: "'FILL' 1" }}>brightness_5</span>
          </div>
          
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 z-10">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-3">
                <span className="bg-amber-500/25 text-amber-200 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-gujarati font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  નવું ફીચર
                </span>
                <ShareButton 
                  sectionId="kuldevi-section" 
                  successMessage="🌸 કુળદેવી માર્ગદર્શિકાની ડાયરેક્ટ લિંક કોપી થઈ ગઈ છે!" 
                  className="bg-white/10 hover:bg-white/20 border-white/20 text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white"
                />
              </div>
              <h2 className="font-gujarati font-black text-2xl sm:text-3xl text-yellow-300">માતાજીનો ઇતિહાસ અને કુળદેવી માર્ગદર્શિકા</h2>
              <p className="font-gujarati text-white/90 text-sm leading-relaxed">
                ૧૬ મુખ્ય માતાજીનો ઇતિહાસ, પૂજા વિધિ, નૈવેદ્ય, મંત્રો અને જ્ઞાતિ/અટક મુજબ કુળદેવી તથા તેમના મુખ્ય ધામની સંપૂર્ણ માહિતી.
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="bg-white/20 hover:bg-white/30 text-white font-gujarati font-black px-6 py-3 rounded-2xl flex items-center gap-2 border border-white/30 shadow-md group-hover:translate-x-1 transition-all">
                <span>માર્ગદર્શિકા જુઓ</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Famous Temples of Gujarat Banner */}
      <section id="temples-section" className="space-y-6">
        <div 
          onClick={() => { setShowTemplesModal(true); playTempleBell(); }}
          className="relative bg-gradient-to-r from-rose-900 via-red-950 to-orange-950 p-6 sm:p-8 rounded-[2.5rem] text-white shadow-xl overflow-hidden group cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all duration-305 border-2 border-amber-500/20"
        >
          {/* Decorative Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="absolute -right-10 -bottom-10 opacity-15 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[150px]" style={{ fontVariationSettings: "'FILL' 1" }}>temple_hindu</span>
          </div>
          
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 z-10">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-3">
                <span className="bg-amber-500/25 text-amber-200 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-gujarati font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  પ્રસિદ્ધ યાત્રાધામો
                </span>
                <ShareButton 
                  sectionId="temples" 
                  successMessage="🛕 ગુજરાતના પ્રસિદ્ધ મંદિરો વિભાગની ડાયરેક્ટ લિંક કોપી થઈ ગઈ છે!" 
                  className="bg-white/10 hover:bg-white/20 border-white/20 text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <h2 className="font-gujarati font-black text-2xl sm:text-3xl text-yellow-300">ગુજરાતના પ્રસિદ્ધ મંદિરો (Famous Temples of Gujarat)</h2>
              <p className="font-gujarati text-white/90 text-sm leading-relaxed">
                ગુજરાતના ૨૪+ પરમ પૂજનીય અને ઐતિહાસિક મંદિરોનો ભવ્ય ઇતિહાસ, સ્થાપત્ય અને ધાર્મિક મહત્વ વિશે જાણો.
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="bg-white/20 hover:bg-white/30 text-white font-gujarati font-black px-6 py-3 rounded-2xl flex items-center gap-2 border border-white/30 shadow-md group-hover:translate-x-1 transition-all">
                <span>દર્શન કરો</span>
                <span className="material-symbols-outlined text-lg">temple_hindu</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sacred Oracle Hub (Interactive Ram Shalaka & Durga Prashnavali Grid) */}
      <section id="oracle-section" className="space-y-6 relative">
        <div id="ram-shalaka" className="absolute -mt-24"></div>
        <div id="durga-prashnavali" className="absolute -mt-24"></div>
        <div className={`relative p-8 rounded-[2.5rem] text-white shadow-xl overflow-hidden group transition-all duration-500 ${activeOracle === 'ram' ? 'bg-gradient-to-r from-orange-600 to-amber-500' : 'bg-gradient-to-r from-rose-800 to-red-600'}`}>
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
            <div className={`absolute top-0 left-0 right-0 h-1.5 transition-colors duration-500 ${activeOracle === 'ram' ? 'bg-yellow-400' : 'bg-amber-300'}`}></div>
            <div className={`absolute bottom-0 left-0 right-0 h-1.5 transition-colors duration-500 ${activeOracle === 'ram' ? 'bg-yellow-400' : 'bg-amber-300'}`}></div>
            
            <div className="relative flex justify-between items-center z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h2 className="font-gujarati font-black text-3xl">
                            {activeOracle === 'ram' ? "શ્રી રામ શલાકા" : "દુર્ગા સપ્તશતી પ્રશ્નાવલી"}
                        </h2>
                        <ShareButton 
                          sectionId={activeOracle === 'ram' ? 'ram-shalaka' : 'durga-prashnavali'} 
                          successMessage={activeOracle === 'ram' ? '🏹 શ્રી રામ શલાકાની ડાયરેક્ટ લિંક કોપી થઈ ગઈ છે!' : '🔱 માં દુર્ગા પ્રશ્નાવલીની ડાયરેક્ટ લિંક કોપી થઈ ગઈ છે!'}
                          className="bg-white/10 hover:bg-white/20 border-white/20 text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white"
                        />
                    </div>
                    <p className="font-gujarati text-white/80 text-sm">
                        {activeOracle === 'ram' ? "રામચરિતમાનસ પ્રશ્નાવલી" : "માં દુર્ગા ભગવતી પ્રશ્નાવલી"}
                    </p>
                </div>
                <span className="material-symbols-outlined text-4xl text-white/50 animate-pulse">
                    {activeOracle === 'ram' ? "temple_hindu" : "brightness_5"}
                </span>
            </div>
        </div>

        {/* Segmented Toggle Control */}
        <div className="flex bg-stone-100 dark:bg-stone-900 p-1.5 rounded-3xl max-w-md mx-auto shadow-inner border border-stone-200/50 dark:border-stone-800">
            <button 
                onClick={() => { setActiveOracle('ram'); resetShalaka(); resetDurga(); }} 
                className={`flex-1 py-3.5 px-4 rounded-2xl text-sm font-gujarati font-black transition-all flex items-center justify-center gap-2 ${activeOracle === 'ram' ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'}`}
            >
                <span className="material-symbols-outlined text-lg">temple_hindu</span>
                🏹 શ્રી રામ શલાકા
            </button>
            <button 
                onClick={() => { setActiveOracle('durga'); resetShalaka(); resetDurga(); }} 
                className={`flex-1 py-3.5 px-4 rounded-2xl text-sm font-gujarati font-black transition-all flex items-center justify-center gap-2 ${activeOracle === 'durga' ? 'bg-gradient-to-r from-rose-700 to-red-600 text-white shadow-md' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'}`}
            >
                <span className="material-symbols-outlined text-lg">brightness_5</span>
                🔱 દુર્ગા પ્રશ્નાવલી
            </button>
        </div>

        {/* Expandable Info Panel Button */}
        <div className="max-w-md mx-auto text-center">
            <button 
                onClick={() => setShowRules(prev => !prev)}
                className={`px-6 py-2.5 rounded-full text-xs font-gujarati font-black tracking-wider shadow-sm transition-all duration-300 flex items-center justify-center gap-2 mx-auto border ${showRules ? 'bg-amber-100 border-amber-300 text-amber-950 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200' : 'bg-stone-50 hover:bg-stone-100 border-stone-200 dark:bg-stone-900/60 dark:border-stone-800 dark:text-stone-300 text-stone-700'}`}
            >
                <span className="material-symbols-outlined text-base animate-pulse">menu_book</span>
                {showRules ? "📖 ઉપયોગ વિધિ અને નિયમો છુપાવો" : "📖 ઉપયોગ વિધિ અને નિયમો જુઓ"}
                <span className="material-symbols-outlined text-base transition-transform duration-300" style={{ transform: showRules ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    expand_more
                </span>
            </button>
        </div>

        {/* Expandable Rules Content */}
        {showRules && (
            <div className="max-w-4xl mx-auto bg-stone-50 dark:bg-stone-900/40 p-6 sm:p-8 rounded-[2.5rem] border border-stone-200/60 dark:border-stone-850 space-y-8 animate-fade-in shadow-inner">
                {activeOracle === 'ram' ? (
                    // RAM SHALAKA RULES
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-orange-200/50 pb-4 dark:border-stone-800">
                            <span className="material-symbols-outlined text-2xl text-orange-650">temple_hindu</span>
                            <h3 className="font-gujarati font-black text-xl text-orange-950 dark:text-orange-200">🏹 શ્રી રામ શલાકા ઉપયોગ વિધિ અને મર્યાદા</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Ritual (વિધિ) */}
                            <div className="bg-white dark:bg-dark-surface p-5 rounded-3xl border border-orange-100/50 dark:border-stone-800 space-y-4 shadow-sm">
                                <h4 className="font-gujarati font-black text-amber-900 dark:text-amber-400 flex items-center gap-2 text-sm border-b pb-2 dark:border-stone-800">
                                    <span className="material-symbols-outlined text-lg">settings_suggest</span> 🪔 પૂજન વિધિ અને ક્રમ
                                </h4>
                                <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-gujarati font-bold">
                                    <li className="flex gap-2"><span className="text-orange-600">૧.</span> મન એકદમ શાંત અને પવિત્ર રાખો.</li>
                                    <li className="flex gap-2"><span className="text-orange-600">૨.</span> મનમાં તમારો પ્રશ્ન સ્પષ્ટ રીતે ધારો.</li>
                                    <li className="flex gap-2"><span className="text-orange-600">૩.</span> આંખો બંધ કરી પ્રભુ શ્રી રામનું સ્મરણ કરો.</li>
                                    <li className="flex gap-2"><span className="text-orange-600">૪.</span> પૂર્ણ શ્રદ્ધા સાથે કોષ્ટકમાં કોઈ પણ સ્થાન પર ક્લિક કરો.</li>
                                    <li className="flex gap-2"><span className="text-orange-600">૫.</span> પ્રાપ્ત થયેલી ચોપાઈનો અર્થ અને આશીર્વાદ શાંતિથી વિચારો.</li>
                                </ul>
                            </div>

                            {/* DOs (શું કરવું) */}
                            <div className="bg-white dark:bg-dark-surface p-5 rounded-3xl border border-emerald-105/50 dark:border-stone-800 space-y-4 shadow-sm">
                                <h4 className="font-gujarati font-black text-emerald-800 dark:text-emerald-400 flex items-center gap-2 text-sm border-b pb-2 dark:border-stone-800">
                                    <span className="material-symbols-outlined text-lg text-emerald-650">check_circle</span> ✅ શું કરવું (DOs)
                                </h4>
                                <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-gujarati font-bold">
                                    <li className="flex gap-2 text-emerald-950 dark:text-emerald-350">✓ મન શાંત અને ધ્યાન કેન્દ્રિત હોવું જોઈએ.</li>
                                    <li className="flex gap-2 text-emerald-950 dark:text-emerald-350">✓ સંપૂર્ણ આદર અને આસ્થા સાથે ઉપયોગ કરો.</li>
                                    <li className="flex gap-2 text-emerald-950 dark:text-emerald-350">✓ એક સમયે ફક્ત એક જ પ્રશ્ન પૂછો.</li>
                                    <li className="flex gap-2 text-emerald-950 dark:text-emerald-350">✓ સવારે દૈનિક પૂજા-પાઠ બાદ ઉપયોગ કરવો શ્રેષ્ઠ છે.</li>
                                    <li className="flex gap-2 text-emerald-950 dark:text-emerald-350">✓ આવેલી ચોપાઈના ગૂઢ અર્થને સમજવા આત્મમંથન કરો.</li>
                                </ul>
                            </div>

                            {/* DON'Ts (શું ન કરવું) */}
                            <div className="bg-white dark:bg-dark-surface p-5 rounded-3xl border border-rose-100/50 dark:border-stone-800 space-y-4 shadow-sm">
                                <h4 className="font-gujarati font-black text-rose-800 dark:text-rose-450 flex items-center gap-2 text-sm border-b pb-2 dark:border-stone-800">
                                    <span className="material-symbols-outlined text-lg text-rose-650">cancel</span> ❌ શું ન કરવું (DON'Ts)
                                </h4>
                                <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-gujarati font-bold">
                                    <li className="flex gap-2 text-rose-950 dark:text-rose-350">✗ એક જ પ્રશ્ન વારંવાર પૂછી કસોટી ન કરો.</li>
                                    <li className="flex gap-2 text-rose-950 dark:text-rose-350">✗ મજાક, કુતૂહલ કે ટાઈમ પાસ માટે ઉપયોગ ન કરો.</li>
                                    <li className="flex gap-2 text-rose-950 dark:text-rose-350">✗ ગુસ્સા, ચિંતા કે નકારાત્મક મનોસ્થિતિમાં ન પૂછો.</li>
                                    <li className="flex gap-2 text-rose-950 dark:text-rose-350">✗ ફળને પથ્થરની લકીર ગણી તમારો પુરુષાર્થ ન છોડો.</li>
                                    <li className="flex gap-2 text-rose-950 dark:text-rose-350">✗ અવિશ્વાસ કે શંકાશીલ મનથી પ્રશ્ન ન પૂછો.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    // DURGA PRASHNAVALI RULES
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-rose-200/50 pb-4 dark:border-stone-800">
                            <span className="material-symbols-outlined text-2xl text-rose-650">brightness_5</span>
                            <h3 className="font-gujarati font-black text-xl text-rose-950 dark:text-rose-200">🔱 દુર્ગા સપ્તશતી પ્રશ્નાવલી વિધિ અને નિયમો</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Ritual (વિધિ) */}
                            <div className="bg-white dark:bg-dark-surface p-5 rounded-3xl border border-rose-100/50 dark:border-stone-800 space-y-4 shadow-sm">
                                <h4 className="font-gujarati font-black text-amber-900 dark:text-amber-400 flex items-center gap-2 text-sm border-b pb-2 dark:border-stone-800">
                                    <span className="material-symbols-outlined text-lg">settings_suggest</span> 🪔 પૂજન વિધિ અને મંત્ર
                                </h4>
                                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 rounded-2xl text-center border border-rose-100 dark:border-stone-800">
                                    <p className="font-sans font-black text-xs text-rose-700 dark:text-rose-300">
                                        "ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे"
                                    </p>
                                    <p className="text-[10px] text-stone-500 mt-1 font-gujarati font-bold">આ મંત્રનો ૩ વાર શાંતિથી ઉચ્ચાર કરો</p>
                                </div>
                                <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-gujarati font-bold">
                                    <li className="flex gap-2"><span className="text-rose-600">૧.</span> માં દુર્ગા આદિશક્તિનું હૃદયપૂર્વક ધ્યાન કરો.</li>
                                    <li className="flex gap-2"><span className="text-rose-600">૨.</span> તમારી સમસ્યા કે પ્રશ્ન માં સમક્ષ ભાવથી રજૂ કરો.</li>
                                    <li className="flex gap-2"><span className="text-rose-600">૩.</span> પૂરી પવિત્રતા સાથે અક્ષર ચક્ર પર આંગળી/ક્લિક મૂકો.</li>
                                    <li className="flex gap-2"><span className="text-rose-600">૪.</span> માતાજીના આશીર્વાદરૂપ શ્લોક અને ભાવાર્થ ધ્યાનથી વાંચો.</li>
                                </ul>
                            </div>

                            {/* DOs (શું કરવું) */}
                            <div className="bg-white dark:bg-dark-surface p-5 rounded-3xl border border-emerald-100/50 dark:border-stone-800 space-y-4 shadow-sm">
                                <h4 className="font-gujarati font-black text-emerald-800 dark:text-emerald-400 flex items-center gap-2 text-sm border-b pb-2 dark:border-stone-800">
                                    <span className="material-symbols-outlined text-lg text-emerald-650">check_circle</span> ✅ શું કરવું (DOs)
                                </h4>
                                <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-gujarati font-bold">
                                    <li className="flex gap-2 text-emerald-950 dark:text-emerald-350">✓ માં ભગવતીને એક બાળકની જેમ પ્રાર્થના કરો.</li>
                                    <li className="flex gap-2 text-emerald-950 dark:text-emerald-350">✓ શુક્રવારે અથવા નવરાત્રિ પર્વમાં પૂછવું અત્યંત ફળદાયી છે.</li>
                                    <li className="flex gap-2 text-emerald-950 dark:text-emerald-350">✓ સ્નાન આદિથી નિવૃત્ત થઈ શુદ્ધ અવસ્થામાં જ ઉપયોગ કરો.</li>
                                    <li className="flex gap-2 text-emerald-950 dark:text-emerald-350">✓ આવેલ ઉત્તરને માતાજીની પવિત્ર ઇચ્છા માની સ્વીકારો.</li>
                                    <li className="flex gap-2 text-emerald-950 dark:text-emerald-350">✓ ઉત્તર વાંચી માતાજીને ધન્યવાદ અર્પિત કરો.</li>
                                </ul>
                            </div>

                            {/* DON'Ts (શું ન કરવું) */}
                            <div className="bg-white dark:bg-dark-surface p-5 rounded-3xl border border-rose-100/50 dark:border-stone-800 space-y-4 shadow-sm">
                                <h4 className="font-gujarati font-black text-rose-800 dark:text-rose-450 flex items-center gap-2 text-sm border-b pb-2 dark:border-stone-800">
                                    <span className="material-symbols-outlined text-lg text-rose-655">cancel</span> ❌ શું ન કરવું (DON'Ts)
                                </h4>
                                <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-gujarati font-bold">
                                    <li className="flex gap-2 text-rose-950 dark:text-rose-350">✗ અશુદ્ધ કે અપવિત્ર અવસ્થામાં ક્યારેય સ્પર્શ ન કરો.</li>
                                    <li className="flex gap-2 text-rose-950 dark:text-rose-350">✗ એક દિવસમાં ૩ વારથી વધુ ક્યારેય ન પૂછો.</li>
                                    <li className="flex gap-2 text-rose-950 dark:text-rose-350">✗ અન્ય વ્યક્તિના હિત કે નુકસાન માટે પ્રશ્ન ન પૂછો.</li>
                                    <li className="flex gap-2 text-rose-950 dark:text-rose-350">✗ મનગમતો ઉત્તર મેળવવા માટે વારંવાર ન પૂછો.</li>
                                    <li className="flex gap-2 text-rose-950 dark:text-rose-350">✗ અંધવિશ્વાસ ન રાખવો, કર્મ અને મહેનત અનિવાર્ય છે.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Comparison Table Section */}
                <div className="bg-white dark:bg-dark-surface p-5 sm:p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
                    <h4 className="font-gujarati font-black text-stone-800 dark:text-stone-200 flex items-center gap-2 text-sm border-b pb-2 dark:border-stone-800">
                        <span className="material-symbols-outlined text-lg text-amber-605">balance</span> ⚖️ બંને પવિત્ર પ્રશ્નાવલીઓની સરખામણી
                    </h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-gujarati font-bold border-collapse">
                            <thead>
                                <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500">
                                    <th className="py-2 px-3">વિષય</th>
                                    <th className="py-2 px-3 text-orange-700 dark:text-orange-400">🏹 શ્રી રામ શલાકા</th>
                                    <th className="py-2 px-3 text-rose-700 dark:text-rose-400">🔱 દુર્ગા સપ્તશતી પ્રશ્નાવલી</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
                                <tr>
                                    <td className="py-2.5 px-3 text-stone-500 font-black">પવિત્ર आधार</td>
                                    <td className="py-2.5 px-3">શ્રી રામચરિતમાનસ</td>
                                    <td className="py-2.5 px-3">શ્રી દુર્ગા સપ્તશતી</td>
                                </tr>
                                <tr>
                                    <td className="py-2.5 px-3 text-stone-500 font-black">આરાધ્ય દેવ</td>
                                    <td className="py-2.5 px-3">ભગવાન શ્રી રામ</td>
                                    <td className="py-2.5 px-3">આદિશક્તિ માં ભવાની</td>
                                </tr>
                                <tr>
                                    <td className="py-2.5 px-3 text-stone-500 font-black">શ્રેષ્ઠ સમય</td>
                                    <td className="py-2.5 px-3">સવારે / પૂજા આરાધના સમયે</td>
                                    <td className="py-2.5 px-3">શુક્રવાર / પવિત્ર નવરાત્રિ પર્વ</td>
                                </tr>
                                <tr>
                                    <td className="py-2.5 px-3 text-stone-500 font-black">ઉત્તર સ્વરૂપ</td>
                                    <td className="py-2.5 px-3">દોહા અને પવિત્ર ચોપાઈ</td>
                                    <td className="py-2.5 px-3">સંસ્કૃત શ્લોક અને આશીર્વાદ ફળ</td>
                                </tr>
                                <tr>
                                    <td className="py-2.5 px-3 text-stone-500 font-black">પ્રકૃતિ ફળ</td>
                                    <td className="py-2.5 px-3">સૌમ્ય, શાંતિ અને પરમ આશ્વાસન</td>
                                    <td className="py-2.5 px-3">શક્તિ, સાહસ અને નવો ઉત્સાહ આપનાર</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Important Caution Callout */}
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-950/20 dark:to-orange-950/20 p-5 rounded-3xl border border-amber-200/50 dark:border-amber-900/50 flex gap-4 items-start">
                    <span className="material-symbols-outlined text-3xl text-amber-600 animate-bounce">info</span>
                    <div className="space-y-1">
                        <h5 className="font-gujarati font-black text-amber-950 dark:text-amber-300 text-sm">🙏 સૌથી મહત્વપૂર્ણ બાબત ધ્યાનમાં રાખો</h5>
                        <p className="font-gujarati text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-bold">
                            આ બંને પવિત્ર સાધનો શ્રદ્ધાળુઓના દિવ્ય માર્ગદર્શન અને સદ્બુદ્ધિ માટે છે, આપણાં જીવનના અંતિમ નિર્ણયો તેના પર થોપવા માટે નથી. તમારા જીવનનો આખરી નિર્ણય હંમેશા તમારી પોતાની બુદ્ધિ, સદ્વિવેક, અવિરત મહેનત અને સાચા પુરુષાર્થ પર જ આધારિત હોવો જોઈએ. માં ભગવતી અને પ્રભુ શ્રી રામ આપણને સદ્કર્મ કરવાની શક્તિ આપે! 🌺
                        </p>
                    </div>
                </div>
            </div>
        )}

        <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] p-6 sm:p-8 shadow-xl border border-stone-100 dark:border-stone-800/80 space-y-6">
            {activeOracle === 'ram' ? (
                // 1. SHRI RAM SHALAKA VIEW
                !showResult ? (
                    <div className="space-y-6 text-center">
                        <div className="max-w-md mx-auto space-y-2">
                            <p className="font-gujarati font-black text-lg text-amber-900 dark:text-amber-400">
                                {animating ? "ગણતરી ચાલી રહી છે, કૃપા કરીને સ્મરણ ચાલુ રાખો..." : "૧. પ્રભુ શ્રી રામનું સ્મરણ કરો અને તમારો પ્રશ્ન મનમાં ધારો."}
                            </p>
                            <p className="font-gujarati text-stone-500 dark:text-stone-400 text-sm">
                                {animating ? "શલાકાના પવિત્ર સૂત્રોમાંથી અક્ષરો એકત્રિત કરવામાં આવી રહ્યા છે." : "૨. નીચેના શલાકા કોષ્ટકમાં કોઈ પણ એક અક્ષર પર પૂર્ણ શ્રદ્ધા સાથે ક્લિક કરો."}
                            </p>
                        </div>

                        {/* Interactive 15x15 Saffron Grid */}
                        <div className="relative max-w-md mx-auto">
                            <div className="grid grid-cols-15 gap-0.5 sm:gap-1 p-2 sm:p-4 bg-orange-50/50 dark:bg-dark-bg/50 rounded-3xl border-2 border-orange-200/50 shadow-inner">
                                {RAM_SHALAKA_LETTERS.map((letter, idx) => {
                                    const isHighlighted = highlightedCells.includes(idx);
                                    const isSelected = selectedIdx === idx;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => startShalakaQuery(idx)}
                                            disabled={animating}
                                            className={`w-full aspect-square text-[9px] sm:text-xs font-black flex items-center justify-center rounded transition-all duration-150 relative ${
                                                isSelected 
                                                    ? 'bg-gradient-to-br from-red-600 to-orange-600 text-white font-black scale-125 z-20 shadow-lg border-2 border-yellow-300 animate-pulse' 
                                                    : isHighlighted 
                                                        ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white font-black scale-110 shadow-md animate-pulse z-10' 
                                                        : 'bg-white dark:bg-dark-surface hover:bg-amber-100 hover:text-amber-950 dark:hover:bg-amber-950/40 dark:hover:text-amber-200 hover:shadow hover:scale-110 text-stone-700 dark:text-stone-300 border border-stone-100 dark:border-stone-800/50'
                                            }`}
                                        >
                                            {letter}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 text-center animate-fade-in py-4">
                        <div className="max-w-md mx-auto p-6 rounded-[2.5rem] bg-gradient-to-tr from-orange-50 to-amber-50/30 dark:from-dark-bg dark:to-dark-bg border-2 border-orange-200/50 shadow-lg relative overflow-hidden space-y-6">
                            <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
                                <span className="material-symbols-outlined text-[120px]">temple_hindu</span>
                            </div>

                            {/* Result Badge */}
                            <div className="flex justify-center">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-gujarati font-black border uppercase tracking-wider shadow-sm ${CHAUPAIS[selectedIdx % 9].badgeColor}`}>
                                    {CHAUPAIS[selectedIdx % 9].category}
                                </span>
                            </div>

                            {/* Sacred Verse (Chaupai) */}
                            <div className="space-y-2">
                                <p className="font-label text-[10px] text-orange-600/70 font-black uppercase tracking-[0.2em]">રામચરિતમાનસ ચોપાઈ</p>
                                <p className="font-sans font-black text-2xl text-orange-950 dark:text-orange-200 leading-relaxed px-4">
                                    "{CHAUPAIS[selectedIdx % 9].verse}"
                                </p>
                            </div>

                            <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto"></div>

                            {/* Gujarati Meaning */}
                            <div className="space-y-2 px-2">
                                <p className="font-label text-[10px] text-amber-900/60 dark:text-amber-400/60 font-black uppercase tracking-[0.2em]">ચોપાઈ ફળ કથન</p>
                                <p className="font-gujarati font-black text-base text-stone-800 dark:text-stone-300 leading-relaxed">
                                    {CHAUPAIS[selectedIdx % 9].meaning}
                                </p>
                            </div>

                            {/* Reset Button */}
                            <button
                                onClick={resetShalaka}
                                className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-gujarati font-black py-4 px-6 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 border-b-4 border-orange-800"
                            >
                                <span className="material-symbols-outlined text-lg">autorenew</span>
                                શ્રી રામને પ્રણામ કરી ફરીથી પ્રશ્ન પૂછો
                            </button>
                        </div>
                    </div>
                )
            ) : (
                // 2. DURGA SAPTASHATI PRASHNAVALI VIEW
                !durgaShowResult ? (
                    <div className="space-y-6 text-center">
                        <div className="max-w-md mx-auto space-y-2">
                            <p className="font-gujarati font-black text-lg text-rose-900 dark:text-rose-400">
                                {durgaAnimating ? "માં ભવાનીનું ધ્યાન ચાલી રહ્યું છે, કૃપા કરીને સ્મરણ ચાલુ રાખો..." : "૧. માં નવદુર્ગા ભગવતીનું ધ્યાન ધરી મનોકામના વિચારો."}
                            </p>
                            <p className="font-gujarati text-stone-500 dark:text-stone-400 text-sm">
                                {durgaAnimating ? "શક્તિપીઠના ચક્રમાંથી પવિત્ર મંગલકારી આશીર્વાદ એકત્રિત થઈ રહ્યા છે." : "૨. નીચેની ૧૫ પવિત્ર શક્તિ પીઠોમાંથી કોઈપણ એક અક્ષર/નામ પર શ્રદ્ધાપૂર્વક ક્લિક કરો."}
                            </p>
                        </div>

                        {/* Interactive 3x5 Sacred Crimson Grid */}
                        <div className="relative max-w-lg mx-auto">
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 p-3 sm:p-5 bg-rose-50/50 dark:bg-rose-950/20 rounded-3xl border-2 border-rose-200/50 shadow-inner">
                                {DURGA_PRASHNAVALI_ANSWERS.map((ans, idx) => {
                                    const isHighlighted = durgaHighlightedCells.includes(idx);
                                    const isSelected = selectedDurgaIdx === idx;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => startDurgaQuery(idx)}
                                            disabled={durgaAnimating}
                                            className={`aspect-square p-2 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 border relative overflow-hidden ${
                                                isSelected 
                                                    ? 'bg-gradient-to-br from-rose-700 to-red-600 text-white font-black scale-110 z-20 shadow-lg border-yellow-300 animate-pulse' 
                                                    : isHighlighted 
                                                        ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white font-black scale-105 shadow-md animate-pulse z-10' 
                                                        : 'bg-white dark:bg-dark-surface hover:bg-rose-50 hover:text-rose-950 dark:hover:bg-rose-950/40 dark:hover:text-rose-200 hover:shadow-md hover:scale-105 text-stone-800 dark:text-stone-300 border-stone-200/80 dark:border-stone-800/80'
                                            }`}
                                        >
                                            <span className="material-symbols-outlined text-lg sm:text-xl text-rose-600/70 dark:text-rose-400 mb-1">brightness_5</span>
                                            <p className="font-gujarati font-black text-xs sm:text-sm tracking-wide leading-tight">
                                                {ans.name.split('. ')[1]}
                                            </p>
                                            <span className="absolute bottom-1 right-2 text-[9px] font-black opacity-30">
                                                {ans.name.split('. ')[0]}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 text-center animate-fade-in py-4">
                        <div className="max-w-md mx-auto p-6 rounded-[2.5rem] bg-gradient-to-tr from-rose-50 to-red-50/20 dark:from-dark-bg dark:to-dark-bg border-2 border-rose-200/50 shadow-lg relative overflow-hidden space-y-6">
                            <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
                                <span className="material-symbols-outlined text-[120px]">brightness_5</span>
                            </div>

                            {/* Result Badge */}
                            <div className="flex justify-center">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-gujarati font-black border uppercase tracking-wider shadow-sm ${DURGA_PRASHNAVALI_ANSWERS[selectedDurgaIdx].badgeColor}`}>
                                    {DURGA_PRASHNAVALI_ANSWERS[selectedDurgaIdx].category}
                                </span>
                            </div>

                            {/* Durga Saptashati Shloka */}
                            <div className="space-y-2">
                                <p className="font-label text-[10px] text-rose-600/70 font-black uppercase tracking-[0.2em]">દુર્ગા સપ્તશતી શ્લોક</p>
                                <p className="font-sans font-black text-xl text-rose-950 dark:text-rose-200 leading-relaxed px-4">
                                    "{DURGA_PRASHNAVALI_ANSWERS[selectedDurgaIdx].shloka}"
                                </p>
                            </div>

                            <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-rose-400 to-transparent mx-auto"></div>

                            {/* Gujarati Meaning */}
                            <div className="space-y-2 px-2">
                                <p className="font-label text-[10px] text-rose-900/60 dark:text-rose-400/60 font-black uppercase tracking-[0.2em]">ચક્ર આશીર્વાદ ફળ કથન</p>
                                <p className="font-gujarati font-black text-base text-stone-800 dark:text-stone-300 leading-relaxed">
                                    {DURGA_PRASHNAVALI_ANSWERS[selectedDurgaIdx].meaning}
                                </p>
                            </div>

                            {/* Reset Button */}
                            <button
                                onClick={resetDurga}
                                className="w-full bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-800 hover:to-red-700 text-white font-gujarati font-black py-4 px-6 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 border-b-4 border-rose-900"
                            >
                                <span className="material-symbols-outlined text-lg">autorenew</span>
                                માં ભવાનીને પ્રણામ કરી ફરીથી પૂછો
                            </button>
                        </div>
                    </div>
                )
            )}
        </div>
      </section>

      {/* Bhajan & Stotra List Section - REVERTED Header */}
      <section id="bhajans-section" className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-primary/5 space-y-8">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <h3 className="font-gujarati font-black text-2xl text-on-surface">ભજન અને સ્તોત્ર</h3>
                <ShareButton sectionId="bhajans-section" successMessage="🎶 ભજન અને સ્તોત્ર વિભાગની ડાયરેક્ટ લિંક કોપી થઈ ગઈ છે!" />
            </div>
            <span className="material-symbols-outlined text-primary-container">menu_book</span>
        </div>
        
        <div className="space-y-6">
            {stotras.map((s, idx) => (
                <div key={idx} className="flex items-center gap-6 p-2 group cursor-pointer active:scale-95 transition-all">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-colors ${s.active ? 'bg-primary text-white shadow-lg' : 'bg-surface-container-low text-outline'}`}>
                        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: s.active ? "'FILL' 1" : "" }}>{s.icon}</span>
                    </div>
                    <div className="flex-1">
                        <h4 className={`font-gujarati font-black text-xl ${s.active ? 'text-primary' : 'text-on-surface'}`}>{s.title}</h4>
                        <p className="font-gujarati text-sm text-outline">{s.artist}</p>
                    </div>
                    <span className="text-[10px] font-bold text-outline opacity-50 tracking-widest">{s.time}</span>
                </div>
            ))}
        </div>
      </section>

      {/* 5. GORGEOUS MANTRA JAAP HUB */}
      <section id="mantra-jaap-section" className="bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 rounded-[2.5rem] p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden space-y-8 border-2 border-amber-500/20">
        <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
          <span className="material-symbols-outlined text-[200px]">filter_vintage</span>
        </div>

        {/* Global Hub Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-6 border-b border-amber-500/10">
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <h3 className="font-gujarati font-black text-3xl text-amber-400 flex items-center justify-center sm:justify-start gap-2">
                <span className="material-symbols-outlined text-3xl animate-spin" style={{ animationDuration: '6s' }}>spa</span>
                મંત્ર જાપ અનુષ્ઠાન
              </h3>
              <ShareButton 
                sectionId="mantra-jaap-section" 
                successMessage="📿 મંત્ર જાપ અનુષ્ઠાન વિભાગની ડાયરેક્ટ લિંક કોપી થઈ ગઈ છે!" 
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white"
              />
            </div>
            <p className="font-gujarati text-xs text-amber-200/70">
              અત્યાર સુધી {communityCount.toLocaleString('gu-IN')} લોકોએ ઓનલાઇન જાપ કર્યા
            </p>
          </div>
          
          {/* Streak Badge */}
          {streakCount > 0 && (
            <div className="bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-md animate-bounce border border-yellow-400/30">
              <span className="material-symbols-outlined text-lg fill-1">local_fire_department</span>
              <span className="font-gujarati font-black text-xs">{streakCount} દિવસની લીંક</span>
            </div>
          )}
        </div>

        {/* --- SCREEN 1: DEITY SELECTION --- */}
        {mantraScreen === 'deity' && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h4 className="font-gujarati font-black text-xl text-amber-100">૧. જાપ કરવા માટે દેવ/દેવી પસંદ કરો</h4>
              <p className="font-gujarati text-stone-400 text-xs">આપની આરાધના શરૂ કરવા માટે પવિત્ર નામ પર ક્લિક કરો</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {MANTRA_DEITIES.map((deity) => (
                <button
                  key={deity.id}
                  onClick={() => { setSelectedDeity(deity); setMantraScreen('mantra'); }}
                  className="bg-stone-900/60 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/30 rounded-3xl p-5 text-center flex flex-col items-center gap-3 transition-all duration-305 group hover:scale-[1.03] hover:shadow-lg active:scale-95"
                >
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-tr ${deity.color} flex items-center justify-center text-2xl shadow-md group-hover:rotate-12 transition-transform`}>
                    {deity.name.split(' ')[0]}
                  </div>
                  <span className="font-gujarati font-black text-sm text-stone-200 group-hover:text-amber-400 transition-colors">
                    {deity.name.split(' ').slice(1).join(' ')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- SCREEN 2: MANTRA SELECTION --- */}
        {mantraScreen === 'mantra' && selectedDeity && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setMantraScreen('deity')}
                className="h-10 w-10 bg-stone-850 rounded-full flex items-center justify-center border border-stone-850 hover:bg-stone-800 active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-sm text-stone-300">arrow_back</span>
              </button>
              <div className="space-y-0.5">
                <h4 className="font-gujarati font-black text-lg text-amber-100">{selectedDeity.name} ના પવિત્ર મંત્રો</h4>
                <p className="font-gujarati text-stone-400 text-xs">૨. આપની આસ્થા મુજબનો એક મંત્ર પસંદ કરો</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedDeity.mantras.map((mantra, idx) => (
                <button
                  key={idx}
                  onClick={() => { 
                    setSelectedMantra(mantra); 
                    setMantraTarget(mantra.defaultCount);
                    setMantraScreen('target'); 
                  }}
                  className="bg-stone-900/60 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/30 rounded-3xl p-5 text-left flex justify-between items-center transition-all duration-305 group hover:scale-[1.01] active:scale-[0.99]"
                >
                  <div className="space-y-1">
                    <p className="font-gujarati font-black text-base text-stone-150 group-hover:text-amber-400 transition-colors">{mantra.name}</p>
                    <span className="font-gujarati text-[10px] text-stone-500">સામાન્ય જાપ સંખ્યા: {mantra.defaultCount}</span>
                  </div>
                  <span className="material-symbols-outlined text-stone-500 group-hover:translate-x-1 transition-transform">chevron_right</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- SCREEN 3: TARGET COUNT SELECTION --- */}
        {mantraScreen === 'target' && selectedMantra && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setMantraScreen('mantra')}
                className="h-10 w-10 bg-stone-850 rounded-full flex items-center justify-center border border-stone-850 hover:bg-stone-800 active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-sm text-stone-300">arrow_back</span>
              </button>
              <div className="space-y-0.5">
                <h4 className="font-gujarati font-black text-lg text-amber-100">{selectedMantra.name}</h4>
                <p className="font-gujarati text-stone-400 text-xs">૩. જપ કરવા માટે કુલ સંખ્યા નક્કી કરો</p>
              </div>
            </div>

            <div className="bg-stone-900/60 rounded-3xl p-6 border border-stone-800 space-y-6 max-w-md mx-auto">
              <div className="text-center space-y-1">
                <p className="font-gujarati text-[10px] text-stone-550 uppercase tracking-widest">લક્ષ્ય જપ સંખ્યા</p>
                <div className="font-headline font-black text-5xl text-amber-400 leading-none">
                  {mantraTarget}
                </div>
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-3 gap-2">
                {[11, 21, 51, 108, 501, 1008].map((val) => (
                  <button
                    key={val}
                    onClick={() => setMantraTarget(val)}
                    className={`py-3.5 rounded-2xl text-xs font-black transition-all ${mantraTarget === val ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md' : 'bg-stone-800 text-stone-300 hover:bg-stone-750'}`}
                  >
                    {val}
                  </button>
                ))}
              </div>

              {/* Custom Count Stepper */}
              <div className="flex justify-center items-center gap-4 pt-4 border-t border-stone-800">
                <button
                  onClick={() => setMantraTarget(prev => Math.max(1, prev - 1))}
                  className="h-10 w-10 bg-stone-800 hover:bg-stone-750 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined text-sm">remove</span>
                </button>
                <span className="font-gujarati text-xs text-stone-400 font-bold">કસ્ટમ સેટ કરો</span>
                <button
                  onClick={() => setMantraTarget(prev => prev + 1)}
                  className="h-10 w-10 bg-stone-800 hover:bg-stone-750 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>

              {/* Start Button */}
              <button
                onClick={() => { setMantraCount(0); setCompletedMalas(0); setMantraScreen('active'); playTempleBell(); }}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-gujarati font-black py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 border-b-4 border-orange-850"
              >
                <span className="material-symbols-outlined text-lg">play_arrow</span>
                ▶️ અનુષ્ઠાન શરૂ કરો
              </button>
            </div>
          </div>
        )}

        {/* --- SCREEN 4: ACTIVE JAPA COUNTER SCREEN --- */}
        {mantraScreen === 'active' && selectedMantra && (
          <div className="space-y-8 text-center">
            {/* Header info */}
            <div className="space-y-1">
              <span className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border inline-block ${selectedDeity?.badgeColor}`}>
                {selectedDeity?.name.split(' ').slice(1).join(' ')}
              </span>
              <h4 className="font-gujarati font-black text-2xl text-amber-100">{selectedMantra.name}</h4>
              <p className="font-gujarati text-stone-400 text-xs">કુલ લક્ષ્ય: {mantraTarget} જપ</p>
            </div>

            {/* Circular Progress Ring Counter */}
            <div className="relative h-64 w-64 mx-auto flex items-center justify-center">
              <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Trail track */}
                <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="transparent" />
                {/* Progress track */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="42" 
                  stroke="url(#japaGrad)" 
                  strokeWidth="6" 
                  fill="transparent" 
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - mantraCount / mantraTarget)}`}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
                <defs>
                  <linearGradient id="japaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ea580c" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Centered digits */}
              <div className="space-y-1 z-10">
                <span className="font-gujarati text-[10px] text-stone-500 uppercase tracking-widest block">ચાલુ જપ</span>
                <span className="font-headline font-black text-6xl leading-none text-white block">
                  {String(mantraCount).padStart(3, '0')}
                </span>
                <span className="font-gujarati text-xs text-amber-505 font-bold block">
                  માળા: {completedMalas} ({completedMalas * 108 + (mantraCount % 108)} / {mantraTarget})
                </span>
              </div>
            </div>

            {/* Prayer Bead Tap Button */}
            <div className="space-y-4">
              <button
                onClick={incrementJapa}
                className="h-36 w-36 bg-gradient-to-br from-amber-600 to-amber-900 border-8 border-stone-900 shadow-2xl rounded-full mx-auto flex flex-col items-center justify-center active:scale-90 active:shadow-inner transition-all hover:scale-[1.03] group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25)_0%,transparent_60%)] pointer-events-none"></div>
                <span className="material-symbols-outlined text-4xl text-yellow-300 animate-pulse group-hover:scale-115 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>brightness_5</span>
                <span className="font-gujarati font-black text-xs text-amber-100 mt-2 tracking-wider">અહીં દબાવો</span>
              </button>
              <p className="font-gujarati text-stone-400 text-xs">માળાનો એક-એક મણકો ફેરવી જાપ કરવા માટે ટેપ કરો</p>
            </div>

            {/* Hand wave detector gyro control */}
            <div className="max-w-xs mx-auto p-4 bg-stone-900/60 rounded-2xl border border-stone-800 flex justify-between items-center gap-4">
              <div className="text-left">
                <span className="font-gujarati font-black text-xs text-stone-200 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm animate-bounce text-orange-500">sensors</span>
                  ડિવાઇસ હલાવીને જાપ (Gyro)
                </span>
                <p className="text-[10px] text-stone-500 font-gujarati leading-tight mt-0.5">મોબાઈલ હાથમાં રાખી હલાવતા જાવ</p>
              </div>
              <button
                onClick={() => {
                  if (!motionActive) {
                    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
                      DeviceMotionEvent.requestPermission()
                        .then(res => {
                          if (res === 'granted') setMotionActive(true);
                        }).catch(console.error);
                    } else {
                      setMotionActive(true);
                    }
                  } else {
                    setMotionActive(false);
                  }
                }}
                className={`w-14 h-8 rounded-full p-1 transition-colors relative flex items-center ${motionActive ? 'bg-orange-600 justify-end' : 'bg-stone-700 justify-start'}`}
              >
                <div className="h-6 w-6 bg-white rounded-full shadow-md"></div>
              </button>
            </div>

            {/* Exit controls */}
            <div className="pt-4 border-t border-stone-800 flex justify-center gap-4 max-w-sm mx-auto">
              <button
                onClick={() => { if (window.confirm("શું આપ ખરેખર જપ અધૂરા છોડી બહાર જવા માંગો છો?")) resetMantraJapa(); }}
                className="flex-1 bg-stone-950/40 hover:bg-stone-900 border border-stone-850 py-3.5 px-4 rounded-2xl font-gujarati font-black text-xs text-stone-300 active:scale-95 transition-transform"
              >
                🛑 જપ બંધ કરો
              </button>
              <button
                onClick={incrementJapa}
                className="flex-1 bg-gradient-to-r from-orange-600 to-amber-500 py-3.5 px-4 rounded-2xl font-gujarati font-black text-xs text-white active:scale-95 transition-transform"
              >
                📿 આગળ વધો +1
              </button>
            </div>
          </div>
        )}

        {/* --- SCREEN 5: COMPLETION CERTIFICATE SCREEN --- */}
        {mantraScreen === 'certificate' && selectedMantra && (
          <div className="space-y-8 animate-fade-in py-4">
            <div className="max-w-md mx-auto p-6 sm:p-8 rounded-[2.5rem] bg-gradient-to-b from-stone-900 to-stone-950 border-4 border-double border-amber-500 shadow-2xl relative overflow-hidden space-y-6 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.05)_0%,transparent_70%)] pointer-events-none"></div>
              
              {/* Traditional sacred motifs */}
              <div className="flex justify-between items-center text-amber-500/40 px-4">
                <span className="material-symbols-outlined">filter_vintage</span>
                <span className="material-symbols-outlined text-2xl">brightness_5</span>
                <span className="material-symbols-outlined">filter_vintage</span>
              </div>

              {/* Certificate Heading */}
              <div className="space-y-1">
                <p className="font-label text-[10px] text-amber-500/70 font-black uppercase tracking-[0.25em]">જપ અનુષ્ઠાન પ્રમાણપત્ર</p>
                <h4 className="font-gujarati font-black text-2xl text-amber-400">🪔 ભક્તિ રત્ન પ્રમાણપત્ર 🪔</h4>
              </div>

              <div className="h-[2px] w-36 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>

              {/* Custom message content */}
              <div className="space-y-4 px-2">
                <p className="font-gujarati text-sm text-stone-300 leading-relaxed">
                  આથી પ્રમાણિત કરવામાં આવે છે કે આપની અપાર ભક્તિ અને નિષ્ઠા સાથે શ્રદ્ધાપૂર્વક
                </p>
                <div className="py-3 px-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 inline-block">
                  <p className="font-gujarati font-black text-lg text-amber-300 leading-none">
                    "{selectedMantra.name}"
                  </p>
                </div>
                <p className="font-gujarati text-sm text-stone-300 leading-relaxed">
                  મંત્રના <span className="font-black text-amber-400 text-lg">{mantraTarget}</span> પવિત્ર જપ પૂર્ણ કરી આપશ્રીએ જપ અનુષ્ઠાન સંપન્ન કર્યું છે.
                </p>
                <p className="font-gujarati text-xs text-stone-400 leading-relaxed italic">
                  પ્રભુ આપની સર્વ આધ્યાત્મિક અને લૌકિક મનોકામનાઓ શીઘ્ર અતિ શીઘ્ર પૂર્ણ કરે તેવા શુભ આશીર્વાદ!
                </p>
              </div>

              {/* Signature section */}
              <div className="pt-4 border-t border-amber-500/10 flex justify-between items-center text-left">
                <div>
                  <p className="text-[10px] font-gujarati text-stone-500">અનુષ્ઠાન તારીખ</p>
                  <p className="font-gujarati text-xs text-stone-300 font-bold">
                    {new Date().toLocaleDateString('gu-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-gujarati text-stone-500">પ્રમાણિત કરનાર</p>
                  <p className="font-gujarati text-xs text-amber-500 font-bold">ૐ ગુજરાતી એપ</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3 pt-4">
                <a
                  href={`https://api.whatsapp.com/send?text=મેં આજે ગુજરાતી એપ પર શ્રદ્ધાપૂર્વક *${selectedMantra.name}* ના *${mantraTarget}* મંત્ર જાપ પૂર્ણ કરી ધન્યતા અનુભવી છે! આપ પણ આપના ફોનમાં જાપ શરૂ કરો 🙏`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-gujarati font-black py-4 px-6 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 border-b-4 border-emerald-850"
                >
                  <span className="material-symbols-outlined text-lg">share</span>
                  પ્રમાણપત્ર વોટ્સએપ પર શેર કરો 🙏
                </a>
                
                <button
                  onClick={resetMantraJapa}
                  className="w-full bg-stone-850 hover:bg-stone-800 border border-stone-800 text-stone-300 font-gujarati font-black py-3.5 px-6 rounded-2xl active:scale-95 transition-all"
                >
                  🔄 ફરીથી નવો જાપ શરૂ કરો
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="bg-surface-container-low p-10 rounded-[2.5rem] relative overflow-hidden text-center border border-primary/5">
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary"></div>
        <span className="material-symbols-outlined text-5xl text-primary/20 mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
        <p className="font-gujarati font-black text-2xl text-on-primary-fixed-variant leading-relaxed">
            "કર્મણ્યેવાધિકારસ્તે મા ફલેષુ કદાચન । મા કર્મફલહેતુભૂર્મા તે સંગોડસ્તવકર્મણિ ॥"
        </p>
        <p className="font-gujarati text-primary font-bold mt-6 text-xl pb-2 border-b-2 border-primary/20 inline-block">— શ્રીમદ ભગવદ ગીતા</p>
      </section>

      {/* 6. FAMOUS TEMPLES OF GUJARAT MODAL OVERLAY */}
      {showTemplesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-5xl h-[85vh] bg-[#fdfaf6] dark:bg-stone-950 rounded-[2.5rem] shadow-2xl border border-amber-500/20 overflow-hidden flex flex-col">
            {/* Traditional golden border accents */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600"></div>
            
            {/* Modal Header */}
            <div className="p-6 sm:p-8 bg-gradient-to-b from-amber-50 to-transparent dark:from-stone-900/40 border-b border-amber-500/10 flex justify-between items-center shrink-0">
              <div className="space-y-1">
                <span className="bg-amber-500/10 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-gujarati font-black uppercase tracking-wider inline-block">
                  🛕 પવિત્ર યાત્રાધામો દર્શન
                </span>
                <h3 className="font-gujarati font-black text-2xl sm:text-3xl text-amber-950 dark:text-amber-200">
                  ગુજરાતના પ્રસિદ્ધ મંદિરો (Famous Temples)
                </h3>
              </div>
              <button 
                onClick={() => { setShowTemplesModal(false); setHighlightedTempleId(null); }}
                className="h-10 w-10 bg-amber-900/10 dark:bg-stone-900 hover:bg-amber-900/20 dark:hover:bg-stone-850 rounded-full flex items-center justify-center border border-transparent dark:border-stone-800 text-amber-950 dark:text-stone-300 transition-colors cursor-pointer active:scale-90"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 sm:p-8 space-y-8">
              
              {/* Category Tab Selector */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 shrink-0 border-b border-stone-200/50 dark:border-stone-850/80">
                {TEMPLE_CATEGORIES.map((cat) => {
                  const isActive = activeTempleCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setActiveTempleCategory(cat.id); playTempleBell(); }}
                      className={`flex-shrink-0 py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-gujarati font-black transition-all flex items-center gap-2 cursor-pointer border ${
                        isActive 
                          ? 'bg-gradient-to-r from-amber-700 to-orange-850 border-amber-500 text-white shadow-md' 
                          : 'bg-white dark:bg-stone-900 hover:bg-amber-50 dark:hover:bg-stone-850 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.name_gu}</span>
                    </button>
                  );
                })}
              </div>

              {/* Temples Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                {TEMPLES.filter(t => t.category === activeTempleCategory).map((temple) => (
                  <div 
                    key={temple.id} 
                    id={`temple-${temple.id}`}
                    className={`p-6 rounded-3xl border flex flex-col justify-between gap-4 shadow-sm hover:shadow-md transition-all hover:scale-[1.005] group relative overflow-hidden ${highlightedTempleId === temple.id ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-500 ring-4 ring-amber-500/30' : 'bg-white dark:bg-stone-900 border-stone-200/60 dark:border-stone-850/80'}`}
                  >
                    {/* Corner decorative light */}
                    <div className="absolute right-0 top-0 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[100px]">{temple.emoji === '🌊' ? 'tsunami' : 'temple_hindu'}</span>
                    </div>

                    <div className="space-y-3">
                      {/* Title & Badge */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-0.5">
                          <h4 className="font-gujarati font-black text-xl sm:text-2xl text-amber-900 dark:text-amber-400 flex items-center gap-2 leading-tight">
                            <span>{temple.emoji}</span>
                            <span>{temple.name_gu}</span>
                          </h4>
                          <p className="font-gujarati text-stone-400 dark:text-stone-500 text-[11px] sm:text-xs">
                            {temple.name_en}
                          </p>
                        </div>
                        <span className="bg-amber-500/10 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-gujarati font-black border border-amber-500/20 whitespace-nowrap shadow-sm shrink-0">
                          {temple.highlight_gu}
                        </span>
                      </div>

                      {/* Location Badge */}
                      <div className="flex items-center gap-1 text-xs text-rose-700 dark:text-rose-400 font-gujarati font-bold bg-rose-50/50 dark:bg-rose-950/15 py-1 px-2.5 rounded-lg w-fit border border-rose-100/30">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        <span>{temple.location_gu} ({temple.location_en.split(', ')[1]})</span>
                      </div>

                      {/* Description */}
                      <div className="space-y-2.5 pt-1">
                        <p className="font-gujarati text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-semibold">
                          {temple.description_gu}
                        </p>
                        <div className="border-l-2 border-stone-200 dark:border-stone-800 pl-3 py-0.5">
                          <p className="text-[11px] sm:text-xs text-stone-450 dark:text-stone-450 leading-relaxed italic">
                            {temple.description_en}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Action buttons/chips */}
                    <div className="pt-3 border-t border-stone-100 dark:border-stone-850 flex items-center justify-between gap-4">
                      <span className="text-[10px] font-bold text-stone-400 tracking-wider">
                        {temple.highlight_en}
                      </span>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(temple.name_en + ' ' + temple.location_en)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#fef8f1] hover:bg-amber-100 dark:bg-stone-850 dark:hover:bg-stone-800 text-amber-900 dark:text-amber-300 border border-amber-500/20 py-2 px-4 rounded-xl font-gujarati font-black text-xs transition-colors flex items-center gap-1 active:scale-95 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-sm">map</span>
                        નકશો ➔
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Traditional footer border */}
            <div className="p-4 bg-amber-50/30 dark:bg-stone-900/20 border-t border-amber-500/10 text-center shrink-0">
              <p className="font-gujarati text-[10px] sm:text-xs text-stone-400 dark:text-stone-500 font-bold leading-none">
                🌺 આપના મનની શાંતિ અને દિવ્ય માર્ગદર્શન માટે ગુજરાતી એપ 🌺
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevotionalHub;
