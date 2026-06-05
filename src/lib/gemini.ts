import { GoogleGenAI } from '@google/genai';

// Fallback to import.meta.env for github repo deployed outside AI studio
const getApiKey = () => {
  try {
    if (import.meta.env.VITE_GEMINI_API_KEY) return import.meta.env.VITE_GEMINI_API_KEY;
  } catch(e) {}
  try {
    return process.env.API_KEY || process.env.GEMINI_API_KEY || '';
  } catch(e) {}
  return '';
};

export const getAI = () => {
  const key = getApiKey();
  if (!key) {
    throw new Error("API key is missing. If deploying to Vercel or other hosts, please add VITE_GEMINI_API_KEY to your Environment Variables setting in the hosting dashboard.");
  }
  return new GoogleGenAI({ apiKey: key });
};

export async function analyzeMaizeLeaf(file: File, base64Data: string, mimeType: string) {
  const ai = getAI();
  const apiUrl = import.meta.env.VITE_FASTAPI_URL || 'http://localhost:8000';
  
  let customPrediction: { prediction: string; confidence: number; class_index: number } | null = null;
  
  try {
    const formData = new FormData();
    formData.append("file", file);
    
    // Call our Python FastAPI backend
    const res = await fetch(`${apiUrl}/predict`, {
      method: 'POST',
      body: formData
    });
    
    if (res.ok) {
      customPrediction = await res.json();
    } else {
      console.warn("FastAPI prediction failed:", await res.text());
    }
  } catch (error) {
    console.warn(`Could not connect to FastAPI backend at ${apiUrl}. Falling back to pure Gemini Vision. Set VITE_FASTAPI_URL or run the backend locally. Error:`, error);
  }

  let prompt = '';
  
  if (customPrediction) {
    // 1. We got a prediction from the .h5 model. Ask Gemini to enrich it.
    prompt = `An expert custom AI model has analyzed an image of a maize leaf and diagnosed it with the condition: "${customPrediction.prediction}". 
The model's confidence level is ${Math.round(customPrediction.confidence * 100)}%.

Based on this diagnosis, provide an explanation, treatment advice, and prevention tips.
Return your response in pure JSON format (without markdown blocks or additional text) with the following structure:
{
  "prediction": "${customPrediction.prediction}",
  "confidence": ${customPrediction.confidence},
  "details": "string (Explain what this disease is and its visual symptoms)",
  "treatment": "string (Suggested treatments or actions)",
  "prevention": "string (How to prevent this in the future, or how to maintain health if healthy)"
}`;
  } else {
    // 2. Fallback: Ask Gemini to do everything.
    prompt = `You are an expert AI agriculture assistant diagnosing maize (corn) leaf diseases.
You need to analyze the provided image and classify it into exactly ONE of the following 4 classes:
- Blight (Northern Corn Leaf Blight)
- Common Rust
- Grey Leaf Spot
- Healthy

Return your response in pure JSON format (without markdown blocks or additional text) with the following structure:
{
  "prediction": "Blight" | "Common Rust" | "Grey Leaf Spot" | "Healthy",
  "confidence": number (between 0.0 and 1.0),
  "details": "string (Why did you make this prediction? What are the visual symptoms observed?)",
  "treatment": "string (Suggested treatments or actions)",
  "prevention": "string (How to prevent this in the future, or how to maintain health if healthy)"
}`;
  }

  try {
    const contents: any = [
      {
        role: 'user',
        parts: [
          { text: prompt }
        ]
      }
    ];

    // If we didn't get a custom prediction (or even if we did and want to give image context), supply the image to Gemini
    if (!customPrediction) {
      contents[0].parts.push({
        inlineData: {
          data: base64Data,
          mimeType,
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    // Parse json
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/```json\n?/, '').replace(/```\n?$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```\n?/, '').replace(/```\n?$/, '');
    }

    const result = JSON.parse(cleanText);
    
    // Ensure custom prediction values are prioritized if the backend worked
    if (customPrediction) {
      result.prediction = customPrediction.prediction;
      result.confidence = customPrediction.confidence;
    }
    
    return result;
  } catch (error: any) {
    console.error("AI Analysis error:", error);
    let errorMsg = error?.message;
    if (!errorMsg) {
       errorMsg = typeof error === 'string' ? error : JSON.stringify(error);
    }
    throw new Error(errorMsg || "Failed to analyze image.");
  }
}
