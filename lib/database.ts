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
   * Store a new summary or update existing one
   */
  async storeSummary(
    username: string,
    name: string,
    glanceSummary: GlanceSummary,
    tweetCount: number,
    openaiResponse: any
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
