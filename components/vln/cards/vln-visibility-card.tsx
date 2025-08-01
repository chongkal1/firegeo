'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Eye } from 'lucide-react';

interface VLNVisibilityCardProps {
  data: {
    score: number;
    mentions: number;
    averagePosition: number;
    sentiment: 'positive' | 'neutral' | 'negative';
  };
  brandDomain: string;
}

export function VLNVisibilityCard({ data, brandDomain }: VLNVisibilityCardProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="w-4 h-4" />;
      case 'negative': return <TrendingDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-600" />
          Brand Visibility Tracking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Score */}
        <div className="text-center">
          <div className={`text-6xl font-bold ${getScoreColor(data.score)} mb-2`}>
            {data.score}%
          </div>
          <p className="text-gray-600">Overall Visibility Score</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-900">{data.mentions}</div>
            <div className="text-blue-600 text-sm">Total Mentions</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-900">#{data.averagePosition.toFixed(1)}</div>
            <div className="text-purple-600 text-sm">Avg Position</div>
          </div>
        </div>

        {/* Sentiment */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-700">Brand Sentiment</span>
          <Badge className={getSentimentColor(data.sentiment)}>
            {getSentimentIcon(data.sentiment)}
            <span className="ml-1 capitalize">{data.sentiment}</span>
          </Badge>
        </div>

        {/* Brand Info */}
        <div className="border-t pt-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">{brandDomain}</span> appears in AI search results with strong visibility metrics across multiple providers.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}