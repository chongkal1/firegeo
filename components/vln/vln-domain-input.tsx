'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, ArrowRight } from 'lucide-react';
import { validateDomain } from '@/lib/vln/domain-utils';

interface VLNDomainInputProps {
  onSubmit: (domain: string) => void;
  initialValue?: string;
}

export function VLNDomainInput({ onSubmit, initialValue = '' }: VLNDomainInputProps) {
  const [domain, setDomain] = useState(initialValue);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleDomainChange = (value: string) => {
    setDomain(value);
    if (value.length > 0) {
      setIsValid(validateDomain(value));
    } else {
      setIsValid(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain && isValid) {
      onSubmit(domain);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in-up">
      <Card className="w-full max-w-2xl p-8 shadow-lg">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Enter Your Brand Domain</CardTitle>
          <p className="text-gray-600 mt-2">
            Start by entering your brand's website domain to begin monitoring
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={domain}
                onChange={(e) => handleDomainChange(e.target.value)}
                placeholder="example.com"
                className={`w-full pl-12 pr-4 h-14 text-lg border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  isValid === false 
                    ? 'border-red-300 focus:ring-red-500 focus:border-transparent' 
                    : isValid === true 
                    ? 'border-green-300 focus:ring-blue-500 focus:border-transparent'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
              {isValid === true && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            
            {isValid === false && (
              <p className="text-red-600 text-sm">
                Please enter a valid domain (e.g., example.com or https://example.com)
              </p>
            )}
            
            <button
              type="submit"
              disabled={!domain || isValid !== true}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Continue to Competitors
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}