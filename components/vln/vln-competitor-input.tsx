'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ArrowLeft, ArrowRight, Building2 } from 'lucide-react';
import { validateDomain } from '@/lib/vln/domain-utils';
import { VLNCompetitor } from './vln-brand-monitor';

interface VLNCompetitorInputProps {
  brandDomain: string;
  onSubmit: (competitors: VLNCompetitor[]) => void;
  onBack: () => void;
  initialCompetitors?: VLNCompetitor[];
}

export function VLNCompetitorInput({ 
  brandDomain, 
  onSubmit, 
  onBack, 
  initialCompetitors = [] 
}: VLNCompetitorInputProps) {
  const [competitors, setCompetitors] = useState<VLNCompetitor[]>(
    initialCompetitors.length > 0 
      ? initialCompetitors 
      : [{ id: crypto.randomUUID(), domain: '', name: '' }]
  );

  const addCompetitor = () => {
    setCompetitors([...competitors, { id: crypto.randomUUID(), domain: '', name: '' }]);
  };

  const removeCompetitor = (id: string) => {
    if (competitors.length > 1) {
      setCompetitors(competitors.filter(c => c.id !== id));
    }
  };

  const updateCompetitor = (id: string, field: 'domain' | 'name', value: string) => {
    setCompetitors(competitors.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty competitors and validate
    const validCompetitors = competitors.filter(c => c.domain.trim() !== '');
    
    if (validCompetitors.length === 0) {
      return;
    }

    // Auto-generate names from domains if not provided
    const competitorsWithNames = validCompetitors.map(c => ({
      ...c,
      name: c.name || extractBrandName(c.domain)
    }));

    onSubmit(competitorsWithNames);
  };

  const extractBrandName = (domain: string): string => {
    try {
      const url = domain.startsWith('http') ? domain : `https://${domain}`;
      const hostname = new URL(url).hostname.replace('www.', '');
      const name = hostname.split('.')[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    } catch {
      return domain;
    }
  };

  const isFormValid = competitors.some(c => c.domain.trim() !== '' && validateDomain(c.domain));

  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in-up">
      <Card className="w-full max-w-3xl p-8 shadow-lg">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Add Competitor Domains</CardTitle>
          <p className="text-gray-600 mt-2">
            Add competitor domains to compare against <span className="font-medium text-blue-600">{brandDomain}</span>
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {competitors.map((competitor, index) => (
                <div key={competitor.id} className="flex gap-3 items-start">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={competitor.domain}
                      onChange={(e) => updateCompetitor(competitor.id, 'domain', e.target.value)}
                      placeholder={`competitor${index + 1}.com`}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        competitor.domain && !validateDomain(competitor.domain)
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    <input
                      type="text"
                      value={competitor.name}
                      onChange={(e) => updateCompetitor(competitor.id, 'name', e.target.value)}
                      placeholder="Competitor Name (optional)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  
                  {competitors.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeCompetitor(competitor.id)}
                      className="mt-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={addCompetitor}
              className="w-full border-dashed border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Competitor
            </Button>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <Button
                type="submit"
                disabled={!isFormValid}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Analysis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}