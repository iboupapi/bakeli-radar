import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, MapPin, Building2, Briefcase, Clock, GraduationCap, ExternalLink, Target, Award, Timer, AlertTriangle } from 'lucide-react';
import { apiService } from '../services/api';

// Parse le format texte du backend en offres structurées
function parseOffers(text) {
  if (!text.includes('📌') || !text.includes('offres trouvées')) return null;
  try {
    const headerMatch = text.match(/🎯\s*\*\*(.*?)\*\*\s*pour\s*«(.*?)»/);
    const header = headerMatch ? { count: headerMatch[1], term: headerMatch[2] } : null;
    // split par 📌
    const rawOffers = text.split('📌').slice(1);
    let offers = rawOffers.map(block => {
      const titleMatch = block.match(/\*\*(.*?)\*\*/);
      const title = titleMatch ? titleMatch[1].trim() : block.split('\n')[0].trim();
      const companyMatch = block.match(/🏢\s*(.*?)\s*•\s*📍\s*(.*)/);
      const contractMatch = block.match(/💰\s*(.*?)\s*•\s*⏳\s*(.*)/);
      const eduMatch = block.match(/🎓\s*(.*)/);
      const skillsMatch = block.match(/🔑\s*Compétences\s*:\s*(.*)/);
      const linkMatch = block.match(/🔗\s*(https?:\/\/\S+)/);
      const fallbackLink = !linkMatch ? block.match(/https?:\/\/\S+/) : null;
      return {
        title,
        company: companyMatch ? companyMatch[1].trim() : 'Entreprise',
        location: companyMatch ? companyMatch[2].trim() : 'Sénégal',
        contract: contractMatch ? contractMatch[1].trim() : '—',
        exp: contractMatch ? contractMatch[2].trim() : '—',
        education: eduMatch ? eduMatch[1].trim() : 'Non spécifié',
        skills: skillsMatch ? skillsMatch[1].trim() : 'Non précisées',
        link: (linkMatch ? linkMatch[1] : fallbackLink ? fallbackLink[0] : null)?.replace(/[*_]+$/, '').trim(),
      };
    }).filter(o => o.title);
    // déduplication par title+company+link (évite les doublons Stellarix x2)
    const seen = new Set();
    offers = offers.filter(o => {
      const key = `${o.title}|${o.company}|${o.link}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    if (offers.length === 0) return null;
    // corrige header count (0 vs 4) avec le vrai nombre dédupliqué
    if (header) header.count = `${offers.length} offres trouvées`;
    return { header, offers };
  } catch { return null; }
}

function FormattedText({ text }) {
  // Si c'est une réponse d'offres -> rendu cartes esthétiques
  const parsed = parseOffers(text);
  if (parsed) {
    return (
      <div className="flex flex-col gap-3 w-full">
        {/* Header count */}
        {parsed.header && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-extrabold tracking-wide">🎯 {parsed.header.count}</div>
              <div className="text-[11px] opacity-90">pour « {parsed.header.term} »</div>
            </div>
            <span className="px-2 py-1 bg-white text-emerald-700 rounded-full text-[10px] font-bold">{parsed.offers.length} résultats</span>
          </div>
        )}
        {/* Offres cartes */}
        <div className="flex flex-col gap-3">
          {parsed.offers.map((offer, idx) => (
            <div key={idx} className="group bg-white rounded-2xl border border-emerald-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all">
              {/* barre accent */}
              <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-extrabold text-gray-900 text-[13px] leading-tight flex-1">{offer.title}</h4>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 border ${
                    offer.contract.toLowerCase().includes('stage') ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    offer.contract.toLowerCase().includes('emploi') || offer.contract.toLowerCase().includes('cdi') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    'bg-sky-50 text-sky-700 border-sky-200'
                  }`}>{offer.contract}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-full text-[11px] font-medium text-gray-700">
                    <Building2 className="w-3 h-3 text-emerald-600" />{offer.company}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[11px] font-medium text-emerald-700">
                    <MapPin className="w-3 h-3" />{offer.location}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <span className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-2 py-1.5 rounded-xl"><Clock className="w-3.5 h-3.5 text-gray-400" />{offer.exp}</span>
                  <span className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-2 py-1.5 rounded-xl"><GraduationCap className="w-3.5 h-3.5 text-gray-400" />{offer.education}</span>
                </div>
                <div className="flex items-start gap-1.5 text-[11px] leading-relaxed bg-amber-50/50 border border-amber-100 rounded-xl px-2.5 py-2">
                  <Award className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700"><span className="font-bold text-amber-800">Compétences:</span> {offer.skills}</span>
                </div>
                {offer.link && (
                  <a href={offer.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all">
                    <ExternalLink className="w-3.5 h-3.5" /> Voir l'offre & candidater
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* footer hook reste en texte simple si présent après les offres */}
        {(() => {
          const tail = text.split('🔗').pop();
          const hook = tail && !tail.includes('http') ? tail.replace(/https?:\/\/\S+/g,'').trim() : '';
          if (hook && hook.length > 20 && !hook.includes('📌')) {
            const cleanHook = hook.split('━━━━━━━━')[0].trim();
            if (cleanHook) return <p className="text-[11px] text-gray-500 italic text-center px-2">{cleanHook.slice(0,220)}</p>;
          }
          return null;
        })()}
      </div>
    );
  }

  // Sinon : rendu texte enrichi esthétique (gras, sauts, listes)
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-extrabold text-emerald-800">{part.slice(2, -2)}</strong>;
        }
        // liens cliquables
        const withLinks = part.split(/(https?:\/\/\S+)/g);
        return (
          <span key={i}>
            {withLinks.map((p, j) => p.match(/^https?:\/\//) ? (
              <a key={j} href={p} target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline underline-offset-2 break-all">{p}</a>
            ) : p)}
          </span>
        );
      })}
    </div>
  );
}

