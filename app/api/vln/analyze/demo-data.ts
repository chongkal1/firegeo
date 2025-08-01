interface DemoAIResponse {
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

interface DemoBrandAnalysisResult {
  brand: string;
  competitors: string[];
  overallVisibilityScore: number;
  aiProviderResponses: DemoAIResponse[];
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

export function generateDemoAnalysis(brand: string, competitors: string[]): DemoBrandAnalysisResult {
  const now = new Date();
  
  // Demo AI providers
  const demoProviders = [
    { name: 'ChatGPT', model: 'gpt-4o-mini' },
    { name: 'Claude', model: 'claude-3-haiku' },
    { name: 'Gemini', model: 'gemini-1.5-flash' },
    { name: 'Perplexity', model: 'llama-3.1-sonar' }
  ];

  // Demo prompts
  const demoPrompts = [
    `What are the top 5 companies in the same industry as ${brand}? Please rank them by market leadership and innovation.`,
    `Compare ${brand} with ${competitors.slice(0, 2).join(', ')}. Which company offers the best solution and why?`,
    `I'm looking for alternatives to ${brand}. What are the best competing solutions available?`,
    `Rank these companies by customer satisfaction: ${[brand, ...competitors.slice(0, 3)].join(', ')}.`
  ];

  // Generate demo responses
  const aiProviderResponses: DemoAIResponse[] = [];
  
  demoProviders.forEach((provider, providerIndex) => {
    demoPrompts.slice(0, 2).forEach((prompt, promptIndex) => {
      // Simulate varying brand visibility
      const brandMentioned = Math.random() > 0.3; // 70% chance of brand mention
      const brandPosition = brandMentioned && Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : undefined;
      
      // Generate competitor mentions
      const competitorMentions = competitors.map((competitor, index) => ({
        name: competitor,
        mentioned: Math.random() > 0.4, // 60% chance of competitor mention
        position: Math.random() > 0.6 ? Math.floor(Math.random() * 5) + 1 : undefined
      }));

      // Generate realistic demo response
      const allCompanies = [brand, ...competitors.slice(0, 3)];
      const shuffledCompanies = [...allCompanies].sort(() => Math.random() - 0.5);
      
      let demoResponse = '';
      if (prompt.includes('top 5 companies')) {
        demoResponse = `Based on market analysis, here are the top companies in this industry:\n\n1. ${shuffledCompanies[0]} - Market leader with innovative solutions\n2. ${shuffledCompanies[1]} - Strong customer base and reliable service\n3. ${shuffledCompanies[2]} - Growing rapidly with competitive pricing\n4. Industry Pioneer Corp - Established player with legacy systems\n5. Innovation Labs Inc - Emerging technology focus\n\nEach company has unique strengths in different market segments.`;
      } else if (prompt.includes('Compare')) {
        demoResponse = `When comparing these solutions:\n\n${brand} offers excellent user experience and robust features, making it ideal for businesses seeking comprehensive functionality. ${competitors[0] || 'Competitor A'} provides competitive pricing and good customer support. ${competitors[1] || 'Competitor B'} focuses on enterprise-grade security and scalability.\n\nFor most use cases, I'd recommend evaluating based on your specific needs: ${brand} for feature richness, ${competitors[0] || 'alternatives'} for budget-conscious decisions.`;
      } else if (prompt.includes('alternatives')) {
        demoResponse = `If you're looking for alternatives to ${brand}, here are some excellent options:\n\n• ${competitors[0] || 'Alternative A'} - Similar features with different pricing model\n• ${competitors[1] || 'Alternative B'} - Strong in enterprise environments\n• ${competitors[2] || 'Alternative C'} - Best for small to medium businesses\n• Market Leader Pro - Premium option with advanced features\n\nEach alternative has its own strengths depending on your specific requirements.`;
      } else {
        demoResponse = `Customer satisfaction rankings based on recent surveys:\n\n1. ${shuffledCompanies[0]} - 4.5/5 stars (Excellent user experience)\n2. ${shuffledCompanies[1]} - 4.2/5 stars (Reliable service)\n3. ${shuffledCompanies[2]} - 4.0/5 stars (Good value for money)\n\nFactors considered include ease of use, customer support quality, feature completeness, and overall value proposition.`;
      }

      // Determine sentiment
      const sentiments: ('positive' | 'neutral' | 'negative')[] = ['positive', 'neutral', 'negative'];
      const sentiment = brandMentioned ? 
        (Math.random() > 0.7 ? 'negative' : (Math.random() > 0.3 ? 'positive' : 'neutral')) :
        'neutral';

      aiProviderResponses.push({
        provider: provider.name,
        model: provider.model,
        prompt,
        response: demoResponse,
        brandMentioned,
        brandPosition,
        competitorMentions,
        sentiment,
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100% confidence
        timestamp: new Date(now.getTime() - Math.random() * 3600000) // Random time within last hour
      });
    });
  });

  // Calculate metrics
  const brandMentions = aiProviderResponses.filter(r => r.brandMentioned).length;
  const totalResponses = aiProviderResponses.length;
  const overallVisibilityScore = Math.round((brandMentions / totalResponses) * 100);

  // Calculate competitor comparison
  const competitorComparison = competitors.map(competitor => {
    const competitorMentions = aiProviderResponses.filter(r => 
      r.competitorMentions.some(cm => cm.name === competitor && cm.mentioned)
    ).length;
    
    const positions = aiProviderResponses
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
      sentiment: 'neutral' as const
    };
  });

  return {
    brand,
    competitors,
    overallVisibilityScore,
    aiProviderResponses,
    competitorComparison,
    analysisMetadata: {
      totalPromptsAnalyzed: aiProviderResponses.length,
      providersQueried: demoProviders.map(p => p.name),
      analysisTimestamp: now
    }
  };
}