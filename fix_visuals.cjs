const fs = require('fs');

// Fix Panchang.jsx
let panchang = fs.readFileSync('d:/Antigravity/Gujarati/src/components/Panchang.jsx', 'utf8');

// Sunset color fix
panchang = panchang.replace(
  '<span className="material-symbols-outlined text-4xl mb-2 text-[#0D9488]">wb_twilight</span>\n                    <p className="font-gujarati font-bold opacity-80 text-[#0D9488]">સૂર્યાસ્ત (ચોવિહાર)</p>\n                    <p className="font-headline font-black text-2xl">{panchangData.sunset}</p>',
  '<span className="material-symbols-outlined text-4xl mb-2 text-yellow-400">wb_twilight</span>\n                    <p className="font-gujarati font-bold opacity-80 text-[#F4F4F0]">સૂર્યાસ્ત (ચોવિહાર)</p>\n                    <p className="font-headline font-black text-2xl text-[#F4F4F0]">{panchangData.sunset}</p>'
);

// Choghadiya Active color fix
panchang = panchang.replace(
  "isActive \n                            ? 'bg-[#2D3748] border-[#2D3748] text-[#0D9488] shadow-md scale-105 z-10' \n                            : ch.isGood",
  "isActive \n                            ? 'bg-[#2D3748] border-[#2D3748] text-[#F4F4F0] shadow-md scale-105 z-10' \n                            : ch.isGood"
);

panchang = panchang.replace(
  "<span className={`material-symbols-outlined mb-1 text-xl ${isActive ? 'text-[#0D9488]' : ch.isGood ? 'text-[#2D3748]' : 'text-[#78716C]'}`}>",
  "<span className={`material-symbols-outlined mb-1 text-xl ${isActive ? 'text-teal-400' : ch.isGood ? 'text-[#2D3748]' : 'text-[#78716C]'}`}>"
);

fs.writeFileSync('d:/Antigravity/Gujarati/src/components/Panchang.jsx', panchang);

// Fix DevotionalHub.jsx
let devotional = fs.readFileSync('d:/Antigravity/Gujarati/src/components/DevotionalHub.jsx', 'utf8');

// Add images to MANTRA_DEITIES
devotional = devotional.replace(
  'id: "shiva",\n    name: "🔱 ભગવાન શિવ",',
  'id: "shiva",\n    name: "ભગવાન શિવ",\n    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Bangalore_Shiva.jpg/500px-Bangalore_Shiva.jpg",'
);
devotional = devotional.replace(
  'id: "vishnu",\n    name: "🌸 વિષ્ણુ / કૃષ્ણ",',
  'id: "vishnu",\n    name: "વિષ્ણુ / કૃષ્ણ",\n    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Vishnu_from_Gita_Govinda.jpg/500px-Vishnu_from_Gita_Govinda.jpg",'
);
devotional = devotional.replace(
  'id: "hanuman",\n    name: "🚩 હનુમાનજી",',
  'id: "hanuman",\n    name: "હનુમાનજી",\n    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Ravivarmapress.jpg/500px-Ravivarmapress.jpg",'
);
devotional = devotional.replace(
  'id: "devi",\n    name: "🌺 આદિશક્તિ દેવી",',
  'id: "devi",\n    name: "આદિશક્તિ દેવી",\n    image: "https://upload.wikimedia.org/wikipedia/commons/6/65/Mahishasura-Mardini_Durga.jpg",'
);
devotional = devotional.replace(
  'id: "ganesha",\n    name: "🐘 ગણેશજી",',
  'id: "ganesha",\n    name: "ગણેશજી",\n    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Ganesha_Basohli_miniature_circa_1730_Dubost_p73.jpg/500px-Ganesha_Basohli_miniature_circa_1730_Dubost_p73.jpg",'
);
devotional = devotional.replace(
  'id: "surya",\n    name: "☀️ સૂર્ય / ગ્રહ",',
  'id: "surya",\n    name: "સૂર્ય / ગ્રહ",\n    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Surya_with_Adityas_and_attendants.jpg/500px-Surya_with_Adityas_and_attendants.jpg",'
);
devotional = devotional.replace(
  'id: "ram",\n    name: "🏹 પ્રભુ શ્રી રામ",',
  'id: "ram",\n    name: "પ્રભુ શ્રી રામ",\n    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Lord_Rama_with_arrows.jpg/500px-Lord_Rama_with_arrows.jpg",'
);

// Update render
const oldRender = `<div className=\`h-14 w-14 rounded-2xl bg-[#0D9488] flex items-center justify-center text-2xl shadow-sm border border-[#2D3748] group-hover:rotate-12 transition-transform\`>\n                    {deity.name.split(' ')[0]}\n                  </div>\n                  <span className="font-gujarati font-black text-sm text-[#F8FAFC] group-hover:text-[#0D9488] transition-colors">\n                    {deity.name.split(' ').slice(1).join(' ')}\n                  </span>`;

const newRender = `<div className="h-16 w-16 rounded-full overflow-hidden shadow-md border-2 border-[#2D3748] group-hover:border-[#0D9488] group-hover:scale-110 transition-all bg-[#0D9488]">\n                    <img src={deity.image} alt={deity.name} className="w-full h-full object-cover" />\n                  </div>\n                  <span className="font-gujarati font-black text-sm text-[#F8FAFC] group-hover:text-[#0D9488] transition-colors">\n                    {deity.name}\n                  </span>`;

devotional = devotional.replace(oldRender, newRender);

fs.writeFileSync('d:/Antigravity/Gujarati/src/components/DevotionalHub.jsx', devotional);
