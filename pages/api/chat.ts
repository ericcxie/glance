import { NextApiRequest, NextApiResponse } from "next";
import { databaseService } from "../../lib/database";
import { createOpenAIService } from "../../lib/openai";

export interface ChatRequest {
  username: string;
  question: string;
}

export interface ChatResponse {
  success: boolean;
  data?: {
    response: string;
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { username, question } = req.body as ChatRequest;

    if (!username || !question) {
      return res.status(400).json({
        success: false,
        error: "Username and question are required",
      });
    }

    // Clean username by removing @ symbol if present
    const cleanUsername = username.replace("@", "");

    console.log(`Processing chat question for: ${cleanUsername}`);

    // Get the cached summary
    const cachedSummary = await databaseService.getCachedSummary(cleanUsername);

    if (!cachedSummary) {
      return res.status(404).json({
        success: false,
        error:
          "No summary found for this user. Please generate a summary first.",
      });
    }

    // Get the stored tweets for context
    const tweets = await databaseService.getTweets(cachedSummary.id);

    if (tweets.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No tweets found for this user.",
      });
    }

    // Initialize OpenAI service
    const openAIService = createOpenAIService();

    // Prepare context for OpenAI
    const tweetContext = tweets
      .map(
        (tweet, index) =>
          `${index + 1}. "${tweet.text}" (${tweet.likes} likes, ${
            tweet.retweets
          } retweets, posted ${tweet.twitterCreatedAt.toDateString()})`
      )
      .join("\n");

    const prompt = `You are helping someone learn about a Twitter user named ${cachedSummary.name} (@${cachedSummary.username}) based on their recent tweets.

RECENT TWEETS:
${tweetContext}

QUESTION: ${question}

Please provide a brief, conversational response (1-2 sentences max) based on the specific tweets above. If you have broader knowledge about this person that's relevant to the question, you can mention it BUT:
- Always lead with specific tweet content when relevant
- Only mention well-established facts, avoid speculation

If the user is asking for help writing a message or invite, respond as if you're speaking directly to ${cachedSummary.name} — use 'you' and 'your' instead of 'they' or 'their'.

Your tone should be friendly and casual — like someone explaining this person to a peer who follows them on Twitter.`;

    // Get response from OpenAI
    const response = await openAIService.getChatCompletion(prompt);

    return res.status(200).json({
      success: true,
      data: {
        response: response,
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("OPENAI_API_KEY")) {
        return res.status(500).json({
          success: false,
          error: "OpenAI API configuration error",
        });
      }

      if (error.message.includes("rate limit")) {
        return res.status(429).json({
          success: false,
          error: "Rate limit exceeded. Please try again later.",
        });
      }
    }

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
