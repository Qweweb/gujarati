/**
 * Choghadiya Calculator Utility for React / Node.js
 * 
 * આ હેલ્પર ફાઈલ સૂર્યોદય અને સૂર્યાસ્તના સમય પરથી લાઈવ ચોઘડિયા ગણી આપે છે.
 */

// ૧. ચૌઘડિયાના પ્રકારો અને તેના ગુણધર્મો
export const CHOGHADIYA_TYPES = {
  UDVEG: { name: "ઉદ્વેગ", isGood: false },  // સૂર્ય (અશુભ)
  CHAL: { name: "ચલ", isGood: true },      // શુક્ર (સામાન્ય/શુભ)
  LABH: { name: "લાભ", isGood: true },      // બુધ (શુભ)
  AMRIT: { name: "અમૃત", isGood: true },    // ચંદ્ર (અતિ શુભ)
  KAAL: { name: "કાળ", isGood: false },     // શનિ (અશુભ)
  SHUBH: { name: "શુભ", isGood: true },     // ગુરુ (શુભ)
  ROG: { name: "રોગ", isGood: false }       // મંગળ (અશુભ)
};

const { UDVEG, CHAL, LABH, AMRIT, KAAL, SHUBH, ROG } = CHOGHADIYA_TYPES;

// ૨. દરેક વાર પ્રમાણે દિવસના ચોઘડિયાનો ક્રમ (સૂર્યોદય થી સૂર્યાસ્ત)
export const DAY_SEQUENCE = {
  0: [UDVEG, CHAL, LABH, AMRIT, KAAL, SHUBH, ROG, UDVEG], // રવિવાર
  1: [AMRIT, KAAL, SHUBH, ROG, UDVEG, CHAL, LABH, AMRIT], // સોમવાર
  2: [ROG, UDVEG, CHAL, LABH, AMRIT, KAAL, SHUBH, ROG],   // મંગળવાર
  3: [LABH, AMRIT, KAAL, SHUBH, ROG, UDVEG, CHAL, LABH],   // બુધવાર
  4: [SHUBH, ROG, UDVEG, CHAL, LABH, AMRIT, KAAL, SHUBH], // ગુરુવાર
  5: [CHAL, LABH, AMRIT, KAAL, SHUBH, ROG, UDVEG, CHAL],   // શુક્રવાર
  6: [KAAL, SHUBH, ROG, UDVEG, CHAL, LABH, AMRIT, KAAL]    // શનિવાર
};

// ૩. દરેક વાર પ્રમાણે રાતના ચોઘડિયાનો ક્રમ (સૂર્યાસ્ત થી સૂર્યોદય)
export const NIGHT_SEQUENCE = {
  0: [SHUBH, CHAL, KAAL, UDVEG, AMRIT, ROG, LABH, SHUBH], // રવિવાર રાત
  1: [ROG, UDVEG, CHAL, LABH, AMRIT, KAAL, SHUBH, ROG],   // સોમવાર રાત
  2: [LABH, AMRIT, KAAL, SHUBH, ROG, UDVEG, CHAL, LABH],   // મંગળવાર રાત
  3: [UDVEG, CHAL, LABH, AMRIT, KAAL, SHUBH, ROG, UDVEG], // બુધવાર રાત
  4: [AMRIT, KAAL, SHUBH, ROG, UDVEG, CHAL, LABH, AMRIT], // ગુરુવાર રાત
  5: [KAAL, SHUBH, ROG, UDVEG, CHAL, LABH, AMRIT, KAAL],  // શુક્રવાર રાત
  6: [CHAL, LABH, AMRIT, KAAL, SHUBH, ROG, UDVEG, CHAL]   // શનિવાર રાત
};

// ૪. સમયને ગુજરાતી આંકડામાં કન્વર્ટ કરતું ફંક્શન
export const toGujaratiDigits = (numStr) => {
  const gujaratiNumerals = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];
  return numStr.toString().split('').map(digit => {
    if (digit >= '0' && digit <= '9') {
      return gujaratiNumerals[parseInt(digit, 10)];
    }
    return digit;
  }).join('');
};

