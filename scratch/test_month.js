import { EclipticLongitude, EclipticGeoMoon, MakeTime, Body, SearchMoonPhase } from 'astronomy-engine';

const date = new Date('2026-06-10T12:00:00Z');
console.log("Input Date:", date);

// Search for the New Moon preceding the current date
// A New Moon corresponds to phase 0.0 (or 0 degrees)
// Let's find the preceding and next New Moon
const prevNewMoonTime = SearchMoonPhase(0.0, date, -30);
const nextNewMoonTime = SearchMoonPhase(0.0, date, 30);

console.log("Preceding New Moon:", prevNewMoonTime.date);
console.log("Next New Moon:", nextNewMoonTime.date);

// Calculate Sun Rashi at the preceding New Moon and the next New Moon
function getSunRashi(time) {
  const julianDate = (time.date.getTime() / 86400000) + 2440587.5;
  const T = (julianDate - 2451545.0) / 36525.0;
  const ayanamsa = 23.85708 + 1.396013 * T - 0.000301 * T * T;
  const sunLon = (EclipticLongitude(Body.Earth, time) + 180) % 360;
  const nirayanaSunLon = (sunLon - ayanamsa + 360) % 360;
  const rashiIndex = Math.floor(nirayanaSunLon / 30);
  return { rashiIndex, nirayanaSunLon };
}

const prevRashi = getSunRashi(prevNewMoonTime);
const nextRashi = getSunRashi(nextNewMoonTime);

console.log("Preceding New Moon Sun Rashi:", prevRashi.rashiIndex, "Lon:", prevRashi.nirayanaSunLon);
console.log("Next New Moon Sun Rashi:", nextRashi.rashiIndex, "Lon:", nextRashi.nirayanaSunLon);
