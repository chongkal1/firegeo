'use client';

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, BarChart3, Zap, Users } from "lucide-react";
import { validateDomain } from "@/lib/vln-validation";

export default function Home() {
  const [brandDomain, setBrandDomain] = useState("");
  const [isValidDomain, setIsValidDomain] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBrandDomain(value);
    if (value) {
      const validation = validateDomain(value);
      setIsValidDomain(validation.isValid);
      setValidationErrors(validation.errors);
    } else {
      setIsValidDomain(true);
      setValidationErrors([]);
    }
  };

  const handleStartAnalysis = () => {
    if (brandDomain && isValidDomain) {
      // Navigate to competitor input step
      window.location.href = `/vln/setup?domain=${encodeURIComponent(brandDomain)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
              VLN Brand Intelligence Platform
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 animate-fade-in-up">
              <span className="block text-slate-900">Track Your Brand</span>
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Across AI Models
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 animate-fade-in-up animation-delay-200">
              Monitor how ChatGPT, Claude, Gemini, and Perplexity rank your brand against competitors in real-time
            </p>

            {/* Step 1: Brand Domain Input */}
            <div className="max-w-2xl mx-auto mb-16">
              <Card className="p-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-semibold text-slate-900">
                    Step 1: Enter Your Brand Domain
                  </CardTitle>
                  <CardDescription className="text-lg text-slate-600">
                    Start by entering your brand's website domain to begin the analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        type="text"
                        placeholder="example.com or www.example.com"
                        value={brandDomain}
                        onChange={handleDomainChange}
                        className={`h-14 text-lg px-6 ${!isValidDomain ? 'border-red-500 focus:border-red-500' : 'border-slate-300'}`}
                      />
                      {!isValidDomain && validationErrors.length > 0 && (
                        <div className="mt-2">
                          {validationErrors.map((error, index) => (
                            <p key={index} className="text-red-500 text-sm">{error}</p>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={handleStartAnalysis}
                      disabled={!brandDomain || !isValidDomain}
                      className="h-14 px-8 text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Start Analysis
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-sm text-slate-500 text-center">
                    Next: Add competitors and generate your brand visibility report
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Feature Preview Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Card className="p-6 bg-white/60 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 mx-auto">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-900">Brand Visibility</h3>
                <p className="text-slate-600 text-sm">Track how often your brand appears in AI model responses</p>
              </Card>

              <Card className="p-6 bg-white/60 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4 mx-auto">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-900">Competitor Analysis</h3>
                <p className="text-slate-600 text-sm">Compare your visibility scores against key competitors</p>
              </Card>

              <Card className="p-6 bg-white/60 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4 mx-auto">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-900">Real-time Analysis</h3>
                <p className="text-slate-600 text-sm">Get live updates on brand mentions across AI platforms</p>
              </Card>

              <Card className="p-6 bg-white/60 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4 mx-auto">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-900">Multi-AI Support</h3>
                <p className="text-slate-600 text-sm">Monitor across ChatGPT, Claude, Gemini, and Perplexity</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How VLN Works
            </h2>
            <p className="text-xl text-slate-600">
              Simple 4-step process to monitor your brand across AI models
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Enter Domain</h3>
              <p className="text-slate-600">Input your brand's website domain</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Competitors</h3>
              <p className="text-slate-600">List your key competitor domains</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-slate-600">Our AI models analyze brand visibility</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">View Dashboard</h3>
              <p className="text-slate-600">Get comprehensive analytics and insights</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}