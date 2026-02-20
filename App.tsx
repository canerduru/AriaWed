import React, { useState, Suspense } from 'react';
import { Layout } from './components/Layout';
import { Auth } from './components/Auth';
import { Onboarding } from './components/Onboarding';
import { AriaChat } from './components/AriaChat';
import { CookieBanner } from './components/CookieBanner';
import { View, User } from './types';
import { Loader2 } from 'lucide-react';

// --- LAZY LOADED COMPONENTS FOR PERFORMANCE ---
const Dashboard = React.lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const GuestManager = React.lazy(() => import('./components/GuestManager').then(m => ({ default: m.GuestManager })));
const SeatingChart = React.lazy(() => import('./components/SeatingChart').then(m => ({ default: m.SeatingChart })));
const VendorMarketplace = React.lazy(() => import('./components/VendorMarketplace').then(m => ({ default: m.VendorMarketplace })));
const BudgetTracker = React.lazy(() => import('./components/BudgetTracker').then(m => ({ default: m.BudgetTracker })));
const PlanningTimeline = React.lazy(() => import('./components/PlanningTimeline').then(m => ({ default: m.PlanningTimeline })));
const CreativeStudio = React.lazy(() => import('./components/CreativeStudio').then(m => ({ default: m.CreativeStudio })));
const WeddingWebsiteBuilder = React.lazy(() => import('./components/WeddingWebsiteBuilder').then(m => ({ default: m.WeddingWebsiteBuilder })));
const WeddingDayMode = React.lazy(() => import('./components/WeddingDayMode').then(m => ({ default: m.WeddingDayMode })));
const PostWedding = React.lazy(() => import('./components/PostWedding').then(m => ({ default: m.PostWedding })));
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

const PageLoader = () => (
  <div className="flex items-center justify-center h-full min-h-[400px]">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
      <p className="text-slate-400 font-medium text-sm animate-pulse">Loading experience...</p>
    </div>
  </div>
);

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);

  // Authentication & Onboarding Flow
  if (!user) {
    return (
      <>
        <Auth onLogin={(u) => {
            setUser(u);
            // If admin, skip onboarding and go straight to admin dashboard
            if (u.role === 'admin') {
                setHasOnboarded(true);
                setCurrentView(View.ADMIN);
            }
        }} />
        <CookieBanner />
      </>
    );
  }

  if (!hasOnboarded) {
    return (
      <>
        <Onboarding userRole={user.role} onComplete={() => setHasOnboarded(true)} />
        <CookieBanner />
      </>
    );
  }

  // Main App Flow
  const renderContent = () => {
    return (
      <Suspense fallback={<PageLoader />}>
        {currentView === View.DASHBOARD && <Dashboard />}
        {currentView === View.TIMELINE && <PlanningTimeline />}
        {currentView === View.DESIGN && <CreativeStudio />}
        {currentView === View.WEBSITE && <WeddingWebsiteBuilder />}
        {currentView === View.GUESTS && <GuestManager />}
        {currentView === View.SEATING && <SeatingChart />}
        {currentView === View.VENDORS && <VendorMarketplace />}
        {currentView === View.BUDGET && <BudgetTracker />}
        {currentView === View.WEDDING_DAY && <WeddingDayMode />}
        {currentView === View.POST_WEDDING && <PostWedding />}
        {currentView === View.ADMIN && <AdminDashboard />}
      </Suspense>
    );
  };

  return (
    <Layout 
      currentView={currentView} 
      setCurrentView={setCurrentView}
      onLogout={() => {
        setUser(null);
        setHasOnboarded(false);
      }}
      userRole={user.role}
    >
      {renderContent()}
      <AriaChat currentView={currentView} />
      <CookieBanner />
    </Layout>
  );
}

export default App;