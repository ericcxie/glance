import { NextApiRequest, NextApiResponse } from 'next';
import { createTwitterAPI } from '../../lib/twitter';
import { createOpenAIService } from '../../lib/openai';

export interface SummarizeRequest {
  handle: string;
  detailed?: boolean;
}

export interface SummarizeResponse {
  success: boolean;
  data?: {
    summary: string;
    userInfo: {
      username: string;
      name: string;
    };
    tweetCount: number;
    topics?: string[];
    sentiment?: string;
    engagement?: string;
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SummarizeResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    // Get the handle from query parameters
    const { handle, detailed } = req.query;
    
    if (!handle || typeof handle !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Twitter handle is required'
      });
    }

    // Validate handle format
    const cleanHandle = handle.trim();
    if (!cleanHandle) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Twitter handle'
      });
    }

    console.log(`Processing summary request for: ${cleanHandle}`);

    // Initialize services
    const twitterAPI = createTwitterAPI();
    const openAIService = createOpenAIService();

    // Fetch tweets
    const { tweets, userInfo } = await twitterAPI.getTweetsForSummary(cleanHandle, 50);

    if (!userInfo) {
      return res.status(404).json({
        success: false,
        error: 'Twitter user not found'
      });
    }

    console.log(`Found ${tweets.length} tweets for ${userInfo.username}`);

    // Generate summary
    const isDetailed = detailed === 'true' || detailed === '1';
    
    if (isDetailed) {
      // Generate detailed analysis
      const analysis = await openAIService.generateDetailedAnalysis(tweets, {
        username: userInfo.username,
        name: userInfo.name,
        includeUserInfo: true
      });

      return res.status(200).json({
        success: true,
        data: {
          summary: analysis.summary,
          userInfo: {
            username: userInfo.username,
            name: userInfo.name
          },
          tweetCount: tweets.length,
          topics: analysis.topics,
          sentiment: analysis.sentiment,
          engagement: analysis.engagement
        }
      });
    } else {
      // Generate simple summary
      const summary = await openAIService.generateSummary(tweets, {
        username: userInfo.username,
        name: userInfo.name,
        includeUserInfo: true,
        maxLength: 250
      });

      return res.status(200).json({
        success: true,
        data: {
          summary,
          userInfo: {
            username: userInfo.username,
            name: userInfo.name
          },
          tweetCount: tweets.length
        }
      });
    }

  } catch (error) {
    console.error('Error in summarize API:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('User not found')) {
        return res.status(404).json({
          success: false,
          error: 'Twitter user not found'
        });
      }
      
      if (error.message.includes('TWITTER_BEARER_TOKEN')) {
        return res.status(500).json({
          success: false,
          error: 'Twitter API configuration error'
        });
      }
      
      if (error.message.includes('OPENAI_API_KEY')) {
        return res.status(500).json({
          success: false,
          error: 'OpenAI API configuration error'
        });
      }
      
      if (error.message.includes('rate limit')) {
        return res.status(429).json({
          success: false,
          error: 'Rate limit exceeded. Please try again later.'
        });
      }
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
} 