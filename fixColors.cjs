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

replaceInFile('d:/Antigravity/Gujarati/src/components/Community.jsx', [
    ['color: "bg-red-100/70 text-emerald-800"', 'color: "bg-[#E11D48]/10 text-[#E11D48]"'],
    ['bg-red-50 hover:bg-red-100 border border-red-200 text-emerald-700', 'bg-[#E11D48]/10 hover:bg-[#E11D48]/20 border border-[#E11D48]/30 text-[#E11D48]']
]);

replaceInFile('d:/Antigravity/Gujarati/src/utils/otlo_helper.js', [
    ['color: "bg-red-50 text-emerald-800 border-red-200"', 'color: "bg-[#E11D48]/10 text-[#E11D48] border-[#E11D48]/30"']
]);

replaceInFile('d:/Antigravity/Gujarati/src/components/MariSociety.jsx', [
    ['bg-rose-50 dark:bg-rose-950/20 p-3 rounded-2xl border border-red-200/30 text-emerald-700 dark:text-rose-450', 'bg-[#E11D48]/10 p-3 rounded-2xl border border-[#E11D48]/30 text-[#E11D48] dark:text-[#E11D48]'],
    ['bg-rose-50 dark:bg-rose-950/20 p-3 rounded-2xl border border-red-200/30 text-emerald-700 dark:text-rose-400', 'bg-[#E11D48]/10 p-3 rounded-2xl border border-[#E11D48]/30 text-[#E11D48] dark:text-[#E11D48]'],
    ['bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-emerald-600 border border-rose-200/50', 'bg-[#E11D48]/10 hover:bg-[#E11D48]/20 text-[#E11D48] border border-[#E11D48]/50'],
    ['bg-gradient-to-r from-emerald-600 to-rose-650 hover:from-red-400 hover:to-rose-550', 'bg-[#E11D48] hover:bg-[#E11D48]/90'],
    ['border-rose-200 dark:border-emerald-900/50', 'border-[#E11D48]/30'],
    ['bg-rose-50 text-emerald-700 border border-rose-200', 'bg-[#E11D48]/10 text-[#E11D48] border border-[#E11D48]/30'],
    ['bg-rose-50 border-rose-300 text-emerald-700', 'bg-[#E11D48]/10 border-[#E11D48]/30 text-[#E11D48]'],
    ['text-rose-650', 'text-[#E11D48]'],
    ['text-rose-800 dark:text-rose-455', 'text-[#E11D48]']
]);

console.log('Done.');
