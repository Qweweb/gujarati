import fs from 'fs';

const content = fs.readFileSync('src/data/gamesDatabase.js', 'utf8');

// Quick dirty eval parser:
const evaluate = (varName) => {
  const match = content.match(new RegExp(`export const ${varName} = \\s*\\[([\\s\\S]*?)\\];`));
  if (!match) return [];
  // Use eval safely in this isolated script
  try {
    return eval(`[${match[1]}]`);
  } catch(e) {
    console.error('Error evaluating', varName, e.message);
    return [];
  }
};

const cricket = evaluate('CRICKET_QUIZ_DB');
const visual = evaluate('VISUAL_QUIZ_DB');
const bhajan = evaluate('BHAJAN_DB');

let newQs = [];
let qId = 2000;

cricket.forEach(q => {
  newQs.push({
    id: 'q' + (qId++),
    category: 'ક્રિકેટ ક્વિઝ',
    difficulty: 'medium',
    ageGroup: ['youth', 'adult', 'elder'],
    question: q.question,
    options: q.options,
    correct: q.answer,
    explanation: 'ક્રિકેટ જગતનું આ એક અદભુત તથ્ય છે.'
  });
});

visual.forEach(q => {
  let opts = [q.name];
  while(opts.length < 4) {
    let r = visual[Math.floor(Math.random() * visual.length)].name;
    if (!opts.includes(r)) opts.push(r);
  }
  opts.sort(() => 0.5 - Math.random());
  
  newQs.push({
    id: 'q' + (qId++),
    category: 'ગુજરાત ઓળખો',
    difficulty: 'easy',
    ageGroup: ['kids', 'youth', 'adult', 'elder'],
    question: 'આપેલ વર્ણન પરથી આ કયું સ્થળ છે તે ઓળખો: ' + q.desc,
    options: opts,
    correct: q.name,
    explanation: q.desc
  });
});

bhajan.forEach(q => {
  let opts = [q.author];
  while(opts.length < 4) {
    let r = bhajan[Math.floor(Math.random() * bhajan.length)].author;
    if (!opts.includes(r)) opts.push(r);
  }
  opts.sort(() => 0.5 - Math.random());
  
  newQs.push({
    id: 'q' + (qId++),
    category: 'ભજન ઓળખો',
    difficulty: 'hard',
    ageGroup: ['adult', 'elder'],
    question: `"${q.lines[0]}" - આ પંક્તિના રચયિતા કોણ છે?`,
    options: opts,
    correct: q.author,
    explanation: `આ પ્રસિદ્ધ ભજન ${q.author} દ્વારા રચાયેલ છે.`
  });
});

const toAppend = '\nexport const IMPORTED_GAMES_QUESTIONS = ' + JSON.stringify(newQs, null, 2) + ';\n';
fs.appendFileSync('src/data/quizQuestions.js', toAppend);
console.log('Appended ' + newQs.length + ' questions.');
