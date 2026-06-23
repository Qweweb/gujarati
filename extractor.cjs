const fs = require('fs');
let code = fs.readFileSync('src/data/gamesDatabase.js', 'utf8');

// Replace exports
code = code.replace(/export const/g, 'const');
// Remove the final export default
code = code.replace(/export default\s*\{[\s\S]*\}\s*;/g, '');

code += '\nmodule.exports = { CRICKET_QUIZ_DB, VISUAL_QUIZ_DB, BHAJAN_DB };';

fs.writeFileSync('temp_db2.cjs', code);

const { CRICKET_QUIZ_DB, VISUAL_QUIZ_DB, BHAJAN_DB } = require('./temp_db2.cjs');

let newQs = [];
let qId = 3000;

if(CRICKET_QUIZ_DB) {
  CRICKET_QUIZ_DB.forEach(q => {
    newQs.push({
      id: 'q' + (qId++), category: 'ક્રિકેટ ક્વિઝ', difficulty: 'medium', ageGroup: ['youth', 'adult', 'elder'],
      question: q.question, options: q.options, correct: q.answer, explanation: 'ક્રિકેટ જગતનું આ એક અદભુત તથ્ય છે.'
    });
  });
}

if(VISUAL_QUIZ_DB) {
  VISUAL_QUIZ_DB.forEach(q => {
    let opts = [q.name];
    while(opts.length < 4) {
      let r = VISUAL_QUIZ_DB[Math.floor(Math.random() * VISUAL_QUIZ_DB.length)].name;
      if (!opts.includes(r)) opts.push(r);
    }
    opts.sort(() => 0.5 - Math.random());
    newQs.push({
      id: 'q' + (qId++), category: 'ગુજરાત ઓળખો', difficulty: 'easy', ageGroup: ['kids', 'youth', 'adult', 'elder'],
      question: 'આપેલ વર્ણન પરથી આ કયું સ્થળ છે તે ઓળખો: ' + q.desc, options: opts, correct: q.name, explanation: q.desc
    });
  });
}

if(BHAJAN_DB) {
  BHAJAN_DB.forEach(q => {
    let opts = [q.author];
    while(opts.length < 4) {
      let r = BHAJAN_DB[Math.floor(Math.random() * BHAJAN_DB.length)].author;
      if (!opts.includes(r)) opts.push(r);
    }
    opts.sort(() => 0.5 - Math.random());
    let qtext = (q.lines && q.lines[0]) ? '"' + q.lines[0] + '" - આ પંક્તિના રચયિતા કોણ છે?' : q.title + ' ના રચયિતા કોણ છે?';
    newQs.push({
      id: 'q' + (qId++), category: 'ભજન ઓળખો', difficulty: 'hard', ageGroup: ['adult', 'elder'],
      question: qtext, options: opts, correct: q.author, explanation: 'આ પ્રસિદ્ધ ભજન ' + q.author + ' દ્વારા રચાયેલ છે.'
    });
  });
}

const toAppend = '\nexport const EXTRACTED_GAMES_QUESTIONS = ' + JSON.stringify(newQs, null, 2) + ';\n';
fs.appendFileSync('src/data/quizQuestions.js', toAppend);
console.log('Appended ' + newQs.length + ' extracted questions.');