// ૫. સમયને ગુજરાતી ફોર્મેટમાં ફોર્મેટ કરતું ફંક્શન
const formatTimeGu = (date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 -> 12
  
  const pad = (n) => n < 10 ? '0' + n : n;
  return `${toGujaratiDigits(pad(hours))}:${toGujaratiDigits(pad(minutes))}`;
};

// ૫.૫ ગુજરાતી આંકડાઓને ઇંગ્લિશ આંકડામાં ફેરવતું ફંક્શન
export const toEnglishDigits = (numStr) => {
  const gujaratiNumerals = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];
  return numStr.toString().split('').map(char => {
    const idx = gujaratiNumerals.indexOf(char);
    return idx !== -1 ? idx.toString() : char;
  }).join('');
};

// ૬. "06:10 AM" કે "૦૬:૧૦ AM" જેવા સમયને Date ઓબ્જેક્ટમાં ફેરવતું ફંક્શન (ગુજરાતી આંકડાઓ સાથે સુસંગત)
const parseTime = (timeStr, baseDate) => {
  if (!timeStr) return null;
  
  // ગુજરાતી આંકડાઓને પહેલા ઇંગ્લિશમાં ફેરવી નાખો
  const englishTimeStr = toEnglishDigits(timeStr);
  
  const match = englishTimeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return null;
  
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3];
  
  if (ampm) {
    if (ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
  }
  
  const d = new Date(baseDate);
  d.setHours(hours, minutes, 0, 0);
  return d;
};

/**
 * મુખ્ય ફંક્શન: સૂર્યોદય અને સૂર્યાસ્ત પરથી આજના બધા ચોઘડિયા ગણો
 * @param {string} sunriseStr "06:10 AM" ફોર્મેટમાં સૂર્યોદય
 * @param {string} sunsetStr "07:08 PM" ફોર્મેટમાં સૂર્યાસ્ત
 * @param {Date} now દૈનિક તારીખ (મોટેભાગે new Date())
 */
export const calculateChoghadiyas = (sunriseStr, sunsetStr, now = new Date()) => {
  let sunrise = parseTime(sunriseStr, now);
  let sunset = parseTime(sunsetStr, now);
  
  if (!sunrise || !sunset) return null;
  
  let weekday = now.getDay(); // 0 -> Sunday, 1 -> Monday...

  // જો અત્યારનો સમય આજના સૂર્યોદય પહેલાનો હોય, તો ખરેખર ગઈકાલનું રાતનું ચોઘડિયું ચાલુ હોય છે.
  if (now.getTime() < sunrise.getTime()) {
    // સૂર્યોદય અને સૂર્યાસ્તને ગઈકાલ પર શિફ્ટ કરો
    sunrise = new Date(sunrise.getTime() - 24 * 60 * 60 * 1000);
    sunset = new Date(sunset.getTime() - 24 * 60 * 60 * 1000);
    weekday = (weekday + 6) % 7; // ગઈકાલનો વાર
  }
  
  // --- A. દિવસના ચોઘડિયા ગણો ---
  const dayDurationMs = sunset.getTime() - sunrise.getTime();
  const daySegmentMs = dayDurationMs / 8;
  const daySeq = DAY_SEQUENCE[weekday];
  
  const dayList = daySeq.map((ch, idx) => {
    const start = new Date(sunrise.getTime() + idx * daySegmentMs);
    const end = new Date(sunrise.getTime() + (idx + 1) * daySegmentMs);
    return {
      name: ch.name,
      isGood: ch.isGood,
      startTime: start,
      endTime: end,
      time: `${formatTimeGu(start)} - ${formatTimeGu(end)}`
    };
  });
  
  // --- B. રાતના ચોઘડિયા ગણો ---
  const nextSunrise = new Date(sunrise.getTime() + 24 * 60 * 60 * 1000); 
  const nightDurationMs = nextSunrise.getTime() - sunset.getTime();
  const nightSegmentMs = nightDurationMs / 8;
  const nightSeq = NIGHT_SEQUENCE[weekday];
  
  const nightList = nightSeq.map((ch, idx) => {
    const start = new Date(sunset.getTime() + idx * nightSegmentMs);
    const end = new Date(sunset.getTime() + (idx + 1) * nightSegmentMs);
    return {
      name: ch.name,
      isGood: ch.isGood,
      startTime: start,
      endTime: end,
      time: `${formatTimeGu(start)} - ${formatTimeGu(end)}`
    };
  });
  
  // --- C. અત્યારનું સક્રિય (Active) ચોઘડિયું શોધો ---
  const combined = [...dayList, ...nightList];
  const activeChoghadiya = combined.find(ch => now >= ch.startTime && now < ch.endTime) || dayList[0];
  
  // બાકી રહેલો સમય મિનિટમાં
  const remainingMs = activeChoghadiya.endTime.getTime() - now.getTime();
  const remainingMin = Math.max(0, Math.ceil(remainingMs / (60 * 1000)));
  
  return {
    dayList,
    nightList,
    current: {
      name: activeChoghadiya.name,
      isGood: activeChoghadiya.isGood,
      timeRemaining: `${toGujaratiDigits(remainingMin)} મિનિટ`
    }
  };
};

