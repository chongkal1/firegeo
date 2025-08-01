'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, MessageSquare, CheckCircle, XCircle, Hash } from 'lucide-react';

interface VLNProviderResultsProps {
  data: {
    provider: string;
    responses: {
      prompt: string;
      response: string;
      brandMentioned: boolean;
      brandPosition?: number;
      competitors: string[];
    }[];
  }[];
  brandDomain: string;
}

export function VLNProviderResults({ data, brandDomain }: VLNProviderResultsProps) {
  const [selectedProvider, setSelectedProvider] = useState(data[0]?.provider || 'OpenAI');

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'OpenAI': return '🤖';
      case 'Anthropic': return '🧠';
      case 'Google': return '🌟';
      case 'Perplexity': return '🔍';
      default: return '🤖';
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'OpenAI': return 'bg-green-100 text-green-800 border-green-200';
      case 'Anthropic': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Google': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Perplexity': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Generate mock data if empty
  const providerData = data.length > 0 ? data : [
    {
      provider: 'OpenAI',
      responses: [
        {
          prompt: `Best tools like ${brandDomain}`,
          response: `Here are the top development tools: 1. ${brandDomain} - Excellent for rapid prototyping and deployment. 2. Vercel - Great for frontend deployment. 3. Netlify - Strong static site hosting...`,
          brandMentioned: true,
          brandPosition: 1,
          competitors: ['Vercel', 'Netlify', 'Heroku']
        }
      ]
    },
    {
      provider: 'Anthropic',
      responses: [
        {
          prompt: `Compare ${brandDomain} vs competitors`,
          response: `When comparing development platforms, ${brandDomain} offers unique advantages in terms of ease of use and integration capabilities...`,
          brandMentioned: true,
          brandPosition: 2,
          competitors: ['Vercel', 'Railway', 'Render']
        }
      ]
    },
    {
      provider: 'Google',
      responses: [
        {
          prompt: `${brandDomain} alternatives and competitors`,
          response: `For development and deployment needs, there are several alternatives to consider. Each platform has its strengths...`,
          brandMentioned: false,
          competitors: ['Vercel', 'Netlify', 'Firebase']
        }
      ]
    },
    {
      provider: 'Perplexity',
      responses: [
        {
          prompt: `Top development platforms 2024`,
          response: `The development platform landscape in 2024 includes several strong options: ${brandDomain} stands out for its developer experience...`,
          brandMentioned: true,
          brandPosition: 3,
          competitors: ['Vercel', 'Supabase', 'PlanetScale']
        }
      ]
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-600" />
          Multi-AI Provider Results
        </CardTitle>
        <p className="text-gray-600 text-sm">
          Detailed responses from each AI provider
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedProvider} onValueChange={setSelectedProvider}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            {providerData.map((provider) => (
              <TabsTrigger 
                key={provider.provider} 
                value={provider.provider}
                className="flex items-center gap-2"
              >
                <span>{getProviderIcon(provider.provider)}</span>
                <span className="hidden sm:inline">{provider.provider}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {providerData.map((provider) => (
            <TabsContent key={provider.provider} value={provider.provider} className="space-y-4">
              {/* Provider Summary */}
              <div className={`rounded-lg p-4 border ${getProviderColor(provider.provider)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <span>{getProviderIcon(provider.provider)}</span>
                    {provider.provider} Analysis
                  </h3>
                  <Badge variant="outline">
                    {provider.responses.length} {provider.responses.length === 1 ? 'Query' : 'Queries'}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Brand Mentions:</span>
                    <span className="ml-2">
                      {provider.responses.filter(r => r.brandMentioned).length}/{provider.responses.length}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Avg Position:</span>
                    <span className="ml-2">
                      #{provider.responses
                        .filter(r => r.brandPosition)
                        .reduce((sum, r) => sum + (r.brandPosition || 0), 0) / 
                        Math.max(1, provider.responses.filter(r => r.brandPosition).length) || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Competitors Found:</span>
                    <span className="ml-2">
                      {new Set(provider.responses.flatMap(r => r.competitors)).size}
                    </span>
                  </div>
                </div>
              </div>

              {/* Individual Responses */}
              <div className="space-y-4">
                {provider.responses.map((response, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-700">"{response.prompt}"</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {response.brandMentioned ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {response.brandPosition && (
                              <Badge variant="outline" className="text-xs">
                                <Hash className="w-3 h-3 mr-1" />
                                {response.brandPosition}
                              </Badge>
                            )}
                          </>
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {response.response.length > 200 
                          ? `${response.response.substring(0, 200)}...` 
                          : response.response
                        }
                      </p>
                    </div>
                    
                    {response.competitors.length > 0 && (
                      <div>
                        <span className="text-xs text-gray-500 mb-2 block">Competitors mentioned:</span>
                        <div className="flex flex-wrap gap-1">
                          {response.competitors.slice(0, 5).map((competitor, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {competitor}
                            </Badge>
                          ))}
                          {response.competitors.length > 5 && (
                            <Badge variant="secondary" className="text-xs">
                              +{response.competitors.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}