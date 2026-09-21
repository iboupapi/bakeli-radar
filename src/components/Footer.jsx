import React from 'react';
import { Activity } from 'lucide-react';

export const Footer = ({ onOpenMonitoring }) => {
  return (
    <footer className="bg-white border-t border-gray-100 py-8 px-4 sm:px-6 lg:px-8 mt-12 flex flex-col items-center justify-center text-center gap-3">
      <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
        <img src="/logo_bakeli.png" alt="Bakeli Radar" className="w-6 h-6 rounded-md object-contain shadow-xs" />
        <span>Bakeli Radar</span>
      </div>

      <div className="flex flex-col gap-1 text-xs text-gray-500 font-medium">
        <p>La plateforme de référence pour l'employabilité des jeunes au Sénégal.</p>
        <p>Une initiative propulsée par Bakeli School of Technology.</p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 text-xs text-gray-400">
        <span>© 2024 Bakeli Sénégal. Tous droits réservés.</span>
        {onOpenMonitoring && (
          <button
            onClick={onOpenMonitoring}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium transition-colors cursor-pointer"
            title="Voir l'état de santé et les métriques"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Health & Monitoring</span>
          </button>
        )}
      </div>
    </footer>
  );
};
