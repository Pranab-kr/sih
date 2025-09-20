import { Home, Database, BarChart3, FileText, Settings } from 'lucide-react';

const navigationItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: Database, label: 'Data Input', active: false },
  { icon: BarChart3, label: 'Results', active: false },
  { icon: FileText, label: 'Reports', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-neutral-200 h-full flex flex-col">
      <div className="p-6">
        <h2 className="text-neutral-800 font-medium">EcoAnalyzer</h2>
      </div>
      
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.label}>
              <a
                href="#"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  item.active
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}