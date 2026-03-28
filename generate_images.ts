import { GoogleGenAI } from "@google/genai";

async function generateImages() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompts = [
    {
      id: "hijrah",
      prompt: "A 3D felt fuzzy miniature illustration of the Prophet's Mosque (Al-Masjid an-Nabawi) in Medina, soft textures, vibrant colors, cute and spiritual atmosphere, high detail, studio lighting"
    },
    {
      id: "haji",
      prompt: "A 3D felt fuzzy miniature illustration of the Kaaba in Mecca, soft textures, vibrant colors, cute and spiritual atmosphere, high detail, studio lighting"
    },
    {
      id: "ibrahim",
      prompt: "A 3D felt fuzzy miniature illustration of a cute goat in a desert landscape with a small palm tree, soft textures, vibrant colors, cute and spiritual atmosphere, high detail, studio lighting"
    }
  ];

  const results = {};

  for (const p of prompts) {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: p.prompt }],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        results[p.id] = `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  
  console.log(JSON.stringify(results));
}

generateImages();
