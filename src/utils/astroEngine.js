import { EclipticLongitude, EclipticGeoMoon, MakeTime, Body } from 'astronomy-engine';

export const RASHIS = [
  { id: 1, name: "મેષ (Aries)", lord: "મંગળ", element: "અગ્નિ", varna: "Kshatriya", vashya: "Chatushpada" },
  { id: 2, name: "વૃષભ (Taurus)", lord: "શુક્ર", element: "પૃથ્વી", varna: "Vaishya", vashya: "Chatushpada" },
  { id: 3, name: "મિથુન (Gemini)", lord: "બુધ", element: "વાયુ", varna: "Shudra", vashya: "Dwipada" },
  { id: 4, name: "કર્ક (Cancer)", lord: "ચંદ્ર", element: "જળ", varna: "Brahmana", vashya: "Jalachara" },
  { id: 5, name: "સિંહ (Leo)", lord: "સૂર્ય", element: "અગ્નિ", varna: "Kshatriya", vashya: "Vanachara" },
  { id: 6, name: "કન્યા (Virgo)", lord: "બુધ", element: "પૃથ્વી", varna: "Vaishya", vashya: "Dwipada" },
  { id: 7, name: "તુલા (Libra)", lord: "શુક્ર", element: "વાયુ", varna: "Shudra", vashya: "Dwipada" },
  { id: 8, name: "વૃશ્ચિક (Scorpio)", lord: "મંગળ", element: "જળ", varna: "Brahmana", vashya: "Keeta" },
  { id: 9, name: "ધન (Sagittarius)", lord: "ગુરુ", element: "અગ્નિ", varna: "Kshatriya", vashya: "Dwipada" },
  { id: 10, name: "મકર (Capricorn)", lord: "શનિ", element: "પૃથ્વી", varna: "Vaishya", vashya: "Jalachara" },
  { id: 11, name: "કુંભ (Aquarius)", lord: "શનિ", element: "વાયુ", varna: "Shudra", vashya: "Dwipada" },
  { id: 12, name: "મીન (Pisces)", lord: "ગુરુ", element: "જળ", varna: "Brahmana", vashya: "Jalachara" }
];

export const NAKSHATRAS = [
  { name: "અશ્વિની", lord: "કેતુ", gana: "Deva", nadi: "Adi", yoni: "Ashwa" },
  { name: "ભરણી", lord: "શુક્ર", gana: "Manushya", nadi: "Madhya", yoni: "Gaja" },
  { name: "કૃતિકા", lord: "સૂર્ય", gana: "Rakshasa", nadi: "Antya", yoni: "Mesha" },
  { name: "રોહિણી", lord: "ચંદ્ર", gana: "Deva", nadi: "Antya", yoni: "Sarpa" },
  { name: "મૃગશીર્ષ", lord: "મંગળ", gana: "Deva", nadi: "Madhya", yoni: "Sarpa" },
  { name: "આદ્રા", lord: "રાહુ", gana: "Manushya", nadi: "Adi", yoni: "Shvan" },
  { name: "પુનર્વસુ", lord: "ગુરુ", gana: "Deva", nadi: "Adi", yoni: "Marjar" },
  { name: "પુષ્ય", lord: "શનિ", gana: "Deva", nadi: "Madhya", yoni: "Mesha" },
  { name: "આશ્લેષા", lord: "બુધ", gana: "Rakshasa", nadi: "Antya", yoni: "Marjar" },
  { name: "મઘા", lord: "કેતુ", gana: "Rakshasa", nadi: "Antya", yoni: "Mushak" },
  { name: "પૂર્વા ફાલ્ગુની", lord: "શુક્ર", gana: "Manushya", nadi: "Madhya", yoni: "Mushak" },
  { name: "ઉત્તરા ફાલ્ગુની", lord: "સૂર્ય", gana: "Manushya", nadi: "Adi", yoni: "Gau" },
  { name: "હસ્ત", lord: "ચંદ્ર", gana: "Deva", nadi: "Adi", yoni: "Mahisha" },
  { name: "ચિત્રા", lord: "મંગળ", gana: "Rakshasa", nadi: "Madhya", yoni: "Vyaghra" },
  { name: "સ્વાતિ", lord: "રાહુ", gana: "Deva", nadi: "Antya", yoni: "Mahisha" },
  { name: "વિશાખા", lord: "ગુરુ", gana: "Rakshasa", nadi: "Antya", yoni: "Vyaghra" },
  { name: "અનુરાધા", lord: "શનિ", gana: "Deva", nadi: "Madhya", yoni: "Shashak" },
  { name: "જ્યેષ્ઠા", lord: "બુધ", gana: "Rakshasa", nadi: "Adi", yoni: "Shashak" },
  { name: "મૂળ", lord: "કેતુ", gana: "Rakshasa", nadi: "Adi", yoni: "Shvan" },
  { name: "પૂર્વાષાઢા", lord: "શુક્ર", gana: "Manushya", nadi: "Madhya", yoni: "Markat" },
  { name: "ઉત્તરાષાઢા", lord: "સૂર્ય", gana: "Manushya", nadi: "Antya", yoni: "Simha" },
  { name: "શ્રવણ", lord: "ચંદ્ર", gana: "Deva", nadi: "Antya", yoni: "Markat" },
  { name: "ધનિષ્ઠા", lord: "મંગળ", gana: "Rakshasa", nadi: "Madhya", yoni: "Simha" },
  { name: "શતભિષા", lord: "રાહુ", gana: "Rakshasa", nadi: "Adi", yoni: "Ashwa" },
  { name: "પૂર્વા ભાદ્રપદ", lord: "ગુરુ", gana: "Manushya", nadi: "Adi", yoni: "Nakula" },
  { name: "ઉત્તરા ભાદ્રપદ", lord: "શનિ", gana: "Manushya", nadi: "Madhya", yoni: "Gau" },
  { name: "રેવતી", lord: "બુધ", gana: "Deva", nadi: "Antya", yoni: "Gaja" }
];

