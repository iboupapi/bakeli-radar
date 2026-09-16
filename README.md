# BakeliRadar — Plateforme Web & Veille d'Opportunités (Sénégal)

Plateforme web moderne d'agrégation, de veille d'opportunités (emplois, stages, bourses, concours, prestations, formations), d'analyse de marché et de scoring CV par IA au Sénégal.

---

## 🚀 Stack Technique & Architecture

- **React 19** + **Vite** (Build rapide, HMR)
- **Tailwind CSS v3** (Design system moderne & responsive)
- **Lucide React** (Icônes vectorielles)
- **Recharts** (Visualisation des tendances du marché)
- **Architecture Modulaire** (Séparation claire des responsabilités entre composants, services API et état global).

---

## 📁 Structure Propre du Projet (`src/`)

```text
src/
├── components/          # Composants UI modulaires
│   ├── AlertsModal.jsx      # Gestion des alertes email personnalisées
│   ├── CvScoringModal.jsx   # Scoring CV par IA & gestion profil candidat
│   ├── MarketTrends.jsx     # Visualisation graphique (Recharts)
│   ├── MonitoringModal.jsx  # État de santé et monitoring de l'API backend
│   ├── Navbar.jsx           # En-tête de navigation principale & actions
│   ├── OpportunityCard.jsx  # Carte individuelle d'opportunité
│   ├── OpportunityList.jsx  # Grille des offres et indicateurs de résultats
│   ├── PartnersView.jsx     # Vue des entreprises partenaires
│   └── RadarAiModal.jsx     # Assistant conversationnel intelligent (IA)
├── services/
│   └── api.js           # Couche API centralisée (JWT, Endpoints REST, fallbacks robustes)
├── App.jsx              # Composant racine & routage des vues principales
├── main.jsx             # Point d'entrée React 19
└── index.css            # Styles globaux & directives Tailwind
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

---

## 🔌 Intégration Backend & Services (`src/services/api.js`)

La couche `api.js` gère la communication avec l'API backend Django (`api-wagan.bakeli.tech`), incluant :
- Authentification JWT (stockage local, headers d'autorisation).
- Filtrage des opportunités par type, région et recherche textuelle.
- Endpoints de scoring CV (`/api/cv-scoring/`).
- Gestion transparente des fallbacks en cas de indisponibilité réseau ou mode local.
