import React, { useState } from 'react';
import { Bell, X, CheckCircle, Mail, Plus } from 'lucide-react';

export const AlertsModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon Header */}
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 shadow-xs">
          <Bell className="w-6 h-6" />
        </div>

        <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
          Créer une Alerte Opportunité
        </h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Ne ratez plus aucune opportunité au Sénégal. Recevez par email les nouvelles offres correspondant à vos critères.
        </p>

        {submitted ? (
          <div className="py-8 flex flex-col items-center justify-center gap-3 text-center animate-fadeIn">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
            <h4 className="font-bold text-gray-900 text-lg">Alerte créée avec succès !</h4>
            <p className="text-sm text-gray-500">Vous recevrez désormais les notifications par email.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Votre Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Fréquence des alertes</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="instant">Instantanée (Dès qu'une offre est publiée)</option>
                <option value="daily">Résumé Quotidien</option>
                <option value="weekly">Résumé Hebdomadaire</option>
              </select>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Activer l'alerte</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
