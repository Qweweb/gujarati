const fs = require('fs');
const path = require('path');

const dir = 'd:/Antigravity/Gujarati/src/components/vcard/themes';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx') && f !== 'PaymentSection.jsx');

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Remove Business Hours
  content = content.replace(/\{\/\* \d+\. Business Hours \*\/\}[\s\S]*?(?=\{\/\* \d+\. (Testimonials|Reviews|Patient Reviews|Minimalist Reviews|QR Code Section) \*\/\}|Powered by Gujarati App)/i, '');

  // 2. Remove Testimonials/Reviews
  content = content.replace(/\{\/\* \d+\. (Testimonials|Reviews|Patient Reviews|Minimalist Reviews) \*\/\}[\s\S]*?(?=\{\/\* \d+\. (QR Code Section|Pure QR Code) \*\/\}|Powered by Gujarati App)/i, '');

  // 3. Remove QR Code Section
  content = content.replace(/\{\/\* \d+\. (QR Code Section|Pure QR Code) \*\/\}[\s\S]*?(?=<div[^>]*>[\s]*<p[^>]*>Powered by Gujarati App)/i, '');

  // 4. Remove qrcode.react import
  content = content.replace(/import \{ QRCodeSVG \} from 'qrcode\.react';\n?/g, '');

  // 5. Add PaymentSection import
  if (!content.includes('import PaymentSection')) {
    content = content.replace(/import React[^;]*;\n/, "$&\nimport PaymentSection from './PaymentSection';\n");
  }

  // 6. Inject PaymentSection before Powered by
  if (!content.includes('<PaymentSection')) {
    content = content.replace(/(<div[^>]*>[\s]*<p[^>]*>Powered by Gujarati App)/i, "<PaymentSection vcard={vcard} primaryColor={primaryColor || vcard.theme_colors?.primary || '#000'} />\n\n        ");
  }

  fs.writeFileSync(filePath, content);
  console.log('Patched ' + file);
}
