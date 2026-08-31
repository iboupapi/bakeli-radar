import { initialOpportunities, marketStats, partnersList } from '../data/mockData';

const delay = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  // Fetch all opportunities with optional filters
  async getOpportunities(filters = {}) {
    await delay();
    let data = [...initialOpportunities];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.company.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (filters.type && filters.type !== "Tout voir") {
      data = data.filter(item => item.type.toLowerCase() === filters.type.toLowerCase());
    }

    if (filters.location && filters.location !== "Toute les régions") {
      data = data.filter(item => item.location.toLowerCase() === filters.location.toLowerCase());
    }

    return {
      success: true,
      count: data.length,
      lastUpdated: "Aujourd'hui à 08:30",
      data
    };
  },

  // Fetch market insights / trends statistics
  async getMarketInsights() {
    await delay();
    return {
      success: true,
      totalJobs: initialOpportunities.length,
      lastUpdate: "Aujourd'hui à 08:30",
      data: marketStats
    };
  },

  // Fetch partners list
  async getPartners() {
    await delay();
    return {
      success: true,
      data: partnersList
    };
  },

  // AI Assistant chat endpoint
  async sendAiMessage(message) {
    await delay(500);
    const msgLower = message.toLowerCase();
    let responseText = "Je peux t'aider à trouver le stage, l'emploi ou la bourse idéal(e) au Sénégal. Que recherches-tu aujourd'hui ?";
    
    if (msgLower.includes("stage") || msgLower.includes("marketing")) {
      responseText = "J'ai trouvé 3 stages intéressants au Sénégal, notamment chez Orange Sénégal (Assistant Marketing) et Kirilene (Community Manager). Souhaites-tu postuler ?";
    } else if (msgLower.includes("emploi") || msgLower.includes("développeur") || msgLower.includes("dev")) {
      responseText = "Plusieurs offres d'emploi tech sont disponibles, notamment Développeur Full Stack chez Bakeli Tech (Dakar) et Technicien Réseaux chez Free Sénégal (Thiès).";
    } else if (msgLower.includes("bourse") || msgLower.includes("étude")) {
      responseText = "La Fondation Sonatel propose actuellement une bourse complète en sciences des données à l'UGB.";
    }

    return {
      success: true,
      reply: responseText
    };
  }
};
