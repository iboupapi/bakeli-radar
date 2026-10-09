import React, { useState } from 'react';
import { Bell, Sparkles, Menu, X } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onOpenAlerts, onOpenAi }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0 shrink-0" onClick={() => handleNavClick('opportunities')}>
          <img src="/logo_bakeli.png" alt="Bakeli Radar" className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-contain shadow-sm shrink-0" />
          <span className="text-lg sm:text-2xl font-bold tracking-tight text-gray-900 truncate">
            Bakeli<span className="text-emerald-600">Radar</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => handleNavClick('opportunities')}
            className={`font-medium transition-colors cursor-pointer ${
              activeTab === 'opportunities' 
                ? 'text-emerald-600 font-semibold' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Opportunités
          </button>
          <button
            onClick={() => handleNavClick('trends')}
            className={`font-medium transition-colors cursor-pointer ${
              activeTab === 'trends' 
                ? 'text-emerald-600 font-semibold' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tendances Marché
          </button>
          <button
            onClick={() => handleNavClick('partners')}
            className={`font-medium transition-colors cursor-pointer ${
              activeTab === 'partners' 
                ? 'text-emerald-600 font-semibold' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Partenaires
          </button>
        </nav>

        {/* Actions (Alerts, CV Score, Radar AI) & Mobile Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={onOpenAlerts}
            className="hidden sm:flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full border border-emerald-100 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100/60 font-medium text-xs sm:text-sm transition-all shadow-2xs cursor-pointer"
            title="Alertes"
          >
            <Bell className="w-4 h-4 text-emerald-600" />
            <span>Alertes</span>
          </button>

          <button
            onClick={onOpenAi}
            className="flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm transition-all shadow-md hover:shadow-lg transform active:scale-95 cursor-pointer min-h-[38px]"
          >
            <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
            <span className="hidden min-[380px]:inline">Radar AI</span>
            <span className="min-[380px]:hidden">AI</span>
          </button>

          {/* Mobile menu toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2.5 -mr-1 rounded-xl text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-3 sm:px-4 py-3 flex flex-col gap-1.5 animate-fadeIn shadow-lg max-h-[calc(100dvh-4rem)] overflow-y-auto pb-safe">
          <button
            onClick={() => handleNavClick('opportunities')}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-colors min-h-[44px] ${
              activeTab === 'opportunities' 
                ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Opportunités
          </button>
          <button
            onClick={() => handleNavClick('trends')}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-colors min-h-[44px] ${
              activeTab === 'trends' 
                ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Tendances Marché
          </button>
          <button
            onClick={() => handleNavClick('partners')}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-colors min-h-[44px] ${
              activeTab === 'partners' 
                ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Partenaires
          </button>
          {/* Alertes : visible uniquement sur mobile (caché en desktop car déjà dans le header) */}
          <button
            onClick={() => { setMobileMenuOpen(false); onOpenAlerts?.(); }}
            className="sm:hidden flex items-center gap-2 text-left px-4 py-3 rounded-xl font-medium text-emerald-700 bg-emerald-50/60 hover:bg-emerald-50 transition-colors min-h-[44px]"
          >
            <Bell className="w-4 h-4" />
            Mes alertes email
          </button>
        </div>
      )}
    </header>
  );
};
