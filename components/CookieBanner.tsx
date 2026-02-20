import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Small delay for animation effect
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md text-white p-4 md:p-6 shadow-2xl z-[60] border-t border-slate-700 animate-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
           <div className="p-3 bg-slate-800 rounded-xl hidden md:block border border-slate-700">
              <Cookie className="text-rose-400" size={28} />
           </div>
           <div className="flex-1">
              <h4 className="font-bold text-base mb-1 flex items-center gap-2">
                We value your privacy 
                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px] uppercase font-bold border border-slate-700">KVKK Compliant</span>
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                 We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. 
                 By clicking "Accept All", you consent to the use of cookies. 
                 <a href="#" className="underline ml-1 text-white hover:text-rose-400 transition-colors">Read our Privacy Policy</a>.
              </p>
           </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
           <button 
             onClick={handleDecline}
             className="flex-1 md:flex-none px-4 py-2.5 border border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
           >
             Necessary Only
           </button>
           <button 
             onClick={handleAccept}
             className="flex-1 md:flex-none px-6 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:to-rose-700 rounded-lg text-sm font-bold text-white transition-all shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2"
           >
             <ShieldCheck size={16} /> Accept All
           </button>
        </div>
      </div>
    </div>
  );
};