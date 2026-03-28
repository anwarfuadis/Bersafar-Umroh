import { GoogleGenAI } from "@google/genai";

export async function generateArticleImages() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompts = [
    "A 3D felt fuzzy miniature illustration of the Prophet's Mosque (Al-Masjid an-Nabawi) in Medina, soft textures, vibrant colors, cute and spiritual atmosphere, high detail, studio lighting",
    "A 3D felt fuzzy miniature illustration of the Kaaba in Mecca, soft textures, vibrant colors, cute and spiritual atmosphere, high detail, studio lighting",
    "A 3D felt fuzzy miniature illustration of a cute goat in a desert landscape with a small palm tree, soft textures, vibrant colors, cute and spiritual atmosphere, high detail, studio lighting"
  ];

  const images = [];

  for (const prompt of prompts) {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        images.push(`data:image/png;base64,${part.inlineData.data}`);
      }
    }
  }
  
  return images;
}
