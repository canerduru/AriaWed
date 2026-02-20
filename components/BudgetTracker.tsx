import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { AlertTriangle, TrendingUp, Calendar, Calculator, Info, Check, DollarSign, Plus } from 'lucide-react';
import { BudgetCategory, VendorPayment, BudgetAlert, ScenarioResult } from '../types';
import { generateInitialBudget, checkBudgetHealth, calculateTip, runScenario, getHiddenCosts, MOCK_PAYMENTS } from '../services/budgetService';

export const BudgetTracker: React.FC = () => {
  const [totalBudget, setTotalBudget] = useState(35000); // Default Example
  const [guestCount, setGuestCount] = useState(150);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [payments, setPayments] = useState<VendorPayment[]>(MOCK_PAYMENTS);
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'payments' | 'scenario'>('overview');
  
  // Scenario State
  const [scenarioGuests, setScenarioGuests] = useState(150);
  const [scenarioResults, setScenarioResults] = useState<ScenarioResult[]>([]);

  // Init
  useEffect(() => {
    const initial = generateInitialBudget(totalBudget);
    // Simulate some spending
    initial[0].spent = 12000; // Venue
    initial[1].spent = 8500;  // Catering
    setCategories(initial);
  }, []);

  // Watch for changes to update alerts
  useEffect(() => {
    if (categories.length > 0) {
      setAlerts(checkBudgetHealth(categories, totalBudget));
    }
  }, [categories, totalBudget]);

  const totalSpent = categories.reduce((acc, cat) => acc + cat.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const progress = (totalSpent / totalBudget) * 100;

  const handleUpdateAllocation = (id: string, newVal: number) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, allocated: newVal } : c));
  };

  const runGuestScenario = () => {
    const results = runScenario(guestCount, scenarioGuests, categories);
    setScenarioResults(results);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Summary Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="w-full md:w-auto">
           <h2 className="text-2xl font-bold text-slate-800 font-serif">Financial Dashboard</h2>
           <p className="text-slate-500 mb-4">Track, forecast, and manage your wedding finances.</p>
           
           <div className="flex gap-2 mb-2">
             <span className="text-sm font-medium text-slate-600">Total Budget:</span>
             <span className="text-sm font-bold text-slate-800">${totalBudget.toLocaleString()}</span>
           </div>
           
           <div className="w-full md:w-96 h-4 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${progress > 100 ? 'bg-rose-600' : progress > 90 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
           </div>
           <div className="flex justify-between mt-2 text-sm">
              <span className="text-emerald-600 font-medium">Spent: ${totalSpent.toLocaleString()}</span>
              <span className="text-slate-500">Remaining: ${totalRemaining.toLocaleString()}</span>
           </div>
        </div>

        {/* Alerts Section */}
        <div className="flex-1 w-full md:w-auto flex flex-col items-end gap-2">
           {alerts.slice(0, 2).map(alert => (
             <div key={alert.id} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium w-full md:w-auto ${
               alert.type === 'danger' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 
               'bg-amber-50 text-amber-700 border border-amber-100'
             }`}>
               <AlertTriangle size={16} />
               {alert.message}
             </div>
           ))}
           {alerts.length === 0 && (
             <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-sm font-medium">
               <Check size={16} />
               Budget is healthy and on track!
             </div>
           )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-6 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'breakdown', label: 'Breakdown', icon: Calculator },
          { id: 'payments', label: 'Payment Schedule', icon: Calendar },
          { id: 'scenario', label: 'What-If Scenarios', icon: AlertTriangle },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id 
              ? 'text-rose-600 border-b-2 border-rose-500' 
              : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && <OverviewTab categories={categories} />}
        {activeTab === 'breakdown' && <BreakdownTab categories={categories} onUpdate={handleUpdateAllocation} />}
        {activeTab === 'payments' && <PaymentsTab payments={payments} />}
        {activeTab === 'scenario' && (
          <ScenarioTab 
            currentGuests={guestCount} 
            scenarioGuests={scenarioGuests} 
            setScenarioGuests={setScenarioGuests} 
            onRun={runGuestScenario} 
            results={scenarioResults} 
          />
        )}
      </div>
    </div>
  );
};

// --- Sub Components ---

const OverviewTab: React.FC<{ categories: BudgetCategory[] }> = ({ categories }) => {
  const chartData = categories.map(c => ({ name: c.name.split(' ')[0], value: c.allocated, spent: c.spent }));
  const COLORS = ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#94a3b8', '#64748b', '#475569', '#334155'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-6">Allocation vs. Actual</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis />
                <ReTooltip cursor={{fill: 'transparent'}} />
                <Legend />
                <Bar dataKey="value" name="Budgeted" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spent" name="Actual Spent" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
       </div>

       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-6">Budget Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <ReTooltip formatter={(val: number) => `$${val.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
       </div>

       <div className="lg:col-span-2 bg-rose-50 border border-rose-100 p-6 rounded-xl">
         <h3 className="font-bold text-rose-900 mb-3 flex items-center gap-2">
           <Info size={18} /> Hidden Costs Watchlist
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {getHiddenCosts().map((cost, i) => (
             <div key={i} className="flex items-center gap-2 text-sm text-rose-800 bg-white/50 p-2 rounded-lg">
               <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
               {cost}
             </div>
           ))}
         </div>
       </div>
    </div>
  );
};

const BreakdownTab: React.FC<{ categories: BudgetCategory[], onUpdate: (id: string, val: number) => void }> = ({ categories, onUpdate }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-4">Category</th>
              <th className="p-4">Budgeted (TRY)</th>
              <th className="p-4">Actual Spent</th>
              <th className="p-4">Difference</th>
              <th className="p-4">% Used</th>
              <th className="p-4">Tip Calculator</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map(cat => {
              const diff = cat.allocated - cat.spent;
              const percent = (cat.spent / cat.allocated) * 100;
              const statusColor = diff < 0 ? 'text-rose-600' : 'text-emerald-600';
              
              return (
                <tr key={cat.id} className="hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-800">
                    {cat.name}
                    <p className="text-xs text-slate-400 font-normal">{cat.notes}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 bg-slate-100 rounded px-2 py-1 w-32">
                      <span className="text-slate-400">$</span>
                      <input 
                        type="number" 
                        value={cat.allocated} 
                        onChange={(e) => onUpdate(cat.id, parseInt(e.target.value) || 0)}
                        className="bg-transparent outline-none w-full font-medium text-slate-700"
                      />
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-700">${cat.spent.toLocaleString()}</td>
                  <td className={`p-4 font-bold ${statusColor}`}>
                    {diff > 0 ? '+' : ''}{diff.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                       <span className="w-12 text-right">{percent.toFixed(0)}%</span>
                       <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${percent > 100 ? 'bg-rose-500' : percent > 90 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(percent, 100)}%` }}
                          />
                       </div>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-slate-500">
                     <div>Standard (10%): <strong>${calculateTip(cat.spent).toLocaleString()}</strong></div>
                     <div>Excellent (20%): <strong>${calculateTip(cat.spent, 'excellent').toLocaleString()}</strong></div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PaymentsTab: React.FC<{ payments: VendorPayment[] }> = ({ payments }) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-emerald-100 text-emerald-700';
      case 'overdue': return 'bg-rose-100 text-rose-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h3 className="font-bold text-slate-800">Upcoming Payments</h3>
         <button className="flex items-center gap-2 text-sm bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors">
            <Plus size={16} /> Add Payment
         </button>
       </div>

       <div className="grid gap-4">
          {payments.map(payment => (
            <div key={payment.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-rose-200 transition-colors">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
                    <Calendar size={20} />
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-800">{payment.vendorName}</h4>
                    <p className="text-sm text-slate-500">{payment.category} • {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}</p>
                 </div>
              </div>
              
              <div className="flex items-center gap-6">
                 <div className="text-right">
                    <p className="font-bold text-slate-800">${payment.amount.toLocaleString()}</p>
                    <p className="text-sm text-slate-500">Due: {payment.dueDate}</p>
                 </div>
                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(payment.status)}`}>
                    {payment.status}
                 </span>
              </div>
            </div>
          ))}
       </div>
    </div>
  );
};

const ScenarioTab: React.FC<{ 
  currentGuests: number, 
  scenarioGuests: number, 
  setScenarioGuests: (n: number) => void,
  onRun: () => void,
  results: ScenarioResult[]
}> = ({ currentGuests, scenarioGuests, setScenarioGuests, onRun, results }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg">
             <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Calculator size={20} /> "What-If" Engine
             </h3>
             <p className="text-slate-300 text-sm mb-6">
                See how changing your guest count impacts your variable costs (Catering, Stationery, etc).
             </p>
             
             <div className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-slate-400 mb-1">Current Guest Count</label>
                   <input 
                      type="number" 
                      disabled 
                      value={currentGuests} 
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-300"
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-400 mb-1">New Guest Count Scenario</label>
                   <input 
                      type="number" 
                      value={scenarioGuests} 
                      onChange={(e) => setScenarioGuests(parseInt(e.target.value) || 0)}
                      className="w-full bg-white text-slate-800 border border-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 outline-none"
                   />
                </div>
                
                <button 
                  onClick={onRun}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg font-bold transition-colors shadow-lg shadow-rose-900/20"
                >
                   Run Scenario
                </button>
             </div>
          </div>
       </div>

       <div className="lg:col-span-2">
          {results.length > 0 ? (
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-6">Projected Impact</h3>
                <div className="space-y-4">
                   {results.map((res, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                         <div>
                            <p className="font-bold text-slate-700">{res.category}</p>
                            <p className="text-sm text-slate-500">Current Budget: ${res.currentCost.toLocaleString()}</p>
                         </div>
                         <div className="text-right">
                            <p className="font-bold text-slate-800">New Estimate: ${res.projectedCost.toLocaleString()}</p>
                            <p className={`text-sm font-bold ${res.difference > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                               {res.difference > 0 ? '+' : ''}{res.difference.toLocaleString()}
                            </p>
                         </div>
                      </div>
                   ))}
                   
                   <div className="mt-6 pt-6 border-t border-slate-200 flex justify-between items-center">
                      <span className="font-bold text-slate-600">Total Projected Change</span>
                      <span className={`text-xl font-bold ${results.reduce((a, b) => a + b.difference, 0) > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                         {results.reduce((a, b) => a + b.difference, 0) > 0 ? '+' : ''}
                         ${results.reduce((a, b) => a + b.difference, 0).toLocaleString()}
                      </span>
                   </div>
                </div>
             </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-200 p-12">
                <Calculator size={48} className="mb-4 opacity-50" />
                <p>Enter a new guest count to calculate budget impact.</p>
             </div>
          )}
       </div>
    </div>
  );
};