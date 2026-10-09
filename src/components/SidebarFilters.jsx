import React, { useState } from 'react';
import { Search, RotateCcw, MapPin, Sparkles, HelpCircle, Filter, ChevronDown } from 'lucide-react';

const OFFER_TYPES = [
  "Tout voir",
  "Emploi",
  "Stage",
  "Bourse",
  "Concours",
  "Prestation",
  "Formation"
];

const REGIONS = [
  "Toute les régions",
  "Dakar",
  "Saint-Louis",
  "Thiès",
  "Ziguinchor",
  "Remote"
];

export const SidebarFilters = ({ filters, onFilterChange, onReset, onOpenAi }) => {
  // Replié par défaut sur mobile pour laisser la place aux résultats,
  // toujours ouvert sur desktop (lg+).
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeCount =
    (filters.search ? 1 : 0) +
    (filters.type && filters.type !== 'Tout voir' ? 1 : 0) +
    (filters.location && filters.location !== 'Toute les régions' ? 1 : 0);

  return (
    <aside className="w-full lg:w-72 lg:shrink-0 bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden lg:sticky lg:top-24 self-stretch lg:self-start">
      {/* Barre mobile : toggle filtres */}
      <button
        onClick={() => setMobileOpen((v) => !v)}
        aria-expanded={mobileOpen}
        className="lg:hidden w-full flex items-center justify-between px-4 py-3.5 min-h-[52px] cursor-pointer"
      >
        <span className="flex items-center gap-2 font-bold text-gray-900 text-[15px]">
          <Filter className="w-4 h-4 text-emerald-600" />
          Filtres
          {activeCount > 0 && (
            <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-full text-[11px] font-bold">
              {activeCount}
            </span>
          )}
        </span>
        <span className="flex items-center gap-2">
          {activeCount > 0 && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => { e.stopPropagation(); onReset(); }}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); onReset(); } }}
              className="text-xs font-semibold text-emerald-700 flex items-center gap-1 px-2 py-1"
            >
              <RotateCcw className="w-3 h-3" />
              Réinitialiser
            </span>
          )}
          <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${mobileOpen ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {/* Contenu : masqué sur mobile si replié, toujours visible sur desktop */}
      <div className={`${mobileOpen ? 'flex' : 'hidden'} lg:flex flex-col gap-4 p-4 sm:p-5 pt-1 lg:pt-5 border-t lg:border-t-0 border-gray-100`}>
      {/* Header & Reset (desktop uniquement) */}
      <div className="hidden lg:flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 font-bold text-gray-900 text-base">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span>Filtres</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Réinitialiser
        </button>
      </div>

      {/* Search Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Recherche</label>
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Mots-clés, entreprise..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-3 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all min-h-[44px]"
          />
        </div>
      </div>

      {/* Type d'offre : chips scrollables sur mobile, radios sur desktop */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Type d'offre</label>
        {/* Mobile : chips horizontales */}
        <div className="lg:hidden flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 py-1">
          {OFFER_TYPES.map((type) => {
            const isChecked = filters.type === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => onFilterChange({ ...filters, type })}
                className={`shrink-0 px-3.5 py-2 rounded-full text-[13px] font-semibold border transition-all min-h-[38px] ${
                  isChecked
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-gray-50 text-gray-600 border-gray-200 active:bg-gray-100'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
        {/* Desktop : radios */}
        <div className="hidden lg:flex flex-col gap-1.5">
          {OFFER_TYPES.map((type) => {
            const isChecked = filters.type === type;
            return (
              <label 
                key={type} 
                className="flex items-center gap-2.5 cursor-pointer group text-sm text-gray-700 hover:text-gray-900 py-0.5"
              >
                <input
                  type="radio"
                  name="offerType"
                  checked={isChecked}
                  onChange={() => onFilterChange({ ...filters, type })}
                  className="w-3.5 h-3.5 text-emerald-600 border-gray-300 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                />
                <span className={isChecked ? "font-semibold text-emerald-700" : "font-normal"}>
                  {type}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Localisation */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Localisation</label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filters.location}
            onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
            className="w-full pl-9 pr-8 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all appearance-none cursor-pointer text-gray-700 min-h-[44px]"
          >
            {REGIONS.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
        </div>
      </div>

      {/* AI Help Box (Besoin d'aide ?) */}
      <div className="p-4 bg-emerald-800 rounded-2xl text-white flex flex-col gap-2.5 shadow-md relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-emerald-700 rounded-full opacity-50 pointer-events-none"></div>
        <div className="flex items-center gap-2 font-bold text-sm">
          <HelpCircle className="w-4 h-4 text-emerald-200" />
          <span>Besoin d'aide ?</span>
        </div>
        <p className="text-[11px] text-emerald-100 leading-relaxed">
          Laisse notre IA t'aider à trouver le match parfait.
        </p>
        <button
          onClick={onOpenAi}
          className="w-full py-2.5 px-3 bg-white hover:bg-emerald-50 text-emerald-900 font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Lancer Radar AI</span>
        </button>
      </div>

      </div>
    </aside>
  );
};
