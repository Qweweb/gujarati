const fs = require('fs');
const filePath = 'd:/Antigravity/Gujarati/src/components/Community.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const target = `const reader = new FileReader();
    reader.onloadend = () => {
      setNewPostMediaUrl(reader.result); // base64 preview
    };
    reader.readAsDataURL(file);`;

const replacement = `const uploadedUrl = await uploadToCloudinary(file);
    if (uploadedUrl) {
      setNewPostMediaUrl(uploadedUrl);
    } else {
      setSelectedImageFile(null);
    }`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  content = content.replace('const handleImageFileChange = (e) => {', 'const handleImageFileChange = async (e) => {');
  fs.writeFileSync(filePath, content);
  console.log("Successfully patched Community.jsx");
} else {
  console.log("Target string not found in Community.jsx");
}
