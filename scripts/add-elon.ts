import { databaseService } from "../lib/database";

const elonData = {
  username: "elonmusk",
  name: "Elon Musk",
  summary:
    "Elon Musk has been actively expanding Starlink's reach, with recent launches in Chad and Sri Lanka. He's also engaged in discussions about technology, government policies, and global trends, reflecting on the future of transportation and energy. Additionally, he acknowledges past political achievements and continues to express his thoughts on various societal issues.",
  tags: ["Starlink", "Tech", "Policy"],
  tweetCount: 35,
  openaiResponse: {
    summary:
      "Elon Musk has been actively expanding Starlink's reach, with recent launches in Chad and Sri Lanka. He's also engaged in discussions about technology, government policies, and global trends, reflecting on the future of transportation and energy. Additionally, he acknowledges past political achievements and continues to express his thoughts on various societal issues.",
    tags: ["Starlink", "Tech", "Policy"],
  },
};

async function addElonData() {
  console.log("🚀 Adding Elon Musk data to database...");

  try {
    await databaseService.storeSummary(
      elonData.username,
      elonData.name,
      {
        summary: elonData.summary,
        tags: elonData.tags,
      },
      elonData.tweetCount,
      elonData.openaiResponse
    );

    console.log("✅ Successfully added Elon Musk data!");
  } catch (error) {
    console.error("❌ Error adding Elon data:", error);
    throw error;
  }
}

addElonData().catch(console.error);
