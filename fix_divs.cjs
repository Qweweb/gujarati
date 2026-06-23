const fs = require('fs');
const path = require('path');
const dir = 'd:/Antigravity/Gujarati/src/components/vcard/themes';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx') && f !== 'PaymentSection.jsx');

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  const returnBlockMatch = content.match(/return \([\s\S]*?\);\n};/);
  if (returnBlockMatch) {
    let block = returnBlockMatch[0];
    const noComments = block.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
    const divOpenCount = (noComments.match(/<div(\s|>)/g) || []).length;
    const divCloseCount = (noComments.match(/<\/div>/g) || []).length;
    
    if (divOpenCount !== divCloseCount) {
      console.log(`File: ${file} | Open: ${divOpenCount} | Close: ${divCloseCount}`);
      const diff = divOpenCount - divCloseCount;
      if (diff > 0) {
        let extraDivs = '';
        for(let i=0; i<diff; i++) extraDivs += '      </div>\n';
        content = content.replace(/\s*\);\n};/, '\n' + extraDivs + '  );\n};');
        fs.writeFileSync(filePath, content);
      }
    }
  }
}
