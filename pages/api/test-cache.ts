import { NextApiRequest, NextApiResponse } from "next";
import { databaseService } from "../../lib/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username } = req.query;
  const testUsername = username || "elonmusk";

  try {
    console.log(`Testing cache lookup for: ${testUsername}`);

    // Clean username the same way as chat API
    const cleanUsername = (testUsername as string).replace("@", "");
    console.log(`Cleaned username: ${cleanUsername}`);

    // Test the exact same call as chat API
    const cachedSummary = await databaseService.getCachedSummary(cleanUsername);

    console.log("Cache result:", cachedSummary);

    if (cachedSummary) {
      // Also test getting tweets
      const tweets = await databaseService.getTweets(cachedSummary.id);
      console.log(`Found ${tweets.length} tweets for ${cleanUsername}`);

      return res.status(200).json({
        success: true,
        data: {
          originalInput: testUsername,
          cleanedUsername: cleanUsername,
          summary: {
            id: cachedSummary.id,
            username: cachedSummary.username,
            name: cachedSummary.name,
            summary: cachedSummary.summary.substring(0, 100) + "...",
            tags: cachedSummary.tags,
            tweetCount: cachedSummary.tweetCount,
          },
          tweetCount: tweets.length,
          tweets: tweets.slice(0, 2).map((tweet) => ({
            tweetId: tweet.tweetId,
            text: tweet.text.substring(0, 100) + "...",
            likes: tweet.likes,
            retweets: tweet.retweets,
          })),
        },
      });
    } else {
      return res.status(404).json({
        success: false,
        error: "No cached summary found",
        searchedFor: testUsername,
        cleanedUsername: cleanUsername,
      });
    }
  } catch (error) {
    console.error("Error testing cache:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
