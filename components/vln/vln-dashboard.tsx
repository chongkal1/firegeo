'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Brain, 
  BarChart3, 
  Eye,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { VLNAnalysisData } from './vln-brand-monitor';
import { VLNVisibilityCard } from './cards/vln-visibility-card';
import { VLNCompetitorChart } from './cards/vln-competitor-chart';
import { VLNRealTimeAnalysis } from './cards/vln-realtime-analysis';
import { VLNProviderResults } from './cards/vln-provider-results';

interface VLNDashboardProps {
  data: VLNAnalysisData;
  onRestart: () => void;
}

export function VLNDashboard({ data, onRestart }: VLNDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const { brandVisibility, competitorAnalysis, providerResults, realTimeAnalysis } = data.results;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Brand Visibility Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Analysis for <span className="font-medium text-blue-600">{data.brandDomain}</span> • 
            Last updated {data.analyzedAt.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={onRestart}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            New Analysis
          </Button>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Visibility Score</p>
                <p className="text-3xl font-bold text-blue-900">{brandVisibility.score}%</p>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total Mentions</p>
                <p className="text-3xl font-bold text-green-900">{brandVisibility.mentions}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Avg Position</p>
                <p className="text-3xl font-bold text-purple-900">#{brandVisibility.averagePosition.toFixed(1)}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Sentiment</p>
                <p className="text-2xl font-bold text-orange-900 capitalize">{brandVisibility.sentiment}</p>
              </div>
              <Brain className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
          <TabsTrigger value="providers">AI Providers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VLNVisibilityCard data={brandVisibility} brandDomain={data.brandDomain} />
            <VLNCompetitorChart 
              brandData={brandVisibility}
              competitorData={competitorAnalysis}
              brandDomain={data.brandDomain}
            />
          </div>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6">
          <VLNCompetitorChart 
            brandData={brandVisibility}
            competitorData={competitorAnalysis}
            brandDomain={data.brandDomain}
            detailed={true}
          />
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <VLNRealTimeAnalysis data={realTimeAnalysis} />
        </TabsContent>

        <TabsContent value="providers" className="space-y-6">
          <VLNProviderResults data={providerResults} brandDomain={data.brandDomain} />
        </TabsContent>
      </Tabs>
    </div>
  );
}