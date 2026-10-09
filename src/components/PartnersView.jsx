import React from 'react';
import { Award, ExternalLink, Wifi, GraduationCap, CreditCard, Code, Radio, Landmark, Building2 } from 'lucide-react';

const iconMap = {
  Wifi: Wifi,
  GraduationCap: GraduationCap,
  CreditCard: CreditCard,
  Code: Code,
  Radio: Radio,
  Landmark: Landmark,
};

export const PartnersView = ({ partners }) => {
  return (
    <div className="flex-1 flex flex-col gap-5 sm:gap-8 animate-fadeIn min-w-0">
       
      {/* Title section */}
      <div className="flex flex-col gap-1.5 sm:gap-2">
        <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs sm:text-sm uppercase tracking-wider">
          <Award className="w-4 h-4 shrink-0" />
          <span>Écosystème & Entreprises</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Nos Partenaires de Confiance
        </h1>
        <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
          Découvrez les organisations et entreprises qui publient régulièrement leurs opportunités sur BakeliRadar.
        </p>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
        {partners.map((partner, index) => {
          const IconComponent = iconMap[partner.icon] || Building2;
          return (
            <div 
              key={index}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 hover:border-emerald-200 transition-all shadow-xs hover:shadow-lg flex flex-col justify-between gap-5 sm:gap-6 group min-w-0"
            >
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-105 transition-transform">
                  <IconComponent className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 bg-gray-50 group-hover:bg-emerald-50 text-gray-600 group-hover:text-emerald-700 rounded-full text-xs font-semibold transition-colors">
                  {partner.activeOffers} offre{partner.activeOffers > 1 ? 's' : ''} active{partner.activeOffers > 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                  {partner.name}
                </h3>
                <p className="text-sm font-medium text-gray-500">{partner.category}</p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">Partenaire Vérifié</span>
                <a 
                  href={partner.url || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 group-hover:translate-x-1 transition-transform cursor-pointer"
                >
                  <span>Voir les offres</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
