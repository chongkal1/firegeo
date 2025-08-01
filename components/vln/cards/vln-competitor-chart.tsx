'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Trophy, TrendingUp } from 'lucide-react';

interface VLNCompetitorChartProps {
  brandData: {
    score: number;
    mentions: number;
    averagePosition: number;
    sentiment: 'positive' | 'neutral' | 'negative';
  };
  competitorData: {
    competitor: string;
    score: number;
    mentions: number;
    averagePosition: number;
    sentiment: 'positive' | 'neutral' | 'negative';
  }[];
  brandDomain: string;
  detailed?: boolean;
}

export function VLNCompetitorChart({ 
  brandData, 
  competitorData, 
  brandDomain, 
  detailed = false 
}: VLNCompetitorChartProps) {
  // Combine brand and competitor data for chart
  const chartData = [
    {
      name: brandDomain,
      score: brandData.score,
      mentions: brandData.mentions,
      position: brandData.averagePosition,
      sentiment: brandData.sentiment,
      isBrand: true
    },
    ...competitorData.map(comp => ({
      name: comp.competitor,
      score: comp.score,
      mentions: comp.mentions,
      position: comp.averagePosition,
      sentiment: comp.sentiment,
      isBrand: false
    }))
  ].sort((a, b) => b.score - a.score);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBarColor = (isBrand: boolean, index: number) => {
    if (isBrand) return '#3b82f6'; // Blue for brand
    const colors = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#6366f1', '#14b8a6'];
    return colors[index % colors.length];
  };

  const brandRank = chartData.findIndex(item => item.isBrand) + 1;

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Competitor Analysis
          </CardTitle>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium">Rank #{brandRank}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'Visibility Score (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-medium">{label}</p>
                        <p className="text-blue-600">Score: {data.score}%</p>
                        <p className="text-gray-600">Mentions: {data.mentions}</p>
                        <p className="text-gray-600">Avg Position: #{data.position.toFixed(1)}</p>
                        <Badge className={getSentimentColor(data.sentiment)}>
                          {data.sentiment}
                        </Badge>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.isBrand, index)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Table (if detailed view) */}
        {detailed && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Rank</th>
                  <th className="text-left p-3 font-medium">Brand/Competitor</th>
                  <th className="text-right p-3 font-medium">Score</th>
                  <th className="text-right p-3 font-medium">Mentions</th>
                  <th className="text-right p-3 font-medium">Avg Position</th>
                  <th className="text-center p-3 font-medium">Sentiment</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((item, index) => (
                  <tr key={item.name} className={`border-b hover:bg-gray-50 ${item.isBrand ? 'bg-blue-50' : ''}`}>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">#{index + 1}</span>
                        {index === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`font-medium ${item.isBrand ? 'text-blue-600' : 'text-gray-900'}`}>
                        {item.name}
                      </span>
                      {item.isBrand && (
                        <Badge variant="outline" className="ml-2 text-xs">Your Brand</Badge>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <span className={`font-bold ${getScoreColor(item.score)}`}>
                        {item.score}%
                      </span>
                    </td>
                    <td className="p-3 text-right">{item.mentions}</td>
                    <td className="p-3 text-right">#{item.position.toFixed(1)}</td>
                    <td className="p-3 text-center">
                      <Badge className={getSentimentColor(item.sentiment)}>
                        {item.sentiment}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">Performance Summary</span>
          </div>
          <p className="text-sm text-blue-800">
            {brandDomain} ranks #{brandRank} out of {chartData.length} brands with a {brandData.score}% visibility score.
            {brandRank === 1 && " 🎉 You're leading the competition!"}
            {brandRank <= 3 && brandRank > 1 && " Strong performance in the top 3!"}
            {brandRank > 3 && " Room for improvement to climb the rankings."}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  function getScoreColor(score: number): string {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }
}