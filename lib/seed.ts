import { databaseService, StoredTweet } from "./database";

const mockSummaries = [
  {
    username: "alex_dev",
    name: "Alex Developer",
    summary:
      "AI-focused developer building the future of software. Recently excited about new ML frameworks and startup challenges.",
    tags: ["AI", "Dev", "Startups"],
    tweetCount: 25,
    openaiResponse: {
      summary:
        "AI-focused developer building the future of software. Recently excited about new ML frameworks and startup challenges.",
      tags: ["AI", "Dev", "Startups"],
    },
  },
  {
    username: "sarah_design",
    name: "Sarah Designer",
    summary:
      "UX designer passionate about accessibility and inclusive design. Currently working on design systems for tech.",
    tags: ["Design", "UX", "A11y"],
    tweetCount: 18,
    openaiResponse: {
      summary:
        "UX designer passionate about accessibility and inclusive design. Currently working on design systems for tech.",
      tags: ["Design", "UX", "A11y"],
    },
  },
  {
    username: "mike_crypto",
    name: "Mike Crypto",
    summary:
      "Crypto trader analyzing markets and DeFi protocols. Bullish on emerging blockchain technologies.",
    tags: ["Crypto", "DeFi", "Trading"],
    tweetCount: 32,
    openaiResponse: {
      summary:
        "Crypto trader analyzing markets and DeFi protocols. Bullish on emerging blockchain technologies.",
      tags: ["Crypto", "DeFi", "Trading"],
    },
  },
  {
    username: "elonmusk",
    name: "Elon Musk",
    summary:
      "Elon Musk has been actively expanding Starlink's reach, with recent launches in Chad and Sri Lanka. He's also engaged in discussions about technology, government policies, and global trends, reflecting on the future of transportation and energy. Additionally, he acknowledges past political achievements and continues to express his thoughts on various societal issues.",
    tags: ["Space", "Technology", "Tesla"],
    tweetCount: 35,
    openaiResponse: {
      summary:
        "Elon Musk has been actively expanding Starlink's reach, with recent launches in Chad and Sri Lanka. He's also engaged in discussions about technology, government policies, and global trends, reflecting on the future of transportation and energy. Additionally, he acknowledges past political achievements and continues to express his thoughts on various societal issues.",
      tags: ["Space", "Technology", "Tesla"],
    },
  },
];

const mockTweets: Record<string, StoredTweet[]> = {
  alex_dev: [
    {
      tweetId: "1001",
      text: "Just discovered this new ML framework that's changing everything. The performance improvements are incredible!",
      twitterCreatedAt: new Date("2024-01-15T10:30:00Z"),
      likes: 245,
      retweets: 67,
    },
    {
      tweetId: "1002",
      text: "Building in public is scary but so rewarding. Here's what I learned from launching my first SaaS product.",
      twitterCreatedAt: new Date("2024-01-14T14:22:00Z"),
      likes: 892,
      retweets: 234,
    },
    {
      tweetId: "1003",
      text: "The future of AI development is going to be wild. We're just getting started with what's possible.",
      twitterCreatedAt: new Date("2024-01-13T09:15:00Z"),
      likes: 456,
      retweets: 123,
    },
  ],
  sarah_design: [
    {
      tweetId: "2001",
      text: "Accessibility isn't an afterthought - it's a fundamental part of good design. Here's why your team needs to care.",
      twitterCreatedAt: new Date("2024-01-15T16:45:00Z"),
      likes: 567,
      retweets: 189,
    },
    {
      tweetId: "2002",
      text: "Spent the day redesigning our design system. The component library is finally coming together beautifully.",
      twitterCreatedAt: new Date("2024-01-14T11:30:00Z"),
      likes: 234,
      retweets: 78,
    },
    {
      tweetId: "2003",
      text: "UX research > assumptions. Always. Your users will surprise you every single time.",
      twitterCreatedAt: new Date("2024-01-13T13:20:00Z"),
      likes: 789,
      retweets: 267,
    },
  ],
  mike_crypto: [
    {
      tweetId: "3001",
      text: "BTC holding strong above $42k. The institutional adoption narrative is playing out exactly as predicted.",
      twitterCreatedAt: new Date("2024-01-15T08:00:00Z"),
      likes: 1234,
      retweets: 445,
    },
    {
      tweetId: "3002",
      text: "New DeFi protocol just launched with some interesting yield farming opportunities. DYOR as always.",
      twitterCreatedAt: new Date("2024-01-14T19:30:00Z"),
      likes: 678,
      retweets: 234,
    },
    {
      tweetId: "3003",
      text: "The next bull run is going to be different. Layer 2 solutions are finally maturing.",
      twitterCreatedAt: new Date("2024-01-13T15:45:00Z"),
      likes: 892,
      retweets: 356,
    },
  ],
  elonmusk: [
    {
      tweetId: "4001",
      text: "Starlink is now available in Chad! Connecting more remote communities to the internet.",
      twitterCreatedAt: new Date("2024-01-15T12:00:00Z"),
      likes: 45672,
      retweets: 12890,
    },
    {
      tweetId: "4002",
      text: "Tesla's new battery technology will revolutionize energy storage. The future is electric.",
      twitterCreatedAt: new Date("2024-01-14T18:30:00Z"),
      likes: 67834,
      retweets: 23451,
    },
    {
      tweetId: "4003",
      text: "Mars needs memes. We're going to have the best memes in the solar system.",
      twitterCreatedAt: new Date("2024-01-13T21:15:00Z"),
      likes: 89234,
      retweets: 34567,
    },
    {
      tweetId: "4004",
      text: "The rapid advancement of AI is both exciting and concerning. We need to be thoughtful about this.",
      twitterCreatedAt: new Date("2024-01-12T10:45:00Z"),
      likes: 56789,
      retweets: 18934,
    },
    {
      tweetId: "4005",
      text: "SpaceX is targeting 100 launches this year. Making life multiplanetary requires high flight rate.",
      twitterCreatedAt: new Date("2024-01-11T14:20:00Z"),
      likes: 78901,
      retweets: 25678,
    },
  ],
};

export async function seedDatabase() {
  console.log("🌱 Seeding database with mock data...");

  try {
    for (const mockData of mockSummaries) {
      const tweets = mockTweets[mockData.username] || [];

      await databaseService.storeSummary(
        mockData.username,
        mockData.name,
        {
          summary: mockData.summary,
          tags: mockData.tags,
        },
        mockData.tweetCount,
        mockData.openaiResponse,
        tweets
      );

      console.log(
        `✅ Seeded ${mockData.username} with ${tweets.length} tweets`
      );
    }

    console.log("🎉 Database seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
