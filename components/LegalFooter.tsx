import React from 'react';
import { Heart } from 'lucide-react';

export const LegalFooter: React.FC = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="mt-12 py-8 border-t border-slate-200 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-slate-700">AriaWed</span>
          <span>© {year}</span>
          <span className="hidden md:inline">•</span>
          <span className="flex items-center gap-1">
            Made with <Heart size={10} className="text-rose-500 fill-rose-500" /> in Istanbul
          </span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
          <a href="#" className="hover:text-rose-600 transition-colors hover:underline">Privacy Policy</a>
          <a href="#" className="hover:text-rose-600 transition-colors hover:underline">Terms of Service</a>
          <a href="#" className="hover:text-rose-600 transition-colors hover:underline">Cookie Policy</a>
          <a href="#" className="hover:text-rose-600 transition-colors hover:underline">KVKK Clarification Text</a>
        </div>
        
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
           <span>System Operational</span>
        </div>
      </div>
    </footer>
  );
};