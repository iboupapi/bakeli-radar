import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, MapPin, AlertCircle } from 'lucide-react';

export const MarketTrends = ({ marketStats }) => {
  const typesDistribution = marketStats?.typesDistribution || [];
  const topRegions = marketStats?.topRegions || [];

  return (
    <div className="flex-1 flex flex-col gap-8 animate-fadeIn">
      
      {/* Title section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm uppercase tracking-wider">
          <TrendingUp className="w-4 h-4" />
          <span>Tendances & Statistiques</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Insight du Marché
        </h1>
        <p className="text-gray-500 text-base">
          Analyse en temps réel des opportunités disponibles au Sénégal.
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Bar Chart: Répartition par Type */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
              Répartition par Type
            </h3>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            {typesDistribution.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 text-gray-400 text-sm">
                <AlertCircle className="w-8 h-8 text-gray-300 animate-pulse" />
                <span>Chargement des données ou aucune donnée disponible...</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={typesDistribution}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis type="number" hide />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fill: '#4b5563', fontSize: 13, fontWeight: 500 }}
                    width={90}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                  />
                  <Bar 
                    dataKey="count" 
                    radius={[0, 8, 8, 0]}
                    barSize={20}
                  >
                    {typesDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Doughnut Chart: Top Régions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              Top Régions
            </h3>
          </div>

          <div className="h-60 w-full relative flex items-center justify-center">
            {topRegions.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 text-gray-400 text-sm">
                <AlertCircle className="w-8 h-8 text-gray-300 animate-pulse" />
                <span>Chargement des données ou aucune donnée disponible...</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topRegions}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {topRegions.map((entry, index) => (
                      <Cell key={`region-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Custom Legend */}
          {topRegions.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2">
              {topRegions.map((reg, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: reg.color }}></span>
                  <span>{reg.name} ({reg.value})</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
