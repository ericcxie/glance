import OpenAI from "openai";

export interface SummaryOptions {
  maxLength?: number;
  includeUserInfo?: boolean;
  username?: string;
  name?: string;
}

export interface GlanceSummary {
  summary: string;
  tags: string[];
}

export class OpenAIService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  /**
   * Generate a Glance summary with topic tags - focused on what they've been up to
   */
  async generateGlanceSummary(
    tweets: string[],
    options: SummaryOptions = {}
  ): Promise<GlanceSummary> {
    const { username, name } = options;

    // If no tweets, return a default message
    if (tweets.length === 0) {
      return {
        summary: "This user hasn't posted any recent tweets to summarize.",
        tags: ["quiet"],
      };
    }

    // Prepare the tweets for the prompt
    const tweetsText = tweets
      .slice(0, 5) // Limit to 5 tweets to match Twitter API limits
      .map((tweet, index) => `${index + 1}. ${tweet}`)
      .join("\n");

    const userInfo = username
      ? `@${username}${name ? ` (${name})` : ""}`
      : "This user";

    const prompt = `Analyze the following recent tweets and provide a JSON response with 3 topic tags and summary focused on what they've been up to.

Recent tweets from ${userInfo}:
${tweetsText}

Focus on their recent activities like:
- What they're building or working on
- Places they're traveling to
- Life updates or personal news
- Projects they're excited about
- Current interests or hobbies

Please provide a JSON response with this exact structure (no markdown formatting):
{
  "tags": ["tag1", "tag2", "tag3"],
  "summary": "2-3 sentences about what they've been up to recently - their activities, projects, or life updates"
}

The tags should be 3 topic-related words that describe their interests, work, or focus areas (e.g., "AI", "Design", "UX", "Travel", "Startups", "Tech", "Photography", "Fitness", etc.).

Return only the JSON object, no additional text or markdown formatting:`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 120,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content?.trim();

      if (!content) {
        throw new Error("No summary generated");
      }

      try {
        // Clean up markdown formatting if present
        let cleanContent = content;
        if (content.includes("```json")) {
          cleanContent = content
            .replace(/```json\n?/g, "")
            .replace(/```/g, "")
            .trim();
        }

        const parsed = JSON.parse(cleanContent);
        return {
          summary: parsed.summary || content,
          tags: parsed.tags || ["general"],
        };
      } catch (parseError) {
        console.error("JSON parsing failed:", parseError);
        return {
          summary: content,
          tags: ["general"],
        };
      }
    } catch (error) {
      console.error("Error generating Glance summary:", error);
      throw new Error("Failed to generate summary");
    }
  }

  /**
   * Generate a summary of tweets using OpenAI
   */
  async generateSummary(
    tweets: string[],
    options: SummaryOptions = {}
  ): Promise<string> {
    const {
      maxLength = 200,
      includeUserInfo = false,
      username,
      name,
    } = options;

    // If no tweets, return a default message
    if (tweets.length === 0) {
      return "This user hasn't posted any recent tweets to summarize.";
    }

    // Prepare the tweets for the prompt
    const tweetsText = tweets
      .slice(0, 5) // Limit to 5 tweets to match Twitter API limits
      .map((tweet, index) => `${index + 1}. ${tweet}`)
      .join("\n");

    // Create the prompt
    const userInfo =
      includeUserInfo && username
        ? `@${username}${name ? ` (${name})` : ""}`
        : "This user";

    const prompt = `Analyze the following recent tweets and provide a concise summary in 2-3 sentences. 
Focus on the user's main interests, current topics they're discussing, their general tone/sentiment, and any notable patterns or themes.

Recent tweets from ${userInfo}:
${tweetsText}

Please provide a natural, engaging summary that captures:
1. Their main interests and topics
2. Their current mood/tone
3. Any notable trends or patterns
4. Keep it under ${maxLength} characters

Summary:`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      const summary = response.choices[0]?.message?.content?.trim();

      if (!summary) {
        throw new Error("No summary generated");
      }

      return summary;
    } catch (error) {
      console.error("Error generating summary:", error);
      throw new Error("Failed to generate summary");
    }
  }

  /**
   * Generate a more detailed analysis if needed
   */
  async generateDetailedAnalysis(
    tweets: string[],
    options: SummaryOptions = {}
  ): Promise<{
    summary: string;
    topics: string[];
    sentiment: string;
    engagement: string;
  }> {
    const { username, name } = options;

    if (tweets.length === 0) {
      return {
        summary: "This user hasn't posted any recent tweets to analyze.",
        topics: ["quiet"],
        sentiment: "neutral",
        engagement: "low",
      };
    }

    // Prepare the tweets for the prompt
    const tweetsText = tweets
      .slice(0, 5) // Limit to 5 tweets to match Twitter API limits
      .map((tweet, index) => `${index + 1}. ${tweet}`)
      .join("\n");

    const userInfo = username
      ? `@${username}${name ? ` (${name})` : ""}`
      : "This user";

    const prompt = `Analyze the following recent tweets and provide a detailed analysis with JSON structure:

Recent tweets from ${userInfo}:
${tweetsText}

Please provide a JSON response with this exact structure (no markdown formatting):
{
  "summary": "2-3 sentences about their recent activity and interests",
  "topics": ["topic1", "topic2", "topic3"],
  "sentiment": "positive/negative/neutral",
  "engagement": "high/medium/low"
}

Return only the JSON object, no additional text or markdown formatting:`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content?.trim();

      if (!content) {
        throw new Error("No analysis generated");
      }

      try {
        // Clean up markdown formatting if present
        let cleanContent = content;
        if (content.includes("```json")) {
          cleanContent = content
            .replace(/```json\n?/g, "")
            .replace(/```/g, "")
            .trim();
        }

        const parsed = JSON.parse(cleanContent);
        return {
          summary: parsed.summary || content,
          topics: parsed.topics || ["general"],
          sentiment: parsed.sentiment || "neutral",
          engagement: parsed.engagement || "medium",
        };
      } catch (parseError) {
        console.error("JSON parsing failed:", parseError);
        return {
          summary: content,
          topics: ["general"],
          sentiment: "neutral",
          engagement: "medium",
        };
      }
    } catch (error) {
      console.error("Error generating detailed analysis:", error);
      throw new Error("Failed to generate detailed analysis");
    }
  }

  /**
   * Generate a chat completion response for follow-up questions
   */
  async getChatCompletion(prompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 75,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content?.trim();

      if (!content) {
        throw new Error("No response generated");
      }

      return content;
    } catch (error) {
      console.error("Error generating chat completion:", error);
      throw new Error("Failed to generate response");
    }
  }
}

// Helper function to create OpenAI service instance
export function createOpenAIService(): OpenAIService {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is required");
  }
  return new OpenAIService(apiKey);
}
