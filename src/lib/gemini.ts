export async function generateContent(prompt: string, apiKey: string, schema?: any, settingsStr?: string) {
  let settings: any = {};
  try {
    settingsStr = settingsStr || localStorage.getItem('rppAdminSettings') || '{}';
    settings = JSON.parse(settingsStr);
  } catch (e) {
    console.error("Failed to parse settings", e);
  }

  if (!apiKey) {
     throw new Error("API Key Gemini tidak diisi.");
  }

  const aiTemperature = settings.aiTemperature ?? 0.7;
  const aiMaxTokens = settings.aiMaxTokens ?? 2000;
  const model = settings.geminiModel || "gemini-1.5-flash";
  
  // Enforce valid models if user inputs an invalid string by accident that might 404
  const validModel = model.includes('gemini') ? model : 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${validModel}:generateContent?key=${apiKey}`;
  
  // Convert JSON schema to Gemini's format if present
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

  let lastError;
  const validKeys = apiKeys.filter(k => k.trim() !== '');
  
  if (validKeys.length === 0) {
    throw new Error("Tidak ada API Key Gemini yang dikonfigurasi. Silakan simpan melalui menu Admin dari Supabase.");
  }

  const settingsStr = JSON.stringify(settings);
  for (const key of validKeys) {
    try {
      return await generateContent(prompt, key, schema, settingsStr);
    } catch (err: any) {
      console.warn("Key failed, trying next", err);
      // Wait for 1 second between retry if needed, but since it's failing to key limits, just failover immediately.
      lastError = err;
    }
  }
  
  throw lastError || new Error("Semua API Key yang tersedia di Supabase gagal memproses permintaan. Mungkin limit kuota API tercapai.");
}
