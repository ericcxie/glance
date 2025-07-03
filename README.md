# Glance - AI-Powered Social Summarization Tool

Glance provides a high-level summary of any public X (Twitter) user's recent tweets, helping you understand their interests, mood, and current topics at a glance.

## Tech Stack

- **Frontend**: Next.js + Tailwind CSS
- **Backend**: Node.js (via Next.js API Routes)
- **APIs**: X (Twitter) API v2, OpenAI API

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# X (Twitter) API v2 Bearer Token
# Get this from https://developer.twitter.com/en/portal/dashboard
TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here

# OpenAI API Key
# Get this from https://platform.openai.com/account/api-keys
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Getting API Keys

#### Twitter API v2 Bearer Token:
1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new app or use an existing one
3. Navigate to "Keys and Tokens"
4. Generate a Bearer Token
5. Copy the Bearer Token to your `.env.local` file

#### OpenAI API Key:
1. Go to [OpenAI Platform](https://platform.openai.com/account/api-keys)
2. Create a new API key
3. Copy the API key to your `.env.local` file

### 3. Installation

```bash
npm install
```

### 4. Running the Development Server

```bash
npm run dev
```

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

## Project Structure

```
glance/
├── lib/
│   ├── twitter.ts      # X API integration
│   └── openai.ts       # OpenAI API integration
├── pages/
│   └── api/
│       └── summarize.ts # Main API endpoint
├── src/
│   └── app/            # Next.js app router
└── ...
```

## Features

- **Simple API**: Just provide a Twitter handle
- **Smart Filtering**: Automatically filters out replies and retweets
- **AI-Powered**: Uses OpenAI to generate natural language summaries
- **Detailed Analysis**: Optional detailed breakdown with topics and sentiment
- **Error Handling**: Comprehensive error handling for various scenarios

## Next Steps

1. Set up your environment variables
2. Test the API endpoints
3. Build the frontend interface
4. Deploy to production

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
