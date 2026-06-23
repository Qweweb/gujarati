const fs = require('fs');
const filesToUpdate = [
  'src/components/AdminDashboard.jsx',
  'src/components/BiodataMaker.jsx',
  'src/components/Community.jsx',
  'src/components/DevotionalCards.jsx',
  'src/components/DigitalCard.jsx',
  'src/components/ShradhanjaliMaker.jsx'
];

for(let file of filesToUpdate) {
  let content = fs.readFileSync('d:/Antigravity/Gujarati/' + file, 'utf8');
  if (!content.includes("import { uploadToCloudinary }")) {
      // Add import
      content = "import { uploadToCloudinary } from '../utils/cloudinaryHelper';\n" + content;
      fs.writeFileSync('d:/Antigravity/Gujarati/' + file, content);
  }
}
