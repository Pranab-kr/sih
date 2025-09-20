import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Info, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

const insights = [
  {
    type: 'success',
    icon: CheckCircle,
    title: 'Excellent Progress',
    message: 'Your CO₂ emissions have decreased by 12% this month by switching to 65% recycled aluminum content.',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50'
  },
  {
    type: 'info',
    icon: Info,
    title: 'Optimization Opportunity',
    message: 'Consider renewable energy sources for your steel production process to reduce emissions by an estimated 18%.',
    color: 'text-sky-600',
    bgColor: 'bg-sky-50'
  },
  {
    type: 'warning',
    icon: AlertTriangle,
    title: 'Transportation Impact',
    message: 'Local transport accounts for 15% of your total carbon footprint. Optimizing logistics could yield significant savings.',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50'
  },
  {
    type: 'trend',
    icon: TrendingUp,
    title: 'Circularity Improvement',
    message: 'Your circularity score has improved to 78%. Implementing a closed-loop system could push this above 85%.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  }
];

export function InsightsSection() {
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
          {insights.map((insight, index) => (
            <div key={index} className={`p-4 rounded-lg border ${insight.bgColor} border-opacity-20`}>
              <div className="flex items-start gap-3">
                <insight.icon className={`w-5 h-5 mt-0.5 ${insight.color}`} />
                <div className="flex-1 space-y-1">
                  <h4 className="text-sm text-neutral-800">{insight.title}</h4>
                  <p className="text-sm text-neutral-600 leading-relaxed">{insight.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}