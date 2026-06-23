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
    let divOpenCount = (noComments.match(/<div(\s|>)/g) || []).length;
    let divCloseCount = (noComments.match(/<\/div>/g) || []).length;
    
    if (divOpenCount !== divCloseCount) {
      let diff = divCloseCount - divOpenCount; // e.g. 17 - 16 = 1 (1 extra closing div)
      if (diff > 0) {
        // remove extra closing divs from the end of the content
        for(let i=0; i<diff; i++) {
          content = content.replace(/<\/div>\s*<\/div>\s*\);\n};/, '</div>\n  );\n};');
        }
        fs.writeFileSync(filePath, content);
        console.log(`Fixed ${file} by removing ${diff} extra </div>`);
      } else if (diff < 0) { // e.g. Open 16, Close 15 -> diff = -1
        let extraDivs = '';
        for(let i=0; i<Math.abs(diff); i++) extraDivs += '      </div>\n';
        content = content.replace(/\s*\);\n};/, '\n' + extraDivs + '  );\n};');
        fs.writeFileSync(filePath, content);
        console.log(`Fixed ${file} by adding ${Math.abs(diff)} </div>`);
      }
    }
  }
}
