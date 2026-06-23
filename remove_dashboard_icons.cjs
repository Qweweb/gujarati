const fs = require('fs');

const path = 'd:/Antigravity/Gujarati/src/components/Dashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

const labelsToRemove = ["'ચોઘડિયા'", "'ભક્તિ'", "'શબ્દ રમત'", "'સ્પેશિયલ ક્વિઝ'"];
const lines = content.split('\n');
const newLines = lines.filter(line => {
  return !labelsToRemove.some(label => line.includes(`label:${label}`));
});

fs.writeFileSync(path, newLines.join('\n'), 'utf8');
console.log("Icons removed from Dashboard.jsx");
