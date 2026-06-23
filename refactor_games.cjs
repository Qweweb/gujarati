const fs = require('fs');

// 1. Update RamatoHub.jsx
let ramatoContent = fs.readFileSync('src/components/RamatoHub.jsx', 'utf8');
if (!ramatoContent.includes('getOtloLocation')) {
  ramatoContent = ramatoContent.replace(
    "import KbcQuizGame from './KbcQuizGame';",
    "import KbcQuizGame from './KbcQuizGame';\nimport { getOtloLocation } from '../utils/otlo_helper';"
  );
  ramatoContent = ramatoContent.replace(
    "export default function RamatoHub({ userLocation, onBack }) {",
    "export default function RamatoHub({ userLocation, onBack }) {\n  const finalUserLocation = userLocation || getOtloLocation();"
  );
  ramatoContent = ramatoContent.replace(
    "<GameWrapper gameId={activeGame} onClose={() => setActiveGame(null)} userLocation={userLocation} />",
    "<GameWrapper gameId={activeGame} onClose={() => setActiveGame(null)} userLocation={finalUserLocation} />"
  );
  // Also onBack might not be provided, so handle onBack={onBack} gracefully or hide the back button if not there (it already has {onBack && ...})
  fs.writeFileSync('src/components/RamatoHub.jsx', ramatoContent);
}

// 2. Update Community.jsx
let commContent = fs.readFileSync('src/components/Community.jsx', 'utf8');
// Change setActiveTab('games') to navigate('/games') for the click handler
commContent = commContent.replace(
  "onClick={() => setActiveTab('games')}",
  "onClick={() => navigate('/games')}"
);
// Remove RamatoHub import and usage from Community
commContent = commContent.replace("import RamatoHub from './RamatoHub';\n", "");
commContent = commContent.replace(
  /{activeTab === "games" && \(\s*<RamatoHub userLocation={userLocation} onBack={\(\) => setActiveTab\("feed"\)} \/>\s*\)}/g,
  ""
);
// Remove from the allowed inner sections array
commContent = commContent.replace(
  "{['feed', 'directory', 'leaderboard', 'sabha', 'games', 'english'].includes(activeTab) && (",
  "{['feed', 'directory', 'leaderboard', 'sabha', 'english'].includes(activeTab) && ("
);
// Make sure 'games' is removed from wherever it might be in array
commContent = commContent.replace(
  /\['feed', 'directory', 'leaderboard', 'sabha', 'games', 'english'\]/,
  "['feed', 'directory', 'leaderboard', 'sabha', 'english']"
);

fs.writeFileSync('src/components/Community.jsx', commContent);

// 3. Update App.jsx
let appContent = fs.readFileSync('src/App.jsx', 'utf8');
if (!appContent.includes('RamatoHub')) {
  appContent = appContent.replace(
    "import AdminDashboard from './components/AdminDashboard';",
    "import AdminDashboard from './components/AdminDashboard';\nimport RamatoHub from './components/RamatoHub';"
  );
  appContent = appContent.replace(
    '<Route path="/rewards" element={<ScratchRewards />} />',
    '<Route path="/rewards" element={<ScratchRewards />} />\n          <Route path="/games" element={<RamatoHub />} />'
  );
  fs.writeFileSync('src/App.jsx', appContent);
}

console.log("Refactoring complete");