/**
 * દૈનિક મુહૂર્તો (અભિજિત મુહૂર્ત અને રાહુ કાળ) ની ગણતરી
 */
export const calculateMuhurts = (sunriseStr, sunsetStr, targetDate = new Date()) => {
  const baseDate = new Date(targetDate);
  // Re-using parseTime from this file
  const englishSunriseStr = toEnglishDigits(sunriseStr);
  const englishSunsetStr = toEnglishDigits(sunsetStr);

  const parseT = (str, bd) => {
    const match = str.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!match) return null;
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const a = match[3];
    if (a) {
      if (a.toUpperCase() === 'PM' && h < 12) h += 12;
      if (a.toUpperCase() === 'AM' && h === 12) h = 0;
    }
    const d = new Date(bd);
    d.setHours(h, m, 0, 0);
    return d;
  };

  const sunrise = parseT(englishSunriseStr, baseDate);
  const sunset = parseT(englishSunsetStr, baseDate);
  
  if (!sunrise || !sunset) return null;

  let durationMs = sunset.getTime() - sunrise.getTime();
  if (durationMs < 0) durationMs += 24 * 60 * 60 * 1000;
  
  const totalMinutes = durationMs / 60000;
  
  // ૧. અભિજિત મુહૂર્ત: દિવસનો ૮મો ભાગ (૧૫ માંથી)
  const muhurtaDuration = totalMinutes / 15;
  const abhijitStart = new Date(sunrise.getTime() + (7 * muhurtaDuration * 60000));
  const abhijitEnd = new Date(abhijitStart.getTime() + (muhurtaDuration * 60000));
  
  const formatTimeWithAmPm = (d) => {
      let hours = d.getHours();
      const minutes = d.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const pad = n => n < 10 ? '0' + n : n;
      return `${toGujaratiDigits(pad(hours))}:${toGujaratiDigits(pad(minutes))} ${ampm}`;
  };

  const abhijitStr = `${formatTimeWithAmPm(abhijitStart)} - ${formatTimeWithAmPm(abhijitEnd)}`;

  // ૨. રાહુ કાળ: દિવસનો ૮મો ભાગ, વાર પ્રમાણે અલગ-અલગ
  const rahuKaalSegmentIndex = [7, 1, 6, 4, 5, 3, 2][targetDate.getDay()];
  
  const rahuDuration = totalMinutes / 8;
  const rahuStart = new Date(sunrise.getTime() + (rahuKaalSegmentIndex * rahuDuration * 60000));
  const rahuEnd = new Date(rahuStart.getTime() + (rahuDuration * 60000));
  
  const rahuStr = `${formatTimeWithAmPm(rahuStart)} - ${formatTimeWithAmPm(rahuEnd)}`;
  
  return {
    abhijit: abhijitStr,
    rahuKaal: rahuStr
  };
};
