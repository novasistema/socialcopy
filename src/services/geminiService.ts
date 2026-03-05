import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface VideoCopyRequest {
  topic: string;
  platform: 'TikTok' | 'Instagram Reels' | 'YouTube Shorts' | 'LinkedIn Video';
  tone: string;
  targetAudience: string;
  duration: '15s' | '30s' | '60s' | '90s+';
  style: 'Storytelling' | 'Educativo' | 'Promocional' | 'Humorístico' | 'Tendencia';
}

export interface VideoCopyResponse {
  hook: string;
  body: string;
  cta: string;
  onScreenText: string[];
  description: string;
  hashtags: string[];
}

export async function generateVideoCopy(request: VideoCopyRequest): Promise<VideoCopyResponse> {
  const prompt = `Genera un guion persuasivo y elementos visuales para un video de redes sociales con los siguientes detalles:
  - Tema: ${request.topic}
  - Plataforma: ${request.platform}
  - Tono: ${request.tone}
  - Audiencia: ${request.targetAudience}
  - Duración estimada: ${request.duration}
  - Estilo: ${request.style}

  El resultado debe ser un objeto JSON con los siguientes campos:
  - hook: Un gancho impactante para los primeros 3 segundos (lo que se dice).
  - body: El contenido principal del video (el guion hablado).
  - cta: Una llamada a la acción clara (lo que se dice al final).
  - onScreenText: Una lista de 3-5 frases cortas e impactantes para poner como TEXTO EN PANTALLA durante el video.
  - description: Un copy optimizado para la descripción del post (pie de foto/video).
  - hashtags: Una lista de 5-7 hashtags relevantes.

  Asegúrate de que el lenguaje sea natural, dinámico y adaptado a la plataforma seleccionada.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hook: { type: Type.STRING },
          body: { type: Type.STRING },
          cta: { type: Type.STRING },
          onScreenText: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          description: { type: Type.STRING },
          hashtags: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["hook", "body", "cta", "onScreenText", "description", "hashtags"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
}
