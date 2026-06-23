const fs = require('fs');
const filePath = 'd:/Antigravity/Gujarati/src/components/Community.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const regex = /const handleImageFileChange = \(e\) => \{\s*const file = e\.target\.files\?\.\[0\];\s*if \(\!file\) return;\s*if \(\!file\.type\.startsWith\('image\/'\)\) \{\s*alert\('[^']+'\);\s*return;\s*\}\s*if \(file\.size > \d+ \* 1024 \* 1024\) \{\s*alert\('[^']+'\);\s*return;\s*\}\s*setSelectedImageFile\(file\);\s*const reader = new FileReader\(\);\s*reader\.onloadend = \(\) => \{\s*setNewPostMediaUrl\(reader\.result\);[^\}]*\}\s*reader\.readAsDataURL\(file\);\s*\};/m;

const replacement = `const handleImageFileChange = async (e) => {
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

if (content.match(regex)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync(filePath, content);
  console.log("Successfully patched Community.jsx");
} else {
  console.log("Regex did not match Community.jsx");
}
