import React, { useState, useMemo } from 'react';
import { 
  Users, UserPlus, Download, Search, Filter, Mail, 
  CheckCircle, XCircle, Clock, Utensils, Baby, ExternalLink,
  ChevronDown, ChevronUp, Edit, Trash2, PieChart
} from 'lucide-react';
import { Guest, Side, GroupType, RsvpStatus } from '../types';
import { MOCK_GUESTS, calculateStats, parseCSV, generateRSVPLink } from '../services/guestService';
import { RSVPPublicPage } from './RSVPPublicPage';

export const GuestManager: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'list' | 'form' | 'rsvp-preview'>('dashboard');
  const [guests, setGuests] = useState<Guest[]>(MOCK_GUESTS);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null); // For edit or RSVP preview
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSide, setFilterSide] = useState<Side | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<RsvpStatus | 'all'>('all');

  const stats = useMemo(() => calculateStats(guests), [guests]);

  const filteredGuests = guests.filter(g => {
    const matchesSearch = g.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          g.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSide = filterSide === 'all' || g.side === filterSide;
    const matchesStatus = filterStatus === 'all' || g.rsvpStatus === filterStatus;
    return matchesSearch && matchesSide && matchesStatus;
  });

  const handleSaveGuest = (guest: Guest) => {
    if (guests.find(g => g.id === guest.id)) {
      setGuests(guests.map(g => g.id === guest.id ? guest : g));
    } else {
      setGuests([...guests, { ...guest, id: Date.now().toString(), rsvpToken: Math.random().toString(36).substr(2, 9) }]);
    }
    setView('list');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this guest?')) {
      setGuests(guests.filter(g => g.id !== id));
    }
  };

  // If viewing RSVP Preview
  if (view === 'rsvp-preview' && selectedGuest) {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
        <div className="p-4 bg-slate-800 text-white flex justify-between items-center sticky top-0">
          <span>Previewing Public RSVP Page for: <strong>{selectedGuest.fullName}</strong></span>
          <button onClick={() => setView('list')} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded">Close Preview</button>
        </div>
        <RSVPPublicPage 
          guest={selectedGuest} 
          onSubmit={(updatedGuest) => {
            handleSaveGuest(updatedGuest);
            setView('list');
          }} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 font-serif">Guest Management</h2>
          <p className="text-slate-500">Manage invitations, track RSVPs, and organize tables.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white border border-slate-200 rounded-lg p-1 flex">
             <button 
                onClick={() => setView('dashboard')}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${view === 'dashboard' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
             >
                Dashboard
             </button>
             <button 
                onClick={() => setView('list')}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${view === 'list' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
             >
                Guest List
             </button>
          </div>
          {view === 'list' && (
            <button 
                onClick={() => { setSelectedGuest(null); setView('form'); }}
                className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-sm shadow-rose-200"
            >
                <UserPlus size={18} />
                <span className="hidden sm:inline">Add Guest</span>
            </button>
          )}
        </div>
      </div>

      {view === 'dashboard' ? (
        <GuestDashboard stats={stats} />
      ) : view === 'list' ? (
        <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search guests..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <select 
                        value={filterSide} 
                        onChange={(e) => setFilterSide(e.target.value as any)}
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-200"
                    >
                        <option value="all">All Sides</option>
                        <option value="bride">Bride Side</option>
                        <option value="groom">Groom Side</option>
                    </select>
                    <select 
                         value={filterStatus} 
                         onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-200"
                    >
                        <option value="all">All Statuses</option>
                        <option value="attending">Attending</option>
                        <option value="pending">Pending</option>
                        <option value="declined">Declined</option>
                    </select>
                    <button className="px-3 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                        <Download size={18} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="p-4">Guest Name</th>
                                <th className="p-4">Side & Group</th>
                                <th className="p-4">RSVP Status</th>
                                <th className="p-4">Meal</th>
                                <th className="p-4">Kids</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredGuests.map(guest => (
                                <tr key={guest.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-4">
                                        <div className="font-medium text-slate-800">{guest.fullName}</div>
                                        <div className="text-xs text-slate-500">{guest.email || 'No email'}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <span className={`px-2 py-0.5 rounded text-xs border ${
                                                guest.side === 'bride' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-blue-50 border-blue-100 text-blue-600'
                                            }`}>
                                                {guest.side === 'bride' ? 'Bride' : 'Groom'}
                                            </span>
                                            <span className="px-2 py-0.5 rounded text-xs bg-slate-100 border border-slate-200 text-slate-600 capitalize">
                                                {guest.group}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                            guest.rsvpStatus === 'attending' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                            guest.rsvpStatus === 'declined' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                                            'bg-amber-50 text-amber-700 border-amber-200'
                                        }`}>
                                            {guest.rsvpStatus === 'attending' && <CheckCircle size={12} />}
                                            {guest.rsvpStatus === 'declined' && <XCircle size={12} />}
                                            {guest.rsvpStatus === 'pending' && <Clock size={12} />}
                                            {guest.rsvpStatus.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 capitalize text-slate-600">
                                        {guest.rsvpStatus === 'attending' ? (guest.mealPreference || '-') : '-'}
                                    </td>
                                    <td className="p-4 text-slate-600">
                                         {guest.childrenCount > 0 ? (
                                            <span className="flex items-center gap-1"><Baby size={14} /> {guest.childrenCount}</span>
                                         ) : '-'}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                title="Preview RSVP Page"
                                                onClick={() => { setSelectedGuest(guest); setView('rsvp-preview'); }}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <ExternalLink size={16} />
                                            </button>
                                            <button 
                                                title="Edit"
                                                onClick={() => { setSelectedGuest(guest); setView('form'); }}
                                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                title="Delete"
                                                onClick={() => handleDelete(guest.id)}
                                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {filteredGuests.length === 0 && (
                     <div className="p-12 text-center text-slate-400">
                         <Users size={48} className="mx-auto mb-4 opacity-30" />
                         <p>No guests match your filters.</p>
                     </div>
                 )}
            </div>
        </div>
      ) : (
        <GuestForm 
            initialData={selectedGuest} 
            onSave={handleSaveGuest} 
            onCancel={() => setView('list')} 
        />
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---

const GuestDashboard: React.FC<{ stats: ReturnType<typeof calculateStats> }> = ({ stats }) => (
    <div className="space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                 <div>
                     <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Total Invited</p>
                     <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
                 </div>
                 <div className="bg-slate-100 p-3 rounded-lg text-slate-500"><Users size={24} /></div>
             </div>
             <div className="bg-white p-5 rounded-xl border border-emerald-100 bg-emerald-50/30 shadow-sm flex items-center justify-between">
                 <div>
                     <p className="text-emerald-600 text-xs font-bold uppercase tracking-wide">Confirmed</p>
                     <p className="text-3xl font-bold text-emerald-700">{stats.attending}</p>
                 </div>
                 <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600"><CheckCircle size={24} /></div>
             </div>
              <div className="bg-white p-5 rounded-xl border border-amber-100 bg-amber-50/30 shadow-sm flex items-center justify-between">
                 <div>
                     <p className="text-amber-600 text-xs font-bold uppercase tracking-wide">Pending</p>
                     <p className="text-3xl font-bold text-amber-700">{stats.pending}</p>
                 </div>
                 <div className="bg-amber-100 p-3 rounded-lg text-amber-600"><Clock size={24} /></div>
             </div>
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                 <div>
                     <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Children</p>
                     <p className="text-3xl font-bold text-slate-800">{stats.childrenTotal}</p>
                 </div>
                 <div className="bg-rose-100 p-3 rounded-lg text-rose-500"><Baby size={24} /></div>
             </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Side Comparison */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6">Guest Distribution</h3>
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-rose-600">Bride Side</span>
                            <span className="text-slate-500">{stats.brideSide.attending} / {stats.brideSide.total} confirmed</span>
                        </div>
                        <div className="w-full h-3 bg-rose-50 rounded-full overflow-hidden">
                             <div 
                                className="h-full bg-rose-500 rounded-full" 
                                style={{ width: `${stats.brideSide.total > 0 ? (stats.brideSide.attending / stats.brideSide.total) * 100 : 0}%` }} 
                             />
                        </div>
                    </div>
                     <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-blue-600">Groom Side</span>
                            <span className="text-slate-500">{stats.groomSide.attending} / {stats.groomSide.total} confirmed</span>
                        </div>
                        <div className="w-full h-3 bg-blue-50 rounded-full overflow-hidden">
                             <div 
                                className="h-full bg-blue-500 rounded-full" 
                                style={{ width: `${stats.groomSide.total > 0 ? (stats.groomSide.attending / stats.groomSide.total) * 100 : 0}%` }} 
                             />
                        </div>
                    </div>
                </div>
            </div>

            {/* Meal Breakdown */}
             <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6">Meal Preferences</h3>
                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(stats.meals).map(([meal, count]) => (
                        <div key={meal} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <div className={`p-2 rounded-full ${(count as number) > 0 ? 'bg-white text-rose-500 shadow-sm' : 'bg-slate-200 text-slate-400'}`}>
                                <Utensils size={16} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">{meal}</p>
                                <p className="font-bold text-slate-800">{count as number}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Reminders Card */}
        <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
             <div>
                 <h3 className="font-bold text-lg">Send RSVP Reminders</h3>
                 <p className="text-slate-300 text-sm">You have {stats.pending} guests who haven't responded yet.</p>
             </div>
             <button className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-rose-900/20">
                 Send Reminder Email
             </button>
        </div>
    </div>
);

const GuestForm: React.FC<{ 
    initialData: Guest | null, 
    onSave: (g: Guest) => void, 
    onCancel: () => void 
}> = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Guest>>(initialData || {
        side: 'bride',
        group: 'family',
        plusOneAllowed: false,
        childrenCount: 0,
        rsvpStatus: 'pending'
    });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 max-w-3xl mx-auto overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800">{initialData ? 'Edit Guest' : 'Add New Guest'}</h3>
                <button onClick={onCancel} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button>
            </div>
            
            <div className="p-8 space-y-6">
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            required
                            value={formData.fullName || ''}
                            onChange={e => setFormData({...formData, fullName: e.target.value})}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-200 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            value={formData.email || ''}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-200 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                        <input 
                            type="tel" 
                            value={formData.phone || ''}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-200 outline-none"
                        />
                    </div>
                </div>

                {/* Classification */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Side</label>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button 
                                onClick={() => setFormData({...formData, side: 'bride'})}
                                className={`flex-1 py-1 text-sm rounded transition-colors ${formData.side === 'bride' ? 'bg-white shadow-sm text-rose-600 font-medium' : 'text-slate-500'}`}
                            >Bride</button>
                            <button 
                                onClick={() => setFormData({...formData, side: 'groom'})}
                                className={`flex-1 py-1 text-sm rounded transition-colors ${formData.side === 'groom' ? 'bg-white shadow-sm text-blue-600 font-medium' : 'text-slate-500'}`}
                            >Groom</button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Group</label>
                        <select 
                            value={formData.group}
                            onChange={e => setFormData({...formData, group: e.target.value as GroupType})}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-200 outline-none bg-white"
                        >
                            <option value="family">Family</option>
                            <option value="friends">Friends</option>
                            <option value="colleagues">Colleagues</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Relationship</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Aunt"
                            value={formData.relationship || ''}
                            onChange={e => setFormData({...formData, relationship: e.target.value})}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-200 outline-none"
                        />
                    </div>
                </div>

                {/* Configuration */}
                <div className="border-t border-slate-100 pt-6">
                     <h4 className="font-bold text-slate-800 mb-4">Invitation Settings</h4>
                     <div className="flex flex-col gap-4">
                        <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                            <input 
                                type="checkbox" 
                                checked={formData.plusOneAllowed}
                                onChange={e => setFormData({...formData, plusOneAllowed: e.target.checked})}
                                className="w-5 h-5 text-rose-500 rounded focus:ring-rose-500"
                            />
                            <div>
                                <span className="block font-medium text-slate-800">Allow Plus One</span>
                                <span className="text-xs text-slate-500">Guest can bring a partner</span>
                            </div>
                        </label>
                         
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                             <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-slate-800 flex items-center gap-2">
                                    <Baby size={18} /> Children Count
                                </span>
                                <input 
                                    type="number" 
                                    min="0"
                                    value={formData.childrenCount}
                                    onChange={e => setFormData({...formData, childrenCount: parseInt(e.target.value)})}
                                    className="w-20 px-2 py-1 border border-slate-300 rounded text-center"
                                />
                             </div>
                             <p className="text-xs text-slate-500">Number of children invited (for seating/kids menu)</p>
                        </div>
                     </div>
                </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                    onClick={onCancel}
                    className="px-6 py-2 text-slate-600 font-medium hover:bg-white hover:text-slate-800 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={() => formData.fullName && onSave(formData as Guest)}
                    disabled={!formData.fullName}
                    className="px-6 py-2 bg-rose-500 text-white font-medium rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                    Save Guest
                </button>
            </div>
        </div>
    );
};