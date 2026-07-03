import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Astrological Constants for Ashta Koota
const RASHIS = [
  { id: 1, name: "મેષ (Aries)", lord: "મંગળ", varna: "Kshatriya", vashya: "Chatushpada" },
  { id: 2, name: "વૃષભ (Taurus)", lord: "શુક્ર", varna: "Vaishya", vashya: "Chatushpada" },
  { id: 3, name: "મિથુન (Gemini)", lord: "બુધ", varna: "Shudra", vashya: "Dwipada" },
  { id: 4, name: "કર્ક (Cancer)", lord: "ચંદ્ર", varna: "Brahmana", vashya: "Jalachara" },
  { id: 5, name: "સિંહ (Leo)", lord: "સૂર્ય", varna: "Kshatriya", vashya: "Vanachara" },
  { id: 6, name: "કન્યા (Virgo)", lord: "બુધ", varna: "Vaishya", vashya: "Dwipada" },
  { id: 7, name: "તુલા (Libra)", lord: "શુક્ર", varna: "Shudra", vashya: "Dwipada" },
  { id: 8, name: "વૃશ્ચિક (Scorpio)", lord: "મંગળ", varna: "Brahmana", vashya: "Keeta" },
  { id: 9, name: "ધન (Sagittarius)", lord: "ગુરુ", varna: "Kshatriya", vashya: "Dwipada" },
  { id: 10, name: "મકર (Capricorn)", lord: "શનિ", varna: "Vaishya", vashya: "Jalachara" },
  { id: 11, name: "કુંભ (Aquarius)", lord: "શનિ", varna: "Shudra", vashya: "Dwipada" },
  { id: 12, name: "મીન (Pisces)", lord: "ગુરુ", varna: "Brahmana", vashya: "Jalachara" }
];

const NAKSHATRAS = [
  { name: "અશ્વિની", gana: "Deva", nadi: "Adi", yoni: "Ashwa" },
  { name: "ભરણી", gana: "Manushya", nadi: "Madhya", yoni: "Gaja" },
  { name: "કૃતિકા", gana: "Rakshasa", nadi: "Antya", yoni: "Mesha" },
  { name: "રોહિણી", gana: "Deva", nadi: "Antya", yoni: "Sarpa" },
  { name: "મૃગશીર્ષ", gana: "Deva", nadi: "Madhya", yoni: "Sarpa" },
  { name: "આદ્રા", gana: "Manushya", nadi: "Adi", yoni: "Shvan" },
  { name: "પુનર્વસુ", gana: "Deva", nadi: "Adi", yoni: "Marjar" },
  { name: "પુષ્ય", gana: "Deva", nadi: "Madhya", yoni: "Mesha" },
  { name: "આશ્લેષા", gana: "Rakshasa", nadi: "Antya", yoni: "Marjar" },
  { name: "મઘા", gana: "Rakshasa", nadi: "Antya", yoni: "Mushak" },
  { name: "પૂર્વા ફાલ્ગુની", gana: "Manushya", nadi: "Madhya", yoni: "Mushak" },
  { name: "ઉત્તરા ફાલ્ગુની", gana: "Manushya", nadi: "Adi", yoni: "Gau" },
  { name: "હસ્ત", gana: "Deva", nadi: "Adi", yoni: "Mahisha" },
  { name: "ચિત્રા", gana: "Rakshasa", nadi: "Madhya", yoni: "Vyaghra" },
  { name: "સ્વાતિ", gana: "Deva", nadi: "Antya", yoni: "Mahisha" },
  { name: "વિશાખા", gana: "Rakshasa", nadi: "Antya", yoni: "Vyaghra" },
  { name: "અનુરાધા", gana: "Deva", nadi: "Madhya", yoni: "Shashak" },
  { name: "જ્યેષ્ઠા", gana: "Rakshasa", nadi: "Adi", yoni: "Shashak" },
  { name: "મૂળ", gana: "Rakshasa", nadi: "Adi", yoni: "Shvan" },
  { name: "પૂર્વાષાઢા", gana: "Manushya", nadi: "Madhya", yoni: "Markat" },
  { name: "ઉત્તરાષાઢા", gana: "Manushya", nadi: "Antya", yoni: "Simha" },
  { name: "શ્રવણ", gana: "Deva", nadi: "Antya", yoni: "Markat" },
  { name: "ધનિષ્ઠા", gana: "Rakshasa", nadi: "Madhya", yoni: "Simha" },
  { name: "શતભિષા", gana: "Rakshasa", nadi: "Adi", yoni: "Ashwa" },
  { name: "પૂર્વા ભાદ્રપદ", gana: "Manushya", nadi: "Adi", yoni: "Nakula" },
  { name: "ઉત્તરા ભાદ્રપદ", gana: "Manushya", nadi: "Madhya", yoni: "Gau" },
  { name: "રેવતી", gana: "Deva", nadi: "Antya", yoni: "Gaja" }
];

