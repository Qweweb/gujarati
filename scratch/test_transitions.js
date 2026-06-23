import { EclipticLongitude, EclipticGeoMoon, MakeTime, Body } from 'astronomy-engine';

// Nakshatra, Yoga, Karana Lists
const YOGA_NAMES = [
  "વિષ્કંભ", "પ્રીતિ", "આયુષ્માન", "સૌભાગ્ય", "શોભન", "અતિગંડ", "સુકર્મા", "ધૃતિ", "શૂલ",
  "ગંડ", "વૃદ્ધિ", "ધ્રુવ", "વ્યાઘાત", "હર્ષણ", "વજ્ર", "સિદ્ધિ", "વ્યતીપાત", "વરિયાન",
  "પરિઘ", "શિવ", "સિદ્ધ", "સાધ્ય", "શુભ", "શુક્લ", "બ્રહ્મ", "એન્દ્ર", "વૈધૃતિ"
];

const KARANA_NAMES = [
  "કિંસ્તુઘ્ન", "બવ", "બાલવ", "કૌલવ", "તૈતિલ", "ગર", "વણિજ", "વિષ્ટિ (ભદ્રા)",
  "શકુનિ", "ચતુષ્પદ", "નાગ"
];

// Helper to get Nirayana Sun and Moon longitudes
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

  return {
    sunLon,
    moonLon,
    nirayanaSunLon,
    nirayanaMoonLon,
    ayanamsa
  };
}

// Get indices at a specific date
function getIndicesAt(date) {
  const { sunLon, moonLon, nirayanaSunLon, nirayanaMoonLon } = getNirayanaCoords(date);

  // Tithi (30 indices, 12 deg each)
  const diffTithi = (moonLon - sunLon + 360) % 360;
  const tithiIndex = Math.floor(diffTithi / 12) % 30;

  // Nakshatra (27 indices, 13.333 deg each)
  const nakshatraIndex = Math.floor(nirayanaMoonLon / (360 / 27)) % 27;

  // Yoga (27 indices, 13.333 deg each: Sum of Sun & Moon Nirayana longitudes)
  const diffYoga = (nirayanaMoonLon + nirayanaSunLon) % 360;
  const yogaIndex = Math.floor(diffYoga / (360 / 27)) % 27;

  // Karana (60 half-tithis in a month, 6 deg each)
  // Tithi index ranges 0 to 29. Each tithi has 2 karanas.
  const diffKarana = (moonLon - sunLon + 360) % 360;
  const totalKaranaIndex = Math.floor(diffKarana / 6) % 60;
  
  let karanaIndex = 0;
  if (totalKaranaIndex === 0) {
    karanaIndex = 0; // Kimstughna (1st half of 1st Tithi)
  } else if (totalKaranaIndex >= 57) {
    // Shakuni (58), Chatushpada (59), Naga (60)
    karanaIndex = 8 + (totalKaranaIndex - 57);
  } else {
    // 7 recurring Karanas: Bava(1), Balava(2), Kaulava(3), Taitila(4), Gara(5), Vanija(6), Vishti(7)
    karanaIndex = 1 + ((totalKaranaIndex - 1) % 7);
  }

  return { tithiIndex, nakshatraIndex, yogaIndex, karanaIndex, totalKaranaIndex };
}

// Function to find the exact transition time (end time) of the current index
// key: 'tithiIndex' | 'nakshatraIndex' | 'yogaIndex' | 'totalKaranaIndex'
function findTransition(startDate, key) {
  let date = new Date(startDate.getTime());
  const initialIndex = getIndicesAt(date)[key];
  
  // Step 1: Scan forward hour by hour up to 30 hours to find when the index changes
  let hours = 0;
  let prevDate = new Date(date.getTime());
  while (hours < 30) {
    date.setTime(date.getTime() + 60 * 60 * 1000); // add 1 hour
    const currIndex = getIndicesAt(date)[key];
    if (currIndex !== initialIndex) {
      break;
    }
    prevDate.setTime(date.getTime());
    hours++;
  }

  // Step 2: Binary search inside that 1 hour window (to find within 1 minute precision)
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

// Test for June 10, 2026
const testDate = new Date('2026-06-10T12:00:00Z'); // 5:30 PM IST

const currentIndices = getIndicesAt(testDate);
console.log("Current Tithi Index:", currentIndices.tithiIndex);
console.log("Current Nakshatra Index:", currentIndices.nakshatraIndex, "->", YOGA_NAMES[currentIndices.nakshatraIndex]); // Wait, NAKSHATRA names, not YOGA names
console.log("Current Yoga Index:", currentIndices.yogaIndex, "->", YOGA_NAMES[currentIndices.yogaIndex]);
console.log("Current Karana Index:", currentIndices.karanaIndex, "->", KARANA_NAMES[currentIndices.karanaIndex]);

const tithiEnd = findTransition(testDate, 'tithiIndex');
const nakshatraEnd = findTransition(testDate, 'nakshatraIndex');
const yogaEnd = findTransition(testDate, 'yogaIndex');
const karanaEnd = findTransition(testDate, 'totalKaranaIndex');

const formatLocalTime = (d) => {
  return d.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
};

console.log("\nComputed Transition (End) Times (IST):");
console.log("Tithi ends at:", formatLocalTime(tithiEnd));
console.log("Nakshatra ends at:", formatLocalTime(nakshatraEnd));
console.log("Yoga ends at:", formatLocalTime(yogaEnd));
console.log("Karana ends at:", formatLocalTime(karanaEnd));
