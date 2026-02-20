import React, { useState, useEffect } from 'react';
import { 
  Clock, Phone, AlertTriangle, CheckCircle, MapPin, 
  User, MessageCircle, ShieldAlert, ArrowRight,
  Menu
} from 'lucide-react';
import { MOCK_DAY_SCHEDULE } from '../services/timelineService';
import { MOCK_VENDOR_CHECKINS, EMERGENCY_GUIDE, EMERGENCY_KIT_CHECKLIST, getEventStatus } from '../services/weddingDayService';
import { VendorCheckin } from '../types';

export const WeddingDayMode: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'checkins' | 'contacts' | 'emergency'>('timeline');
  const [currentTime, setCurrentTime] = useState('14:15'); // Mock current time to simulate "Now"
  const [checkins, setCheckins] = useState<VendorCheckin[]>(MOCK_VENDOR_CHECKINS);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null); // For emergency accordion

  // Simulate clock ticking (mock)
  useEffect(() => {
    const timer = setInterval(() => {
      // In a real app, this would be new Date()
      // For demo, we just keep it static or increment slightly to show "live" feel if needed
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckInToggle = (id: string) => {
    setCheckins(prev => prev.map(c => {
        if (c.id !== id) return c;
        const newStatus = c.status === 'arrived' ? 'pending' : 'arrived';
        return { 
            ...c, 
            status: newStatus,
            actualTime: newStatus === 'arrived' ? currentTime : undefined
        };
    }));
  };

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'arrived': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        case 'late': return 'bg-rose-100 text-rose-700 border-rose-200';
        default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-[calc(100vh-6rem)] shadow-2xl rounded-xl overflow-hidden border border-slate-200 flex flex-col relative">
      
      {/* Mobile Header */}
      <div className="bg-slate-900 text-white p-4 sticky top-0 z-20 flex justify-between items-center shadow-md">
         <div>
             <h2 className="font-bold text-lg flex items-center gap-2">
                 <Clock size={18} className="text-rose-400" /> {currentTime}
             </h2>
             <p className="text-xs text-slate-400">Wedding Day Mode</p>
         </div>
         <div className="px-3 py-1 bg-rose-600 rounded-full text-xs font-bold animate-pulse">
             LIVE
         </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-800 text-slate-400 text-xs font-medium sticky top-[60px] z-20 shadow-sm">
         {[
             { id: 'timeline', label: 'Timeline', icon: Clock },
             { id: 'checkins', label: 'Check-ins', icon: User },
             { id: 'contacts', label: 'Contacts', icon: Phone },
             { id: 'emergency', label: 'Emergency', icon: ShieldAlert },
         ].map(tab => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${
                    activeTab === tab.id ? 'bg-slate-700 text-white border-b-2 border-rose-500' : 'hover:bg-slate-700/50'
                }`}
             >
                 <tab.icon size={18} />
                 {tab.label}
             </button>
         ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50 p-4 pb-20">
         
         {/* --- TIMELINE TAB --- */}
         {activeTab === 'timeline' && (
             <div className="space-y-4">
                 {/* Happening Now */}
                 {MOCK_DAY_SCHEDULE.map(event => {
                     const status = getEventStatus(event.time, currentTime);
                     if (status === 'completed') return null; // Hide past events to focus on now/next
                     
                     return (
                         <div 
                            key={event.id}
                            className={`p-4 rounded-xl border shadow-sm flex gap-4 transition-all ${
                                status === 'now' 
                                ? 'bg-white border-rose-500 ring-2 ring-rose-100 scale-105' 
                                : 'bg-white/80 border-slate-200 opacity-90'
                            }`}
                         >
                            <div className="text-center min-w-[60px]">
                                <div className={`font-bold text-lg ${status === 'now' ? 'text-rose-600' : 'text-slate-800'}`}>
                                    {event.time}
                                </div>
                                {status === 'now' && (
                                    <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded uppercase">Now</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800">{event.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                    <MapPin size={14} /> {event.location}
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {event.involvedParties.map((p, i) => (
                                        <span key={i} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{p}</span>
                                    ))}
                                </div>
                            </div>
                         </div>
                     );
                 })}
                 
                 {/* End of timeline message */}
                 <div className="text-center py-8 text-slate-400 text-sm">
                     <div className="w-2 h-24 bg-slate-200 mx-auto rounded-full mb-2" />
                     <span>End of scheduled events</span>
                 </div>
             </div>
         )}

         {/* --- CHECKINS TAB --- */}
         {activeTab === 'checkins' && (
             <div className="space-y-4">
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4">
                     <h3 className="font-bold text-slate-800 mb-2">Vendor Status</h3>
                     <div className="flex gap-2 text-sm">
                         <div className="flex-1 bg-emerald-50 text-emerald-700 p-2 rounded text-center border border-emerald-100">
                             <strong>{checkins.filter(c => c.status === 'arrived').length}</strong> Arrived
                         </div>
                         <div className="flex-1 bg-rose-50 text-rose-700 p-2 rounded text-center border border-rose-100">
                             <strong>{checkins.filter(c => c.status === 'late').length}</strong> Late
                         </div>
                     </div>
                 </div>

                 {checkins.map(vendor => (
                     <div key={vendor.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                         <div>
                             <h4 className="font-bold text-slate-800">{vendor.vendorName}</h4>
                             <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{vendor.role}</p>
                             <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                                <Clock size={14} /> Scheduled: {vendor.scheduledTime}
                             </div>
                         </div>
                         <div className="flex flex-col items-end gap-2">
                             <button 
                                onClick={() => handleCheckInToggle(vendor.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors border ${getStatusColor(vendor.status)}`}
                             >
                                 {vendor.status === 'arrived' ? 'Arrived' : 'Mark Arrived'}
                             </button>
                             {vendor.status === 'late' && (
                                 <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                                     <AlertTriangle size={10} /> Running Late
                                 </span>
                             )}
                         </div>
                     </div>
                 ))}
             </div>
         )}

         {/* --- CONTACTS TAB --- */}
         {activeTab === 'contacts' && (
             <div className="space-y-6">
                 <div>
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Key Contacts</h3>
                     <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
                         {[
                             { name: 'Sarah (Bride)', role: 'Couple', phone: '+90 555 123 4567' },
                             { name: 'James (Groom)', role: 'Couple', phone: '+90 555 765 4321' },
                             { name: 'Elif (Maid of Honor)', role: 'Wedding Party', phone: '+90 555 987 6543' },
                             { name: 'Ahmet (Venue Mgr)', role: 'Venue', phone: '+90 212 555 9988' },
                         ].map((contact, i) => (
                             <div key={i} className="p-4 flex justify-between items-center hover:bg-slate-50">
                                 <div>
                                     <div className="font-bold text-slate-800">{contact.name}</div>
                                     <div className="text-xs text-slate-500">{contact.role}</div>
                                 </div>
                                 <div className="flex gap-2">
                                     <button className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200">
                                         <MessageCircle size={18} />
                                     </button>
                                     <button className="p-2 bg-emerald-100 rounded-full text-emerald-600 hover:bg-emerald-200">
                                         <Phone size={18} />
                                     </button>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>

                 <div>
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Vendors</h3>
                     <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
                         {checkins.map(vendor => (
                             <div key={vendor.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                                 <div>
                                     <div className="font-bold text-slate-800">{vendor.vendorName}</div>
                                     <div className="text-xs text-slate-500">{vendor.role}</div>
                                 </div>
                                 <a 
                                    href={`tel:${vendor.contactPhone}`}
                                    className="p-2 bg-emerald-100 rounded-full text-emerald-600 hover:bg-emerald-200"
                                 >
                                     <Phone size={18} />
                                 </a>
                             </div>
                         ))}
                     </div>
                 </div>
             </div>
         )}

         {/* --- EMERGENCY TAB --- */}
         {activeTab === 'emergency' && (
             <div className="space-y-6">
                 {/* Report Button */}
                 <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between">
                     <div>
                         <h3 className="font-bold text-rose-900">Report an Issue</h3>
                         <p className="text-xs text-rose-700">Alert the coordinator immediately</p>
                     </div>
                     <button className="bg-rose-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md shadow-rose-200">
                         Report
                     </button>
                 </div>

                 {/* Guides */}
                 <div>
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Quick Solutions</h3>
                     <div className="space-y-2">
                         {EMERGENCY_GUIDE.map(item => (
                             <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                 <button 
                                    onClick={() => setSelectedIssue(selectedIssue === item.id ? null : item.id)}
                                    className="w-full p-4 flex justify-between items-center text-left hover:bg-slate-50"
                                 >
                                     <span className="font-bold text-slate-800">{item.title}</span>
                                     <ArrowRight size={16} className={`text-slate-400 transition-transform ${selectedIssue === item.id ? 'rotate-90' : ''}`} />
                                 </button>
                                 {selectedIssue === item.id && (
                                     <div className="p-4 bg-slate-50 text-sm text-slate-600 border-t border-slate-100 animate-in slide-in-from-top-2">
                                         {item.solution}
                                     </div>
                                 )}
                             </div>
                         ))}
                     </div>
                 </div>

                 {/* Kit Checklist */}
                 <div>
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Emergency Kit</h3>
                     <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                         <div className="grid grid-cols-2 gap-2">
                             {EMERGENCY_KIT_CHECKLIST.map((item, i) => (
                                 <label key={i} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                     <input type="checkbox" className="rounded text-rose-500 focus:ring-rose-500" />
                                     {item}
                                 </label>
                             ))}
                         </div>
                     </div>
                 </div>
             </div>
         )}

      </div>
      
      {/* Floating Action Button for Wedding Party Chat */}
      <div className="absolute bottom-6 right-6 z-30">
          <button className="w-14 h-14 bg-slate-900 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
              <MessageCircle size={24} />
          </button>
      </div>

    </div>
  );
};
