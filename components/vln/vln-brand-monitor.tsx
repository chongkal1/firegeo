'use client';

import React, { useState, useCallback } from 'react';
import { VLNDomainInput } from './vln-domain-input';
import { VLNCompetitorInput } from './vln-competitor-input';
import { VLNAnalysisProgress } from './vln-analysis-progress';
import { VLNDashboard } from './vln-dashboard';
import { VLNErrorMessage } from './vln-error-message';
import { useVLNAnalysis } from './hooks/use-vln-analysis';
import { validateDomain } from '@/lib/vln/domain-utils';

export interface VLNCompetitor {
  id: string;
  domain: string;
  name?: string;
}

export interface VLNAnalysisData {
  brandDomain: string;
  competitors: VLNCompetitor[];
  results: {
    brandVisibility: {
      score: number;
      mentions: number;
      averagePosition: number;
      sentiment: 'positive' | 'neutral' | 'negative';
    };
    competitorAnalysis: {
      competitor: string;
      score: number;
      mentions: number;
      averagePosition: number;
      sentiment: 'positive' | 'neutral' | 'negative';
    }[];
    providerResults: {
      provider: string;
      responses: {
        prompt: string;
        response: string;
        brandMentioned: boolean;
        brandPosition?: number;
        competitors: string[];
      }[];
    }[];
    realTimeAnalysis: {
      timestamp: Date;
      provider: string;
      query: string;
      brandMentioned: boolean;
      position?: number;
      context: string;
    }[];
  };
  analyzedAt: Date;
}

export function VLNBrandMonitor() {
  const [step, setStep] = useState<'domain' | 'competitors' | 'analysis' | 'dashboard'>('domain');
  const [brandDomain, setBrandDomain] = useState('');
  const [competitors, setCompetitors] = useState<VLNCompetitor[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    analysisData, 
    isAnalyzing, 
    analysisProgress, 
    startAnalysis,
    error: analysisError 
  } = useVLNAnalysis();

  const handleDomainSubmit = useCallback((domain: string) => {
    if (!validateDomain(domain)) {
      setError('Please enter a valid domain (e.g., example.com)');
      return;
    }
    
    setBrandDomain(domain);
    setError(null);
    setStep('competitors');
  }, []);

  const handleCompetitorsSubmit = useCallback((competitorList: VLNCompetitor[]) => {
    if (competitorList.length === 0) {
      setError('Please add at least one competitor');
      return;
    }

    // Validate all competitor domains
    const invalidCompetitors = competitorList.filter(c => !validateDomain(c.domain));
    if (invalidCompetitors.length > 0) {
      setError(`Invalid competitor domains: ${invalidCompetitors.map(c => c.domain).join(', ')}`);
      return;
    }

    setCompetitors(competitorList);
    setError(null);
    setStep('analysis');
    
    // Start analysis
    startAnalysis(brandDomain, competitorList);
  }, [brandDomain, startAnalysis]);

  const handleAnalysisComplete = useCallback((data: VLNAnalysisData) => {
    setStep('dashboard');
  }, []);

  const handleRestart = useCallback(() => {
    setBrandDomain('');
    setCompetitors([]);
    setError(null);
    setStep('domain');
  }, []);

  const currentError = error || analysisError;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Step 1: Domain Input */}
      {step === 'domain' && (
        <VLNDomainInput
          onSubmit={handleDomainSubmit}
          initialValue={brandDomain}
        />
      )}

      {/* Step 2: Competitor Input */}
      {step === 'competitors' && (
        <VLNCompetitorInput
          brandDomain={brandDomain}
          onSubmit={handleCompetitorsSubmit}
          onBack={() => setStep('domain')}
          initialCompetitors={competitors}
        />
      )}

      {/* Step 3: Analysis Progress */}
      {step === 'analysis' && (
        <VLNAnalysisProgress
          brandDomain={brandDomain}
          competitors={competitors}
          isAnalyzing={isAnalyzing}
          progress={analysisProgress}
          onComplete={handleAnalysisComplete}
          onRestart={handleRestart}
        />
      )}

      {/* Step 4: Dashboard */}
      {step === 'dashboard' && analysisData && (
        <VLNDashboard
          data={analysisData}
          onRestart={handleRestart}
        />
      )}

      {/* Error Message */}
      {currentError && (
        <VLNErrorMessage
          error={currentError}
          onDismiss={() => setError(null)}
        />
      )}
    </div>
  );
}