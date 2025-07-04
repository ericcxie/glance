import { NextApiRequest, NextApiResponse } from "next";
import { createTwitterAPI } from "../../lib/twitter";
import { createOpenAIService } from "../../lib/openai";
import { databaseService, StoredTweet } from "../../lib/database";

export interface SummarizeRequest {
  handle: string;
  detailed?: boolean;
}

export interface SummarizeResponse {
  success: boolean;
  data?: {
    summary: string;
    tags?: string[];
    userInfo: {
      username: string;
      name: string;
    };
    tweetCount: number;
    topics?: string[];
    sentiment?: string;
    engagement?: string;
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SummarizeResponse>
) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    // Get the handle from query parameters
    const { handle, detailed } = req.query;

    if (!handle || typeof handle !== "string") {
      return res.status(400).json({
        success: false,
        error: "Twitter handle is required",
      });
    }

    // Validate handle format
    const cleanHandle = handle.trim();
    if (!cleanHandle) {
      return res.status(400).json({
        success: false,
        error: "Invalid Twitter handle",
      });
    }

    console.log(`Processing summary request for: ${cleanHandle}`);

    // Check for cached summary first
    const cachedSummary = await databaseService.getCachedSummary(cleanHandle);

    if (cachedSummary && !databaseService.isSummaryStale(cachedSummary)) {
      console.log(`Returning cached summary for: ${cleanHandle}`);

      // Return cached summary
      const isDetailed = detailed === "true" || detailed === "1";

      if (isDetailed) {
        // For detailed requests, we'd need to store more detailed analysis
        // For now, return what we have
        return res.status(200).json({
          success: true,
          data: {
            summary: cachedSummary.summary,
            tags: cachedSummary.tags,
            userInfo: {
              username: cachedSummary.username,
              name: cachedSummary.name || cachedSummary.username,
            },
            tweetCount: cachedSummary.tweetCount,
          },
        });
      } else {
        return res.status(200).json({
          success: true,
          data: {
            summary: cachedSummary.summary,
            tags: cachedSummary.tags,
            userInfo: {
              username: cachedSummary.username,
              name: cachedSummary.name || cachedSummary.username,
            },
            tweetCount: cachedSummary.tweetCount,
          },
        });
      }
    }

    // No cached summary or stale, generate new one
    console.log(`Generating new summary for: ${cleanHandle}`);

    // Initialize services
    const twitterAPI = createTwitterAPI();
    const openAIService = createOpenAIService();

    // Fetch tweets
    const { tweets, simpleTweets, userInfo } =
      await twitterAPI.getTweetsForSummary(cleanHandle, 5);

    if (!userInfo) {
      return res.status(404).json({
        success: false,
        error: "Twitter user not found",
      });
    }

    console.log(`Found ${tweets.length} tweets for ${userInfo.username}`);

    // Convert SimpleTweet to StoredTweet format
    const storedTweets: StoredTweet[] = simpleTweets.map((tweet) => ({
      tweetId: tweet.tweetId,
      text: tweet.text,
      twitterCreatedAt: tweet.twitterCreatedAt,
      likes: tweet.likes,
      retweets: tweet.retweets,
    }));

    // Generate summary
    const isDetailed = detailed === "true" || detailed === "1";

    if (isDetailed) {
      // Generate detailed analysis
      const analysis = await openAIService.generateDetailedAnalysis(tweets, {
        username: userInfo.username,
        name: userInfo.name,
        includeUserInfo: true,
      });

      // Store in database (simplified for detailed analysis)
      await databaseService.storeSummary(
        userInfo.username,
        userInfo.name,
        { summary: analysis.summary, tags: analysis.topics || [] },
        tweets.length,
        analysis,
        storedTweets
      );

      return res.status(200).json({
        success: true,
        data: {
          summary: analysis.summary,
          userInfo: {
            username: userInfo.username,
            name: userInfo.name,
          },
          tweetCount: tweets.length,
          topics: analysis.topics,
          sentiment: analysis.sentiment,
          engagement: analysis.engagement,
        },
      });
    } else {
      // Generate Glance summary with tags
      const glanceSummary = await openAIService.generateGlanceSummary(tweets, {
        username: userInfo.username,
        name: userInfo.name,
        includeUserInfo: true,
      });

      // Store in database
      await databaseService.storeSummary(
        userInfo.username,
        userInfo.name,
        glanceSummary,
        tweets.length,
        glanceSummary,
        storedTweets
      );

      return res.status(200).json({
        success: true,
        data: {
          summary: glanceSummary.summary,
          tags: glanceSummary.tags,
          userInfo: {
            username: userInfo.username,
            name: userInfo.name,
          },
          tweetCount: tweets.length,
        },
      });
    }
  } catch (error) {
    console.error("Error in summarize API:", error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("User not found")) {
        return res.status(404).json({
          success: false,
          error: "Twitter user not found",
        });
      }

      if (error.message.includes("TWITTER_BEARER_TOKEN")) {
        return res.status(500).json({
          success: false,
          error: "Twitter API configuration error",
        });
      }

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
