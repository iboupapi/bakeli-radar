# BakeliRadar - Frontend React & Veille d'Opportunités

Plateforme web moderne d'agrégation et de veille d'opportunités (emplois, stages, bourses, concours, prestations, formations), d'insights du marché au Sénégal, et de scoring CV par IA.

---

## 🚀 Stack Technique

- **React 19** + **Vite** (Build ultrarapide et HMR)
- **React Router DOM** (Routage client et navigation par pages)
- **TanStack Query (`@tanstack/react-query`)** (Gestion d'état serveur, cache et requêtes API)
- **Tailwind CSS v3** (Design system & styling moderne)
- **Lucide React** (Icônes vectorielles épurées)
- **Recharts** (Visualisation des données et tendances du marché)

---

## 📁 Structure Propre du Projet (`src/`)

```text
src/
├── components/          # Composants UI modulaires et réutilisables
│   ├── AlertsModal.jsx      # Modale de création d'alertes email
│   ├── CvScoringModal.jsx   # Scoring CV par IA & gestion profil candidat
│   ├── Footer.jsx           # Pied de page officiel (Bakeli School of Technology)
│   ├── MarketTrends.jsx     # Vue "Tendances Marché" (Graphiques barres & doughnut)
│   ├── MonitoringModal.jsx  # État de santé et métriques du backend
│   ├── Navbar.jsx           # En-tête (Navigation, Logo officiel & Actions)
│   ├── OpportunityCard.jsx  # Carte individuelle d'opportunité avec badges colorés
│   ├── OpportunityList.jsx# Grille des opportunités et en-tête de résultats
│   ├── PartnersView.jsx     # Vue "Partenaires"
│   ├── RadarAiModal.jsx     # Assistant conversationnel "Radar AI" (Panneau latéral)
│   └── SidebarFilters.jsx   # Barre latérale de filtres sticky
├── layouts/
│   └── RootLayout.jsx       # Layout global (Navbar, Outlet, Footer, Modales)
├── pages/
│   ├── JobDetailPage.jsx    # Page de détail d'une offre
│   ├── MarketInsightsPage.jsx# Page des tendances du marché
│   ├── OpportunitiesPage.jsx# Page principale des offres et filtres
│   └── PartnersPage.jsx     # Page des partenaires
├── services/
│   └── api.js           # Couche API centralisée (JWT, Endpoints REST, fallbacks)
├── App.jsx              # Définition des routes principales
├── main.jsx             # Point d'entrée React avec QueryClientProvider & Router
└── index.css            # Directives Tailwind CSS
```

---

## 🛠️ Installation & Lancement

1. **Installer les dépendances :**
   ```bash
   npm install
   ```

2. **Configurer l'environnement (`.env`) :**
   ```env
   VITE_API_BASE_URL=https://api-wagan.bakeli.tech/api/radar_jobs
   ```

3. **Lancer le serveur de développement :**
   ```bash
   npm run dev
   ```

4. **Compiler pour la production :**
   ```bash
   npm run build
   ```
