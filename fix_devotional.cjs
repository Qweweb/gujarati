const fs = require('fs');

let content = fs.readFileSync('d:/Antigravity/Gujarati/src/components/DevotionalHub.jsx', 'utf8');

content = content.replace(/name: "🔱 ભગવાન શિવ"/, 'name: "ભગવાન શિવ", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Bangalore_Shiva.jpg/500px-Bangalore_Shiva.jpg"');
content = content.replace(/name: "🌸 વિષ્ણુ \/ કૃષ્ણ"/, 'name: "વિષ્ણુ / કૃષ્ણ", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Vishnu_from_Gita_Govinda.jpg/500px-Vishnu_from_Gita_Govinda.jpg"');
content = content.replace(/name: "🚩 હનુમાનજી"/, 'name: "હનુમાનજી", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Ravivarmapress.jpg/500px-Ravivarmapress.jpg"');
content = content.replace(/name: "🌺 આદિશક્તિ દેવી"/, 'name: "આદિશક્તિ દેવી", image: "https://upload.wikimedia.org/wikipedia/commons/6/65/Mahishasura-Mardini_Durga.jpg"');
content = content.replace(/name: "🐘 ગણેશજી"/, 'name: "ગણેશજી", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Ganesha_Basohli_miniature_circa_1730_Dubost_p73.jpg/500px-Ganesha_Basohli_miniature_circa_1730_Dubost_p73.jpg"');
content = content.replace(/name: "☀️ સૂર્ય \/ ગ્રહ"/, 'name: "સૂર્ય / ગ્રહ", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Surya_with_Adityas_and_attendants.jpg/500px-Surya_with_Adityas_and_attendants.jpg"');
content = content.replace(/name: "🏹 પ્રભુ શ્રી રામ"/, 'name: "પ્રભુ શ્રી રામ", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Lord_Rama_with_arrows.jpg/500px-Lord_Rama_with_arrows.jpg"');

const oldRender = /<div className=\{`h-14 w-14 rounded-2xl bg-\[#0D9488\] flex items-center justify-center text-2xl shadow-sm border border-\[#2D3748\] group-hover:rotate-12 transition-transform`\}>\s*\{deity\.name\.split\(' '\)\[0\]\}\s*<\/div>\s*<span className="font-gujarati font-black text-sm text-\[#F8FAFC\] group-hover:text-\[#0D9488\] transition-colors">\s*\{deity\.name\.split\(' '\)\.slice\(1\)\.join\(' '\)\}\s*<\/span>/m;

const newRender = `<div className="h-16 w-16 rounded-full overflow-hidden shadow-md border-2 border-[#2D3748] group-hover:border-[#0D9488] group-hover:scale-110 transition-all bg-[#0D9488]">
                    <img src={deity.image} alt={deity.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-gujarati font-black text-sm text-[#F8FAFC] group-hover:text-[#0D9488] transition-colors">
                    {deity.name}
                  </span>`;

content = content.replace(oldRender, newRender);

fs.writeFileSync('d:/Antigravity/Gujarati/src/components/DevotionalHub.jsx', content);
console.log("DevotionalHub updated successfully");
