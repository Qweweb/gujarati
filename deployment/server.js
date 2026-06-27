const express = require('express');
const { MhahPanchang } = require('mhah-panchang');

const app = express();
const port = 8002;
const panchang = new MhahPanchang();

// Gujarati mappings for Month
const MONTHS_MAP = {
  "Chaitra": "ચૈત્ર",
  "Vaisakha": "વૈશાખ",
  "Vaishakha": "વૈશાખ",
  "Vaisakh": "વૈશાખ",
  "Vaishakh": "વૈશાખ",
  "Jyestha": "જેઠ",
  "Jyeshtha": "જેઠ",
  "Ashadha": "અષાઢ",
  "Asadha": "અષાઢ",
  "Shravana": "શ્રાવણ",
  "Sravana": "શ્રાવણ",
  "Bhadrapada": "ભાદરવો",
  "Bhadra": "ભાદરવો",
  "Ashvina": "આસો",
  "Asvina": "આસો",
  "Ashvin": "આસો",
  "Kartika": "કાર્તક",
  "Kartik": "કાર્તક",
  "Margashirsha": "માગશર",
  "Margasira": "માગશર",
  "Pausa": "પોષ",
  "Pausha": "પોષ",
  "Magha": "મહા",
  "Magh": "મહા",
  "Phalguna": "ફાગણ",
  "Phalgun": "ફાગણ"
};

const PAKSH_MAP = {
  "Shukla": "સુદ",
  "Krishna": "વદ"
};

const TITHIS_MAP = {
  "Pratipada": "એકમ",
  "Prathama": "એકમ",
  "Dwitiya": "બીજ",
  "Tritiya": "ત્રીજ",
  "Chaturthi": "ચોથ",
  "Panchami": "પાંચમ",
  "Shashthi": "છઠ",
  "Shasthi": "છઠ",
  "Saptami": "સાતમ",
  "Ashtami": "આઠમ",
  "Navami": "નોમ",
  "Dashami": "દશમ",
  "Ekadashi": "એકાદશી",
  "Ekadasi": "એકાદશી",
  "Dwadashi": "બારસ",
  "Trayodashi": "તેરસ",
  "Chaturdashi": "ચૌદસ",
  "Purnima": "પૂનમ",
  "Amavasya": "અમાસ"
};

const NAKSHATRAS_MAP = {
  "Ashwini": "અશ્વિની",
  "Bharani": "ભરણી",
  "Krittika": "કૃતિકા",
  "Rohini": "રોહિણી",
  "Mrigashirsha": "મૃગશીર્ષ",
  "Mrigashira": "મૃગશીર્ષ",
  "Ardra": "આદ્રા",
  "Punarvasu": "પુનર્વસુ",
  "Pushya": "પુષ્ય",
  "Ashlesha": "આશ્લેષા",
  "Magha": "મઘા",
  "Purva Phalguni": "પૂર્વા ફાલ્ગુની",
  "PurvaPhalguni": "પૂર્વા ફાલ્ગુની",
  "Uttara Phalguni": "ઉત્તરા ફાલ્ગુની",
  "UttaraPhalguni": "ઉત્તરા ફાલ્ગુની",
  "Hasta": "હસ્ત",
  "Chitra": "ચિત્રા",
  "Svati": "સ્વાતિ",
  "Swati": "સ્વાતિ",
  "Vishakha": "વિશાખા",
  "Anuradha": "અનુરાધા",
  "Jyeshtha": "જ્યેષ્ઠા",
  "Jyestha": "જ્યેષ્ઠા",
  "Mula": "મૂળ",
  "Purva Ashadha": "પૂર્વા અષાઢા",
  "PurvaAshadha": "પૂર્વા અષાઢા",
  "Uttara Ashadha": "ઉત્તરા અષાઢા",
  "UttaraAshadha": "ઉત્તરા અષાઢા",
  "Shravana": "શ્રાવણ",
  "Dhanishta": "ધનિષ્ઠા",
  "Shatabhisha": "શતભિષા",
  "Shatataraka": "શતભિષા",
  "Purva Bhadrapada": "પૂર્વા ભાદ્રપદ",
  "PurvaBhadrapada": "પૂર્વા ભાદ્રપદ",
  "Uttara Bhadrapada": "ઉત્તરા ભાદ્રપદ",
  "UttaraBhadrapada": "ઉત્તરા ભાદ્રપદ",
  "Revati": "રેવતી"
};

