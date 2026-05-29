import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import GitaHub from '../src/components/GitaHub.jsx';

// Mock Web Speech API and localStorage
global.window = {
  speechSynthesis: {
    cancel: () => {},
    speak: () => {},
  },
  location: { href: 'http://localhost/' }
};
global.localStorage = {
  getItem: (key) => {
    if (key === 'gita_favorites') return JSON.stringify(['2_47', '3_8']);
    if (key === 'gita_challenge_completed') return JSON.stringify([1, 2, 3]);
    if (key === 'gita_streak') return '5';
    if (key === 'gita_challenge_day') return '4';
    if (key === 'gita_username') return '"Arjun"';
    return null;
  },
  setItem: (key, val) => {},
};

async function testRender() {
  console.log('Starting render tests...');
  const tabs = ['daily', 'situation', 'challenge', 'browse', 'meditate', 'krishna'];
  
  const originalUseState = React.useState;

  for (const tab of tabs) {
    try {
      console.log(`Testing tab: ${tab}...`);
      
      // Mock React.useState to force activeTab to be the target tab
      React.useState = (initialValue) => {
        if (initialValue === 'daily') {
          return [tab, () => {}];
        }
        return originalUseState(initialValue);
      };

      const html = renderToString(
        React.createElement(MemoryRouter, null, React.createElement(GitaHub, null))
      );
      
      // Find signature text in the rendered HTML to verify it's rendering the correct tab
      let indicator = 'unknown';
      if (html.includes('દૈનિક શ્લોક વાચન')) indicator = 'daily (દૈનિક શ્લોક)';
      if (html.includes('મારી મૂંઝવણ')) indicator = 'situation (મારી મૂંઝવણ)';
      if (html.includes('૧૮ દિવસ પડકાર') || html.includes('૧૮ દિવસ ગીતા પડકાર')) indicator = 'challenge (૧૮ દિવસ પડકાર)';
      if (html.includes('વિષય આધારિત જ્ઞાન')) indicator = 'browse (વિષય આધારિત)';
      if (html.includes('ગીતા ધ્યાન સત્ર')) indicator = 'meditate (ગીતા ધ્યાન)';
      if (html.includes('શ્રી કૃષ્ણ માર્ગદર્શન')) indicator = 'krishna (શ્રી કૃષ્ણ)';

      console.log(`Successfully rendered tab ${tab} (HTML length: ${html.length}) -> Detected: ${indicator}`);
    } catch (err) {
      console.error(`Crash on tab ${tab}:`, err);
    }
  }

  React.useState = originalUseState;
}

testRender();
