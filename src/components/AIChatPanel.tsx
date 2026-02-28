import React, { useState } from 'react';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const AIChatPanel: React.FC = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Hello! I'm your NexusAI assistant. How can I help with your career today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: input,
        config: {
          systemInstruction: "You are NexusAI, a premium career coach assistant. You help students with job matching, resume optimization, and interview prep. Keep responses concise, professional, and insightful.",
        }
      });

      const botMsg = { role: 'bot', content: response.text || "I'm sorry, I couldn't process that request." };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('AI Error:', err);
      setMessages(prev => [...prev, { role: 'bot', content: "I'm having trouble connecting to my intelligence core right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black rounded-[40px] border border-white/10 overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/10 bg-white/[0.02] flex items-center gap-3">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Sparkles size={18} className="text-primary" />
        </div>
        <h3 className="font-black text-xs uppercase tracking-widest text-white/80">AI Career Coach</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none shadow-[0_10px_20px_rgba(124,77,255,0.2)]' 
                  : 'bg-white/5 text-white/80 border border-white/10 rounded-tl-none'
              }`}>
                <div className="flex items-center gap-2 mb-2 opacity-40 text-[9px] uppercase font-black tracking-widest">
                  {msg.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                  {msg.role === 'user' ? 'You' : 'Nexus AI'}
                </div>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-6 border-t border-white/10 bg-white/[0.02]">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Nexus Intelligence..."
            className="w-full pl-6 pr-14 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-primary/50 text-sm font-medium transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-primary hover:bg-primary/10 rounded-xl transition-all disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};