export const DASHA_SPANS = {
  "કેતુ": 7,
  "શુક્ર": 20,
  "સૂર્ય": 6,
  "ચંદ્ર": 10,
  "મંગળ": 7,
  "રાહુ": 18,
  "ગુરુ": 16,
  "શનિ": 19,
  "બુધ": 17
};

export const DASHAS_LIST = ["કેતુ", "શુક્ર", "સૂર્ય", "ચંદ્ર", "મંગળ", "રાહુ", "ગુરુ", "શનિ", "બુધ"];

// Calculate Lahiri Ayanamsa for a given date
export function getLahiriAyanamsa(date) {
  const julianDate = (date.getTime() / 86400000) + 2440587.5;
  const T = (julianDate - 2451545.0) / 36525.0;
  // Lahiri Ayanamsa standard polynomial equation
  return 23.85708 + 1.396013 * T - 0.000301 * T * T;
}

// Calculate Sidereal Longitudes of all planets using Astronomy Engine & Lahiri Ayanamsa
export function calculateAllPlanetSiderealLongitudes(dateObj) {
  const time = MakeTime(dateObj);
  const ayanamsa = getLahiriAyanamsa(dateObj);

  const sunLon = (EclipticLongitude(Body.Earth, time) + 180) % 360;
  const moonLon = EclipticGeoMoon(time).lon;
  const marsLon = EclipticLongitude(Body.Mars, time);
  const mercuryLon = EclipticLongitude(Body.Mercury, time);
  const jupiterLon = EclipticLongitude(Body.Jupiter, time);
  const venusLon = EclipticLongitude(Body.Venus, time);
  const saturnLon = EclipticLongitude(Body.Saturn, time);

  // Mean Rahu longitude calculation (retrograde mean node)
  const julianDate = (dateObj.getTime() / 86400000) + 2440587.5;
  const d = julianDate - 2451545.0;
  const rahuLon = (125.04452 - 0.05295376 * d + 360000) % 360;
  const ketuLon = (rahuLon + 180) % 360;

  const toSidereal = (tropicalLon) => (tropicalLon - ayanamsa + 360000) % 360;

  return {
    "સૂ": toSidereal(sunLon),
    "ચ": toSidereal(moonLon),
    "મં": toSidereal(marsLon),
    "બુ": toSidereal(mercuryLon),
    "ગુ": toSidereal(jupiterLon),
    "શુ": toSidereal(venusLon),
    "શ": toSidereal(saturnLon),
    "રા": toSidereal(rahuLon),
    "કે": toSidereal(ketuLon),
    ayanamsa
  };
}

