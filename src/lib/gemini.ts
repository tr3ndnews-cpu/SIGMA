export async function generateContent(prompt: string, apiKey: string, schema?: any) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    ...(schema ? { generationConfig: { responseMimeType: "application/json", responseSchema: schema } } : {})
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API Error: ${res.status} - ${errText}`);
  }

  const data = await res.json();
  const text = data.candidates[0].content.parts[0].text;
  
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
  let lastError;
  const validKeys = apiKeys.filter(k => k.trim() !== '');
  
  if (validKeys.length === 0) {
    throw new Error("Tidak ada API Key yang dikonfigurasi. Silakan isi di menu Admin.");
  }

  for (const key of validKeys) {
    try {
      return await generateContent(prompt, key, schema);
    } catch (err) {
      console.warn("Key failed, trying next", err);
      lastError = err;
    }
  }
  
  throw lastError || new Error("Semua API Key gagal memproses permintaan.");
}
