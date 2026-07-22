# -*- coding: utf-8 -*-
import os

file_path = r"d:\Antigravity\Gujarati\src\components\GujaratNewsMap.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Define the new, real MOCK_NEWS array
real_mock_news = """const MOCK_NEWS = [
  // Morbi & Halvad
  { 
    id: 1, 
    district: 'morbi', 
    source: 'દિવ્ય ભાસ્કર', 
    logo: '🔥', 
    title: 'મોરબી ખેડૂત આંદોલન: નેહલ અમૃતિયા અને ગુરનામ ચઢૂનીનો કાર્યક્રમ રદ', 
    desc: 'મોરબીના જેતપર રોડ પર ખેડૂતોના વીજપોલ વિરોધ પ્રદર્શન અંગે આંદોલનકારીઓની સભા અનિવાર્ય સંજોગોસર રદ કરવામાં આવી છે.', 
    category: 'local', 
    minutesAgo: 12, 
    link: 'https://www.divyabhaskar.co.in/local/gujarat/morbi/news/morbi-farmer-protest-nehul-amrutiya-gurman-chadhuni-program-cancelled-138357420.html' 
  },
  { 
    id: 2, 
    district: 'morbi', 
    source: 'સંદેશ સમાચાર', 
    logo: '📰', 
    title: 'હળવદના રાણેકપર ગામમાં મંદિર નજીક વાડ બનાવવા મુદ્દે બે જૂથો વચ્ચે ધમાલ', 
    desc: 'ધાર્મિક સ્થળ નજીક તારની વાડ ઉભી કરવા બાબતે હિંસક ઝપાઝપી થતા પોલીસે બંને પક્ષે સામસામી ફરિયાદ નોંધી વધુ તપાસ હાથ ધરી છે.', 
    category: 'crime', 
    minutesAgo: 45, 
    link: 'https://sandesh.com/gujarat/news/maru-saher-maru-gaam/ahmedabad/read-important-news-from-08-am-to-12-pm-04-july-2026' 
  },
  
  // Dwarka & Okha / Khambhaliya
  { 
    id: 3, 
    district: 'dwarka', 
    town: 'okha', 
    source: 'દિવ્ય ભાસ્કર', 
    logo: '🔥', 
    title: 'ઓખા પોર્ટ પર ૩ નંબરનું સિગ્નલ લાગુ: માછીમારોને એલર્ટ', 
    desc: 'અરબી સમુદ્રમાં સર્જાયેલા ડિપ્રેશનને કારણે ૬૦ કિમી પ્રતિ કલાકની ઝડપે ભારે પવન ફૂંકાવાની આગાહીને પગલે ઓખા બંદરે ચેતવણી સિગ્નલ લગાવાયું છે.', 
    category: 'weather', 
    minutesAgo: 28, 
    link: 'https://www.divyabhaskar.co.in/local/gujarat/dwarka/news/okha-port-3-signal-60kmph-wind-fishermen-alert-138357332.html' 
  },
  { 
    id: 4, 
    district: 'dwarka', 
    town: 'khambhaliya', 
    source: 'દિવ્ય ભાસ્કર', 
    logo: '🔥', 
    title: 'દ્વારકાના દરિયાકાંઠાના વિસ્તારોમાં સુરક્ષા વ્યવસ્થા સજ્જ કરાઈ', 
    desc: 'મોન્સૂન સીઝનને લઈને યાત્રાધામ દ્વારકા અને ઓખા કોસ્ટલ બેલ્ટ પર મરીન પોલીસ અને કોસ્ટગાર્ડની ટીમો તૈનાત કરવામાં આવી છે.', 
    category: 'local', 
    minutesAgo: 180, 
    link: 'https://www.divyabhaskar.co.in/local/gujarat/dwarka/news/security-arrangements-have-been-tightened-along-the-coast-dbp-138354290.html' 
  },
  
  // Ahmedabad & Viramgam / Dholka
  { 
    id: 5, 
    district: 'ahmedabad', 
    town: 'viramgam', 
    source: 'સંદેશ સમાચાર', 
    logo: '📰', 
    title: 'અમદાવાદમાં ગેરકાયદે હુક્કાબાર પર ત્રાટકી પોલીસ, કાફેમાં નશીલી ફ્લેવર જપ્ત', 
    desc: 'હુક્કાબાર પર ત્રાટકી પોલીસ, છારોડીના કાફેમાં નશીલી ફ્લેવરનું વેચાણ ઝડપાયું, સંચાલક અને મેનેજર સામે ગુનો દાખલ.', 
    category: 'crime', 
    minutesAgo: 15, 
    link: 'https://sandesh.com/gujarat/news/ahmedabad/ahmedabad-chharodi-elysium-cafe-illegal-hookah-bar-raid-sola-police-action' 
  },
  { 
    id: 6, 
    district: 'ahmedabad', 
    town: 'dholka', 
    source: 'દિવ્ય ભાસ્કર', 
    logo: '🔥', 
    title: 'અમદાવાદમાં મુશળધાર વરસાદ: સુભાષ બ્રિજ અને માધુપુરા અંડરપાસમાં ભરાયા પાણી', 
    desc: 'શહેરમાં બે કલાકમાં દોઢ ઇંચ વરસાદ ખાબકતા નીચાણવાળા વિસ્તારો જળબંબાકાર થયા છે. વાહનચાલકોને ભારે હાલાકીનો સામનો કરવો પડી રહ્યો છે.', 
    category: 'weather', 
    minutesAgo: 24, 
    link: 'https://www.divyabhaskar.co.in/local/gujarat/ahmedabad/news/ahmedabad-rain-subhash-bridge-madhupura-shahibaug-138357344.html' 
  },
  
  // Kutch & Mundra / Bhuj
  { 
    id: 7, 
    district: 'kutch', 
    town: 'mundra', 
    source: 'સંદેશ સમાચાર', 
    logo: '📰', 
    title: 'એલ નીનો: ગુજરાતના ૨૩ સહિત ૩૧૫ જિલ્લાઓ સંવેદનશીલ જાહેર', 
    desc: 'અલનીનોની અસર સામે લડવા કેન્દ્ર સરકાર સજ્જ. હવામાન અને પાકના રક્ષણ માટે આગોતરા પગલાં લેવામાં આવશે.', 
    category: 'weather', 
    minutesAgo: 35, 
    link: 'https://sandesh.com/gujarat/news/el-nino-315-districts-including-23-in-gujarat-declared-vulnerable-centres-preparations-against-el-nino' 
  },
  { 
    id: 8, 
    district: 'kutch', 
    town: 'bhuj', 
    source: 'દિવ્ય ભાસ્કર', 
    logo: '🔥', 
    title: 'સાણંદમાં દેશનો ત્રીજો સેમિકન્ડક્ટર પ્લાન્ટ સ્થાપવા પાયો નંખાયો', 
    desc: 'કેન્દ્રીય મંત્રી અશ્વિની વૈષ્ણવની અમદાવાદ મુલાકાત દરમિયાન સાણંદ ખાતે નવા સેમિકન્ડક્ટર એસેમ્બલી અને ટેસ્ટિંગ પ્લાન્ટને મંજૂરી આપવામાં આવી છે.', 
    category: 'business', 
    minutesAgo: 720, 
    link: 'https://www.divyabhaskar.co.in/local/gujarat/ahmedabad/news/sanand-cg-semi-osat-plant-chip-launch-modi-138353317.html' 
  },
  
  // Surat & Bardoli
  { 
    id: 9, 
    district: 'surat', 
    town: 'bardoli', 
    source: 'સંદેશ સમાચાર', 
    logo: '📰', 
    title: 'સુરતની કિમ નદીમાં ઘોડાપૂર: માંગરોળ બ્રિજ સુધી પાણી પહોંચ્યા', 
    desc: 'ઉપરવાસમાં પડેલા ભારે વરસાદથી સુરતની કિમ નદી બે કાંઠે વહી રહી છે. માંગરોળ અને મોટા બોરસરા બ્રિજ પાસે તંત્ર એલર્ટ મોડ પર મુકાયું છે.', 
    category: 'weather', 
    minutesAgo: 900, 
    link: 'https://sandesh.com/weather/news/gujarat/surat/monsoon-2026-surat-kim-river-flooded-mangrol-mota-borsara-bridge-water-level-rise' 
  },
  
  // Rajkot & Gondal
  { 
    id: 10, 
    district: 'rajkot', 
    town: 'gondal', 
    source: 'સંદેશ સમાચાર', 
    logo: '📰', 
    title: 'રાજકોટ: વોર્ડ ૧૮ના કોઠારીયા અને વિરાણી અઘાટમાં દોઢ ઇંચ વરસાદમાં રોડ તૂટ્યા', 
    desc: 'કોઠારીયા રોડ પર ભારે પાણી ભરાવાથી રસ્તાઓ ધોવાયા છે. વાહનચાલકો માટે અકસ્માતનું જોખમ વધતાં સ્થાનિકોમાં રોષ.', 
    category: 'local', 
    minutesAgo: 45, 
    link: 'https://sandesh.com/gujarat/news/rajkot/heavy-rain-road-damaged-virani-aghat-ward-18-kothariya-sub-water-system-line-issues' 
  },
  
  // Gandhinagar
  { 
    id: 11, 
    district: 'gandhinagar', 
    source: 'દિવ્ય ભાસ્કર', 
    logo: '🔥', 
    title: 'ગુજરાત સેમિકન્ડક્ટર હબ બનશે: ૧.૨૪ લાખ કરોડના રોકાણથી ૫૦,૦૦૦ નોકરીઓ', 
    desc: 'ગાંધીનગર મહાત્મા મંદિર ખાતે સેમિકન્ડક્ટર પોલીસી હેઠળ મોટા રોકાણને મંજૂરી. વૈશ્વિક સેમિકન્ડક્ટર કંપનીઓ ગુજરાતમાં ઇન્ફ્રાસ્ટ્રક્ચર સ્થાપશે.', 
    category: 'business', 
    minutesAgo: 25, 
    link: 'https://www.divyabhaskar.co.in/local/gujarat/gandhinagar/news/gujarat-semiconductor-hub-124-lakh-crore-projects-50k-jobs-138357971.html' 
  }
];"""

# Replace MOCK_NEWS in GujaratNewsMap.jsx
import re
pattern = r"const MOCK_NEWS = \[.*?\];"
content = re.sub(pattern, real_mock_news, content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS: Mock news array replaced with real URLs!")
