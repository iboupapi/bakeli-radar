import React, { useState, useEffect } from 'react';
import { Activity, X, ShieldCheck, AlertTriangle, RefreshCw, Server } from 'lucide-react';
import { apiService } from '../services/api';

export const MonitoringModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [health, setHealth] = useState(null);
  const [monitoring, setMonitoring] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const fetchAdminData = async () => {
        setLoading(true);
        setError(null);
        try {
          const [healthRes, monitoringRes] = await Promise.all([
            apiService.getHealth().catch(err => ({ status: "error", message: err.message })),
            apiService.getMonitoring().catch(err => ({ status: "error", message: err.message }))
          ]);
          setHealth(healthRes);
          setMonitoring(monitoringRes);
        } catch (err) {
          setError("Impossible de charger les données de monitoring.");
        } finally {
          setLoading(false);
        }
      };
      fetchAdminData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl w-[95vw] sm:max-w-2xl max-h-[85vh] shadow-2xl border border-gray-100 flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-emerald-800 text-white p-6 flex items-center justify-between relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/80 flex items-center justify-center text-emerald-200">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Monitoring & Health-Check</h3>
              <p className="text-xs text-emerald-200 font-medium">Tableau de bord système et scraping</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-emerald-700/60 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 bg-gray-50/50">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-gray-500">
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
              <p className="text-sm font-medium">Chargement des métriques système...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              
              {/* Health Section */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>État de Santé (Health-Check)</span>
                  </h4>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
                    Opérationnel
                  </span>
                </div>
                
                <div className="text-xs font-mono bg-gray-900 text-emerald-400 p-4 rounded-xl overflow-x-auto max-h-40 shadow-inner">
                  <pre>{JSON.stringify(health, null, 2)}</pre>
                </div>
              </div>

              {/* Monitoring Section */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
                    <Server className="w-5 h-5 text-emerald-600" />
                    <span>Tableau de Bord Détaillé (Monitoring)</span>
                  </h4>
                </div>

                <div className="text-xs font-mono bg-gray-900 text-emerald-400 p-4 rounded-xl overflow-x-auto max-h-64 shadow-inner">
                  <pre>{JSON.stringify(monitoring, null, 2)}</pre>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between shrink-0">
          <span className="text-xs text-gray-400">BakeliRadar Monitoring</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all cursor-pointer shadow-sm"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
