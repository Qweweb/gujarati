const fs = require('fs');
const path = require('path');

const dir = 'd:/Antigravity/Gujarati/src/components/vcard/themes';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx') && f !== 'PaymentSection.jsx');

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to fix the broken endings
  // Find everything from <PaymentSection to the end of the file.
  // And rewrite it cleanly.
  
  content = content.replace(/<PaymentSection[\s\S]*$/, 
    "<PaymentSection vcard={vcard} primaryColor={primaryColor || vcard.theme_colors?.primary || '#000'} />\n\n" +
    "        <div className=\"mt-12 mb-4 w-full text-center\">\n" +
    "          <p className=\"text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase\">Powered by Gujarati App</p>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  );\n" +
    "};\n\n" +
    "export default " + file.replace('.jsx', '') + ";\n"
  );
  
  // Wait, what if the original had a different number of closing </div> tags?
  // ThemeDark: return <div ...> <div fixed ...> <div fixed ...> <div px-6 ...> ... </div> </div>
  // Let's count the number of opening and closing divs.
  
  fs.writeFileSync(filePath, content);
}