const YONI_FRIENDSHIP = {
  Ashwa: { Ashwa: 4, Gaja: 3, Mesha: 2, Sarpa: 1, Shvan: 0, Marjar: 2, Mushak: 1, Gau: 2, Mahisha: 3, Vyaghra: 0, Shashak: 2, Markat: 2, Simha: 1, Nakula: 2 },
  Gaja: { Ashwa: 3, Gaja: 4, Mesha: 2, Sarpa: 2, Shvan: 1, Marjar: 2, Mushak: 2, Gau: 3, Mahisha: 2, Vyaghra: 1, Shashak: 2, Markat: 3, Simha: 0, Nakula: 1 },
  Mesha: { Ashwa: 2, Gaja: 2, Mesha: 4, Sarpa: 1, Shvan: 1, Marjar: 2, Mushak: 1, Gau: 2, Mahisha: 2, Vyaghra: 0, Shashak: 3, Markat: 2, Simha: 0, Nakula: 2 },
  Sarpa: { Ashwa: 1, Gaja: 2, Mesha: 1, Sarpa: 4, Shvan: 2, Marjar: 2, Mushak: 1, Gau: 1, Mahisha: 2, Vyaghra: 1, Shashak: 2, Markat: 2, Simha: 1, Nakula: 0 },
  Shvan: { Ashwa: 0, Gaja: 1, Mesha: 1, Sarpa: 2, Shvan: 4, Marjar: 1, Mushak: 0, Gau: 2, Mahisha: 2, Vyaghra: 1, Shashak: 3, Markat: 1, Simha: 1, Nakula: 2 },
  Marjar: { Ashwa: 2, Gaja: 2, Mesha: 2, Sarpa: 2, Shvan: 1, Marjar: 4, Mushak: 0, Gau: 2, Mahisha: 2, Vyaghra: 1, Shashak: 2, Markat: 2, Simha: 1, Nakula: 2 },
  Mushak: { Ashwa: 1, Gaja: 2, Mesha: 1, Sarpa: 1, Shvan: 0, Marjar: 0, Mushak: 4, Gau: 2, Mahisha: 2, Vyaghra: 1, Shashak: 2, Markat: 2, Simha: 0, Nakula: 2 },
  Gau: { Ashwa: 2, Gaja: 3, Mesha: 2, Sarpa: 1, Shvan: 2, Marjar: 2, Mushak: 2, Gau: 4, Mahisha: 3, Vyaghra: 0, Shashak: 2, Markat: 2, Simha: 1, Nakula: 2 },
  Mahisha: { Ashwa: 3, Gaja: 2, Mesha: 2, Sarpa: 2, Shvan: 2, Marjar: 2, Mushak: 2, Gau: 3, Mahisha: 4, Vyaghra: 1, Shashak: 2, Markat: 2, Simha: 1, Nakula: 2 },
  Vyaghra: { Ashwa: 0, Gaja: 1, Mesha: 0, Sarpa: 1, Shvan: 1, Marjar: 1, Mushak: 1, Gau: 0, Mahisha: 1, Vyaghra: 4, Shashak: 1, Markat: 2, Simha: 2, Nakula: 1 },
  Shashak: { Ashwa: 2, Gaja: 2, Mesha: 3, Sarpa: 2, Shvan: 3, Marjar: 2, Mushak: 2, Gau: 2, Mahisha: 2, Vyaghra: 1, Shashak: 4, Markat: 2, Simha: 0, Nakula: 2 },
  Markat: { Ashwa: 2, Gaja: 3, Mesha: 2, Sarpa: 2, Shvan: 1, Marjar: 2, Mushak: 2, Gau: 2, Mahisha: 2, Vyaghra: 2, Shashak: 2, Markat: 4, Simha: 1, Nakula: 2 },
  Simha: { Ashwa: 1, Gaja: 0, Mesha: 0, Sarpa: 1, Shvan: 1, Marjar: 1, Mushak: 0, Gau: 1, Mahisha: 1, Vyaghra: 2, Shashak: 0, Markat: 1, Simha: 4, Nakula: 2 },
  Nakula: { Ashwa: 2, Gaja: 1, Mesha: 2, Sarpa: 0, Shvan: 2, Marjar: 2, Mushak: 2, Gau: 2, Mahisha: 2, Vyaghra: 1, Shashak: 2, Markat: 2, Simha: 2, Nakula: 4 }
};

const PLANET_FRIENDSHIP = {
  "સૂર્ય": { "સૂર્ય": 5, "ચંદ્ર": 5, "મંગળ": 5, "બુધ": 3, "ગુરુ": 5, "શુક્ર": 0, "શનિ": 0 },
  "ચંદ્ર": { "સૂર્ય": 5, "ચંદ્ર": 5, "મંગળ": 3, "બુધ": 5, "ગુરુ": 3, "શુક્ર": 3, "શનિ": 3 },
  "મંગળ": { "સૂર્ય": 5, "ચંદ્ર": 5, "મંગળ": 5, "બુધ": 0, "ગુરુ": 5, "શુક્ર": 3, "શનિ": 3 },
  "બુધ": { "સૂર્ય": 5, "ચંદ્ર": 0, "મંગળ": 3, "બુધ": 5, "ગુરુ": 3, "શુક્ર": 5, "શનિ": 3 },
  "ગુરુ": { "સૂર્ય": 5, "ચંદ્ર": 5, "મંગળ": 5, "બુધ": 0, "ગુરુ": 5, "શુક્ર": 0, "શનિ": 3 },
  "શુક્ર": { "સૂર્ય": 0, "ચંદ્ર": 0, "મંગળ": 3, "બુધ": 5, "ગુરુ": 3, "શુક્ર": 5, "શનિ": 5 },
  "શનિ": { "સૂર્ય": 0, "ચંદ્ર": 0, "મંગળ": 0, "બુધ": 5, "ગુરુ": 3, "શુક્ર": 5, "શનિ": 5 }
};

