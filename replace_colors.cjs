const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = {
  '#0B3B36': '#0F172A',
  '#0b3b36': '#0F172A',
  '#0F4C47': '#1E293B',
  '#0f4c47': '#1E293B',
  '#C49F67': '#4F46E5',
  '#c49f67': '#4F46E5',
  '#D5B581': '#6366F1',
  '#d5b581': '#6366F1',
  '#F4EFE6': '#F8FAFC',
  '#f4efe6': '#F8FAFC',
  '#FFFBEB': '#EFF6FF',
  '#fffbeb': '#EFF6FF',
};

function replaceInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  
  for (const [oldColor, newColor] of Object.entries(replacements)) {
    newContent = newContent.split(oldColor).join(newColor);
  }

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
      replaceInFile(fullPath);
    }
  }
}

processDirectory(directoryPath);
console.log('Color replacement complete.');
