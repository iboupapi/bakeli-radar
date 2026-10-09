import React from 'react';
import { OpportunityCard } from './OpportunityCard';
import { Inbox } from 'lucide-react';

export const OpportunityList = ({ opportunities, lastUpdated, onSelectOpportunity }) => {
  return (
    <div className="flex-1 flex flex-col gap-4 sm:gap-6 min-w-0">
       
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 pb-1 sm:pb-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
          {opportunities.length} Opportunité{opportunities.length > 1 ? 's' : ''} trouvée{opportunities.length > 1 ? 's' : ''}
        </h1>
        <div className="text-xs sm:text-sm font-medium text-gray-500 bg-white px-3 sm:px-4 py-2 rounded-xl border border-gray-100 shadow-2xs w-fit max-w-full truncate">
          Dernière mise à jour: <span className="font-semibold text-gray-700">{lastUpdated}</span>
        </div>
      </div>

      {/* Grid of opportunities */}
      {opportunities.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-gray-100 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Aucune opportunité trouvée</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            Essayez de modifier vos filtres de recherche ou de réinitialiser pour voir toutes les offres disponibles.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
          {opportunities.map((opp) => (
            <OpportunityCard 
              key={opp.id} 
              opportunity={opp} 
              onSelect={onSelectOpportunity} 
            />
          ))}
        </div>
      )}

    </div>
  );
};
