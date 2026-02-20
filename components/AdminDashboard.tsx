import React, { useState } from 'react';
import { 
  Users, Store, BarChart3, Settings, Shield, MessageSquare, 
  Search, Check, X, MoreVertical, DollarSign, TrendingUp, AlertCircle 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { AdminStats, User, VendorProfile, SupportTicket } from '../types';
import { getAdminStats, MOCK_USERS, MOCK_PENDING_VENDORS, MOCK_TICKETS } from '../services/adminService';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'vendors' | 'support' | 'settings'>('overview');
  const stats = getAdminStats();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 font-serif">Admin Dashboard</h2>
          <p className="text-slate-500">Platform overview and management.</p>
        </div>
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex overflow-x-auto max-w-full">
           {[
             { id: 'overview', label: 'Overview', icon: BarChart3 },
             { id: 'users', label: 'Users', icon: Users },
             { id: 'vendors', label: 'Verify Vendors', icon: Shield },
             { id: 'support', label: 'Support', icon: MessageSquare },
             { id: 'settings', label: 'Settings', icon: Settings },
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                 activeTab === tab.id 
                 ? 'bg-slate-800 text-white shadow-md' 
                 : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
               }`}
             >
               <tab.icon size={16} />
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'overview' && <OverviewTab stats={stats} />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'vendors' && <VendorsTab />}
        {activeTab === 'support' && <SupportTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
};

// --- SUB COMPONENTS ---

const OverviewTab: React.FC<{ stats: AdminStats }> = ({ stats }) => {
  const COLORS = ['#e11d48', '#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6">
       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard icon={<TrendingUp className="text-emerald-500" />} label="Total Weddings" value={stats.totalWeddings.toLocaleString()} subtext="+12% this month" />
          <StatCard icon={<Users className="text-blue-500" />} label="Active Users" value={stats.activeUsers.toLocaleString()} subtext="Last 30 days" />
          <StatCard icon={<DollarSign className="text-rose-500" />} label="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} subtext="Subscriptions & Fees" />
          <StatCard icon={<Shield className="text-purple-500" />} label="Pending Vendors" value={stats.pendingVendors.toString()} subtext="Needs verification" />
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Growth Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h3 className="font-bold text-slate-800 mb-6">User Growth</h3>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={stats.userGrowth}>
                      <defs>
                         <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#e11d48" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="users" stroke="#e11d48" fillOpacity={1} fill="url(#colorUsers)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Categories Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h3 className="font-bold text-slate-800 mb-6">Vendor Distribution</h3>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie
                         data={stats.categoryDistribution}
                         innerRadius={60}
                         outerRadius={100}
                         paddingAngle={5}
                         dataKey="value"
                      >
                         {stats.categoryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                   </PieChart>
                </ResponsiveContainer>
             </div>
          </div>
       </div>
    </div>
  );
};

const UsersTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  const toggleBan = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'banned' ? 'active' : 'banned' } : u));
  };

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
       <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">All Users</h3>
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
             />
          </div>
       </div>
       <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium">
             <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-right">Actions</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
             {filtered.map(user => (
                <tr key={user.id} className="hover:bg-slate-50">
                   <td className="p-4">
                      <div className="font-bold text-slate-800">{user.name}</div>
                      <div className="text-slate-500 text-xs">{user.email}</div>
                   </td>
                   <td className="p-4 capitalize">{user.role}</td>
                   <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                         user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                         user.status === 'banned' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                         {user.status}
                      </span>
                   </td>
                   <td className="p-4 text-slate-500">{user.joinedAt}</td>
                   <td className="p-4 text-right">
                      <button 
                        onClick={() => toggleBan(user.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded transition-colors ${
                           user.status === 'banned' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                        }`}
                      >
                         {user.status === 'banned' ? 'Unban' : 'Ban'}
                      </button>
                   </td>
                </tr>
             ))}
          </tbody>
       </table>
    </div>
  );
};

