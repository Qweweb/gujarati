import { getDailyPanchang } from '../src/utils/panchangEngine.js';

const today = new Date('2026-06-10T12:00:00Z');
console.log("Calculated Panchang:", getDailyPanchang(today));
