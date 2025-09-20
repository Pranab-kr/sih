'use client';

import { Home, Database, BarChart3, FileText, Settings } from 'lucide-react';
import { useState } from 'react';

const navigationItems = [
  { icon: Home, label: 'Home', id: 'home', active: true },
  { icon: Database, label: 'Data Input', id: 'data-input', active: false },
  { icon: BarChart3, label: 'Results', id: 'results', active: false },
  { icon: FileText, label: 'Reports', id: 'insights', active: false },
  { icon: Settings, label: 'Settings', id: 'settings', active: false },
];

export function Sidebar() {
  const [activeItem, setActiveItem] = useState('home');

  const handleNavClick = (item: typeof navigationItems[0]) => {
    setActiveItem(item.id);
    
    // Scroll to the corresponding section (only on client side)
    if (typeof window !== 'undefined') {
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };
  return (
    <div className="w-64 bg-white border-r border-neutral-200 h-full flex flex-col">
      <div className="p-6">
        <h2 className="text-neutral-800 font-medium">EcoAnalyzer</h2>
      </div>
      
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeItem === item.id
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}