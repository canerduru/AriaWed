import React, { useState } from 'react';
import { 
  Gift, Star, Image as ImageIcon, Download, 
  Send, DollarSign, Check, ChevronDown, Trash2
} from 'lucide-react';
import { Guest, VendorReview, WeddingPhoto } from '../types';
import { MOCK_GUESTS } from '../services/guestService';
import { MOCK_REVIEWS, MOCK_PHOTOS } from '../services/weddingDayService';
import { MOCK_VENDOR_PROFILES } from '../services/vendorService';

type Tab = 'gifts' | 'reviews' | 'gallery' | 'expenses';

export const PostWedding: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('gifts');
  const [guests, setGuests] = useState<Guest[]>(MOCK_GUESTS);
  const [reviews, setReviews] = useState<VendorReview[]>(MOCK_REVIEWS);
  const [photos] = useState<WeddingPhoto[]>(MOCK_PHOTOS);

  // --- HANDLERS ---

  const handleGiftUpdate = (id: string, gift: string) => {
    setGuests(prev => prev.map(g => g.id === id ? { ...g, giftReceived: gift } : g));
  };

  const toggleThankYou = (id: string) => {
    setGuests(prev => prev.map(g => g.id === id ? { ...g, thankYouSent: !g.thankYouSent } : g));
  };

  const handleReviewSubmit = (review: VendorReview) => {
    setReviews([review, ...reviews]);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 font-serif">Post-Wedding Wrap Up</h2>
          <p className="text-slate-500">Manage thank yous, reviews, and memories.</p>
        </div>
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex">
           {[
             { id: 'gifts', label: 'Thank Yous', icon: Gift },
             { id: 'reviews', label: 'Reviews', icon: Star },
             { id: 'gallery', label: 'Gallery', icon: ImageIcon },
             { id: 'expenses', label: 'Final Report', icon: DollarSign },
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as Tab)}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                 activeTab === tab.id 
                 ? 'bg-rose-500 text-white shadow-md' 
                 : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
               }`}
             >
               <tab.icon size={16} />
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      {/* --- GIFTS & THANK YOUS --- */}
      {activeTab === 'gifts' && (
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center">
                 <div className="text-3xl font-bold text-slate-800">{guests.filter(g => g.giftReceived).length}</div>
                 <div className="text-sm text-slate-500 uppercase font-bold tracking-wide">Gifts Received</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center">
                 <div className="text-3xl font-bold text-rose-500">{guests.filter(g => g.giftReceived && !g.thankYouSent).length}</div>
                 <div className="text-sm text-slate-500 uppercase font-bold tracking-wide">Thank Yous Pending</div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center flex items-center justify-center">
                 <button className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors">
                    <Send size={18} /> Generate Card Batch
                 </button>
              </div>
           </div>

           <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-xs">
                    <tr>
                       <th className="p-4">Guest</th>
                       <th className="p-4">Gift Description</th>
                       <th className="p-4 text-center">Thank You Sent?</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {guests.filter(g => g.rsvpStatus === 'attending').map(guest => (
                       <tr key={guest.id} className="hover:bg-slate-50">
                          <td className="p-4 font-bold text-slate-800">{guest.fullName}</td>
                          <td className="p-4">
                             <input 
                                type="text" 
                                placeholder="Enter gift details..." 
                                value={guest.giftReceived || ''}
                                onChange={(e) => handleGiftUpdate(guest.id, e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-200 outline-none"
                             />
                          </td>
                          <td className="p-4 text-center">
                             <button 
                                onClick={() => toggleThankYou(guest.id)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors mx-auto ${
                                   guest.thankYouSent ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400 hover:bg-emerald-100'
                                }`}
                             >
                                <Check size={16} />
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {/* --- REVIEWS --- */}
      {activeTab === 'reviews' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="space-y-6">
              <h3 className="font-bold text-slate-800 text-lg">Your Submitted Reviews</h3>
              {reviews.map(rev => (
                 <div key={rev.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="font-bold text-slate-800">{rev.vendorName}</h4>
                       <span className="text-xs text-slate-400">{rev.date}</span>
                    </div>
                    <div className="flex gap-1 mb-3">
                       {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={16} className={i < rev.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200"} />
                       ))}
                    </div>
                    <p className="text-slate-600 italic">"{rev.text}"</p>
                 </div>
              ))}
              {reviews.length === 0 && <p className="text-slate-400 italic">No reviews submitted yet.</p>}
           </div>

           <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm h-fit">
              <h3 className="font-bold text-slate-800 text-lg mb-6">Write a Review</h3>
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Select Vendor</label>
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white">
                       <option>Select...</option>
                       {MOCK_VENDOR_PROFILES.map(v => (
                          <option key={v.id} value={v.id}>{v.businessName} ({v.category})</option>
                       ))}
                    </select>
                 </div>
                 
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Overall Rating</label>
                    <div className="flex gap-2">
                       {Array.from({ length: 5 }).map((_, i) => (
                          <button key={i} className="text-slate-300 hover:text-yellow-400 transition-colors">
                             <Star size={24} fill="currentColor" />
                          </button>
                       ))}
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Your Experience</label>
                    <textarea 
                       rows={4} 
                       className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-rose-200"
                       placeholder="How was their service?"
                    />
                 </div>

                 <button className="w-full py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-colors">
                    Submit Review
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* --- GALLERY --- */}
      {activeTab === 'gallery' && (
         <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
               <div>
                  <h3 className="font-bold text-slate-800">Wedding Gallery</h3>
                  <p className="text-sm text-slate-500">{photos.length} Photos • 2 Videos</p>
               </div>
               <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium">
                  <Download size={16} /> Download All
               </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {photos.map(photo => (
                  <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 cursor-pointer">
                     <img src={photo.url} alt="Wedding" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="text-white p-2 border border-white rounded-full hover:bg-white/20">
                           <Download size={20} />
                        </button>
                     </div>
                     <span className="absolute bottom-2 left-2 text-[10px] bg-black/50 text-white px-2 py-0.5 rounded backdrop-blur-sm">
                        by {photo.uploadedBy}
                     </span>
                  </div>
               ))}
               {/* Upload Placeholder */}
               <div className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer">
                  <ImageIcon size={32} className="mb-2" />
                  <span className="text-sm font-medium">Upload Media</span>
               </div>
            </div>
         </div>
      )}

      {/* --- EXPENSES --- */}
      {activeTab === 'expenses' && (
          <div className="max-w-4xl mx-auto space-y-8">
             <div className="bg-slate-800 text-white p-8 rounded-2xl shadow-xl text-center">
                <h2 className="text-3xl font-serif font-bold mb-2">Final Expense Report</h2>
                <p className="text-slate-300 mb-8">A summary of your wedding finances.</p>
                
                <div className="grid grid-cols-3 gap-8 border-t border-slate-700 pt-8">
                   <div>
                      <div className="text-sm text-slate-400 uppercase tracking-wider mb-1">Total Budget</div>
                      <div className="text-2xl font-bold">$35,000</div>
                   </div>
                   <div>
                      <div className="text-sm text-slate-400 uppercase tracking-wider mb-1">Actual Spent</div>
                      <div className="text-2xl font-bold text-rose-400">$34,250</div>
                   </div>
                   <div>
                      <div className="text-sm text-slate-400 uppercase tracking-wider mb-1">Difference</div>
                      <div className="text-2xl font-bold text-emerald-400">+$750</div>
                   </div>
                </div>
             </div>

             <div className="flex justify-center gap-4">
                 <button className="flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200">
                    <Download size={20} /> Download PDF Report
                 </button>
                 <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                    <Trash2 size={20} /> Delete My Data
                 </button>
             </div>
             
             <p className="text-center text-xs text-slate-400">
                You can archive your account to keep memories or delete all data permanently.
             </p>
          </div>
      )}

    </div>
  );
};
