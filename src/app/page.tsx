import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { InputFormSection } from '../components/InputFormSection';
import { KPICards } from '../components/KPICards';
import { DataVisualization } from '../components/DataVisualization';
import { InsightsSection } from '../components/InsightsSection';

export default function Page() {
  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header />
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Input Form Section */}
              <InputFormSection />
              
              {/* KPI Summary Cards */}
              <KPICards />
              
              {/* Data Visualization Section */}
              <DataVisualization />
              
              {/* Insights Section */}
              <InsightsSection />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}