// True Astrological Calculator helper for matching details
const calculateAstroForMilan = (dob, tob, noTime, coords) => {
  const finalTob = noTime ? "12:00" : tob;
  const [year, month, day] = dob.split("-").map(Number);
  const [hours, minutes] = finalTob.split(":").map(Number);

  const lat = coords ? parseFloat(coords.lat) : 23.0225; // default Ahmedabad
  const lon = coords ? parseFloat(coords.lon) : 72.5714; // default Ahmedabad

  const timezoneOffset = 5.5; // IST
  let utcHours = hours - timezoneOffset;
  let utcDay = day;
  let utcMonth = month;
  let utcYear = year;

  if (utcHours < 0) {
    utcHours += 24;
    utcDay -= 1;
    if (utcDay < 1) {
      utcMonth -= 1;
      if (utcMonth < 1) {
        utcMonth = 12;
        utcYear -= 1;
      }
      const daysInMonth = new Date(utcYear, utcMonth, 0).getDate();
      utcDay = daysInMonth;
    }
  }

  const Y = utcMonth <= 2 ? utcYear - 1 : utcYear;
  const M = utcMonth <= 2 ? utcMonth + 12 : utcMonth;
  const D = utcDay + (utcHours + minutes / 60) / 24;

  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);

  const jd = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + B - 1524.5;
  const t = jd - 2451545.0;

  const ayanamsa = 23.85 + (t / 365.25) * 0.0139696;

  let gmst = (280.46061837 + 360.98564736629 * t) % 360;
  if (gmst < 0) gmst += 360;
  let lst = (gmst + lon) % 360;
  if (lst < 0) lst += 360;

  const obliquity = 23.4393 - (t / 365.25) * 0.000013;
  const lstRad = (lst * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const oblRad = (obliquity * Math.PI) / 180;

  const yVal = -Math.cos(lstRad);
  const xVal = Math.sin(lstRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad);

  let tropicalAsc = Math.atan2(yVal, xVal) * (180 / Math.PI);
  if (tropicalAsc < 0) tropicalAsc += 360;

  let siderealAsc = (tropicalAsc - ayanamsa) % 360;
  if (siderealAsc < 0) siderealAsc += 360;

  const lagnaSignNum = Math.floor(siderealAsc / 30) + 1;

  const orbitalParams = {
    "સૂ": { L0: 280.466, n: 0.98564736 },
    "ચ": { L0: 218.316, n: 13.17639648 },
    "મં": { L0: 355.453, n: 0.52402078 },
    "બુ": { L0: 252.251, n: 4.092334436 },
    "ગુ": { L0: 34.404,  n: 0.0830853 },
    "શુ": { L0: 181.979, n: 1.60213022 },
    "શ": { L0: 50.077,  n: 0.03345963 },
    "રા": { L0: 125.122, n: -0.05295376 },
  };

  const Mm = (134.963 + 13.064993 * t) * Math.PI / 180;
  const Ms = (357.529 + 0.9856 * t) * Math.PI / 180;
  const moonPerturbation = 6.289 * Math.sin(Mm) + 1.274 * Math.sin(2 * Mm - Ms) + 0.658 * Math.sin(2 * Ms);
  let moonLong = orbitalParams["ચ"].L0 + orbitalParams["ચ"].n * t + moonPerturbation;

  const planetSiderealLongs = {};
  Object.keys(orbitalParams).forEach(p => {
    let long = orbitalParams[p].L0 + orbitalParams[p].n * t;
    if (p === "ચ") long = moonLong;
    let sidReal = (long - ayanamsa) % 360;
    if (sidReal < 0) sidReal += 360;
    planetSiderealLongs[p] = sidReal;
  });

  const planetsInHouses = {};
  Object.keys(planetSiderealLongs).forEach(p => {
    const long = planetSiderealLongs[p];
    const rashiNum = Math.floor(long / 30) + 1;
    planetsInHouses[p] = (rashiNum - lagnaSignNum + 12) % 12 + 1;
  });

  const moonDeg = planetSiderealLongs["ચ"];
  const nakshatraIdx = Math.floor(moonDeg / 13.33333) % 27;
  const moonRashiNum = Math.floor(moonDeg / 30) % 12 + 1;
  const pada = Math.floor((moonDeg % 13.33333) / 3.33333) + 1;

  const marsHouse = planetsInHouses["મં"];
  const isManglik = [1, 4, 7, 8, 12].includes(marsHouse);

  return {
    rashiId: moonRashiNum,
    nakshatraIdx,
    pada,
    isManglik: isManglik ? "yes" : "no"
  };
};

