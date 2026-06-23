const fs = require('fs');
const filePath = 'd:/Antigravity/Gujarati/src/components/vcard/VCardEditor.jsx';
let content = fs.readFileSync(filePath, 'utf8');

if (content.indexOf('export default VCardEditor;') !== -1) {
    if (!content.includes('};\n\nexport default VCardEditor;') && !content.includes('}\nexport default VCardEditor;')) {
        content = content.replace(/export default VCardEditor;/g, '};\n\nexport default VCardEditor;');
        fs.writeFileSync(filePath, content);
        console.log("Fixed EOF brace");
    } else {
        console.log("EOF brace already exists or not needed.");
    }
}
