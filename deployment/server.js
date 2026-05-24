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

app.get('/panchang', (req, res) => {
  try {
    let targetDate = new Date();
    if (req.query.date) {
      targetDate = new Date(req.query.date);
    }
    
    // Default Ahmedabad coordinates
    const lat = 23.0225;
    const lon = 72.5714;
    
    // 1. Calculate Astro details
    const cal = panchang.calendar(targetDate, lat, lon);
    const sun = panchang.sunTimer(targetDate, lat, lon);
    
    // 2. Parse raw details with fallbacks
    const rawMasa = cal.MoonMasa ? cal.MoonMasa.name_en_IN : (cal.Masa ? cal.Masa.name_en_IN : "Jyestha");
    const rawPaksha = cal.Paksha ? cal.Paksha.name_en_IN : "Shukla";
    const rawTithi = cal.Tithi ? cal.Tithi.name_en_IN : "Dwitiya";
    const rawNakshatra = cal.Nakshatra ? cal.Nakshatra.name_en_IN : "Rohini";
    const rawRaasi = cal.Raasi ? cal.Raasi.name_en_UK : "Taurus";
    const isLeapMonth = cal.MoonMasa ? cal.MoonMasa.isLeapMonth : false;
    
    // 3. Map to Gujarati
    const mappedMaas = MONTHS_MAP[rawMasa] || rawMasa;
    const maasPrefix = isLeapMonth ? "અધિક " : "";
    const maas = maasPrefix + mappedMaas;
    
    const paksh = PAKSH_MAP[rawPaksha] || rawPaksha;
    const mappedTithi = TITHIS_MAP[rawTithi] || rawTithi;
    
    const tithi = `${maas} સુદ ${mappedTithi}`; // Shukla is always "સુદ" in Jyestha Sud phase, but let's use paksh variable:
    const tithiFull = `${maas} ${paksh} ${mappedTithi}`;
    
    const rashi = RASHI_MAP[rawRaasi] || rawRaasi;
    const rashiLetters = RASHI_LETTERS[rashi] || "બ, વ, ઉ";
    const nakshatra = NAKSHATRAS_MAP[rawNakshatra] || rawNakshatra;
    
    // Format sunrise / sunset
    const sunrise = formatTimeToGujarati(sun.sunRise);
    const sunset = formatTimeToGujarati(sun.sunSet);
    
    // 4. Select rotating content based on the day of the year
    // Simple hash based on date to get stable daily rotation
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
