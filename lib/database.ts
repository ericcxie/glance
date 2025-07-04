import { PrismaClient } from "../src/generated/prisma";
import { GlanceSummary } from "./openai";

// Global Prisma client instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export interface CachedSummary {
  id: string;
  username: string;
  name?: string;
  summary: string;
  tags: string[];
  openaiResponse: any;
  tweetCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoredTweet {
  tweetId: string;
  text: string;
  twitterCreatedAt: Date;
  likes: number;
  retweets: number;
}

export class DatabaseService {
  /**
   * Get a cached summary by username
   */
  async getCachedSummary(username: string): Promise<CachedSummary | null> {
    try {
      const summary = await prisma.summary.findUnique({
        where: { username: username.toLowerCase() },
      });

      if (!summary) {
        return null;
      }

      return {
        id: summary.id,
        username: summary.username,
        name: summary.name || undefined,
        summary: summary.summary,
        tags: summary.tags,
        openaiResponse: summary.openaiResponse,
        tweetCount: summary.tweetCount,
        createdAt: summary.createdAt,
        updatedAt: summary.updatedAt,
      };
    } catch (error) {
      console.error("Error fetching cached summary:", error);
      return null;
    }
  }

  /**
   * Store a new summary or update existing one with tweets
   */
  async storeSummary(
    username: string,
    name: string,
    glanceSummary: GlanceSummary,
    tweetCount: number,
    openaiResponse: any,
    tweets?: StoredTweet[]
  ): Promise<CachedSummary> {
    try {
      const summary = await prisma.summary.upsert({
        where: { username: username.toLowerCase() },
        update: {
          name,
          summary: glanceSummary.summary,
          tags: glanceSummary.tags,
          openaiResponse,
          tweetCount,
          updatedAt: new Date(),
        },
        create: {
          username: username.toLowerCase(),
          name,
          summary: glanceSummary.summary,
          tags: glanceSummary.tags,
          openaiResponse,
          tweetCount,
        },
      });

      // Store tweets if provided
      if (tweets && tweets.length > 0) {
        await this.storeTweets(summary.id, tweets);
      }

      return {
        id: summary.id,
        username: summary.username,
        name: summary.name || undefined,
        summary: summary.summary,
        tags: summary.tags,
        openaiResponse: summary.openaiResponse,
        tweetCount: summary.tweetCount,
        createdAt: summary.createdAt,
        updatedAt: summary.updatedAt,
      };
    } catch (error) {
      console.error("Error storing summary:", error);
      throw new Error("Failed to store summary");
    }
  }

  /**
   * Store tweets for a summary
   */
  async storeTweets(summaryId: string, tweets: StoredTweet[]): Promise<void> {
    try {
      // First, delete existing tweets for this summary to avoid duplicates
      await prisma.tweet.deleteMany({
        where: { summaryId },
      });

      // Insert new tweets
      await prisma.tweet.createMany({
        data: tweets.map((tweet) => ({
          tweetId: tweet.tweetId,
          text: tweet.text,
          twitterCreatedAt: tweet.twitterCreatedAt,
          likes: tweet.likes,
          retweets: tweet.retweets,
          summaryId,
        })),
      });

      console.log(`Stored ${tweets.length} tweets for summary ${summaryId}`);
    } catch (error) {
      console.error("Error storing tweets:", error);
      throw new Error("Failed to store tweets");
    }
  }

  /**
   * Get tweets for a summary (for follow-up questions)
   */
  async getTweets(summaryId: string): Promise<StoredTweet[]> {
    try {
      const tweets = await prisma.tweet.findMany({
        where: { summaryId },
        orderBy: { twitterCreatedAt: "desc" },
      });

      return tweets.map((tweet) => ({
        tweetId: tweet.tweetId,
        text: tweet.text,
        twitterCreatedAt: tweet.twitterCreatedAt,
        likes: tweet.likes,
        retweets: tweet.retweets,
      }));
    } catch (error) {
      console.error("Error fetching tweets:", error);
      return [];
    }
  }

  /**
   * Check if a summary is stale (older than 24 hours)
   */
  isSummaryStale(summary: CachedSummary): boolean {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return summary.updatedAt < twentyFourHoursAgo;
  }

  /**
   * Delete a cached summary
   */
  async deleteCachedSummary(username: string): Promise<void> {
    try {
      await prisma.summary.delete({
        where: { username: username.toLowerCase() },
      });
    } catch (error) {
      console.error("Error deleting cached summary:", error);
    }
  }
}

// Create a singleton instance
export const databaseService = new DatabaseService();
