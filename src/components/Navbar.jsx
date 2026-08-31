import React from 'react';
import { Bell, Sparkles, Target } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onOpenAlerts, onOpenAi }) => {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('opportunities')}>
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md">
            <Target className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">
            Bakeli<span className="text-emerald-600">Radar</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`font-medium transition-colors ${
              activeTab === 'opportunities' 
                ? 'text-emerald-600 font-semibold' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Opportunités
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`font-medium transition-colors ${
              activeTab === 'trends' 
                ? 'text-emerald-600 font-semibold' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tendances Marché
          </button>
          <button
            onClick={() => setActiveTab('partners')}
            className={`font-medium transition-colors ${
              activeTab === 'partners' 
                ? 'text-emerald-600 font-semibold' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Partenaires
          </button>
        </nav>

        {/* Actions (Alerts & Radar AI) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAlerts}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-100 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100/60 font-medium text-sm transition-all shadow-2xs"
            title="Alertes"
          >
            <Bell className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Alertes</span>
          </button>

          <button
            onClick={onOpenAi}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all shadow-md hover:shadow-lg transform active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
            <span>Radar AI</span>
          </button>
        </div>

      </div>
    </header>
  );
};
