'use client';

import { useState, useCallback } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { VLNBrandMonitor } from '@/components/vln/vln-brand-monitor';
import { Loader2 } from 'lucide-react';

export default function VLNPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">VLN Brand Monitor</h1>
          <p className="text-gray-600 mb-6">
            Please log in to access the brand monitoring dashboard
          </p>
          <button
            onClick={() => router.push('/login')}
            className="btn-firecrawl-orange inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-medium transition-all duration-200 h-10 px-6"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-white border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2 animate-fade-in-up">
                <span className="block text-zinc-900">VLN</span>
                <span className="block bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                  Brand Visibility Monitor
                </span>
              </h1>
              <p className="text-lg text-zinc-600 animate-fade-in-up animation-delay-200">
                Track your brand visibility across AI models vs competitors
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <VLNBrandMonitor />
      </div>
    </div>
  );
}