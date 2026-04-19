export async function generateContent(prompt: string, apiKey: string, schema?: any, settingsStr?: string) {
  let settings: any = {};
  try {
    settingsStr = settingsStr || localStorage.getItem('rppAdminSettings') || '{}';
    settings = JSON.parse(settingsStr);
  } catch (e) {
    console.error("Failed to parse settings", e);
  }

  const isGemini = settings.activeProvider !== 'openrouter';
  
  if (!apiKey && isGemini) {
     throw new Error("API Key tidak diisi.");
  }

  const aiTemperature = settings.aiTemperature ?? 0.7;
  const aiMaxTokens = settings.aiMaxTokens ?? 2000;

  if (isGemini) {
    const model = settings.geminiModel || "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    // Convert JSON schema to Gemini's format if present
    // Note: this implementation simplifies schema for basic usage
    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: aiTemperature,
        maxOutputTokens: aiMaxTokens,
        ...(schema ? { responseMimeType: "application/json", responseSchema: schema } : {})
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API Error: ${res.status} - ${errText}`);
    }

    const data = await res.json();
    const text = data.candidates[0].content.parts[0].text;
    
    return parseIfSchema(text, schema);
  } else {
    // OpenRouter
    const orKey = settings.openRouterApiKey;
    if (!orKey) {
       throw new Error("OpenRouter API Key belum dikonfigurasi di Admin.");
    }
    const model = settings.openRouterModel || "google/gemini-2.5-flash";
    const url = `https://openrouter.ai/api/v1/chat/completions`;
    
    // For OpenRouter, Structured Outputs are supported but usually require standard JSON parsing
    const messages = [];
    if (schema) {
      messages.push({ role: 'system', content: 'You must output strict JSON that matches the requested schema. Return ONLY valid JSON, do not wrap in markdown blocks.' });
    }
    messages.push({ role: 'user', content: prompt });

    const payload = {
      model: model,
      messages: messages,
      temperature: aiTemperature,
      max_tokens: aiMaxTokens,
      ...(schema ? { response_format: { type: "json_object" } } : {})
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${orKey}`,
        'HTTP-Referer': window.location.href, // Recommended for OpenRouter
        'X-Title': 'SIGMA AI' // Recommended for OpenRouter
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenRouter API Error: ${res.status} - ${errText}`);
    }

    const data = await res.json();
    const text = data.choices[0].message.content;
    
    return parseIfSchema(text, schema);
  }
}

function parseIfSchema(text: string, schema: any) {
  if (schema) {
    try {
      return JSON.parse(text);
    } catch (e) {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    }
  }
  return text;
}

export async function generateContentWithFailover(prompt: string, apiKeys: string[], schema?: any) {
  let settings: any = {};
  try {
    const saved = localStorage.getItem('rppAdminSettings');
    if (saved) settings = JSON.parse(saved);
  } catch (e) { }

  if (settings.activeProvider === 'openrouter') {
    // For OpenRouter, we just call it once without the key failover loop
    return await generateContent(prompt, "", schema, JSON.stringify(settings));
  }

  let lastError;
  const validKeys = apiKeys.filter(k => k.trim() !== '');
  
  if (validKeys.length === 0) {
    throw new Error("Tidak ada API Key Gemini yang dikonfigurasi. Silakan isi di menu Admin.");
  }

  const settingsStr = JSON.stringify(settings);
  for (const key of validKeys) {
    try {
      return await generateContent(prompt, key, schema, settingsStr);
    } catch (err) {
      console.warn("Key failed, trying next", err);
      lastError = err;
    }
  }
  
  throw lastError || new Error("Semua API Key gagal memproses permintaan.");
}