const RASHI_MAP = {
  "Aries": "મેષ",
  "Taurus": "વૃષભ",
  "Gemini": "મિથુન",
  "Cancer": "કર્ક",
  "Leo": "સિંહ",
  "Virgo": "કન્યા",
  "Libra": "તુલા",
  "Scorpio": "વૃશ્ચિક",
  "Sagittarius": "ધન",
  "Capricorn": "મકર",
  "Aquarius": "કુંભ",
  "Pisces": "મીન"
};

const RASHI_LETTERS = {
  "મેષ": "અ, લ, ઈ",
  "વૃષભ": "બ, વ, ઉ",
  "મિથુન": "ક, છ, ઘ",
  "કર્ક": "ડ, હ",
  "સિંહ": "મ, ટ",
  "કન્યા": "પ, ઠ, ણ",
  "તુલા": "ર, ત",
  "વૃશ્ચિક": "ન, ય",
  "ધન": "ભ, ધ, ફ, ઢ",
  "મકર": "ખ, જ",
  "કુંભ": "ગ, સ, શ, ષ",
  "મીન": "દ, ચ, ઝ, થ"
};

const SUVICHARS = [
  "સચ્ચાઈનો જ હંમેશા વિજય થાય છે!",
  "પરિશ્રમ એ જ સાચી સફળતાની ચાવી છે.",
  "સંતોષી નર સદા સુખી.",
  "વિદ્યા વિનયથી શોભે છે.",
  "કર્મ કરો, ફળની આશા ન રાખો.",
  "નમ્રતા બધા ગુણોનું આભૂષણ છે.",
  "સારો વિચાર એ જ સાચું ધન છે.",
  "દયા એ જ ધર્મનું મૂળ છે.",
  "ધીરજના ફળ મીઠા હોય છે.",
  "સમય વહી જાય છે, પાછો આવતો નથી."
];

const HEALTH_TIPS = [
  "બા, આજે સવારે પૂરતું પાણી પીધું?",
  "દાદા, સવારના તડકામાં ૧૫ મિનિટ બેસજો, વિટામિન-ડી મળશે.",
  "નિયમિત સહેલગાહ કરવાથી હૃદય સ્વસ્થ રહે છે.",
  "રાત્રે હળવો ખોરાક લેવો સ્વાસ્થ્ય માટે ઉત્તમ છે.",
  "ભોજનમાં લીલા શાકભાજી અને ફળોનો ઉપયોગ વધારો.",
  "રોજ સવારે નિયમિત પણે તાજું પાણી પીવાની ટેવ પાડો.",
  "જમ્યા પછી તરત જ સૂઈ જવું સ્વાસ્થ્ય માટે હાનિકારક છે.",
  "योग અને પ્રાણાયામથી મન અને શરીર સ્વસ્થ રહે છે.",
  "વધુ પડતું મીઠું અને ખાંડ ખાવાનું ટાળો.",
  "આખી રાત પૂરતી ૭-૮ કલાકની ઊંઘ લેવી જરૂરી છે."
];

