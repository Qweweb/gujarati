import https from 'https';

https.get('https://gujaratiapp.in', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('HTML length fetched:', data.length);
    const hasClarity = data.includes('x59mc0a99f');
    console.log('Does HTML contain Microsoft Clarity ID x59mc0a99f?', hasClarity);
    if (hasClarity) {
      console.log('Verification Success: Microsoft Clarity tag found in live HTML!');
    } else {
      console.log('Verification Failure: Clarity tag not found in live HTML.');
    }
  });
}).on('error', (err) => {
  console.error('Error fetching live website:', err.message);
});