const VendorsTab: React.FC = () => {
  const [pending, setPending] = useState<VendorProfile[]>(MOCK_PENDING_VENDORS);

  const handleVerify = (id: string, approved: boolean) => {
    if (confirm(approved ? "Approve this vendor?" : "Reject this vendor?")) {
      setPending(prev => prev.filter(v => v.id !== id));
    }
  };

  return (
    <div className="space-y-6">
       {pending.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
             <Shield size={48} className="mx-auto text-slate-300 mb-4" />
             <p className="text-slate-500">No pending verifications.</p>
          </div>
       ) : (
          pending.map(vendor => (
             <div key={vendor.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6">
                <img src={vendor.images[0]} alt="Vendor" className="w-full md:w-48 h-32 object-cover rounded-lg" />
                <div className="flex-1">
                   <div className="flex justify-between items-start mb-2">
                      <div>
                         <h3 className="text-xl font-bold text-slate-800">{vendor.businessName}</h3>
                         <span className="text-sm text-slate-500">{vendor.category} • {vendor.city}</span>
                      </div>
                      <div className="text-right">
                         <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Pending Review</span>
                      </div>
                   </div>
                   <p className="text-slate-600 mb-4 text-sm">{vendor.description}</p>
                   
                   <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-500 mb-4 flex gap-4">
                      <span><strong>Price:</strong> {vendor.priceRange}</span>
                      <span><strong>Contact:</strong> {vendor.contactEmail}</span>
                   </div>

                   <div className="flex gap-3">
                      <button 
                        onClick={() => handleVerify(vendor.id, true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 transition-colors"
                      >
                         <Check size={16} /> Approve
                      </button>
                      <button 
                        onClick={() => handleVerify(vendor.id, false)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg font-bold hover:bg-rose-50 transition-colors"
                      >
                         <X size={16} /> Reject
                      </button>
                   </div>
                </div>
             </div>
          ))
       )}
    </div>
  );
};

const SupportTab: React.FC = () => {
  const [tickets] = useState<SupportTicket[]>(MOCK_TICKETS);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
       <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium">
             <tr>
                <th className="p-4">Subject</th>
                <th className="p-4">User</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Action</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
             {tickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-slate-50">
                   <td className="p-4 font-medium text-slate-800">{ticket.subject}</td>
                   <td className="p-4">{ticket.userName}</td>
                   <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                         ticket.priority === 'high' ? 'bg-rose-100 text-rose-700' : 
                         ticket.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                         {ticket.priority}
                      </span>
                   </td>
                   <td className="p-4">
                      <span className={`flex items-center gap-1.5 ${
                         ticket.status === 'open' ? 'text-rose-600 font-bold' : 
                         ticket.status === 'in_progress' ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                         <span className={`w-2 h-2 rounded-full ${
                            ticket.status === 'open' ? 'bg-rose-600' : 
                            ticket.status === 'in_progress' ? 'bg-amber-600' : 'bg-emerald-600'
                         }`} />
                         {ticket.status.replace('_', ' ')}
                      </span>
                   </td>
                   <td className="p-4 text-slate-500">{ticket.createdAt}</td>
                   <td className="p-4 text-right">
                      <button className="text-slate-400 hover:text-slate-800">
                         <MoreVertical size={16} />
                      </button>
                   </td>
                </tr>
             ))}
          </tbody>
       </table>
    </div>
  );
};

const SettingsTab: React.FC = () => (
  <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
     <h3 className="font-bold text-slate-800 mb-6">Platform Settings</h3>
     <div className="space-y-6 max-w-lg">
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-2">Vendor Commission Rate (%)</label>
           <input type="number" defaultValue={10} className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50" />
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-2">Premium Subscription Price ($/month)</label>
           <input type="number" defaultValue={29} className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50" />
        </div>
        <div className="flex items-center justify-between py-4 border-t border-slate-100">
           <div>
              <div className="font-bold text-slate-800">Maintenance Mode</div>
              <div className="text-xs text-slate-500">Disable access for users</div>
           </div>
           <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
           </label>
        </div>
        <button className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition-colors">
           Save Changes
        </button>
     </div>
  </div>
);

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; subtext: string }> = ({ icon, label, value, subtext }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between">
     <div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
        <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
        <p className="text-xs text-slate-400 mt-1">{subtext}</p>
     </div>
     <div className="p-3 bg-slate-50 rounded-xl">
        {icon}
     </div>
  </div>
);