const GunMilan = ({ isEmbedded = false }) => {
  const navigate = useNavigate();

  // Mode: manual or automatic birth details
  const [useBirthDetails, setUseBirthDetails] = useState(true);

  // Boy States
  const [boyName, setBoyName] = useState("");
  const [boyDob, setBoyDob] = useState("");
  const [boyTob, setBoyTob] = useState("");
  const [boyNoTime, setBoyNoTime] = useState(false);
  const [boyBirthPlace, setBoyBirthPlace] = useState("");
  const [boySuggestions, setBoySuggestions] = useState([]);
  const [boySelectedCoords, setBoySelectedCoords] = useState(null);
  const [boyLoadingCoords, setBoyLoadingCoords] = useState(false);

  // Boy Manual States
  const [boyRashiId, setBoyRashiId] = useState(1);
  const [boyNakshatraIdx, setBoyNakshatraIdx] = useState(0);
  const [boyIsManglik, setBoyIsManglik] = useState("no");

  // Girl States
  const [girlName, setGirlName] = useState("");
  const [girlDob, setGirlDob] = useState("");
  const [girlTob, setGirlTob] = useState("");
  const [girlNoTime, setGirlNoTime] = useState(false);
  const [girlBirthPlace, setGirlBirthPlace] = useState("");
  const [girlSuggestions, setGirlSuggestions] = useState([]);
  const [girlSelectedCoords, setGirlSelectedCoords] = useState(null);
  const [girlLoadingCoords, setGirlLoadingCoords] = useState(false);

  // Girl Manual States
  const [girlRashiId, setGirlRashiId] = useState(1);
  const [girlNakshatraIdx, setGirlNakshatraIdx] = useState(0);
  const [girlIsManglik, setGirlIsManglik] = useState("no");

  // Output States
  const [calculated, setCalculated] = useState(false);
  const [results, setResults] = useState(null);

  // Boy Geocode suggestions lookup
  useEffect(() => {
    if (boyBirthPlace.trim().length < 3) {
      setBoySuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setBoyLoadingCoords(true);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(boyBirthPlace)}&limit=4`);
        const data = await res.json();
        setBoySuggestions(data);
      } catch (e) {
        console.warn(e);
      } finally {
        setBoyLoadingCoords(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [boyBirthPlace]);

  // Girl Geocode suggestions lookup
  useEffect(() => {
    if (girlBirthPlace.trim().length < 3) {
      setGirlSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setGirlLoadingCoords(true);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(girlBirthPlace)}&limit=4`);
        const data = await res.json();
        setGirlSuggestions(data);
      } catch (e) {
        console.warn(e);
      } finally {
        setGirlLoadingCoords(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [girlBirthPlace]);

  const calculateMatching = (e) => {
    e.preventDefault();
    if (!boyName.trim() || !girlName.trim()) {
      alert("કૃપા કરી વર અને કન્યા બંનેના નામ લખો 🙏");
      return;
    }

    let bRashiNum, bNakIdx, bPada, bManglikVal;
    let gRashiNum, gNakIdx, gPada, gManglikVal;

    if (useBirthDetails) {
      if (!boyDob || !girlDob) {
        alert("કૃપા કરી બંનેની જન્મ તારીખ દાખલ કરો 🙏");
        return;
      }

      // Calculate Boy Astro
      try {
        const boyAstro = calculateAstroForMilan(
          boyDob,
          boyNoTime ? "12:00" : boyTob || "12:00",
          boyNoTime,
          boySelectedCoords
        );
        bRashiNum = boyAstro.rashiId;
        bNakIdx = boyAstro.nakshatraIdx;
        bPada = boyAstro.pada;
        bManglikVal = boyAstro.isManglik;
      } catch (err) {
        alert("વરની જન્મ વિગતો ગણવામાં ભૂલ આવી, કૃપા કરી વિગત ચકાસો.");
        return;
      }

      // Calculate Girl Astro
      try {
        const girlAstro = calculateAstroForMilan(
          girlDob,
          girlNoTime ? "12:00" : girlTob || "12:00",
          girlNoTime,
          girlSelectedCoords
        );
        gRashiNum = girlAstro.rashiId;
        gNakIdx = girlAstro.nakshatraIdx;
        gPada = girlAstro.pada;
        gManglikVal = girlAstro.isManglik;
      } catch (err) {
        alert("કન્યાની જન્મ વિગતો ગણવામાં ભૂલ આવી, કૃપા કરી વિગત ચકાસો.");
        return;
      }
    } else {
      bRashiNum = Number(boyRashiId);
      bNakIdx = Number(boyNakshatraIdx);
      bPada = 1;
      bManglikVal = boyIsManglik;

      gRashiNum = Number(girlRashiId);
      gNakIdx = Number(girlNakshatraIdx);
      gPada = 1;
      gManglikVal = girlIsManglik;
    }

    const boyR = RASHIS.find(r => r.id === bRashiNum) || RASHIS[0];
    const girlR = RASHIS.find(r => r.id === gRashiNum) || RASHIS[0];
    const boyN = NAKSHATRAS[bNakIdx] || NAKSHATRAS[0];
    const girlN = NAKSHATRAS[gNakIdx] || NAKSHATRAS[0];

    // 1. Varna (Max 1 Point)
    const varnaWeights = { Brahmana: 4, Kshatriya: 3, Vaishya: 2, Shudra: 1 };
    const boyVarnaW = varnaWeights[boyR.varna];
    const girlVarnaW = varnaWeights[girlR.varna];
    const varnaScore = boyVarnaW >= girlVarnaW ? 1 : 0;

    // 2. Vashya (Max 2 Points)
    let vashyaScore = 0;
    if (boyR.vashya === girlR.vashya) {
      vashyaScore = 2;
    } else if (
      (boyR.vashya === "Dwipada" && girlR.vashya === "Chatushpada") ||
      (boyR.vashya === "Chatushpada" && girlR.vashya === "Dwipada")
    ) {
      vashyaScore = 1;
    } else {
      vashyaScore = 0.5;
    }

    // 3. Tara (Max 3 Points)
    const dist1 = ((gNakIdx - bNakIdx + 27) % 27) + 1;
    const dist2 = ((bNakIdx - gNakIdx + 27) % 27) + 1;
    const rem1 = dist1 % 9;
    const rem2 = dist2 % 9;
    const okRemainders = [0, 3, 5, 7];
    const rem1Ok = okRemainders.includes(rem1);
    const rem2Ok = okRemainders.includes(rem2);
    let taraScore = 0;
    if (rem1Ok && rem2Ok) taraScore = 3;
    else if (rem1Ok || rem2Ok) taraScore = 1.5;
    else taraScore = 0;

    // 4. Yoni (Max 4 Points)
    const yoniScore = YONI_FRIENDSHIP[boyN.yoni]?.[girlN.yoni] ?? 2;

    // 5. Maitri (Max 5 Points)
    const maitriScore = PLANET_FRIENDSHIP[boyR.lord]?.[girlR.lord] ?? 3;

    // 6. Gana (Max 6 Points)
    let ganaScore = 0;
    if (boyN.gana === girlN.gana) {
      ganaScore = 6;
    } else if (
      (boyN.gana === "Deva" && girlN.gana === "Manushya") ||
      (boyN.gana === "Manushya" && girlN.gana === "Deva")
    ) {
      ganaScore = 5;
    } else if (
      (boyN.gana === "Deva" && girlN.gana === "Rakshasa") ||
      (boyN.gana === "Rakshasa" && girlN.gana === "Deva")
    ) {
      ganaScore = 1;
    } else {
      ganaScore = 0;
    }

    // 7. Bhakoot (Max 7 Points)
    const rashiDist = ((girlR.id - boyR.id + 12) % 12) + 1;
    const badDists = [2, 12, 6, 8];
    const bhakootScore = badDists.includes(rashiDist) ? 0 : 7;

    // 8. Nadi (Max 8 Points)
    const nadiScore = boyN.nadi !== girlN.nadi ? 8 : 0;

    // Total Score
    const totalScore = varnaScore + vashyaScore + taraScore + yoniScore + maitriScore + ganaScore + bhakootScore + nadiScore;

    // Manglik Check
    let manglikMessage = "";
    let manglikStatus = "success";
    if (bManglikVal === "yes" && gManglikVal === "yes") {
      manglikMessage = "વર અને કન્યા બંને માંગલિક છે - દોષ નિવારણ સામંજસ્ય (ઉત્તમ મેળ ખાશે).";
    } else if (bManglikVal === "no" && gManglikVal === "no") {
      manglikMessage = "બંનેમાંથી કોઈ માંગલિક નથી - મંગળ દોષની મુક્તિ.";
    } else {
      manglikStatus = "warning";
      manglikMessage = `ચેતવણી: માત્ર ${bManglikVal === "yes" ? boyName : girlName} માંગલિક છે. વિવાહ માટે કુંડળી વિશ્લેષણ અને શાસ્ત્રીય ઉપાય જરૂરી છે.`;
    }

    // Verdict
    let verdict = "";
    let verdictColor = "";
    if (totalScore >= 25) {
      verdict = "ઉત્તમ અને અત્યંત શુભ મેળાપ! લગ્નજીવન ખૂબ જ સુખી, સમૃદ્ધ અને પરસ્પર સહયોગી રહેશે. ગુરુ અને વિષ્ણુ પૂજા ઉત્તમ સાથ આપશે.";
      verdictColor = "text-green-600 dark:text-green-400";
    } else if (totalScore >= 18) {
      verdict = "મધ્યમ શ્રેણીનો ગુણ મેળાપ. લગ્નજીવન સામાન્ય રહેશે, નાની-મોટી અડચણો બાદ સુખ-શાંતિ જળવાશે. વિવાહ પૂર્વે વ્રત કરવું અનુકૂળ રહે.";
      verdictColor = "text-amber-600 dark:text-amber-400";
    } else {
      verdict = "અશુભ મેળ ખાશે. ગુણ ખૂબ ઓછા છે. જ્યોતિષીય પરામર્શ લીધા વગર વિવાહ કરવાથી બચવું. આ મેળ ખાવાની સલાહ આપવામાં આવતી નથી.";
      verdictColor = "text-red-600 dark:text-red-400";
    }

    setResults({
      boyR, boyN, bPada, girlR, girlN, gPada,
      varnaScore, vashyaScore, taraScore, yoniScore, maitriScore, ganaScore, bhakootScore, nadiScore,
      totalScore,
      manglikStatus,
      manglikMessage,
      verdict,
      verdictColor
    });
    setCalculated(true);
  };

  const toGujaratiNum = (n) => {
    const guj = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];
    return String(n).split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 48 && code <= 57) return guj[code - 48];
      return c;
    }).join('');
  };

  const triggerWhatsAppShare = () => {
    if (!results) return;
    const text = `🕉️ *ગુજરાતી એપ ગુણ મિલાન અહેવાલ* 🕉️\n\n🤵 *વર:* ${boyName} (${results.boyR.name})\n👰 *કન્યા:* ${girlName} (${results.girlR.name})\n\n📊 *મેળ ખાતા ગુણ:* *${results.totalScore}/૩૬*\n🔥 *મેળ:* ${results.totalScore >= 18 ? 'શુભ લગ્નયોગ્ય' : 'અશુભ મેળ'}\n\n🪔 *મંગળ વિગત:* ${results.manglikMessage}\n\n👉 આપની સચોટ કુંડળી અને મેળાપ રિપોર્ટ ડાઉનલોડ કરવા માટે આજે જ ડાઉનલોડ કરો *ગુજરાતી એપ*.`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className={isEmbedded ? "space-y-6 select-none" : "max-w-4xl mx-auto p-4 space-y-6 pb-20 select-none"}>
      
      {/* Header */}
      {!isEmbedded && (
        <div className="flex items-center justify-between border-b border-primary/10 pb-4">
          <div className="space-y-1">
            <h2 className="font-gujarati font-black text-4xl text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-4xl text-pink-600 animate-pulse">favorite</span>
              ગુણ મિલાન (૩૬ ગુણ)
            </h2>
            <p className="font-gujarati text-outline text-lg">જન્મ વિગતોના આધારે વૈદિક લગ્ન મેળાપ અને અષ્ટકૂટ ગુણ મિલન રિપોર્ટ.</p>
          </div>
          <button 
            onClick={() => navigate('/tools')}
            className="h-12 w-12 bg-white dark:bg-stone-800 rounded-full flex items-center justify-center border border-black/5 hover:bg-stone-50 active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-stone-600 dark:text-stone-300">close</span>
          </button>
        </div>
      )}

      {!calculated ? (
        <form onSubmit={calculateMatching} className="bg-white dark:bg-stone-900 rounded-[2.5rem] p-6 sm:p-10 border border-primary/5 shadow-xl space-y-8">
          
          {/* Mode Switcher */}
          <div className="flex justify-center border-b border-black/5 pb-4">
            <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setUseBirthDetails(true)}
                className={`px-4 py-2 rounded-lg font-gujarati text-xs font-bold transition-all ${useBirthDetails ? 'bg-white dark:bg-stone-700 text-primary shadow-xs' : 'text-stone-500'}`}
              >
                🕉️ જન્મ વિગતોથી ચેક કરો (સચોટ)
              </button>
              <button
                type="button"
                onClick={() => setUseBirthDetails(false)}
                className={`px-4 py-2 rounded-lg font-gujarati text-xs font-bold transition-all ${!useBirthDetails ? 'bg-white dark:bg-stone-700 text-primary shadow-xs' : 'text-stone-500'}`}
              >
                📝 રાશિ/નક્ષત્ર સીધું પસંદ કરો
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* BOY PROFILE CARD */}
            <div className="bg-blue-50/40 dark:bg-blue-950/20 p-6 rounded-[2rem] border border-blue-200/50 space-y-4 relative">
              <h3 className="font-gujarati font-black text-lg text-blue-900 dark:text-blue-400 flex items-center gap-2">
                <span className="material-symbols-outlined">man</span>
                વરની વિગતો (Boy Details)
              </h3>
              
              <div className="space-y-2">
                <label className="font-gujarati font-bold text-xs text-stone-600 dark:text-stone-300 block">નામ</label>
                <input 
                  type="text"
                  value={boyName}
                  onChange={(e) => setBoyName(e.target.value)}
                  placeholder="નામ દાખલ કરો..."
                  className="w-full p-3 rounded-xl border border-black/10 focus:border-blue-500 focus:outline-none bg-white dark:bg-stone-850 dark:text-white font-gujarati text-sm"
                  required
                />
              </div>

              {useBirthDetails ? (
                <>
                  <div className="space-y-2">
                    <label className="font-gujarati font-bold text-xs text-stone-600 dark:text-stone-300 block">જન્મ તારીખ</label>
                    <input 
                      type="date"
                      value={boyDob}
                      onChange={(e) => setBoyDob(e.target.value)}
                      className="w-full p-3 rounded-xl border border-black/10 focus:border-blue-500 focus:outline-none bg-white dark:bg-stone-850 dark:text-white font-sans text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-2 relative">
                    <div className="flex justify-between items-center">
                      <label className="font-gujarati font-bold text-xs text-stone-600 dark:text-stone-300">જન્મ સમય</label>
                      <label className="flex items-center gap-1 cursor-pointer text-[10px] font-gujarati text-outline">
                        <input type="checkbox" checked={boyNoTime} onChange={(e) => setBoyNoTime(e.target.checked)} />
                        સમય ખબર નથી
                      </label>
                    </div>
                    <input 
                      type="time"
                      value={boyTob}
                      disabled={boyNoTime}
                      onChange={(e) => setBoyTob(e.target.value)}
                      className="w-full p-3 rounded-xl border border-black/10 focus:border-blue-500 focus:outline-none bg-white dark:bg-stone-850 dark:text-white font-sans text-sm disabled:opacity-40"
                    />
                  </div>

                  <div className="space-y-2 relative">
                    <label className="font-gujarati font-bold text-xs text-stone-600 dark:text-stone-300 block">જન્મ સ્થળ</label>
                    <input 
                      type="text"
                      value={boyBirthPlace}
                      onChange={(e) => setBoyBirthPlace(e.target.value)}
                      placeholder="શહેર/ગામનું નામ..."
                      className="w-full p-3 rounded-xl border border-black/10 focus:border-blue-500 focus:outline-none bg-white dark:bg-stone-850 dark:text-white font-gujarati text-sm"
                    />
                    {boyLoadingCoords && <span className="absolute right-3 bottom-3 text-xs text-stone-400 animate-spin">sync</span>}
                    
                    {boySuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full bg-white dark:bg-stone-800 border border-black/5 rounded-xl shadow-xl z-55 max-h-40 overflow-y-auto divide-y divide-black/5">
                        {boySuggestions.map((s, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              setBoyBirthPlace(s.display_name.split(',')[0]);
                              setBoySelectedCoords({ lat: s.lat, lon: s.lon });
                              setBoySuggestions([]);
                            }}
                            className="p-3 text-xs font-gujarati cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950 truncate dark:text-white"
                          >
                            {s.display_name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="font-gujarati font-bold text-xs text-stone-600 dark:text-stone-300 block">જન્મ રાશિ (Moon Sign)</label>
                    <select 
                      value={boyRashiId} 
                      onChange={(e) => setBoyRashiId(e.target.value)}
                      className="w-full p-3 rounded-xl border border-black/10 focus:border-blue-500 focus:outline-none bg-white dark:bg-stone-850 dark:text-white font-gujarati text-sm"
                    >
                      {RASHIS.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="font-gujarati font-bold text-xs text-stone-600 dark:text-stone-300 block">જન્મ નક્ષત્ર (Birth Star)</label>
                    <select 
                      value={boyNakshatraIdx} 
                      onChange={(e) => setBoyNakshatraIdx(e.target.value)}
                      className="w-full p-3 rounded-xl border border-black/10 focus:border-blue-500 focus:outline-none bg-white dark:bg-stone-850 dark:text-white font-gujarati text-sm"
                    >
                      {NAKSHATRAS.map((n, idx) => (
                        <option key={idx} value={idx}>{n.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="font-gujarati font-bold text-xs text-stone-600 dark:text-stone-300 block">માંગલિક દોષ?</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 font-gujarati text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
                        <input type="radio" name="boy_m" value="no" checked={boyIsManglik === "no"} onChange={() => setBoyIsManglik("no")} />
                        ના, માંગલિક નથી
                      </label>
                      <label className="flex items-center gap-1.5 font-gujarati text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
                        <input type="radio" name="boy_m" value="yes" checked={boyIsManglik === "yes"} onChange={() => setBoyIsManglik("yes")} />
                        હા, માંગલિક છે
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* GIRL PROFILE CARD */}
            <div className="bg-pink-50/40 dark:bg-pink-950/20 p-6 rounded-[2rem] border border-pink-200/50 space-y-4 relative">
              <h3 className="font-gujarati font-black text-lg text-pink-900 dark:text-pink-400 flex items-center gap-2">
                <span className="material-symbols-outlined">woman</span>
                કન્યાની વિગતો (Girl Details)
              </h3>
              
              <div className="space-y-2">
                <label className="font-gujarati font-bold text-xs text-stone-600 dark:text-stone-300 block">નામ</label>
                <input 
                  type="text"
                  value={girlName}
                  onChange={(e) => setGirlName(e.target.value)}
                  placeholder="નામ દાખલ કરો..."
                  className="w-full p-3 rounded-xl border border-black/10 focus:border-pink-500 focus:outline-none bg-white dark:bg-stone-850 dark:text-white font-gujarati text-sm"
                  required
                />
              </div>

              {useBirthDetails ? (
                <>
                  <div className="space-y-2">
                    <label className="font-gujarati font-bold text-xs text-stone-600 dark:text-stone-300 block">જન્મ તારીખ</label>
                    <input 
                      type="date"
                      value={girlDob}
                      onChange={(e) => setGirlDob(e.target.value)}
                      className="w-full p-3 rounded-xl border border-black/10 focus:border-pink-500 focus:outline-none bg-white dark:bg-stone-850 dark:text-white font-sans text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-2 relative">
                    <div className="flex justify-between items-center">
                      <label className="font-gujarati font-bold text-xs text-stone-600 dark:text-stone-300">જન્મ સમય</label>
                      <label className="flex items-center gap-1 cursor-pointer text-[10px] font-gujarati text-outline">
                        <input type="checkbox" checked={girlNoTime} onChange={(e) => setGirlNoTime(e.target.checked)} />
                        સમય ખબર નથી
                      </label>
                    </div>
                    <input 
                      type="time"
                      value={girlTob}
                      disabled={girlNoTime}
                      onChange={(e) => setGirlTob(e.target.value)}
                      className="w-full p-3 rounded-xl border border-black/10 focus:border-pink-500 focus:outline-none bg-white dark:bg-stone-850 dark:text-white font-sans text-sm disabled:opacity-40"
                    />
                  </div>

                  <div className="space-y-2 relative">
                    <label className="font-gujarati font-bold text-xs text-stone-600 dark:text-stone-300 block">જન્મ સ્થળ</label>
                    <input 
                      type="text"
                      value={girlBirthPlace}
                      onChange={(e) => setGirlBirthPlace(e.target.value)}
                      placeholder="શહેર/ગામનું નામ..."
                      className="w-full p-3 rounded-xl border border-black/10 focus:border-pink-500 focus:outline-none bg-white dark:bg-stone-850 dark:text-white font-gujarati text-sm"
                    />
                    {girlLoadingCoords && <span className="absolute right-3 bottom-3 text-xs text-stone-400 animate-spin">sync</span>}
                    
                    {girlSuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full bg-white dark:bg-stone-800 border border-black/5 rounded-xl shadow-xl z-55 max-h-40 overflow-y-auto divide-y divide-black/5">
                        {girlSuggestions.map((s, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              setGirlBirthPlace(s.display_name.split(',')[0]);
                              setGirlSelectedCoords({ lat: s.lat, lon: s.lon });
                              setGirlSuggestions([]);
                            }}
                            className="p-3 text-xs font-gujarati cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-950 truncate dark:text-white"
                          >
                            {s.display_name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="font-gujarati font-bold text-xs text-stone-600 dark:text-stone-300 block">જન્મ રાશિ (Moon Sign)</label>
                    <select 
                      value={girlRashiId} 
                      onChange={(e) => setGirlRashiId(e.target.value)}
                      className="w-full p-3 rounded-xl border border-black/10 focus:border-pink-500 focus:outline-none bg-white dark:bg-stone-850 dark:text-white font-gujarati text-sm"
                    >
                      {RASHIS.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="font-gujarati font-bold text-xs text-stone-600 dark:text-stone-300 block">જન્મ નક્ષત્ર (Birth Star)</label>
                    <select 
                      value={girlNakshatraIdx} 
                      onChange={(e) => setGirlNakshatraIdx(e.target.value)}
                      className="w-full p-3 rounded-xl border border-black/10 focus:border-pink-500 focus:outline-none bg-white dark:bg-stone-850 dark:text-white font-gujarati text-sm"
                    >
                      {NAKSHATRAS.map((n, idx) => (
                        <option key={idx} value={idx}>{n.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="font-gujarati font-bold text-xs text-stone-600 dark:text-stone-300 block">માંગલિક દોષ?</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 font-gujarati text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
                        <input type="radio" name="girl_m" value="no" checked={girlIsManglik === "no"} onChange={() => setGirlIsManglik("no")} />
                        ના, માંગલિક નથી
                      </label>
                      <label className="flex items-center gap-1.5 font-gujarati text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
                        <input type="radio" name="girl_m" value="yes" checked={girlIsManglik === "yes"} onChange={() => setGirlIsManglik("yes")} />
                        હા, માંગલિક છે
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-gujarati font-black py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-2xl font-black">favorite</span>
            મેળાપ મેળવો (૩૬ ગુણ) 🪔
          </button>
        </form>
      ) : (
        
        // RESULTS SHEET
        <div className="space-y-6 animate-fade-in relative">
          
          {/* Main Score summary card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-850 p-6 rounded-[2.5rem] border border-amber-200/50 shadow-xl text-center space-y-6">
            
            <h3 className="font-gujarati font-black text-2xl text-amber-950 dark:text-amber-500">લગ્ન ગુણ મિલાન પરિણામ</h3>
            
            {/* Score Ring */}
            <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="#f3f4f6" strokeWidth="12" fill="transparent" />
                <circle 
                  cx="80" 
                  cy="80" 
                  r="70" 
                  stroke={results.totalScore >= 18 ? "#10b981" : "#ef4444"} 
                  strokeWidth="12" 
                  fill="transparent" 
                  strokeDasharray="440"
                  strokeDashoffset={440 - (440 * results.totalScore) / 36}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="text-center">
                <span className="font-sans font-black text-5xl text-stone-850 dark:text-white leading-none">{results.totalScore}</span>
                <span className="block text-xs font-bold text-outline uppercase tracking-wider font-gujarati mt-1">૩૬ માંથી ગુણ</span>
              </div>
            </div>

            <div className="max-w-lg mx-auto space-y-2">
              <span className={`inline-block px-4 py-1.5 rounded-full font-gujarati font-black text-xs border ${results.totalScore >= 18 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                {results.totalScore >= 18 ? 'લગ્ન માટે શુભ મેળાપ' : 'અશુભ મેળ ખાશે'}
              </span>
              <p className={`font-gujarati text-base leading-relaxed ${results.verdictColor} font-bold`}>{results.verdict}</p>
            </div>
          </div>

          {/* Astrlogical profiles card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50/40 dark:bg-blue-950/20 p-5 rounded-2xl border border-blue-200/50">
              <h4 className="font-gujarati font-black text-sm text-blue-900 dark:text-blue-400">🤵 વરની ગણતરી વિગત</h4>
              <ul className="text-xs font-gujarati text-stone-600 dark:text-stone-300 space-y-1.5 mt-2">
                <li>રાશિ: {results.boyR.name} (સ્વામી: {results.boyR.lord})</li>
                <li>નક્ષત્ર: {results.boyN.name} (ચરણ: {toGujaratiNum(results.bPada)})</li>
                <li>તત્વ: {results.boyR.element || "અગ્નિ"} | ગણ: {results.boyN.gana} | નાડી: {results.boyN.nadi}</li>
              </ul>
            </div>
            <div className="bg-pink-50/40 dark:bg-pink-950/20 p-5 rounded-2xl border border-pink-200/50">
              <h4 className="font-gujarati font-black text-sm text-pink-900 dark:text-pink-400">👰 કન્યાની ગણતરી વિગત</h4>
              <ul className="text-xs font-gujarati text-stone-600 dark:text-stone-300 space-y-1.5 mt-2">
                <li>રાશિ: {results.girlR.name} (સ્વામી: {results.girlR.lord})</li>
                <li>નક્ષત્ર: {results.girlN.name} (ચરણ: {toGujaratiNum(results.gPada)})</li>
                <li>તત્વ: {results.girlR.element || "અગ્નિ"} | ગણ: {results.girlN.gana} | નાડી: {results.girlN.nadi}</li>
              </ul>
            </div>
          </div>

          {/* Manglik status banner */}
          <div className={`p-5 rounded-2xl border flex items-center gap-4 ${results.manglikStatus === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-green-50 border-green-200 text-green-950'}`}>
            <span className="text-3xl">🔥</span>
            <div className="space-y-0.5">
              <h4 className="font-gujarati font-black text-sm">મંગળ દોષ વિશ્લેષણ</h4>
              <p className="font-gujarati text-xs">{results.manglikMessage}</p>
            </div>
          </div>

          {/* Details Table - Ashta Kootas */}
          <div className="bg-white dark:bg-stone-900 rounded-[2rem] border border-black/5 shadow-sm p-6 overflow-hidden">
            <h4 className="font-gujarati font-black text-lg text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">assignment</span>
              અષ્ટકૂટ ગુણ પત્રક (Koota Details)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left divide-y divide-black/5">
                <thead className="bg-stone-50 dark:bg-stone-850 font-gujarati font-black text-stone-600 dark:text-stone-300">
                  <tr>
                    <th className="p-3">કૂટ નામ (Koota)</th>
                    <th className="p-3">મહત્તમ ગુણ</th>
                    <th className="p-3">મેળવેલા ગુણ</th>
                    <th className="p-3">મહત્વ / અર્થ</th>
                  </tr>
                </thead>
                <tbody className="font-gujarati text-stone-700 dark:text-stone-300 divide-y divide-black/5">
                  <tr>
                    <td className="p-3 font-bold">૧. વર્ણ (Varna)</td>
                    <td className="p-3">૧</td>
                    <td className="p-3 font-bold text-stone-850 dark:text-white">{toGujaratiNum(results.varnaScore)}</td>
                    <td className="p-3 text-stone-500 dark:text-stone-400">જીવન શૈલી અને વ્યક્તિત્વની સમાનતા ચેક કરે છે.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">૨. વશ્ય (Vashya)</td>
                    <td className="p-3">૨</td>
                    <td className="p-3 font-bold text-stone-850 dark:text-white">{toGujaratiNum(results.vashyaScore)}</td>
                    <td className="p-3 text-stone-500 dark:text-stone-400">એકબીજા પર પ્રભાવ અને વલણ દર્શાવે છે.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">૩. તારા (Tara)</td>
                    <td className="p-3">૩</td>
                    <td className="p-3 font-bold text-stone-850 dark:text-white">{toGujaratiNum(results.taraScore)}</td>
                    <td className="p-3 text-stone-500 dark:text-stone-400">ભાગ્યશાળી તારા અને પરસ્પર સુમેળ સૂચવે છે.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">૪. યોનિ (Yoni)</td>
                    <td className="p-3">૪</td>
                    <td className="p-3 font-bold text-stone-850 dark:text-white">{toGujaratiNum(results.yoniScore)}</td>
                    <td className="p-3 text-stone-500 dark:text-stone-400">શારીરિક અને આત્મીય આકર્ષણની સુસંગતતા.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">૫. મૈત્રી (Maitri)</td>
                    <td className="p-3">૫</td>
                    <td className="p-3 font-bold text-stone-850 dark:text-white">{toGujaratiNum(results.maitriScore)}</td>
                    <td className="p-3 text-stone-500 dark:text-stone-400">રાશિ સ્વામી મિત્રતા (વિચારધારા મેળવી છે).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">૬. ગણ (Gana)</td>
                    <td className="p-3">૬</td>
                    <td className="p-3 font-bold text-stone-850 dark:text-white">{toGujaratiNum(results.ganaScore)}</td>
                    <td className="p-3 text-stone-500 dark:text-stone-400">દેવ-મનુષ્ય-રાક્ષસ સ્વભાવ સંબંધી તાલમેલ.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">૭. ભકૂટ (Bhakoot)</td>
                    <td className="p-3">૭</td>
                    <td className="p-3 font-bold text-stone-850 dark:text-white">{toGujaratiNum(results.bhakootScore)}</td>
                    <td className="p-3 text-stone-500 dark:text-stone-400">માનસિક તાલમેલ અને સંપત્તિ-બાળકોનું પ્રદાન.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">૮. નાડી (Nadi)</td>
                    <td className="p-3">૮</td>
                    <td className="p-3 font-bold text-stone-850 dark:text-white">{toGujaratiNum(results.nadiScore)}</td>
                    <td className="p-3 text-stone-500 dark:text-stone-400">આરોગ્ય, સંતતિ અને શારીરિક સ્વાસ્થ્ય માટે સૌથી મહત્વપૂર્ણ.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap gap-3 justify-center pt-4">
            <button 
              onClick={triggerWhatsAppShare}
              className="bg-stone-900 hover:bg-stone-850 text-white border border-stone-800 font-gujarati font-black py-3.5 px-6 rounded-2xl shadow flex items-center gap-2 active:scale-95 transition-all text-xs"
            >
              <span className="material-symbols-outlined text-lg">share</span>
              વોટ્સએપ પર મેળ શેર કરો 🙏
            </button>
            <button 
              onClick={() => { setCalculated(false); setResults(null); }}
              className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-gujarati font-black py-3.5 px-6 rounded-2xl active:scale-95 transition-all text-xs"
            >
              🔄 નવો મેળ કરો
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default GunMilan;
