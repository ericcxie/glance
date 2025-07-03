<div align="center">
    <div id="user-content-toc">
      <ul>
          <summary><h1 style="display: inline-block; margin-bottom:0px">Glance</h1></summary>
      </ul>
    </div>
    <h3>Your AI cheat sheet before every connection.</h3>
    <h4><i>Summarize anyone’s online X (Twitter) presence at a glance.</i></h4>
    <br>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white"/>
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>
    <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
    <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white"/>
    <img src="https://img.shields.io/badge/Twitter%20API-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white"/>
    <img src="https://img.shields.io/badge/Vercel-000000.svg?style=for-the-badge&logo=Vercel&logoColor=white"/>
    <br><br>
</div>

<img width="1207" alt="Screenshot 2025-07-03 at 17 46 46@2x" src="https://github.com/user-attachments/assets/b665f90b-9897-4b0f-82a1-f9e1fda0b86a" />

## What is Glance?

_Glance is a modern AI-powered social summarization tool that provides intelligent analysis of public X (Twitter) users' recent tweets. It helps you understand their interests, mood, and current topics without scrolling through endless timelines._

## Getting Started

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# X (Twitter) API v2 Bearer Token
# Get this from https://developer.twitter.com/en/portal/dashboard
TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here

# OpenAI API Key
# Get this from https://platform.openai.com/account/api-keys
OPENAI_API_KEY=your_openai_api_key_here
```

### Getting API Keys

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

### Installation and Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   
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
│       ├── health.ts   # Health check endpoint
│       ├── summarize.ts # Main API endpoint
│       └── tweets.ts   # Tweet fetching endpoint
├── src/
│   ├── app/            # Next.js app router
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── ui/         # UI components
│   └── lib/
│       └── utils.ts    # Utility functions
└── ...
```

## Features

- **Simple API**: Just provide a Twitter handle
- **Smart Filtering**: Automatically filters out replies and retweets
- **AI-Powered**: Uses OpenAI to generate natural language summaries
- **Detailed Analysis**: Optional detailed breakdown with topics and sentiment
- **Error Handling**: Comprehensive error handling for various scenarios
- **Modern UI**: Built with Next.js and Tailwind CSS

## Future Enhancements

### Follow-up Questions (Post-MVP)
- Allow users to ask follow-up questions about the user's tweets
- Examples: "What projects are they working on?", "Are they hiring?", "What's their opinion on AI?"
- Interactive chat interface for deeper insights
