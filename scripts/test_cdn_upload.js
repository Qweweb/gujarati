import fs from 'fs';
import path from 'path';

const testFile = 'C:\\Users\\alpha\\Music\\mantra\\Om Namah Shivaya.mp3';

async function testUpload() {
  const formData = new FormData();
  formData.append('reqtype', 'fileupload');
  formData.append('fileToUpload', new Blob([fs.readFileSync(testFile)]), 'Om_Namah_Shivaya.mp3');

  try {
    const res = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: formData
    });
    const url = await res.text();
    console.log('Catbox Upload Result URL:', url);
  } catch (e) {
    console.error('Catbox upload error:', e);
  }
}

testUpload();
