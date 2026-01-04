
import { GoogleGenAI } from "@google/genai";

export const removeBackground = async (imageBase64: string, mimeType: string): Promise<string> => {
  // Use process.env.API_KEY as per instructions
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType,
            },
          },
          {
            text: 'Remove the background from this image. Keep only the main subject and return it on a transparent background (PNG format with alpha channel). If transparency is not possible, place the subject on a pure white background.',
          },
        ],
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No response generated from AI.");
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("AI did not return an image part.");
  } catch (error) {
    console.error("Error in Gemini background removal:", error);
    throw error;
  }
};
