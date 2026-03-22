import { GoogleGenAI } from "@google/genai";
import fs from "fs";

async function generateImage() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: 'A sleek, abstract, dark purple and blue fluid gradient background, elegant, 4k resolution, professional aesthetic, minimalist, clean, smooth lighting',
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
      }
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64EncodeString = part.inlineData.data;
      fs.writeFileSync('public/loading-bg.jpg', Buffer.from(base64EncodeString, 'base64'));
      console.log('Image generated and saved to public/loading-bg.jpg');
    }
  }
}

generateImage().catch(console.error);
