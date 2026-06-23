import { EclipticLongitude, EclipticGeoMoon, MakeTime, Body, SearchMoonPhase } from 'astronomy-engine';

const TITHI_NAMES_SUD = [
  "એકમ", "બીજ", "ત્રીજ", "ચોથ", "પાંચમ",
  "છઠ", "સાતમ", "આઠમ", "નોમ", "દશમ",
  "અગિયારસ", "બારસ", "તેરસ", "ચૌદશ", "પૂનમ"
];

const TITHI_NAMES_VAD = [
  "એકમ", "બીજ", "ત્રીજ", "ચોથ", "પાંચમ",
  "છઠ", "સાતમ", "આઠમ", "નોમ", "દશમ",
  "અગિયારસ", "બારસ", "તેરસ", "ચૌદશ", "અમાસ"
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
  { name: "મીન", letters: "દ, ચ, ઝ, th" }
];

const MAAS_NAMES = [
  "વૈશાખ", "જેઠ", "અષાઢ", "શ્રાવણ", "ભાદરવો", "આસો",
  "કારતક", "માગશર", "પોષ", "મહા", "ફાગણ", "ચૈત્ર"
];

function getDailyPanchang(date) {
  const time = MakeTime(date);
  
  // 1. Ayanamsa
  const julianDate = (date.getTime() / 86400000) + 2440587.5;
  const T = (julianDate - 2451545.0) / 36525.0;
  const ayanamsa = 23.85708 + 1.396013 * T - 0.000301 * T * T;

  // 2. Positions
  const sunLon = (EclipticLongitude(Body.Earth, time) + 180) % 360;
  const moonCoords = EclipticGeoMoon(time);
  const moonLon = moonCoords.lon;

  // Nirayana (sidereal) Moon longitude
  const nirayanaMoonLon = (moonLon - ayanamsa + 360) % 360;

  // 3. Tithi
  const diff = (moonLon - sunLon + 360) % 360;
  const tithiIndex = Math.floor(diff / 12) % 30;
  
  let tithiName, paksh;
  if (tithiIndex < 15) {
    tithiName = "સુદ " + TITHI_NAMES_SUD[tithiIndex];
    paksh = "સુદ";
  } else {
    tithiName = "વદ " + TITHI_NAMES_VAD[tithiIndex - 15];
    paksh = "વદ";
  }

  // 4. Nakshatra
  const nakshatraIndex = Math.floor(nirayanaMoonLon / (360 / 27)) % 27;
  const nakshatraName = NAKSHATRA_NAMES[nakshatraIndex];

  // 5. Rashi
  const rashiIndex = Math.floor(nirayanaMoonLon / 30) % 12;
  const rashi = RASHI_DETAILS[rashiIndex];

  // 6. Maas (Month)
  const prevNewMoonTime = SearchMoonPhase(0.0, date, -30);
  const nextNewMoonTime = SearchMoonPhase(0.0, date, 30);

  function getSunRashiAt(timeObj) {
    const jd = (timeObj.date.getTime() / 86400000) + 2440587.5;
    const tVal = (jd - 2451545.0) / 36525.0;
    const ay = 23.85708 + 1.396013 * tVal - 0.000301 * tVal * tVal;
    const sLon = (EclipticLongitude(Body.Earth, timeObj) + 180) % 360;
    const nirayanaSLon = (sLon - ay + 360) % 360;
    return Math.floor(nirayanaSLon / 30) % 12;
  }

  const prevRashi = getSunRashiAt(prevNewMoonTime);
  const nextRashi = getSunRashiAt(nextNewMoonTime);

  let maasName = "";
  if (prevRashi === nextRashi) {
    maasName = "અધિક " + MAAS_NAMES[prevRashi];
  } else {
    maasName = MAAS_NAMES[nextRashi];
  }

  return {
    tithi: maasName + " " + tithiName,
    paksh: paksh,
    maas: maasName,
    rashi: rashi.name,
    rashiLetters: rashi.letters,
    nakshatra: nakshatraName,
  };
}

const dates = [
  new Date('2026-06-10T12:00:00Z'),
  new Date('2026-06-20T12:00:00Z'),
  new Date('2026-11-09T12:00:00Z')
];

for (const d of dates) {
  console.log(`\nDate: ${d.toISOString()}`);
  console.log(getDailyPanchang(d));
}
