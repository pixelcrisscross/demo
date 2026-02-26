import React, { useState } from 'react';
import { Send, Sparkles, User, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AIChatPanel: React.FC = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Hello! I'm your NexusAI assistant. How can I help with your career today?" }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: "That's a great question! Based on your profile, I'd recommend focusing on your React skills for the upcoming TechFlow interview." 
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl card-shadow border border-border/50 overflow-hidden">
      <div className="p-4 border-bottom border-border bg-primary/5 flex items-center gap-2">
        <Sparkles size={18} className="text-primary" />
        <h3 className="font-bold text-sm uppercase tracking-wider">AI Career Coach</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-gray-100 text-text-primary rounded-tl-none'
              }`}>
                <div className="flex items-center gap-2 mb-1 opacity-70 text-[10px] uppercase font-bold">
                  {msg.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                  {msg.role === 'user' ? 'You' : 'Nexus AI'}
                </div>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-border">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
