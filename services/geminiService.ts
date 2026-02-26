
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export interface NarrativeClip {
  id: number;
  narration: string;
  description: string;
  highlights: string[];
}

export const analyzeAudioContent = async (audioBase64: string, mimeType: string): Promise<string> => {
  const ai = getAIClient();
  
  const audioPart = {
    inlineData: {
      data: audioBase64,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: `Perform a semantic analysis on this audio. 
    IMPORTANT: You MUST provide the output in the SAME language as the spoken language in the audio.
    1. Identify the main topics and key ideas.
    2. Ignore filler words.
    3. Provide an importance score for each segment.
    4. Present the summary of essential materials in a clear and informative bulleted format.`
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [audioPart, textPart] },
    config: {
      temperature: 0.3,
      topK: 40,
      topP: 0.95,
    }
  });

  return response.text || "Failed to analyze content.";
};

export const generateNarrativeClips = async (analysis: string): Promise<NarrativeClip[]> => {
  const ai = getAIClient();
  const prompt = `Rewrite the following key ideas into creative INFLUENCER EDUCATION narration scripts: "${analysis}".
  
  IMPORTANT: You MUST use the same language as the analysis provided.
  
  Influencer Language Style Guidelines:
  1. DO NOT use the first-person perspective (I/Me) as the main subject, but address the audience directly.
  2. Use a captivating "Hook" at the beginning.
  3. The tone must be Energetic, Informative, and To-the-point (Shorts/TikTok style).
  4. Generate 3-5 variations.
  
  Description Guidelines:
  1. For each narration variation, provide a short description (3-4 sentences) explaining the strategy and context of that specific narration.
  
  Highlights Guidelines:
  1. For each narration variation, extract 3-5 "Highlights".
  2. Highlights MUST be short, punchy sentences or meaningful short phrases taken DIRECTLY from the narration text.
  3. The wording must match the narration exactly—do not summarize or paraphrase the highlights.
  4. Each highlight should be short (ideally under 10 words).
  5. CRITICAL: DO NOT use any emojis, icons, or asterisk symbols (*) in the highlights. Keep it plain text.
  
  Return the result strictly as a JSON array of objects.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      temperature: 0.8,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER, description: "Clip index starting from 1" },
            narration: { type: Type.STRING, description: "The full re-written narration script" },
            description: { type: Type.STRING, description: "A short 3-4 sentence description of the narration strategy" },
            highlights: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Short punchy sentences extracted directly from the narration"
            }
          },
          required: ["id", "narration", "description", "highlights"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse JSON response", e);
    return [];
  }
};

export const translateClips = async (clips: NarrativeClip[], targetLanguage: 'Indonesian' | 'English'): Promise<NarrativeClip[]> => {
  const ai = getAIClient();
  const prompt = `Translate the following JSON array of narrative clips into ${targetLanguage}. 
  Maintain the exact same JSON structure. 
  Translate the "narration", "description", and "highlights" fields.
  
  JSON to translate:
  ${JSON.stringify(clips)}
  
  Return the result strictly as a JSON array of objects.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      temperature: 0.3,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            narration: { type: Type.STRING },
            description: { type: Type.STRING },
            highlights: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }
            }
          },
          required: ["id", "narration", "description", "highlights"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse translation JSON", e);
    return clips;
  }
};
