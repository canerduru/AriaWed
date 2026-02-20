import React from 'react';
import { View } from '../types';
import { LegalFooter } from './LegalFooter';
import { 
  LayoutDashboard, Users, Store, PieChart, UserCircle, Bell, Heart, LogOut, 
  Armchair, CalendarClock, Palette, Globe, Smartphone, Gift, Shield
} from 'lucide-react';

interface LayoutProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  children: React.ReactNode;
  onLogout: () => void;
  userRole?: string;
}

interface NavItem {
  id: View;
  label: string;
  icon: React.ElementType;
  highlight?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, setCurrentView, children, onLogout, userRole = 'bride' }) => {
  
  const coupleNavItems: NavItem[] = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.TIMELINE, label: 'Timeline', icon: CalendarClock },
    { id: View.DESIGN, label: 'Creative Studio', icon: Palette },
    { id: View.WEBSITE, label: 'Wedding Website', icon: Globe },
    { id: View.GUESTS, label: 'Guest List', icon: Users },
    { id: View.SEATING, label: 'Seating', icon: Armchair },
    { id: View.VENDORS, label: 'Vendors', icon: Store },
    { id: View.BUDGET, label: 'Budget', icon: PieChart },
    { id: View.WEDDING_DAY, label: 'Wedding Day Mode', icon: Smartphone, highlight: true },
    { id: View.POST_WEDDING, label: 'Post-Wedding', icon: Gift },
  ];

  const adminNavItems: NavItem[] = [
    { id: View.ADMIN, label: 'Admin Dashboard', icon: Shield },
    { id: View.VENDORS, label: 'Vendor Directory', icon: Store },
    { id: View.WEBSITE, label: 'Site Builder (Test)', icon: Globe },
  ];

  const navItems = userRole === 'admin' ? adminNavItems : coupleNavItems;

  return (
    <div className="flex h-screen bg-rose-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-white border-r border-rose-100 flex flex-col justify-between transition-all duration-300">
        <div>
          <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-rose-100">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-lg ${userRole === 'admin' ? 'bg-slate-800 shadow-slate-300' : 'bg-rose-500 shadow-rose-200'}`}>
              <Heart fill="white" size={20} />
            </div>
            <span className="hidden lg:block ml-3 font-serif text-xl font-bold text-slate-800">
                {userRole === 'admin' ? 'AriaWed Admin' : 'AriaWed'}
            </span>
          </div>

          <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-160px)] scrollbar-hide">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  currentView === item.id 
                    ? 'bg-rose-50 text-rose-600 font-medium' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                } ${item.highlight ? 'ring-1 ring-rose-200 bg-rose-50/50' : ''}`}
              >
                <item.icon size={22} className={currentView === item.id ? 'text-rose-600' : 'text-slate-400 group-hover:text-slate-600'} />
                <span className="hidden lg:block">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-rose-100 space-y-2 bg-white z-10">
           <button className="w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <UserCircle size={22} className="text-slate-400" />
            <span className="hidden lg:block">Profile</span>
          </button>
           <button 
             onClick={onLogout}
             className="w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
            <LogOut size={22} className="text-slate-400" />
            <span className="hidden lg:block">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-rose-100 flex items-center justify-between px-8 z-10 sticky top-0">
          <h1 className="text-xl font-semibold text-slate-800 capitalize font-serif">
            {currentView.toLowerCase().replace('_', ' ').replace('wedding day', 'Day-Of Coordinator')}
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" size={24} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">3</span>
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-800">
                      {userRole === 'admin' ? 'Administrator' : 'Sarah & James'}
                  </p>
                  <p className="text-xs text-slate-400">
                      {userRole === 'admin' ? 'Platform Owner' : 'September 24, 2024'}
                  </p>
               </div>
               <img src="https://picsum.photos/100/100?random=user" alt="Profile" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto flex flex-col min-h-full">
             <div className="flex-1">
                {children}
             </div>
             {/* Legal Footer appended at bottom of main view */}
             <LegalFooter />
          </div>
        </div>
      </main>
    </div>
  );
};