const COMMUNITY_ALERTS = [
  "ખોરજ ગામમાં આવતીકાલે સવારે રસીકરણ કેમ્પ છે.",
  "આગામી રવિવારે ગામમાં રક્તદાન શિબિરનું આયોજન કરેલ છે.",
  "સોમવારે ગામમાં કૃષિ માર્ગદર્શન સેમિનાર યોજાશે.",
  "ગામ પંચાયતમાં નવા આધાર કાર્ડ માટેની કામગીરી ચાલુ છે.",
  "આવતા અઠવાડિયે ગામની શાળામાં વાર્ષિક રમતગમત ઉત્સવ છે.",
  "પાલિકા દ્વારા સ્વચ્છતા અભિયાન અંતર્ગત કચરો યોગ્ય જગ્યાએ નાખવા અપીલ.",
  "ચોમાસાને ધ્યાનમાં રાખીને ગામમાં જંતુનાશક દવાનો છંટકાવ કરવામાં આવશે.",
  "ગામના તળાવ સફાઈ માટે રવિવારે શ્રમદાનનું આયોજન છે."
];

// Helper to format time in Gujarati digits
const formatTimeToGujarati = (isoString, offsetMinutes = 330) => {
  if (!isoString) return "૦૫:૫૮ AM";
  
  const d = new Date(new Date(isoString).getTime() + offsetMinutes * 60 * 1000);
  let h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  
  const pad = (n) => n < 10 ? '0' + n : n;
  
  const gujaratiNumerals = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];
  const toGu = (numStr) => numStr.toString().split('').map(digit => {
    if (digit >= '0' && digit <= '9') {
      return gujaratiNumerals[parseInt(digit, 10)];
    }
    return digit;
  }).join('');
  
  return `${toGu(pad(h))}:${toGu(pad(m))} ${ampm}`;
};

// Local mathematical panchang engine (CommonJS version of src/utils/panchangEngine.js)
const { EclipticLongitude, EclipticGeoMoon, MakeTime, Body, SearchMoonPhase } = require('astronomy-engine');

const TITHI_NAMES_SUD_MATH = [
  "સુદ એકમ", "સુદ બીજ", "સુદ ત્રીજ", "સુદ ચોથ", "સુદ પાંચમ",
  "સુદ છઠ", "સુદ સાતમ", "સુદ આઠમ", "સુદ નોમ", "સુદ દશમ",
  "સુદ એકાદશી", "સુદ બારસ", "સુદ તેરસ", "સુદ ચૌદશ", "સુદ પૂનમ"
];

const TITHI_NAMES_VAD_MATH = [
  "વદ એકમ", "વદ બીજ", "વદ ત્રીજ", "વદ ચોથ", "વદ પાંચમ",
  "વદ છઠ", "વદ સાતમ", "વદ આઠમ", "વદ નોમ", "વદ દશમ",
  "વદ એકાદશી", "વદ બારસ", "વદ તેરસ", "વદ ચૌદશ", "વદ અમાસ"
];

const NAKSHATRA_NAMES_MATH = [
  "અશ્વિની", "ભરણી", "કૃત્તિકા", "રોહિણી", "મૃગશીર્ષ", "આર્દ્રા", "પુનર્વસુ", "પુષ્ય", "આશ્લેષા",
  "મઘા", "પૂર્વા ફાલ્ગુની", "ઉત્તરા ફાલ્ગુની", "હસ્ત", "ચિત્રા", "સ્વાતિ", "વિશાખા", "અનુરાધા", "જ્યેષ્ઠા",
  "મૂળ", "પૂર્વાષાઢા", "ઉત્તરાષાઢા", "શ્રવણ", "ધનિષ્ઠા", "શતતારકા", "પૂર્વા ભાદ્રપદ", "ઉત્તરા ભાદ્રપદ", "રેવતી"
];

