import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Internal API for chatting
  app.post("/api/chat", async (req, res) => {
    try {
      const { provider, model, messages, temperature, maxTokens } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      if (provider === "gemini") {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          return res.status(400).json({ error: "GEMINI_API_KEY is not set" });
        }

        const ai = new GoogleGenAI({ apiKey });
        
        let systemInstruction = undefined;
        let contents = [];
        
        // Map messages to Gemini format
        for (const msg of messages) {
          if (msg.role === 'system') {
            systemInstruction = {
               parts: [{ text: msg.content }]
            };
          } else {
             contents.push({
               role: msg.role === 'user' ? 'user' : 'model',
               parts: [{ text: msg.content }]
             });
          }
        }

        const response = await ai.models.generateContent({
          model: model || "gemini-1.5-flash",
          contents: contents,
          config: {
            systemInstruction,
            temperature: temperature ?? 0.7,
            maxOutputTokens: maxTokens ?? undefined,
          }
        });

        return res.json({ text: response.text });
      } else if (provider === "openrouter") {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
          return res.status(400).json({ error: "OPENROUTER_API_KEY is not set. Please configure it in the Secrets panel or .env file." });
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: model || "google/gemini-1.5-flash", // default fallback
            messages: messages,
            temperature: temperature ?? 0.7,
            max_tokens: maxTokens ?? undefined,
          })
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`OpenRouter API Error: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        return res.json({ text: data.choices[0].message.content });
      } else {
        return res.status(400).json({ error: "Unsupported provider" });
      }
    } catch (error: any) {
      console.error("Chat API Error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
