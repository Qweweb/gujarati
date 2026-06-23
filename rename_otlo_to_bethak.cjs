const fs = require('fs');
const path = require('path');

const baseDir = 'd:/Antigravity/Gujarati/src';

// 1. Update Login.jsx to save user_phone
const loginFile = path.join(baseDir, 'components', 'Login.jsx');
let loginContent = fs.readFileSync(loginFile, 'utf8');

loginContent = loginContent.replace(
  'if (phone === "9999999999" && enteredOtp === "0000") {\n        onLogin();\n    }',
  'if (phone === "9999999999" && enteredOtp === "0000") {\n        localStorage.setItem("user_phone", phone);\n        onLogin();\n    }'
);

fs.writeFileSync(loginFile, loginContent, 'utf8');

// 2. Update Community.jsx to rename Otlo to Bethak, and add Developer guard
const commFile = path.join(baseDir, 'components', 'Community.jsx');
let commContent = fs.readFileSync(commFile, 'utf8');

// Replacements
commContent = commContent.replace(/ડિજિટલ ઓટલો/g, 'ડિજિટલ બેઠક');
commContent = commContent.replace(/ઓટલો ખોલો/g, 'બેઠક ખોલો');
commContent = commContent.replace(/ઓટલો બદલો/g, 'બેઠક બદલો');

// Injecting the Coming Soon block right after `const navigate = useNavigate();`
const comingSoonBlock = `
  const [isDev] = useState(() => localStorage.getItem('user_phone') === '9999999999');

  if (!isDev) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-orange-50 dark:from-stone-900 dark:to-stone-800 opacity-50 z-0"></div>
        
        <div className="relative z-10 space-y-6">
          <div className="w-32 h-32 mx-auto bg-gradient-to-tr from-teal-500 to-orange-400 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
             <span className="material-symbols-outlined text-white text-6xl">construction</span>
          </div>
          
          <h2 className="font-gujarati font-black text-4xl text-teal-800 dark:text-teal-400 drop-shadow-sm">
            ડિજિટલ બેઠક<br/>ખૂબ જલ્દી આવી રહ્યું છે!
          </h2>
          
          <p className="font-gujarati text-stone-600 dark:text-stone-300 text-lg max-w-sm mx-auto leading-relaxed">
            અમે તમારા માટે એક નવો અને આધુનિક અનુભવ તૈયાર કરી રહ્યા છીએ. કૃપા કરીને થોડી રાહ જુઓ.
          </p>
          
          <div className="pt-4">
             <button onClick={() => navigate('/')} className="px-8 py-3 bg-teal-600 text-white rounded-2xl font-gujarati font-black shadow-lg hover:bg-teal-700 hover:scale-105 transition-all cursor-pointer">
               મુખ્ય પેજ પર પાછા જાઓ
             </button>
          </div>
        </div>
      </div>
    );
  }
`;

if (!commContent.includes('ડિજિટલ બેઠક<br/>ખૂબ જલ્દી આવી રહ્યું છે!')) {
  commContent = commContent.replace(
    '  const navigate = useNavigate();',
    '  const navigate = useNavigate();\n' + comingSoonBlock
  );
}

fs.writeFileSync(commFile, commContent, 'utf8');

console.log("Renamed Otlo to Bethak and added Developer Guard");
