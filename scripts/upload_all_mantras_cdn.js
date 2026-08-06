import fs from 'fs';
import path from 'path';

const folderPath = 'C:\\Users\\alpha\\Music\\mantra';

// Map mantra ID / names to their exact filename in C:\Users\alpha\Music\mantra
const fileMantraMap = {
  'Om_Namah_Shivaya': 'Om Namah Shivaya.mp3',
  'Mahamrityunjaya_Mantra': 'Mahamrityunjaya Mantra.mp3',
  'Shiva_Gayatri_Mantra': 'Shiva Gayatri Mantra.mp3',
  'Rudra_Beej_Mantra': 'Rudra Beej Mantra.mp3',
  
  'Shri_Ram_Jai_Ram': 'Shri Ram Jai Ram.mp3',
  'Ram_Tarak_Mantra': 'Ram Tarak Mantra.mp3',
  'Ram_Gayatri_Mantra': 'Ram Gayatri Mantra.mp3',
  
  'Hanuman_Beej_Mantra': 'Hanuman Beej Mantra.mp3',
  'Manojavam_Stotra_Mantra': 'Manojavam Stotra Mantra.mp3',
  'Sankat_Nashak_Hanuman_Mantra': 'Sankat Nashak Hanuman Mantra.mp3',
  
  'Navarna_Mantra': 'Navarna Mantra (Chamunda Mantra).mp3',
  'Gayatri_Mahamantra': 'Gayatri Mahamantra.mp3',
  'Mahalakshmi_Beej_Mantra': 'Mahalakshmi Beej Mantra.mp3',
  'Sarva_Mangala_Mangalye': 'Sarva Mangala Mangalye Shloka.mp3',
  
  'Hare_Krishna_Mahamantra': 'Hare Krishna Mahamantra.mp3',
  'Vasudev_Mantra': 'Vasudev Mantra.mp3',
  'Shri_Krishna_Sharanam_Mama': 'Shri Krishna Sharanam Mama.mp3',
  
  'Swaminarayan_Mahamantra': 'Ganesh Beej Swaminarayan Mahamantra.mp3', // Note exact filename in folder
  'Shri_Swaminarayan_Mantra': 'Shri Swaminarayan Mantra.mp3',
  
  'Ganesh_Beej_Mantra': 'Ganesh Beej Mantra.mp3',
  'Vakratunda_Mahakaya_Shloka': 'Vakratunda Mahakaya Shloka.mp3',
  'Ganesh_Gayatri_Mantra': 'Ganesh Gayatri Mantra.mp3',
  
  'Surya_Gayatri_Mantra': 'Surya Gayatri Mantra.mp3',
  'Surya_Beej_Mantra': 'Surya Beej Mantra.mp3',
  'Shani_Beej_Mantra': 'Shani Beej Mantra.mp3',
  'Rahu_Beej_Mantra': 'Rahu Beej Mantra.mp3',
  'Ketu_Beej_Mantra': 'Ketu Beej Mantra.mp3',
  'Navgrah_Pidahai_Mantra': 'Navgrah Pidahai Mantra.mp3'
};

async function uploadAll() {
  console.log('Starting upload of all MP3 files to Catbox Audio CDN...');
  
  const results = {};
  const filesInFolder = fs.readdirSync(folderPath);

  for (const [key, filename] of Object.entries(fileMantraMap)) {
    const fullPath = path.join(folderPath, filename);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`[SKIP] File not found: '${filename}'`);
      continue;
    }

    console.log(`Uploading '${filename}'...`);
    const fileBuffer = fs.readFileSync(fullPath);
    
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', new Blob([fileBuffer]), filename);

    try {
      const res = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: formData
      });
      const url = (await res.text()).trim();
      console.log(`SUCCESS [${key}]: ${url}`);
      results[key] = url;
    } catch (err) {
      console.error(`ERROR uploading ${filename}:`, err);
    }
  }

  console.log('\n--- ALL UPLOADS COMPLETED ---');
  console.log(JSON.stringify(results, null, 2));

  // Save generated mapping to JSON file
  const outputPath = path.join(process.cwd(), 'src', 'utils', 'mantra_online_urls.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`Saved online MP3 mapping to: ${outputPath}`);
}

uploadAll().catch(console.error);
