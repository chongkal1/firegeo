import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { perplexity } from '@ai-sdk/perplexity';
import { generateText } from 'ai';
import { 
  validateBrandAnalysisRequest, 
  checkRateLimit, 
  createVLNError, 
  VLN_ERRORS 
} from '@/lib/vln-validation';
import { generateDemoAnalysis } from './demo-data';

interface AnalysisRequest {
  brand: string;
  competitors: string[];
}

interface AIProviderResponse {
  provider: string;
  model: string;
  prompt: string;
  response: string;
  brandMentioned: boolean;
  brandPosition?: number;
  competitorMentions: {
    name: string;
    mentioned: boolean;
    position?: number;
  }[];
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  timestamp: Date;
}

interface BrandAnalysisResult {
  brand: string;
  competitors: string[];
  overallVisibilityScore: number;
  aiProviderResponses: AIProviderResponse[];
  competitorComparison: {
    competitor: string;
    visibilityScore: number;
    mentionCount: number;
    averagePosition: number;
    sentiment: 'positive' | 'neutral' | 'negative';
  }[];
  analysisMetadata: {
    totalPromptsAnalyzed: number;
    providersQueried: string[];
    analysisTimestamp: Date;
  };
}

// AI Provider configurations
const AI_PROVIDERS = [
  {
    id: 'openai',
    name: 'ChatGPT',
    model: 'gpt-4o-mini',
    provider: openai,
    enabled: !!process.env.OPENAI_API_KEY
  },
  {
    id: 'anthropic',
    name: 'Claude',
    model: 'claude-3-haiku-20240307',
    provider: anthropic,
    enabled: !!process.env.ANTHROPIC_API_KEY
  },
  {
    id: 'google',
    name: 'Gemini',
    model: 'gemini-1.5-flash',
    provider: google,
    enabled: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    model: 'llama-3.1-sonar-small-128k-online',
    provider: perplexity,
    enabled: !!process.env.PERPLEXITY_API_KEY
  }
];

// Generate analysis prompts
function generateAnalysisPrompts(brand: string, competitors: string[]): string[] {
  const allCompanies = [brand, ...competitors];
  
  return [
    `What are the top 5 companies in the same industry as ${brand}? Please rank them by market leadership and innovation.`,
    `Compare ${brand} with ${competitors.slice(0, 3).join(', ')}. Which company offers the best solution and why?`,
    `I'm looking for alternatives to ${brand}. What are the best competing solutions available?`,
    `Rank these companies by customer satisfaction and product quality: ${allCompanies.join(', ')}.`,
    `Which company between ${brand} and ${competitors[0] || 'their main competitor'} would you recommend for a business solution?`,
    `What are the pros and cons of ${brand} compared to its main competitors?`,
    `List the market leaders in ${brand}'s industry and explain their competitive advantages.`,
    `If I had to choose between ${allCompanies.slice(0, 4).join(', ')}, which would be the best option and why?`
  ];
}

