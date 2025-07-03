import { NextApiRequest, NextApiResponse } from 'next';
import { createTwitterAPI } from '../../lib/twitter';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { handle } = req.query;
    
    if (!handle || typeof handle !== 'string') {
      return res.status(400).json({
        error: 'Twitter handle is required',
        example: '/api/tweets?handle=elonmusk'
      });
    }

    const cleanHandle = handle.trim();
    console.log(`Fetching tweets for: ${cleanHandle}`);

    // Initialize Twitter API
    const twitterAPI = createTwitterAPI();

    // Get user and tweets
    const { tweets, userInfo } = await twitterAPI.getTweetsForSummary(cleanHandle, 10);

    if (!userInfo) {
      return res.status(404).json({
        error: 'Twitter user not found',
        handle: cleanHandle
      });
    }

    // Return the raw data for testing
    return res.status(200).json({
      success: true,
      userInfo: {
        id: userInfo.id,
        username: userInfo.username,
        name: userInfo.name
      },
      tweets: tweets,
      count: tweets.length,
      message: `Successfully fetched ${tweets.length} tweets from @${userInfo.username}`
    });

  } catch (error) {
    console.error('Error fetching tweets:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('TWITTER_BEARER_TOKEN')) {
        return res.status(500).json({
          error: 'Twitter API not configured',
          message: 'Please add TWITTER_BEARER_TOKEN to your .env.local file'
        });
      }
      
      if (error.message.includes('User not found')) {
        return res.status(404).json({
          error: 'Twitter user not found'
        });
      }
    }

    return res.status(500).json({
      error: 'Failed to fetch tweets',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 