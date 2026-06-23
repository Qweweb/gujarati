const fs = require('fs');
const filePath = 'd:/Antigravity/Gujarati/src/components/vcard/VCardEditor.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const badFuncStart = content.indexOf('const handleImageUpload = async (e, fieldName, index = null, arrayName = null) => {');
const badFuncEnd = content.indexOf('reader.readAsDataURL(file);\n    };', badFuncStart) + 'reader.readAsDataURL(file);\n    };'.length;

if (badFuncStart !== -1 && badFuncEnd > badFuncStart) {
  const badFuncStr = content.substring(badFuncStart, badFuncEnd);
  
  const replacement = `const handleImageUpload = async (e, fieldName, index = null, arrayName = null) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('???? ????? ????? ???? (Image) ? ??????? ???.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 10MB.');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'gujarati_app');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/doyvfjcfg/image/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (data.secure_url) {
        const imageUrl = data.secure_url;
        if (arrayName === 'products') {
          const newProds = [...vcard.products];
          newProds[index][fieldName] = imageUrl;
          setVcard({ ...vcard, products: newProds });
        } else if (arrayName === 'gallery') {
          const newGall = [...vcard.gallery];
          newGall[index][fieldName] = imageUrl;
          setVcard({ ...vcard, gallery: newGall });
        } else {
          setVcard({ ...vcard, [fieldName]: imageUrl });
        }
      } else {
        alert('Upload Error: ' + (data.error?.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      alert('Upload failed. Please check internet connection.');
    }
  };`;
  
  content = content.replace(badFuncStr, replacement);
  console.log("Successfully replaced handleImageUpload.");
} else {
  console.log("Could not find bounds of handleImageUpload.");
}

// Fix EOF missing brace
if (content.indexOf('export default VCardEditor;') !== -1) {
    if (!content.includes('};\n\nexport default VCardEditor;')) {
        content = content.replace(/export default VCardEditor;/g, '};\n\nexport default VCardEditor;');
    }
}

fs.writeFileSync(filePath, content);
