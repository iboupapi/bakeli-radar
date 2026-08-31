# BakeliRadar - Frontend React

Plateforme web moderne d'agrégation et de veille d'opportunités (emplois, stages, bourses, concours, prestations, formations) et d'insights du marché au Sénégal.

---

## 🚀 Stack Technique

- **React 18** + **Vite** (Build ultrarapide et HMR)
- **Tailwind CSS v3** (Design system & styling moderne)
- **Lucide React** (Icônes vectorielles épurées)
- **Recharts** (Visualisation des données et tendances du marché)

---

## 📁 Structure du Projet

```text
src/
├── assets/            # Images et logos
├── components/        # Composants modulaires et réutilisables
│   ├── Navbar.jsx       # En-tête (Navigation & Actions)
│   ├── SidebarFilters.jsx # Barre de filtres (Recherche, types, régions, widget IA)
│   ├── OpportunityCard.jsx# Carte individuelle d'opportunité avec badges colorés
│   ├── OpportunityList.jsx# Grille des opportunités et en-tête de résultats
│   ├── MarketTrends.jsx # Vue "Tendances Marché" (Graphiques barres & doughnut)
│   ├── PartnersView.jsx   # Vue "Partenaires"
│   ├── AlertsModal.jsx    # Modale de création d'alertes email
│   └── RadarAiModal.jsx   # Assistant conversationnel "Radar AI"
├── data/              # Données mockées initiales
│   └── mockData.js      # Offres, statistiques de marché et partenaires
├── services/          # Couche API prête pour l'intégration backend
│   └── api.js           # Fonctions asynchrones (getOpportunities, sendAiMessage, etc.)
├── App.jsx            # Composant racine & gestion des onglets
├── main.jsx           # Point d'entrée React
└── index.css          # Directives Tailwind CSS
```

---

## 🛠️ Installation & Lancement

1. **Installer les dépendances :**
   ```bash
   npm install
   ```

2. **Lancer le serveur de développement :**
   ```bash
   npm run dev
   ```

3. **Compiler pour la production :**
   ```bash
   npm run build
   ```

---

## 🔌 Guide d'Intégration Backend (API Endpoints)

La couche service située dans **`src/services/api.js`** centralise tous les appels de données. Pour connecter le frontend aux endpoints réels de votre API backend, remplacez les simulations (`setTimeout` / mock data) par des requêtes `fetch` ou `axios` :

```javascript
// Exemple dans src/services/api.js
export const apiService = {
  async getOpportunities(filters = {}) {
    // Remplacer par un appel vers votre endpoint backend ex: /api/opportunities
    const response = await fetch(`/api/opportunities?search=${filters.search}&type=${filters.type}`);
    return await response.json();
  },

  async sendAiMessage(message) {
    // Remplacer par votre endpoint LLM / AI backend ex: /api/ai/chat
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    return await response.json();
  }
};
```

---

## 🧩 Guide de Modularité pour les Développeurs

- **Ajouter un type d'offre** : Mettez à jour le tableau `OFFER_TYPES` dans `SidebarFilters.jsx` et gérez la couleur du badge correspondant dans `OpportunityCard.jsx` (`getBadgeStyle`).
- **Ajouter des graphiques de marché** : Modifiez `MarketTrends.jsx` en utilisant `recharts` avec les données fournies par `marketStats` dans `mockData.js`.
- **Modifier l'assistant IA** : Le comportement de la modale `RadarAiModal.jsx` et ses réponses contextuelles peuvent être facilement branchés sur un agent conversationnel réel via `api.js`.
