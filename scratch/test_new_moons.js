import { EclipticLongitude, MakeTime, Body, SearchMoonPhase } from 'astronomy-engine';

const dates = [
  new Date('2026-04-01T00:00:00Z'),
  new Date('2026-05-01T00:00:00Z'),
  new Date('2026-06-01T00:00:00Z'),
  new Date('2026-07-01T00:00:00Z'),
  new Date('2026-08-01T00:00:00Z'),
];

function getSunRashiAt(timeObj) {
  const jd = (timeObj.date.getTime() / 86400000) + 2440587.5;
  const tVal = (jd - 2451545.0) / 36525.0;
  const ay = 23.85708 + 1.396013 * tVal - 0.000301 * tVal * tVal;
  const sLon = (EclipticLongitude(Body.Earth, timeObj) + 180) % 360;
  const nirayanaSLon = (sLon - ay + 360) % 360;
  return { rashi: Math.floor(nirayanaSLon / 30) % 12, lon: nirayanaSLon };
}

for (const d of dates) {
  const nm = SearchMoonPhase(0.0, d, 30);
  const info = getSunRashiAt(nm);
  console.log(`New Moon: ${nm.date.toISOString()} | Sun Rashi Index: ${info.rashi} | Lon: ${info.lon}`);
}
