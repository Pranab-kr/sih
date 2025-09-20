import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Zap, Leaf, Recycle, TrendingUp } from 'lucide-react';

const kpiData = [
  {
    title: 'CO₂ Emissions',
    value: '2.4',
    unit: 'tons CO₂e',
    change: '-12%',
    trend: 'down',
    icon: Leaf,
    color: 'text-emerald-600'
  },
  {
    title: 'Energy Use',
    value: '1,850',
    unit: 'kWh',
    change: '-8%',
    trend: 'down',
    icon: Zap,
    color: 'text-amber-600'
  },
  {
    title: 'Circularity Score',
    value: '78',
    unit: '%',
    change: '+15%',
    trend: 'up',
    icon: Recycle,
    color: 'text-sky-600'
  },
  {
    title: 'Efficiency',
    value: '94.2',
    unit: '%',
    change: '+3%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-purple-600'
  }
];

export function KPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiData.map((kpi) => (
        <Card key={kpi.title} className="bg-neutral-50 border-neutral-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm text-neutral-600">
              {kpi.title}
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl text-neutral-800">{kpi.value}</span>
                <span className="text-sm text-neutral-500">{kpi.unit}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  kpi.trend === 'up' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {kpi.change}
                </span>
                <span className="text-xs text-neutral-500">vs last month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}