import { SearchMoonPhase } from 'astronomy-engine';

const target = new Date('2026-11-09T12:00:00Z');
// Preceding New Moon: start search 35 days before target and look forward 40 days
const searchStart = new Date(target.getTime() - 35 * 24 * 3600 * 1000);
const nm = SearchMoonPhase(0.0, searchStart, 40);
console.log("Preceding New Moon:", nm ? nm.date.toISOString() : "Not found");

// Next New Moon: start search from target and look forward 40 days
const nextNm = SearchMoonPhase(0.0, target, 40);
console.log("Next New Moon:", nextNm ? nextNm.date.toISOString() : "Not found");
