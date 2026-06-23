import { EclipticLongitude, EclipticGeoMoon, MakeTime, Body } from 'astronomy-engine';

const date = new Date('2026-06-10T12:00:00Z'); // June 10, 2026 12:00 UTC (5:30 PM IST)
const time = MakeTime(date);

const julianDate = (date.getTime() / 86400000) + 2440587.5;
const T = (julianDate - 2451545.0) / 36525.0;
const ayanamsa = 23.85708 + 1.396013 * T - 0.000301 * T * T;

const sunLon = (EclipticLongitude(Body.Earth, time) + 180) % 360;
const moonCoords = EclipticGeoMoon(time);
const moonLon = moonCoords.lon;

console.log("Sun Longitude (Geocentric):", sunLon);
console.log("Moon Longitude (Geocentric):", moonLon);
console.log("Ayanamsa:", ayanamsa);

const nirayanaMoonLon = (moonLon - ayanamsa + 360) % 360;
console.log("Nirayana Moon Longitude:", nirayanaMoonLon);

// 1. Tithi
let diff = (moonLon - sunLon + 360) % 360;
let tithiIndex = Math.floor(diff / 12);
console.log("Tithi Index:", tithiIndex);

// 2. Nakshatra
let nakshatraIndex = Math.floor(nirayanaMoonLon / (360 / 27));
console.log("Nakshatra Index:", nakshatraIndex);

// 3. Rashi
let rashiIndex = Math.floor(nirayanaMoonLon / 30);
console.log("Rashi Index:", rashiIndex);
