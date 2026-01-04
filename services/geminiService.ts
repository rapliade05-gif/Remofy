
import { GoogleGenAI, Type } from "@google/genai";
import { StoreDetails } from "../types";

const MAPS_LINK = "https://maps.app.goo.gl/FCYDmLVP6L3A57H69";

export const fetchStoreData = async (): Promise<StoreDetails> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const prompt = `
      Informasi detail tentang toko/bisnis di tautan ini: ${MAPS_LINK}. 
      Tolong berikan:
      1. Nama Bisnis
      2. Alamat Lengkap
      3. Rating dan jumlah ulasan
      4. Kategori bisnis
      5. Deskripsi menarik tentang apa yang mereka jual atau layanan mereka dalam Bahasa Indonesia.
      6. Beberapa ulasan pelanggan jika tersedia.
      7. Jam operasional jika tersedia.
      
      Gunakan alat Google Maps untuk mendapatkan data yang akurat.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        // Note: No responseMimeType allowed with googleMaps tool
      },
    });

    const text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const mapUri = groundingChunks?.find(c => c.maps?.uri)?.maps?.uri || MAPS_LINK;

    // We use a secondary call to structure this data into JSON for our UI
    const structurer = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extract the following store information from this text into JSON format: "${text}". 
      Required keys: name, address, rating (number), user_ratings_total (number), summary (compelling description in Indonesian), category, opening_hours (array of strings), reviews (array of objects with author and text).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            address: { type: Type.STRING },
            rating: { type: Type.NUMBER },
            user_ratings_total: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            category: { type: Type.STRING },
            opening_hours: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            reviews: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  author: { type: Type.STRING },
                  text: { type: Type.STRING },
                  rating: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    const rawJson = JSON.parse(structurer.text || "{}");
    
    return {
      ...rawJson,
      mapUri: mapUri,
      summary: rawJson.summary || "Selamat datang di toko kami. Kami memberikan pelayanan terbaik untuk kebutuhan Anda.",
      category: rawJson.category || "Toko Kelontong / Bisnis Lokal"
    };
  } catch (error) {
    console.error("Error fetching store data:", error);
    throw new Error("Gagal mengambil data toko. Pastikan koneksi internet stabil.");
  }
};
