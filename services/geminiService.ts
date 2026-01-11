import { GoogleGenAI, Type } from "@google/genai";
import { CafeDetails } from "../types";

const apiKey = process.env.API_KEY;

// Helper to get a random color for avatars
const getRandomColor = () => {
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const generateCafeData = async (query: string): Promise<CafeDetails> => {
  if (!apiKey) throw new Error("API Key not found");
  
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    You are a data generator for "Latteboxd", a Letterboxd-style website for cafes.
    User Query: "${query}"
    
    Generate a detailed profile for this cafe. If the cafe is real, use real data. If it's generic (e.g. "Cyberpunk Cafe"), invent creative details.
    
    Include:
    1. Name, Location, Year Est.
    2. A "synopsis" (description) written like a movie plot summary.
    3. 4 distinct reviews from different personas (e.g., The Coffee Snob, The Student, The Tourist, The Regular).
       - Reviews should be witty, passionate, or critical, mimicking Letterboxd style.
    4. A visual description for an image generation prompt (posterPrompt).
    5. Tags (e.g. "Pour-over", "Noir", "Expensive").
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          location: { type: Type.STRING },
          yearEstablished: { type: Type.STRING },
          description: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          averageRating: { type: Type.NUMBER, description: "Average rating out of 5" },
          posterPrompt: { type: Type.STRING, description: "A detailed visual description of the cafe for an image generator. Focus on lighting, mood, and composition." },
          reviews: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                reviewerName: { type: Type.STRING },
                rating: { type: Type.NUMBER, description: "Rating out of 5, can be decimal like 3.5" },
                text: { type: Type.STRING },
                date: { type: Type.STRING },
                likes: { type: Type.INTEGER }
              }
            }
          }
        }
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate cafe data");
  }

  const data = JSON.parse(response.text) as CafeDetails;
  
  // Add local UI properties that Gemini doesn't need to generate
  data.reviews = data.reviews.map(r => ({
    ...r,
    avatarColor: getRandomColor()
  }));

  return data;
};

export const generateCafePoster = async (imagePrompt: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");
  
  const ai = new GoogleGenAI({ apiKey });
  
  // Using gemini-2.5-flash-image for speed and efficiency
  // or gemini-3-pro-image-preview for quality if available/preferred.
  // The prompt asked to avoid older models, 2.5 flash image is good.
  
  const finalPrompt = `Cinematic movie poster for a cafe. ${imagePrompt}. High contrast, atmospheric lighting, photorealistic, 4k. No text overlay.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: finalPrompt }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "3:4", // Standard poster ratio
      }
    }
  });

  // Extract image
  let base64Image = "";
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      base64Image = part.inlineData.data;
      break;
    }
  }

  if (!base64Image) {
     // Fallback if no image generated (should rarely happen with correct model)
     throw new Error("No image generated");
  }

  return `data:image/png;base64,${base64Image}`;
};