import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SidebarFilters } from './components/SidebarFilters';
import { OpportunityList } from './components/OpportunityList';
import { MarketTrends } from './components/MarketTrends';
import { PartnersView } from './components/PartnersView';
import { AlertsModal } from './components/AlertsModal';
import { RadarAiModal } from './components/RadarAiModal';
import { MonitoringModal } from './components/MonitoringModal';
import { CvScoringModal } from './components/CvScoringModal';
import { apiService } from './services/api';
import { Activity } from 'lucide-react';

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
  const [isMonitoringOpen, setIsMonitoringOpen] = useState(false);
  const [isCvScoringOpen, setIsCvScoringOpen] = useState(false);
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
        onOpenCvScoring={() => setIsCvScoringOpen(true)}
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
      <footer className="bg-white border-t border-gray-100 py-6 mt-12 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>© 2026 BakeliRadar. Tous droits réservés. Plateforme d'opportunités au Sénégal.</p>
        <button
          onClick={() => setIsMonitoringOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium transition-colors cursor-pointer"
          title="Voir l'état de santé et les métriques de scraping"
        >
          <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>System Health & Monitoring</span>
        </button>
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

      <MonitoringModal
        isOpen={isMonitoringOpen}
        onClose={() => setIsMonitoringOpen(false)}
      />

      <CvScoringModal
        isOpen={isCvScoringOpen}
        onClose={() => setIsCvScoringOpen(false)}
      />

    </div>
  );
}

export default App;
