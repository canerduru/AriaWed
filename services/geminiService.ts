import { GoogleGenAI, Chat } from "@google/genai";

let chatSession: Chat | null = null;

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const initializeChat = (context?: string) => {
  const ai = getAiClient();
  if (!ai) return null;

  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are Aria, a sophisticated, empathetic, and culturally aware AI wedding planner for the AriaWed platform. 
      
      Your Role:
      1.  **Wedding Planner**: Guide couples through tasks, budget management, and vendor selection.
      2.  **Anxiety Support**: Detect stress in user queries. Offer calming techniques (breathing exercises) and reassurance.
      3.  **Cultural Expert**: Provide advice on diverse traditions (Turkish, Muslim, Christian, Secular, LGBTQ+).
      4.  **Data Analyst**: Use provided context (budget, guest count, timeline) to give specific, data-driven advice.

      Tone: Warm, professional, reassuring, and concise. 
      
      Context Awareness:
      - If provided with JSON context about the wedding state, use it to personalize answers.
      - If the user asks about "budget", look at the budget context provided.
      - If the user seems overwhelmed, switch to "Calming Mode".

      Platform Features (You can guide users to these):
      - Guest Manager, Seating Chart, Budget Tracker, Vendor Marketplace, Creative Studio (AI Vision), Wedding Website Builder.
      
      ${context ? `Current Application Context: ${context}` : ''}`,
    },
  });
  return chatSession;
};

export const sendMessageToAria = async (message: string, context?: string): Promise<string> => {
  if (!chatSession) {
    initializeChat(context);
  }
  
  if (!chatSession) {
     return "I'm having trouble connecting to my brain right now. Please check your API key.";
  }

  try {
    // If context is provided and session exists, we can try to send it as part of the message prompt invisibly
    // or just rely on the initial system instruction if it was set. 
    // Ideally, for a long-running chat, we might want to refresh system instruction, 
    // but here we will prepend context to the message if it's significant.
    const fullMessage = context 
      ? `[System Context Update: ${context}]\n\nUser Query: ${message}` 
      : message;

    const response = await chatSession.sendMessage({ message: fullMessage });
    return response.text || "I didn't catch that. Could you rephrase?";
  } catch (error) {
    console.error("Error communicating with Aria:", error);
    // Attempt re-init on error
    initializeChat(context);
    return "I'm experiencing a momentary lapse in connection. Please try again.";
  }
};
