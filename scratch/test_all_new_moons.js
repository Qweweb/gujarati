import { SearchMoonPhase } from 'astronomy-engine';

let current = new Date('2026-01-01T00:00:00Z');
const end = new Date('2027-01-01T00:00:00Z');

while (current < end) {
  const nm = SearchMoonPhase(0.0, current, 40);
  if (!nm) break;
  console.log("New Moon:", nm.date.toISOString());
  // Move current to 5 days after the found New Moon to search for the next one
  current = new Date(nm.date.getTime() + 5 * 24 * 3600 * 1000);
}
