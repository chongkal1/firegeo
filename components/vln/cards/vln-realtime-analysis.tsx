'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Brain, Search, CheckCircle, XCircle } from 'lucide-react';

interface VLNRealTimeAnalysisProps {
  data: {
    timestamp: Date;
    provider: string;
    query: string;
    brandMentioned: boolean;
    position?: number;
    context: string;
  }[];
}

export function VLNRealTimeAnalysis({ data }: VLNRealTimeAnalysisProps) {
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
      case 'OpenAI': return 'bg-green-100 text-green-800';
      case 'Anthropic': return 'bg-orange-100 text-orange-800';
      case 'Google': return 'bg-blue-100 text-blue-800';
      case 'Perplexity': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Generate some mock real-time data if empty
  const realTimeData = data.length > 0 ? data : [
    {
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      provider: 'OpenAI',
      query: 'Best tools for web development',
      brandMentioned: true,
      position: 2,
      context: 'Mentioned as a top choice for developers'
    },
    {
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      provider: 'Anthropic',
      query: 'Compare development platforms',
      brandMentioned: true,
      position: 1,
      context: 'Ranked #1 for ease of use'
    },
    {
      timestamp: new Date(Date.now() - 18 * 60 * 1000),
      provider: 'Google',
      query: 'Alternative development solutions',
      brandMentioned: false,
      context: 'Not mentioned in this query'
    },
    {
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      provider: 'Perplexity',
      query: 'Top rated development tools 2024',
      brandMentioned: true,
      position: 3,
      context: 'Listed among top 5 tools'
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-600" />
          Real-time Analysis Feed
        </CardTitle>
        <p className="text-gray-600 text-sm">
          Live snapshot of brand mentions across AI providers
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {realTimeData.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge className={getProviderColor(item.provider)}>
                    <span className="mr-1">{getProviderIcon(item.provider)}</span>
                    {item.provider}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {item.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {item.brandMentioned ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {item.position && (
                        <Badge variant="outline" className="text-xs">
                          #{item.position}
                        </Badge>
                      )}
                    </>
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">"{item.query}"</span>
                </div>
                
                <p className="text-sm text-gray-600 pl-6">
                  {item.context}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {realTimeData.filter(item => item.brandMentioned).length}
              </div>
              <div className="text-xs text-gray-600">Mentions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {realTimeData.length}
              </div>
              <div className="text-xs text-gray-600">Total Queries</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((realTimeData.filter(item => item.brandMentioned).length / realTimeData.length) * 100)}%
              </div>
              <div className="text-xs text-gray-600">Mention Rate</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}