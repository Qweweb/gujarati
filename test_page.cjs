const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Expose a binding to grab innerText
  try {
    await page.goto('http://localhost:5173/brick-breaker', { waitUntil: 'networkidle' });
    const rootHtml = await page.evaluate(() => document.getElementById('root').innerHTML);
    console.log('ROOT HTML:', rootHtml);
  } catch (e) {
    console.log('Nav error:', e);
  }
  await browser.close();
})();