// Compute Ascendant (Lagna) Longitude based on Local Sidereal Time and Obliquity
export function calculateSiderealAscendant(dateObj, lat, lon) {
  const julianDate = (dateObj.getTime() / 86400000) + 2440587.5;
  const d = julianDate - 2451545.0;
  const ayanamsa = getLahiriAyanamsa(dateObj);

  let gmst = (280.46061837 + 360.98564736629 * d + 360000) % 360;
  let lst = (gmst + lon + 360000) % 360;

  const obliquity = 23.439291 - 0.0000004 * d;
  const lstRad = (lst * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const oblRad = (obliquity * Math.PI) / 180;

  const yVal = -Math.cos(lstRad);
  const xVal = Math.sin(lstRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad);

  let tropicalAsc = Math.atan2(yVal, xVal) * (180 / Math.PI);
  let siderealAsc = (tropicalAsc - ayanamsa + 360000) % 360;

  return siderealAsc;
}

// Navamsa (D9) Sign determination
export function getNavamsaSignNum(long) {
  const rashiNum = Math.floor(long / 30) + 1;
  const navIdx = Math.floor((long % 30) / 3.3333333333333335);
  let startSign = 1;
  if ([1, 5, 9].includes(rashiNum)) startSign = 1;
  else if ([2, 6, 10].includes(rashiNum)) startSign = 10;
  else if ([3, 7, 11].includes(rashiNum)) startSign = 7;
  else if ([4, 8, 12].includes(rashiNum)) startSign = 4;
  return ((startSign - 1 + navIdx) % 12) + 1;
}

// Dynamic Saturn Gochar (Transit) Sade Sati & Dhayya calculation for ANY date and Moon Rashi
export function calculateDynamicSaturnPanoti(moonRashiNum, dateObj = new Date()) {
  const planetLongs = calculateAllPlanetSiderealLongitudes(dateObj);
  const saturnLong = planetLongs["શ"];
  const saturnRashiNum = Math.floor(saturnLong / 30) + 1; // 1 to 12

  // Distance from Moon Rashi to Saturn Rashi (1 to 12)
  const dist = ((saturnRashiNum - moonRashiNum + 12) % 12);

  const saturnRashiName = RASHIS[saturnRashiNum - 1].name;

  let status = "";
  let severity = "success"; // success, warning, danger
  let phase = "કોઈ સાડાસાતી કે ઢય્યા નથી";
  let description = "";
  let remedies = [];

  if (dist === 11) { // 12th from Moon -> Rising Phase of Sade Sati
    status = "સાડાસાતી (Sade Sati) - પ્રારંભિક તબક્કો";
    severity = "warning";
    phase = "પ્રથમ ચરણ (Rising Phase - ૧૨મો શનિ)";
    description = `અત્યારે શનિ મહારાજ ${saturnRashiName} માં ભ્રમણ કરી રહ્યા છે. તમારી ચંદ્ર રાશિથી શનિ ૧૨મા સ્થાને હોવાથી સાડાસાતીનો પ્રથમ અઢી વર્ષનો પ્રારંભિક તબક્કો ચાલે છે. આ સમયે બિનજરૂરી ખર્ચથી બચવું અને વિદેશ કે પ્રવાસ સંબંધી નિર્ણયમાં સાવધાની રાખવી.`;
    remedies = [
      "શનિવારે ગરીબો કે જરૂરિયાતમંદોને કાળા કપડા, અડદ કે તેલનું દાન કરવું.",
      "દરરોજ સાંજે શનિ સ્તોત્ર અથવા 'ૐ શં શનૈશ્ચરાય નમઃ' મંત્રના ૧૦૮ જાપ કરવા.",
      "પીપળાના વૃક્ષ નીચે તલના તેલનો દીવો કરવો."
    ];
  } else if (dist === 0) { // In Moon Rashi -> Peak Phase of Sade Sati
    status = "સાડાસાતી (Sade Sati) - શિખર તબક્કો";
    severity = "danger";
    phase = "બીજું ચરણ (Peak Phase - હૃદય શનિ)";
    description = `અત્યારે શનિ મહારાજ ${saturnRashiName} માં તમારી જ જન્મરાશિ પર ભ્રમણ કરી રહ્યા છે. આ સાડાસાતીનો સૌથી સક્રિય બીજો તબક્કો છે. માનસિક ચિંતા કે સ્વાસ્થ્ય અંગે બેદરકારી ન રાખવી. સત્ય અને ઈમાનદારીથી કામ લેવું.`;
    remedies = [
      "દર શનિવારે હનુમાન ચાલીસા કે સુંદરકાંડના પાઠ કરવા.",
      "શનિ મંદિરમાં કાળા તલ અને સરસિયાનું તેલ અર્પણ કરવું.",
      "પીડિતો અને સફાઈ કામદારોને યથાશક્તિ ભોજન કરાવવું."
    ];
  } else if (dist === 1) { // 2nd from Moon -> Setting Phase of Sade Sati
    status = "સાડાસાતી (Sade Sati) - અંતિમ તબક્કો";
    severity = "warning";
    phase = "ત્રીજું ચરણ (Setting Phase - દ્વિતીય શનિ)";
    description = `અત્યારે શનિ મહારાજ ${saturnRashiName} માં ભ્રમણ કરી રહ્યા છે. તમારી રાશિથી શનિ ૨જા સ્થાને હોવાથી સાડાસાતીનો અંતિમ અઢી વર્ષનો તબક્કો ચાલે છે. ધીરે ધીરે મુશ્કેલીઓ દૂર થશે અને પ્રગતિના નવા માર્ગ મળશે.`;
    remedies = [
      "શનિવારે કાળા શ્વાન (ડોગ) ને તેલવાળી રોટલી ખવડાવવી.",
      "સૂર્યાસ્ત પછી મહામૃત્યુંજય મંત્ર અથવા શનિ ચાલીસાના પાઠ કરવા.",
      "લોખંડની વસ્તુ કે કાળા અડદનું દાન કરવું."
    ];
  } else if (dist === 3) { // 4th from Moon -> Kantaka Dhayya (4th House)
    status = "શનિની ઢય્યા (Kantaka Dhayya)";
    severity = "warning";
    phase = "ચતુર્થ શનિ (૪થી ઢય્યા)";
    description = `અત્યારે શનિ મહારાજ ${saturnRashiName} માં ભ્રમણ કરી રહ્યા છે. તમારી રાશિથી શનિ ૪થા સ્થાને હોવાથી ચતુર્થ ઢય્યા ચાલી રહી છે. કૌટુંબિક અને મિલકતના નિર્ણયોમાં ધીરજ રાખવી હિતાવહ છે.`;
    remedies = [
      "શનિવારે શનિ મંદિરમાં સરસિયાના તેલનો દીવો કરવો.",
      "હનુમાનજીને દેશી ઘીનો દીવો કરી હનુમાન ચાલીસા વાંચવી.",
      "દરરોજ કીડીઓને લોટ અને સાકર અર્પણ કરવા."
    ];
  } else if (dist === 7) { // 8th from Moon -> Ashtama Dhayya (8th House)
    status = "શનિની ઢય્યા (Ashtama Dhayya)";
    severity = "danger";
    phase = "અષ્ટમ શનિ (૮મી ઢય્યા)";
    description = `અત્યારે શનિ મહારાજ ${saturnRashiName} માં ભ્રમણ કરી રહ્યા છે. તમારી રાશિથી શનિ ૮મા સ્થાને હોવાથી અષ્ટમ ઢય્યા ચાલી રહી છે. વાહન ચલાવતી વખતે અને આરોગ્ય બાબતે સાવધાની રાખવી.`;
    remedies = [
      "શનિવારે તામ્રપાત્રમાં તેલ ભરી પોતાનો ચહેરો જોઈને દાન કરવું (છાયા દાન).",
      "હનુમાન મંદિરમાં કાળા ચણા અને ગોળનો પ્રસાદ ધરાવવો.",
      "પક્ષીઓને ચણ નાખવું અને સત્કર્મ કરવા."
    ];
  } else {
    status = "શનિ પનૌતી મુક્ત (શુભ સમય)";
    severity = "success";
    phase = "કોઈ સાડાસાતી કે ઢય્યા નથી";
    description = `ખૂબ સરસ! અત્યારે શનિ મહારાજ ${saturnRashiName} માં ભ્રમણ કરી રહ્યા છે, જે તમારી રાશિ પર કોઈ અનિષ્ટ પ્રભાવ નથી લાવતા. સમય સનુકૂળ અને શુભ છે.`;
    remedies = [
      "શનિવારે કીડીઓને લોટ-ખાંડ આપવી.",
      "હનુમાન ચાલીસા પાઠ કરવા અને બઝુર્ગોના આશીર્વાદ લેવા."
    ];
  }

  return { status, severity, phase, description, remedies, saturnRashiName, saturnRashiNum };
}

// Complete Kundali Calculator utilizing Astronomy Engine
export function generateFullKundaliData(fullName, dobStr, tobStr, noTime, coords) {
  const finalTob = noTime ? "12:00" : (tobStr || "12:00");
  const [year, month, day] = dobStr.split("-").map(Number);
  const [hours, minutes] = finalTob.split(":").map(Number);

  const dateObj = new Date(Date.UTC(year, month - 1, day, hours - 5, minutes - 30));

  const lat = coords ? parseFloat(coords.lat) : 23.0225; // default Ahmedabad
  const lon = coords ? parseFloat(coords.lon) : 72.5714; // default Ahmedabad

  // 1. Calculate Sidereal Ascendant (Lagna)
  const siderealAsc = calculateSiderealAscendant(dateObj, lat, lon);
  const lagnaSignNum = Math.floor(siderealAsc / 30) + 1; // 1 to 12

  // 2. Calculate All Planet Sidereal Longitudes
  const planetSiderealLongs = calculateAllPlanetSiderealLongitudes(dateObj);

  // Distribute planets in D1 Chart Houses
  const planetsInHouses = {};
  const planetsRashiNum = {};
  Object.keys(planetSiderealLongs).forEach(p => {
    if (p === "ayanamsa") return;
    const long = planetSiderealLongs[p];
    const rashiNum = Math.floor(long / 30) + 1;
    planetsRashiNum[p] = rashiNum;
    planetsInHouses[p] = ((rashiNum - lagnaSignNum + 12) % 12) + 1;
  });

  // Navamsa (D9) Chart Distribution
  const navamsaLagnaSign = getNavamsaSignNum(siderealAsc);
  const planetsInD9Houses = {};
  Object.keys(planetSiderealLongs).forEach(p => {
    if (p === "ayanamsa") return;
    const navRashi = getNavamsaSignNum(planetSiderealLongs[p]);
    planetsInD9Houses[p] = ((navRashi - navamsaLagnaSign + 12) % 12) + 1;
  });

  // 3. Moon Nakshatra & Pada
  const moonDeg = planetSiderealLongs["ચ"];
  const nakshatraIdx = Math.floor(moonDeg / 13.333333333333334) % 27;
  const nakshatraName = NAKSHATRAS[nakshatraIdx].name;
  const pada = Math.floor((moonDeg % 13.333333333333334) / 3.3333333333333335) + 1;
  const moonRashiNum = Math.floor(moonDeg / 30) % 12 + 1;
  const moonRashi = RASHIS[moonRashiNum - 1];

  // 4. Exact Vimshottari Dasha Engine (Exact Fractional Age Math)
  const now = new Date();
  const birthTimeMs = dateObj.getTime();
  const currentTimeMs = now.getTime();
  const elapsedYears = Math.max(0, (currentTimeMs - birthTimeMs) / (365.25 * 24 * 3600 * 1000));

  const birthDashaIdx = nakshatraIdx % 9;
  const birthDashaName = DASHAS_LIST[birthDashaIdx];
  const birthDashaSpan = DASHA_SPANS[birthDashaName];
  const moonTraversedInNak = (moonDeg % 13.333333333333334) / 13.333333333333334;
  const remainingBirthDashaYears = (1 - moonTraversedInNak) * birthDashaSpan;

  let dashaIdx = birthDashaIdx;
  let currentDashaStartYear = year;
  let currentDashaEndYear = year + remainingBirthDashaYears;

  if (elapsedYears > remainingBirthDashaYears) {
    let tempElapsed = elapsedYears - remainingBirthDashaYears;
    currentDashaStartYear = year + remainingBirthDashaYears;
    while (true) {
      dashaIdx = (dashaIdx + 1) % 9;
      const nextDashaName = DASHAS_LIST[dashaIdx];
      const nextDashaSpan = DASHA_SPANS[nextDashaName];
      if (tempElapsed < nextDashaSpan) {
        currentDashaEndYear = currentDashaStartYear + nextDashaSpan;
        break;
      }
      tempElapsed -= nextDashaSpan;
      currentDashaStartYear += nextDashaSpan;
    }
  }

  const currentDashaName = DASHAS_LIST[dashaIdx];
  const nextDashaName = DASHAS_LIST[(dashaIdx + 1) % 9];
  const nextDashaStartYear = Math.floor(currentDashaEndYear);
  const dashaSpan = DASHA_SPANS[currentDashaName];
  const yearsInCurrentDasha = elapsedYears - (currentDashaStartYear - year);
  const progressPercent = Math.max(5, Math.min(95, Math.round((yearsInCurrentDasha / dashaSpan) * 100)));

  // 5. Dosh Auditing (Manglik, Kaal Sarp, Sade Sati)
  const marsHouse = planetsInHouses["મં"];
  const isManglik = [1, 4, 7, 8, 12].includes(marsHouse);
  const manglikSeverity = isManglik ? (marsHouse === 7 || marsHouse === 8 ? "ઉચ્ચ (ભારે મંગળ)" : "આંશિક (સૌમ્ય મંગળ)") : "કોઈ દોષ નથી";

  const rahuHouse = planetsInHouses["રા"];
  const ketuHouse = planetsInHouses["કે"];
  const minSarp = Math.min(rahuHouse, ketuHouse);
  const maxSarp = Math.max(rahuHouse, ketuHouse);
  let allInside = true;
  let allOutside = true;
  Object.keys(planetsInHouses).forEach(p => {
    if (p !== "રા" && p !== "કે") {
      const h = planetsInHouses[p];
      if (h < minSarp || h > maxSarp) allInside = false;
      if (h > minSarp && h < maxSarp) allOutside = false;
    }
  });
  const sarpDoshTypes = ["અનંત", "કુલિક", "વાસુકી", "શંખપાલ", "પદ્મ", "મહાપદ્મ", "તક્ષક", "કર્કોટકા", "શંખચૂડ", "ઘાતક", "વિષધર", "શેષનાગ"];
  const hasKaalSarp = allInside || allOutside;
  const kaalSarpType = hasKaalSarp ? sarpDoshTypes[Math.floor(Math.abs(d)) % 12] : "નથી";

  // Dynamic Saturn Panoti
  const panotiRes = calculateDynamicSaturnPanoti(moonRashiNum, now);
  const isSadeSati = panotiRes.status.includes("સાડાસાતી");
  const sadeSatiPhase = panotiRes.phase;

  // Planet Details Table List
  const planetNames = {
    "સૂ": "સૂર્ય (Sun)",
    "ચ": "ચંદ્ર (Moon)",
    "મં": "મંગળ (Mars)",
    "બુ": "બુધ (Mercury)",
    "ગુ": "ગુરુ (Jupiter)",
    "શુ": "શુક્ર (Venus)",
    "શ": "શનિ (Saturn)",
    "રા": "રાહુ (Rahu)",
    "કે": "કેતુ (Ketu)"
  };

  const planetDetailsList = Object.keys(planetSiderealLongs).filter(p => p !== "ayanamsa").map(p => {
    const long = planetSiderealLongs[p];
    const rIdx = Math.floor(long / 30) % 12;
    const rashi = RASHIS[rIdx];
    const nIdx = Math.floor(long / 13.333333333333334) % 27;
    const nName = NAKSHATRAS[nIdx].name;
    const padVal = Math.floor((long % 13.333333333333334) / 3.3333333333333335) + 1;
    return {
      key: p,
      fullName: planetNames[p],
      rashiName: rashi.name,
      rashiLord: rashi.lord,
      nakshatraName: nName,
      pada: padVal
    };
  });

  return {
    lagnaSignNum,
    navamsaLagnaSign,
    planetsInHouses,
    planetsInD9Houses,
    nakshatraName,
    pada,
    moonRashi,
    moonRashiNum,
    currentDashaName,
    nextDashaName,
    nextDashaStartYear,
    progressPercent,
    isManglik,
    manglikSeverity,
    hasKaalSarp,
    kaalSarpType,
    isSadeSati,
    sadeSatiPhase,
    planetDetailsList
  };
}
