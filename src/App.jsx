import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { MarketInsightsPage } from './pages/MarketInsightsPage';
import { PartnersPage } from './pages/PartnersPage';

export function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<OpportunitiesPage />} />
        <Route path="/opportunities" element={<OpportunitiesPage />} />
        <Route path="/opportunities/:id" element={<JobDetailPage />} />
        <Route path="/trends" element={<MarketInsightsPage />} />
        <Route path="/partners" element={<PartnersPage />} />
      </Route>
    </Routes>
  );
}

export default App;
