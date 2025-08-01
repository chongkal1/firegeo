'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Plus, X, Globe, Users } from "lucide-react";

interface CompetitorInput {
  id: string;
  domain: string;
  isValid: boolean;
}

export default function VLNSetup() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const brandDomain = searchParams.get('domain') || '';
  
  const [competitors, setCompetitors] = useState<CompetitorInput[]>([
    { id: '1', domain: '', isValid: true }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const validateDomain = (domain: string) => {
    if (!domain) return true; // Empty is valid (optional)
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
    return domainRegex.test(domain.replace(/^https?:\/\//, '').replace(/^www\./, ''));
  };

  const updateCompetitor = (id: string, domain: string) => {
    setCompetitors(prev => prev.map(comp => 
      comp.id === id 
        ? { ...comp, domain, isValid: validateDomain(domain) }
        : comp
    ));
  };

  const addCompetitor = () => {
    const newId = Date.now().toString();
    setCompetitors(prev => [...prev, { id: newId, domain: '', isValid: true }]);
  };

  const removeCompetitor = (id: string) => {
    if (competitors.length > 1) {
      setCompetitors(prev => prev.filter(comp => comp.id !== id));
    }
  };

  const getValidCompetitors = () => {
    return competitors
      .filter(comp => comp.domain && comp.isValid)
      .map(comp => comp.domain.replace(/^https?:\/\//, '').replace(/^www\./, ''));
  };

  const handleStartAnalysis = async () => {
    const validCompetitors = getValidCompetitors();
    
    if (!brandDomain) {
      router.push('/');
      return;
    }

    setIsAnalyzing(true);
    
    // Navigate to dashboard with analysis parameters
    const params = new URLSearchParams({
      brand: brandDomain,
      competitors: validCompetitors.join(',')
    });
    
    router.push(`/vln/dashboard?${params.toString()}`);
  };

  const goBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
            VLN Brand Intelligence Platform
          </Badge>
          
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Step 2: Add Your Competitors
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Add competitor domains to compare your brand visibility across AI models
          </p>
        </div>

        {/* Brand Domain Display */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Your Brand Domain</p>
                <p className="text-lg font-semibold text-slate-900">{brandDomain}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competitor Input Section */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
              <Users className="h-6 w-6 text-purple-600" />
              Competitor Domains
            </CardTitle>
            <CardDescription className="text-lg text-slate-600">
              Add competitor websites to analyze how they rank against your brand in AI responses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {competitors.map((competitor, index) => (
              <div key={competitor.id} className="flex gap-3 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-slate-600">
                      Competitor {index + 1}
                    </span>
                    {index > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCompetitor(competitor.id)}
                        className="h-6 w-6 p-0 border-red-200 text-red-500 hover:bg-red-50"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <Input
                    type="text"
                    placeholder="competitor.com or www.competitor.com"
                    value={competitor.domain}
                    onChange={(e) => updateCompetitor(competitor.id, e.target.value)}
                    className={`h-12 text-base ${!competitor.isValid ? 'border-red-500 focus:border-red-500' : 'border-slate-300'}`}
                  />
                  {!competitor.isValid && (
                    <p className="text-red-500 text-sm mt-1">Please enter a valid domain</p>
                  )}
                </div>
              </div>
            ))}

            {/* Add Competitor Button */}
            <Button
              variant="outline"
              onClick={addCompetitor}
              className="w-full h-12 border-dashed border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Competitor
            </Button>

            <div className="bg-slate-50 rounded-lg p-4 mt-6">
              <p className="text-sm text-slate-600 mb-2">
                <strong>Analysis Preview:</strong>
              </p>
              <div className="space-y-1">
                <p className="text-sm text-slate-700">
                  • Brand: <span className="font-medium">{brandDomain}</span>
                </p>
                {getValidCompetitors().length > 0 ? (
                  <p className="text-sm text-slate-700">
                    • Competitors: <span className="font-medium">{getValidCompetitors().join(', ')}</span>
                  </p>
                ) : (
                  <p className="text-sm text-slate-500 italic">
                    • No competitors added (optional)
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button
            variant="outline"
            onClick={goBack}
            className="h-12 px-6 text-base"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Domain Input
          </Button>

          <Button
            onClick={handleStartAnalysis}
            disabled={isAnalyzing || !brandDomain}
            className="h-12 px-8 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Starting Analysis...
              </>
            ) : (
              <>
                Start AI Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-12 flex justify-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                ✓
              </div>
              <span className="ml-2 text-sm text-slate-600">Domain</span>
            </div>
            <div className="w-8 h-1 bg-blue-600 rounded"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-slate-900">Competitors</span>
            </div>
            <div className="w-8 h-1 bg-slate-300 rounded"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center text-slate-500 text-sm font-bold">
                3
              </div>
              <span className="ml-2 text-sm text-slate-500">Analysis</span>
            </div>
            <div className="w-8 h-1 bg-slate-300 rounded"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center text-slate-500 text-sm font-bold">
                4
              </div>
              <span className="ml-2 text-sm text-slate-500">Dashboard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}