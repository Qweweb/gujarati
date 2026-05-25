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
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku (Fast & Cheap)', recommended: true },
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (Best)' },
      { id: 'claude-opus-4-5', name: 'Claude Opus 4 (Premium)' },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku (Budget)' },
    ],
    costNote: '~₹0.20-0.80 per conversation',
    requiresApiKey: true,
  },
  {
    id: 'groq',
    name: 'Groq (Ultra Fast)',
    emoji: '⚡',
    tag: 'Free tier available',
    tagColor: 'emerald',
    baseUrl: 'https://api.groq.com/openai/v1',
    apiKeyUrl: 'https://console.groq.com/keys',
    models: [
      { id: 'llama-3.1-8b-instant', name: 'LLaMA 3.1 8B Instant (Ultra Fast)', recommended: true },
      { id: 'llama-3.3-70b-versatile', name: 'LLaMA 3.3 70B Versatile (Best)' },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B (Balanced)' },
      { id: 'gemma2-9b-it', name: 'Gemma 2 9B (Google)' },
    ],
    costNote: '~Free (6000 tokens/min free tier)',
    requiresApiKey: true,
  },
  {
    id: 'ollama',
    name: 'Ollama (Local / Offline)',
    emoji: '🏠',
    tag: '100% Free & Private',
    tagColor: 'emerald',
    baseUrl: 'http://localhost:11434/api',
    apiKeyUrl: 'https://ollama.ai',
    models: [
      { id: 'llama3.2', name: 'LLaMA 3.2 (Best for Gujarati)', recommended: true },
      { id: 'gemma2', name: 'Gemma 2 (Google)' },
      { id: 'mistral', name: 'Mistral 7B' },
      { id: 'qwen2.5', name: 'Qwen 2.5 (Multi-language)' },
    ],
    costNote: '100% FREE — runs on your computer',
    requiresApiKey: false,
  },
  {
    id: 'openrouter',
    name: 'OpenRouter (100+ Models)',
    emoji: '🌐',
    tag: 'Best Selection',
    tagColor: 'purple',
    baseUrl: 'https://openrouter.ai/api/v1',
    apiKeyUrl: 'https://openrouter.ai/keys',
    models: [
      { id: 'google/gemini-flash-1.5', name: 'Gemini Flash 1.5 (Free)', recommended: true },
      { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'LLaMA 3.1 8B (Free)' },
      { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku' },
      { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini' },
      { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B (Free)' },
    ],
    costNote: 'Many free models available',
    requiresApiKey: true,
  },
  {
    id: 'custom',
    name: 'Custom / OpenAI-Compatible',
    emoji: '⚙️',
    tag: 'Advanced',
    tagColor: 'stone',
    baseUrl: '',
    apiKeyUrl: '',
    models: [
      { id: 'custom-model', name: 'Custom Model ID', recommended: true },
    ],
    costNote: 'Depends on provider',
    requiresApiKey: false,
  },
];

const DADI_MA_SYSTEM_PROMPT = `તું ગુજરાતી દાદી-મા છો — ૮૦ વર્ષ ની અનુભવી, પ્રેમાળ, જ્ઞાની.

નિયમો:
1. ફક્ત ગુજરાતી ભાષામાં જ જવાબ આપ
2. "બેટા" અથવા "દીકરા" કહીને address કર
3. આયુર્વેદિક + ઘરેલુ નુસ્ખા આપ
4. સરળ, practical, ઘરે મળે એવી ચીજો જ use કર
5. ગંભીર બીમારી માટે: "ડૉક્ટરને જરૂર બતાવો" ઉમેર
6. મહત્તમ ૫-૭ lines નો જ જવાબ
7. ૨-૩ specific remedies mention કર, quantities સાથે
8. Warm, caring tone — દાદી-મા ની style
9. Emoji use કર (🌿 🥛 🫚 🍋 etc.) ingredients માટે
10. **Bold** important ingredients/words`;

export function getAIConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    provider: '',
    apiKey: '',
    model: '',
    baseUrl: '',
    enabled: false,
  };
}

export function saveAIConfig(config) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function isAIConfigured() {
  const config = getAIConfig();
  if (!config.provider || !config.enabled) return false;
  const provider = AI_PROVIDERS.find(p => p.id === config.provider);
  if (!provider) return false;
  if (provider.requiresApiKey && !config.apiKey) return false;
  if (provider.id === 'custom' && !config.baseUrl) return false;
  return true;
}

export async function callDadiMaAI(userMessage, conversationHistory = []) {
  const config = getAIConfig();
  if (!config.provider || !config.enabled) {
    throw new Error('AI not configured');
  }

  const provider = AI_PROVIDERS.find(p => p.id === config.provider);
  if (!provider) throw new Error('Unknown provider');

  const messages = [
    ...conversationHistory.slice(-8).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    })),
    { role: 'user', content: userMessage }
  ];

  if (config.provider === 'gemini') {
    return await callGemini(config, messages, userMessage);
  } else if (config.provider === 'anthropic') {
    return await callAnthropic(config, messages);
  } else if (config.provider === 'ollama') {
    return await callOllama(config, messages);
  } else {
    // OpenAI-compatible: openai, groq, openrouter, custom
    return await callOpenAICompatible(config, provider, messages);
  }
}

async function callGemini(config, messages, userMessage) {
  const model = config.model || 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`;

  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const body = {
    system_instruction: { parts: [{ text: DADI_MA_SYSTEM_PROMPT }] },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 512,
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || 'Gemini API error');
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'ક્ષમા કરો, જવાબ મળ્યો નહીં.';
}

async function callOpenAICompatible(config, provider, messages) {
  const baseUrl = config.provider === 'custom' ? config.baseUrl : provider.baseUrl;
  const url = `${baseUrl}/chat/completions`;
  const model = config.model || provider.models[0].id;

  const headers = {
     'Content-Type': 'application/json',
    ...(config.apiKey ? { 'Authorization': `Bearer ${config.apiKey}` } : {}),
    ...(config.provider === 'anthropic' ? { 'x-api-key': config.apiKey, 'anthropic-version': '2023-06-01' } : {}),
    ...(config.provider === 'openrouter' ? {
      'HTTP-Referer': window.location.origin,
      'X-Title': 'ગુજરાતી App — દાદી-મા'
    } : {})
  };

  const body = {
    model,
    messages: [
      { role: 'system', content: DADI_MA_SYSTEM_PROMPT },
      ...messages
    ],
    max_tokens: 512,
    temperature: 0.7,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error: ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'ક્ષમા કરો, જવાબ મળ્યો નહીં.';
}

async function callAnthropic(config, messages) {
  const model = config.model || 'claude-3-5-haiku-20241022';
  const url = 'https://api.anthropic.com/v1/messages';

  const body = {
    model,
    max_tokens: 512,
    system: DADI_MA_SYSTEM_PROMPT,
    messages: messages.filter(m => m.role !== 'system'),
  };

  const res = await fetch(url, {
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
