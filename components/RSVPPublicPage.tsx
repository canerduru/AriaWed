import React, { useState } from 'react';
import { Guest, MealPreference } from '../types';
import { Check, X, User, Baby, Utensils, AlertCircle } from 'lucide-react';

interface RSVPPublicPageProps {
  guest: Guest;
  onSubmit: (updatedGuest: Guest) => void;
}

export const RSVPPublicPage: React.FC<RSVPPublicPageProps> = ({ guest, onSubmit }) => {
  const [formData, setFormData] = useState<Guest>({ ...guest });
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateChild = (index: number, field: 'name' | 'age', value: string | number) => {
    const newDetails = [...(formData.childrenDetails || [])];
    if (!newDetails[index]) newDetails[index] = { name: '', age: 0 };
    newDetails[index] = { ...newDetails[index], [field]: value };
    setFormData({ ...formData, childrenDetails: newDetails });
  };

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-rose-100">
        {/* Header */}
        <div className="bg-white p-8 text-center border-b border-rose-50">
           <div className="text-rose-500 font-serif font-bold text-2xl mb-2">Sarah & James</div>
           <p className="text-slate-400 text-sm uppercase tracking-widest">September 24, 2024 • Istanbul</p>
        </div>

        {step === 1 ? (
          <div className="p-8 text-center">
             <h1 className="text-3xl font-serif font-bold text-slate-800 mb-2">Hello, {guest.fullName}</h1>
             <p className="text-slate-500 mb-8">We would be honored to have you celebrate with us.</p>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                      setFormData({ ...formData, rsvpStatus: 'attending' });
                      setStep(2);
                  }}
                  className="flex flex-col items-center justify-center p-6 border-2 border-emerald-100 bg-emerald-50/50 rounded-xl hover:bg-emerald-100 hover:border-emerald-300 transition-all group"
                >
                    <div className="w-12 h-12 bg-emerald-200 text-emerald-700 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Check size={24} />
                    </div>
                    <span className="font-bold text-emerald-800">Joyfully Accept</span>
                </button>

                <button 
                  onClick={() => {
                      setFormData({ ...formData, rsvpStatus: 'declined' });
                      // Simple decline flow could end here or ask for a message
                      onSubmit({ ...formData, rsvpStatus: 'declined' });
                  }}
                  className="flex flex-col items-center justify-center p-6 border-2 border-slate-100 bg-slate-50/50 rounded-xl hover:bg-slate-100 hover:border-slate-300 transition-all group"
                >
                    <div className="w-12 h-12 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <X size={24} />
                    </div>
                    <span className="font-bold text-slate-700">Regretfully Decline</span>
                </button>
             </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-8 animate-in slide-in-from-right duration-300">
             
             {/* Meal Selection */}
             <div>
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Utensils size={18} className="text-rose-500" /> Meal Preference
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {['Meat', 'Fish', 'Vegetarian', 'Vegan'].map(meal => (
                        <label key={meal} className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
                            formData.mealPreference?.toLowerCase() === meal.toLowerCase() 
                            ? 'bg-rose-500 text-white border-rose-600' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}>
                            <input 
                                type="radio" 
                                name="meal"
                                value={meal.toLowerCase()}
                                checked={formData.mealPreference?.toLowerCase() === meal.toLowerCase()}
                                onChange={(e) => setFormData({ ...formData, mealPreference: e.target.value as MealPreference })}
                                className="hidden"
                            />
                            <span className="font-medium">{meal}</span>
                        </label>
                    ))}
                </div>
                <div className="mt-3">
                    <label className="text-sm font-medium text-slate-700 block mb-1">Dietary Restrictions / Allergies</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Nut allergy, Gluten free..."
                        value={formData.dietaryRestrictions || ''}
                        onChange={e => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
                    />
                </div>
             </div>

             {/* Plus One */}
             {guest.plusOneAllowed && (
                 <div className="border-t border-slate-100 pt-6">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <User size={18} className="text-rose-500" /> Plus One
                    </h3>
                    <p className="text-sm text-slate-500 mb-3">You are invited to bring a guest.</p>
                    <input 
                        type="text" 
                        placeholder="Full Name of your guest"
                        value={formData.plusOneName || ''}
                        onChange={e => setFormData({ ...formData, plusOneName: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
                    />
                 </div>
             )}

             {/* Children */}
             {guest.childrenCount > 0 && (
                 <div className="border-t border-slate-100 pt-6">
                     <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Baby size={18} className="text-rose-500" /> Children ({guest.childrenCount})
                    </h3>
                    <div className="space-y-3">
                        {Array.from({ length: guest.childrenCount }).map((_, i) => (
                            <div key={i} className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder={`Child ${i+1} Name`}
                                    value={formData.childrenDetails?.[i]?.name || ''}
                                    onChange={e => updateChild(i, 'name', e.target.value)}
                                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                                <input 
                                    type="number" 
                                    placeholder="Age"
                                    value={formData.childrenDetails?.[i]?.age || ''}
                                    onChange={e => updateChild(i, 'age', parseInt(e.target.value))}
                                    className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                            </div>
                        ))}
                    </div>
                 </div>
             )}

             <button 
                type="submit"
                className="w-full bg-rose-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200"
             >
                Confirm RSVP
             </button>
          </form>
        )}
      </div>
    </div>
  );
};
