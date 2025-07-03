import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check environment variables
  const twitterToken = process.env.TWITTER_BEARER_TOKEN;
  const openaiKey = process.env.OPENAI_API_KEY;

  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: {
      twitterConfigured: !!twitterToken,
      openaiConfigured: !!openaiKey,
      nodeEnv: process.env.NODE_ENV || 'development'
    },
    endpoints: {
      summarize: '/api/summarize?handle=USERNAME',
      health: '/api/health'
    }
  });
} 