# Conversation History - 2026-05-25 23:37:02
- **Conversation ID:** `6e8282eb-7105-4d90-bd17-92a7fe901110`
- **Date/Time:** 2026-05-25 23:37:02
- **Project:** `Gujarati`

## Transcript
---
### 👤 User
Create the file `d:\Antigravity\Gujarati\src\utils\aiService.js` with Overwrite=true.

This file provides a unified AI API service that supports multiple AI providers. The config is stored in localStorage under key `gujarati_ai_config`.

Write this complete file:

```javascript
// ============================================
// Unified AI Service — Multi-Provider Support
// Supports: Gemini, OpenAI, Anthropic, Groq,
// Ollama, OpenRouter, Custom OpenAI-compatible
// ============================================

const STORAGE_KEY = 'gujarati_ai_config';

export const AI_PROVIDERS = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    emoji: '✨',
    tag: 'Free tier available',
    tagColor: 'emerald',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    apiKeyUrl: 'https://aistudio.google.com/app/apikey',
    models: [
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Fast + Free)', recommended: true },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Best Quality)' },
      { id: 'gemini-pro', name: 'Gemini Pro (Stable)' },
    ],
    costNote: '~Free (60 RPM on free tier)',
    requiresApiKey: true,
  },
  {
    id: 'openai',
    name: 'OpenAI / ChatGPT',
    emoji: '🤖',
    tag: 'Paid',
    tagColor: 'blue',
    baseUrl: 'https://api.openai.com/v1',
    apiKeyUrl: 'https://platform.openai.com/api-keys',
    models: [
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Fast & Cheap)', recommended: true },
      { id: 'gpt-4o', name: 'GPT-4o (Best Quality)' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo (Budget)' },
    ],
    costNote: '~₹0.10-0.50 per conversation',
    requiresApiKey: true,
  },
  {
    id: 'anthropic',
    name: 'Anthropic / Claude',
    emoji: '🧠',
    tag: 'Paid',
    tagColor: 'orange',
    baseUrl: 'https://api.anthropic.com/v1',
    apiKeyUrl: 'https://console.anthropic.com/',
    models: [
      { id: 'claude-3-5-haiku-202
<truncated 7829 bytes>
etch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Anthropic error: ${res.status}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text || 'ક્ષમા કરો, જવાબ મળ્યો નહીં.';
}

async function callOllama(config, messages) {
  const baseUrl = config.baseUrl || 'http://localhost:11434';
  const model = config.model || 'llama3.2';
  const url = `${baseUrl}/api/chat`;

  const body = {
    model,
    messages: [
      { role: 'system', content: DADI_MA_SYSTEM_PROMPT },
      ...messages
    ],
    stream: false,
    options: { temperature: 0.7, num_predict: 512 }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) throw new Error(`Ollama error: ${res.status}. Is Ollama running?`);

  const data = await res.json();
  return data.message?.content || 'ક્ષમા કરો, જવાબ મળ્યો નહીં.';
}

export async function testAIConnection(config) {
  const testMsg = 'નમસ્તે! તું ઠીક છો? ટૂંકમાં ૧ line જ ગુજરાતીમાં જ કહ.';
  const savedConfig = getAIConfig();
  saveAIConfig({ ...config, enabled: true });
  try {
    const response = await callDadiMaAI(testMsg, []);
    saveAIConfig(savedConfig);
    return { success: true, response };
  } catch (err) {
    saveAIConfig(savedConfig);
    return { success: false, error: err.message };
  }
}

export default { callDadiMaAI, getAIConfig, saveAIConfig, isAIConfigured, testAIConnection, AI_PROVIDERS };
```

Write this exact complete file.
