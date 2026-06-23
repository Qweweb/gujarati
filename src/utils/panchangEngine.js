import { EclipticLongitude, EclipticGeoMoon, MakeTime, Body, SearchMoonPhase } from 'astronomy-engine';

const TITHI_NAMES_SUD = [
  "સુદ એકમ", "સુદ બીજ", "સુદ ત્રીજ", "સુદ ચોથ", "સુદ પાંચમ",
  "સુદ છઠ", "સુદ સાતમ", "સુદ આઠમ", "સુદ નોમ", "સુદ દશમ",
  "સુદ અગિયારસ", "સુદ બારસ", "સુદ તેરસ", "સુદ ચૌદશ", "સુદ પૂનમ"
];

const TITHI_NAMES_VAD = [
  "વદ એકમ", "વદ બીજ", "વદ ત્રીજ", "વદ ચોથ", "વદ પાંચમ",
  "વદ છઠ", "વદ સાતમ", "વદ આઠમ", "વદ નોમ", "વદ દશમ",
  "વદ અગિયારસ", "વદ બારસ", "વદ તેરસ", "વદ ચૌદશ", "વદ અમાસ"
];

const NAKSHATRA_NAMES = [
  "અશ્વિની", "ભરણી", "કૃત્તિકા", "રોહિણી", "મૃગશીર્ષ", "આર્દ્રા", "પુનર્વસુ", "પુષ્ય", "આશ્લેષા",
  "મઘા", "પૂર્વા ફાલ્ગુની", "ઉત્તરા ફાલ્ગુની", "હસ્ત", "ચિત્રા", "સ્વાતિ", "વિશાખા", "અનુરાધા", "જ્યેષ્ઠા",
  "મૂળ", "પૂર્વાષાઢા", "ઉત્તરાષાઢા", "શ્રવણ", "ધનિષ્ઠા", "શતતારકા", "પૂર્વા ભાદ્રપદ", "ઉત્તરા ભાદ્રપદ", "રેવતી"
];

const RASHI_DETAILS = [
  { name: "મેષ", letters: "અ, લ, ઈ" },
  { name: "વૃષભ", letters: "બ, વ, ઉ" },
  { name: "મિથુન", letters: "ક, છ, ઘ" },
  { name: "કર્ક", letters: "ડ, હ" },
  { name: "સિંહ", letters: "મ, ટ" },
  { name: "કન્યા", letters: "પ, ઠ, ણ" },
  { name: "તુલા", letters: "ર, ત" },
  { name: "વૃશ્ચિક", letters: "ન, ય" },
  { name: "ધન", letters: "ભ, ધ, ફ, ઢ" },
  { name: "મકર", letters: "ખ, જ" },
  { name: "કુંભ", letters: "ગ, શ, સ, ષ" },
  { name: "મીન", letters: "દ, ચ, ઝ, થ" }
];

const MAAS_NAMES = [
  "વૈશાખ", "જેઠ", "અષાઢ", "શ્રાવણ", "ભાદરવો", "આસો",
  "કારતક", "માગશર", "પોષ", "મહા", "ફાગણ", "ચૈત્ર"
];

const YOGA_NAMES = [
  "વિષ્કંભ", "પ્રીતિ", "આયુષ્માન", "સૌભાગ્ય", "શોભન", "અતિગંડ", "સુકર્મા", "ધૃતિ", "શૂલ",
  "ગંડ", "વૃદ્ધિ", "ધ્રુવ", "વ્યાઘાત", "હર્ષણ", "વજ્ર", "સિદ્ધિ", "વ્યતીપાત", "વરિયાન",
  "પરિઘ", "શિવ", "સિદ્ધ", "સાધ્ય", "શુભ", "શુક્લ", "બ્રહ્મ", "એન્દ્ર", "વૈધૃતિ"
];

const KARANA_NAMES = [
  "કિંસ્તુઘ્ન", "બવ", "બાલવ", "કૌલવ", "તૈતિલ", "ગર", "વણિજ", "વિષ્ટિ (ભદ્રા)",
  "શકુનિ", "ચતુષ્પદ", "નાગ"
];

// Helper to get Nirayana coordinates
function getNirayanaCoords(date) {
  const time = MakeTime(date);
  const julianDate = (date.getTime() / 86400000) + 2440587.5;
  const T = (julianDate - 2451545.0) / 36525.0;
  const ayanamsa = 23.85708 + 1.396013 * T - 0.000301 * T * T;

  const sunLon = (EclipticLongitude(Body.Earth, time) + 180) % 360;
  const moonCoords = EclipticGeoMoon(time);
  const moonLon = moonCoords.lon;

  const nirayanaSunLon = (sunLon - ayanamsa + 360) % 360;
  const nirayanaMoonLon = (moonLon - ayanamsa + 360) % 360;

  return { sunLon, moonLon, nirayanaSunLon, nirayanaMoonLon, ayanamsa, time };
}

