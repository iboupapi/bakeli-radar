import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User } from 'lucide-react';
import { apiService } from '../services/api';

export const RadarAiModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Bonjour ! Je suis le Radar AI. Je peux t'aider à trouver le stage, l'emploi ou la bourse idéal(e) au Sénégal. Que recherches-tu aujourd'hui ?"
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || loading) return;

    const userMsg = inputVal.trim();
    setInputVal('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await apiService.sendAiMessage(userMsg);
      setMessages(prev => [...prev, { sender: 'ai', text: res.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: "Désolé, une erreur est survenue. Veuillez réessayer." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full h-[600px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden relative">
        
        {/* Top Emerald Header matching screenshot 2 */}
        <div className="bg-emerald-800 text-white p-6 flex items-center justify-between relative shrink-0">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-700 rounded-full opacity-40 pointer-events-none"></div>
          
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-700/80 border border-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-6 h-6 text-emerald-200 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Radar AI Assistant</h3>
              <p className="text-xs text-emerald-200 font-medium">Toujours à l'écoute des opportunités</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-emerald-700/60 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-gray-50/50">
          {messages.map((msg, index) => {
            const isAi = msg.sender === 'ai';
            return (
              <div 
                key={index}
                className={`flex items-start gap-3 max-w-[85%] ${isAi ? 'self-start' : 'self-end flex-row-reverse'}`}
              >
                {isAi ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                    <User className="w-4 h-4" />
                  </div>
                )}

                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-xs ${
                  isAi 
                    ? 'bg-white text-gray-800 border border-gray-100 rounded-tl-xs' 
                    : 'bg-emerald-600 text-white rounded-tr-xs'
                }`}>
                  {isAi && (
                    <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">
                      RADAR AI
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-3 max-w-[85%] self-start animate-pulse">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 bg-white text-gray-500 border border-gray-100 rounded-2xl rounded-tl-xs text-sm">
                En train de chercher les meilleures opportunités...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Footer */}
        <div className="p-4 bg-white border-t border-gray-100 flex flex-col gap-2 shrink-0">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              placeholder="Ex: Stages en info à Dakar..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || loading}
              className="absolute right-2 w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[11px] text-center text-gray-400">
            L'IA peut faire des erreurs. Vérifiez les infos officielles.
          </p>
        </div>

      </div>
    </div>
  );
};
