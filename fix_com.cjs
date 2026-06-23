const fs = require('fs');
const filePath = 'd:/Antigravity/Gujarati/src/components/Community.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Find handleImageFileChange
const targetFunc = `  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert(' _  ?"  ?  ?r?o _? ,,  <.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('<Y< 5MB ? "_"< 1<?< o<^?.');
      return;
    }
    setSelectedImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPostMediaUrl(reader.result); // base64 preview
    };
    reader.readAsDataURL(file);
  };`;

const targetFunc2 = `  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('\u0a95\u0ac3\u0aaa\u0abe \u0a95\u0ab0\u0ac0\u0aa8\u0ac7 \u0aae\u0abe\u0aa4\u0acd\u0ab0 \u0aab\u0acb\u0a9f\u0acb (Image) \u0a9c \u0ab8\u0abf\u0ab2\u0ac7\u0a95\u0acd\u0a9f \u0a95\u0ab0\u0acb.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('\u0aab\u0acb\u0a9f\u0acb 5MB \u0aa5\u0ac0 \u0aa8\u0abe\u0aa8\u0acb \u0ab9\u0acb\u0ab5\u0acb \u0a9c\u0acb\u0a88\u0a8f.');
      return;
    }
    setSelectedImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPostMediaUrl(reader.result); // base64 preview
    };
    reader.readAsDataURL(file);
  };`;

const replacement = `  const handleImageFileChange = async (e) => {
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
    
    // Create a temporary local preview immediately so UI doesn't freeze
    const localUrl = URL.createObjectURL(file);
    setNewPostMediaUrl(localUrl);

    const uploadedUrl = await uploadToCloudinary(file);
    if (uploadedUrl) {
      setNewPostMediaUrl(uploadedUrl); // Replace with real URL
    } else {
      setSelectedImageFile(null);
      setNewPostMediaUrl('');
    }
  };`;

// we can just use substring to replace
const startStr = "const handleImageFileChange = (e) => {";
const endStr = "reader.readAsDataURL(file);\n  };";
const idxStart = content.indexOf(startStr);
const idxEnd = content.indexOf(endStr, idxStart);

if (idxStart !== -1 && idxEnd !== -1) {
  const toReplace = content.substring(idxStart, idxEnd + endStr.length);
  content = content.replace(toReplace, replacement);
  fs.writeFileSync(filePath, content);
  console.log("Community.jsx updated successfully.");
} else {
  console.log("Could not find exact block in Community.jsx");
}
