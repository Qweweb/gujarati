const fs = require('fs');
const filePath = 'd:/Antigravity/Gujarati/src/components/Community.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const startIdx = content.indexOf('  const handleImageFileChange = (e) => {');
const endIdx = content.indexOf('reader.readAsDataURL(file);\n    };', startIdx) + 'reader.readAsDataURL(file);\n    };'.length;

if (startIdx !== -1 && endIdx > startIdx) {
  const oldFunc = content.substring(startIdx, endIdx);
  const newFunc = `  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('???? ????? ????? ???? (Image) ? ??????? ???.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('???? 10MB ?? ???? ???? ????.');
      return;
    }
    setSelectedImageFile(file);
    const uploadedUrl = await uploadToCloudinary(file);
    if (uploadedUrl) {
      setNewPostMediaUrl(uploadedUrl);
    } else {
      setSelectedImageFile(null);
    }
  };`;
  
  content = content.replace(oldFunc, newFunc);
  fs.writeFileSync(filePath, content);
  console.log('Replaced handleImageFileChange');
} else {
  console.log('Could not find Community.jsx function');
}
