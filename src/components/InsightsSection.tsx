'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Info, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { useLCA } from '@/contexts/LCAContext';
import { useEffect, useState } from 'react';

export function InsightsSection() {
  const { state } = useLCA();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getInsights = () => {
    // Default insights when no calculations exist
    const defaultInsights = [
      {
        type: 'info',
        icon: Info,
        title: 'Getting Started',
        message: 'Add materials and processes to your product to begin your LCA analysis and receive personalized insights.',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        type: 'info',
        icon: CheckCircle,
        title: 'Best Practices',
        message: 'Use recycled materials when possible and consider renewable energy sources for manufacturing processes.',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      {
        type: 'warning',
        icon: AlertTriangle,
        title: 'Common Impact Areas',
        message: 'Transportation and energy consumption are often the largest contributors to carbon footprint.',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50'
      },
      {
        type: 'trend',
        icon: TrendingUp,
        title: 'Market Advantage',
        message: 'Products with high sustainability scores are seeing increased market demand and consumer preference.',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      }
    ];

    if (!state.calculations || !state.currentProduct) {
      return defaultInsights;
    }

    // Generate dynamic insights based on calculations
    const insights = [];
    const { recommendations } = state.calculations;
    
    // Add calculation-based insights
    if (state.calculations.sustainabilityScore > 70) {
      insights.push({
        type: 'success',
        icon: CheckCircle,
        title: 'Excellent Sustainability Score',
        message: `Your product achieved a sustainability score of ${state.calculations.sustainabilityScore.toFixed(0)}/100. This puts you in the top tier for environmental performance.`,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50'
      });
    }

    if (state.calculations.recyclabilityScore > 80) {
      insights.push({
        type: 'success',
        icon: CheckCircle,
        title: 'High Recyclability',
        message: `Your product has a ${state.calculations.recyclabilityScore.toFixed(0)}% recyclability score, supporting circular economy principles.`,
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      });
    }

    // Add recommendations as insights
    recommendations.slice(0, 3).forEach((recommendation, index) => {
      insights.push({
        type: index === 0 ? 'info' : 'warning',
        icon: index === 0 ? Info : AlertTriangle,
        title: `Recommendation ${index + 1}`,
        message: recommendation,
        color: index === 0 ? 'text-sky-600' : 'text-amber-600',
        bgColor: index === 0 ? 'bg-sky-50' : 'bg-amber-50'
      });
    });

    // Fill remaining slots if needed
    while (insights.length < 4) {
      insights.push(...defaultInsights.slice(0, 4 - insights.length));
    }

    return insights.slice(0, 4);
  };

  const insights = getInsights();
  
  // Prevent hydration mismatch by only rendering dynamic content after client-side hydration
  if (!isClient) {
    return (
      <Card className="bg-neutral-50 border-neutral-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-neutral-800">AI-Powered Insights & Recommendations</CardTitle>
          <CardDescription className="text-neutral-600">
            Actionable insights to optimize your sustainability performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border bg-blue-50 border-opacity-20">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 mt-0.5 text-blue-600" />
                <div className="flex-1 space-y-1">
                  <h4 className="text-sm text-neutral-800">Loading Insights...</h4>
                  <p className="text-sm text-neutral-600 leading-relaxed">Generating personalized recommendations based on your data.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-neutral-50 border-neutral-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-neutral-800">Report Genaration</CardTitle>
        <CardDescription className="text-neutral-600">
          Actionable insights to optimize your sustainability performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const IconComponent = insight.icon;
            return (
              <div key={`${insight.type}-${insight.title}-${index}`} className={`p-4 rounded-lg border ${insight.bgColor} border-opacity-20`}>
                <div className="flex items-start gap-3">
                  <IconComponent className={`w-5 h-5 mt-0.5 ${insight.color}`} />
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm text-neutral-800">{insight.title}</h4>
                    <p className="text-sm text-neutral-600 leading-relaxed">{insight.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}