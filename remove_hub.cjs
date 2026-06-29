const fs = require('fs');
let content = fs.readFileSync('src/components/Community.jsx', 'utf8');

const startString = '{activeTab === "hub" && (';
// Find the start
const startIdx = content.indexOf(startString);
if (startIdx !== -1) {
    const afterStart = content.substring(startIdx + startString.length);
    // Find the next {activeTab to know where the next section starts, and delete up to before it
    const nextSectionStr = "{!['games', 'english'].includes(activeTab) && (";
    const endIdx = content.indexOf(nextSectionStr, startIdx);
    
    if (endIdx !== -1) {
        const fullRemove = content.substring(startIdx, endIdx);
        content = content.replace(fullRemove, '');
        fs.writeFileSync('src/components/Community.jsx', content);
        console.log('Successfully removed hub view');
    } else {
        console.log('End not found');
    }
} else {
    console.log('Start not found');
}