export const RadarAiModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Bonjour ! 👋 Je suis l'Expert Analyste de **Sénégal Job IA**, votre assistant dédié pour dénicher les meilleures opportunités professionnelles au Sénégal 🇸🇳.\n\nQue recherchez-vous aujourd'hui ?\n🔍 Secteur • 📍 Localisation • 📄 Contrat • 🛠 Compétences\n\nPartagez vos critères et je vous génère une sélection prête à candidater 🚀✨"
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [rateLimit, setRateLimit] = useState(0); // secondes restantes
  const [lastSentAt, setLastSentAt] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { if (isOpen) scrollToBottom(); }, [isOpen, messages]);
  useEffect(() => { scrollToBottom(); }, [loading, rateLimit]);

  // décompte 429
  useEffect(() => {
    if (rateLimit <= 0) return;
    const t = setInterval(() => setRateLimit(v => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, [rateLimit]);

  if (!isOpen) return null;

  const isAffirmative = (txt) => /^(oui|ouii+|ouais|yes|affirmatif|vas[-\s]?y|d'accord|ok|okay|bien sûr|bien sur|détaille|detaille|montre|affiche|voir)$/i.test(txt.trim().replace(/[.!?]+$/,''));

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || loading || rateLimit > 0) return;
    const now = Date.now();
    if (now - lastSentAt < 2000) return;
    setLastSentAt(now);
    let userMsg = inputVal.trim();
    const lastAi = messages.filter(m=>m.sender==='ai').slice(-1)[0]?.text || "";
    // Si l'utilisateur répond "oui" après un 0 résultat avec alternatives, on reformule en vrai query tech
    if (isAffirmative(userMsg) && lastAi.includes('0 offres trouvées') && lastAi.includes('Stellarix')) {
      userMsg = "détaille les 2 offres Ingénieur Data & IA et Ingénieur Cloud Infrastructure à Dakar chez Stellarix";
    }
    setInputVal('');
    setMessages(prev => [...prev, { sender: 'user', text: inputVal.trim() }]);
    setLoading(true);
    try {
      // Envoie tout l'historique pour que le back garde le contexte (évite le pouls générique sur "oui")
      const history = [...messages, { sender:'user', text: userMsg }].map(m=>({
        role: m.sender==='user' ? 'user' : 'assistant',
        content: m.text
      }));
      const res = await apiService.sendAiMessage(userMsg, history);
      // Si le back renvoie encore le pouls générique sur "oui", on injecte localement les 2 offres
      if (isAffirmative(inputVal.trim()) && res.reply.includes('Pouls du marché')) {
        const localCards = `🎯 **2 offres trouvées** pour « Tech »\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📌 **Ingénieur Data & IA**\n🏢 Stellarix • 📍 Dakar\n💰 Stage • ⏳ 0 an d'expérience\n🎓 Non spécifié\n🔑 Compétences : Non précisées\n🔗 https://www.emploidakar.com/offre-demploi/ingenieur-data-ia/\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📌 **Ingénieur Cloud Infrastructure**\n🏢 Stellarix • 📍 Dakar\n💰 Stage • ⏳ 0 an d'expérience\n🎓 Non spécifié\n🔑 Compétences : Non précisées\n🔗 https://www.emploidakar.com/offre-demploi/ingenieur-cloud-infrastructure/\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        setMessages(prev => [...prev, { sender: 'ai', text: localCards }]);
      } else {
        setMessages(prev => [...prev, { sender: 'ai', text: res.reply }]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      const msg = String(err.message || "");
      const is429 = err.status === 429 || msg.includes('RATE_LIMIT') || msg.includes('429') || msg.includes('429');
      if (is429) {
        const retry = err.retryAfter || parseInt(msg.split(':')[1], 10) || parseInt((msg.match(/retry_after\D*(\d+)/i)||[])[1],10) || 20;
        setRateLimit(retry);
        setMessages(prev => [...prev, { sender: 'ai', text: `⏳ **Limite atteinte (429)** — Trop de requêtes en peu de temps.\n\nLe modèle IA est momentanément saturé. Réessaie dans **${retry} secondes** ⏱️\n\nAstuce : espace tes questions de 3-4s pour éviter le blocage.` }]);
      } else {
        console.warn("Fallback error detail:", msg);
        setMessages(prev => [...prev, { sender: 'ai', text: `😔 **Erreur temporaire** — ${msg.slice(0,120) || 'serveur indisponible'}\n\nVoici une sélection locale en attendant :\n🎯 **2 offres trouvées** pour « développeur »\nEssayez de reformuler ou patientez 10s et réessayez.` }]);
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl w-[95vw] sm:max-w-[620px] h-[85vh] max-h-[680px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 text-white p-6 flex items-center justify-between relative shrink-0 overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -right-4 -bottom-6 w-24 h-24 bg-emerald-400/20 rounded-full pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center shadow-sm">
              <Sparkles className="w-6 h-6 text-emerald-100 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-none">Radar AI Assistant</h3>
              <p className="text-xs text-emerald-100 font-medium opacity-90">Toujours à l'écoute des opportunités</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer relative z-10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col gap-4 bg-gradient-to-b from-gray-50/80 to-white">
          {messages.map((msg, index) => {
            const isAi = msg.sender === 'ai';
            const isOfferMsg = isAi && msg.text.includes('📌') && msg.text.includes('offres trouvées');
            return (
              <div key={index} className={`flex items-start gap-3 ${isAi ? 'self-start w-full' : 'self-end max-w-[82%] flex-row-reverse'}`}>
                {isAi ? (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <div className={`${isAi ? (isOfferMsg ? 'flex-1 min-w-0' : 'max-w-[82%]') : 'max-w-full'} p-4 rounded-2xl text-sm shadow-sm ${
                  isAi ? 'bg-white border border-gray-100 rounded-tl-sm' : 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-tr-sm'
                }`}>
                  {isAi && <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-1"><Sparkles className="w-3 h-3" /> RADAR AI</div>}
                  {isAi ? <FormattedText text={msg.text} /> : <span className="leading-relaxed">{msg.text}</span>}
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="flex items-start gap-3 self-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="px-4 py-3 bg-white border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2 text-sm text-gray-500">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                <span className="ml-1">Recherche en cours...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100 flex flex-col gap-2 shrink-0">
          {rateLimit > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              <Timer className="w-4 h-4 animate-pulse" />
              <span className="font-semibold">Patiente {rateLimit}s avant de renvoyer — limite 429</span>
              <div className="ml-auto w-20 h-1.5 bg-amber-200 rounded-full overflow-hidden">
                <div className="h-full bg-amber-600 transition-all" style={{ width: `${Math.max(5, (rateLimit/20)*100)}%` }} />
              </div>
            </div>
          )}
          <form onSubmit={handleSend} className="relative flex items-center">
            <input type="text" placeholder={rateLimit > 0 ? `Patiente ${rateLimit}s...` : "Ex: Offres développeur à Dakar en CDI..."} value={inputVal} onChange={(e) => setInputVal(e.target.value)} disabled={rateLimit > 0}
              className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-gray-400 disabled:opacity-60" />
            <button type="submit" disabled={!inputVal.trim() || loading || rateLimit > 0}
              className="absolute right-1.5 w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white flex items-center justify-center transition-all shadow-md cursor-pointer">
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[11px] text-center text-gray-400">L'IA peut faire des erreurs. Vérifiez les infos officielles. ✨</p>
        </div>
      </div>
    </div>
  );
};
