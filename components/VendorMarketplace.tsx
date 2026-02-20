import React, { useState } from 'react';
import { 
  Search, MapPin, Star, DollarSign, Clock, Filter, Plus, 
  ArrowLeft, Check, X, MessageCircle, FileText, ChevronRight,
  LayoutGrid, List, SlidersHorizontal, Eye
} from 'lucide-react';
import { VendorProfile, ServiceRequest, VendorBid, VendorCategory } from '../types';
import { MOCK_VENDOR_PROFILES, MOCK_REQUESTS, MOCK_BIDS, getVendors, getBidsForRequest } from '../services/vendorService';

type MarketplaceView = 'browse' | 'vendor-details' | 'requests' | 'create-request' | 'request-details';

export const VendorMarketplace: React.FC = () => {
  const [view, setView] = useState<MarketplaceView>('browse');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<VendorProfile | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  
  // Data State
  const [requests, setRequests] = useState<ServiceRequest[]>(MOCK_REQUESTS);

  const categories: string[] = ['All', 'Venue', 'Catering', 'Photography', 'Flowers', 'Music', 'Videography', 'Makeup', 'Attire'];

  const handleCreateRequest = (newRequest: Partial<ServiceRequest>) => {
    const request: ServiceRequest = {
      id: `r${Date.now()}`,
      userId: 'current-user',
      title: newRequest.title || 'Untitled Request',
      category: newRequest.category as VendorCategory || 'Other',
      date: newRequest.date || '',
      budget: newRequest.budget || '',
      description: newRequest.description || '',
      location: newRequest.location || '',
      guestCount: newRequest.guestCount || 0,
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0],
      bidsCount: 0
    };
    setRequests([request, ...requests]);
    setView('requests');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Navigation Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 font-serif">Vendor Marketplace</h2>
          <p className="text-slate-500">Find the perfect team or get competitive bids.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          <button 
            onClick={() => setView('browse')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              view === 'browse' || view === 'vendor-details' 
              ? 'bg-rose-50 text-rose-700 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Find Vendors
          </button>
          <button 
             onClick={() => setView('requests')}
             className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
               ['requests', 'create-request', 'request-details'].includes(view)
               ? 'bg-rose-50 text-rose-700 shadow-sm' 
               : 'text-slate-500 hover:text-slate-700'
             }`}
          >
            My Requests
          </button>
        </div>
      </div>

      {/* --- BROWSE VIEW --- */}
      {view === 'browse' && (
        <div className="space-y-6">
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, city, or service..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 transition-shadow"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
               {categories.slice(0, 5).map(cat => (
                 <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 whitespace-nowrap rounded-xl border text-sm font-medium transition-colors ${
                      selectedCategory === cat 
                      ? 'bg-slate-800 text-white border-slate-800' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                 >
                    {cat}
                 </button>
               ))}
               <button className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
                  <SlidersHorizontal size={18} />
               </button>
            </div>
          </div>

          {/* Vendor Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getVendors(selectedCategory, searchTerm).map((vendor) => (
              <div 
                key={vendor.id} 
                onClick={() => { setSelectedVendor(vendor); setView('vendor-details'); }}
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="h-48 overflow-hidden relative">
                  <img src={vendor.images[0]} alt={vendor.businessName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    {vendor.rating} ({vendor.reviewCount})
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white flex items-center gap-1">
                     <MapPin size={12} /> {vendor.city}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs font-bold text-rose-500 uppercase tracking-wide">{vendor.category}</p>
                      <h3 className="text-lg font-bold text-slate-800">{vendor.businessName}</h3>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{vendor.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                     {vendor.features.slice(0, 3).map((feat, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] rounded border border-slate-100 uppercase font-bold tracking-wider">
                           {feat}
                        </span>
                     ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                     <span className="text-sm font-medium text-slate-600">{vendor.priceRange}</span>
                     <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock size={12} /> Responds in {vendor.responseTime}
                     </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- VENDOR DETAILS VIEW --- */}
      {view === 'vendor-details' && selectedVendor && (
        <div className="space-y-6">
            <button onClick={() => setView('browse')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft size={18} /> Back to Vendors
            </button>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Images & Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                        <img src={selectedVendor.images[0]} alt="Main" className="w-full h-[400px] object-cover" />
                        <div className="grid grid-cols-4 gap-1 p-1">
                            {selectedVendor.images.slice(0, 4).map((img, i) => (
                                <img key={i} src={img} alt="Gallery" className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90" />
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-3xl font-serif font-bold text-slate-800">{selectedVendor.businessName}</h1>
                                <div className="flex items-center gap-4 text-slate-500 mt-2 text-sm">
                                    <span className="flex items-center gap-1"><MapPin size={16} /> {selectedVendor.city}</span>
                                    <span className="flex items-center gap-1"><Star size={16} className="text-yellow-500" /> {selectedVendor.rating} ({selectedVendor.reviewCount} Reviews)</span>
                                    <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded uppercase text-xs font-bold">{selectedVendor.category}</span>
                                </div>
                            </div>
                        </div>
                        
                        <h3 className="font-bold text-slate-800 mb-2">About</h3>
                        <p className="text-slate-600 leading-relaxed mb-6">{selectedVendor.description}</p>
                        
                        <h3 className="font-bold text-slate-800 mb-3">Amenities & Features</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {selectedVendor.features.map((feat, i) => (
                                <div key={i} className="flex items-center gap-2 text-slate-600">
                                    <Check size={16} className="text-emerald-500" /> {feat}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Contact Card */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
                        <div className="text-center mb-6">
                            <p className="text-sm text-slate-500">Starting from</p>
                            <p className="text-3xl font-bold text-slate-800">{selectedVendor.priceRange}</p>
                        </div>
                        
                        <div className="space-y-3">
                            <button className="w-full py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200">
                                Request Quote
                            </button>
                            <button className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                                <MessageCircle size={18} /> Message
                            </button>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-slate-100 text-sm text-slate-500 text-center">
                            <p>Usually responds within {selectedVendor.responseTime}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- REQUESTS LIST VIEW --- */}
      {view === 'requests' && (
        <div className="space-y-6">
             <div className="bg-rose-50 border border-rose-100 p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h3 className="text-2xl font-serif font-bold text-rose-900 mb-2">Post a Service Request</h3>
                    <p className="text-rose-700">Tell vendors what you need and let them bid for your business. Compare prices and packages easily.</p>
                </div>
                <button 
                    onClick={() => setView('create-request')}
                    className="px-6 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 shadow-lg shadow-rose-200 font-medium flex items-center gap-2"
                >
                    <Plus size={20} /> Create New Request
                </button>
             </div>

             <h3 className="font-bold text-slate-800 text-xl mt-8">Your Active Requests</h3>
             
             {requests.length === 0 ? (
                 <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
                     <p className="text-slate-400">You haven't posted any requests yet.</p>
                 </div>
             ) : (
                <div className="grid gap-4">
                    {requests.map(req => (
                        <div 
                            key={req.id} 
                            onClick={() => { setSelectedRequest(req); setView('request-details'); }}
                            className="bg-white p-6 rounded-xl border border-slate-100 hover:border-rose-200 hover:shadow-md transition-all cursor-pointer flex justify-between items-center group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">{req.title}</h4>
                                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                        <span className="px-2 py-0.5 bg-slate-100 rounded text-xs uppercase font-bold">{req.category}</span>
                                        <span>{req.date}</span>
                                        <span>{req.budget}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="font-bold text-slate-800 text-2xl">{req.bidsCount}</p>
                                    <p className="text-xs text-slate-400 uppercase font-bold">Bids Received</p>
                                </div>
                                <ChevronRight className="text-slate-300 group-hover:text-rose-400" />
                            </div>
                        </div>
                    ))}
                </div>
             )}
        </div>
      )}

      {/* --- CREATE REQUEST FORM --- */}
      {view === 'create-request' && (
          <div className="max-w-2xl mx-auto space-y-6">
             <button onClick={() => setView('requests')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft size={18} /> Back to Requests
            </button>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-2xl font-serif font-bold text-slate-800 mb-6">Create Service Request</h2>
                <RequestForm onSubmit={handleCreateRequest} />
            </div>
          </div>
      )}

      {/* --- REQUEST DETAILS & BIDS --- */}
      {view === 'request-details' && selectedRequest && (
          <div className="space-y-6">
             <button onClick={() => setView('requests')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft size={18} /> Back to Requests
            </button>

            {/* Request Summary */}
            <div className="bg-slate-800 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                             <span className="px-3 py-1 bg-rose-500 text-white rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                                {selectedRequest.category}
                             </span>
                             <h1 className="text-3xl font-bold mb-2">{selectedRequest.title}</h1>
                             <p className="text-slate-300 max-w-2xl">{selectedRequest.description}</p>
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="text-sm text-slate-400">Budget Range</p>
                            <p className="text-2xl font-bold">{selectedRequest.budget}</p>
                        </div>
                    </div>
                    <div className="flex gap-6 pt-6 border-t border-slate-700 text-sm font-medium">
                        <span className="flex items-center gap-2"><Clock size={16} className="text-rose-400" /> {selectedRequest.date}</span>
                        <span className="flex items-center gap-2"><MapPin size={16} className="text-rose-400" /> {selectedRequest.location}</span>
                        <span className="flex items-center gap-2"><LayoutGrid size={16} className="text-rose-400" /> {selectedRequest.guestCount} Guests</span>
                    </div>
                </div>
                {/* Background Pattern */}
                <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl" />
            </div>

            <h3 className="font-bold text-slate-800 text-xl pt-4">Received Bids ({selectedRequest.bidsCount})</h3>
            
            {/* Bid Comparison Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                <th className="p-4">Vendor</th>
                                <th className="p-4">Package</th>
                                <th className="p-4">Included</th>
                                <th className="p-4">Price</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {getBidsForRequest(selectedRequest.id).map(bid => (
                                <tr key={bid.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800">{bid.vendorName}</div>
                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                            <Star size={10} className="text-yellow-500 fill-yellow-500" /> {bid.vendorRating}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-slate-800">{bid.packageName}</div>
                                        <div className="text-xs text-slate-500">Timeline: {bid.timeline}</div>
                                    </td>
                                    <td className="p-4 max-w-xs text-sm text-slate-600">
                                        {bid.description}
                                    </td>
                                    <td className="p-4 font-bold text-slate-800">
                                        {bid.amount.toLocaleString()} {bid.currency}
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 font-medium">
                                            Details
                                        </button>
                                        <button className="px-3 py-1.5 text-sm bg-rose-500 text-white rounded-lg hover:bg-rose-600 font-medium shadow-sm">
                                            Accept
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {getBidsForRequest(selectedRequest.id).length === 0 && (
                    <div className="p-8 text-center text-slate-400">
                        No bids received yet.
                    </div>
                )}
            </div>
          </div>
      )}
    </div>
  );
};

// --- Sub-components ---

const RequestForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        category: 'Photography',
        title: '',
        date: '',
        budget: '',
        guestCount: '',
        location: '',
        description: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select 
                        name="category"
                        value={formData.category} 
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-200 outline-none bg-white"
                    >
                        {['Venue', 'Catering', 'Photography', 'Videography', 'Flowers', 'Music'].map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                    <input 
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-200 outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input 
                    type="text"
                    name="title"
                    placeholder="e.g. Wedding Photographer needed for full day"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-200 outline-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Budget Range</label>
                     <input 
                        type="text"
                        name="budget"
                        placeholder="e.g. 20,000 - 30,000 TL"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-200 outline-none"
                    />
                </div>
                 <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                     <input 
                        type="text"
                        name="location"
                        placeholder="City or Venue"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-200 outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                    name="description"
                    rows={4}
                    placeholder="Describe your needs in detail..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-200 outline-none"
                />
            </div>

            <button type="submit" className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors">
                Post Request
            </button>
        </form>
    );
};
