const fs = require('fs');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    for (let [search, replace] of replacements) {
        content = content.split(search).join(replace);
    }
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated: ' + filePath);
    }
}

replaceInFile('d:/Antigravity/Gujarati/src/components/Dashboard.jsx', [
    ['#4F46E5', '#0D9488'],
    ['#115E59', '#0D9488'],
    ['#0F172A', '#2D3748'],
    ['#F2EFE8', '#F4F4F0']
]);

console.log('Dashboard colors fixed.');
