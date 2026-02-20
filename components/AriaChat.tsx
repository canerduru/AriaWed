import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToAria } from '../services/geminiService';
import { getAriaContext, getSuggestedPrompts } from '../services/ariaService';
import { isApiConfigured, ariaApi } from '../api/client';
import { ChatMessage, View } from '../types';
import { MessageCircle, X, Send, Loader2, Sparkles, Lightbulb, HeartHandshake } from 'lucide-react';

interface AriaChatProps {
  currentView?: View;
}

export const AriaChat: React.FC<AriaChatProps> = ({ currentView = View.DASHBOARD }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi! I'm Aria, your personal wedding assistant. I'm here to help you plan, budget, and stay calm. What's on your mind?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = getSuggestedPrompts(currentView);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const contextData = getAriaContext(currentView);
      const contextString = JSON.stringify(contextData);
      const responseText = isApiConfigured()
        ? (await ariaApi.chat(userMsg.text, contextString)).text
        : await sendMessageToAria(userMsg.text, contextString);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      <div className="pointer-events-auto">
      {isOpen && (
        <div className="mb-4 w-[90vw] sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-rose-100 flex flex-col h-[600px] animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-4 flex justify-between items-center text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                 <Sparkles size={18} className="text-white" />
              </div>
              <div>
                 <h3 className="font-bold text-sm">Aria Assistant</h3>
                 <p className="text-[10px] text-white/80 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" /> Online
                 </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1 rounded-full"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center mr-2 flex-shrink-0 border border-rose-200">
                        <Sparkles size={14} className="text-rose-500" />
                    </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-rose-500 text-white rounded-br-none'
                      : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                  }`}
                >
                  {msg.role === 'model' ? (
                      // Simple markdown-like rendering for bullet points
                      msg.text.split('\n').map((line, i) => (
                          <p key={i} className={line.startsWith('-') || line.startsWith('*') ? 'ml-4 mb-1' : 'mb-2 last:mb-0'}>
                              {line}
                          </p>
                      ))
                  ) : (
                      msg.text
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center mr-2 flex-shrink-0 border border-rose-200">
                    <Sparkles size={14} className="text-rose-500" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 flex items-center gap-2">
                  <Loader2 className="animate-spin text-rose-400" size={16} />
                  <span className="text-xs text-slate-400 font-medium">Aria is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          {!isLoading && (
              <div className="px-4 py-2 bg-slate-50 overflow-x-auto flex gap-2 border-t border-slate-100 scrollbar-hide">
                  {suggestedPrompts.map((prompt, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSend(prompt)}
                        className="whitespace-nowrap px-3 py-1.5 bg-white border border-rose-100 text-rose-600 rounded-full text-xs font-medium hover:bg-rose-50 transition-colors flex items-center gap-1 shadow-sm"
                      >
                          <Lightbulb size={12} /> {prompt}
                      </button>
                  ))}
              </div>
          )}

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all placeholder:text-slate-400"
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="p-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:to-rose-700 text-white px-5 py-4 rounded-full shadow-lg shadow-rose-500/30 transition-all hover:scale-105 active:scale-95"
        >
          <div className="relative">
             <MessageCircle size={28} />
             <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-rose-500 rounded-full"></span>
          </div>
          <span className="font-bold pr-1 hidden sm:inline">Ask Aria</span>
        </button>
      )}
      </div>
    </div>
  );
};
