import OpenAI from 'openai';

export interface SummaryOptions {
  maxLength?: number;
  includeUserInfo?: boolean;
  username?: string;
  name?: string;
}

export class OpenAIService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  /**
   * Generate a summary of tweets using OpenAI
   */
  async generateSummary(
    tweets: string[], 
    options: SummaryOptions = {}
  ): Promise<string> {
    const { maxLength = 200, includeUserInfo = false, username, name } = options;

    // If no tweets, return a default message
    if (tweets.length === 0) {
      return "This user hasn't posted any recent tweets to summarize.";
    }

    // Prepare the tweets for the prompt
    const tweetsText = tweets
      .slice(0, 20) // Limit to first 20 tweets to avoid token limits
      .map((tweet, index) => `${index + 1}. ${tweet}`)
      .join('\n');

    // Create the prompt
    const userInfo = includeUserInfo && username ? `@${username}${name ? ` (${name})` : ''}` : 'This user';
    
    const prompt = `Analyze the following recent tweets and provide a concise summary in 2-3 sentences. 
Focus on the user's main interests, current topics they're discussing, their general tone/sentiment, and any notable patterns or themes.

Recent tweets from ${userInfo}:
${tweetsText}

Please provide a natural, engaging summary that captures:
1. Their main interests and topics
2. Their current mood/tone
3. Any notable trends or patterns
4. Keep it under ${maxLength} characters

Summary:`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      const summary = response.choices[0]?.message?.content?.trim();
      
      if (!summary) {
        throw new Error('No summary generated');
      }

      return summary;
    } catch (error) {
      console.error('Error generating summary:', error);
      throw new Error('Failed to generate summary');
    }
  }

  /**
   * Generate a more detailed analysis if needed
   */
  async generateDetailedAnalysis(
    tweets: string[], 
    options: SummaryOptions = {}
  ): Promise<{
    summary: string;
    topics: string[];
    sentiment: string;
    engagement: string;
  }> {
    const { username, name } = options;

    if (tweets.length === 0) {
      return {
        summary: "This user hasn't posted any recent tweets to analyze.",
        topics: [],
        sentiment: 'neutral',
        engagement: 'low'
      };
    }

    const tweetsText = tweets
      .slice(0, 20)
      .map((tweet, index) => `${index + 1}. ${tweet}`)
      .join('\n');

    const userInfo = username ? `@${username}${name ? ` (${name})` : ''}` : 'This user';
    
    const prompt = `Analyze the following recent tweets and provide a structured analysis:

Recent tweets from ${userInfo}:
${tweetsText}

Please provide a JSON response with the following structure:
{
  "summary": "2-3 sentence summary of their recent activity",
  "topics": ["topic1", "topic2", "topic3"],
  "sentiment": "positive/negative/neutral/mixed",
  "engagement": "high/medium/low"
}

Analysis:`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.5,
      });

      const content = response.choices[0]?.message?.content?.trim();
      
      if (!content) {
        throw new Error('No analysis generated');
      }

      try {
        const analysis = JSON.parse(content);
        return analysis;
      } catch (parseError) {
        // Fallback to simple summary if JSON parsing fails
        return {
          summary: content,
          topics: [],
          sentiment: 'neutral',
          engagement: 'medium'
        };
      }
    } catch (error) {
      console.error('Error generating detailed analysis:', error);
      throw new Error('Failed to generate detailed analysis');
    }
  }
}

// Helper function to create OpenAI service instance
export function createOpenAIService(): OpenAIService {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }
  return new OpenAIService(apiKey);
} 