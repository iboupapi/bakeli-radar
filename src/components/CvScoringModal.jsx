import React, { useState, useEffect } from 'react';
import { FileUp, X, Sparkles, CheckCircle2, AlertCircle, Award, History, BarChart3, User, LogIn, LogOut, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';

export const CvScoringModal = ({ isOpen, onClose, selectedJob }) => {
  const [activeTab, setActiveTab] = useState('direct'); // 'direct' | 'profile' | 'history' | 'stats'
  const [isLoggedIn, setIsLoggedIn] = useState(apiService.isLoggedIn());
  // job scrapé pré-sélectionné depuis OpportunityCard
  // offer_url préféré (stable après re-scraping), fallback id numérique
  const scrapedJobId = selectedJob ? String(selectedJob.offer_url ?? selectedJob.id ?? "") : null;
  const scrapedJobLabel = selectedJob ? `${selectedJob.title || "Offre"} — ${selectedJob.company || ""}` : null;
  const scrapedJobIsUrl = scrapedJobId ? scrapedJobId.startsWith("http") : false;
  
  // Auth state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(null);

  // Direct analysis state
  const [cvFile, setCvFile] = useState(null);
  const [jobFile, setJobFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Profile & Stored CV analysis state
  const [profile, setProfile] = useState(null);
  const [jobUrl, setJobUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setIsLoggedIn(apiService.isLoggedIn());
      // Si une offre scrapée est passée, on force l'onglet adapté (profile si connecté, sinon direct)
      if (selectedJob) {
        // Ne force pas si l'utilisateur navigue déjà dans history/stats
        if (activeTab === 'direct' || activeTab === 'auth') {
          // reste sur direct (upload CV seul) ou profile selon login
        }
      }
      if (apiService.isLoggedIn()) {
        loadUserData();
      }
      // reset résultat quand on change d'offre
      setResult(null);
      setError(null);
    }
  }, [isOpen, activeTab, selectedJob]);

  const loadUserData = async () => {
    try {
      if (activeTab === 'profile') {
        const p = await apiService.getCvProfile();
        setProfile(p);
      } else if (activeTab === 'history') {
        const h = await apiService.getCvHistory();
        setHistory(Array.isArray(h) ? h : h.results || []);
      } else if (activeTab === 'stats') {
        const s = await apiService.getCvStats();
        setStats(s);
      }
    } catch (err) {
      console.error("Error loading user data", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError(null);
    try {
      await apiService.login(username, password);
      setIsLoggedIn(true);
      loadUserData();
    } catch (err) {
      setAuthError("Identifiants incorrects.");
    }
  };

  const handleLogout = () => {
    apiService.logout();
    setIsLoggedIn(false);
    setActiveTab('direct');
  };

  const handleDirectMatch = async (e) => {
    e.preventDefault();
    // Mode scrapé : offre déjà sélectionnée -> un seul fichier CV + job_id (offer_url)
    if (scrapedJobId) {
      if (!cvFile) {
        setError("Veuillez sélectionner votre CV.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // Tentative 1: offer_url (stable), Tentative 2: id si échec
        let res;
        try {
          res = await apiService.analyzeScrapedPublic(scrapedJobId, cvFile);
        } catch (err) {
          if (scrapedJobIsUrl && selectedJob?.id != null && String(err.message).includes("non trouvée")) {
            res = await apiService.analyzeScrapedPublic(String(selectedJob.id), cvFile);
          } else {
            throw err;
          }
        }
        setResult(res.result || res);
      } catch (err) {
        setError(err.message || "Erreur lors de l'analyse scrapée.");
      } finally {
        setLoading(false);
      }
      return;
    }
    if (!cvFile || !jobFile) {
      setError("Veuillez sélectionner un CV et une offre.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.matchCvFile(cvFile, jobFile);
      setResult(res.result || res);
    } catch (err) {
      setError(err.message || "Erreur lors de l'analyse.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeStored = async (e) => {
    e.preventDefault();
    // Mode scrapé avec profil : utilise l'offre sélectionnée
    if (scrapedJobId) {
      setLoading(true);
      setError(null);
      try {
        const res = await apiService.analyzeScrapedProfile(scrapedJobId);
        setResult(res.result || res);
      } catch (err) {
        setError(err.message || "Erreur lors de l'analyse du CV stocké (offre scrapée).");
      } finally {
        setLoading(false);
      }
      return;
    }
    if (!jobUrl) {
      setError("Veuillez entrer une URL d'offre.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.analyzeStoredCv(jobUrl);
      setResult(res.result || res);
    } catch (err) {
      setError(err.message || "Erreur lors de l'analyse du CV stocké.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl w-[95vw] sm:max-w-2xl max-h-[90vh] shadow-2xl border border-gray-100 flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-emerald-800 text-white p-6 flex items-center justify-between relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/80 flex items-center justify-center text-emerald-200">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Analyse & Scoring CV (IA)</h3>
              <p className="text-xs text-emerald-200 font-medium">Matching intelligent et profil candidat</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-emerald-700/60 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/80 px-4 pt-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('direct'); setResult(null); }}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'direct' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Analyse Directe (Fichiers)
          </button>

          {isLoggedIn ? (
            <>
              <button
                onClick={() => { setActiveTab('profile'); setResult(null); loadUserData(); }}
                className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'profile' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Mon Profil CV
              </button>
              <button
                onClick={() => { setActiveTab('history'); setResult(null); loadUserData(); }}
                className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'history' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Historique
              </button>
              <button
                onClick={() => { setActiveTab('stats'); setResult(null); loadUserData(); }}
                className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'stats' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Statistiques
              </button>
            </>
          ) : (
            <button
              onClick={() => setActiveTab('auth')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'auth' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Connexion / Compte
            </button>
          )}
        </div>

        {/* Bandeau offre scrapée sélectionnée */}
        {selectedJob && (
          <div className="mx-6 mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Offre sélectionnée</span>
              <p className="text-sm font-bold text-emerald-900 line-clamp-2">{scrapedJobLabel}</p>
              <p className="text-xs text-emerald-700/70 break-all">{scrapedJobIsUrl ? `URL: ${scrapedJobId.slice(0,60)}…` : `ID: ${scrapedJobId}`} • {selectedJob.location || ""} • {selectedJob.type || ""}</p>
              {selectedJob.offer_url && <a href={selectedJob.offer_url} target="_blank" rel="noreferrer" className="text-xs text-emerald-700 underline">Voir l'offre originale</a>}
            </div>
            <span className="px-2.5 py-1 bg-white border border-emerald-200 rounded-full text-xs font-semibold text-emerald-700 whitespace-nowrap">Scrapée</span>
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 bg-gray-50/50 flex-1">
          
          {/* TAB: DIRECT ANALYSIS */}
          {activeTab === 'direct' && (
            result ? (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Score de Correspondance</span>
                    <h4 className="text-3xl font-extrabold text-emerald-900">{result.score}%</h4>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                    <Award className="w-8 h-8" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col gap-2">
                  <h5 className="font-bold text-gray-900 text-sm">Évaluation générale</h5>
                  <p className="text-sm text-gray-600 leading-relaxed">{result.description}</p>
                </div>

                {result.matching_analysis && (
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col gap-3">
                    <h5 className="font-bold text-gray-900 text-sm">Compétences correspondantes</h5>
                    <div className="flex flex-wrap gap-2">
                      {result.matching_analysis.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {result.recommendation && (
                  <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex flex-col gap-2">
                    <h5 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Recommandations</span>
                    </h5>
                    <p className="text-sm text-amber-800 leading-relaxed">{result.recommendation}</p>
                  </div>
                )}

                <button
                  onClick={() => setResult(null)}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-all cursor-pointer"
                >
                  Nouvelle analyse
                </button>
              </div>
            ) : (
              <form onSubmit={handleDirectMatch} className="flex flex-col gap-5">
                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Votre CV (PDF / DOCX — max 5 Mo)</label>
                  <label className="border-2 border-dashed border-gray-200 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-white cursor-pointer transition-colors">
                    <FileUp className="w-8 h-8 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-700">{cvFile ? cvFile.name : "Importer votre CV"}</span>
                    <input type="file" accept=".pdf,.doc,.docx,.txt,.md" onChange={(e) => setCvFile(e.target.files[0])} className="hidden" />
                  </label>
                </div>

                {scrapedJobId ? (
                  <div className="bg-white border border-emerald-100 rounded-2xl p-4 flex flex-col gap-1">
                    <span className="text-xs font-bold text-emerald-700">Offre utilisée</span>
                    <span className="text-sm text-gray-700">{scrapedJobLabel}</span>
                    <span className="text-xs text-gray-500">Vous n'avez plus qu'à déposer votre CV — l'offre est déjà chargée.</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Offre d'emploi (Fichier)</label>
                    <label className="border-2 border-dashed border-gray-200 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-white cursor-pointer transition-colors">
                      <FileUp className="w-8 h-8 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-700">{jobFile ? jobFile.name : "Importer l'offre"}</span>
                      <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e) => setJobFile(e.target.files[0])} className="hidden" />
                    </label>
                    <p className="text-xs text-gray-400">Astuce : cliquez sur <b>Scorer mon CV sur cette offre</b> depuis une carte pour pré-remplir l'offre scrapée.</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  <span>Analyser mon CV</span>
                </button>
              </form>
            )
          )}

          {/* TAB: AUTHENTICATION */}
          {activeTab === 'auth' && !isLoggedIn && (
            <form onSubmit={handleLogin} className="flex flex-col gap-4 max-w-sm mx-auto w-full py-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 mx-auto">
                <LogIn className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 text-center text-lg">Connexion / Inscription JWT</h4>
              
              {authError && (
                <p className="text-xs text-rose-600 text-center font-medium">{authError}</p>
              )}

              <input
                type="text"
                required
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="password"
                required
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md cursor-pointer"
              >
                Se connecter
              </button>
            </form>
          )}

          {/* TAB: PROFILE */}
          {activeTab === 'profile' && isLoggedIn && (
            <div className="flex flex-col gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col gap-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-600" />
                    <span>Profil CV Enregistré</span>
                  </h4>
                  <button onClick={handleLogout} className="text-xs text-rose-600 hover:underline flex items-center gap-1">
                    <LogOut className="w-3.5 h-3.5" /> Déconnexion
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {profile?.cv_file ? "CV actuellement stocké sur votre profil." : "Aucun CV stocké actuellement."}
                </p>

                <form onSubmit={handleAnalyzeStored} className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  {scrapedJobId ? (
                    <>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Offre sélectionnée (CV stocké)</label>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                        <p className="text-sm font-semibold text-emerald-900">{scrapedJobLabel}</p>
                        <p className="text-xs text-emerald-700">ID: {scrapedJobId}</p>
                      </div>
                      <p className="text-xs text-gray-500">Votre CV enregistré sera automatiquement comparé à cette offre scrapée.</p>
                    </>
                  ) : (
                    <>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Analyser mon CV stocké vs URL d'offre</label>
                      <input
                        type="url"
                        placeholder="https://emploisenegal.com/offre/..."
                        value={jobUrl}
                        onChange={(e) => setJobUrl(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                      />
                    </>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md cursor-pointer"
                  >
                    {loading ? "Analyse en cours..." : scrapedJobId ? "Scorer mon CV stocké" : "Lancer l'analyse du profil"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB: HISTORY */}
          {activeTab === 'history' && isLoggedIn && (
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-600" />
                <span>Historique des Analyses</span>
              </h4>
              {history.length === 0 ? (
                <p className="text-sm text-gray-400 py-8 text-center">Aucun historique d'analyse trouvé.</p>
              ) : (
                history.map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between shadow-2xs">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-gray-800 text-sm">{item.job_title || "Offre d'emploi"}</span>
                      <span className="text-xs text-gray-400">{item.created_at || "Récemment"}</span>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                      {item.score}%
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: STATS */}
          {activeTab === 'stats' && isLoggedIn && (
            <div className="flex flex-col gap-6">
              <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                <span>Statistiques Personnelles</span>
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col gap-1 shadow-xs">
                  <span className="text-xs text-gray-400 font-medium">Total Analyses</span>
                  <span className="text-2xl font-extrabold text-emerald-700">{stats?.total_analyses || 0}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col gap-1 shadow-xs">
                  <span className="text-xs text-gray-400 font-medium">Score Moyen</span>
                  <span className="text-2xl font-extrabold text-emerald-700">{stats?.average_score || 0}%</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
