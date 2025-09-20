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
              {/* Home Section */}
              <section id="home" className="scroll-mt-6">
                <div className="mb-8">
                  <h1 className="text-2xl font-semibold text-neutral-800 mb-2">LCA Dashboard</h1>
                  <p className="text-neutral-600">Analyze your product's environmental impact throughout its lifecycle</p>
                </div>
              </section>
              
              {/* Data Input Section */}
              <section id="data-input" className="scroll-mt-6">
                <InputFormSection />
              </section>
              
              {/* KPI Summary Cards */}
              <KPICards />
              
              {/* Results Section */}
              <section id="results" className="scroll-mt-6">
                <DataVisualization />
              </section>
              
              {/* Insights/Reports Section */}
              <section id="insights" className="scroll-mt-6">
                <InsightsSection />
              </section>
              
              {/* Settings Section */}
              <section id="settings" className="scroll-mt-6">
                <div className="bg-white rounded-lg border border-neutral-200 p-6">
                  <h2 className="text-lg font-medium text-neutral-800 mb-4">Settings</h2>
                  <p className="text-neutral-600">Application settings and preferences will be available here.</p>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}