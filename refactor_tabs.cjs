const fs = require('fs');
const path = require('path');

const baseDir = 'd:/Antigravity/Gujarati/src';

// 1. App.jsx
const appFile = path.join(baseDir, 'App.jsx');
let appContent = fs.readFileSync(appFile, 'utf8');
if (!appContent.includes('import MariSociety')) {
  appContent = appContent.replace(
    "import Community from './components/Community';",
    "import Community from './components/Community';\nimport MariSociety from './components/MariSociety';\nimport EnglishZone from './components/EnglishZone';"
  );
}
if (!appContent.includes('path="/society"')) {
  appContent = appContent.replace(
    '<Route path="/games" element={<RamatoHub />} />',
    '<Route path="/games" element={<RamatoHub />} />\n          <Route path="/society" element={<MariSociety />} />\n          <Route path="/english" element={<EnglishZone />} />'
  );
}
fs.writeFileSync(appFile, appContent, 'utf8');

// 2. Community.jsx
const commFile = path.join(baseDir, 'components', 'Community.jsx');
let commContent = fs.readFileSync(commFile, 'utf8');

// Remove imports
commContent = commContent.replace(/import MariSociety from '\.\/MariSociety';\r?\n/, '');
commContent = commContent.replace(/import EnglishZone from '\.\/EnglishZone';\r?\n/, '');

// Replace buttons onClick
commContent = commContent.replace(
  /onClick=\{\(\) => setActiveTab\('society'\)\}/g,
  "onClick={() => navigate('/society')}"
);
commContent = commContent.replace(
  /onClick=\{\(\) => setActiveTab\('english'\)\}/g,
  "onClick={() => navigate('/english')}"
);

// Remove Society Tab Block
const societyTabStart = commContent.indexOf('{/* SOCIETY MANAGEMENT TAB */}');
if (societyTabStart !== -1) {
  const directoryTabStart = commContent.indexOf('{/* 2. LOCAL DIRECTORY TAB */}');
  if (directoryTabStart !== -1) {
    commContent = commContent.slice(0, societyTabStart) + commContent.slice(directoryTabStart);
  }
}

// Remove English Zone Tab Block
const englishTabStart = commContent.indexOf('{/* 4C. ENGLISH ZONE TAB */}');
if (englishTabStart !== -1) {
  const drawersStart = commContent.indexOf('{/* 5. DRAWERS & MODALS */}');
  if (drawersStart !== -1) {
    commContent = commContent.slice(0, englishTabStart) + commContent.slice(drawersStart);
  }
}
fs.writeFileSync(commFile, commContent, 'utf8');

// 3. EnglishZone.jsx
const engFile = path.join(baseDir, 'components', 'EnglishZone.jsx');
let engContent = fs.readFileSync(engFile, 'utf8');
if (!engContent.includes("import { useNavigate }")) {
  engContent = engContent.replace(
    "import { useState, useEffect, useRef } from 'react';",
    "import { useState, useEffect, useRef } from 'react';\nimport { useNavigate } from 'react-router-dom';"
  );
}
if (!engContent.includes("const navigate = useNavigate();")) {
  engContent = engContent.replace(
    "export default function EnglishZone({ onBack }) {\n  const [xp",
    "export default function EnglishZone({ onBack }) {\n  const navigate = useNavigate();\n  const [xp"
  );
}
engContent = engContent.replace(
  "      onBack();",
  "      if (onBack) onBack(); else navigate('/community');"
);
fs.writeFileSync(engFile, engContent, 'utf8');

// 4. MariSociety.jsx
const socFile = path.join(baseDir, 'components', 'MariSociety.jsx');
let socContent = fs.readFileSync(socFile, 'utf8');
if (!socContent.includes("import { useNavigate }")) {
  socContent = socContent.replace(
    "import React, { useState, useEffect, useRef } from 'react';",
    "import React, { useState, useEffect, useRef } from 'react';\nimport { useNavigate } from 'react-router-dom';"
  );
}
if (!socContent.includes("const navigate = useNavigate();")) {
  socContent = socContent.replace(
    "export default function MariSociety() {\n  const canvasRef",
    "export default function MariSociety() {\n  const navigate = useNavigate();\n  const canvasRef"
  );
}

// Inject back button in onboarding
if (!socContent.includes("navigate('/community')") && socContent.includes("મારી સોસાયટી</h1>")) {
  socContent = socContent.replace(
    '<div className="text-center space-y-2">',
    '<div className="absolute top-6 left-6 z-50">\n          <button onClick={() => navigate(\'/community\')} className="h-9 px-3 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-lg flex items-center gap-1 font-gujarati text-[10px] font-bold text-stone-600 dark:text-stone-300 transition shadow-sm">\n            <span className="material-symbols-outlined text-xs">arrow_back</span> પાછા જાઓ\n          </button>\n        </div>\n        <div className="text-center space-y-2">'
  );
}

// Inject back button in main render
if (socContent.includes('<div className="space-y-6 pb-8">')) {
  // ensure we only replace the first occurrence or just make it specific
  socContent = socContent.replace(
    '<div className="space-y-6 pb-8">\n      <canvas ref={canvasRef} className="hidden" />',
    '<div className="space-y-6 pb-8">\n      <div className="mb-2">\n        <button onClick={() => navigate(\'/community\')} className="h-9 px-3 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-lg flex items-center gap-1 font-gujarati text-[10px] font-bold text-stone-600 dark:text-stone-300 transition shadow-sm w-fit">\n          <span className="material-symbols-outlined text-xs">arrow_back</span> પાછા જાઓ\n        </button>\n      </div>\n      <canvas ref={canvasRef} className="hidden" />'
  );
}

fs.writeFileSync(socFile, socContent, 'utf8');

console.log("Refactoring complete");
