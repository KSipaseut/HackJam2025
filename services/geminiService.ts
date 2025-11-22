import { GoogleGenAI, Type, type Schema } from "@google/genai";
import { ScheduleItem, AiSuggestion, DayOfWeek } from "../types";

const suggestionSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "A concise title for the study session, e.g., 'Review Biology Notes'" },
      day: { type: Type.STRING, enum: Object.values(DayOfWeek), description: "The day of the week" },
      startTime: { type: Type.STRING, description: "Start time in HH:mm 24h format, e.g., '14:30'" },
      endTime: { type: Type.STRING, description: "End time in HH:mm 24h format" },
      reason: { type: Type.STRING, description: "Short explanation why this slot is good (e.g., '1hr gap before work')" },
    },
    required: ["title", "day", "startTime", "endTime", "reason"],
  }
};

export const generateStudySuggestions = async (currentSchedule: ScheduleItem[]): Promise<AiSuggestion[]> => {
  try {
    // Initialize Gemini Client inside the function to ensure process.env is ready
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const scheduleSummary = currentSchedule.map(item => ({
      title: item.title,
      type: item.type,
      day: item.day,
      time: `${item.startTime} - ${item.endTime}`,
      priority: item.priority
    }));

    const prompt = `
      You are a smart schedule assistant for a university student.
      Here is their current weekly schedule of fixed commitments (Classes, Work, etc.) including their priority levels:
      ${JSON.stringify(scheduleSummary, null, 2)}

      Please identify optimal time blocks for studying.
      Rules:
      1. Suggest exactly 5 distinct study sessions throughout the week.
      2. Prioritize gaps between classes or before/after work.
      3. Avoid very late nights (after 11 PM) or very early mornings (before 7 AM) unless the schedule is packed.
      4. Keep sessions between 45 minutes and 2 hours long.
      5. Try to balance the workload across the week.
      6. Take note of high priority items; ensure there is study time scheduled before them if they are later in the week.
      7. Return ONLY the JSON array matching the schema.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: suggestionSchema,
        temperature: 0.7,
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data as AiSuggestion[];
    }
    return [];

  } catch (error) {
    console.error("Error generating suggestions:", error);
    return [];
  }
};