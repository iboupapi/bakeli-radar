import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SidebarFilters } from './components/SidebarFilters';
import { OpportunityList } from './components/OpportunityList';
import { MarketTrends } from './components/MarketTrends';
import { PartnersView } from './components/PartnersView';
import { AlertsModal } from './components/AlertsModal';
import { RadarAiModal } from './components/RadarAiModal';
import { apiService } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState('opportunities'); // 'opportunities' | 'trends' | 'partners'
  const [filters, setFilters] = useState({
    search: '',
    type: 'Tout voir',
    location: 'Toute les régions'
  });

  const [opportunities, setOpportunities] = useState([]);
  const [marketStats, setMarketStats] = useState({ typesDistribution: [], topRegions: [] });
  const [partners, setPartners] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("Aujourd'hui");
  const [loading, setLoading] = useState(false);

  // Modals state
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  // Fetch opportunities whenever filters change
  useEffect(() => {
    let isMounted = true;
    const loadOpportunities = async () => {
      setLoading(true);
      try {
        const res = await apiService.getOpportunities(filters);
        if (isMounted) {
          setOpportunities(res.data);
          setLastUpdated(res.lastUpdated);
        }
      } catch (err) {
        console.error("Failed to load opportunities from backend", err);
        if (isMounted) setOpportunities([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadOpportunities();
    return () => { isMounted = false; };
  }, [filters]);

  // Fetch market insights when switching to trends tab
  useEffect(() => {
    if (activeTab === 'trends') {
      const loadInsights = async () => {
        try {
          const res = await apiService.getMarketInsights();
          setMarketStats(res.data);
          if (res.lastUpdate) setLastUpdated(res.lastUpdate);
        } catch (err) {
          console.error("Failed to load market insights from backend", err);
        }
      };
      loadInsights();
    } else if (activeTab === 'partners') {
      const loadPartners = async () => {
        try {
          const res = await apiService.getPartners();
          setPartners(res.data);
        } catch (err) {
          console.error("Failed to load partners from backend", err);
        }
      };
      loadPartners();
    }
  }, [activeTab]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      type: 'Tout voir',
      location: 'Toute les régions'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        onOpenAi={() => setIsAiOpen(true)}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'opportunities' && (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <SidebarFilters
              filters={filters}
              onFilterChange={setFilters}
              onReset={handleResetFilters}
              onOpenAi={() => setIsAiOpen(true)}
            />
            <OpportunityList
              opportunities={opportunities}
              lastUpdated={lastUpdated}
              onSelectOpportunity={(opp) => {
                if (opp.offer_url) {
                  window.open(opp.offer_url, '_blank');
                } else {
                  setSelectedOpportunity(opp);
                  setIsAiOpen(true);
                }
              }}
            />
          </div>
        )}

        {activeTab === 'trends' && (
          <MarketTrends marketStats={marketStats} />
        )}

        {activeTab === 'partners' && (
          <PartnersView partners={partners} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 mt-12 text-center text-xs text-gray-400">
        <p>© 2026 BakeliRadar. Tous droits réservés. Plateforme d'opportunités au Sénégal.</p>
      </footer>

      {/* Modals */}
      <AlertsModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
      />

      <RadarAiModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
      />

    </div>
  );
}

export default App;
