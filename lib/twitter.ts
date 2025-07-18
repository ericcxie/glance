import axios from "axios";

interface TwitterUser {
  id: string;
  username: string;
  name: string;
}

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  public_metrics: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
    quote_count: number;
  };
  referenced_tweets?: {
    type: string;
    id: string;
  }[];
}

export interface SimpleTweet {
  tweetId: string;
  text: string;
  twitterCreatedAt: Date;
  likes: number;
  retweets: number;
}

interface TwitterApiResponse {
  data: Tweet[];
  includes?: {
    users: TwitterUser[];
  };
}

export class TwitterAPI {
  private bearerToken: string;
  private baseUrl = "https://api.twitter.com/2";

  constructor(bearerToken: string) {
    this.bearerToken = bearerToken;
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.bearerToken}`,
      "Content-Type": "application/json",
    };
  }

  /**
   * Get user ID from username
   */
  async getUserByUsername(username: string): Promise<TwitterUser | null> {
    try {
      // Remove @ symbol if present
      const cleanUsername = username.replace("@", "");

      const response = await axios.get(
        `${this.baseUrl}/users/by/username/${cleanUsername}`,
        {
          headers: this.getHeaders(),
          params: {
            "user.fields": "id,username,name,public_metrics",
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null; // User not found
      }
      throw error;
    }
  }

  /**
   * Get recent tweets from a user
   */
  async getUserTweets(
    userId: string,
    maxResults: number = 5
  ): Promise<Tweet[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/users/${userId}/tweets`,
        {
          headers: this.getHeaders(),
          params: {
            max_results: Math.min(maxResults, 100), // API limit is 100
            "tweet.fields": "created_at,public_metrics,referenced_tweets",
            expansions: "author_id",
            exclude: "retweets,replies", // Focus on original tweets
          },
        }
      );

      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching tweets:", error);
      throw error;
    }
  }

  /**
   * Clean and filter tweets for summarization
   */
  cleanTweets(tweets: Tweet[]): string[] {
    return tweets
      .filter((tweet) => {
        // Filter out retweets and replies
        return !tweet.referenced_tweets?.some(
          (ref) => ref.type === "retweeted" || ref.type === "replied_to"
        );
      })
      .map((tweet) => {
        // Remove URLs, mentions, and clean up text
        let cleanText = tweet.text;

        // Remove URLs
        cleanText = cleanText.replace(/(https?:\/\/[^\s]+)/g, "");

        // Remove excessive whitespace
        cleanText = cleanText.replace(/\s+/g, " ").trim();

        // Remove empty tweets
        if (cleanText.length < 10) {
          return null;
        }

        return cleanText;
      })
      .filter((text) => text !== null) as string[];
  }

  /**
   * Convert tweets to simplified format for storage
   */
  convertToSimpleTweets(tweets: Tweet[]): SimpleTweet[] {
    return tweets
      .filter((tweet) => {
        // Filter out retweets and replies
        return !tweet.referenced_tweets?.some(
          (ref) => ref.type === "retweeted" || ref.type === "replied_to"
        );
      })
      .map((tweet) => {
        // Clean the text
        let cleanText = tweet.text;
        cleanText = cleanText.replace(/(https?:\/\/[^\s]+)/g, "");
        cleanText = cleanText.replace(/\s+/g, " ").trim();

        // Skip if text is too short
        if (cleanText.length < 10) {
          return null;
        }

        return {
          tweetId: tweet.id,
          text: cleanText,
          twitterCreatedAt: new Date(tweet.created_at),
          likes: tweet.public_metrics.like_count,
          retweets: tweet.public_metrics.retweet_count,
        };
      })
      .filter((tweet) => tweet !== null) as SimpleTweet[];
  }

  /**
   * Main method to get summarizable tweets from a user
   */
  async getTweetsForSummary(
    username: string,
    maxResults: number = 5
  ): Promise<{
    tweets: string[];
    simpleTweets: SimpleTweet[];
    userInfo: TwitterUser | null;
  }> {
    // Get user info
    const userInfo = await this.getUserByUsername(username);
    if (!userInfo) {
      throw new Error("User not found");
    }

    // Get tweets
    const rawTweets = await this.getUserTweets(userInfo.id, maxResults);

    // Clean tweets for AI processing
    const cleanTweets = this.cleanTweets(rawTweets);

    // Convert to simple format for storage
    const simpleTweets = this.convertToSimpleTweets(rawTweets);

    return {
      tweets: cleanTweets,
      simpleTweets: simpleTweets,
      userInfo,
    };
  }
}

// Helper function to create TwitterAPI instance
export function createTwitterAPI(): TwitterAPI {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  if (!bearerToken) {
    throw new Error("TWITTER_BEARER_TOKEN environment variable is required");
  }
  return new TwitterAPI(bearerToken);
}
