import OpenAI from 'openai';
import logger from '../utils/logger';
import { CampaignAnalysis } from '../types/interfaces';
import { UrgencyLevel } from '../types/enums';
import dotenv from 'dotenv';
dotenv.config();
class LlmService {
  private openai: OpenAI | null = null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    console.log("apikey:-",apiKey);
    if (!apiKey) {
      logger.warn('OpenAI API key not found. LLM features will be disabled.');
      return;
    }
    this.openai = new OpenAI({ apiKey });
  }

  async analyzeCampaign(description: string): Promise<CampaignAnalysis> {
    if (!this.openai) {
      return this.generateFallbackAnalysis(description);
    }

    try {
      const prompt = `
        Analyze this nonprofit campaign description and provide:
        1. 3-5 relevant tags (comma-separated)
        2. A short summary (2-3 sentences)
        3. Category (e.g., disaster relief, education, healthcare, etc.)
        4. Urgency level (low, medium, high)

        Campaign: "${description}"

        Respond in JSON format:
        {
          "tags": ["tag1", "tag2", "tag3"],
          "summary": "Brief summary here",
          "category": "category name",
          "urgency": "low|medium|high"
        }
      `;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that analyzes nonprofit campaign descriptions.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      const analysis = JSON.parse(response);
      return {
        tags: analysis.tags || [],
        summary: analysis.summary || '',
        category: analysis.category,
        urgency: analysis.urgency as UrgencyLevel,
      };
    } catch (error) {
      logger.error('Error analyzing campaign with OpenAI:', error);
      return this.generateFallbackAnalysis(description);
    }
  }

  private generateFallbackAnalysis(description: string): CampaignAnalysis {
    const lowerDescription = description.toLowerCase();
    
    const tags: string[] = [];
    let category = 'general';
    let urgency = UrgencyLevel.MEDIUM;

    // Extract tags based on keywords
    if (lowerDescription.includes('emergency') || lowerDescription.includes('disaster')) {
      tags.push('emergency', 'disaster-relief');
      category = 'disaster-relief';
      urgency = UrgencyLevel.HIGH;
    }
    if (lowerDescription.includes('food') || lowerDescription.includes('hunger')) {
      tags.push('food-security', 'hunger-relief');
      category = 'food-security';
    }
    if (lowerDescription.includes('water') || lowerDescription.includes('clean')) {
      tags.push('water', 'sanitation');
      category = 'water-sanitation';
    }
    if (lowerDescription.includes('education') || lowerDescription.includes('school')) {
      tags.push('education', 'learning');
      category = 'education';
    }
    if (lowerDescription.includes('health') || lowerDescription.includes('medical')) {
      tags.push('healthcare', 'medical');
      category = 'healthcare';
    }
    if (lowerDescription.includes('children') || lowerDescription.includes('kids')) {
      tags.push('children', 'youth');
    }

    const summary = `Campaign focused on ${category.replace('-', ' ')}. ${description.substring(0, 100)}...`;

    return {
      tags: tags.length > 0 ? tags : ['nonprofit', 'charity'],
      summary,
      category,
      urgency,
    };
  }
}

export default new LlmService(); 