// Get indices for a given date
function getIndicesAt(date) {
  const { sunLon, moonLon, nirayanaSunLon, nirayanaMoonLon } = getNirayanaCoords(date);

  const diffTithi = (moonLon - sunLon + 360) % 360;
  const tithiIndex = Math.floor(diffTithi / 12) % 30;

  const nakshatraIndex = Math.floor(nirayanaMoonLon / (360 / 27)) % 27;

  const diffYoga = (nirayanaMoonLon + nirayanaSunLon) % 360;
  const yogaIndex = Math.floor(diffYoga / (360 / 27)) % 27;

  const diffKarana = (moonLon - sunLon + 360) % 360;
  const totalKaranaIndex = Math.floor(diffKarana / 6) % 60;
  
  let karanaIndex = 0;
  if (totalKaranaIndex === 0) {
    karanaIndex = 0;
  } else if (totalKaranaIndex >= 57) {
    karanaIndex = 8 + (totalKaranaIndex - 57);
  } else {
    karanaIndex = 1 + ((totalKaranaIndex - 1) % 7);
  }

  return { tithiIndex, nakshatraIndex, yogaIndex, karanaIndex, totalKaranaIndex };
}

// Find next transition time (end time of current item)
function findTransition(startDate, key) {
  let date = new Date(startDate.getTime());
  const initialIndex = getIndicesAt(date)[key];
  
  let hours = 0;
  let prevDate = new Date(date.getTime());
  while (hours < 30) {
    date.setTime(date.getTime() + 60 * 60 * 1000);
    const currIndex = getIndicesAt(date)[key];
    if (currIndex !== initialIndex) {
      break;
    }
    prevDate.setTime(date.getTime());
    hours++;
  }

  let startMs = prevDate.getTime();
  let endMs = date.getTime();
  for (let i = 0; i < 10; i++) {
    const midMs = (startMs + endMs) / 2;
    const midIndex = getIndicesAt(new Date(midMs))[key];
    if (midIndex === initialIndex) {
      startMs = midMs;
    } else {
      endMs = midMs;
    }
  }

  return new Date((startMs + endMs) / 2);
}

// Format date into IST with Gujarati numerals
function formatTransitionTime(d) {
  if (!d) return "";
  const str = d.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true });
  const toGu = s => s.toString().replace(/[0-9]/g, d => '૦૧૨૩૪૫૬૭૮૯'[d]);
  return toGu(str);
}

/**
 * Calculates current Panchang based on a 100% precise astronomical engine.
 */
export function getDailyPanchang(date = new Date()) {
  const indices = getIndicesAt(date);
  
  // 1. Tithi Name
  let tithiName, paksh;
  if (indices.tithiIndex < 15) {
    tithiName = TITHI_NAMES_SUD[indices.tithiIndex];
    paksh = "સુદ";
  } else {
    tithiName = TITHI_NAMES_VAD[indices.tithiIndex - 15];
    paksh = "વદ";
  }

  // 2. Nakshatra Name
  const nakshatraName = NAKSHATRA_NAMES[indices.nakshatraIndex];

  // 3. Rashi Name
  const { nirayanaMoonLon } = getNirayanaCoords(date);
  const rashiIndex = Math.floor(nirayanaMoonLon / 30) % 12;
  const rashi = RASHI_DETAILS[rashiIndex];

  // 4. Yoga Name
  const yogaName = YOGA_NAMES[indices.yogaIndex];

  // 5. Karana Name
  const karanaName = KARANA_NAMES[indices.karanaIndex];

  // 6. Maas (Month)
  const searchStart = new Date(date.getTime() - 35 * 24 * 3600 * 1000);
  const prevNewMoonTime = SearchMoonPhase(0.0, searchStart, 40);
  const nextNewMoonTime = SearchMoonPhase(0.0, date, 40);

  function getSunRashiAt(timeObj) {
    if (!timeObj) return 0;
    const jd = (timeObj.date.getTime() / 86400000) + 2440587.5;
    const tVal = (jd - 2451545.0) / 36525.0;
    const ay = 23.85708 + 1.396013 * tVal - 0.000301 * tVal * tVal;
    const sLon = (EclipticLongitude(Body.Earth, timeObj) + 180) % 360;
    const nirayanaSLon = (sLon - ay + 360) % 360;
    return Math.floor(nirayanaSLon / 30) % 12;
  }

  const prevRashi = prevNewMoonTime ? getSunRashiAt(prevNewMoonTime) : 0;
  const nextRashi = nextNewMoonTime ? getSunRashiAt(nextNewMoonTime) : 0;

  let maasName = "";
  if (prevNewMoonTime && nextNewMoonTime && prevRashi === nextRashi) {
    maasName = "અધિક " + MAAS_NAMES[prevRashi];
  } else {
    const rIndex = prevNewMoonTime ? getSunRashiAt(prevNewMoonTime) : 0;
    maasName = MAAS_NAMES[rIndex];
  }

  // Calculate Transitions (End Times)
  const tithiEnd = findTransition(date, 'tithiIndex');
  const nakshatraEnd = findTransition(date, 'nakshatraIndex');
  const yogaEnd = findTransition(date, 'yogaIndex');
  const karanaEnd = findTransition(date, 'totalKaranaIndex');

  return {
    tithi: tithiName,
    tithiEnd: formatTransitionTime(tithiEnd),
    paksh: paksh,
    maas: maasName,
    rashi: rashi.name,
    rashiLetters: rashi.letters,
    nakshatra: nakshatraName,
    nakshatraEnd: formatTransitionTime(nakshatraEnd),
    yoga: yogaName,
    yogaEnd: formatTransitionTime(yogaEnd),
    karana: karanaName,
    karanaEnd: formatTransitionTime(karanaEnd),
  };
}
