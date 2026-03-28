import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  try {
    console.log('Generating hero image...');
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: [
          {
            text: 'A highly attractive, cinematic 16:9 banner image representing "Innovative YouTube AI". The image MUST prominently feature the exact Korean text "혁신 유튜브 AI" in bold, glowing, modern typography. The tone and manner should be high-tech, neon, cyberpunk, or sleek modern AI studio, with glowing play buttons, neural network nodes, and a dynamic composition.',
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64Data = part.inlineData.data;
        const dir = path.join(process.cwd(), 'public');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        fs.writeFileSync(path.join(dir, 'hero-banner.png'), Buffer.from(base64Data, 'base64'));
        console.log('Image saved to public/hero-banner.png');
        break;
      }
    }
  } catch (e) {
    console.error('Error generating image:', e);
    process.exit(1);
  }
}
run();