const RASHI_DETAILS_MATH = [
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

const MAAS_NAMES_MATH = [
  "વૈશાખ", "જેઠ", "અષાઢ", "શ્રાવણ", "ભાદરવો", "આસો",
  "કારતક", "માગશર", "પોષ", "મહા", "ફાગણ", "ચૈત્ર"
];

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

function getIndicesAt(date) {
  const { sunLon, moonLon, nirayanaSunLon, nirayanaMoonLon } = getNirayanaCoords(date);

  const diffTithi = (moonLon - sunLon + 360) % 360;
  const tithiIndex = Math.floor(diffTithi / 12) % 30;
  const nakshatraIndex = Math.floor(nirayanaMoonLon / (360 / 27)) % 27;

  return { tithiIndex, nakshatraIndex };
}

function getDailyMathPanchang(date = new Date()) {
  const indices = getIndicesAt(date);
  
  let tithiName, paksh;
  if (indices.tithiIndex < 15) {
    tithiName = TITHI_NAMES_SUD_MATH[indices.tithiIndex];
    paksh = "સુદ";
  } else {
    tithiName = TITHI_NAMES_VAD_MATH[indices.tithiIndex - 15];
    paksh = "વદ";
  }

  const nakshatraName = NAKSHATRA_NAMES_MATH[indices.nakshatraIndex];

  const { nirayanaMoonLon } = getNirayanaCoords(date);
  const rashiIndex = Math.floor(nirayanaMoonLon / 30) % 12;
  const rashi = RASHI_DETAILS_MATH[rashiIndex];

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
    maasName = "અધિક " + MAAS_NAMES_MATH[prevRashi];
  } else {
    const rIndex = prevNewMoonTime ? getSunRashiAt(prevNewMoonTime) : 0;
    maasName = MAAS_NAMES_MATH[rIndex];
  }

  return {
    tithi: tithiName,
    paksh: paksh,
    maas: maasName,
    rashi: rashi.name,
    rashiLetters: rashi.letters,
    nakshatra: nakshatraName
  };
}

app.get('/panchang', (req, res) => {
  try {
    let targetDate = new Date();
    if (req.query.date) {
      targetDate = new Date(req.query.date);
    }
    
    // Default Ahmedabad coordinates
    const lat = 23.0225;
    const lon = 72.5714;
    
    // 1. Calculate using local mathematical engine
    const mathPanchang = getDailyMathPanchang(targetDate);
    const sun = panchang.sunTimer(targetDate, lat, lon);
    
    const maas = mathPanchang.maas;
    const paksh = mathPanchang.paksh;
    
    // Note: mathPanchang.tithi already contains "સુદ" or "વદ" prefixed from TITHI_NAMES_SUD_MATH
    // e.g., "સુદ એકાદશી". We want to construct "જેઠ સુદ એકાદશી".
    // We split by space to get just the tithi name (e.g. "એકાદશી")
    const tithiNameOnly = mathPanchang.tithi.split(" ")[1] || mathPanchang.tithi;
    const tithiFull = `${maas} ${paksh} ${tithiNameOnly}`;
    
    const rashi = mathPanchang.rashi;
    const rashiLetters = mathPanchang.rashiLetters;
    const nakshatra = mathPanchang.nakshatra;
    
    // Format sunrise / sunset
    const sunrise = formatTimeToGujarati(sun.sunRise);
    const sunset = formatTimeToGujarati(sun.sunSet);
    
    // 4. Select rotating content based on the day of the year
    const dayOfYear = Math.floor((targetDate - new Date(targetDate.getFullYear(), 0, 0)) / (86400000));
    
    const suvichar = SUVICHARS[dayOfYear % SUVICHARS.length];
    const healthTip = HEALTH_TIPS[dayOfYear % HEALTH_TIPS.length];
    const communityAlert = COMMUNITY_ALERTS[dayOfYear % COMMUNITY_ALERTS.length];
    
    // Assemble final response matching exactly what the app expects
    const responseJson = {
      tithi: tithiFull,
      maas: maas,
      paksh: paksh,
      rashi: rashi,
      rashiLetters: rashiLetters,
      nakshatra: nakshatra,
      sunrise: sunrise,
      sunset: sunset,
      suvichar: suvichar,
      healthTip: healthTip,
      communityAlert: communityAlert
    };
    
    res.json(responseJson);
  } catch (error) {
    console.error("Panchang calculation error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Panchang Service listening on port ${port}`);
});
