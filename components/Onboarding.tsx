import React, { useState } from 'react';
import { WeddingDetails, VendorOnboardingDetails } from '../types';
import { Check, ChevronRight, ChevronLeft, Calendar, MapPin, Users, Heart, Music, Camera, Utensils, Shirt, Globe, Mail } from 'lucide-react';
import { useWedding } from '../contexts/WeddingContext';
import { isApiConfigured } from '../api/client';

interface OnboardingProps {
  userRole: 'bride' | 'groom' | 'vendor' | 'admin';
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ userRole, onComplete }) => {
  const { createWedding } = useWedding();
  const [step, setStep] = useState(1);
  const [weddingDetails, setWeddingDetails] = useState<Partial<WeddingDetails>>({
    priorities: [],
    styles: [],
  });
  const [vendorDetails, setVendorDetails] = useState<Partial<VendorOnboardingDetails>>({});

  const isCouple = userRole === 'bride' || userRole === 'groom';
  const totalSteps = isCouple ? 5 : 2;

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleFinish = async () => {
    if (isCouple && isApiConfigured() && weddingDetails.date) {
      try {
        await createWedding({
          date: weddingDetails.date || '',
          location: weddingDetails.location || '',
          guestCount: weddingDetails.guestCount ?? 0,
          budget: weddingDetails.budget ?? 0,
          priorities: weddingDetails.priorities || [],
          styles: weddingDetails.styles || [],
          culture: weddingDetails.culture || '',
          partnerEmail: weddingDetails.partnerEmail,
        });
      } catch (_) {}
    }
    onComplete();
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header & Progress */}
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-serif font-bold text-slate-800">
                    {isCouple ? "Let's plan your big day" : "Setup your business profile"}
                </h2>
                <span className="text-sm font-medium text-slate-500">Step {step} of {totalSteps}</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                    className="bg-rose-500 h-full rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 min-h-[400px] flex flex-col animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex-1">
                {isCouple ? (
                    <>
                        {step === 1 && (
                            <StepWeddingInfo 
                                data={weddingDetails} 
                                update={(d) => setWeddingDetails(prev => ({ ...prev, ...d }))} 
                            />
                        )}
                        {step === 2 && (
                            <StepBudget 
                                data={weddingDetails} 
                                update={(d) => setWeddingDetails(prev => ({ ...prev, ...d }))} 
                            />
                        )}
                        {step === 3 && (
                            <StepStyle 
                                data={weddingDetails} 
                                update={(d) => setWeddingDetails(prev => ({ ...prev, ...d }))} 
                            />
                        )}
                        {step === 4 && (
                            <StepCulture 
                                data={weddingDetails} 
                                update={(d) => setWeddingDetails(prev => ({ ...prev, ...d }))} 
                            />
                        )}
                        {step === 5 && (
                            <StepPartner 
                                data={weddingDetails} 
                                update={(d) => setWeddingDetails(prev => ({ ...prev, ...d }))} 
                            />
                        )}
                    </>
                ) : (
                    <>
                         {step === 1 && (
                            <StepVendorInfo 
                                data={vendorDetails} 
                                update={(d) => setVendorDetails(prev => ({ ...prev, ...d }))} 
                            />
                        )}
                         {step === 2 && (
                            <StepVendorPortfolio 
                                onComplete={handleFinish}
                            />
                        )}
                    </>
                )}
            </div>

            {/* Footer Navigation */}
            <div className="mt-8 pt-8 border-t border-slate-100 flex justify-between">
                <button 
                    onClick={prevStep} 
                    disabled={step === 1}
                    className="px-6 py-2 text-slate-600 font-medium hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <ChevronLeft size={18} /> Back
                </button>
                
                {step === totalSteps ? (
                    <button 
                        onClick={handleFinish}
                        className="px-8 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200 flex items-center gap-2"
                    >
                        Finish Setup <Check size={18} />
                    </button>
                ) : (
                    <button 
                        onClick={nextStep}
                        className="px-8 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors flex items-center gap-2"
                    >
                        Next Step <ChevronRight size={18} />
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components for Steps ---

const StepWeddingInfo: React.FC<{ data: Partial<WeddingDetails>; update: (d: Partial<WeddingDetails>) => void }> = ({ data, update }) => (
    <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-800">The Basics</h3>
        
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">When is the big day?</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="date" 
                        value={data.date || ''} 
                        onChange={e => update({ date: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-200 focus:outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Where will it be?</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="City or Venue Name"
                        value={data.location || ''}
                        onChange={e => update({ location: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-200 focus:outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Guest Count: <span className="text-rose-600 font-bold">{data.guestCount || 100}</span></label>
                <div className="flex items-center gap-4">
                    <Users className="text-slate-400" size={18} />
                    <input 
                        type="range" 
                        min="0" 
                        max="1000" 
                        step="10"
                        value={data.guestCount || 100}
                        onChange={e => update({ guestCount: parseInt(e.target.value) })}
                        className="w-full accent-rose-500"
                    />
                </div>
            </div>
        </div>
    </div>
);

const StepBudget: React.FC<{ data: Partial<WeddingDetails>; update: (d: Partial<WeddingDetails>) => void }> = ({ data, update }) => {
    const priorities = [
        { id: 'venue', label: 'Venue', icon: MapPin },
        { id: 'catering', label: 'Catering', icon: Utensils },
        { id: 'photo', label: 'Photography', icon: Camera },
        { id: 'attire', label: 'Attire', icon: Shirt },
        { id: 'music', label: 'Music', icon: Music },
        { id: 'decor', label: 'Decor', icon: Heart },
    ];

    const togglePriority = (id: string) => {
        const current = data.priorities || [];
        if (current.includes(id)) {
            update({ priorities: current.filter(p => p !== id) });
        } else {
            if (current.length < 3) {
                update({ priorities: [...current, id] });
            }
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Budget & Priorities</h3>
            
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Estimated Budget (TRY)</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₺</span>
                    <input 
                        type="number" 
                        placeholder="e.g. 500,000"
                        value={data.budget || ''}
                        onChange={e => update({ budget: parseInt(e.target.value) })}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-200 focus:outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select your Top 3 Priorities</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {priorities.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => togglePriority(item.id)}
                            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                                (data.priorities || []).includes(item.id) 
                                    ? 'border-rose-500 bg-rose-50 text-rose-700' 
                                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                            }`}
                        >
                            <item.icon size={24} />
                            <span className="text-sm font-medium">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const StepStyle: React.FC<{ data: Partial<WeddingDetails>; update: (d: Partial<WeddingDetails>) => void }> = ({ data, update }) => {
    const styles = ['Bohemian', 'Classic', 'Modern', 'Rustic', 'Luxury', 'Beach', 'Garden', 'Vintage'];
    
    const toggleStyle = (style: string) => {
        const current = data.styles || [];
        if (current.includes(style)) {
            update({ styles: current.filter(s => s !== style) });
        } else {
            update({ styles: [...current, style] });
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Define your Style</h3>
            <p className="text-slate-500 text-sm">Select as many as you like to help Aria suggest the best vendors.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {styles.map((style) => (
                    <button
                        key={style}
                        onClick={() => toggleStyle(style)}
                        className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${
                            (data.styles || []).includes(style)
                                ? 'bg-slate-800 text-white shadow-lg'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        {style}
                    </button>
                ))}
            </div>
        </div>
    );
};

const StepCulture: React.FC<{ data: Partial<WeddingDetails>; update: (d: Partial<WeddingDetails>) => void }> = ({ data, update }) => {
    const cultures = ['Turkish Traditional', 'Muslim Nikah', 'Christian', 'Jewish', 'Secular', 'LGBTQ+', 'Multi-faith'];

    return (
        <div className="space-y-6">
             <h3 className="text-xl font-bold text-slate-800">Cultural Traditions</h3>
             <p className="text-slate-500 text-sm">Aria will customize your timeline and checklist based on your traditions.</p>

             <div className="space-y-2">
                {cultures.map((c) => (
                    <label key={c} className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                        <input 
                            type="radio" 
                            name="culture" 
                            checked={data.culture === c}
                            onChange={() => update({ culture: c })}
                            className="w-4 h-4 text-rose-500 focus:ring-rose-500 accent-rose-500"
                        />
                        <span className="ml-3 text-slate-700 font-medium">{c}</span>
                    </label>
                ))}
             </div>
        </div>
    );
};

const StepPartner: React.FC<{ data: Partial<WeddingDetails>; update: (d: Partial<WeddingDetails>) => void }> = ({ data, update }) => (
    <div className="space-y-6">
        <div className="text-center">
             <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
                <Heart fill="currentColor" size={32} />
             </div>
             <h3 className="text-xl font-bold text-slate-800">Invite your Partner</h3>
             <p className="text-slate-500 mt-2">Wedding planning is better together. We'll send them an invite to join this wedding.</p>
        </div>

        <div className="max-w-sm mx-auto">
            <label className="block text-sm font-medium text-slate-700 mb-1">Partner's Email (Optional)</label>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="email" 
                    placeholder="partner@example.com"
                    value={data.partnerEmail || ''}
                    onChange={e => update({ partnerEmail: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-200 focus:outline-none"
                />
            </div>
        </div>
    </div>
);

// --- Vendor Steps ---

const StepVendorInfo: React.FC<{ data: Partial<VendorOnboardingDetails>; update: (d: Partial<VendorOnboardingDetails>) => void }> = ({ data, update }) => (
    <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-800">Business Details</h3>
        
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
                <input 
                    type="text" 
                    value={data.businessName || ''}
                    onChange={e => update({ businessName: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-200 focus:outline-none"
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                     <select 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-200 outline-none bg-white"
                        value={data.category || ''}
                        onChange={e => update({ category: e.target.value })}
                    >
                        <option value="">Select...</option>
                        <option value="venue">Venue</option>
                        <option value="catering">Catering</option>
                        <option value="photo">Photography</option>
                        <option value="music">Music/DJ</option>
                        <option value="flowers">Flowers</option>
                     </select>
                </div>
                 <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Base City</label>
                     <input 
                        type="text" 
                        value={data.city || ''}
                        onChange={e => update({ city: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-200 focus:outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">About your services</label>
                <textarea 
                    rows={4}
                    value={data.description || ''}
                    onChange={e => update({ description: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-200 focus:outline-none"
                    placeholder="Tell couples what makes you unique..."
                />
            </div>
        </div>
    </div>
);

const StepVendorPortfolio: React.FC<{ onComplete: () => void }> = () => (
    <div className="space-y-6 text-center py-8">
        <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4 border-2 border-dashed border-slate-300 cursor-pointer hover:bg-slate-50">
            <Camera size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Upload Portfolio</h3>
        <p className="text-slate-500">Upload 5-10 high quality images of your work to attract more couples.</p>
        <button className="text-rose-600 font-medium hover:underline">Skip for now</button>
    </div>
);
