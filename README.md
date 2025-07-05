<div align="center">
    <div id="user-content-toc">
      <ul>
          <summary><h1 style="display: inline-block; margin-bottom:0px">Glance</h1></summary>
      </ul>
    </div>
    <h3>Your AI cheat sheet before every connection.</h3>
    <br>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white"/>
    <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white"/>
    <img src="https://img.shields.io/badge/Twitter%20API-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white"/>
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white"/>
    <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white"/> 
    <br><br>
</div>

https://github.com/user-attachments/assets/4639b19a-cd02-47bd-8c54-167e2c35ec9d

## What is Glance?

Imagine you’re at a YC afterparty and someone drops their X handle. You pull out your phone, plug it into Glance, and in seconds, you know what they’ve been tweeting about lately — AI, startups, maybe a hot take on fundraising. You instantly get their vibe, without scrolling through a single post.

Glance is your AI-powered social cheat sheet. It summarizes any public X (Twitter) user's recent tweets into a short, insightful snapshot of their interests, tone, and current focus. Whether you're networking, recruiting, or just curious, Glance helps you understand people faster. Want to dig deeper? Ask follow-up questions and get conversational answers — all based on what they’ve actually posted.

## Getting Started

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# X (Twitter) API v2 Bearer Token
# Get this from https://developer.twitter.com/en/portal/dashboard
TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here

# OpenAI API Key
# Get this from https://platform.openai.com/account/api-keys
OPENAI_API_KEY=your_openai_api_key_here

# Database (Supabase + Prisma)
DATABASE_URL=your_supabase_database_url_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Installation and Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma db push
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## API Documentation

### GET /api/summarize

Generates a summary of a Twitter user's recent tweets.

#### Parameters

- `handle` (required): Twitter username (with or without @)
- `detailed` (optional): Set to `true` for detailed analysis with topics, sentiment, and engagement

#### Examples

```bash
# Simple summary
curl "http://localhost:3000/api/summarize?handle=elonmusk"

# Detailed analysis
curl "http://localhost:3000/api/summarize?handle=elonmusk&detailed=true"
```

#### Response Format

**Simple Summary:**

```json
{
  "success": true,
  "data": {
    "summary": "User's recent activity summary...",
    "tags": ["AI", "Tesla", "SpaceX"],
    "userInfo": {
      "username": "elonmusk",
      "name": "Elon Musk"
    },
    "tweetCount": 25
  }
}
```

**Detailed Analysis:**

```json
{
  "success": true,
  "data": {
    "summary": "User's recent activity summary...",
    "userInfo": {
      "username": "elonmusk",
      "name": "Elon Musk"
    },
    "tweetCount": 25,
    "topics": ["AI", "Tesla", "SpaceX"],
    "sentiment": "positive",
    "engagement": "high"
  }
}
```

### POST /api/chat

Ask follow-up questions about a Twitter user.

#### Parameters

```json
{
  "username": "elonmusk",
  "question": "What projects are they working on?"
}
```

#### Example

```bash
curl -X POST "http://localhost:3000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"username": "elonmusk", "question": "What projects are they working on?"}'
```

#### Response Format

```json
{
  "success": true,
  "data": {
    "response": "Based on their recent tweets, they're focusing on..."
  }
}
```

## Project Structure

```
glance/
├── lib/
│   ├── database.ts     # Database service (Supabase + Prisma)
│   ├── openai.ts       # OpenAI API integration
│   ├── seed.ts         # Database seeding utilities
│   └── twitter.ts      # X API integration
├── pages/
│   └── api/            # Next.js API routes
│       ├── chat.ts     # Follow-up questions endpoint
│       ├── health.ts   # Health check endpoint
│       ├── summarize.ts # Main summarization endpoint
│       ├── test-cache.ts # Cache testing endpoint
│       └── tweets.ts   # Tweet fetching endpoint
├── prisma/
│   ├── migrations/     # Database migrations
│   └── schema.prisma   # Database schema
├── scripts/
│   └── add-elon.ts     # Utility scripts
├── src/
│   ├── app/            # Next.js app router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── summary/    # Summary pages
│   ├── components/
│   │   └── ui/         # UI components
│   └── lib/
│       └── utils.ts    # Utility functions
└── ...
```

![1](https://github.com/user-attachments/assets/59b8d28d-3a45-445e-9721-c1cc2a41d706)
![2](https://github.com/user-attachments/assets/efbfd46b-d5e8-4897-83db-ead2d576aac9)
![3](https://github.com/user-attachments/assets/c6b70522-de28-4f2b-ad1f-a3668092c2c0)
