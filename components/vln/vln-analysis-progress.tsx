'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, Clock, Brain, Search, BarChart3 } from 'lucide-react';
import { VLNCompetitor, VLNAnalysisData } from './vln-brand-monitor';

interface VLNAnalysisProgressProps {
  brandDomain: string;
  competitors: VLNCompetitor[];
  isAnalyzing: boolean;
  progress: {
    stage: string;
    progress: number;
    message: string;
    currentProvider?: string;
    currentQuery?: string;
  };
  onComplete: (data: VLNAnalysisData) => void;
  onRestart: () => void;
}

const analysisStages = [
  { id: 'initializing', label: 'Initializing', icon: Clock },
  { id: 'scraping', label: 'Analyzing Domains', icon: Search },
  { id: 'querying', label: 'Querying AI Models', icon: Brain },
  { id: 'calculating', label: 'Calculating Scores', icon: BarChart3 },
  { id: 'complete', label: 'Complete', icon: CheckCircle },
];

export function VLNAnalysisProgress({
  brandDomain,
  competitors,
  isAnalyzing,
  progress,
  onComplete,
  onRestart
}: VLNAnalysisProgressProps) {
  
  useEffect(() => {
    // Simulate analysis completion for demo
    if (progress.stage === 'complete' && !isAnalyzing) {
      // Generate mock analysis data
      const mockData: VLNAnalysisData = {
        brandDomain,
        competitors,
        results: {
          brandVisibility: {
            score: 75,
            mentions: 12,
            averagePosition: 2.3,
            sentiment: 'positive'
          },
          competitorAnalysis: competitors.map((comp, idx) => ({
            competitor: comp.name || comp.domain,
            score: Math.max(20, 85 - (idx * 15) + Math.random() * 10),
            mentions: Math.floor(Math.random() * 15) + 5,
            averagePosition: 1 + (idx * 0.5) + Math.random(),
            sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as any
          })),
          providerResults: [
            {
              provider: 'OpenAI',
              responses: [
                {
                  prompt: `Best tools like ${brandDomain}`,
                  response: `Here are the top tools in this category: 1. ${brandDomain} - Leading solution with great features...`,
                  brandMentioned: true,
                  brandPosition: 1,
                  competitors: competitors.map(c => c.name || c.domain)
                }
              ]
            },
            {
              provider: 'Anthropic',
              responses: [
                {
                  prompt: `Compare ${brandDomain} vs competitors`,
                  response: `When comparing these platforms, ${brandDomain} stands out for its reliability...`,
                  brandMentioned: true,
                  brandPosition: 2,
                  competitors: competitors.map(c => c.name || c.domain)
                }
              ]
            }
          ],
          realTimeAnalysis: [
            {
              timestamp: new Date(),
              provider: 'OpenAI',
              query: `Best ${brandDomain} alternatives`,
              brandMentioned: true,
              position: 1,
              context: `${brandDomain} is mentioned as a top choice`
            }
          ]
        },
        analyzedAt: new Date()
      };
      
      setTimeout(() => onComplete(mockData), 1000);
    }
  }, [progress.stage, isAnalyzing, brandDomain, competitors, onComplete]);

  const getCurrentStageIndex = () => {
    return analysisStages.findIndex(stage => stage.id === progress.stage);
  };

  const currentStageIndex = getCurrentStageIndex();

  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in-up">
      <Card className="w-full max-w-4xl p-8 shadow-lg">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-2xl font-bold">Analyzing Brand Visibility</CardTitle>
          <p className="text-gray-600 mt-2">
            Comparing <span className="font-medium text-blue-600">{brandDomain}</span> against {competitors.length} competitors
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress.progress}%` }}
            />
          </div>

          {/* Stage Indicators */}
          <div className="flex justify-between items-center">
            {analysisStages.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = index === currentStageIndex;
              const isCompleted = index < currentStageIndex;
              const isUpcoming = index > currentStageIndex;

              return (
                <div key={stage.id} className="flex flex-col items-center space-y-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white animate-pulse' 
                      : isCompleted 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {isActive ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Current Status */}
          <div className="text-center space-y-4">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">{progress.message}</h3>
              {progress.currentProvider && (
                <p className="text-blue-700 text-sm">
                  Current Provider: {progress.currentProvider}
                </p>
              )}
              {progress.currentQuery && (
                <p className="text-blue-600 text-sm mt-1">
                  Query: "{progress.currentQuery}"
                </p>
              )}
            </div>

            {/* Competitor List */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Analyzing Against:</h4>
              <div className="flex flex-wrap gap-2">
                {competitors.map((competitor) => (
                  <span 
                    key={competitor.id}
                    className="px-3 py-1 bg-white rounded-full text-sm border border-gray-200"
                  >
                    {competitor.name || competitor.domain}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={onRestart}
              variant="outline"
              disabled={isAnalyzing}
              className="px-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Start Over
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}