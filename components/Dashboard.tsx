import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, DollarSign, Users, Sparkles, X, ArrowRight, BrainCircuit } from 'lucide-react';
import { generateInsights } from '../services/ariaService';
import { AiInsight } from '../types';

export const Dashboard: React.FC = () => {
  const [insights, setInsights] = useState<AiInsight[]>([]);

  useEffect(() => {
    // Simulate loading AI insights
    const loadedInsights = generateInsights();
    setInsights(loadedInsights);
  }, []);

  const dismissInsight = (id: string) => {
    setInsights(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* --- ARIA INSIGHTS SECTION --- */}
      {insights.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden">
           <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="bg-white p-1.5 rounded-lg shadow-sm">
                 <Sparkles className="text-indigo-600" size={20} />
              </div>
              <h3 className="font-bold text-indigo-900">Aria's Smart Insights</h3>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">3 New</span>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
              {insights.map(insight => (
                 <div key={insight.id} className="bg-white p-4 rounded-xl border border-indigo-50 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
                    <div>
                       <div className="flex justify-between items-start mb-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                             insight.type === 'anxiety' ? 'bg-emerald-100 text-emerald-700' :
                             insight.type === 'budget' ? 'bg-rose-100 text-rose-700' :
                             'bg-blue-100 text-blue-700'
                          }`}>
                             {insight.type}
                          </span>
                          <button onClick={() => dismissInsight(insight.id)} className="text-slate-300 hover:text-slate-500">
                             <X size={14} />
                          </button>
                       </div>
                       <h4 className="font-bold text-slate-800 text-sm mb-1">{insight.title}</h4>
                       <p className="text-slate-500 text-xs leading-relaxed mb-3">{insight.message}</p>
                    </div>
                    {insight.actionLabel && (
                       <button className="text-indigo-600 text-xs font-bold flex items-center gap-1 hover:underline">
                          {insight.actionLabel} <ArrowRight size={12} />
                       </button>
                    )}
                 </div>
              ))}
           </div>

           {/* Decorative bg elements */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        </div>
      )}

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Calendar className="text-rose-500" />}
          label="Days to Go"
          value="142"
          subtext="September 24, 2024"
        />
        <StatCard 
          icon={<DollarSign className="text-emerald-500" />}
          label="Budget Spent"
          value="$12,450"
          subtext="of $35,000 budget"
        />
        <StatCard 
          icon={<Users className="text-blue-500" />}
          label="Confirmed Guests"
          value="86"
          subtext="150 invited"
        />
        <StatCard 
          icon={<CheckCircle className="text-purple-500" />}
          label="Tasks Done"
          value="14/45"
          subtext="3 due this week"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 font-serif">Recent Vendor Bids</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0 overflow-hidden">
                    <img src={`https://picsum.photos/100/100?random=${i}`} alt="Vendor" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Elegant Flowers Co.</p>
                    <p className="text-xs text-slate-500">Bid: $2,400 for Floral Package</p>
                  </div>
                </div>
                <span className="text-xs font-semibold bg-white px-2 py-1 rounded border border-slate-200 text-slate-600">Review</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 font-serif">Upcoming Tasks</h3>
          <div className="space-y-3">
            {[
              { task: "Finalize guest list (Groom side)", due: "Tomorrow", urgent: true },
              { task: "Book tasting with Caterer", due: "In 3 days", urgent: false },
              { task: "Send deposit to Photographer", due: "Next week", urgent: false },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className={`mt-1 w-4 h-4 rounded-full border-2 flex-shrink-0 ${item.urgent ? 'border-rose-400 bg-rose-50' : 'border-slate-300'}`} />
                <div>
                  <p className={`text-sm font-medium ${item.urgent ? 'text-rose-600' : 'text-slate-700'}`}>{item.task}</p>
                  <p className="text-xs text-slate-400">Due: {item.due}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; subtext: string }> = ({ icon, label, value, subtext }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
    <div>
      <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
      <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
      <p className="text-xs text-slate-400 mt-1">{subtext}</p>
    </div>
    <div className="p-3 bg-slate-50 rounded-lg">
      {icon}
    </div>
  </div>
);
