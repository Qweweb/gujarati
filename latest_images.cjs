const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/alpha/.gemini/antigravity/brain/bd05df68-4313-4672-b3cc-6b9d4c71685c';
const files = fs.readdirSync(dir)
  .filter(f => f.endsWith('.png') || f.endsWith('.jpg'))
  .map(f => {
    return { name: f, time: fs.statSync(path.join(dir, f)).mtime.getTime() };
  })
  .sort((a, b) => b.time - a.time)
  .slice(0, 5);

console.log(files);
