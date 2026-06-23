const fs = require('fs');
const path = require('path');

const directory = './src';

// The precise color map
const replaceMap = {
  // Hex Colors (Case Insensitive Regex)
  '#B45309': '#0B3B36', // Deep Saffron -> Deep Teal
  '#D97706': '#0F4C47', // Amber 600 -> Teal 800 var
  '#F97316': '#115E59', // Orange 500 -> Teal 700
  '#ea580c': '#0B3B36', // Orange 600 -> Deep Teal
  '#f59e0b': '#C49F67', // Amber 500 -> Muted Gold
  '#FCD34D': '#D5B581', // Amber 300 -> Light Gold
  '#FDE68A': '#C49F67', // Amber 200 -> Gold border
  '#FEF3C7': '#F2EFE8', // Amber 100 -> Cream tint
  '#FFF8EF': '#F4EFE6', // Background warm -> Sand
  '#F9F9F7': '#F4EFE6', // Bg -> Sand
  '#fef8f1': '#F4EFE6', // Bg -> Sand
  '#994700': '#0B3B36', // Primary -> Deep Teal
  
  // Tailwind Classes (Exact word boundary replacements)
  'orange-50': 'teal-50',
  'orange-100': 'teal-100',
  'orange-200': 'teal-200',
  'orange-300': 'teal-300',
  'orange-400': 'teal-400',
  'orange-500': 'teal-600',
  'orange-600': 'teal-700',
  'orange-650': 'teal-800',
  'orange-700': 'teal-800',
  'orange-800': 'teal-900',
  'orange-900': 'teal-950',
  'orange-950': 'teal-950',

  'amber-50': 'yellow-50',
  'amber-100': 'yellow-100',
  'amber-200': 'yellow-200',
  'amber-300': 'yellow-300',
  'amber-400': 'yellow-400',
  'amber-500': 'yellow-600', // yellow-600 is close to gold
  'amber-600': 'yellow-700',
  'amber-700': 'yellow-800',
  'amber-800': 'yellow-900',
  'amber-900': 'yellow-900',
  'amber-950': 'yellow-950',
  
  'red-500': 'emerald-600',
  'red-600': 'emerald-700',
  'red-650': 'emerald-800',
  'red-700': 'emerald-800',
  'red-800': 'emerald-900',
  'red-900': 'emerald-950',
  'red-950': 'emerald-950',
  
  'rose-500': 'emerald-500',
  'rose-600': 'emerald-600',
  'rose-700': 'emerald-700',
  'rose-900': 'emerald-900',
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.css') || file.endsWith('.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(directory);
let totalChanged = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  Object.keys(replaceMap).forEach(key => {
    // For hex codes, we want case insensitive global replace
    if (key.startsWith('#')) {
      const regex = new RegExp(key, 'gi');
      newContent = newContent.replace(regex, replaceMap[key]);
    } else {
      // For tailwind classes, we want word boundary to avoid partial matches
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      newContent = newContent.replace(regex, replaceMap[key]);
    }
  });

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated ${file}`);
    totalChanged++;
  }
});

console.log(`Total files updated: ${totalChanged}`);
