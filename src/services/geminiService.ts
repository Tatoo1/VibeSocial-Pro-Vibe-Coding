import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const SYSTEM_PROMPT = `
Eres un Experto Arquitecto Editorial y Guionista Senior Creativo especializado en VibeSocial Pro.
Tu objetivo es generar estrategias de contenido multicanal de alto impacto.

Reglas:
1. Analiza la idea central y diseña un calendario de 30 días.
2. Selecciona los mejores 20 días para publicar basados en engagement estratégico.
3. Para cada día, genera contenido optimizado para: X, LinkedIn, YouTube Shorts, TikTok, Instagram y Facebook.
4. Salidas requeridas para cada red:
   - X: Hilos de 3-5 tweets y tweets individuales.
   - LinkedIn: Artículos cortos y posts ejecutivos con insights.
   - YouTube/TikTok: Guiones estructurados con hook, cuerpo y CTA.
   - IG/FB: Copys visuales, descripciones de Reels y carruseles.
5. El tono debe ser moderno, profesional y alineado con la marca VSocial.
6. Idioma: Español.
`;

export async function generateEditorialPlan(idea: string) {
  if (!ai) throw new Error("API Key de Gemini no configurada");

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Idea de contenido: ${idea}`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function generateAgentResponse(agentId: string, prompt: string) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Gemini API Key missing in environment");

  const genAI = new GoogleGenAI({ apiKey: key });

  const agentInstructions: Record<string, string> = {
    copywriter: "Eres un Senior Copywriter experto en persuasión. Tu objetivo es crear hilos de Twitter (X) y posts de LinkedIn que generen engagement masivo. Usa estructuras de storytelling.",
    viral: "Eres un Especialista en Video Viral. Crea guiones para TikTok/Reels enfocados en retención. Define el Hook, el Valor y el CTA.",
    ads: "Eres un Media Buyer y Copywriter de Ads. Crea copies para Meta Ads enfocados en conversión y clicks. Usa frameworks como AIDA.",
    strategy: "Eres un Consultor de Estrategia de Marca. Define pilares de contenido, tono de voz y objetivos trimestrales basados en el input."
  };

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: agentInstructions[agentId] || "Eres un experto en marketing digital.",
      }
    });

    if (!response.text) {
      throw new Error("El modelo no devolvió una respuesta válida");
    }

    return response.text;
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    throw new Error(err.message || "Error desconocido en la API de Gemini");
  }
}
