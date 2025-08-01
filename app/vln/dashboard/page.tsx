'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  BarChart3, 
  Zap, 
  Users, 
  ArrowLeft, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Brain,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

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

export default function VLNDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const brand = searchParams.get('brand') || '';
  const competitors = searchParams.get('competitors')?.split(',').filter(Boolean) || [];
  
  const [analysisData, setAnalysisData] = useState<BrandAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (brand) {
      performAnalysis();
    } else {
      router.push('/');
    }
  }, [brand, competitors]);

  const performAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/vln/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brand,
          competitors
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setAnalysisData(data);
    } catch (err) {
      setError('Failed to analyze brand visibility. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    router.push(`/vln/setup?domain=${encodeURIComponent(brand)}`);
  };

  const getVisibilityScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'negative': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Analyzing Brand Visibility</h2>
            <p className="text-slate-600 mb-4">Querying AI models for brand mentions and rankings...</p>
            <div className="space-y-2 text-sm text-slate-500">
              <p>• Generating competitive analysis prompts</p>
              <p>• Querying ChatGPT, Claude, Gemini, and Perplexity</p>
              <p>• Analyzing brand mentions and sentiment</p>
              <p>• Calculating visibility scores</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg max-w-md">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Analysis Failed</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={goBack}>
                Go Back
              </Button>
              <Button onClick={performAnalysis}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Analysis
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Prepare chart data
  const competitorChartData = [
    { name: brand, score: analysisData.overallVisibilityScore, isYourBrand: true },
    ...analysisData.competitorComparison.map(comp => ({
      name: comp.competitor,
      score: comp.visibilityScore,
      isYourBrand: false
    }))
  ];

  const providerData = analysisData.analysisMetadata.providersQueried.map(provider => {
    const providerResponses = analysisData.aiProviderResponses.filter(r => r.provider === provider);
    const mentions = providerResponses.filter(r => r.brandMentioned).length;
    const total = providerResponses.length;
    const score = total > 0 ? Math.round((mentions / total) * 100) : 0;
    
    return {
      provider,
      score,
      mentions,
      total
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
              VLN Brand Intelligence Dashboard
            </Badge>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Brand Visibility Report
            </h1>
            <p className="text-xl text-slate-600">
              Analysis for <span className="font-semibold">{brand}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={goBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={performAnalysis}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Analysis
            </Button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Overall Visibility</p>
                  <p className={`text-3xl font-bold ${getVisibilityScoreColor(analysisData.overallVisibilityScore)}`}>
                    {analysisData.overallVisibilityScore}%
                  </p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
              <Progress value={analysisData.overallVisibilityScore} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">AI Providers</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {analysisData.analysisMetadata.providersQueried.length}
                  </p>
                </div>
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-sm text-slate-500 mt-2">
                {analysisData.analysisMetadata.providersQueried.join(', ')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Prompts Analyzed</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {analysisData.analysisMetadata.totalPromptsAnalyzed}
                  </p>
                </div>
                <Search className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Across {competitors.length + 1} brands
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Last Updated</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {new Date(analysisData.analysisMetadata.analysisTimestamp).toLocaleTimeString()}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-sm text-slate-500 mt-2">
                {new Date(analysisData.analysisMetadata.analysisTimestamp).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Four Key Analytics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. Brand Visibility Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Brand Visibility Tracking
              </CardTitle>
              <CardDescription>
                How often your brand appears in AI model responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Visibility Score</span>
                  <span className={`text-2xl font-bold ${getVisibilityScoreColor(analysisData.overallVisibilityScore)}`}>
                    {analysisData.overallVisibilityScore}%
                  </span>
                </div>
                <Progress value={analysisData.overallVisibilityScore} className="h-3" />
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {analysisData.aiProviderResponses.filter(r => r.brandMentioned).length}
                    </p>
                    <p className="text-sm text-slate-600">Brand Mentions</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {analysisData.aiProviderResponses.filter(r => r.brandPosition && r.brandPosition <= 3).length}
                    </p>
                    <p className="text-sm text-slate-600">Top 3 Rankings</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Competitor Analysis Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Competitor Analysis
              </CardTitle>
              <CardDescription>
                Compare your visibility scores against competitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={competitorChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="score" 
                      fill={(entry) => entry.isYourBrand ? "#2563eb" : "#94a3b8"}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 3. Real-time Analysis Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-600" />
                Real-time Analysis Feed
              </CardTitle>
              <CardDescription>
                Latest brand mentions across AI platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {analysisData.aiProviderResponses.slice(0, 5).map((response, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {response.provider}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {getSentimentIcon(response.sentiment)}
                        <span className="text-xs text-slate-500">
                          {new Date(response.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 line-clamp-2">
                      {response.prompt}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {response.brandMentioned ? (
                        <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                          Brand Mentioned
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          No Mention
                        </Badge>
                      )}
                      {response.brandPosition && (
                        <Badge variant="outline" className="text-xs">
                          Position #{response.brandPosition}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 4. Multi-AI Provider Support Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                Multi-AI Provider Comparison
              </CardTitle>
              <CardDescription>
                Performance across different AI models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {providerData.map((provider, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{provider.provider}</p>
                        <p className="text-sm text-slate-500">
                          {provider.mentions}/{provider.total} mentions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getVisibilityScoreColor(provider.score)}`}>
                        {provider.score}%
                      </p>
                      <Progress value={provider.score} className="w-20 h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis Section */}
        <Card className="mt-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-slate-900">
              Detailed Analysis Results
            </CardTitle>
            <CardDescription>
              Complete breakdown of AI responses and brand mentions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="responses" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="responses">AI Responses</TabsTrigger>
                <TabsTrigger value="competitors">Competitor Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="responses" className="mt-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {analysisData.aiProviderResponses.map((response, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{response.provider}</Badge>
                          <Badge variant="outline">{response.model}</Badge>
                          {getSentimentIcon(response.sentiment)}
                        </div>
                        <span className="text-sm text-slate-500">
                          {new Date(response.timestamp).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm font-medium text-slate-700 mb-1">Prompt:</p>
                        <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                          {response.prompt}
                        </p>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm font-medium text-slate-700 mb-1">Response:</p>
                        <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded max-h-32 overflow-y-auto">
                          {response.response}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {response.brandMentioned ? (
                          <Badge className="bg-green-100 text-green-800">
                            Brand Mentioned
                          </Badge>
                        ) : (
                          <Badge variant="secondary">No Brand Mention</Badge>
                        )}
                        {response.brandPosition && (
                          <Badge variant="outline">
                            Position #{response.brandPosition}
                          </Badge>
                        )}
                        <Badge variant="outline">
                          {response.confidence}% confidence
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="competitors" className="mt-6">
                <div className="space-y-4">
                  {analysisData.competitorComparison.map((competitor, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {competitor.competitor}
                        </h3>
                        <div className="flex items-center gap-2">
                          {getSentimentIcon(competitor.sentiment)}
                          <span className={`text-lg font-bold ${getVisibilityScoreColor(competitor.visibilityScore)}`}>
                            {competitor.visibilityScore}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-slate-50 rounded">
                          <p className="text-xl font-bold text-slate-900">
                            {competitor.mentionCount}
                          </p>
                          <p className="text-sm text-slate-600">Mentions</p>
                        </div>
                        <div className="text-center p-3 bg-slate-50 rounded">
                          <p className="text-xl font-bold text-slate-900">
                            {competitor.averagePosition || 'N/A'}
                          </p>
                          <p className="text-sm text-slate-600">Avg Position</p>
                        </div>
                        <div className="text-center p-3 bg-slate-50 rounded">
                          <p className="text-xl font-bold text-slate-900 capitalize">
                            {competitor.sentiment}
                          </p>
                          <p className="text-sm text-slate-600">Sentiment</p>
                        </div>
                      </div>
                      
                      <Progress value={competitor.visibilityScore} className="mt-3" />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}