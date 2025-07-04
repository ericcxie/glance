import { databaseService } from "./database";

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
];

export async function seedDatabase() {
  console.log("🌱 Seeding database with mock data...");

  try {
    for (const mockData of mockSummaries) {
      await databaseService.storeSummary(
        mockData.username,
        mockData.name,
        {
          summary: mockData.summary,
          tags: mockData.tags,
        },
        mockData.tweetCount,
        mockData.openaiResponse
      );
      console.log(`✅ Seeded ${mockData.username}`);
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
