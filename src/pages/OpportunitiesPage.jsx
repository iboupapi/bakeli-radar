import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SidebarFilters } from '../components/SidebarFilters';
import { OpportunityList } from '../components/OpportunityList';
import { apiService } from '../services/api';

export const OpportunitiesPage = () => {
  const navigate = useNavigate();
  const { openAi } = useOutletContext();
  const [filters, setFilters] = useState({
    search: '',
    type: 'Tout voir',
    location: 'Toute les régions'
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['opportunities', filters],
    queryFn: () => apiService.getOpportunities(filters),
    keepPreviousData: true,
  });

  const handleResetFilters = () => {
    setFilters({
      search: '',
      type: 'Tout voir',
      location: 'Toute les régions'
    });
  };

  const opportunities = data?.data || [];
  const lastUpdated = data?.lastUpdated || "Aujourd'hui";

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start py-2 animate-fadeIn">
      <SidebarFilters
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        onOpenAi={openAi}
      />
      <OpportunityList
        opportunities={opportunities}
        lastUpdated={lastUpdated}
        loading={isLoading}
        error={error?.message}
        onSelectOpportunity={(opp) => {
          navigate(`/opportunities/${opp.id}`);
        }}
      />
    </div>
  );
};
