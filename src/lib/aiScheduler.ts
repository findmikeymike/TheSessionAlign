import OpenAI from "openai";
import { Creator } from "@/types/user";

interface SessionRequest {
  title: string;
  date?: Date;
  time?: string;
  type: string;
  location?: string;
  requiredRoles?: string[];
  genre?: string;
  style?: string;
}

const getOpenAI = () => {
  // First try to get API key from environment variable (for testing)
  const envApiKey = import.meta.env.VITE_OPENAI_API_KEY;
  // Then fall back to localStorage if not available in env
  const localApiKey = localStorage.getItem("openai_api_key");

  const apiKey = envApiKey || localApiKey;

  console.log("[AI Matching] ENV API key exists:", !!envApiKey);
  console.log("[AI Matching] localStorage API key exists:", !!localApiKey);
  console.log(
    "[AI Matching] Using API key from:",
    envApiKey ? "environment" : "localStorage",
  );

  if (!apiKey || apiKey === "YOUR_OPENAI_API_KEY") {
    throw new Error(
      "OpenAI API key not found or invalid. Please add it in the preferences panel.",
    );
  }

  // Log a masked version of the API key for debugging
  if (apiKey) {
    const maskedKey =
      apiKey.length > 8
        ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
        : "[Key too short to mask]";
    console.log("[AI Matching] Using API key (masked):", maskedKey);
  }

  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });
};

function hasTimeOverlap(
  time1: string,
  time2: string,
): { overlaps: boolean; hours: number } {
  const [start1, end1] = time1
    .split(" - ")
    .map((t) => new Date(`1970/01/01 ${t}`).getTime());
  const [start2, end2] = time2
    .split(" - ")
    .map((t) => new Date(`1970/01/01 ${t}`).getTime());

  const overlapStart = Math.max(start1, start2);
  const overlapEnd = Math.min(end1, end2);
  const overlapHours = (overlapEnd - overlapStart) / (1000 * 60 * 60);

  return {
    overlaps: overlapHours >= 2,
    hours: overlapHours,
  };
}

export async function findOptimalMatches(
  request: SessionRequest,
  creators: Creator[],
): Promise<Creator[]> {
  console.log(
    "[AI Matching] findOptimalMatches called with",
    creators.length,
    "creators",
  );
  if (creators.length < 2) {
    console.log("[AI Matching] Not enough creators (minimum 2 required)");
    return [];
  }

  try {
    console.log("[AI Matching] Starting OpenAI API call");
    console.log(
      "[AI Matching] Creators data:",
      JSON.stringify(creators, null, 2),
    );

    // Check if creators have the required structure
    const validCreators = creators.every(
      (c) =>
        c.id &&
        c.name &&
        c.type &&
        c.availability &&
        Array.isArray(c.availability.dates) &&
        c.availability.timeRange &&
        Array.isArray(c.genres),
    );

    if (!validCreators) {
      console.error("[AI Matching] Invalid creator data structure");
      return [];
    }

    const openai = getOpenAI();
    console.log("[AI Matching] OpenAI client initialized");

    // Check if API key is valid (masked for security)
    const apiKey =
      import.meta.env.VITE_OPENAI_API_KEY ||
      localStorage.getItem("openai_api_key");
    console.log(
      "[AI Matching] Using API key:",
      apiKey
        ? `${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 4)}`
        : "No API key found",
    );

    console.log("[AI Matching] Sending request to OpenAI API...");
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an AI matching system for music session scheduling. Your goal is to find optimal pairs of creators based on their genres, availability, and roles.",
        },
        {
          role: "user",
          content: JSON.stringify({
            request,
            creators: creators.map((c) => ({
              ...c,
              availability: {
                ...c.availability,
                dates: c.availability.dates.map((d) => d.toISOString()),
              },
            })),
          }),
        },
      ],
    });
    console.log("[AI Matching] OpenAI API response received:", response);

    const aiSuggestions = response.choices[0].message.content;
    console.log("[AI Matching] AI Suggestions:", aiSuggestions);

    // Fallback to basic matching if AI fails
    const pairs: Array<{
      pair: Creator[];
      score: number;
      commonDates: Date[];
      overlapHours: number;
    }> = [];

    for (let i = 0; i < creators.length; i++) {
      for (let j = i + 1; j < creators.length; j++) {
        const creator1 = creators[i];
        const creator2 = creators[j];

        // First check schedule compatibility
        const commonDates = creator1.availability.dates.filter((date1) =>
          creator2.availability.dates.some(
            (date2) => date2.toDateString() === date1.toDateString(),
          ),
        );

        if (commonDates.length === 0) continue;

        // Check for minimum 2 hour overlap in their time ranges
        const { overlaps, hours } = hasTimeOverlap(
          creator1.availability.timeRange,
          creator2.availability.timeRange,
        );

        if (!overlaps) continue;

        // Calculate match score
        let score = 0;

        // Schedule compatibility is highest priority
        score += commonDates.length * 10; // More common dates = better
        score += hours * 5; // More overlap hours = better

        // Genre compatibility
        const commonGenres = creator1.genres.filter((g) =>
          creator2.genres.includes(g),
        );
        score += commonGenres.length * 2;

        // Small bonus for complementary roles
        if (creator1.type !== creator2.type) {
          score += 1;
        }

        pairs.push({
          pair: [creator1, creator2],
          score,
          commonDates,
          overlapHours: hours,
        });
      }
    }

    // Sort by score and return top matches
    return pairs
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .flatMap(({ pair }) => pair);
  } catch (error) {
    console.error("[AI Matching] Error:", error);
    console.error(
      "[AI Matching] Error details:",
      JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
    );
    return [];
  }
}

export function suggestOptimalTime(creators: Creator[]): {
  date: Date;
  time: string;
} {
  // Find overlapping availability
  const availableDays = creators.reduce((days, creator) => {
    return days.filter((day) =>
      creator.availability.dates.some(
        (d) => d.toDateString() === day.toDateString(),
      ),
    );
  }, creators[0].availability.dates);

  // Get first available time from timeRange
  const timeRange = creators[0].availability.timeRange;
  const [startTime] = timeRange.split(" - ");

  // Pick first available slot
  const date = availableDays[0] || new Date();

  return { date, time: startTime };
}