// Analyze AI response for brand mentions and sentiment
function analyzeResponse(response: string, brand: string, competitors: string[]): {
  brandMentioned: boolean;
  brandPosition?: number;
  competitorMentions: { name: string; mentioned: boolean; position?: number }[];
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
} {
  const responseText = response.toLowerCase();
  const brandLower = brand.toLowerCase();
  
  // Check brand mention
  const brandMentioned = responseText.includes(brandLower) || 
                        responseText.includes(brand.toLowerCase().replace(/\./g, ''));
  
  // Find brand position (simple ranking detection)
  let brandPosition: number | undefined;
  const rankingPatterns = [
    /1\.\s*([^.\n]+)/g,
    /2\.\s*([^.\n]+)/g,
    /3\.\s*([^.\n]+)/g,
    /4\.\s*([^.\n]+)/g,
    /5\.\s*([^.\n]+)/g,
  ];
  
  rankingPatterns.forEach((pattern, index) => {
    const matches = [...responseText.matchAll(pattern)];
    matches.forEach(match => {
      if (match[1] && match[1].includes(brandLower)) {
        brandPosition = index + 1;
      }
    });
  });
  
  // Analyze competitor mentions
  const competitorMentions = competitors.map(competitor => {
    const competitorLower = competitor.toLowerCase();
    const mentioned = responseText.includes(competitorLower) || 
                     responseText.includes(competitor.toLowerCase().replace(/\./g, ''));
    
    let position: number | undefined;
    rankingPatterns.forEach((pattern, index) => {
      const matches = [...responseText.matchAll(pattern)];
      matches.forEach(match => {
        if (match[1] && match[1].includes(competitorLower)) {
          position = index + 1;
        }
      });
    });
    
    return {
      name: competitor,
      mentioned,
      position
    };
  });
  
  // Simple sentiment analysis
  const positiveWords = ['best', 'excellent', 'great', 'outstanding', 'superior', 'leading', 'innovative', 'recommended'];
  const negativeWords = ['worst', 'poor', 'bad', 'inferior', 'limited', 'lacking', 'problematic'];
  
  const brandContext = responseText.split(brandLower).join(' BRAND ');
  const positiveCount = positiveWords.reduce((count, word) => 
    count + (brandContext.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length, 0);
  const negativeCount = negativeWords.reduce((count, word) => 
    count + (brandContext.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length, 0);
  
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  if (positiveCount > negativeCount) sentiment = 'positive';
  else if (negativeCount > positiveCount) sentiment = 'negative';
  
  const confidence = Math.min(100, Math.max(50, (positiveCount + negativeCount) * 20 + 50));
  
  return {
    brandMentioned,
    brandPosition,
    competitorMentions,
    sentiment,
    confidence
  };
}

// Query a single AI provider
async function queryAIProvider(
  providerConfig: typeof AI_PROVIDERS[0],
  prompt: string,
  brand: string,
  competitors: string[]
): Promise<AIProviderResponse> {
  try {
    const { text } = await generateText({
      model: providerConfig.provider(providerConfig.model),
      prompt,
      maxTokens: 1000,
    });

    const analysis = analyzeResponse(text, brand, competitors);
    
    return {
      provider: providerConfig.name,
      model: providerConfig.model,
      prompt,
      response: text,
      ...analysis,
      timestamp: new Date()
    };
  } catch (error) {
    console.error(`Error querying ${providerConfig.name}:`, error);
    
    return {
      provider: providerConfig.name,
      model: providerConfig.model,
      prompt,
      response: `Error: Unable to get response from ${providerConfig.name}`,
      brandMentioned: false,
      competitorMentions: competitors.map(c => ({ name: c, mentioned: false })),
      sentiment: 'neutral',
      confidence: 0,
      timestamp: new Date()
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json();
    const { brand, competitors } = body;

    // Validate the request
    const validation = validateBrandAnalysisRequest(brand, competitors || []);
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.errors 
      }, { status: 400 });
    }

    // Rate limiting (using IP address as identifier)
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'anonymous';
    
    const rateLimit = checkRateLimit(clientIP, 5, 60); // 5 requests per hour
    if (!rateLimit.allowed) {
      return NextResponse.json({ 
        error: 'Rate limit exceeded', 
        resetTime: rateLimit.resetTime.toISOString() 
      }, { status: 429 });
    }

    const { brand: cleanBrand, competitors: cleanCompetitors } = validation.data!;

    // Get enabled AI providers
    const enabledProviders = AI_PROVIDERS.filter(p => p.enabled);
    
    if (enabledProviders.length === 0) {
      // Return demo data when no AI providers are configured
      console.log('No AI providers configured, returning demo data');
      const demoResult = generateDemoAnalysis(cleanBrand, cleanCompetitors);
      return NextResponse.json(demoResult);
    }

    // Generate analysis prompts
    const prompts = generateAnalysisPrompts(cleanBrand, cleanCompetitors);
    
    // Query all providers with all prompts
    const allResponses: AIProviderResponse[] = [];
    
    for (const provider of enabledProviders) {
      for (const prompt of prompts.slice(0, 3)) { // Limit to 3 prompts per provider for demo
        const response = await queryAIProvider(provider, prompt, cleanBrand, cleanCompetitors);
        allResponses.push(response);
      }
    }

    // Calculate overall metrics
    const brandMentions = allResponses.filter(r => r.brandMentioned).length;
    const totalResponses = allResponses.length;
    const overallVisibilityScore = Math.round((brandMentions / totalResponses) * 100);

    // Calculate competitor comparison
    const competitorComparison = cleanCompetitors.map(competitor => {
      const competitorMentions = allResponses.filter(r => 
        r.competitorMentions.some(cm => cm.name === competitor && cm.mentioned)
      ).length;
      
      const positions = allResponses
        .flatMap(r => r.competitorMentions)
        .filter(cm => cm.name === competitor && cm.position)
        .map(cm => cm.position!);
      
      const averagePosition = positions.length > 0 
        ? Math.round(positions.reduce((a, b) => a + b, 0) / positions.length)
        : 0;

      const visibilityScore = Math.round((competitorMentions / totalResponses) * 100);

      return {
        competitor,
        visibilityScore,
        mentionCount: competitorMentions,
        averagePosition,
        sentiment: 'neutral' as const // Simplified for demo
      };
    });

    const result: BrandAnalysisResult = {
      brand: cleanBrand,
      competitors: cleanCompetitors,
      overallVisibilityScore,
      aiProviderResponses: allResponses,
      competitorComparison,
      analysisMetadata: {
        totalPromptsAnalyzed: allResponses.length,
        providersQueried: enabledProviders.map(p => p.name),
        analysisTimestamp: new Date()
      }
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to perform brand analysis' },
      { status: 500 }
    );
  }
}