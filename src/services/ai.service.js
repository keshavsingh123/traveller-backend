
import OpenAI from "openai";

let _client;
const getClient = () => {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }
  return _client;
};

const safeParse = (text) => {
  try {
    // remove markdown ```json ```
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // extract JSON block
    const match = cleaned.match(/(\[.*\]|\{.*\})/s);

    if (!match) return null;

    return JSON.parse(match[0]);
  } catch (err) {
    console.log("Parse Error:", text);
    return null;
  }
};
const normalizeItinerary = (data) => {
  if (!Array.isArray(data)) return [];

  return data.map((d, i) => ({
    day: d.day || i + 1,
    activities: Array.isArray(d.activities)
      ? d.activities
      : typeof d.activities === "string"
      ? d.activities.split(",")
      : ["Explore local area"]
  }));
};

// };

// 🔹 ITINERARY
export const generateItinerary = async (data) => {
  const prompt = `
Create a ${data.days}-day travel itinerary for ${data.destination}.
Interests: ${data.interests}
Budget: ${data.budgetType}

STRICT RULES:
- Return ONLY JSON
- No explanation
- activities MUST be array of strings

FORMAT:
[
  { "day": 1, "activities": ["Visit beach", "Nightlife"] }
]
`;

  const res = await getClient().chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
  });

  const parsed = safeParse(res.choices[0].message.content);

  return normalizeItinerary(parsed);
};
export const estimateBudget = async (data) => {
  const prompt = `
Estimate travel budget for ${data.destination} (${data.days} days).

Return JSON:
{
 flights: number,
 hotel: number,
 food: number,
 activities: number,
 total: number
}
`;

  const res = await getClient().chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
  });

  return safeParse(res.choices[0].message.content) || {};
};

// 🔹 HOTELS
export const suggestHotels = async (data) => {
  const prompt = `
Suggest 3 hotels in ${data.destination} for ${data.budgetType} budget.

STRICT RULES:
- Return ONLY array of strings
- No explanation

FORMAT:
["Hotel A", "Hotel B", "Hotel C"]
`;

  const res = await getClient().chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
  });

  const parsed = safeParse(res.choices[0].message.content);

  if (Array.isArray(parsed)) return parsed;

  if (parsed && parsed.length) {
    return parsed.map((h) => h.name || h);
  }

  return [];
};

//Extra Feature 
const parseActivities = (text) => {
  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const match = cleaned.match(/(\[.*\]|\{.*\})/s);
    if (!match) return [];

    const parsed = JSON.parse(match[0]);

    // Case 1: direct array
    if (Array.isArray(parsed)) return parsed;

    // Case 2: object with activities
    if (parsed.activities && Array.isArray(parsed.activities)) {
      return parsed.activities;
    }

    return [];
  } catch (err) {
    console.log("Activity Parse Error:", text);
    return [];
  }
};

export const suggestActivityAI = async (data) => {
  const prompt = `
Suggest 5 activities in ${data.destination} based on interest: ${data.interest}

STRICT RULES:
- Return ONLY JSON
- activities must be array of strings

FORMAT:
["Beach party", "Casino night"]
`;

  const res = await getClient().chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
  });

  const raw = res.choices[0].message.content;

  console.log("RAW ACTIVITY:", raw);

  return parseActivities(raw);
};

export const optimizeBudgetAI = async (trip, level) => {
  const prompt = `
Optimize this trip for ${level} budget.

Trip:
${JSON.stringify(trip)}

STRICT RULES:
- Return ONLY JSON
- No explanation

FORMAT:
{
  "itinerary": [...],
  "budget": {
    "flights": number,
    "hotel": number,
    "food": number,
    "activities": number,
    "total": number
  }
}
`;

  const res = await getClient().chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
  });

  return safeParse(res.choices[0].message.content) || trip;
};